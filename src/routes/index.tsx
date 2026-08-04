import { createFileRoute } from "@tanstack/react-router";
import {
  Stethoscope,
  HeartPulse,
  FileText,
  Baby,
  ScanLine,
  ShieldCheck,
  Award,
  Users,
  Sparkles,
  Microscope,
  MapPin,
  Phone,
  Clock,
  ArrowRight,
  Star,
  CalendarCheck,
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  Menu,
  Info,
} from "lucide-react";
import heroImg from "@/assets/hero-clinic.jpg";
import teamImg from "@/assets/team.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Клиника Д-р Чолакови — Вашето здраве е нашият приоритет" },
      {
        name: "description",
        content:
          "Професионална медицинска грижа, модерна апаратура и индивидуален подход. Запазете час онлайн в клиника Д-р Чолакови.",
      },
      { property: "og:title", content: "Клиника Д-р Чолакови" },
      {
        property: "og:description",
        content:
          "Професионална медицинска грижа, модерна апаратура и индивидуален подход към всеки пациент.",
      },
    ],
  }),
  component: LandingPage,
});

const services = [
  {
    icon: ShieldCheck,
    title: "Прегледи и консултации",
    desc: "Първични и вторични медицински прегледи, домашна визита с преглед и транспорт.",
  },
  {
    icon: Stethoscope,
    title: "Манипулации и медицински процедури",
    desc: "Медицински манипулации като обработка на рани, вадене на кърлежи, поставяне на инжекции и превръзки. Предлагаме още венозни вливания, вземане на кръв и други амбулаторни процедури.",
  },
  {
    icon: FileText,
    title: "Медицински свидетелства, удостоверения и административни документи",
    desc: "медицински свидетелства и удостоверения за работа, шофьорска книжка, брак и други административни цели. Предлагаме и болнични листове, заверка на здравни книжки и съдействие по медицинска документация.",
  },
  {
    icon: Baby,
    title: "Педиатрия",
    desc: "Внимателна грижа за бебета, деца и юноши от опитни специалисти.",
  },
  {
    icon: ScanLine,
    title: "Образна диагностика",
    desc: "Ехография на млечна и щитовидна жлези, коремни органи и ЕКГ по желание.",
  },
];

const features = [
  { icon: Award, title: "Професионализъм", desc: "Екип от висококвалифицирани специалисти." },
  { icon: Users, title: "Богат опит", desc: "Дългогодишна практика и доказани резултати." },
  { icon: Sparkles, title: "Комфортна среда", desc: "Спокойна и приятна атмосфера за пациентите." },
  { icon: Microscope, title: "Модерно оборудване", desc: "Съвременна апаратура за точна диагностика и лечение." },
];

const locations = [
  {
    name: "МедиКеър Шумен",
    address: 'ул. "Васил Друмев" 17, 9700',
    hours: "Пон–Четв: 8:00 – 16:30\nПетък: 8:00 - 12:30\nСб-Нд: Почивни дни",
    phone: "+359 886 011 166\n+359 885 646 724",
  },
  {
    name: "МедиКеър Нови Пазар",
    address: "ул. Христо Ботев 22, каб. номер 3 и манипулационна номер 4",
    hours: "Пон–Четв: 8:00 – 16:00\nПетък: 8:00-13:00\nСб-Нд: Почивни дни",
    phone: "+359 896 600 290",
  },
];


const testimonials = [
  { name: "Мария П.", text: "Изключително професионално отношение и отлично обслужване." },
  { name: "Георги И.", text: "Модерна клиника и много внимателен персонал." },
  { name: "Елена Д.", text: "Получих бърза и качествена медицинска помощ." },
  { name: "Николай С.", text: "Прекрасни специалисти и спокойна атмосфера. Препоръчвам!" },
];

