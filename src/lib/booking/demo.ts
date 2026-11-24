import type { DoctorId } from "@/data/booking";
import { datesInRange, type Busy } from "./slots";
import { sofiaToUtc, weekdayOf } from "./sofia-time";

/** Примерна заетост за демо режим (детерминистична, без случайни числа). */
export function demoBusy(doctorId: DoctorId, from: string, to: string): Busy[] {
  const busy: Busy[] = [];
  const shift = doctorId === "cholakov-senior" ? 0 : doctorId === "cholakov-junior" ? 1 : 2;
  for (const date of datesInRange(from, to)) {
    const day = Number(date.slice(8, 10));
    const wd = weekdayOf(date);
    if (wd === 0 || wd === 6) continue;
    // обедна почивка
    busy.push({ start: sofiaToUtc(date, 12 * 60), end: sofiaToUtc(date, 13 * 60) });
    // няколко заети часа
    const a = 8 * 60 + ((day * 3 + shift) % 7) * 30;
    busy.push({ start: sofiaToUtc(date, a), end: sofiaToUtc(date, a + 90) });
    const b = 13 * 60 + ((day + shift * 2) % 5) * 30;
    busy.push({ start: sofiaToUtc(date, b), end: sofiaToUtc(date, b + 60) });
    // напълно зает ден (домашни визити)
    if ((day + shift) % 9 === 0) busy.push({ start: sofiaToUtc(date, 0), end: sofiaToUtc(date, 24 * 60) });
  }
  return busy;
}
