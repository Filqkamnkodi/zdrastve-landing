import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { servicesList } from "@/data/services";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const service = servicesList.find((s) => s.slug === params.slug);
    const title = service ? `${service.title} — Клиника Д-р Чолакови` : "Услуга — Клиника Д-р Чолакови";
    const description = service?.desc ?? "Медицинска услуга в клиника Д-р Чолакови.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ServiceDetailPage,
});

function ServiceDetailPage() {
  const { slug } = Route.useParams();
  const service = servicesList.find((s) => s.slug === slug);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <section className="bg-surface border-b border-border/60">
          <div className="container-page py-12 lg:py-16">
            <Link to="/services" className="text-sm font-semibold text-primary hover:text-primary-deep">
              ← Всички услуги
            </Link>
            <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-primary-deep">
              {service?.title ?? "Услугата не е намерена"}
            </h1>
            {service && (
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground leading-relaxed">
                {service.desc}
              </p>
            )}
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="container-page grid lg:grid-cols-2 gap-10 items-start">
            {service && (
              <div className="overflow-hidden rounded-[1.25rem] shadow-soft">
                <img
                  src={service.image}
                  alt={service.title}
                  width={1024}
                  height={576}
                  className="h-full w-full object-cover aspect-video"
                />
              </div>
            )}
            <div>
              <h2 className="text-2xl font-bold text-primary-deep">Какво включва услугата</h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Съдържанието за тази страница предстои да бъде допълнено. Тук ще намерите
                подробно описание на процедурата, подготовката, продължителността и цените.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                За повече информация или за запазване на час, свържете се с нас по телефона
                или посетете някой от нашите кабинети.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/#cta" className="btn-primary">
                  <CalendarCheck className="h-5 w-5" /> Запазете час
                </a>
                <Link to="/services" className="btn-ghost">
                  Другите услуги <ArrowRight className="h-4 w-4" />
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
