import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { doctors, doctorById, locationOf, type DoctorId } from "@/data/booking";
import { bookingSchema } from "@/lib/booking/schema";
import { bookingWindow, datesInRange, isValidSlotStart, slotsForDay, overlaps, type Busy } from "@/lib/booking/slots";
import { addDays, formatLongDate, formatTime, sofiaToUtc } from "@/lib/booking/sofia-time";
import { demoBusy } from "@/lib/booking/demo";

export type AvailabilityMode = "live" | "demo" | "unavailable";
export type DayAvailability = { date: string; doctors: { id: DoctorId; slots: { start: number; time: string }[] }[] };
export type AvailabilityResult = {
  mode: AvailabilityMode;
  from: string;
  to: string;
  days: DayAvailability[];
  error?: string;
};

export type BookingResult =
  | { ok: true; booking: { doctorId: DoctorId; start: number; end: number } }
  | { ok: false; code: "SLOT_TAKEN" | "RATE_LIMIT" | "INVALID" | "UNAVAILABLE" | "DEMO"; message: string };

function config() {
  const isProd = process.env["VERCEL_ENV"] === "production";
  const forceDemo = process.env["BOOKING_DEMO_MODE"] === "1";
  const email = process.env["GOOGLE_SERVICE_ACCOUNT_EMAIL"];
  const key = process.env["GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY"];
  const cals = Object.fromEntries(doctors.map((d) => [d.id, process.env[d.calendarEnv] ?? ""])) as Record<DoctorId, string>;
  const complete = !!email && !!key && doctors.every((d) => cals[d.id]);
  const mode: AvailabilityMode = forceDemo && !isProd ? "demo" : complete ? "live" : isProd ? "unavailable" : "demo";
  return { mode, cals };
}

export const getAvailability = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) =>
    z.object({ from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/) }).parse(d),
  )
  .handler(async ({ data }): Promise<AvailabilityResult> => {
    const now = Date.now();
    const win = bookingWindow(now);
    const from = data.from < win.first ? win.first : data.from;
    const to = data.to > win.last ? win.last : data.to;
    const { mode, cals } = config();
    if (mode === "unavailable") return { mode, from, to, days: [], error: "Онлайн записването временно не е достъпно." };
    if (from > to) return { mode, from, to, days: [] };

    let busy: Record<DoctorId, Busy[]>;
    try {
      if (mode === "demo") {
        busy = { "cholakov-senior": demoBusy("cholakov-senior", from, to), "cholakov-junior": demoBusy("cholakov-junior", from, to) };
      } else {
        const { readCreds, freeBusy } = await import("@/lib/booking/google.server");
        const creds = readCreds();
        if (!creds) throw new Error("Invalid Google credentials");
        const fb = await freeBusy(creds, Object.values(cals), sofiaToUtc(from, 0), sofiaToUtc(addDays(to, 1), 0));
        busy = { "cholakov-senior": fb[cals["cholakov-senior"]], "cholakov-junior": fb[cals["cholakov-junior"]] };
      }
    } catch (e) {
      console.error("getAvailability failed", e);
      return { mode, from, to, days: [], error: "Не успяхме да заредим свободните часове. Моля, опитайте отново." };
    }

    const days = datesInRange(from, to).map((date) => ({
      date,
      doctors: doctors.map((d) => ({
        id: d.id,
        slots: slotsForDay(d, date, busy[d.id], now).map((s) => ({ start: s.start, time: s.time })),
      })),
    }));
    return { mode, from, to, days };
  });

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => d)
  .handler(async ({ data }): Promise<BookingResult> => {
    const parsed = bookingSchema.safeParse(data);
    if (!parsed.success) return { ok: false, code: "INVALID", message: "Моля, проверете въведените данни." };
    const input = parsed.data;
    const { mode, cals } = config();
    if (mode === "demo") return { ok: false, code: "DEMO", message: "Демо режим — записването е изключено." };
    if (mode === "unavailable") return { ok: false, code: "UNAVAILABLE", message: "Онлайн записването временно не е достъпно. Моля, обадете се по телефона." };

    // honeypot: тихо отказваме
    if (input.website) return { ok: false, code: "INVALID", message: "Моля, проверете въведените данни." };

    const { getRequestHeader } = await import("@tanstack/react-start/server");
    const ip = (getRequestHeader("x-forwarded-for") ?? "").split(",")[0].trim() || getRequestHeader("x-real-ip") || "unknown";
    const { allow } = await import("@/lib/booking/rate-limit.server");
    if (!allow(ip)) return { ok: false, code: "RATE_LIMIT", message: "Твърде много опити. Моля, опитайте отново след няколко минути." };

    const doctor = doctorById(input.doctorId)!;
    const now = Date.now();
    if (!isValidSlotStart(doctor, input.start, now)) {
      return { ok: false, code: "SLOT_TAKEN", message: "Този час вече не е наличен. Моля, изберете друг." };
    }
    const slot = { start: input.start, end: input.start + 30 * 60_000 };
    const loc = locationOf(doctor);
    try {
      const { readCreds, freeBusy, insertEvent } = await import("@/lib/booking/google.server");
      const creds = readCreds();
      if (!creds) throw new Error("Invalid Google credentials");
      const calId = cals[doctor.id];
      const fb = await freeBusy(creds, [calId], slot.start, slot.end);
      if (fb[calId].some((b) => overlaps(b, slot))) {
        return { ok: false, code: "SLOT_TAKEN", message: "Този час току-що беше зает. Моля, изберете друг." };
      }
      const description = [
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
      return { ok: true, booking: { doctorId: doctor.id, start: slot.start, end: slot.end } };
    } catch (e) {
      console.error("createBooking failed", e);
      return { ok: false, code: "UNAVAILABLE", message: "Възникна проблем при записването. Моля, опитайте отново или се обадете по телефона." };
    }
  });
