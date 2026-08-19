import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Info } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { CtaSection } from "@/components/CtaSection";
import { pricingCategories } from "@/data/pricing";

export const Route = createFileRoute("/ceni")({
  head: () => ({
    meta: [
      { title: "Цени на медицинските услуги | Клиника Д-р Чолакови" },
      {
        name: "description",
        content:
          "Разгледайте актуалното ценово разписание на медицинските услуги, предлагани в Клиника Д-р Чолакови.",
      },
      { property: "og:title", content: "Цени на медицинските услуги | Клиника Д-р Чолакови" },
      {
        property: "og:description",
        content:
          "Разгледайте актуалното ценово разписание на медицинските услуги, предлагани в Клиника Д-р Чолакови.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://zdrastve-landing.lovable.app/ceni" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://zdrastve-landing.lovable.app/ceni" }],
  }),
  component: PricingPage,
});

function PricingPage() {
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
          <div className="container-page py-10 lg:py-14">
            <nav aria-label="Навигация" className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary-deep transition">
                Начало
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <Link to="/services" className="hover:text-primary-deep transition">
                Услуги
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="text-primary-deep font-medium">Цени</span>
            </nav>

            <div className="mt-6 max-w-3xl animate-fade-up">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Ценово разписание
              </div>
              <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-deep leading-tight">
                Цени на медицинските услуги
              </h1>
              <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                Запознайте се с цените на медицинските услуги, предлагани в „Клиника Д-р Чолакови“.
              </p>
            </div>
          </div>
        </section>

        {/* Price list */}
        <section className="py-10 lg:py-14">
          <div className="container-page">
            {/* Category nav */}
            <nav aria-label="Категории" className="flex flex-wrap gap-2">
              {pricingCategories.map((cat) => (
                <a
                  key={cat.id}
                  href={`#${cat.id}`}
                  className="rounded-full border border-border bg-white px-4 py-2 text-sm font-medium text-primary-deep transition-colors hover:border-primary hover:bg-primary-soft/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {cat.title}
                </a>
              ))}
            </nav>

            <div className="mt-10 space-y-12">
              {pricingCategories.map((cat) => (
                <div key={cat.id} id={cat.id} className="scroll-mt-24">
                  <h2 className="text-xl sm:text-2xl font-bold text-primary-deep">{cat.title}</h2>
                  <div className="mt-3 h-px w-full bg-border" />
                  <ul className="mt-1 divide-y divide-border/70">
                    {cat.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start justify-between gap-6 rounded-lg px-2 py-3.5 transition-colors hover:bg-primary-soft/15"
                      >
                        <div className="min-w-0">
                          <div className="text-base font-medium text-primary-deep">{item.name}</div>
                          {item.note && (
                            <div className="mt-1 text-sm text-muted-foreground leading-relaxed">
                              {item.note}
                            </div>
                          )}
                        </div>
                        <div className="shrink-0 whitespace-nowrap text-base font-semibold text-primary">
                          {item.price}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Important notice */}
            <div className="mt-12 rounded-[1.25rem] border border-border bg-surface p-6 lg:p-8">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <h2 className="text-lg font-semibold text-primary-deep">Важно</h2>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    Посочените цени имат информативен характер. При въпроси относно конкретна услуга
                    можете да се свържете с екипа на клиниката.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
