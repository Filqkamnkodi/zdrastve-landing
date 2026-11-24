<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Online booking
- Booking config (doctors, locations, hours, slot rules) lives only in `src/data/booking.ts`; pages read hours/phones from it so they never drift.
- Google Calendar is called from server functions (`src/lib/booking.functions.ts`) via `jose` + `fetch` with a service account — no `googleapis`, no database — so it runs on any edge/Node runtime.
- All wall-clock math goes through `src/lib/booking/sofia-time.ts` (Europe/Sofia via Intl), never the host time zone.
- Doctor schedules are per location with interval arrays, separate from clinic opening hours; one calendar per doctor prevents cross-location conflicts.
- Booking environment selection uses a pure configuration policy: demo includes all doctors and refuses bookings; live mode only exposes doctors with configured calendars, and production never falls back to demo.
- The homepage and standalone booking page reuse BookingWidget and bookingServices; embedded instances disable initial autofocus to preserve page and hash scroll positions.
