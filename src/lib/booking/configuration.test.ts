import { describe, expect, it } from "vitest";
import { bookingConfiguration } from "./configuration";
const credentials = { GOOGLE_SERVICE_ACCOUNT_EMAIL: "test@example.invalid", GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: "test-key" };
const calendars = { GOOGLE_CALENDAR_ID_SHUMEN: "senior", GOOGLE_CALENDAR_ID_NOVI_PAZAR: "junior", GOOGLE_CALENDAR_ID_SIMANA: "simana" };

describe("calendar configuration", () => {
  it("demo includes all three doctors", () => {
    expect(bookingConfiguration({})).toMatchObject({ mode: "demo", doctorIds: ["cholakov-senior", "cholakov-junior", "simana-ivanova"] });
  });
  it.each([
    ["GOOGLE_CALENDAR_ID_SHUMEN", "cholakov-senior"],
    ["GOOGLE_CALENDAR_ID_NOVI_PAZAR", "cholakov-junior"],
    ["GOOGLE_CALENDAR_ID_SIMANA", "simana-ivanova"],
  ])("production missing %s hides only %s", (envName, id) => {
    const result = bookingConfiguration({ ...credentials, ...calendars, VERCEL_ENV: "production", [envName]: "" });
    expect(result.mode).toBe("live");
    expect(result.doctorIds).toHaveLength(2);
    expect(result.doctorIds).not.toContain(id);
  });
  it("preserves the historical doctor calendar mappings", () => {
    expect(bookingConfiguration({ ...credentials, ...calendars }).cals).toEqual({ "cholakov-senior": "senior", "cholakov-junior": "junior", "simana-ivanova": "simana" });
  });
  it("production never falls back to demo or accepts forced demo", () => {
    expect(bookingConfiguration({ VERCEL_ENV: "production", BOOKING_DEMO_MODE: "1" })).toMatchObject({ mode: "unavailable", doctorIds: [] });
    expect(bookingConfiguration({ ...credentials, ...calendars, VERCEL_ENV: "production", BOOKING_DEMO_MODE: "1" }).mode).toBe("live");
  });
});
