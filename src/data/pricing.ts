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
    title: "Категория 1",
    items: [
      { name: "Консултация / преглед", note: "Кратка допълнителна информация", price: "XX лв." },
      { name: "Медицинска услуга", price: "XX лв." },
      { name: "Медицинска процедура", note: "Кратка допълнителна информация", price: "XX лв." },
    ],
  },
  {
    id: "kategoriya-2",
    title: "Категория 2",
    items: [
      { name: "Консултация / преглед", price: "XX лв." },
      { name: "Медицинска услуга", note: "Кратка допълнителна информация", price: "XX лв." },
      { name: "Медицинска процедура", price: "XX лв." },
    ],
  },
  {
    id: "kategoriya-3",
    title: "Категория 3",
    items: [
      { name: "Консултация / преглед", price: "XX лв." },
      { name: "Медицинска услуга", price: "XX лв." },
      { name: "Медицинска процедура", note: "Кратка допълнителна информация", price: "XX лв." },
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