const stats = [
  { value: "25+", label: "години опит" },
  { value: "20+", label: "специалисти" },
  { value: "15 000+", label: "доволни пациенти" },
  { value: "98%", label: "удовлетвореност" },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <PatientRegistration />
        <Services />
        <Locations />
        <WhyUs />
        <About />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-border/60">
      <div className="container-page flex h-16 items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-deep text-primary-foreground">
            <HeartPulse className="h-5 w-5" />
          </span>
          <span className="font-display text-sm font-bold tracking-tight text-primary-deep leading-tight whitespace-pre-line">
            Клиника{"\n"}Д-р Чолакови
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#services" className="hover:text-primary-deep transition">Услуги</a>
          <a href="#locations" className="hover:text-primary-deep transition">Локации</a>
          <a href="#about" className="hover:text-primary-deep transition">За нас</a>
          <a href="#testimonials" className="hover:text-primary-deep transition">Отзиви</a>
          <a href="#contact" className="hover:text-primary-deep transition">Контакти</a>
        </nav>
        <div className="flex items-center gap-2">
          <a href="#cta" className="btn-primary hidden sm:inline-flex !py-2.5 !px-5 text-sm">
            <CalendarCheck className="h-4 w-4" /> Запази час
          </a>
          <button aria-label="Меню" className="md:hidden grid h-10 w-10 place-items-center rounded-full border border-border">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(1200px 600px at 80% -10%, color-mix(in oklab, var(--primary-soft) 35%, transparent), transparent 60%), linear-gradient(180deg, var(--surface) 0%, white 100%)",
        }}
      />
      <div className="container-page grid lg:grid-cols-2 gap-12 lg:gap-16 py-16 lg:py-24 items-center">
        <div className="animate-fade-up">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-primary-deep whitespace-pre-line">
            Медицина{"\n"}с човешко лице
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
            От профилактичен преглед до домашна визита – осигуряваме качествена
            медицинска помощ в спокойна и сигурна среда. Доверете се на
            професионализъм, съчетан с лично отношение.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#cta" className="btn-primary">
              <CalendarCheck className="h-5 w-5" /> Запазете час
            </a>
            <a href="#contact" className="btn-ghost">
              Свържете се с нас <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            <TrustStat value="25+" label="години опит" />
            <TrustStat value="15K+" label="пациенти" />
            <TrustStat value="98%" label="удовлетвореност" />
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-[2rem] shadow-glow">
            <img
              src={heroImg}
              alt="Лекар разговаря с пациент в модерна клиника"
              width={1664}
              height={1216}
              className="h-full w-full object-cover aspect-[4/3]"
            />
          </div>

          <div className="hidden sm:flex absolute -left-6 bottom-10 card-soft p-4 pr-5 items-center gap-3 animate-float">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-soft/30 text-primary-deep">
              <HeartPulse className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-semibold">Грижа 24/7</div>
              <div className="text-xs text-muted-foreground">Спешни консултации</div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

function TrustStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-bold text-primary-deep font-display">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}

function PatientRegistration() {
  return (
    <section className="py-6 lg:py-8">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-surface p-8 lg:p-10">
          <div className="flex flex-col md:flex-row md:items-start gap-6 lg:gap-8">
            <div className="shrink-0">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white border border-border/60 text-primary-deep shadow-soft">
                <Info className="h-7 w-7" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl lg:text-3xl font-bold text-primary-deep">
                Записване на нови пациенти
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed max-w-3xl">
                Записването на нови пациенти се извършва само с лична карта всяка година в следните периоди:
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center gap-3 text-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span>
                    от <span className="font-semibold text-primary-deep">1 юни</span> до <span className="font-semibold text-primary-deep">30 юни</span> (включително)
                  </span>
                </li>
                <li className="flex items-center gap-3 text-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  <span>
                    от <span className="font-semibold text-primary-deep">1 декември</span> до <span className="font-semibold text-primary-deep">31 декември</span> (включително)
                  </span>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-border/60">
                <p className="text-foreground leading-relaxed">
                  Ако желаете да запишете дете, е необходимо да представите:
                </p>
                <ul className="mt-4 space-y-2.5">
                  <li className="flex items-start gap-3 text-foreground">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-deep shrink-0" />
                    <span>Акт за раждане или лична карта (ако има такава);</span>
                  </li>
                  <li className="flex items-start gap-3 text-foreground">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary-deep shrink-0" />
                    <span>Личен амбулаторен картон (ЛАК) от предишния общопрактикуващ лекар.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {eyebrow}
      </div>
      <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-primary-deep">{title}</h2>
      {desc && <p className="mt-4 text-muted-foreground leading-relaxed">{desc}</p>}
    </div>
  );
}

