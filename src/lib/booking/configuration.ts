import { doctors, type DoctorId } from "@/data/booking";

export type AvailabilityMode = "live" | "demo" | "unavailable";

/** Pure configuration policy; only server handlers supply environment values. */
export function bookingConfiguration(env: Record<string, string | undefined>) {
  const production = env["VERCEL_ENV"] === "production";
  const cals = Object.fromEntries(doctors.map((d) => [d.id, env[d.calendarEnv]?.trim() ?? ""])) as Record<DoctorId, string>;
  const configuredIds = doctors.filter((d) => cals[d.id]).map((d) => d.id);
  const credentials = Boolean(env["GOOGLE_SERVICE_ACCOUNT_EMAIL"] && env["GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY"]);
  const mode: AvailabilityMode = !production && env["BOOKING_DEMO_MODE"] === "1"
    ? "demo"
    : credentials && configuredIds.length > 0 ? "live" : production ? "unavailable" : "demo";
  const doctorIds = mode === "demo" ? doctors.map((d) => d.id) : mode === "live" ? configuredIds : [];
  return { mode, cals, doctorIds };
}