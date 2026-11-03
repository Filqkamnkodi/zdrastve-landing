# Online booking on /zapazi-chas, connected to Google Calendar

## Goal
Replace the current request form with a 3-step booking widget: **1. Лекар и час → 2. Вашите данни → 3. Готово**. Real free slots come from each doctor's Google Calendar, and a booking writes an event into that calendar right away. There is no database and no Lovable Cloud.

## Things to fix first
- **/kontakti hours are wrong.** That page shows one schedule for both locations (Mon–Thu 08:00–16:00, Fri 08:30–13:00). The home page has the correct per-location hours. /kontakti will show two blocks, Шумен and Нови Пазар, read from the same config file so the pages can't drift apart again.
- **Phones.** /kontakti doesn't list the Нови Пазар phone (+359 896 600 290). It will be added next to that location.
- **Deploy target.** Right now the project builds for Cloudflare by default. Deploying to Vercel needs the Vercel build preset in the Vite config. This has to be checked on the first Vercel deploy (see Risks).
- Both doctor photos are already in the project: `doctor-cholakov-senior.webp` and `doctor-cholakov-junior.webp`.

## Booking rules (all in one config file, `src/data/booking.ts`)
- Doctors: id, name, photo, location id, calendar env var name, weekly hours.
  - Senior → Шумен, ул. „Васил Друмев" 17. Mon–Thu 08:00–16:30, Fri 08:00–12:30.
  - Junior → Нови Пазар, ул. „Христо Ботев" 22. Mon–Thu 08:00–16:00, Fri 08:00–13:00.
- Locations: name, address, phones, Google Maps link.
- `SLOT_MINUTES = 30`, `LEAD_TIME_MINUTES = 60`, `BOOKING_WINDOW_DAYS = 30`, `TIMEZONE = "Europe/Sofia"`.
- Slots start on the hour and half hour, and the last slot must end by closing time (16:00–16:30 is the last Шумен slot Mon–Thu).
- A slot is hidden if it overlaps any busy period returned by freeBusy. Doctors block time off just by adding events to their calendar.
- Д-р Симана Иванова is not bookable.

## UX
**Step 1 – Лекар и час**
- Left column: two doctor cards (photo, name, location) plus a "Първият свободен час" option. Choosing it shows both doctors together.
- Highlighted "Най-ранен свободен час" card (doctor, date, time) with an "Избери" button that jumps straight to step 2.
- Month calendar: weeks start on Monday, Bulgarian short day names (Пн…Нд), and a Bulgarian month title. Days with free slots are highlighted, with one small coloured dot per doctor who has availability that day. Weekends, past days, full days and days outside the 30-day window are disabled. Prev/next month buttons are limited to the window.
- Selected day: time buttons grouped by doctor, each group headed by photo, location and that day's working hours.
- Loading skeletons for the calendar and slots. Friendly error message with a "Опитай отново" button.

**Step 2 – Вашите данни**
- Summary card: doctor, location, date and time, with a "Промени" link back to step 1.
- Fields: Име и фамилия*, Телефон*, Имейл (по желание), Пациент* (Възрастен / Дете, as large toggle buttons), Медицинска услуга* (existing options), Бележка (optional, max 300 characters). The existing consent checkbox, privacy policy link and the warning not to send diagnoses or ЕГН stay.
- A hidden honeypot field.
- "Потвърди часа" button with a loading state. If the slot was taken in the meantime, the visitor sees the Bulgarian message "Този час току-що беше зает. Моля, изберете друг." and goes back to step 1 with refreshed slots.

**Step 3 – Готово**
- Doctor, address with a map link, date and time (Europe/Sofia).
- "Добави в календара": a Google Calendar link and an .ics download, both generated in the browser.
- Reminder to bring an ID card and any previous medical documents.

**Side column (stays)**
- Phone card with each location's numbers: Шумен +359 886 011 166 / +359 885 646 724, Нови Пазар +359 896 600 290.
- 112 emergency notice.
- "Преди посещението" section.

**Accessibility**
- Calendar works as an ARIA grid: arrow keys, Home/End, Enter.
- Time buttons are `aria-pressed` buttons.
- Step indicator uses `aria-current="step"`.
- Errors are announced through `role="alert"` / `aria-live`.
- Focus moves to each new step's heading.

**Page meta:** the new description is "Запазете час онлайн при д-р Чолаков в Шумен или Нови Пазар — изберете лекар, ден и свободен час и получете моментално потвърждение." The og: tags match it.

**Demo mode** (when the Google variables are missing, e.g. in the Lovable preview)
- A clear "Демо режим – примерна заетост, записването е изключено" banner.
- Sample availability is generated from the real working hours with a few blocked periods.
- The confirm button is disabled, and the server also refuses bookings in demo mode, so a fake success is never shown.
- On production, missing variables show the error state and phone numbers instead of demo data.

## Recommended Google approach
Use **`jose` + `fetch`**, not `googleapis`.
- `googleapis` is very large and depends on Node. `jose` is small and runs anywhere (Node, Vercel, Edge, and Cloudflare too).
- Flow: build a JWT signed with RS256 using the service account key → exchange it at `https://oauth2.googleapis.com/token` (scope `https://www.googleapis.com/auth/calendar`) → call `POST /calendar/v3/freeBusy` and `POST /calendar/v3/calendars/{id}/events`.
- The access token is cached in memory for about 55 minutes, per server instance.

## Server side
- `getAvailability({ from, to, doctorId? })`, a GET server function:
  - Clamps the range to the booking window.
  - Makes one freeBusy call for both calendars.
  - Builds slots from the config, minus busy periods, past times and the lead time.
  - Returns `{ mode: "live" | "demo", days: { date, doctors: { id, slots[] } }[], earliest }`.
