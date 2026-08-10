import { createFileRoute, Link } from "@tanstack/react-router";
import {
  HelpCircle,
  CalendarCheck,
  Phone,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqCategories } from "@/data/faq";
import heroImg from "@/assets/faq-hero.jpg";

const icons = {
  general: HelpCircle,
} as const;

export const Route = createFileRoute("/chesto-zadavani-vaprosi")({
  head: () => ({
    meta: [
      { title: "Често задавани въпроси — Клиника Д-р Чолакови" },
      {
        name: "description",
        content:
          "Отговори на най-често задаваните въпроси за прегледите, записването на час, имунизациите и административните услуги в Клиника Д-р Чолакови.",
      },
      { property: "og:title", content: "Често задавани въпроси — Клиника Д-р Чолакови" },
      {
        property: "og:description",
        content:
          "Полезна информация за пациенти: прегледи, записване на час, имунизации и медицински документи.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
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
                  <li className="font-medium text-primary-deep">Често задавани въпроси</li>
                </ol>
              </nav>
              <div className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Полезна информация
              </div>
              <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-deep leading-tight">
                Често задавани въпроси
              </h1>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                Тук ще откриете отговори на най-често задаваните въпроси относно прегледите,
                записването на час, имунизациите и услугите, които предлагаме.
              </p>
            </div>
            <div className="overflow-hidden rounded-[1.25rem] shadow-soft animate-fade-up">
              <img
                src={heroImg}
                alt="Медицински специалист отговаря на въпроси на пациент в клиниката"
                width={1280}
                height={720}
                className="h-full w-full object-cover aspect-video"
              />
            </div>
          </div>
        </section>

        {/* FAQ sections */}
        <section className="py-12 lg:py-16">
          <div className="container-page max-w-4xl space-y-12">
            {faqCategories.map((c) => (
              <section key={c.id} id={c.id} className="scroll-mt-24 animate-fade-up">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep">{c.title}</h2>
                <Accordion type="single" collapsible className="mt-5 space-y-3">
                  {c.items.map((item, i) => (
                    <AccordionItem
                      key={i}
                      value={`${c.id}-${i}`}
                      className="card-soft rounded-[1.25rem] border border-border/60 px-5 transition-colors hover:border-primary/40"
                    >
                      <AccordionTrigger className="py-5 text-left text-base font-semibold text-primary-deep hover:no-underline">
                        {item.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                        {item.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="pb-12 lg:pb-16">
          <div className="container-page">
            <div className="rounded-[1.5rem] bg-primary-deep px-7 py-10 sm:px-10 text-center animate-fade-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground">
                Не открихте отговора, който търсите?
              </h2>
              <p className="mt-3 text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
                Ако не намерихте необходимата информация, свържете се с нашия екип. Ще се
                радваме да ви помогнем.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <a href="/#contact" className="btn-ghost">
                  <Phone className="h-4 w-4" /> Свържете се с нас
                </a>
                <Link to="/zapazi-chas" className="btn-ghost">
                  <CalendarCheck className="h-4 w-4" /> Запази час
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
