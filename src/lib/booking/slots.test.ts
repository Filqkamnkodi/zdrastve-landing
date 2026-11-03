import { describe, expect, it, vi } from "vitest";
vi.mock("@/assets/doctor-cholakov-senior.webp", () => ({ default: "s" }));
vi.mock("@/assets/doctor-cholakov-junior.webp", () => ({ default: "j" }));
import { doctorById } from "@/data/booking";
import { slotsForDay } from "./slots";
import { sofiaToUtc } from "./sofia-time";

const senior = doctorById("cholakov-senior")!;
const junior = doctorById("cholakov-junior")!;
// "сега" = понеделник 2 ноември 2026, 06:00 София
const NOW = sofiaToUtc("2026-11-02", 6 * 60);

describe("slot rules", () => {
  it("Шумен Mon–Thu: last slot 16:00 (ends 16:30)", () => {
    const s = slotsForDay(senior, "2026-11-03", [], NOW);
    expect(s[0].time).toBe("08:00");
    expect(s.at(-1)!.time).toBe("16:00");
    expect(s).toHaveLength(17);
  });
  it("Шумен Friday: last slot 12:00 (ends 12:30)", () => {
    expect(slotsForDay(senior, "2026-11-06", [], NOW).at(-1)!.time).toBe("12:00");
  });
  it("Нови Пазар Mon–Thu ends 16:00, Friday ends 13:00", () => {
    expect(slotsForDay(junior, "2026-11-03", [], NOW).at(-1)!.time).toBe("15:30");
    expect(slotsForDay(junior, "2026-11-06", [], NOW).at(-1)!.time).toBe("12:30");
  });
  it("no slots on weekends", () => {
    expect(slotsForDay(senior, "2026-11-07", [], NOW)).toHaveLength(0);
    expect(slotsForDay(junior, "2026-11-08", [], NOW)).toHaveLength(0);
  });
  it("same day requires 1 hour lead time", () => {
    const now = sofiaToUtc("2026-11-02", 10 * 60 + 10);
    expect(slotsForDay(senior, "2026-11-02", [], now)[0].time).toBe("11:30");
  });
  it("busy event removes overlapping slots", () => {
    const busy = [{ start: sofiaToUtc("2026-11-03", 12 * 60 + 15), end: sofiaToUtc("2026-11-03", 13 * 60) }];
    const times = slotsForDay(senior, "2026-11-03", busy, NOW).map((s) => s.time);
    expect(times).not.toContain("12:00");
    expect(times).not.toContain("12:30");
    expect(times).toContain("11:30");
    expect(times).toContain("13:00");
  });
  it("booking window is 30 days", () => {
    expect(slotsForDay(senior, "2026-12-02", [], NOW).length).toBeGreaterThan(0);
    expect(slotsForDay(senior, "2026-12-03", [], NOW)).toHaveLength(0);
  });
  it("Sofia offset correct across DST", () => {
    expect(new Date(sofiaToUtc("2026-07-01", 8 * 60)).toISOString()).toBe("2026-07-01T05:00:00.000Z");
    expect(new Date(sofiaToUtc("2026-11-03", 8 * 60)).toISOString()).toBe("2026-11-03T06:00:00.000Z");
    // Monday after spring-forward / fall-back keep full schedule
    const springNow = sofiaToUtc("2026-03-28", 6 * 60);
    expect(slotsForDay(senior, "2026-03-30", [], springNow)).toHaveLength(17);
    const fallNow = sofiaToUtc("2026-10-24", 6 * 60);
    expect(slotsForDay(senior, "2026-10-26", [], fallNow)).toHaveLength(17);
  });
});
