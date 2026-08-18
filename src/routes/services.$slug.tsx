import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, Check, Phone } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { servicesList } from "@/data/services";
import { getServiceData } from "@/data/servicesData";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getServiceData(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Услугата не е намерена — Клиника Д-р Чолакови" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { service } = loaderData;
    const title = `${service.title} — Клиника Д-р Чолакови`;
    return {
      meta: [
        { title },
        { name: "description", content: service.intro },
        { property: "og:title", content: title },
        { property: "og:description", content: service.intro },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ServiceNotFound,
  component: ServiceDetailPage,
});

function ServiceNotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="container-page py-24 text-center">
        <h1 className="text-3xl font-bold text-primary-deep">Услугата не е намерена</h1>
        <p className="mt-4 text-muted-foreground">
          Възможно е страницата да е преместена или адресът да е неточен.
        </p>
        <Link to="/services" className="btn-primary mt-8 inline-flex">
          Всички услуги <ArrowRight className="h-4 w-4" />
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function ServiceDetailPage() {
  const { service } = Route.useLoaderData();
  const related = service.relatedServices
    .map((slug) => servicesList.find((s) => s.slug === slug))
    .filter((s): s is (typeof servicesList)[number] => Boolean(s));

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
          <div className="container-page py-12 lg:py-20 grid lg:grid-cols-2 gap-10 items-center">
            <div className="animate-fade-up">
              <nav aria-label="breadcrumb" className="text-sm text-muted-foreground">
                <ol className="flex flex-wrap items-center gap-1.5">
                  <li>
                    <Link to="/" className="hover:text-primary transition-colors">
                      Начало
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link to="/services" className="hover:text-primary transition-colors">
                      {service.eyebrow}
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="font-medium text-primary-deep">{service.title}</li>
                </ol>
              </nav>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-deep leading-tight">
                {service.title}
              </h1>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
                {service.intro}
              </p>
            </div>
            <div className="overflow-hidden rounded-[1.25rem] shadow-soft animate-fade-up">
              <img
                src={service.heroImage}
                alt={service.title}
                width={1024}
                height={576}
                className="h-full w-full object-cover aspect-video"
              />
            </div>
          </div>
        </section>

        {/* Overview */}
        {service.overview.length > 0 && (
          <section className="py-12 lg:py-16">
            <div className="container-page animate-fade-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep">
                {service.overviewTitle}
              </h2>
              <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">
                {service.overview.map((block, i) =>
                  block.type === "paragraph" ? (
                    <p key={i} className="whitespace-pre-line">
                      {block.text}
                    </p>
                  ) : (
                    <ul key={i} className="space-y-2">
                      {block.items.map((item, j) => (
                        <li key={j} className="flex gap-2">
                          <span aria-hidden="true">–</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ),
                )}
              </div>
            </div>
          </section>
        )}

        {/* Includes */}
        {service.includes.length > 0 && (
          <section className="py-12 lg:py-16 bg-surface">
            <div className="container-page animate-fade-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep">
                Какво включва услугата
              </h2>
              <ul className="mt-6 grid sm:grid-cols-2 gap-4">
                {service.includes.map((item) => (
                  <li key={item} className="flex gap-3 text-muted-foreground">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Recommended */}
        {service.recommendedFor.length > 0 && (
          <section className="py-12 lg:py-16">
            <div className="container-page animate-fade-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep">
                Кога е препоръчителна тази услуга?
              </h2>
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.recommendedFor.map((r) => (
                  <div key={r.title} className="card-soft rounded-[1.25rem] p-6">
                    <h3 className="text-lg font-semibold text-primary-deep">{r.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {r.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        {service.faq.length > 0 && (
          <section className="py-12 lg:py-16 bg-surface">
            <div className="container-page animate-fade-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep text-center">
                {service.faqTitle}
              </h2>
              <div className="mt-10 max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                  {service.faq.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`}>
                      <AccordionTrigger className="text-base font-medium text-primary-deep">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-12 lg:py-16">
          <div className="container-page">
            <div className="card-soft rounded-[1.25rem] p-8 lg:p-12 text-center animate-fade-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep">
                {service.ctaTitle}
              </h2>
              <p className="mt-4 mx-auto max-w-2xl text-muted-foreground leading-relaxed">
                {service.ctaText}
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a href="/#cta" className="btn-primary">
                  <CalendarCheck className="h-5 w-5" /> Запазете час
                </a>
                <a href="/#contact" className="btn-ghost">
                  <Phone className="h-4 w-4" /> Свържете се с нас
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section className="pb-16 lg:pb-24">
            <div className="container-page">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep animate-fade-up">
                Свързани услуги
              </h2>
              <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((s) => (
                  <Link
                    key={s.slug}
                    to="/services/$slug"
                    params={{ slug: s.slug }}
                    className="group card-soft overflow-hidden flex flex-col rounded-[1.25rem] animate-fade-up"
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
                      <h3 className="text-lg font-semibold text-primary-deep">{s.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                        {s.desc}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all duration-[250ms] group-hover:gap-2.5">
                        Научете повече <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
