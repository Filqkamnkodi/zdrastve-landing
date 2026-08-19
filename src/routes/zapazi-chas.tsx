import { useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarCheck,
  CalendarDays,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Info,
  Phone,
  ClipboardList,
  Search,
  PhoneCall,
  BadgeCheck,
  IdCard,
  FileText,
  Baby,
} from "lucide-react";
import { z } from "zod";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { servicesList } from "@/data/services";
import { team } from "@/data/team";

export const Route = createFileRoute("/zapazi-chas")({
  head: () => ({
    meta: [
      { title: "Запази час — Клиника Д-р Чолакови" },
      {
        name: "description",
        content:
          "Заявете час за преглед в Клиника Д-р Чолакови. Попълнете формата с предпочитана дата, час и услуга — екипът ни ще се свърже с вас за потвърждение.",
      },
      { property: "og:title", content: "Запази час — Клиника Д-р Чолакови" },
      {
        property: "og:description",
        content:
          "Изпратете заявка за час за преглед. Заявката се потвърждава допълнително от екипа на клиниката.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppointmentPage,
});

const serviceOptions = [
  ...servicesList.map((s) => s.title),
  "Имунизация",
  "Консултация за пътуване в чужбина",
  "Друго",
];

const doctorOptions = ["Без предпочитание", ...team.map((m) => m.name)];

const timeRanges = [
  "08:00 – 10:00",
  "10:00 – 12:00",
  "12:00 – 14:00",
  "14:00 – 16:00",
  "16:00 – 18:00",
  "Нямам предпочитание",
];

const today = () => new Date().toISOString().slice(0, 10);

const schema = z.object({
  name: z.string().trim().min(2, "Моля, въведете име и фамилия.").max(100),
  phone: z
    .string()
    .trim()
    .min(6, "Моля, въведете валиден телефонен номер.")
    .max(30)
    .regex(/^[0-9+()\s-]+$/, "Телефонният номер съдържа непозволени символи."),
  email: z.union([
    z.string().trim().email("Моля, въведете валиден имейл адрес.").max(255),
    z.literal(""),
  ]),
  patient: z.string().min(1, "Моля, изберете за кого е заявката."),
  service: z.string().min(1, "Моля, изберете медицинска услуга."),
  doctor: z.string().max(120).optional(),
  date: z
    .string()
    .min(1, "Моля, изберете предпочитана дата.")
    .refine((v) => v >= today(), "Моля, изберете дата, която не е в миналото."),
  timeRange: z.string().min(1, "Моля, изберете предпочитан часови диапазон."),
  notes: z.string().trim().max(1000, "Текстът е твърде дълъг.").optional(),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Необходимо е съгласие за обработка на данните." }),
  }),
});

type Status = "idle" | "loading" | "success" | "error";

function AppointmentPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [consent, setConsent] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return; // предпазва от повторно изпращане
    const fd = new FormData(e.currentTarget);
    const values = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      patient: String(fd.get("patient") ?? ""),
      service: String(fd.get("service") ?? ""),
      doctor: String(fd.get("doctor") ?? ""),
      date: String(fd.get("date") ?? ""),
      timeRange: String(fd.get("timeRange") ?? ""),
      notes: String(fd.get("notes") ?? ""),
      consent,
    };
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) next[String(issue.path[0])] = issue.message;
      setErrors(next);
      setStatus("idle");
      return;
    }
    setErrors({});
    setStatus("loading");

    // ==========================================================
    // TODO: ИНТЕГРАЦИЯ С БЕКЕНД / СИСТЕМА ЗА ЗАПИСВАНЕ НА ЧАС
    // Тук трябва да се изпрати `parsed.data` към реален endpoint,
    // например:
    //
    //   const res = await fetch("/api/public/appointment-request", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(parsed.data),
    //   });
    //   if (!res.ok) throw new Error("Request failed");
    //   setStatus("success");
    //
    // Докато няма свързан endpoint, формата НЕ показва фалшив успех.
    // ==========================================================
    setStatus("error");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(900px 380px at 70% -30%, color-mix(in oklab, var(--primary-soft) 30%, transparent), transparent 60%), linear-gradient(180deg, var(--surface) 0%, white 100%)",
            }}
          />
          <div className="container-page py-10 lg:py-14 animate-fade-up max-w-3xl">
            <nav aria-label="breadcrumb" className="text-sm text-muted-foreground">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li>
                  <Link to="/" className="hover:text-primary transition-colors">
                    Начало
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="font-medium text-primary-deep">Запази час</li>
              </ol>
            </nav>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/25 bg-white text-primary-deep">
                <CalendarDays className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Запазване на час
              </span>
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-deep leading-tight">
              Заявете час за преглед
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Попълнете формата, като посочите предпочитаните от вас дата, час и медицинска
              услуга. Нашият екип ще се свърже с вас, за да потвърди посещението.
            </p>
          </div>
        </section>

        {/* Form + info */}
        <section className="py-10 lg:py-14 bg-surface border-y border-border/60">
          <div className="container-page grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
            {/* Form */}
            <div className="card-soft rounded-[1.25rem] border border-border/60 bg-white p-6 sm:p-8 animate-fade-up">
              <h2 className="text-xl sm:text-2xl font-bold text-primary-deep">Заявка за час</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Изпратете желаните от вас данни. Заявката ще бъде потвърдена допълнително от
                екипа на клиниката.
              </p>

              <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field id="name" label="Име и фамилия" error={errors.name} required>
                    <Input id="name" name="name" autoComplete="name" required aria-invalid={!!errors.name} />
                  </Field>
                  <Field id="phone" label="Телефон" error={errors.phone} required>
                    <Input id="phone" name="phone" type="tel" autoComplete="tel" required aria-invalid={!!errors.phone} />
                  </Field>
                </div>

                <Field id="email" label="Имейл (по желание)" error={errors.email}>
                  <Input id="email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} />
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field id="patient" label="Пациент" error={errors.patient} required>
                    <SelectInput id="patient" name="patient" placeholder="Изберете пациент" required invalid={!!errors.patient} options={["Възрастен", "Дете"]} />
                  </Field>
                  <Field id="service" label="Медицинска услуга" error={errors.service} required>
                    <SelectInput id="service" name="service" placeholder="Изберете услуга" required invalid={!!errors.service} options={serviceOptions} />
                  </Field>
                </div>

                <Field id="doctor" label="Предпочитан лекар (по желание)" error={errors.doctor}>
                  <SelectInput id="doctor" name="doctor" defaultValue="Без предпочитание" options={doctorOptions} />
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field id="date" label="Предпочитана дата" error={errors.date} required>
                    <Input id="date" name="date" type="date" min={today()} required aria-invalid={!!errors.date} />
                  </Field>
                  <Field id="timeRange" label="Предпочитан часови диапазон" error={errors.timeRange} required>
                    <SelectInput id="timeRange" name="timeRange" placeholder="Изберете диапазон" required invalid={!!errors.timeRange} options={timeRanges} />
                  </Field>
                </div>
                <p className="-mt-2 text-xs text-muted-foreground">
                  Посочените дата и час са само предпочитание и не представляват потвърдена
                  свободна възможност.
                </p>

                <Field id="notes" label="Допълнителна информация (по желание)" error={errors.notes}>
                  <Textarea
                    id="notes"
                    name="notes"
                    rows={4}
                    maxLength={1000}
                    placeholder="Добавете кратка информация, свързана със заявката ви."
                    aria-invalid={!!errors.notes}
                  />
                </Field>
                <p className="-mt-2 text-xs text-muted-foreground">
                  Моля, не изпращайте диагнози, изследвания, ЕГН или друга чувствителна
                  медицинска информация чрез тази форма.
                </p>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(v) => setConsent(v === true)}
                    aria-invalid={!!errors.consent}
                    className="mt-0.5"
                  />
                  <Label htmlFor="consent" className="text-xs font-normal leading-relaxed text-muted-foreground">
                    Съгласен/на съм предоставените данни да бъдат използвани за обработване на
                    заявката ми и за връзка с мен. Запознат/а съм с{" "}
                    <Link to="/politika-za-poveritelnost" className="underline hover:text-primary-deep">
                      Политиката за поверителност
                    </Link>
                    .
                  </Label>
                </div>
                {errors.consent && <p className="text-xs text-destructive">{errors.consent}</p>}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="btn-primary w-full justify-center disabled:opacity-70"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CalendarCheck className="h-4 w-4" />
                  )}
                  Изпрати заявка за час
                </button>

                {status === "success" && (
                  <div role="status" className="rounded-xl border border-primary/25 bg-primary-soft/20 p-4">
                    <p className="flex gap-2 text-sm text-primary-deep">
                      <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                      Благодарим ви! Заявката ви за час беше изпратена успешно. Нашият екип ще се
                      свърже с вас, за да потвърди датата и часа.
                    </p>
                    <p className="mt-2 pl-6 text-xs text-muted-foreground">
                      Часът не е потвърден, докато не получите обаждане или съобщение от
                      клиниката.
                    </p>
                  </div>
                )}
                {status === "error" && (
                  <p role="alert" className="flex gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    Възникна проблем при изпращането на заявката. Моля, опитайте отново или се
                    свържете с нас по телефон.
                  </p>
                )}
              </form>
            </div>

            {/* Info column */}
            <aside className="space-y-4 animate-fade-up">
              <div className="rounded-[1.25rem] border border-border/60 bg-white p-6 shadow-soft">
                <h2 className="text-base font-semibold text-primary-deep">
                  Какво следва след изпращането?
                </h2>
                <ol className="mt-4 space-y-3 text-sm text-muted-foreground">
                  {[
                    { icon: ClipboardList, text: "Изпращате заявката." },
                    { icon: Search, text: "Нашият екип проверява възможностите." },
                    { icon: PhoneCall, text: "Свързваме се с вас за потвърждение." },
                    {
                      icon: BadgeCheck,
                      text: "Часът се счита за запазен след потвърждение от клиниката.",
                    },
                  ].map((s, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-primary/25 text-primary-deep">
                        <s.icon className="h-4 w-4" strokeWidth={1.75} />
                      </span>
                      <span className="leading-relaxed">
                        <strong className="text-primary-deep">{i + 1}.</strong> {s.text}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-[1.25rem] border border-border/60 bg-white p-6 shadow-soft">
                <h2 className="text-base font-semibold text-primary-deep">
                  Предпочитате да се обадите?
                </h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  За по-бърза връзка можете да се свържете с нас по телефон.
                </p>
                <a href="tel:+359 886 011 166" className="btn-primary mt-4 !py-2.5 !px-5 text-sm">
                  <Phone className="h-4 w-4" /> Обадете се
                </a>
              </div>

              <div
                className="rounded-[1.25rem] border border-border/60 p-6"
                style={{
                  background:
                    "linear-gradient(180deg, color-mix(in oklab, var(--primary-soft) 18%, white) 0%, white 100%)",
                }}
              >
                <div className="flex gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/25 text-primary-deep">
                    <Info className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                  <div>
                    <h2 className="text-base font-semibold text-primary-deep">Важно</h2>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      При спешни и животозастрашаващи състояния се обадете на телефон 112.
                      Формата не е предназначена за спешна медицинска помощ.
                    </p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Before the visit */}
        <section className="py-10 lg:py-14">
          <div className="container-page">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep animate-fade-up">
              Преди посещението
            </h2>
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              {[
                {
                  icon: IdCard,
                  title: "Носете документ за самоличност",
                  text: "Документът е необходим за идентификация при регистрация в кабинета.",
                },
                {
                  icon: FileText,
                  title: "Подгответе наличните медицински документи",
                  text: "Ако имате документи, свързани с прегледа, носете ги със себе си.",
                },
                {
                  icon: Baby,
                  title: "При записване на дете",
                  text: "Носете необходимите документи на детето при посещението.",
                },
              ].map((c) => (
                <div
                  key={c.title}
                  className="rounded-[1.25rem] border border-border/60 bg-white p-6 shadow-soft animate-fade-up"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-primary/25 text-primary-deep">
                    <c.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-primary-deep">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Field({
  id,
  label,
  error,
  required,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-sm font-medium text-primary-deep">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </Label>
      <div className="mt-1.5">{children}</div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function SelectInput({
  id,
  name,
  options,
  placeholder,
  required,
  invalid,
  defaultValue,
}: {
  id: string;
  name: string;
  options: string[];
  placeholder?: string;
  required?: boolean;
  invalid?: boolean;
  defaultValue?: string;
}) {
  return (
    <select
      id={id}
      name={name}
      required={required}
      defaultValue={defaultValue ?? (placeholder ? "" : undefined)}
      aria-invalid={!!invalid}
      aria-describedby={invalid ? `${id}-error` : undefined}
      className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}