- `createBooking(data)`, a POST server function:
  - Validates input with zod (names, phone format, lengths, enums).
  - Rejects the request if the honeypot is filled.
  - Checks the slot is on the 30-minute grid, inside working hours and inside the window.
  - Rate limit per IP: at most 5 bookings per 10 minutes, kept in memory (best effort, see Risks).
  - Re-checks freeBusy for that exact slot, then inserts the event:
    - Title "Пациент: {name}".
    - Description: phone, email, Възрастен/Дете, service, note, "Записан онлайн през cholakoviclinic.bg".
    - Start/end with `timeZone: "Europe/Sofia"`, no attendees.
  - Returns `{ ok: true, booking }` or `{ ok: false, code: "SLOT_TAKEN" | "RATE_LIMIT" | "INVALID" | "UNAVAILABLE", message }` with a Bulgarian message.
- Time zones: all wall-clock times are turned into exact instants with a small `Intl`-based Europe/Sofia helper, so DST is handled (the offset is +02:00 in winter and +03:00 in summer). The server's own clock time zone is never relied on.

## Files
**Add**
- `src/data/booking.ts` – config (doctors, locations, hours, rules).
- `src/lib/booking/slots.ts` – pure slot generation and overlap logic, shared by client and server.
- `src/lib/booking/sofia-time.ts` – time zone helpers.
- `src/lib/booking/google.server.ts` – JWT, token cache, freeBusy and insert calls (server only).
- `src/lib/booking/rate-limit.server.ts` – in-memory limiter.
- `src/lib/booking/demo.ts` – sample busy periods.
- `src/lib/booking.functions.ts` – the `getAvailability` and `createBooking` server functions.
- `src/lib/booking/ics.ts` – .ics file and Google Calendar link.
- `src/components/booking/StepIndicator.tsx`, `DoctorPicker.tsx`, `BookingCalendar.tsx`, `SlotList.tsx`, `EarliestSlotCard.tsx`, `PatientForm.tsx`, `BookingConfirmation.tsx`, `BookingSkeleton.tsx`.
- `src/lib/booking/slots.test.ts` – tests for:
  - the last slot ending exactly at 16:30 / 12:30 / 13:00 / 16:00
  - no slots on Sat–Sun
  - the 60-minute lead time
  - overlap with a busy event
  - the 30-day window
  - the slot count on DST change days (last Sunday of March and of October)
- `.env.example` with the variable names only.

**Change**
- `src/routes/zapazi-chas.tsx` – new widget, side column kept, new head().
- `src/routes/kontakti.tsx` – per-location hours and phones from the config.
- `src/routes/index.tsx` – read location hours and phones from the config (same text as now).
- `package.json` – add `jose`.
- `vite.config.ts` – Vercel build preset, if needed (checked on the first deploy).
- `AGENTS.md` – record the booking architecture decision.

## Vercel environment variables (Production and Preview)
- `GOOGLE_SERVICE_ACCOUNT_EMAIL` – e.g. `booking@your-project.iam.gserviceaccount.com`
- `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` – the `private_key` value from the downloaded JSON key:
  - Paste it either as the full multi-line PEM, or as the single line with `\n` exactly as it appears in the JSON. Both work.
  - Leave out the surrounding quotes.
  - In code: `key.replace(/\\n/g, "\n")`, with a startup check that it starts with `-----BEGIN PRIVATE KEY-----`.
- `GOOGLE_CALENDAR_ID_SHUMEN` – Д-р Милен Русев Чолаков's calendar ID (his Gmail address, or the ID from the calendar's settings → "Integrate calendar").
- `GOOGLE_CALENDAR_ID_NOVI_PAZAR` – Д-р Милен Миленов Чолаков's calendar ID.
- Optional: `BOOKING_DEMO_MODE=1` forces demo mode on a preview deploy.

**Google setup**
1. Create a Google Cloud project and enable the Calendar API.
2. Create a service account and a JSON key.
3. Each doctor opens Calendar → Settings → "Share with specific people", adds the service account email, and chooses "Make changes to events".

## How to test before going live
1. Lovable preview: demo mode. Review the whole UI; the confirm button is disabled.
2. Run the unit tests for the slot rules.
3. Create two test Google Calendars, share them with the service account, and point the variables at them on a **Vercel Preview** deployment. Then:
   - Add a "lunch" event and confirm the slots disappear.
   - Book a slot and confirm the event appears.
   - Book the same slot in two tabs and confirm the second one gets the "зает" message.
   - Check the summer and winter times show correctly.
4. Switch the variables to the real calendars on Production, then make one real booking and delete it.

## Risks and limitations
- **Google quotas:** freeBusy and insert have generous free quotas (about 1M requests a day for the project). A slow first load can come from the token exchange; it is cached afterwards.
- **Double booking:** re-checking right before inserting narrows the race to about 1 second but cannot fully remove it without a database lock. That is very unlikely at clinic traffic.
- **Rate limit:** in-memory limits apply per serverless instance and reset on cold starts. It is best effort only; real limiting would need a store such as Vercel KV.
- **Vercel runtime:** server functions run on Vercel's Node runtime; `jose` and `fetch` work there. The current build targets Cloudflare, so the Vercel preset must be confirmed on the first deploy. The Lovable preview cannot reach the real calendars unless the same variables are added in Lovable as well.
- **Time zones and DST:** handled with the Intl helper and covered by tests on DST change days. Google events are written with an explicit `Europe/Sofia` time zone.
- **No patient notifications:** a service account without delegation can't send invites. Patients only get the on-screen confirmation and the calendar download; email or SMS would need a separate provider.
- **Privacy:** patient name and phone are stored in the doctors' Google Calendars. This should be mentioned in the privacy policy.
