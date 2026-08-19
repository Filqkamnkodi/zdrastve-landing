import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Stethoscope,
  Syringe,
  Plane,
  TestTube,
  Building2,
  FileCheck2,
  Globe2,
  Phone,
  MapPin,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import heroImg from "@/assets/immunization-hero.jpg";
import doctorMale from "@/assets/doctor-cholakov.jpg";
import doctorFemale from "@/assets/doctor-cholakova.jpg";

export const Route = createFileRoute("/imunizacionen-centar")({
  head: () => ({
    meta: [
      { title: "Имунизационен център — Клиника Д-р Чолакови" },
      {
        name: "description",
        content:
          "Регистриран имунизационен център: препоръчителни имунизации, консултации, ваксини за пътуващи в чужбина, проба Манту и БЦЖ, имунизационни документи.",
      },
      { property: "og:title", content: "Имунизационен център — Клиника Д-р Чолакови" },
      {
        property: "og:description",
        content:
          "Професионална грижа и защита чрез имунизация — препоръчителни ваксинации, проследяване и консултации за пътуващи извън Република България.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ImmunizationCenterPage,
});

const services = [
  {
    icon: Stethoscope,
    title: "Преглед и консултация",
    text: "Преглед, оценка на здравословното състояние и избор на подходяща препоръчителна ваксина.",
  },
  {
    icon: Syringe,
    title: "Имунизация и проследяване",
    text: "Поставяне на препоръчителни ваксини и последващо проследяване на пациента.",
  },
  {
    icon: Plane,
    title: "Ваксини за пътуващи",
    text: "Консултация и имунизация на лица, пътуващи извън Република България.",
  },
  {
    icon: TestTube,
    title: "Проба Манту и БЦЖ",
    text: "Извършване на проба Манту и ваксинация с БЦЖ ваксина срещу туберкулоза.",
  },
  {
    icon: Building2,
    title: "Имунизация на фирмени колективи",
    text: "Организиране и извършване на имунизации на служители директно на работното място.",
  },
  {
    icon: FileCheck2,
    title: "Имунизационни документи",
    text: "Издаване на свидетелство за имунизация и международен сертификат за имунизация.",
  },
];

const stats = [
  { value: "10 000+", label: "поставени препоръчителни ваксини" },
  { value: "От 2001", label: "регистриран имунизационен център" },
  { value: "2025", label: "регистрация за ваксиниране на пътуващи в чужбина" },
];

const doctors = [
  {
    name: "Д-р Милен Русев Чолаков",
    specialties:
      "Специалист по обща медицина, педиатрия, детска ревмокардиология и здравен мениджмънт",
    image: doctorMale,
  },
  {
    name: "Д-р Тереза Стоева Чолакова",
    specialties:
      "Специалист по епидемиология, инфекциозни болести и здравен мениджмънт. Ръководител „Дезинфекция, дезинсекция и дератизация“.",
    image: doctorFemale,
  },
];

function ImmunizationCenterPage() {
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
                "radial-gradient(900px 420px at 75% -20%, color-mix(in oklab, var(--primary-soft) 32%, transparent), transparent 60%), linear-gradient(180deg, var(--surface) 0%, white 100%)",
            }}
          />
          <div className="container-page py-12 lg:py-16 grid lg:grid-cols-2 gap-10 items-center">
            <div className="animate-fade-up">
              <nav aria-label="breadcrumb" className="text-sm text-muted-foreground">
                <ol className="flex flex-wrap items-center gap-1.5">
                  <li>
                    <Link to="/" className="hover:text-primary transition-colors">
                      Начало
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="font-medium text-primary-deep">Имунизационен център</li>
                </ol>
              </nav>
              <div className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Имунизационен център
              </div>
              <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-deep leading-tight">
                Професионална грижа и защита чрез имунизация
              </h1>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                Имунизационният център към клиниката извършва препоръчителни ваксинации,
                консултации и проследяване на пациенти и лица, пътуващи извън Република
                България.
              </p>
            </div>
            <div className="overflow-hidden rounded-[1.25rem] shadow-soft animate-fade-up">
              <img
                src={heroImg}
                alt="Медицинска сестра подготвя ваксина в имунизационния център"
                width={1280}
                height={720}
                className="h-full w-full object-cover aspect-video"
              />
            </div>
          </div>
        </section>

        {/* About */}
        <section className="py-12 lg:py-16">
          <div className="container-page grid lg:grid-cols-2 gap-10 items-center">
            <div className="animate-fade-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep">
                За имунизационния център
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Имунизационният център е регистриран на 1 ноември 2001 г. и извършва всички
                препоръчителни имунизации.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                От 2025 г. центърът има регистрация към Министерството на здравеопазването за
                поставяне на ваксини на лица, пътуващи в чужбина.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                До момента в центъра са поставени над 10 000 препоръчителни ваксини.
              </p>
            </div>
            <div className="card-soft rounded-[1.25rem] p-6 sm:p-8 animate-fade-up">
              <ul className="divide-y divide-border/60">
                {stats.map((s) => (
                  <li key={s.value} className="py-5 first:pt-0 last:pb-0">
                    <div className="text-3xl sm:text-4xl font-bold text-primary-deep">
                      {s.value}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-12 lg:py-16 bg-surface border-y border-border/60">
          <div className="container-page">
            <div className="max-w-2xl animate-fade-up">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Услуги
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-primary-deep">
                Какво предлагаме
              </h2>
            </div>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((s) => (
                <div
                  key={s.title}
                  className="card-soft rounded-[1.25rem] p-5 animate-fade-up"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft/25 text-primary-deep">
                    <s.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-primary-deep">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Travel */}
        <section className="py-12 lg:py-16">
          <div className="container-page">
            <div
              className="rounded-[1.5rem] p-7 sm:p-10 animate-fade-up border border-border/60"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in oklab, var(--primary-soft) 18%, white) 0%, white 100%)",
              }}
            >
              <div className="grid lg:grid-cols-[auto_1fr] gap-6 items-start">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-primary/25 text-primary-deep">
                  <Globe2 className="h-7 w-7" strokeWidth={1.5} />
                </span>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep">
                    Имунизации при пътуване в чужбина
                  </h2>
                  <p className="mt-4 text-muted-foreground leading-relaxed">
                    Центърът предлага медицински преглед, консултация, поставяне на
                    препоръчителни ваксини и проследяване на лица, пътуващи извън Република
                    България.
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Подходящите ваксини се определят индивидуално според дестинацията,
                    продължителността на пътуването, здравословното състояние и специфичните
                    рискове.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-12 lg:py-16 bg-surface border-y border-border/60">
          <div className="container-page">
            <div className="max-w-2xl animate-fade-up">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Нашият екип
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-primary-deep">
                Специалисти в имунизационния център
              </h2>
            </div>
            <div className="mt-8 grid sm:grid-cols-2 gap-6">
              {doctors.map((d) => (
                <article
                  key={d.name}
                  className="card-soft rounded-[1.25rem] p-6 animate-fade-up"
                >
                  <h3 className="text-lg font-semibold text-primary-deep">{d.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {d.specialties}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 lg:py-16">
          <div className="container-page">
            <div className="rounded-[1.5rem] bg-primary-deep px-7 py-10 sm:px-10 text-center animate-fade-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground">
                Имате въпроси относно имунизация?
              </h2>
              <p className="mt-3 text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
                Свържете се с нас за повече информация, консултация или записване на преглед.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <a href="/#contact" className="btn-ghost">
                  <Phone className="h-4 w-4" /> Свържете се с нас
                </a>
                <a href="/#contact" className="btn-ghost">
                  <MapPin className="h-4 w-4" /> Вижте контактите
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
