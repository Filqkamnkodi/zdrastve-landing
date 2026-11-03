import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, Info, Phone, IdCard, FileText, Baby } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { BookingWidget } from "@/components/booking/BookingWidget";
import { servicesList } from "@/data/services";
import { locations } from "@/data/booking";

const DESC =
  "Запазете час онлайн при д-р Чолаков в Шумен или Нови Пазар — изберете лекар, ден и свободен час и получете моментално потвърждение.";

export const Route = createFileRoute("/zapazi-chas")({
  head: () => ({
    meta: [
      { title: "Запази час онлайн — Клиника Д-р Чолакови" },
      { name: "description", content: DESC },
      { property: "og:title", content: "Запази час онлайн — Клиника Д-р Чолакови" },
      { property: "og:description", content: DESC },
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

function AppointmentPage() {
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
              Запазете час онлайн
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Изберете лекар, ден и свободен час — часът се запазва веднага и получавате
              потвърждение на екрана.
            </p>
          </div>
        </section>

        <section className="py-10 lg:py-14 bg-surface border-y border-border/60">
          <div className="container-page grid xl:grid-cols-[1fr_320px] gap-8 items-start">
            <div className="animate-fade-up min-w-0">
              <BookingWidget serviceOptions={serviceOptions} />
            </div>

            <aside className="grid sm:grid-cols-2 xl:grid-cols-1 gap-4 animate-fade-up">
              <div className="rounded-[1.25rem] border border-border/60 bg-background p-6 shadow-soft">
                <h2 className="text-base font-semibold text-primary-deep">Предпочитате да се обадите?</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  Можете да запазите час и по телефона.
                </p>
                <div className="mt-4 space-y-4">
                  {Object.values(locations).map((loc) => (
                    <div key={loc.id}>
                      <p className="text-sm font-semibold text-primary-deep">{loc.city}</p>
                      <div className="mt-1 flex flex-col gap-1">
                        {loc.phones.map((p) => (
                          <a key={p} href={`tel:${p.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary-deep">
                            <Phone className="h-3.5 w-3.5" /> {p}
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="rounded-[1.25rem] border border-border/60 p-6"
                style={{
                  background:
                    "linear-gradient(180deg, color-mix(in oklab, var(--primary-soft) 18%, var(--background)) 0%, var(--background) 100%)",
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
                      Онлайн записването не е предназначено за спешна медицинска помощ.
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
