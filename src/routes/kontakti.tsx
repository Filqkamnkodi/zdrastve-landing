import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock, Info, ExternalLink, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { z } from "zod";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/kontakti")({
  head: () => ({
    meta: [
      { title: "Контакти — Клиника Д-р Чолакови" },
      {
        name: "description",
        content:
          "Свържете се с Клиника Д-р Чолакови по телефон, имейл или чрез контактната форма. Работно време, адрес и местоположение на клиниката.",
      },
      { property: "og:title", content: "Контакти — Клиника Д-р Чолакови" },
      {
        property: "og:description",
        content: "Телефон, имейл, адрес, работно време и контактна форма на Клиника Д-р Чолакови.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Моля, въведете име и фамилия.").max(100),
  phone: z
    .string()
    .trim()
    .min(6, "Моля, въведете валиден телефонен номер.")
    .max(30)
    .regex(/^[0-9+()\s-]+$/, "Телефонният номер съдържа непозволени символи."),
  email: z.union([z.string().trim().email("Моля, въведете валиден имейл адрес.").max(255), z.literal("")]),
  topic: z.string().min(1, "Моля, изберете тема."),
  message: z.string().trim().min(10, "Моля, опишете накратко вашето запитване.").max(1000),
  consent: z.literal(true, { errorMap: () => ({ message: "Необходимо е съгласие за обработка на данните." }) }),
});

const topics = [
  "Запазване на час",
  "Медицинска услуга",
  "Имунизация",
  "Медицински документи",
  "Друг въпрос",
];

type Status = "idle" | "loading" | "success" | "error";

function ContactPage() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [consent, setConsent] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      email: String(fd.get("email") ?? ""),
      topic: String(fd.get("topic") ?? ""),
      message: String(fd.get("message") ?? ""),
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
    // TODO: свържете с реален бекенд за изпращане на запитвания.
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
                <li className="font-medium text-primary-deep">Контакти</li>
              </ol>
            </nav>
            <div className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Контакти
            </div>
            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-deep leading-tight">
              Свържете се с нас
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Имате въпрос или желаете да запазите час? Свържете се с нашия екип по телефон,
              чрез контактната форма или ни посетете на място.
            </p>
          </div>
        </section>

        {/* Contact info + form */}
        <section className="py-10 lg:py-14 bg-surface border-y border-border/60">
          <div className="container-page grid lg:grid-cols-2 gap-8 items-start">
            <div className="grid sm:grid-cols-2 gap-4 animate-fade-up">
              <InfoCard icon={Phone} title="Телефон">
                <a href="tel:+359886011166" className="hover:text-primary-deep underline-offset-4 hover:underline">
                  +359 886 011 166
                </a>
              </InfoCard>
              <InfoCard icon={Mail} title="Имейл">
                <a href="mailto:contact@cholakoviclinic.bg" className="hover:text-primary-deep underline-offset-4 hover:underline">
                  contact@cholakoviclinic.bg
                </a>
              </InfoCard>
              <InfoCard icon={MapPin} title="Адрес">
                <div className="space-y-1">
                  <p><strong>Шумен:</strong> ул. „Васил Друмев" 17</p>
                  <p><strong>Нови Пазар:</strong> ул. „Христо Ботев" 22</p>
                </div>
                <a href="#map" className="mt-2 inline-block font-medium text-primary hover:text-primary-deep text-xs">
                  Вижте на картата
                </a>
              </InfoCard>
              <InfoCard icon={Clock} title="Работно време">
                <div className="space-y-1">
                  <p>Пон. – Четв.: 08:00 – 16:00</p>
                  <p>Пт: 08:30 – 13:00</p>
                  <p>Сб-Нд: Почивен ден</p>
                </div>
              </InfoCard>
            </div>

            <div className="card-soft rounded-[1.25rem] p-6 sm:p-8 animate-fade-up">
              <h2 className="text-xl sm:text-2xl font-bold text-primary-deep">Изпратете запитване</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Попълнете формата и нашият екип ще се свърже с вас при първа възможност.
              </p>

              <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
                <Field id="name" label="Име и фамилия" error={errors.name} required>
                  <Input id="name" name="name" autoComplete="name" required aria-invalid={!!errors.name} />
                </Field>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field id="phone" label="Телефон" error={errors.phone} required>
                    <Input id="phone" name="phone" type="tel" autoComplete="tel" required aria-invalid={!!errors.phone} />
                  </Field>
                  <Field id="email" label="Имейл (по желание)" error={errors.email}>
                    <Input id="email" name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} />
                  </Field>
                </div>

                <Field id="topic" label="Относно" error={errors.topic} required>
                  <select
                    id="topic"
                    name="topic"
                    required
                    defaultValue=""
                    aria-invalid={!!errors.topic}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="" disabled>
                      Изберете тема
                    </option>
                    {topics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id="message" label="Съобщение" error={errors.message} required>
                  <Textarea id="message" name="message" rows={5} maxLength={1000} required aria-invalid={!!errors.message} />
                </Field>
                <p className="-mt-2 text-xs text-muted-foreground">
                  Моля, не изпращайте чувствителна медицинска информация чрез тази форма.
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
                    Съгласен/на съм предоставените данни да бъдат използвани единствено за
                    обработване на моето запитване. Запознат/а съм с{" "}
                    <Link to="/politika-za-poveritelnost" className="underline hover:text-primary-deep">
                      Политиката за поверителност
                    </Link>
                    .
                  </Label>
                </div>
                {errors.consent && <p className="text-xs text-destructive">{errors.consent}</p>}

                <button type="submit" disabled={status === "loading"} className="btn-primary w-full justify-center disabled:opacity-70">
                  {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                  Изпрати запитването
                </button>

                {status === "success" && (
                  <p role="status" className="flex gap-2 text-sm text-primary-deep">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                    Благодарим ви! Запитването беше изпратено успешно. Ще се свържем с вас при
                    първа възможност.
                  </p>
                )}
                {status === "error" && (
                  <p role="alert" className="flex gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    Възникна проблем при изпращането. Моля, опитайте отново или се свържете с нас
                    по телефон.
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>

        {/* Map */}
        <section id="map" className="py-10 lg:py-14 scroll-mt-24">
          <div className="container-page">
            <div className="max-w-2xl animate-fade-up">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Как да ни откриете
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-primary-deep">
                Местоположение на клиниката
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Посетете ни в някой от нашите филиали в Шумен или Нови Пазар. Клиниките ни са разположени на леснодостъпни места с възможност за паркиране.
              </p>
              <a
                href="https://maps.app.goo.gl/QDcEzNtrwyDPeT7j9"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-5 !py-2.5 !px-5 text-sm"
              >
                <ExternalLink className="h-4 w-4" /> Отвори в Google Maps
              </a>
            </div>
            <div className="mt-7 overflow-hidden rounded-[1.25rem] border border-border/60 shadow-soft animate-fade-up">
              <iframe
                title="Карта с местоположението на клиниката"
                src="https://www.google.com/maps?output=embed&q=Shumen%2C%20Bulgaria"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-[280px] sm:h-[360px] w-full border-0"
              />
            </div>
          </div>
        </section>

        {/* Important notice */}
        <section className="pb-10 lg:pb-14">
          <div className="container-page">
            <div
              className="rounded-[1.25rem] border border-border/60 p-6 sm:p-7 animate-fade-up"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in oklab, var(--primary-soft) 18%, white) 0%, white 100%)",
              }}
            >
              <div className="flex gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-primary/25 text-primary-deep">
                  <Info className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <div>
                  <h2 className="text-base font-semibold text-primary-deep">Важно</h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    При спешни и животозастрашаващи състояния се обадете на телефон 112. Формата
                    за контакт не е предназначена за спешна медицинска помощ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-12 lg:pb-16">
          <div className="container-page">
            <div className="rounded-[1.5rem] bg-primary-deep px-7 py-10 sm:px-10 text-center animate-fade-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground">
                Разгледайте медицинските услуги на клиниката
              </h2>
              <p className="mt-3 text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
                Научете повече за прегледите, медицинските процедури, имунизациите и останалите
                услуги, които предлагаме.
              </p>
              <div className="mt-7 flex justify-center">
                <Link to="/services" className="btn-ghost">
                  Вижте услугите
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Phone;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="card-soft rounded-[1.25rem] p-5">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft/25 text-primary-deep">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <h2 className="mt-3 text-sm font-semibold text-primary-deep">{title}</h2>
      <div className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{children}</div>
    </article>
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
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-sm text-primary-deep">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  );
}
