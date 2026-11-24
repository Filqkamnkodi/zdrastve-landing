import seniorPhoto from "@/assets/doctor-cholakov-senior.webp";
import juniorPhoto from "@/assets/doctor-cholakov-junior.webp";
import simanaPhoto from "@/assets/doctor-simana-ivanova.webp";

/** Всички настройки на онлайн записването са тук. */
export const TIMEZONE = "Europe/Sofia";
export const SLOT_MINUTES = 30;
export const LEAD_TIME_MINUTES = 60;
export const BOOKING_WINDOW_DAYS = 30;

/** Работно време: ключ = ден от седмицата (0 = неделя … 6 = събота). */
export type WorkingInterval = { open: string; close: string };
export type DayHours = WorkingInterval[] | null;
export type WeeklyHours = Record<0 | 1 | 2 | 3 | 4 | 5 | 6, DayHours>;

export type LocationId = "shumen" | "novi-pazar";

export type Location = {
  id: LocationId;
  name: string;
  city: string;
  address: string;
  phones: string[];
  mapLink: string;
  hours: Record<0 | 1 | 2 | 3 | 4 | 5 | 6, WorkingInterval | null>;
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
    phones: ["+359 886 011 166", "+359 885 646 724", "+359 54 876 979"],
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

export type DoctorId = "cholakov-senior" | "cholakov-junior" | "simana-ivanova";

export type Doctor = {
  id: DoctorId;
  name: string;
  shortName: string;
  photo: string;
  schedule: Record<LocationId, WeeklyHours>;
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
    schedule: {
      shumen: { 0: null, 1: [mt("08:00", "11:30")], 2: [mt("08:00", "16:30")], 3: [mt("08:00", "11:30")], 4: [mt("12:00", "16:30")], 5: [mt("08:00", "12:30")], 6: null },
      "novi-pazar": { 0: null, 1: [mt("13:00", "15:30")], 2: null, 3: [mt("13:00", "15:30")], 4: null, 5: null, 6: null },
    },
    // Historical env names now identify this doctor's calendar, at BOTH locations.
    calendarEnv: "GOOGLE_CALENDAR_ID_SHUMEN",
    dot: "var(--primary-deep)",
  },
  {
    id: "cholakov-junior",
    name: "Д-р Милен Миленов Чолаков",
    shortName: "Д-р М. М. Чолаков",
    photo: juniorPhoto,
    schedule: {
      shumen: { 0: null, 1: [mt("14:00", "16:30")], 2: null, 3: [mt("14:00", "16:30")], 4: null, 5: null, 6: null },
      "novi-pazar": { 0: null, 1: [mt("08:00", "13:00")], 2: [mt("08:00", "16:00")], 3: [mt("08:00", "13:00")], 4: [mt("08:00", "16:00")], 5: [mt("08:00", "13:00")], 6: null },
    },
    // Historical env name: this doctor's calendar, not a location calendar.
    calendarEnv: "GOOGLE_CALENDAR_ID_NOVI_PAZAR",
    dot: "var(--primary-soft)",
  },
  {
    id: "simana-ivanova",
    name: "Д-р Симана Иванова",
    shortName: "Д-р С. Иванова",
    photo: simanaPhoto,
    schedule: {
      shumen: { 0: null, 1: [mt("08:00", "16:30")], 2: [mt("08:00", "16:30")], 3: [mt("08:00", "16:30")], 4: [mt("08:00", "16:30")], 5: [mt("08:00", "13:00")], 6: null },
      "novi-pazar": { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null },
    },
    calendarEnv: "GOOGLE_CALENDAR_ID_SIMANA",
    dot: "var(--destructive)",
  },
];

export const doctorById = (id: string) => doctors.find((d) => d.id === id);
export const doctorLocationIds = (d: Doctor): LocationId[] =>
  Object.values(locations).filter((loc) => Object.values(d.schedule[loc.id]).some((intervals) => intervals && intervals.length > 0)).map((loc) => loc.id);

/** Services selectable in the online booking form (all use the standard slot length). */
export const bookingServices = [
  "ОПЛ и Спешна помощ",
  "Издаване на удостоверения за детски добавки и социални помощи",
  "Издаване на сертификат за ваксинация срещу КОВИД-19",
  "Медицинско свидетелство за управление на МПС",
  "Медицинско свидетелство за брак",
  "Издаване на мед. документ",
  "Домашни визитации",
  "Имунизация на дете",
  "Имунизация на възрастен",
  "Консултация за пътуване в чужбина",
  "Консултация",
  "Изписване на лекарства по НЗОК",
  "Детска консултация",
  "Друго",
] as const;
