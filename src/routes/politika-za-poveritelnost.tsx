import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Shield, Mail, Phone, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/politika-za-poveritelnost")({
  head: () => ({
    meta: [
      { title: "Политика за поверителност | Клиника Д-р Чолакови" },
      {
        name: "description",
        content:
          "Информация относно обработването и защитата на личните данни при използване на уебсайта на Клиника Д-р Чолакови.",
      },
      { property: "og:title", content: "Политика за поверителност | Клиника Д-р Чолакови" },
      {
        property: "og:description",
        content:
          "Информация относно обработването и защитата на личните данни при използване на уебсайта на Клиника Д-р Чолакови.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

const sections = [
  { id: "administrator", label: "Администратор на лични данни" },
  { id: "collect", label: "Какви лични данни събираме" },
  { id: "do-not-send", label: "Данни, които не трябва да изпращате" },
  { id: "purposes", label: "За какви цели използваме данните" },
  { id: "legal-basis", label: "Правно основание за обработване" },
  { id: "retention", label: "Колко дълго съхраняваме данните" },
  { id: "sharing", label: "С кого могат да бъдат споделяни данните" },
  { id: "transfer", label: "Международен трансфер на данни" },
  { id: "cookies", label: "Cookies" },
  { id: "rights", label: "Вашите права" },
  { id: "security", label: "Сигурност на информацията" },
  { id: "external", label: "Външни връзки" },
  { id: "changes", label: "Промени в политиката" },
  { id: "contact", label: "Контакт относно личните данни" },
];

function PrivacyPage() {
  const [tocOpen, setTocOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main id="main-content" className="flex-1">
        {/* Hero */}
        <section className="pt-10 pb-8 lg:pt-14 lg:pb-10 border-b border-border/60">
          <div className="container-page">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/" className="hover:text-primary-deep transition">
                    Начало
                  </Link>
                </li>
                <li>
                  <ChevronRight className="h-4 w-4" />
                </li>
                <li className="text-primary-deep font-medium">Политика за поверителност</li>
              </ol>
            </nav>
            <div className="mt-6 max-w-3xl">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Правна информация
              </span>
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-primary-deep">
                Политика за поверителност
              </h1>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Настоящата Политика за поверителност описва как се обработват и защитават личните
                данни на посетителите и пациентите при използване на този уебсайт и неговите
                функционалности.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-10 lg:py-14">
          <div className="container-page">
            <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12">
              {/* Table of contents — mobile expandable */}
              <div className="mb-8 lg:mb-0">
                <div className="lg:hidden">
                  <button
                    type="button"
                    onClick={() => setTocOpen((v) => !v)}
                    className="w-full flex items-center justify-between rounded-[1rem] border border-border/60 bg-white p-4 text-left shadow-soft"
                    aria-expanded={tocOpen}
                    aria-controls="toc-mobile"
                  >
                    <span className="font-semibold text-primary-deep">Съдържание</span>
                    {tocOpen ? (
                      <ChevronUp className="h-5 w-5 text-primary" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-primary" />
                    )}
                  </button>
                  {tocOpen && (
                    <nav
                      id="toc-mobile"
                      aria-label="Съдържание на страницата"
                      className="mt-3 rounded-[1rem] border border-border/60 bg-white p-4 shadow-soft"
                    >
                      <TocList />
                    </nav>
                  )}
                </div>
                <nav
                  aria-label="Съдържание на страницата"
                  className="hidden lg:block sticky top-24 rounded-[1.25rem] border border-border/60 bg-white p-6 shadow-soft"
                >
                  <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-primary-deep mb-4">
                    Съдържание
                  </h2>
                  <TocList />
                </nav>
              </div>

              {/* Main text */}
              <article className="max-w-3xl">
                <Section id="administrator" title="Администратор на лични данни">
                  <p>Администратор на личните данни е:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <span className="font-medium text-primary-deep">Наименование:</span> ЕТ
                      „АПИМП-ИП-МИЛЕН ЧОЛАКОВ-КЛИНИКА Д-Р ЧОЛАКОВИ“
                    </li>
                    <li>
                      <span className="font-medium text-primary-deep">ЕИК:</span> BG127557099
                    </li>
                    <li>
                      <span className="font-medium text-primary-deep">Адрес:</span> гр. Шумен, ул.
                      „Васил Друмев“ № 17
                    </li>
                    <li>
                      <span className="font-medium text-primary-deep">Телефон:</span> 054 876 979
                    </li>
                    <li>
                      <span className="font-medium text-primary-deep">Имейл:</span>{" "}
                      contact@cholakoviclinic.bg
                    </li>
                  </ul>
                </Section>

                <Section id="collect" title="Какви лични данни събираме">
                  <p>
                    Чрез контактните форми и функционалностите на уебсайта може да обработваме
                    информация, която доброволно предоставяте, като:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Име и фамилия</li>
                    <li>Телефон</li>
                    <li>Имейл адрес</li>
                    <li>Информация, необходима за обработване на запитване или заявка за час</li>
                  </ul>
                  <p>
                    Освен това, при използване на сайта може да се записва техническа информация,
                    като IP адрес, браузър/устройство и базови данни за използването на сайта,
                    когато това е необходимо за неговата сигурност и нормална работа.
                  </p>
                </Section>

                <InfoBox id="do-not-send" title="Данни, които не трябва да изпращате чрез сайта">
                  <p>
                    Моля, не изпращайте чрез стандартните контактни форми ЕГН, медицински диагнози,
                    резултати от изследвания, медицинска документация или друга чувствителна
                    здравна информация, освен ако за това не е предоставен специално предназначен и
                    защитен канал.
                  </p>
                </InfoBox>

                <Section id="purposes" title="За какви цели използваме данните">
                  <p>Личните данни могат да се обработват за следните цели:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Обработка на запитвания</li>
                    <li>Обратна връзка с потребители</li>
                    <li>Обработка на заявки за записване на час</li>
                    <li>Предоставяне на поискана информация</li>
                    <li>Поддържане на сигурността и техническата работа на сайта</li>
                    <li>Изпълнение на приложими законови задължения, когато е необходимо</li>
                  </ul>
                </Section>

                <Section id="legal-basis" title="Правно основание за обработване">
                  <p>
                    В зависимост от конкретната ситуация, обработването на лични данни може да се
                    основава на:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>съгласие</li>
                    <li>предприемане на действия по искане на потребителя</li>
                    <li>изпълнение на законово задължение</li>
                    <li>легитимен интерес, когато е приложимо</li>
                  </ul>
                </Section>

                <Section id="retention" title="Колко дълго съхраняваме данните">
                  <p>
                    Личните данни се съхраняват само за периода, необходим за целта, за която са
                    събрани, или за по-дълъг срок, когато приложимите законови изисквания го
                    изискват.
                  </p>
                  <p className="font-medium text-primary-deep">
                    [Добавете конкретни срокове за съхранение, ако са определени.]
                  </p>
                </Section>

                <Section id="sharing" title="С кого могат да бъдат споделяни данните">
                  <p>
                    Данните могат да бъдат достъпни за доверени доставчици на услуги, когато това е
                    необходимо за функционирането и поддръжката на уебсайта.
                  </p>
                  <PlaceholderList
                    items={[
                      "Доставчик на хостинг услуги",
                      "Доставчик на имейл/формулярни услуги",
                      "Доставчик на аналитични услуги",
                      "Платформа за записване на час",
                      "IT поддръжка",
                    ]}
                  />
                </Section>

                <Section id="transfer" title="Международен трансфер на данни">
                  <p>
                    Ако трети доставчици обработват информация извън Европейското икономическо
                    пространство, тук следва да бъдат описани съответните гаранции.
                  </p>
                  <p className="font-medium text-primary-deep">
                    [Добавете конкретна информация според използваните външни услуги.]
                  </p>
                </Section>

                <Section id="cookies" title="Cookies">
                  <p>
                    Уебсайтът може да използва необходими бисквитки за своята нормална работа, както
                    и, ако бъдат внедрени, допълнителни аналитични или маркетингови технологии.
                  </p>
                  <p>
                    Lovable отчита посещенията без аналитични бисквитки и без да Ви идентифицира.
                    В регионите, където се изисква избор, измерването на кликванията изчаква
                    Вашето съгласие. Изборът за аналитично измерване и рекламни бисквитки
                    се запазва отделно във Вашия браузър и може да бъде променен или оттеглен
                    чрез „Настройки за бисквитките“ в долната част на всяка страница.
                    Сигналът Global Privacy Control се зачита като отказ.
                  </p>
                  <p>Рекламното проследяване чрез Meta не е активно и сайтът не изпраща данни към Meta.</p>
                  <p>
                    Повече информация можете да намерите в
                    <span className="text-muted-foreground">
                      {" "}Политика за бисквитките
                    </span>
                    .
                  </p>
                </Section>

                <Section id="rights" title="Вашите права">
                  <p>
                    При наличие на приложими условия, лицата могат да имат права във връзка с личните
                    си данни, като например:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>достъп</li>
                    <li>коригиране</li>
                    <li>изтриване</li>
                    <li>ограничаване на обработването</li>
                    <li>възражение</li>
                    <li>преносимост</li>
                    <li>оттегляне на съгласие, когато обработването се основава на съгласие</li>
                  </ul>
                  <p>
                    Заявки могат да бъдат подавани чрез посочените по-долу контакти за защита на
                    личните данни. Моля, имайте предвид, че в някои случаи законови задължения могат
                    да изискват запазване на част от информацията.
                  </p>
                </Section>

                <Section id="security" title="Сигурност на информацията">
                  <p>
                    Прилагат се разумни технически и организационни мерки за защита на личната
                    информация срещу неоторизиран достъп, загуба, промяна или разкриване.
                  </p>
                </Section>

                <Section id="external" title="Външни връзки">
                  <p>
                    Уебсайтът може да съдържа връзки към външни сайтове. Практиките за поверителност
                    на тези сайтове се уреждат от техните собствени политики.
                  </p>
                </Section>

                <Section id="changes" title="Промени в политиката">
                  <p>
                    Настоящата политика може да бъде актуализирана при промени в начина на
                    обработване на данни, функционалностите на сайта или приложимите изисквания.
                  </p>
                  <p className="font-medium text-primary-deep">Последна актуализация: [дата]</p>
                </Section>

                <div
                  id="contact"
                  className="mt-10 rounded-[1.25rem] border border-border/60 p-6 sm:p-8 bg-white shadow-soft"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary-deep">
                      <Shield className="h-5 w-5" />
                    </span>
                    <h2 className="text-xl font-bold text-primary-deep">
                      Въпроси относно личните Ви данни
                    </h2>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <span>Имейл: contact@cholakoviclinic.bg</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <span>Телефон: 054 876 979</span>
                    </div>
                    <div className="flex items-start gap-3 sm:col-span-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <span>Адрес: гр. Шумен, ул. „Васил Друмев“ № 17</span>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link to="/kontakti" className="btn-primary !py-2.5 !px-5 text-sm">
                      Свържете се с нас
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function TocList() {
  return (
    <ul className="space-y-2 text-sm">
      {sections.map((s) => (
        <li key={s.id}>
          <a
            href={`#${s.id}`}
            className="block text-muted-foreground hover:text-primary-deep transition"
          >
            {s.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-6 border-b border-border/60 last:border-b-0">
      <h2 className="text-xl sm:text-2xl font-bold text-primary-deep">{title}</h2>
      <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

function InfoBox({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      className="scroll-mt-24 my-6 rounded-[1.25rem] border border-primary/20 p-6"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in oklab, var(--primary-soft) 22%, white) 0%, white 100%)",
      }}
    >
      <h2 className="text-lg sm:text-xl font-bold text-primary-deep">{title}</h2>
      <div className="mt-3 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

function PlaceholderList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex items-center gap-2 rounded-lg border border-dashed border-primary/30 bg-primary-soft/30 px-3 py-2 text-sm text-primary-deep"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {item}
        </li>
      ))}
    </ul>
  );
}
