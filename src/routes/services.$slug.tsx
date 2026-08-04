import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, CheckCircle2, Phone } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { servicesList } from "@/data/services";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const includes = [
  "Първоначален разговор и оценка на състоянието",
  "Подробен медицински преглед от специалист",
  "Разясняване на необходимите документи и стъпки",
  "Издаване на съответната медицинска документация",
  "Насоки за проследяване и последващи консултации",
];

const recommended = [
  {
    title: "При първи симптоми",
    text: "Когато забележите промяна в състоянието си и се нуждаете от професионална оценка.",
  },
  {
    title: "Профилактично",
    text: "Ежегодно проследяване на здравословното състояние и ранно откриване на рискове.",
  },
  {
    title: "По административен повод",
    text: "Когато Ви е необходим официален медицински документ за работа или институция.",
  },
  {
    title: "След лечение",
    text: "За контролен преглед и оценка на резултатите от проведената терапия.",
  },
  {
    title: "При хронично заболяване",
    text: "Регулярно наблюдение и адаптиране на терапията според състоянието.",
  },
  {
    title: "По препоръка на специалист",
    text: "Когато друг лекар е насочил към допълнителна консултация или изследване.",
  },
];

const faqs = [
  {
    q: "Необходимо ли е предварително записване на час?",
    a: "Препоръчваме предварително записване по телефона, за да Ви осигурим удобен час без чакане.",
  },
  {
    q: "Какви документи да нося със себе си?",
    a: "Носете лична карта, здравноосигурителна книжка и налична медицинска документация от предишни прегледи.",
  },
  {
    q: "Колко време отнема услугата?",
    a: "В повечето случаи посещението отнема между 20 и 40 минути в зависимост от конкретния случай.",
  },
  {
    q: "Покрива ли се услугата от НЗОК?",
    a: "Част от услугите се покриват от Здравната каса. Екипът ни ще Ви информира при записване на час.",
  },
];

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = servicesList.find((s) => s.slug === params.slug);
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
        { name: "description", content: service.desc },
        { property: "og:title", content: title },
        { property: "og:description", content: service.desc },
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
  const related = servicesList.filter((s) => s.slug !== service.slug).slice(0, 3);

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
                      Медицински услуги
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li className="font-medium text-primary-deep">{service.title}</li>
                </ol>
              </nav>
              <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-deep leading-tight">
                {service.title}
              </h1>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">{service.desc}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="/#cta" className="btn-primary">
                  <CalendarCheck className="h-5 w-5" /> Запазете час
                </a>
                <Link to="/services" className="btn-ghost">
                  Всички услуги <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="overflow-hidden rounded-[1.25rem] shadow-soft animate-fade-up">
              <img
                src={service.image}
                alt={service.title}
                width={1024}
                height={576}
                className="h-full w-full object-cover aspect-video"
              />
            </div>
          </div>
        </section>

        {/* Overview */}
        <section className="py-12 lg:py-16">
          <div className="container-page grid lg:grid-cols-2 gap-10 items-center">
            <div className="animate-fade-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep">
                За услугата
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Съдържанието за тази страница предстои да бъде допълнено. Тук ще намерите
                подробно описание на процедурата, необходимата подготовка, продължителността
                и какво да очаквате по време на посещението.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Екипът ни работи с индивидуален подход към всеки пациент и осигурява
                спокойна и сигурна среда, в която да получите ясни отговори на въпросите си.
              </p>
            </div>
            <div className="overflow-hidden rounded-[1.25rem] shadow-soft animate-fade-up">
              <img
                src={service.image}
                alt={`${service.title} — Клиника Д-р Чолакови`}
                loading="lazy"
                width={1024}
                height={576}
                className="h-full w-full object-cover aspect-video"
              />
            </div>
          </div>
        </section>

        {/* Includes */}
        <section className="py-12 lg:py-16 bg-surface border-y border-border/60">
          <div className="container-page">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep animate-fade-up">
              Какво включва услугата
            </h2>
            <ul className="mt-8 grid sm:grid-cols-2 gap-4">
              {includes.map((item) => (
                <li key={item} className="flex items-start gap-3 animate-fade-up">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span className="text-muted-foreground leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Recommended */}
        <section className="py-12 lg:py-16">
          <div className="container-page">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep animate-fade-up">
              Кога е препоръчителна тази услуга?
            </h2>
            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommended.map((r) => (
                <div key={r.title} className="card-soft p-6 rounded-[1.25rem] animate-fade-up">
                  <h3 className="text-lg font-semibold text-primary-deep">{r.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 lg:py-16 bg-surface border-y border-border/60">
          <div className="container-page max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep animate-fade-up">
              Често задавани въпроси
            </h2>
            <Accordion type="single" collapsible className="mt-6">
              {faqs.map((f) => (
                <AccordionItem key={f.q} value={f.q}>
                  <AccordionTrigger className="text-left text-primary-deep">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 lg:py-16">
          <div className="container-page">
            <div className="card-soft rounded-[1.25rem] p-8 lg:p-12 text-center animate-fade-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep">
                Нуждаете се от повече информация?
              </h2>
              <p className="mt-4 mx-auto max-w-2xl text-muted-foreground leading-relaxed">
                Свържете се с нас или запазете час — екипът на клиниката ще Ви консултира
                и ще Ви насочи към най-подходящото решение за Вашия случай.
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
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all duration-[250ms] group-hover:gap-2.5">
                      Научете повече <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
