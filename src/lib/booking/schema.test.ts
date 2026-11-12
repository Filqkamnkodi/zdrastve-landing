import { describe, expect, it, vi } from "vitest";

vi.mock("@/assets/doctor-cholakov-senior.webp", () => ({ default: "s" }));
vi.mock("@/assets/doctor-cholakov-junior.webp", () => ({ default: "j" }));

import { bookingServices } from "@/data/booking";
import { patientSchema } from "./schema";

describe("booking service validation", () => {
  const serviceSchema = patientSchema.shape.service;

  it.each(["Имунизация на дете", "Имунизация на възрастен"])("allows booking %s", (service) => {
    expect(serviceSchema.safeParse(service).success).toBe(true);
  });

  it("rejects the replaced generic immunization service", () => {
    expect(serviceSchema.safeParse("Имунизация").success).toBe(false);
  });

  it.each(bookingServices)("accepts configured service %s", (service) => {
    expect(serviceSchema.safeParse(service).success).toBe(true);
  });
});