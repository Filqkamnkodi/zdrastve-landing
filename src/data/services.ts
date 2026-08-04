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
    slug: "bolnichen-list",
    title: "Издаване на болничен лист",
    desc: "Болничен лист се издава на пациенти, прегледани от лекар в амбулаторията, при което е установена невъзможност пациентът да продължи работата си поради заболяване/злополука/изследване. ",
    image: consultations,
  },
  {
    slug: "opl-i-speshna-pomosht",
    title: "ОПЛ и Спешна помощ",
    desc: "Задължения на ОПЛ по оказване на спешна медицинска помощ",
    image: procedures,
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
    image: pediatrics,
  },
  {
    slug: "medicinsko-svidetelstvo-mps",
    title: "Медицинско свидетелство за управление на МПС",
    desc: "Административна процедура „Издаване на медицинско свидетелство за физическа годност за водач на МПС“",
    image: imaging,
  },
  {
    slug: "medicinsko-svidetelstvo-za-brak",
    title: "Медицинско свидетелство за брак",
    desc: "Издаването на медицинско свидетелство за граждански брак се регламентира от Инструкция № 1 за реда за освидетелстване при встъпване в брак.",
    image: immunization,
  },
  {
    slug: "ambulatoren-list-recepti",
    title: "Издаване на медицински документи – амбулаторен лист, рецепти",
    desc: "Издаването на медицинските документи „амбулаторен лист“ и „рецепти“ е регламентирано в Националния рамков договор и в Наредба 4 за реда на предписване и отпускане на лекарствени продукти",
    image: lab,
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