function Services() {
  return (
    <section id="services" className="py-12 lg:py-16">
      <div className="container-page">
        <SectionHeader
          eyebrow="Нашите услуги"
          title="Цялостна грижа за вашето здраве"
          desc="Профилактика, диагностика и лечение, извършвани от опитни медицински специалисти с индивидуален подход към всеки пациент."
        />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <article key={s.title} className="card-soft p-7 group">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-soft/20 text-primary-deep group-hover:bg-primary-deep group-hover:text-primary-foreground transition-colors">
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-primary-deep">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              <a href="#contact" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all">
                Научете повече <ArrowRight className="h-4 w-4" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Locations() {
  return (
    <section id="locations" className="py-20 lg:py-28 bg-surface">
      <div className="container-page">
        <SectionHeader
          eyebrow="Локации"
          title="Нашите локации"
          desc="Намерете най-близкия до вас клон на МедиКеър."
        />
        <div className="mt-14 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {locations.map((loc) => (
            <article key={loc.name} className="card-soft overflow-hidden">
              <div
                className="h-40 w-full"
                style={{
                  background:
                    "linear-gradient(135deg, color-mix(in oklab, var(--primary-soft) 50%, white) 0%, color-mix(in oklab, var(--primary) 40%, white) 100%)",
                }}
                aria-hidden
              >
                <div className="h-full w-full grid place-items-center text-primary-deep/50">
                  <MapPin className="h-10 w-10" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-primary-deep">{loc.name}</h3>
                <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex gap-3"><MapPin className="h-4 w-4 mt-0.5 shrink-0 text-primary" />{loc.address}</li>
                  <li className="flex gap-3 whitespace-pre-line"><Clock className="h-4 w-4 mt-0.5 shrink-0 text-primary" />{loc.hours}</li>
                  <li className="flex gap-3 whitespace-pre-line"><Phone className="h-4 w-4 mt-0.5 shrink-0 text-primary" />{loc.phone}</li>
                </ul>
                <button className="btn-ghost mt-6 w-full !py-2.5 text-sm">
                  Виж на картата <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container-page">
        <SectionHeader eyebrow="Предимства" title="Защо да изберете нас" />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <article key={f.title} className="card-soft p-7 text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-deep text-primary-foreground shadow-soft">
                <f.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-primary-deep">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-20 lg:py-28 bg-surface">
      <div className="container-page grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] shadow-card">
            <img
              src={teamImg}
              alt="Екипът на клиника МедиКеър"
              width={1408}
              height={1408}
              loading="lazy"
              className="h-full w-full object-cover aspect-square"
            />
          </div>
          <div className="hidden md:block absolute -bottom-6 -right-6 card-soft p-5 max-w-[200px]">
            <div className="text-3xl font-bold text-primary-deep font-display">15K+</div>
            <div className="text-xs text-muted-foreground mt-1">доволни пациенти през годините</div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">За нас</div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold text-primary-deep">
            Здравна грижа, която поставя пациента в центъра
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            Ние сме медицинска клиника, посветена на предоставянето на висококачествени
            здравни услуги. Нашата мисия е да осигурим професионална грижа, индивидуален
            подход и комфорт за всеки пациент.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-5">
            {stats.map((s) => (
              <div key={s.label} className="card-soft p-5">
                <div className="text-2xl font-bold text-primary-deep font-display">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section id="testimonials" className="py-20 lg:py-28">
      <div className="container-page">
        <SectionHeader eyebrow="Отзиви" title="Какво казват нашите пациенти" />
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((t) => (
            <article key={t.name} className="card-soft p-7">
              <div className="flex gap-0.5 text-primary">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-4 text-foreground leading-relaxed">"{t.text}"</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-primary-soft/30 text-primary-deep font-semibold">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">Пациент</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section id="cta" className="py-20 lg:py-28">
      <div className="container-page">
        <div
          className="relative overflow-hidden rounded-[2rem] px-8 py-16 sm:px-16 sm:py-20 text-center"
          style={{ background: "var(--gradient-hero)" }}
        >
          <div className="absolute inset-0 opacity-20" aria-hidden style={{
            background: "radial-gradient(600px 300px at 20% 0%, white, transparent), radial-gradient(500px 250px at 90% 100%, white, transparent)"
          }} />
          <div className="relative">
            <h2 className="text-3xl sm:text-5xl font-bold text-primary-foreground">
              Погрижете се за здравето си още днес
            </h2>
            <p className="mt-5 text-primary-foreground/85 max-w-xl mx-auto">
              Запишете час за консултация с нашите специалисти.
            </p>
            <a
              href="#"
              className="mt-8 inline-flex items-center gap-2 bg-white text-primary-deep px-7 py-3.5 rounded-full font-semibold hover:bg-surface transition shadow-soft"
            >
              <CalendarCheck className="h-5 w-5" /> Запази час
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-surface">
      <div className="container-page py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-deep text-primary-foreground">
              <HeartPulse className="h-5 w-5" />
            </span>
            <span className="font-display text-base font-bold text-primary-deep whitespace-pre-line leading-tight">
              Клиника{"\n"}Д-р Чолакови
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Модерна медицинска клиника, посветена на здравето и комфорта на всеки пациент.
          </p>
          <div className="mt-5 flex gap-2">
            {[Facebook, Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" aria-label="Социална мрежа" className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground hover:text-primary-deep hover:border-primary transition">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-primary-deep">Навигация</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><a href="#services" className="hover:text-primary-deep">Услуги</a></li>
            <li><a href="#locations" className="hover:text-primary-deep">Локации</a></li>
            <li><a href="#about" className="hover:text-primary-deep">За нас</a></li>
            <li><a href="#testimonials" className="hover:text-primary-deep">Отзиви</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-primary-deep">Контакти</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li className="flex gap-2"><Phone className="h-4 w-4 mt-0.5 text-primary" /> +359 886 011 166</li>
            <li className="flex gap-2"><Mail className="h-4 w-4 mt-0.5 text-primary" /> contact@cholakoviclinic.bg</li>
            <li className="flex gap-2"><MapPin className="h-4 w-4 mt-0.5 text-primary" /> ул. "Васил Друмев" 17, Шумен</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-primary-deep">Правна информация</h4>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary-deep">Политика за поверителност</a></li>
            <li><a href="#" className="hover:text-primary-deep">GDPR</a></li>
            <li><a href="#" className="hover:text-primary-deep">Общи условия</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-page py-6 flex flex-col sm:flex-row gap-2 items-center justify-between text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} МедиКеър Клиника. Всички права запазени.</div>
          <div>Направено с грижа за вашето здраве.</div>
        </div>
      </div>
    </footer>
  );
}
