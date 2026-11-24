import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { doctors, doctorById, doctorLocationIds, locations, SLOT_MINUTES, type DoctorId, type LocationId } from "@/data/booking";
import { bookingSchema, doctorIdSchema, locationIdSchema } from "@/lib/booking/schema";
import { bookingWindow, datesInRange, isValidSlotStart, slotsForDay, overlaps, type Busy } from "@/lib/booking/slots";
import { addDays, formatLongDate, formatTime, sofiaToUtc } from "@/lib/booking/sofia-time";
import { demoBusy } from "@/lib/booking/demo";

import { bookingConfiguration, type AvailabilityMode } from "@/lib/booking/configuration";
export type { AvailabilityMode } from "@/lib/booking/configuration";
export type DayAvailability = { date: string; doctors: { id: DoctorId; slots: { start: number; time: string }[] }[] };
export type AvailabilityResult = {
  mode: AvailabilityMode;
  from: string;
  to: string;
  days: DayAvailability[];
  doctorIds: DoctorId[];
  locationId: LocationId;
  error?: string;
};

export type BookingResult =
  | { ok: true; booking: { doctorId: DoctorId; locationId: LocationId; start: number; end: number } }
  | { ok: false; code: "SLOT_TAKEN" | "RATE_LIMIT" | "INVALID" | "UNAVAILABLE" | "DEMO"; message: string };

/** Metadata contains no credentials and lets the picker hide unconfigured doctors. */
export const getBookingDoctors = createServerFn({ method: "GET" })
  .handler(async () => {
    const { mode, doctorIds } = bookingConfiguration(process.env);
    return { mode, doctorIds };
  });

export const getAvailability = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) =>
    z.object({ from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), doctorId: doctorIdSchema.optional(), locationId: locationIdSchema }).parse(d),
  )
  .handler(async ({ data }): Promise<AvailabilityResult> => {
    const now = Date.now();
    const win = bookingWindow(now);
    const from = data.from < win.first ? win.first : data.from;
    const to = data.to > win.last ? win.last : data.to;
    const { mode, cals, doctorIds } = bookingConfiguration(process.env);
    const base = { mode, from, to, doctorIds, locationId: data.locationId };
    const relevant = doctors.filter((d) => doctorIds.includes(d.id) && (!data.doctorId || d.id === data.doctorId) && doctorLocationIds(d).includes(data.locationId));
    if (mode === "unavailable") return { ...base, days: [], error: "Онлайн записването временно не е достъпно." };
    if (from > to || !relevant.length) return { ...base, days: [] };

    const busy: Partial<Record<DoctorId, Busy[]>> = {};
    try {
      if (mode === "demo") {
        for (const d of relevant) busy[d.id] = demoBusy(d.id, from, to);
      } else {
        const { readCreds, freeBusy } = await import("@/lib/booking/google.server");
        const creds = readCreds();
        if (!creds) throw new Error("Invalid Google credentials");
        const fb = await freeBusy(creds, relevant.map((d) => cals[d.id]), sofiaToUtc(from, 0), sofiaToUtc(addDays(to, 1), 0));
        for (const d of relevant) {
          const blocks = fb[cals[d.id]];
          if (!blocks) throw new Error("Missing calendar availability");
          busy[d.id] = blocks;
        }
      }
    } catch (e) {
      console.error("getAvailability failed", e);
      return { ...base, days: [], error: "Не успяхме да заредим свободните часове. Моля, опитайте отново." };
    }

    const days = datesInRange(from, to).map((date) => ({
      date,
      doctors: relevant.map((d) => ({
        id: d.id,
        slots: slotsForDay(d, data.locationId, date, busy[d.id] ?? [], now).map((s) => ({ start: s.start, time: s.time })),
      })),
    }));
    return { ...base, days };
  });

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d)
  .handler(async ({ data }): Promise<BookingResult> => {
    const parsed = bookingSchema.safeParse(data);
    if (!parsed.success) return { ok: false, code: "INVALID", message: "Моля, проверете въведените данни." };
    const input = parsed.data;
    const { mode, cals, doctorIds } = bookingConfiguration(process.env);
    if (mode === "demo") return { ok: false, code: "DEMO", message: "Демо режим — записването е изключено." };
    if (mode === "unavailable") return { ok: false, code: "UNAVAILABLE", message: "Онлайн записването временно не е достъпно. Моля, обадете се по телефона." };

    // honeypot: тихо отказваме
    if (input.website) return { ok: false, code: "INVALID", message: "Моля, проверете въведените данни." };

    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const ip = (getRequestHeader("x-forwarded-for") ?? "").split(",")[0].trim() || getRequestHeader("x-real-ip") || "unknown";
    const { allow } = await import("@/lib/booking/rate-limit.server");
    if (!allow(ip)) return { ok: false, code: "RATE_LIMIT", message: "Твърде много опити. Моля, опитайте отново след няколко минути." };

    const doctor = doctorById(input.doctorId);
    if (!doctor || !doctorIds.includes(doctor.id)) {
      return { ok: false, code: "UNAVAILABLE", message: "Този лекар временно не е достъпен за онлайн записване." };
    }
    const now = Date.now();
    if (!isValidSlotStart(doctor, input.locationId, input.start, now)) {
      return { ok: false, code: "SLOT_TAKEN", message: "Този час вече не е наличен. Моля, изберете друг." };
    }
    const slot = { start: input.start, end: input.start + SLOT_MINUTES * 60_000 };
    const loc = locations[input.locationId];
    try {
      const { readCreds, freeBusy, insertEvent } = await import("@/lib/booking/google.server");
      const creds = readCreds();
      if (!creds) throw new Error("Invalid Google credentials");
      const calId = cals[doctor.id];
      const fb = await freeBusy(creds, [calId], slot.start, slot.end);
      const blocks = fb[calId];
      if (!blocks) throw new Error("Missing calendar availability");
      if (blocks.some((b) => overlaps(b, slot))) {
        return { ok: false, code: "SLOT_TAKEN", message: "Този час току-що беше зает. Моля, изберете друг." };
      }
      const description = [
        `Локация: ${loc.city}`,
        `Телефон: ${input.phone}`,
        input.email ? `Имейл: ${input.email}` : null,
        `Пациент: ${input.patient}`,
        `Услуга: ${input.service}`,
        input.note ? `Бележка: ${input.note}` : null,
        "",
        "Записан онлайн през cholakoviclinic.bg",
      ]
        .filter((l) => l !== null)
        .join("\n");
      await insertEvent(creds, calId, {
        summary: `Пациент: ${input.name}`,
        description,
        location: loc.address,
        start: slot.start,
        end: slot.end,
      });
      console.log(`Booking created: ${doctor.id} ${formatLongDate(slot.start)} ${formatTime(slot.start)}`);
      return { ok: true, booking: { doctorId: doctor.id, locationId: input.locationId, start: slot.start, end: slot.end } };
    } catch (e) {
      console.error("createBooking failed", e);
      return { ok: false, code: "UNAVAILABLE", message: "Възникна проблем при записването. Моля, опитайте отново или се обадете по телефона." };
    }
  });
