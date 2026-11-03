import {
  BOOKING_WINDOW_DAYS,
  LEAD_TIME_MINUTES,
  SLOT_MINUTES,
  locations,
  type Doctor,
} from "@/data/booking";
import { addDays, hhmmToMin, minToHhmm, sofiaParts, sofiaToUtc, weekdayOf } from "./sofia-time";

export type Busy = { start: number; end: number };
export type Slot = { start: number; end: number; time: string };

/** Първи и последен ден, в който може да се запише час (по София). */
export function bookingWindow(now: number) {
  const first = sofiaParts(now).date;
  return { first, last: addDays(first, BOOKING_WINDOW_DAYS) };
}

export function overlaps(a: Busy, b: Busy) {
  return a.start < b.end && b.start < a.end;
}

/** Всички свободни часове за лекар в конкретен ден. */
export function slotsForDay(doctor: Doctor, date: string, busy: Busy[], now: number): Slot[] {
  const { first, last } = bookingWindow(now);
  if (date < first || date > last) return [];
  const hours = locations[doctor.locationId].hours[weekdayOf(date)];
  if (!hours) return [];
  const open = hhmmToMin(hours.open);
  const close = hhmmToMin(hours.close);
  const earliest = now + LEAD_TIME_MINUTES * 60_000;
  const out: Slot[] = [];
  for (let m = open; m + SLOT_MINUTES <= close; m += SLOT_MINUTES) {
    const start = sofiaToUtc(date, m);
    const end = sofiaToUtc(date, m + SLOT_MINUTES);
    if (start < earliest) continue;
    if (busy.some((b) => overlaps(b, { start, end }))) continue;
    out.push({ start, end, time: minToHhmm(m) });
  }
  return out;
}

/** Проверява дали даден старт е валиден слот (в мрежата, работно време, прозорец). */
export function isValidSlotStart(doctor: Doctor, start: number, now: number) {
  const { date } = sofiaParts(start);
  return slotsForDay(doctor, date, [], now).some((s) => s.start === start);
}

export function datesInRange(from: string, to: string) {
  const out: string[] = [];
  for (let d = from; d <= to; d = addDays(d, 1)) out.push(d);
  return out;
}
