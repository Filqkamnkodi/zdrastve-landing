export type PriceItem = {
  name: string;
  note?: string;
  price: string;
};

export type PriceCategory = {
  id: string;
  title: string;
  items: PriceItem[];
};

export const pricingCategories: PriceCategory[] = [
  {
    id: "kategoriya-1",
    title: "Прегледи и консултации",
    items: [
      { name: "Първичен медицински преглед", price: "30 евро" },
      { name: "Вторичен медицински преглед", price: "20 евро" },
      { name: "Домашна визита с преглед и транспорт", price: "23 евро" },
    ],
  },
  {
    id: "kategoriya-2",
    title: "Образна и функционална диагностика",
    items: [
      { name: "Ехография на млечни жлези", price: "23 евро" },
      { name: "Ехография на коремни органи", price: "33 евро" },
      { name: "Ехография на щитовидна жлеза", price: "23 евро" },
      { name: "ЕКГ по желание", price: "10 евро" },
    ],
  },
  {
    id: "kategoriya-3",
    title: "Медицински свидетелства, удостоверения и административни документи",
    items: [
      { name: "Медицинско свидетелство за работа", price: "15 евро" },
      { name: "Медицинско свидетелство за брак", price: "15 евро" },
      { name: "Медицинско свидетелство за управление на МПС", price: "15 евро" },
    ],
  },
  {
    id: "kategoriya-4",
    title: "Категория 4",
    items: [
      { name: "Консултация / преглед", note: "Кратка допълнителна информация", price: "XX лв." },
      { name: "Медицинска услуга", price: "XX лв." },
      { name: "Медицинска процедура", price: "XX лв." },
    ],
  },
];
