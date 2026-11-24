import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Exercise the actual handlers with the RPC transport and Google network isolated.
vi.mock("@tanstack/react-start", () => ({
  createServerFn: () => {
    let validate = (input: unknown) => input;
    const builder = {
      inputValidator: (fn: (input: unknown) => unknown) => { validate = fn; return builder; },
      handler: (fn: (input: { data: unknown }) => unknown) => (options?: { data: unknown }) => fn({ data: validate(options?.data) }),
    };
    return builder;
  },
}));
vi.mock("@tanstack/react-start/server", () => ({ getRequestHeader: () => "test-ip" }));
vi.mock("./rate-limit.server", () => ({ allow: () => true }));
vi.mock("./google.server", () => ({
  readCreds: () => ({ email: "test@example.invalid", privateKey: "test-key" }),
  freeBusy: vi.fn(async (_credentials: unknown, ids: string[]) => Object.fromEntries(ids.map((id) => [id, []]))),
  insertEvent: vi.fn(async () => ({ id: "test-event" })),
}));

import { getAvailability, getBookingDoctors, createBooking } from "../booking.functions";
import { freeBusy, insertEvent } from "./google.server";
import { sofiaToUtc } from "./sofia-time";
import { locations, type DoctorId, type LocationId } from "@/data/booking";

const NOW = sofiaToUtc("2026-11-02", 6 * 60);
const patient = { name: "Test Patient", phone: "+359000000000", email: "", patient: "Възрастен", service: "Консултация", website: "", note: "" };
const availabilityRange = { from: "2026-11-02", to: "2026-11-02" };

beforeEach(() => {
  vi.spyOn(Date, "now").mockReturnValue(NOW);
  vi.stubEnv("VERCEL_ENV", "production");
  vi.stubEnv("BOOKING_DEMO_MODE", "");
  vi.stubEnv("GOOGLE_SERVICE_ACCOUNT_EMAIL", "test@example.invalid");
  vi.stubEnv("GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY", "test-key");
  vi.stubEnv("GOOGLE_CALENDAR_ID_SHUMEN", "senior-calendar");
  vi.stubEnv("GOOGLE_CALENDAR_ID_NOVI_PAZAR", "junior-calendar");
  vi.stubEnv("GOOGLE_CALENDAR_ID_SIMANA", "simana-calendar");
  vi.mocked(freeBusy).mockImplementation(async (_credentials, ids) => Object.fromEntries(ids.map((id) => [id, []])));
  vi.mocked(freeBusy).mockClear();
  vi.mocked(insertEvent).mockClear();
});
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllEnvs(); });

