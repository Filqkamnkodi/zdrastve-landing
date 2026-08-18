import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, FileText, Mail, Phone, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/obshti-usloviya")({
  head: () => ({
    meta: [
      { title: "Общи условия | Клиника Д-р Чолакови" },
      {
        name: "description",
        content:
          "Общи условия за използване на уебсайта на Клиника Д-р Чолакови и предоставените чрез него информационни и контактни функционалности.",
      },
      { property: "og:title", content: "Общи условия | Клиника Д-р Чолакови" },
      {
        property: "og:description",
        content:
          "Общи условия за използване на уебсайта на Клиника Д-р Чолакови и предоставените чрез него информационни и контактни функционалности.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

const sections = [
  { id: "general", label: "Общи положения" },
  { id: "operator", label: "Данни за оператора на сайта" },
  { id: "purpose", label: "Предназначение на сайта" },
  { id: "medical-info", label: "Медицинска информация" },
  { id: "emergency", label: "Спешни състояния" },
  { id: "appointment", label: "Заявяване на час" },
  { id: "contact-forms", label: "Използване на контактните форми" },
  { id: "user-responsibilities", label: "Задължения на потребителите" },
  { id: "content", label: "Съдържание и актуалност на информацията" },
  { id: "external", label: "Външни връзки" },
  { id: "intellectual-property", label: "Интелектуална собственост" },
  { id: "availability", label: "Достъпност на сайта" },
  { id: "personal-data", label: "Защита на личните данни" },
  { id: "liability", label: "Ограничаване на отговорността" },
  { id: "changes", label: "Промени в Общите условия" },
  { id: "law", label: "Приложимо право" },
  { id: "contact", label: "Контакти" },
];

function TermsPage() {
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
                <li className="text-primary-deep font-medium">Общи условия</li>
              </ol>
            </nav>
            <div className="mt-6 max-w-3xl">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                Правна информация
              </span>
              <h1 className="mt-3 text-3xl sm:text-4xl font-bold text-primary-deep">
                Общи условия
              </h1>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Настоящите Общи условия уреждат правилата за използване на уебсайта на
                „Клиника Д-р Чолакови“, неговото съдържание и предоставените чрез него
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
                <Section id="general" number="1" title="Общи положения">
                  <p>
                    С достъпването и използването на настоящия уебсайт, посетителите се съгласяват
                    да го използват в съответствие с настоящите Общи условия и приложимото
                    законодателство.
                  </p>
                  <p>
                    Уебсайтът предоставя информация за „Клиника Д-р Чолакови“, нейния екип,
                    медицински услуги, имунизационни услуги и начини за контакт.
                  </p>
                </Section>

                <Section id="operator" number="2" title="Данни за оператора на сайта">
                  <p>
                    По-долу са посочени данните за оператора на уебсайта. Моля, попълнете
                    информацията преди публикуване:
                  </p>
                  <PlaceholderList
                    items={[
                      "Наименование: [Добавете юридическо лице]",
                      "ЕИК/Булстат: [Добавете ЕИК/Булстат]",
                      "Адрес: [Добавете адрес]",
                      "Телефон: [Добавете телефон]",
                      "Имейл: [Добавете имейл]",
                    ]}
                  />
                </Section>

                <Section id="purpose" number="3" title="Предназначение на сайта">
                  <p>Уебсайтът има информационен характер и предоставя сведения, свързани с:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Медицински услуги</li>
                    <li>Медицински специалисти</li>
                    <li>Имунизационен център</li>
                    <li>Контакти и местоположение</li>
                    <li>Заявяване на час</li>
                    <li>Друга полезна информация за пациентите</li>
                  </ul>
                  <p>
                    Клиниката може да актуализира, променя или премахва съдържание от уебсайта, когато
                    това е необходимо.
                  </p>
                </Section>

                <InfoBox id="medical-info" title="4. Медицинска информация">
                  <p>
                    Информацията, публикувана на уебсайта, се предоставя с общоинформационна цел и не
                    следва да се разглежда като индивидуална медицинска диагноза, медицински съвет или
                    препоръка за лечение.
                  </p>
                  <p>
                    Информацията на сайта не замества преглед, консултация или преценка от квалифициран
                    медицински специалист.
                  </p>
                  <p>
                    Потребителите следва да се обърнат към подходящ медицински специалист по въпроси,
                    свързани с тяхното индивидуално здравословно състояние.
                  </p>
                </InfoBox>

                <InfoBox id="emergency" title="5. Спешни състояния">
                  <p>
                    Сайтът, контактните форми и формата за заявяване на час не са предназначени за
                    получаване на спешна медицинска помощ.
                  </p>
                  <p>
                    При спешно или животозастрашаващо състояние потърсете незабавна медицинска помощ и
                    използвайте официалните канали за спешна помощ.
                  </p>
                </InfoBox>

                <Section id="appointment" number="6" title="Заявяване на час">
                  <p>
                    Чрез уебсайта потребителите могат да изпратят заявка за медицински час. Важно е да
                    се прави разлика между заявка за час и потвърден час.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Изпращането на заявка чрез сайта не представлява автоматично потвърждение на
                      медицински час.
                    </li>
                    <li>
                      Часът се счита за потвърден след обратна връзка от представител на клиниката чрез
                      посочените от пациента контактни данни.
                    </li>
                    <li>Желаната дата и час не винаги могат да бъдат налични.</li>
                    <li>
                      Клиниката може да се свърже с потребителя, за да предложи алтернативна дата или
                      час.
                    </li>
                  </ul>
                </Section>

                <Section id="contact-forms" number="7" title="Използване на контактните форми">
                  <p>
                    Потребителите носят отговорност за предоставянето на точна контактна информация при
                    изпращане на запитване.
                  </p>
                  <InfoBoxInline title="Внимание">
                    <p>
                      Потребителите не следва да изпращат чрез стандартните форми на сайта ЕГН,
                      медицинска документация, резултати от изследвания, диагнози или друга
                      чувствителна здравна информация, освен ако за това не е предоставен специално
                      предназначен защитен канал.
                    </p>
                  </InfoBoxInline>
                  <p>
                    Повече информация относно обработването на личните данни можете да намерите в{" "}
                    <Link to="/politika-za-poveritelnost" className="text-primary hover:underline">
                      Политика за поверителност
                    </Link>
                    .
                  </p>
                </Section>

                <Section id="user-responsibilities" number="8" title="Задължения на потребителите">
                  <p>Потребителите не следва да:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Предоставят умишлено невярна информация</li>
                    <li>Опитват да получат неоторизиран достъп до уебсайта или неговите системи</li>
                    <li>Пречат на нормалната работа на уебсайта</li>
                    <li>
                      Използват автоматизирани методи за претоварване или злоупотреба с
                      функционалностите на сайта
                    </li>
                    <li>Изпращат незаконно, обидно или зловредно съдържание чрез формите</li>
                    <li>Опитват да въвеждат зловреден софтуер или код</li>
                  </ul>
                </Section>

                <Section id="content" number="9" title="Съдържание и актуалност на информацията">
                  <p>
                    Полагат се разумни усилия за поддържане на точна и актуална информация на
                    уебсайта.
                  </p>
                  <p>Информация като:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Работно време</li>
                    <li>Членове на екипа</li>
                    <li>Предлагани услуги</li>
                    <li>Контактни данни</li>
                    <li>Административни изисквания</li>
                  </ul>
                  <p>
                    може да бъде актуализирана с течение на времето. Потребителите могат да се свържат
                    с клиниката, когато потвърждаването на актуална информация е от значение.
                  </p>
                </Section>

                <Section id="external" number="10" title="Външни връзки">
                  <p>
                    Уебсайтът може да съдържа връзки към външни уебсайтове или услуги. Клиниката не
                    контролира съдържанието, достъпността или практиките за поверителност на външните
                    сайтове.
                  </p>
                </Section>

                <Section id="intellectual-property" number="11" title="Интелектуална собственост">
                  <p>
                    Съдържанието на уебсайта, включително текст, графични елементи, брандинг, дизайн на
                    сайта, оригинални фотографии и визуални материали, може да бъде защитено от
                    приложими права на интелектуална собственост.
                  </p>
                  <p>
                    Потребителите не следва да възпроизвеждат, разпространяват или използват защитени
                    материали от уебсайта за търговски цели без съответното разрешение, освен когато
                    това е разрешено от закона.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Това не се отнася до стокови изображения, икони на трети страни или други
                    лицензирани материали, чиито права принадлежат на съответните притежатели.
                  </p>
                </Section>

                <Section id="availability" number="12" title="Достъпност на сайта">
                  <p>
                    Не може да бъде гарантирана непрекъсната и безпроблемна достъпност на уебсайта.
                  </p>
                  <p>Сайтът може временно да бъде недостъпен поради:</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Техническа поддръжка</li>
                    <li>Актуализации</li>
                    <li>Проблеми с хостинга</li>
                    <li>Мерки за сигурност</li>
                    <li>Обстоятелства извън разумния контрол на оператора</li>
                  </ul>
                </Section>

                <Section id="personal-data" number="13" title="Защита на личните данни">
                  <p>
                    Информация относно обработването на личните данни е налична в{" "}
                    <Link to="/politika-za-poveritelnost" className="text-primary hover:underline">
                      Политика за поверителност
                    </Link>
                    .
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Информация относно използването на бисквитки може да бъде добавена в Политика за
                    бисквитките, ако такава бъде създадена.
                  </p>
                </Section>

                <Section id="liability" number="14" title="Ограничаване на отговорността">
                  <p>
                    Уебсайтът е предназначен да предоставя обща информация и комуникационна
                    функционалност. Информацията се предоставя при условията на добросъвестност и с
                    цел да бъде полезна на потребителите.
                  </p>
                  <p>
                    Настоящите Общи условия не целят да изключват отговорност за медицинска небрежност,
                    умишлени неправомерни действия или задължения, които не могат да бъдат изключени
                    по силата на приложимото законодателство.
                  </p>
                </Section>

                <Section id="changes" number="15" title="Промени в Общите условия">
                  <p>
                    Настоящите Общи условия могат да бъдат актуализирани при промени в
                    функционалностите на уебсайта, предлаганите услуги, правните изисквания или
                    работните практики.
                  </p>
                  <p className="font-medium text-primary-deep">
                    Последна актуализация: [добавете дата]
                  </p>
                </Section>

                <Section id="law" number="16" title="Приложимо право">
                  <p>
                    Настоящите Общи условия се тълкуват в съответствие с приложимото българско
                    законодателство.
                  </p>
                </Section>

                <div
                  id="contact"
                  className="mt-10 rounded-[1.25rem] border border-border/60 p-6 sm:p-8 bg-white shadow-soft"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-soft text-primary-deep">
                      <FileText className="h-5 w-5" />
                    </span>
                    <h2 className="text-xl font-bold text-primary-deep">17. Контакти</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    При въпроси относно настоящите Общи условия можете да се свържете с нас.
                  </p>
                  <div className="mt-5 grid sm:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                      <Mail className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <span>Имейл: [добавете имейл]</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <span>Телефон: [добавете телефон]</span>
                    </div>
                    <div className="flex items-start gap-3 sm:col-span-2">
                      <MapPin className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                      <span>Адрес: [добавете адрес]</span>
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
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-6 border-b border-border/60 last:border-b-0">
      <h2 className="text-xl sm:text-2xl font-bold text-primary-deep">
        {number}. {title}
      </h2>
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
      <div className="mt-3 space-y-3 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}

function InfoBoxInline({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      className="my-4 rounded-[1rem] border border-primary/20 p-4"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in oklab, var(--primary-soft) 22%, white) 0%, white 100%)",
      }}
    >
      <h3 className="text-base font-semibold text-primary-deep">{title}</h3>
      <div className="mt-2 text-muted-foreground leading-relaxed">{children}</div>
    </div>
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
