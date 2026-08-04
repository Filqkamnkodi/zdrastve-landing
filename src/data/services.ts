import consultations from "@/assets/service-consultations.jpg";
import procedures from "@/assets/service-procedures.jpg";
import documents from "@/assets/service-documents.jpg";
import pediatrics from "@/assets/service-pediatrics.jpg";
import imaging from "@/assets/service-imaging.jpg";
import immunization from "@/assets/service-immunization.jpg";
import lab from "@/assets/service-lab.jpg";
import homevisit from "@/assets/service-homevisit.jpg";
import prevention from "@/assets/service-prevention.jpg";

export type Service = {
  slug: string;
  title: string;
  desc: string;
  image: string;
};

export const servicesList: Service[] = [
  {
    slug: "pregledi-i-konsultacii",
    title: "Прегледи и консултации",
    desc: "Първични и вторични прегледи с внимателна оценка на състоянието и ясен план за проследяване.",
    image: consultations,
  },
  {
    slug: "manipulacii",
    title: "Манипулации и процедури",
    desc: "Инжекции, венозни вливания, превръзки и обработка на рани в стерилна манипулационна.",
    image: procedures,
  },
  {
    slug: "medicinski-dokumenti",
    title: "Медицински документи",
    desc: "Свидетелства, удостоверения, болнични листове и съдействие с административна документация.",
    image: documents,
  },
  {
    slug: "pediatria",
    title: "Педиатрия",
    desc: "Грижа за бебета, деца и юноши – прегледи, проследяване на растежа и консултации за родители.",
    image: pediatrics,
  },
  {
    slug: "obrazna-diagnostika",
    title: "Образна диагностика",
    desc: "Ехография на коремни органи, млечна и щитовидна жлеза, както и ЕКГ по желание на пациента.",
    image: imaging,
  },
  {
    slug: "imunizacii",
    title: "Имунизации",
    desc: "Планови и препоръчителни ваксини за деца и възрастни по актуалния имунизационен календар.",
    image: immunization,
  },
  {
    slug: "laboratorni-izsledvania",
    title: "Лабораторни изследвания",
    desc: "Вземане на венозна кръв и назначаване на изследвания с бърза обратна връзка за резултатите.",
    image: lab,
  },
  {
    slug: "domashni-vizitacii",
    title: "Домашни визитации",
    desc: "Преглед в дома при невъзможност за посещение в кабинета, с осигурен транспорт при нужда.",
    image: homevisit,
  },
  {
    slug: "profilaktika",
    title: "Профилактични прегледи",
    desc: "Годишни профилактични пакети за ранно откриване на рискове и проследяване на здравето.",
    image: prevention,
  },
];