describe("location-aware server booking", () => {
  const cases: [DoctorId, LocationId, number, string][] = [
    ["cholakov-senior", "shumen", 8 * 60, "senior-calendar"],
    ["cholakov-senior", "novi-pazar", 13 * 60, "senior-calendar"],
    ["cholakov-junior", "novi-pazar", 8 * 60, "junior-calendar"],
    ["cholakov-junior", "shumen", 14 * 60, "junior-calendar"],
    ["simana-ivanova", "shumen", 8 * 60, "simana-calendar"],
  ];
  it.each(cases)("books %s at %s using minute %i and calendar %s", async (doctorId, locationId, minute, calendar) => {
    const start = sofiaToUtc("2026-11-02", minute);
    const result = await createBooking({ data: { ...patient, doctorId, locationId, start } });
    expect(result).toEqual({ ok: true, booking: { doctorId, locationId, start, end: start + 30 * 60_000 } });
    expect(freeBusy).toHaveBeenCalledWith(expect.any(Object), [calendar], start, start + 30 * 60_000);
    expect(insertEvent).toHaveBeenCalledWith(expect.any(Object), calendar, expect.objectContaining({ location: locations[locationId].address, description: expect.stringContaining(`Локация: ${locations[locationId].city}`) }));
    expect(vi.mocked(insertEvent).mock.calls[0]?.[2]).not.toHaveProperty("attendees");
  });
  it("requires a location and rejects unknown doctor or location IDs", async () => {
    const input = { ...patient, doctorId: "cholakov-junior", start: sofiaToUtc("2026-11-02", 14 * 60) };
    expect(await createBooking({ data: input })).toMatchObject({ ok: false, code: "INVALID" });
    expect(await createBooking({ data: { ...input, locationId: "invalid" } })).toMatchObject({ ok: false, code: "INVALID" });
    expect(await createBooking({ data: { ...input, locationId: "shumen", doctorId: "invalid" } })).toMatchObject({ ok: false, code: "INVALID" });
    expect(insertEvent).not.toHaveBeenCalled();
  });
  it("rejects a valid doctor time at the wrong location", async () => {
    const result = await createBooking({ data: { ...patient, doctorId: "cholakov-junior", locationId: "novi-pazar", start: sofiaToUtc("2026-11-02", 14 * 60) } });
    expect(result).toMatchObject({ ok: false, code: "SLOT_TAKEN" });
    expect(freeBusy).not.toHaveBeenCalled();
    expect(insertEvent).not.toHaveBeenCalled();
  });
  it("rejects a conflict on the doctor's one calendar before inserting", async () => {
    const start = sofiaToUtc("2026-11-02", 14 * 60);
    vi.mocked(freeBusy).mockResolvedValue({ "junior-calendar": [{ start, end: start + 30 * 60_000 }] });
    expect(await createBooking({ data: { ...patient, doctorId: "cholakov-junior", locationId: "shumen", start } })).toMatchObject({ ok: false, code: "SLOT_TAKEN" });
    expect(insertEvent).not.toHaveBeenCalled();
  });
  it("rejects booking an unconfigured doctor without disabling the other doctors", async () => {
    vi.stubEnv("GOOGLE_CALENDAR_ID_SIMANA", "");
    expect(await getBookingDoctors()).toEqual({ mode: "live", doctorIds: ["cholakov-senior", "cholakov-junior"] });
    expect(await createBooking({ data: { ...patient, doctorId: "simana-ivanova", locationId: "shumen", start: sofiaToUtc("2026-11-02", 8 * 60) } })).toMatchObject({ ok: false, code: "UNAVAILABLE" });
    expect(insertEvent).not.toHaveBeenCalled();
  });
  it("demo refuses all bookings", async () => {
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("BOOKING_DEMO_MODE", "1");
    expect((await getBookingDoctors()).doctorIds).toHaveLength(3);
    expect(await createBooking({ data: { ...patient, doctorId: "simana-ivanova", locationId: "shumen", start: sofiaToUtc("2026-11-02", 8 * 60) } })).toMatchObject({ ok: false, code: "DEMO" });
    expect(insertEvent).not.toHaveBeenCalled();
  });
});

describe("doctor/location availability", () => {
  it("selected doctor/location queries just that doctor's calendar and schedule", async () => {
    const result = await getAvailability({ data: { ...availabilityRange, doctorId: "cholakov-junior", locationId: "shumen" } });
    expect(freeBusy).toHaveBeenCalledWith(expect.any(Object), ["junior-calendar"], expect.any(Number), expect.any(Number));
    expect(result.days[0]?.doctors).toEqual([{ id: "cholakov-junior", slots: ["14:00", "14:30", "15:00", "15:30", "16:00"].map((time, index) => ({ time, start: sofiaToUtc("2026-11-02", 14 * 60 + index * 30) })) }]);
  });
  it("earliest-at-location omits Simana from Нови Пазар and uses only relevant calendars", async () => {
    const result = await getAvailability({ data: { ...availabilityRange, locationId: "novi-pazar" } });
    expect(freeBusy).toHaveBeenCalledWith(expect.any(Object), ["senior-calendar", "junior-calendar"], expect.any(Number), expect.any(Number));
    expect(result.days[0]?.doctors.map((d) => d.id)).toEqual(["cholakov-senior", "cholakov-junior"]);
  });
  it("busy calendar entries block availability regardless of their location", async () => {
    const start = sofiaToUtc("2026-11-02", 14 * 60);
    vi.mocked(freeBusy).mockResolvedValue({ "junior-calendar": [{ start, end: start + 30 * 60_000 }] });
    const result = await getAvailability({ data: { ...availabilityRange, doctorId: "cholakov-junior", locationId: "shumen" } });
    expect(result.days[0]?.doctors[0]?.slots.map((s) => s.time)).toEqual(["14:30", "15:00", "15:30", "16:00"]);
  });
  it("unconfigured doctors are not queried or included in availability", async () => {
    vi.stubEnv("GOOGLE_CALENDAR_ID_SIMANA", "");
    const result = await getAvailability({ data: { ...availabilityRange, locationId: "shumen" } });
    expect(result.doctorIds).toEqual(["cholakov-senior", "cholakov-junior"]);
    expect(freeBusy).toHaveBeenCalledWith(expect.any(Object), ["senior-calendar", "junior-calendar"], expect.any(Number), expect.any(Number));
    expect(result.days[0]?.doctors.map((d) => d.id)).toEqual(["cholakov-senior", "cholakov-junior"]);
  });
});
