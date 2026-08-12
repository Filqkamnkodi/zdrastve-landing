import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CalendarCheck, Phone } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { servicesList } from "@/data/services";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const serviceFaqs = [
  {
    q: "Издаване на болничен лист за гледане на болен",
    a: "Болничен лист се издава от лекар, който е прегледал пациента в амбулаторията и е установил временна неработоспособност поради заболяване, злополука или необходимост от изследване.",
  },
  {
    q: "Издаване на болничен лист за бременност, раждане и осиновяване",
    a: "ОПЛ може да издаде болничен лист за периода на временна неработоспособност по преценка на лекаря, но не повече от 14 дни непрекъснато и не повече от 40 дни с прекъсване в рамките на календарната година.",
  },
  {
    q: "Издаване на болничен лист за изследване и консултация",
    a: "При необходимост от продължаване на временната неработоспособност, ОПЛ насочва пациента към Лекарска консултативна комисия (ЛКК) с направление бл. МЗ-НЗОК № 6 или с вписване в ЛАК.",
  },
  {
    q: "Болничен лист за санаториално лечение",
    a: "Да, болничен лист се издава само след извършен преглед от лекар в амбулаторията. Не се издава ретроспективно или без установена невъзможност за работа.",
  },
  {
    q: "Болнични листа за повече от 1 работодател",
    a: "Пациентът трябва да знае точното име на фирмата, адреса на фирмата по регистрация и точната длъжност по трудов договор, за да може болничният лист да бъде издаден правилно.",
  },
  {
    q: "Издаване на болничен лист за минало време",
    a: "Не, болничен лист се издава от деня на прегледа. Не се допуска издаване на болничен лист за дни, предшестващи датата на прегледа.",
  },
  {
    q: "Болничен лист за стоматологично лечение",
    a: "При загуба или унищожаване на болничен лист, пациентът може да получи дубликат след писмено заявление. Дубликатът се издава от лечебното заведение, което е издало оригиналния документ.",
  },
  {
    q: "Необходими документи за издаване на болничен лист",
    a: "Да, болничният лист е официален документ, удостоверяващ временна неработоспособност, и на негова основа се изплаща парично обезщетение от НЗОК съгласно Кодекса за социално осигуряване.",
  },
  {
    q: "Срокове за издаване на болничен лист",
    a: "За да получите болничен лист и парично обезщетение, е необходимо да сте здравноосигурен. При прекъснати осигуровки правото на обезщетение може да бъде ограничено или отказано.",
  },
  {
    q: "Такси за издаване на болничен лист и ЛАК",
    a: "Ако работодателят откаже да приеме правилно издаден болничен лист, можете да се обърнете към Инспекцията по труда или да подадете сигнал до НЗОК. Болничният лист е официален документ и отказът му приемане е нарушение.",
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
          <div className="container-page animate-fade-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep">
              За услугата
            </h2>
            <div className="mt-4 text-muted-foreground leading-relaxed whitespace-pre-line">
              {service.slug === "domashni-vizitacii" ? (
                <>
                  1.Оказване на медицинска помощ в дома на пациента /домашни посещения/ се извършват съгласно Наредба №3 за основния пакет дейности гарантирани от бюджета на НЗОК:
                  {"\n"}
                  6.3. Домашните посещения се извършват в обявените в графика часове.
                  {"\n\n"}
                  2.Домашните посещения се извършват само в планов порядък в обявените часове за домашни посещения{"\u00a0"} след преценка на необходимостта от лекаря и след приключване на амбулаторната дейност.
                  {"\n\n"}
                  3. Домашни посещения се извършват само на пациенти,{"\u00a0"} които е невъзможно да бъдат транспортирани до лечебното заведение.
                  {"\n\n"}
                  4. Заявяването на домашно посещение се извършва чрез личен разговор между лекаря и пациента/негови близки.{"\u00a0"}
                  {"\n\n"}
                  5. При заявяване на домашно посещение пациентът/неговият близък трябва да даде кратка информация за състоянието на пациента, неговите оплаквания, давност и други важни за медицинската помощ въпроси, зададени от лекаря.{"\u00a0"}
                  {"\n\n"}
                  6. При заявено домашно посещение пациентът/неговите близки следва да осигурят лице, което да покаже пътя към дома на пациента. Не е задължително да се осигури транспорт за лекаря.{"\u00a0"}
                  {"\n\n"}
                  7. В случаите на осигурен от пациента транспорт до дома, в който ще се извърши домашния преглед, трябва да бъде осигурен и обратен транспорт for лекаря до амбулаторията.{"\u00a0"}
                  {"\n\n"}
                  8. В случаите, когато домашното посещение се извършва с транспорт на лекаря, и разстоянието до дома е повече от 10 км, пациентът следва да заплати стойността на транспортните разходи в двете посоки.{"\u00a0"}
                  {"\n\n"}
                  9.{"\u00a0"}Медицинската документация for домашното посещение се оформя впоследствие, като болния или негови близки се поканват да подпишат изготвените документи в амбулаторията в часовете for амбулаторна дейност или в удобно време for лекаря и пациента/неговите близки.
                  {"\n\n"}
                  10. Оказване на медицинска помощ в дома на пациента (домашни посещения) на неосигурени лица или на пациенти нерегистрирани в пациентската листа се извършват{"\u00a0"} след заплащане на регламентирана такса съгласно ценоразпис.{"\u00a0"}
                  {"\n\n"}
                  11. Домашно посещение по желание на пациента, ако не отговаря на условията по т. 3, или извън часовете по т. 2, се заплаща от пациента по ценоразпис.{"\u00a0"}
                  {"\n\n"}
                  12. Домашни посещения на лица with медицински проблеми, отговарящи на критериите for спешност, са обект на центровете for спешна медицинска помощ и се заявяват на тел. 112.{"\u00a0"} Общопрактикуващият лекар няма право да напусне амбулаторията и да извършва прегледи на пациенти в спешно състояние в техния дом или на обществено място в часовете, определени for амбулаторна или профилактична дейност.{"\u00a0"}
                </>
              ) : service.slug === "bolnichen-list" ? (
                <>
                  Болничен лист се издава на пациенти, прегледани от лекар в амбулаторията, при което е установена невъзможност пациентът да продължи работата си поради заболяване/злополука/изследване.{"\u00a0"}
                  {"\n\n"}
                  Болничен лист може да бъде издаден от ОПЛ за периода на временна неработоспособност (по преценка на лекаря), но не повече от 14 дни непрекъснато и не повече от 40 дни с прекъсване в рамките на календарната година.{"\u00a0"}
                  {"\n\n"}
                  При необходимост от продължаване на временната неработоспособност, ОПЛ насочва пациента към ЛКК (с направление бл. МЗ-НЗОК № 6 за комисиите, сключили договор с РЗОК, или с вписване в ЛАК)
                  {"\n\n"}
                  За получаването на болничен лист е необходимо:
                  {"\n\n"}
                  <ul className="list-none space-y-4">
                    <li><p className="flex gap-2">{"-"}пациентът да знае точното име на фирмата, в която работи</p></li>
                    <li><p className="flex gap-2">{"-"}пациентът да знае адреса на фирмата по регистрация на фирмата</p></li>
                    <li><p className="flex gap-2">{"-"}пациентът да знае точната длъжност по трудов договор</p></li>
                  </ul>
                </>
              ) : (
                <>
                  Съдържанието за тази страница предстои да бъде допълнено. Тук ще намерите
                  подробно описание на процедурата, необходимата подготовка, продължителността
                  и какво да очаквате по време на посещението.
                  {"\n\n"}
                  Екипът ни работи с индивидуален подход към всеки пациент и осигурява
                  спокойна и сигурна среда, в която да получите ясни отговори на въпросите си.
                </>
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-12 lg:py-16 bg-surface">
          <div className="container-page animate-fade-up">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary-deep text-center">
              Задължения на ОПЛ по оказване на спешна медицинска помощ
            </h2>
            <div className="mt-10 max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="w-full">
                {serviceFaqs.map((faq, i) => (
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
