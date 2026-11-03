import { TIMEZONE } from "@/data/booking";

const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: TIMEZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

/** Дата/час в София за даден момент. */
export function sofiaParts(ms: number) {
  const p: Record<string, string> = {};
  for (const x of fmt.formatToParts(new Date(ms))) p[x.type] = x.value;
  const date = `${p.year}-${p.month}-${p.day}`;
  return {
    date,
    minutes: Number(p.hour) * 60 + Number(p.minute),
    seconds: Number(p.second),
  };
}

function offsetMs(ms: number) {
  const { date, minutes, seconds } = sofiaParts(ms);
  const [y, m, d] = date.split("-").map(Number);
  const asUtc = Date.UTC(y, m - 1, d, 0, minutes, seconds);
  return asUtc - Math.floor(ms / 1000) * 1000;
}

/** Часово време в София ("YYYY-MM-DD" + минути от полунощ) → UTC милисекунди. */
export function sofiaToUtc(date: string, minutes: number): number {
  const [y, m, d] = date.split("-").map(Number);
  const guess = Date.UTC(y, m - 1, d, 0, minutes);
  let result = guess - offsetMs(guess);
  const second = guess - offsetMs(result);
  if (second !== result) result = second;
  return result;
}

export function addDays(date: string, n: number): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10);
}

/** 0 = неделя … 6 = събота */
export function weekdayOf(date: string): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

export const hhmmToMin = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};
export const minToHhmm = (n: number) =>
  `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;

const longDate = new Intl.DateTimeFormat("bg-BG", {
  timeZone: TIMEZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});
export const formatLongDate = (ms: number) => longDate.format(new Date(ms));
export const formatTime = (ms: number) => minToHhmm(sofiaParts(ms).minutes);
