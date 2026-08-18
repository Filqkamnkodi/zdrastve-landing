import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartHandshake, Award, ShieldCheck, CalendarCheck, Phone } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import heroImgAsset from "@/assets/about-team-cholakovi.webp.asset.json";
const heroImg = heroImgAsset.url;
import { team } from "@/data/team";


export const Route = createFileRoute("/za-nas")({
  head: () => ({
    meta: [
      { title: "За нас — Клиника Д-р Чолакови" },
      {
        name: "description",
        content:
          "Запознайте се с екипа на Клиника Д-р Чолакови — опитни фамилни лекари и медицински специалисти с индивидуален подход, професионализъм и доверие.",
      },
      { property: "og:title", content: "За нас — Клиника Д-р Чолакови" },
      {
        property: "og:description",
        content:
          "Грижа, доверие и професионализъм — нашата философия и екипът от специалисти на Клиника Д-р Чолакови.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    icon: HeartHandshake,
    title: "Индивидуален подход",
    text: "Всеки пациент получава внимание, време и персонализирана грижа.",
  },
  {
    icon: Award,
    title: "Професионализъм",
    text: "Работим с доказани медицински практики и дългогодишен професионален опит.",
  },
  {
    icon: ShieldCheck,
    title: "Доверие",
    text: "Изграждаме дългосрочни отношения, основани на уважение, откритост и коректност.",
  },
];



function AboutPage() {
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
                  <li className="font-medium text-primary-deep">За нас</li>
                </ol>
              </nav>
              <div className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                За клиниката
              </div>
              <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-deep leading-tight">
                Грижа, доверие и професионализъм
              </h1>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                В „Клиника Д-р Чолакови“ разполагаме с екип от опитни фамилни лекари и
                медицински специалисти, които подхождат с внимание, изслушване, обяснение и
                индивидуална грижа към всеки пациент.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                Вярваме, че това е основата на точната диагноза, ефективното лечение и
                дългосрочното здраве на цялото семейство.
              </p>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                За нас усмивката, доверието и личното отношение са неразделна част от добрата
                медицина.
              </p>
            </div>
            <div className="overflow-hidden rounded-[1.25rem] shadow-soft animate-fade-up">
              <img
                src={heroImg}
                alt="Лекар разговаря с пациент в модерна светла клиника"
                width={1280}
                height={720}
                className="h-full w-full object-cover aspect-video"
              />
            </div>
          </div>
        </section>

        {/* Philosophy */}
        <section className="py-12 lg:py-16 bg-surface border-y border-border/60">
          <div className="container-page">
            <div className="max-w-2xl animate-fade-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep">
                Нашата философия
              </h2>
            </div>
            <div className="mt-8 grid sm:grid-cols-3 gap-5">
              {values.map((v) => (
                <article
                  key={v.title}
                  className="card-soft rounded-[1.25rem] p-6 animate-fade-up transition-shadow hover:shadow-soft"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft/25 text-primary-deep">
                    <v.icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-primary-deep">{v.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-12 lg:py-16">
          <div className="container-page">
            <div className="max-w-2xl animate-fade-up">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Нашият екип
              </div>
              <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-primary-deep">
                Запознайте се с нашите специалисти
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Нашият екип съчетава богат професионален опит, индивидуален подход и желание да
                осигури най-добрата грижа за всеки пациент.
              </p>
            </div>
            <Accordion
              type="single"
              collapsible
              className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5"
            >
              {team.map((m) => (
                <AccordionItem
                  key={m.name}
                  value={m.name}
                  className="card-soft rounded-[1.25rem] overflow-hidden border-b-0 animate-fade-up transition-all hover:-translate-y-1 hover:shadow-soft"
                >
                  <img
                    src={m.image}
                    alt={m.name}
                    loading="lazy"
                    width={800}
                    height={800}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="px-5 pt-4">
                    <h3 className="text-base font-semibold text-primary-deep">{m.name}</h3>
                  </div>
                  <div className="px-5 pb-1">
                    <AccordionTrigger className="text-sm text-primary hover:no-underline">
                      Повече информация
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {m.bio}
                    </AccordionContent>
                  </div>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="pb-12 lg:pb-16">
          <div className="container-page">
            <div className="rounded-[1.5rem] bg-primary-deep px-7 py-10 sm:px-10 text-center animate-fade-up">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-foreground">
                Доверете се на екип, който поставя пациента на първо място.
              </h2>
              <p className="mt-3 text-primary-foreground/80 leading-relaxed max-w-2xl mx-auto">
                Свържете се с нас, ако желаете повече информация или искате да запазите час за
                преглед.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Link to="/zapazi-chas" className="btn-ghost">
                  <CalendarCheck className="h-4 w-4" /> Запази час
                </Link>
                <a href="/#contact" className="btn-ghost">
                  <Phone className="h-4 w-4" /> Контакти
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
