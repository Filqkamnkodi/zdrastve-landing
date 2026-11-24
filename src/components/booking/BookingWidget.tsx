import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertCircle, CalendarCheck, Clock, Loader2, MapPin, RefreshCw, Sparkles, Users, FlaskConical } from "lucide-react";
import { doctors, doctorById, doctorLocationIds, locations, BOOKING_WINDOW_DAYS, type DoctorId, type LocationId } from "@/data/booking";
import { getAvailability, getBookingDoctors, createBooking, type AvailabilityResult } from "@/lib/booking.functions";
import { patientSchema } from "@/lib/booking/schema";
import { addDays, formatLongDate, formatTime, sofiaParts, weekdayOf } from "@/lib/booking/sofia-time";
import { StepIndicator } from "./StepIndicator";
import { BookingCalendar } from "./BookingCalendar";
import { BookingConfirmation } from "./BookingConfirmation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Choice = DoctorId | "any";
type Picked = { doctorId: DoctorId; locationId: LocationId; start: number };

export function BookingWidget({ serviceOptions, focusOnMount = true }: { serviceOptions: string[]; focusOnMount?: boolean }) {
  const fetchAvail = useServerFn(getAvailability);
  const book = useServerFn(createBooking);
  const fetchDoctors = useServerFn(getBookingDoctors);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [locationId, setLocationId] = useState<LocationId | null>(null);
  const [picker, setPicker] = useState<Awaited<ReturnType<typeof getBookingDoctors>> | null>(null);
  const requestId = useRef(0);
  const [choice, setChoice] = useState<Choice>("any");
  const [data, setData] = useState<AvailabilityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [focusDate, setFocusDate] = useState<string | null>(null);
  const [picked, setPicked] = useState<Picked | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ doctorId: DoctorId; locationId: LocationId; start: number; end: number } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let active = true;
    void fetchDoctors().then((result) => {
      if (active) setPicker(result);
    }).catch(() => {
      if (active) setLoadError("Не успяхме да заредим лекарите. Моля, опитайте отново.");
    });
    return () => { active = false; };
  }, [fetchDoctors]);

  const load = useCallback(async () => {
    const request = ++requestId.current;
    if (!locationId) { setLoading(false); return; }
    setLoading(true);
    setLoadError(null);
    try {
      const today = sofiaParts(Date.now()).date;
      const res = await fetchAvail({ data: {
        from: today, to: addDays(today, BOOKING_WINDOW_DAYS), locationId,
        ...(choice === "any" ? {} : { doctorId: choice }),
      } });
      if (request !== requestId.current) return;
      setData(res);
      if (res.error) setLoadError(res.error);
      setMonth((m) => m ?? res.from.slice(0, 7));
    } catch {
      if (request === requestId.current) setLoadError("Не успяхме да заредим свободните часове. Моля, опитайте отново.");
    } finally {
      if (request === requestId.current) setLoading(false);
    }
  }, [fetchAvail, choice, locationId]);

  useEffect(() => {
    void load();
    return () => { requestId.current += 1; };
  }, [load]);

  function resetSelection(nextLocation: LocationId | null) {
    requestId.current += 1;
    setLocationId(nextLocation);
    setDate(null);
    setFocusDate(null);
    setPicked(null);
    setData(null);
    setMonth(null);
    setNotice(null);
    setLoading(Boolean(nextLocation));
  }

  function selectDoctor(next: Choice) {
    if (next === choice) return;
    setChoice(next);
    const doc = doctorById(next);
    const ids = doc ? doctorLocationIds(doc) : [];
    resetSelection(ids.length === 1 ? ids[0] ?? null : null);
  }

  useEffect(() => {
    // Embedded widgets must not pull the homepage down on its initial load.
    if (step === 1 && !focusOnMount) return;
    headingRef.current?.focus();
  }, [step, focusOnMount]);

  const bookableDoctors = doctors.filter((d) => picker?.doctorIds.includes(d.id));
  const selectedDoctor = doctorById(choice);
  const locationOptions = selectedDoctor ? doctorLocationIds(selectedDoctor) : Object.values(locations).map((loc) => loc.id);
  const visibleIds: DoctorId[] = bookableDoctors.filter((d) => (choice === "any" || d.id === choice) && (!locationId || doctorLocationIds(d).includes(locationId))).map((d) => d.id);

  const availability = useMemo(() => {
    const map: Record<string, DoctorId[]> = {};
    for (const day of data?.days ?? []) {
      const ids = day.doctors.filter((d) => visibleIds.includes(d.id) && d.slots.length).map((d) => d.id);
      if (ids.length) map[day.date] = ids;
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, choice, picker, locationId]);

  const earliest = useMemo(() => {
    if (!data) return null;
    let best: Picked | null = null;
    for (const day of data?.days ?? [])
      for (const d of day.doctors)
        if (visibleIds.includes(d.id) && d.slots[0] && (!best || d.slots[0].start < best.start)) best = { doctorId: d.id, locationId: data.locationId, start: d.slots[0].start };
    return best;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, choice, picker, locationId]);

  // ако избраният ден вече няма часове за избрания лекар — изчистваме
  useEffect(() => {
    if (date && !availability[date]) setDate(null);
  }, [availability, date]);

  const daySlots = useMemo(() => {
    const day = data?.days.find((d) => d.date === date);
    return day ? day.doctors.filter((d) => visibleIds.includes(d.id) && d.slots.length) : [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, date, choice, picker, locationId]);

  const demo = (data?.mode ?? picker?.mode) === "demo";
  const unavailable = (data?.mode ?? picker?.mode) === "unavailable";

  function choose(p: Picked) {
    setPicked(p);
    setNotice(null);
    setStep(2);
  }

  async function onSlotTaken(msg: string) {
    setNotice(msg);
    setPicked(null);
    setStep(1);
    await load();
  }

  const minMonth = data?.from.slice(0, 7) ?? "";
  const maxMonth = data?.to.slice(0, 7) ?? "";

  return (
    <div className="card-soft rounded-[1.25rem] border border-border/60 bg-background p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <StepIndicator current={step} />
      </div>

      {demo && (
        <div role="note" className="mt-5 flex gap-2 rounded-xl border border-dashed border-primary/40 bg-primary-soft/15 px-4 py-3 text-sm text-primary-deep">
          <FlaskConical className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            <strong>Демо режим</strong> – примерна заетост, записването е изключено.
          </span>
        </div>
      )}

      {step === 1 && (
        <div className="mt-6">
          <h2 ref={headingRef} tabIndex={-1} className="text-xl sm:text-2xl font-bold text-primary-deep focus:outline-none">
            Изберете лекар и час
          </h2>
          {notice && (
            <p role="alert" className="mt-3 flex gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {notice}
            </p>
          )}

          <div className="mt-5 grid gap-6 md:grid-cols-[230px_1fr]">
            {/* Doctor picker */}
            <div role="radiogroup" aria-label="Изберете лекар" className="flex flex-col gap-3">
              <DoctorOption active={choice === "any"} onClick={() => selectDoctor("any")}>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary-soft/25 text-primary-deep">
                  <Users className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-primary-deep">Първият свободен час</span>
                  <span className="block text-xs text-muted-foreground">При който и да е лекар</span>
                </span>
              </DoctorOption>
              {bookableDoctors.map((d) => (
                <DoctorOption key={d.id} active={choice === d.id} onClick={() => selectDoctor(d.id)}>
                  <img src={d.photo} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover object-top" />
                  <span>
                    <span className="block text-sm font-semibold text-primary-deep">{d.name}</span>
                  </span>
                </DoctorOption>
              ))}
            </div>

            <div className="min-w-0">
              {!unavailable && picker && (
                <div className="mb-5 space-y-2">
                  <Label htmlFor="booking-location">Локация</Label>
                  <Select value={locationId ?? ""} onValueChange={(value) => {
                    if (value === "shumen" || value === "novi-pazar") resetSelection(value);
                  }}>
                    <SelectTrigger id="booking-location" aria-label="Локация" className="bg-background">
                      <SelectValue placeholder="Изберете локация" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationOptions.map((id) => <SelectItem key={id} value={id}>{locations[id].city}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {unavailable || (loadError && !data?.days.length) ? (
                <ErrorState message={loadError ?? "Онлайн записването временно не е достъпно."} onRetry={async () => { setPicker(await fetchDoctors()); await load(); }} />
              ) : !picker || (loading && !data) ? (
                <CalendarSkeleton />
              ) : !locationId ? (
                <p className="text-sm text-muted-foreground">Изберете локация, за да видите свободните часове.</p>
              ) : (
                <>
                  {earliest ? (
                    <EarliestCard picked={earliest} onPick={() => choose(earliest)} />
                  ) : (
                    <p className="rounded-xl border border-border bg-surface p-4 text-sm text-muted-foreground">
                      Няма свободни часове през следващите {BOOKING_WINDOW_DAYS} дни. Моля, обадете се по телефона.
                    </p>
                  )}
                  <div className={cn("mt-5 rounded-2xl border border-border/60 p-4 sm:p-5", loading && "opacity-60")} aria-busy={loading}>
                    {month && (
                      <BookingCalendar
                        month={month}
                        doctorIds={visibleIds}
                        onMonthChange={setMonth}
                        minMonth={minMonth}
                        maxMonth={maxMonth}
                        selected={date}
                        onSelect={setDate}
                        availability={availability}
                        focusDate={focusDate}
                        onFocusDate={setFocusDate}
                      />
                    )}
                  </div>

                  <div className="mt-5" aria-live="polite">
                    {date ? (
                      <div>
                        <h3 className="text-base font-semibold capitalize text-primary-deep">
                          {formatLongDate(Date.parse(`${date}T12:00:00Z`))}
                        </h3>
                        <div className="mt-3 space-y-4">
                          {daySlots.map((ds) => {
                            const doc = doctorById(ds.id);
                            if (!doc || !locationId) return null;
                            const loc = locations[locationId];
                            const intervals = doc.schedule[locationId][weekdayOf(date)];
                            return (
                              <div key={ds.id} className="rounded-2xl border border-border/60 p-4">
                                <div className="flex items-center gap-3">
                                  <img src={doc.photo} alt="" className="h-10 w-10 rounded-lg object-cover object-top" />
                                  <div className="text-sm">
                                    <p className="font-semibold text-primary-deep">{doc.name}</p>
                                    <p className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                                      <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{loc.city}</span>
                                      {intervals && <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{intervals.map((h) => `${h.open} – ${h.close}`).join(", ")}</span>}
                                    </p>
                                  </div>
                                </div>
                                <div role="group" aria-label={`Свободни часове при ${doc.name}`} className="mt-3 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                                  {ds.slots.map((s) => {
                                    const sel = picked?.start === s.start && picked.doctorId === ds.id;
                                    return (
                                      <button
                                        key={s.start}
                                        type="button"
                                        aria-pressed={sel}
                                        aria-label={`${s.time} ч. при ${doc.name}`}
                                        onClick={() => choose({ doctorId: ds.id, locationId, start: s.start })}
                                        className={cn(
                                          "rounded-lg border px-2 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                          sel ? "border-primary-deep bg-primary-deep text-primary-foreground" : "border-primary/25 text-primary-deep hover:bg-primary-soft/25",
                                        )}
                                      >
                                        {s.time}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Изберете ден от календара, за да видите свободните часове.</p>
                    )}
                  </div>
                  {loadError && <p role="alert" className="mt-3 text-sm text-destructive">{loadError}</p>}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {step === 2 && picked && (
        <PatientStep
          headingRef={headingRef}
          picked={picked}
          demo={demo}
          serviceOptions={serviceOptions}
          onBack={() => setStep(1)}
          onSubmit={async (values) => {
            const res = await book({ data: { ...values, doctorId: picked.doctorId, locationId: picked.locationId, start: picked.start } });
            if (res.ok) {
              setConfirmed(res.booking);
              setStep(3);
              void load();
              return null;
            }
            if (res.code === "SLOT_TAKEN") {
              await onSlotTaken(res.message);
              return null;
            }
            return res.message;
          }}
        />
      )}

      {step === 3 && confirmed && (
        <div className="mt-6">
          <BookingConfirmation
            ref={headingRef}
            booking={confirmed}
            onNew={() => {
              setConfirmed(null);
              setPicked(null);
              setDate(null);
              setStep(1);
            }}
          />
        </div>
      )}
    </div>
  );
}

function DoctorOption({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-2xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "border-primary-deep bg-primary-soft/15 shadow-soft" : "border-border hover:border-primary/40 hover:bg-surface",
      )}
    >
      {children}
    </button>
  );
}

function EarliestCard({ picked, onPick }: { picked: Picked; onPick: () => void }) {
  const doc = doctorById(picked.doctorId);
  if (!doc) return null;
  return (
    <div
      className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border border-primary/30 p-4"
      style={{ background: "linear-gradient(135deg, color-mix(in oklab, var(--primary-soft) 25%, var(--background)), var(--background))" }}
    >
      <div className="flex items-center gap-3 flex-1">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-deep text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="text-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Най-ранен свободен час</p>
          <p className="font-semibold capitalize text-primary-deep">
            {formatLongDate(picked.start)}, {formatTime(picked.start)} ч.
          </p>
          <p className="text-muted-foreground">{doc.name} · {locations[picked.locationId].city}</p>
        </div>
      </div>
      <button type="button" onClick={onPick} className="btn-primary !py-2 !px-5 text-sm justify-center">
        Избери
      </button>
    </div>
  );
}

function CalendarSkeleton() {
  return (
    <div aria-busy="true" aria-label="Зареждане на свободните часове">
      <Skeleton className="h-20 w-full rounded-2xl" />
      <div className="mt-5 rounded-2xl border border-border/60 p-5">
        <Skeleton className="mx-auto h-5 w-32" />
        <div className="mt-4 grid grid-cols-7 gap-1">
          {Array.from({ length: 35 }, (_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-sm">
      <p className="flex gap-2 text-destructive">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {message}
      </p>
      <p className="mt-2 text-muted-foreground">
        Можете да запазите час и по телефона: Шумен {locations.shumen.phones.map((phone, index) => <span key={phone}>{index > 0 && ", "}<a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-primary-deep">{phone}</a></span>)}, Нови Пазар {locations["novi-pazar"].phones[0]}.
      </p>
      <button type="button" onClick={onRetry} className="btn-ghost mt-4 !py-2 !px-4 text-sm">
        <RefreshCw className="h-4 w-4" /> Опитай отново
      </button>
    </div>
  );
}

type PatientValues = { name: string; phone: string; email: string; patient: "Възрастен" | "Дете"; service: string; note: string; website: string };

function PatientStep({
  headingRef,
  picked,
  demo,
  serviceOptions,
  onBack,
  onSubmit,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  picked: Picked;
  demo: boolean;
  serviceOptions: string[];
  onBack: () => void;
  onSubmit: (v: PatientValues) => Promise<string | null>;
}) {
  const doc = doctorById(picked.doctorId);
  const loc = locations[picked.locationId];
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [patient, setPatient] = useState<"" | "Възрастен" | "Дете">("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handle(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting || demo) return;
    const fd = new FormData(e.currentTarget);
    const values = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      patient,
      service: String(fd.get("service") ?? ""),
      note: String(fd.get("note") ?? ""),
    };
    const parsed = patientSchema.safeParse(values);
    const next: Record<string, string> = {};
    if (!parsed.success) for (const i of parsed.error.issues) next[String(i.path[0])] ??= i.message;
    if (!consent) next.consent = "Необходимо е съгласие за обработка на данните.";
    setErrors(next);
    if (Object.keys(next).length || !parsed.success) return;
    setSubmitting(true);
    setFormError(null);
    try {
      const err = await onSubmit({ ...parsed.data, note: parsed.data.note ?? "", website: String(fd.get("website") ?? "") });
      if (err) setFormError(err);
    } catch {
      setFormError("Възникна проблем при записването. Моля, опитайте отново или се обадете по телефона.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!doc) return null;

  return (
    <div className="mt-6">
      <h2 ref={headingRef} tabIndex={-1} className="text-xl sm:text-2xl font-bold text-primary-deep focus:outline-none">
        Вашите данни
      </h2>

      <div className="mt-4 flex items-center gap-4 rounded-2xl border border-border/60 bg-surface p-4">
        <img src={doc.photo} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover object-top" />
        <div className="flex-1 text-sm">
          <p className="font-semibold text-primary-deep">{doc.name}</p>
          <p className="capitalize">{formatLongDate(picked.start)}, {formatTime(picked.start)} ч.</p>
          <p className="text-muted-foreground">{loc.address}</p>
        </div>
        <button type="button" onClick={onBack} className="text-sm font-medium text-primary hover:text-primary-deep underline-offset-4 hover:underline">
          Промени
        </button>
      </div>

      <form onSubmit={handle} noValidate className="mt-6 space-y-4">
        {/* honeypot */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor="website">Уебсайт</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field id="name" label="Име и фамилия" error={errors.name} required>
            <Input id="name" name="name" autoComplete="name" maxLength={100} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
          </Field>
          <Field id="phone" label="Телефон" error={errors.phone} required>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} />
          </Field>
        </div>
        <Field id="email" label="Имейл (по желание)" error={errors.email}>
          <Input id="email" name="email" type="email" autoComplete="email" maxLength={255} aria-invalid={!!errors.email} />
        </Field>

        <fieldset>
          <legend className="text-sm font-medium text-primary-deep">Пациент *</legend>
          <div role="radiogroup" className="mt-1.5 grid grid-cols-2 gap-3">
            {(["Възрастен", "Дете"] as const).map((p) => (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={patient === p}
                onClick={() => setPatient(p)}
                className={cn(
                  "rounded-xl border px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  patient === p ? "border-primary-deep bg-primary-deep text-primary-foreground" : "border-input text-primary-deep hover:bg-surface",
                )}
              >
                {p}
              </button>
            ))}
          </div>
          {errors.patient && <p role="alert" className="mt-1.5 text-xs text-destructive">{errors.patient}</p>}
        </fieldset>

        <Field id="service" label="Медицинска услуга" error={errors.service} required>
          <select
            id="service"
            name="service"
            defaultValue=""
            aria-invalid={!!errors.service}
            className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="" disabled>Изберете услуга</option>
            {serviceOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>

        <Field id="note" label="Кратка бележка (по желание)" error={errors.note}>
          <Textarea id="note" name="note" rows={3} maxLength={300} placeholder="Напр. повод за посещението" aria-invalid={!!errors.note} />
        </Field>
        <p className="-mt-2 text-xs text-muted-foreground">
          Моля, не изпращайте диагнози, изследвания, ЕГН или друга чувствителна медицинска информация чрез тази форма.
        </p>

        <div className="flex items-start gap-3">
          <Checkbox id="consent" checked={consent} onCheckedChange={(v) => setConsent(v === true)} aria-invalid={!!errors.consent} className="mt-0.5" />
          <Label htmlFor="consent" className="text-xs font-normal leading-relaxed text-muted-foreground">
            Съгласен/на съм предоставените данни да бъдат използвани за записването на час и за връзка с мен. Запознат/а съм с{" "}
            <Link to="/politika-za-poveritelnost" className="underline hover:text-primary-deep">Политиката за поверителност</Link>.
          </Label>
        </div>
        {errors.consent && <p role="alert" className="text-xs text-destructive">{errors.consent}</p>}

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <button type="button" onClick={onBack} className="btn-ghost justify-center">Назад</button>
          <button type="submit" disabled={submitting || demo} className="btn-primary flex-1 justify-center disabled:opacity-60 disabled:cursor-not-allowed">
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarCheck className="h-4 w-4" />}
            Потвърди часа
          </button>
        </div>
        {demo && <p className="text-xs text-muted-foreground">В демо режим потвърждаването е изключено.</p>}
        {formError && (
          <p role="alert" className="flex gap-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {formError}
          </p>
        )}
      </form>
    </div>
  );
}

function Field({ id, label, error, required, children }: { id: string; label: string; error?: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <Label htmlFor={id} className="text-sm font-medium text-primary-deep">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </Label>
      <div className="mt-1.5">{children}</div>
      {error && <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-destructive">{error}</p>}
    </div>
  );
}
