import sickleave from "@/assets/service-sickleave.jpg";
import emergency from "@/assets/service-emergency.jpg";
import documents from "@/assets/service-documents.jpg";
import covidCert from "@/assets/service-covid-cert.jpg";
import mpsCert from "@/assets/service-mps-cert.jpg";
import immunization from "@/assets/service-immunization.jpg";
import marriageCert from "@/assets/service-marriage-cert.jpg";
import lab from "@/assets/service-lab.jpg";
import documentsCert from "@/assets/service-documents-cert.jpg";
import homevisit from "@/assets/service-homevisit.jpg";
import prevention from "@/assets/service-prevention.jpg";
import referral from "@/assets/service-referral.jpg";

export type Service = {
  slug: string;
  title: string;
  desc: string;
  image: string;
};

export const servicesList: Service[] = [
  {
    slug: "bolnichen-list",
    title: "Издаване на болничен лист",
    desc: "Болничен лист се издава на пациенти, прегледани от лекар в амбулаторията, при което е установена невъзможност пациентът да продължи работата си поради заболяване/злополука/изследване. ",
    image: sickleave,
  },
  {
    slug: "opl-i-speshna-pomosht",
    title: "ОПЛ и Спешна помощ",
    desc: "Задължения на ОПЛ по оказване на спешна медицинска помощ",
    image: emergency,
  },
  {
    slug: "detski-dobavki-socialni-pomoshti",
    title: "Издаване на удостоверения за детски добавки и социални помощи",
    desc: "В практиката на д-р Чолакови се издават следните документи, необходими за дирекция „Социално подпомагане“",
    image: documents,
  },
  {
    slug: "covid-19-vaccination-certificate",
    title: "Издаване на сертификат за ваксинация срещу КОВИД-19",
    desc: "Издаването на сертификат за ваксинация срещу КОВИД-19 се основава на споразумение на държавите-членки на Европейския съюз.",
    image: covidCert,
  },
  {
    slug: "medicinsko-svidetelstvo-mps",
    title: "Медицинско свидетелство за управление на МПС",
    desc: "Административна процедура „Издаване на медицинско свидетелство за физическа годност за водач на МПС“",
    image: mpsCert,
  },
  {
    slug: "medicinsko-svidetelstvo-za-brak",
    title: "Медицинско свидетелство за брак",
    desc: "Издаването на медицинско свидетелство за граждански брак се регламентира от Инструкция № 1 за реда за освидетелстване при встъпване в брак.",
    image: marriageCert,
  },
  {
    slug: "ambulatoren-list-recepti",
    title: "Издаване на медицински документи – амбулаторен лист, рецепти",
    desc: "Издаването на медицинските документи „амбулаторен лист“ и „рецепти“ е регламентирано в Националния рамков договор и в Наредба 4 за реда на предписване и отпускане на лекарствени продукти",
    image: documentsCert,
  },
  {
    slug: "domashni-vizitacii",
    title: "Домашни визитации",
    desc: "Преглед в дома при невъзможност за посещение в кабинета, с осигурен транспорт при нужда.",
    image: homevisit,
  },
  {
    slug: "napravlenie",
    title: "Издаване на направление",
    desc: "Направления за консултация, изследване, хоспитализация, явяване на ЛКК и ТЕЛК се издават по преценка на ОПЛ след извършен преглед на здравноосигурено лице и установяване на проблем, който изисква консултация/изследване/хоспитализация/преглед от лекарска консултативна комисия (ЛКК). ",
    image: prevention,
  },
];
