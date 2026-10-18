export type ProductType = "oil" | "original";

export type Concentration =
  | "parfum"
  | "extrait"
  | "edp"
  | "edt"
  | "edc"
  | "oil";

export type FragranceFamily =
  | "floral"
  | "oriental"
  | "woody"
  | "fresh"
  | "chypre"
  | "fougere"
  | "gourmand"
  | "citrus"
  | "aquatic"
  | "spicy"
  | "leather"
  | "green";

export interface FragranceNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  inspiredBy?: string;
  type: ProductType;
  types: ProductType[];
  oilPrice?: number;
  oilPricePerMl?: number;
  originalPrice?: number;
  originalDecantPricePerMl?: number;
  originalVolume?: string;
  concentration: Concentration;
  families: FragranceFamily[];
  notes: FragranceNotes;
  description: string;
  descriptionEn?: string;
  notesEn?: FragranceNotes;
  price: number;
  volume: string;
  image: string;
  inStock: boolean;
  featured?: boolean;
  createdAt: string;
}

export interface FilterState {
  brands: string[];
  notes: string[];
  families: FragranceFamily[];
  concentrations: Concentration[];
  types: ProductType[];
  search: string;
  priceRange: [number, number];
  inStockOnly: boolean;
}

export const FRAGRANCE_FAMILIES: Record<
  FragranceFamily,
  { label: string; labelRu: string; color: string; description: string }
> = {
  floral: {
    label: "Floral",
    labelRu: "Цветочные",
    color: "#E8B4CB",
    description: "Роза, жасмин, ирис — нежность и романтика",
  },
  oriental: {
    label: "Oriental",
    labelRu: "Восточные",
    color: "#C9A962",
    description: "Амбра, ваниль, благовония — тёплая чувственность",
  },
  woody: {
    label: "Woody",
    labelRu: "Древесные",
    color: "#8B6914",
    description: "Сандал, кедр, ветивер — глубина и стойкость",
  },
  fresh: {
    label: "Fresh",
    labelRu: "Свежие",
    color: "#A8D8EA",
    description: "Мята, зелень, озон — лёгкость и бодрость",
  },
  chypre: {
    label: "Chypre",
    labelRu: "Шипровые",
    color: "#6B8E6B",
    description: "Дубовый мох, бергамот, роза — классическая элегантность",
  },
  fougere: {
    label: "Fougère",
    labelRu: "Фужерные",
    color: "#7A9E7E",
    description: "Лаванда, дубовый мох, кумарин — мужская классика",
  },
  gourmand: {
    label: "Gourmand",
    labelRu: "Гурманские",
    color: "#D4A574",
    description: "Карамель, шоколад, миндаль — сладкое наслаждение",
  },
  citrus: {
    label: "Citrus",
    labelRu: "Цитрусовые",
    color: "#F5D76E",
    description: "Лимон, апельсин, грейпфрут — солнечная энергия",
  },
  aquatic: {
    label: "Aquatic",
    labelRu: "Водные",
    color: "#6EC6CA",
    description: "Морские ноты, озон — свежесть океана",
  },
  spicy: {
    label: "Spicy",
    labelRu: "Пряные",
    color: "#C45C26",
    description: "Перец, корица, гвоздика — тёплая интенсивность",
  },
  leather: {
    label: "Leather",
    labelRu: "Кожаные",
    color: "#9A7B8C",
    description: "Кожа, табак, дым — брутальная роскошь",
  },
  green: {
    label: "Green",
    labelRu: "Зелёные",
    color: "#8FBC8F",
    description: "Гальбанум, листья, трава — природная свежесть",
  },
};

export const CONCENTRATION_LABELS: Record<Concentration, string> = {
  parfum: "Parfum (20–40%)",
  extrait: "Extrait (15–30%)",
  edp: "Eau de Parfum (15–20%)",
  edt: "Eau de Toilette (5–15%)",
  edc: "Eau de Cologne (2–5%)",
  oil: "Масляные духи (15–30%)",
};

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
  oil: "Масляные духи",
  original: "Оригинальная парфюмерия",
};
