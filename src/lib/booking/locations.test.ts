import { describe, expect, it, vi } from "vitest";
vi.mock("@/assets/doctor-cholakov-senior.webp", () => ({ default: "s" }));
vi.mock("@/assets/doctor-cholakov-junior.webp", () => ({ default: "j" }));
import { locations } from "@/data/booking";

describe("location phone numbers", () => {
  it("places the Шумен landline after both unchanged mobiles", () => {
    expect(locations.shumen.phones).toEqual(["+359 886 011 166", "+359 885 646 724", "+359 54 876 979"]);
    expect(`tel:${locations.shumen.phones[2].replace(/\s/g, "")}`).toBe("tel:+35954876979");
  });
  it("keeps Нови Пазар phones unchanged without the Шумен landline", () => {
    expect(locations["novi-pazar"].phones).toEqual(["+359 896 600 290", "+359 885 646 724"]);
  });
});