import { z } from "zod";
import { bookingServices, doctorById, type DoctorId } from "@/data/booking";

export const doctorIdSchema = z.custom<DoctorId>((value) => typeof value === "string" && Boolean(doctorById(value)));
export const locationIdSchema = z.enum(["shumen", "novi-pazar"]);

export const patientSchema = z.object({
  name: z.string().trim().min(2, "Моля, въведете име и фамилия.").max(100, "Името е твърде дълго."),
  phone: z
    .string()
    .trim()
    .min(6, "Моля, въведете валиден телефонен номер.")
    .max(30, "Телефонният номер е твърде дълъг.")
    .regex(/^[0-9+()\s-]+$/, "Телефонният номер съдържа непозволени символи."),
  email: z.union([z.string().trim().email("Моля, въведете валиден имейл адрес.").max(255), z.literal("")]),
  patient: z.enum(["Възрастен", "Дете"], { errorMap: () => ({ message: "Моля, изберете пациент." }) }),
  service: z.string().trim().refine((v) => (bookingServices as readonly string[]).includes(v), "Моля, изберете медицинска услуга."),
  note: z.string().trim().max(300, "Бележката е твърде дълга (до 300 символа).").optional().default(""),
});

export const bookingSchema = patientSchema.extend({
  doctorId: doctorIdSchema,
  locationId: locationIdSchema,
  start: z.number().int().positive(),
  website: z.string().max(200).optional().default(""), // honeypot
});

export type BookingInput = z.input<typeof bookingSchema>;
