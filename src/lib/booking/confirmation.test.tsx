import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { locations } from "@/data/booking";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { buildIcs, type CalEvent } from "./ics";

// Capture the real event used for both export controls without testing page markup.
const events: CalEvent[] = [];
vi.mock("./ics", async (importOriginal) => {
  const real = await importOriginal<typeof import("./ics")>();
  return { ...real, googleCalendarLink: (event: CalEvent) => { events.push(event); return real.googleCalendarLink(event); } };
});

describe("chosen location in confirmation and calendar exports", () => {
  it.each(["shumen", "novi-pazar"] as const)("uses %s for the same doctor's confirmation, Google link and ICS", (locationId) => {
    events.length = 0;
    const markup = renderToStaticMarkup(<BookingConfirmation booking={{ doctorId: "cholakov-junior", locationId, start: 1793613600000, end: 1793615400000 }} onNew={() => {}} />);
    const address = locations[locationId].address;
    const event = events[0];
    if (!event) throw new Error("No confirmation event generated");
    expect(event.location).toBe(address);
    expect(event.details).toContain(address);
    expect(markup).toContain(address);
    const link = markup.match(/href="(https:\/\/calendar.google.com\/calendar\/render\?[^\"]+)"/)?.[1];
    if (!link) throw new Error("Missing Google Calendar export");
    expect(new URL(link.replace(/&amp;/g, "&")).searchParams.get("location")).toBe(address);
    expect(buildIcs(event)).toContain(`LOCATION:${address.replace(/,/g, "\\,")}`);
  });
});
