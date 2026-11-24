import { describe, expect, it } from "vitest";
import { doctors, doctorById, type DoctorId, type LocationId } from "@/data/booking";
import { isValidSlotStart, slotsForDay } from "./slots";
import { sofiaToUtc } from "./sofia-time";

const NOW = sofiaToUtc("2026-11-02", 6 * 60);
function doctor(id: DoctorId) {
  const value = doctorById(id);
  if (!value) throw new Error(`Unknown doctor ${id}`);
  return value;
}
const senior = doctor("cholakov-senior");
const junior = doctor("cholakov-junior");
const simana = doctor("simana-ivanova");

describe("doctor × location schedules", () => {
  const schedules: [DoctorId, LocationId, string, string, string, number][] = [
    ["cholakov-junior", "novi-pazar", "2026-11-02", "08:00", "12:30", 10],
    ["cholakov-junior", "shumen", "2026-11-02", "14:00", "16:00", 5],
    ["cholakov-junior", "novi-pazar", "2026-11-04", "08:00", "12:30", 10],
    ["cholakov-junior", "shumen", "2026-11-04", "14:00", "16:00", 5],
    ["cholakov-junior", "novi-pazar", "2026-11-03", "08:00", "15:30", 16],
    ["cholakov-junior", "novi-pazar", "2026-11-05", "08:00", "15:30", 16],
    ["cholakov-junior", "novi-pazar", "2026-11-06", "08:00", "12:30", 10],
    ["cholakov-senior", "shumen", "2026-11-02", "08:00", "11:00", 7],
    ["cholakov-senior", "novi-pazar", "2026-11-02", "13:00", "15:00", 5],
    ["cholakov-senior", "shumen", "2026-11-04", "08:00", "11:00", 7],
    ["cholakov-senior", "novi-pazar", "2026-11-04", "13:00", "15:00", 5],
    ["cholakov-senior", "shumen", "2026-11-03", "08:00", "16:00", 17],
    ["cholakov-senior", "shumen", "2026-11-05", "12:00", "16:00", 9],
    ["cholakov-senior", "shumen", "2026-11-06", "08:00", "12:00", 9],
    ...["2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05"].map((date): [DoctorId, LocationId, string, string, string, number] => ["simana-ivanova", "shumen", date, "08:00", "16:00", 17]),
    ["simana-ivanova", "shumen", "2026-11-06", "08:00", "12:30", 10],
  ];
  it.each(schedules)("%s at %s on %s: starts %s, last %s, %i slots", (id, location, date, first, last, count) => {
    const slots = slotsForDay(doctor(id), location, date, [], NOW);
    expect(slots[0]?.time).toBe(first);
    expect(slots.at(-1)?.time).toBe(last);
    expect(slots).toHaveLength(count);
    expect(slots.every((s) => s.end - s.start === 30 * 60_000)).toBe(true);
  });
  it.each(["2026-11-03", "2026-11-05", "2026-11-06"])("junior has no Шумен slots on %s", (date) => {
    expect(slotsForDay(junior, "shumen", date, [], NOW)).toEqual([]);
  });
  it.each(["2026-11-03", "2026-11-05", "2026-11-06"])("senior has no Нови Пазар slots on %s", (date) => {
    expect(slotsForDay(senior, "novi-pazar", date, [], NOW)).toEqual([]);
  });
  it("Simana never works at Нови Пазар", () => {
    for (const date of ["2026-11-02", "2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06"]) {
      expect(slotsForDay(simana, "novi-pazar", date, [], NOW)).toEqual([]);
    }
  });
  it("nobody works weekends at either location", () => {
    for (const doc of doctors) for (const loc of ["shumen", "novi-pazar"] as const) for (const date of ["2026-11-07", "2026-11-08"]) {
      expect(slotsForDay(doc, loc, date, [], NOW)).toEqual([]);
    }
  });
  it("uses separate intervals without spanning gaps and keeps the half-hour grid", () => {
    const split = { ...senior, schedule: { ...senior.schedule, shumen: { ...senior.schedule.shumen, 2: [{ open: "08:10", close: "10:00" }, { open: "14:00", close: "15:00" }] } } };
    expect(slotsForDay(split, "shumen", "2026-11-03", [], NOW).map((s) => s.time)).toEqual(["08:30", "09:00", "09:30", "14:00", "14:30"]);
  });
  it("validates the chosen location, not only the doctor and time", () => {
    const start = sofiaToUtc("2026-11-02", 14 * 60);
    expect(isValidSlotStart(junior, "shumen", start, NOW)).toBe(true);
    expect(isValidSlotStart(junior, "novi-pazar", start, NOW)).toBe(false);
  });
});

describe("shared slot rules", () => {
  it("same day requires one hour lead time", () => {
    const now = sofiaToUtc("2026-11-03", 10 * 60 + 10);
    expect(slotsForDay(senior, "shumen", "2026-11-03", [], now)[0]?.time).toBe("11:30");
  });
  it("rejects past slots", () => {
    expect(slotsForDay(senior, "shumen", "2026-11-02", [], sofiaToUtc("2026-11-03", 6 * 60))).toEqual([]);
  });
  it("any busy event blocks the doctor even if created at another location", () => {
    const busy = [{ start: sofiaToUtc("2026-11-02", 14 * 60 + 15), end: sofiaToUtc("2026-11-02", 15 * 60) }];
    const times = slotsForDay(junior, "shumen", "2026-11-02", busy, NOW).map((s) => s.time);
    expect(times).not.toContain("14:00");
    expect(times).not.toContain("14:30");
    expect(times).toContain("15:00");
  });
  it("booking window remains 30 days", () => {
    expect(slotsForDay(senior, "shumen", "2026-12-02", [], NOW).length).toBeGreaterThan(0);
    expect(slotsForDay(senior, "shumen", "2026-12-03", [], NOW)).toEqual([]);
  });
  it("preserves Sofia wall-clock schedules across DST", () => {
    expect(new Date(sofiaToUtc("2026-07-01", 8 * 60)).toISOString()).toBe("2026-07-01T05:00:00.000Z");
    expect(new Date(sofiaToUtc("2026-11-03", 8 * 60)).toISOString()).toBe("2026-11-03T06:00:00.000Z");
    expect(slotsForDay(simana, "shumen", "2026-03-30", [], sofiaToUtc("2026-03-28", 6 * 60))).toHaveLength(17);
    expect(slotsForDay(simana, "shumen", "2026-10-26", [], sofiaToUtc("2026-10-24", 6 * 60))).toHaveLength(17);
  });
});
