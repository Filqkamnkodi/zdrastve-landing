import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { servicesList } from "@/data/services";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Медицински услуги — Клиника Д-р Чолакови" },
      {
        name: "description",
        content:
          "Пълен набор от медицински услуги в клиника Д-р Чолакови: прегледи, манипулации, образна диагностика, имунизации и домашни визитации.",
      },
      { property: "og:title", content: "Медицински услуги — Клиника Д-р Чолакови" },
      {
        property: "og:description",
        content:
          "Разгледайте пълния набор от медицински услуги, които предлагаме. Изберете услуга, за да научите повече.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(900px 420px at 75% -20%, color-mix(in oklab, var(--primary-soft) 32%, transparent), transparent 60%), linear-gradient(180deg, var(--surface) 0%, white 100%)",
            }}
          />
          <div className="container-page py-14 lg:py-20">
            <div className="max-w-3xl animate-fade-up">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Нашите услуги
              </div>
              <h1 className="mt-3 text-4xl sm:text-5xl font-bold text-primary-deep leading-tight">
                Медицински услуги
              </h1>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                Разгледайте пълния набор от медицински услуги, които предлагаме.
                Изберете услуга, за да научите повече.
              </p>
            </div>
          </div>
        </section>

        <section className="pb-16 lg:pb-24">
          <div className="container-page grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesList.map((s) => (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group card-soft overflow-hidden flex flex-col rounded-[1.25rem]"
              >
                <div className="overflow-hidden aspect-video">
                  <img
                    src={s.image}
                    alt={s.title}
                    loading="lazy"
                    width={1024}
                    height={576}
                    className="h-full w-full object-cover transition-transform duration-[250ms] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h2 className="text-lg font-semibold text-primary-deep">{s.title}</h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all duration-[250ms] group-hover:gap-2.5">
                    Научете повече <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
