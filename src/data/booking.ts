import seniorPhoto from "@/assets/doctor-cholakov-senior.webp";
import juniorPhoto from "@/assets/doctor-cholakov-junior.webp";

/** Всички настройки на онлайн записването са тук. */
export const TIMEZONE = "Europe/Sofia";
export const SLOT_MINUTES = 30;
export const LEAD_TIME_MINUTES = 60;
export const BOOKING_WINDOW_DAYS = 30;

/** Работно време: ключ = ден от седмицата (0 = неделя … 6 = събота). */
export type DayHours = { open: string; close: string } | null;
export type WeeklyHours = Record<0 | 1 | 2 | 3 | 4 | 5 | 6, DayHours>;

export type LocationId = "shumen" | "novi-pazar";

export type Location = {
  id: LocationId;
  name: string;
  city: string;
  address: string;
  phones: string[];
  mapLink: string;
  hours: WeeklyHours;
  /** Текст за показване на работното време. */
  hoursLines: string[];
};

const mt = (open: string, close: string) => ({ open, close });

export const locations: Record<LocationId, Location> = {
  shumen: {
    id: "shumen",
    name: "Клиника Д-р Чолакови - Шумен",
    city: "Шумен",
    address: "ул. „Васил Друмев“ 17, 9700 Шумен",
    phones: ["+359 886 011 166", "+359 885 646 724"],
    mapLink: "https://maps.app.goo.gl/99wj7gqCuKW8s2rA8",
    hours: { 0: null, 1: mt("08:00", "16:30"), 2: mt("08:00", "16:30"), 3: mt("08:00", "16:30"), 4: mt("08:00", "16:30"), 5: mt("08:00", "12:30"), 6: null },
    hoursLines: ["Пон–Четв: 08:00 – 16:30", "Петък: 08:00 – 12:30", "Сб–Нд: почивни дни"],
  },
  "novi-pazar": {
    id: "novi-pazar",
    name: "Клиника Д-р Чолакови - Нови Пазар",
    city: "Нови Пазар",
    address: "ул. „Христо Ботев“ 22, каб. 3 и манипулационна 4, Нови Пазар",
    phones: ["+359 896 600 290", "+359 885 646 724"],
    mapLink: "https://maps.app.goo.gl/6JiNcLeXx1AZzr1g6",
    hours: { 0: null, 1: mt("08:00", "16:00"), 2: mt("08:00", "16:00"), 3: mt("08:00", "16:00"), 4: mt("08:00", "16:00"), 5: mt("08:00", "13:00"), 6: null },
    hoursLines: ["Пон–Четв: 08:00 – 16:00", "Петък: 08:00 – 13:00", "Сб–Нд: почивни дни"],
  },
};

export type DoctorId = "cholakov-senior" | "cholakov-junior";

export type Doctor = {
  id: DoctorId;
  name: string;
  shortName: string;
  photo: string;
  locationId: LocationId;
  /** Име на сървърната променлива с Google Calendar ID. */
  calendarEnv: string;
  /** Цвят на точката в календара (CSS стойност от темата). */
  dot: string;
};

export const doctors: Doctor[] = [
  {
    id: "cholakov-senior",
    name: "Д-р Милен Русев Чолаков",
    shortName: "Д-р М. Р. Чолаков",
    photo: seniorPhoto,
    locationId: "shumen",
    calendarEnv: "GOOGLE_CALENDAR_ID_SHUMEN",
    dot: "var(--primary-deep)",
  },
  {
    id: "cholakov-junior",
    name: "Д-р Милен Миленов Чолаков",
    shortName: "Д-р М. М. Чолаков",
    photo: juniorPhoto,
    locationId: "novi-pazar",
    calendarEnv: "GOOGLE_CALENDAR_ID_NOVI_PAZAR",
    dot: "var(--primary-soft)",
  },
];

export const doctorById = (id: string) => doctors.find((d) => d.id === id);
export const locationOf = (d: Doctor) => locations[d.locationId];
