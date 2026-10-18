import { Product, FragranceNotes } from "@/types";
import { Locale } from "@/i18n/translations";

type ProductLocaleData = {
  description: string;
  notes: FragranceNotes;
};

export const productTranslations: Record<string, ProductLocaleData> = {
  "1": {
    description:
      "A refined composition with a woody-spicy character. Oil perfume with exceptional longevity up to 12 hours.",
    notes: {
      top: ["Bergamot", "Mint", "Grapefruit"],
      heart: ["Ginger", "Jasmine", "Nutmeg"],
      base: ["Frankincense", "Sandalwood", "Vetiver", "White musk"],
    },
  },
  "2": {
    description:
      "A luxurious floral-fruity symphony. The tenderness of rose paired with juicy lychee.",
    notes: {
      top: ["Lychee", "Rhubarb", "Bergamot"],
      heart: ["Turkish rose", "Peony", "Lily"],
      base: ["Vanilla", "Cashmeran", "Musk"],
    },
  },
  "3": {
    description:
      "A deep oriental scent with noble oud. For connoisseurs of true luxury.",
    notes: {
      top: ["Pink pepper", "Cardamom"],
      heart: ["Oud", "Sandalwood", "Vetiver"],
      base: ["Vanilla", "Amber", "Tonka bean"],
    },
  },
  "4": {
    description: "Original Dior Sauvage Eau de Parfum. Powerful and charismatic.",
    notes: {
      top: ["Bergamot", "Pepper"],
      heart: ["Lavender", "Anise", "Nutmeg"],
      base: ["Amber", "Vanilla", "Cedar"],
    },
  },
  "5": {
    description: "An iconic women's fragrance. Happiness in every note.",
    notes: {
      top: ["Blackcurrant", "Pear"],
      heart: ["Iris", "Jasmine", "Orange blossom"],
      base: ["Patchouli", "Vanilla", "Praline"],
    },
  },
  "6": {
    description: "Fresh sea breeze. Perfect for hot summer days.",
    notes: {
      top: ["Lemon", "Neroli", "Jasmine"],
      heart: ["Marine notes", "Rosemary", "Peach"],
      base: ["Musk", "Cedar", "Patchouli"],
    },
  },
  "7": {
    description: "A classic chypre with a modern interpretation. Timeless elegance.",
    notes: {
      top: ["Bergamot", "Galbanum"],
      heart: ["Rose", "Jasmine", "Iris"],
      base: ["Oakmoss", "Patchouli", "Frankincense"],
    },
  },
  "8": {
    description: "Legendary Tom Ford Tobacco Vanille. Warm and enveloping.",
    notes: {
      top: ["Tobacco", "Spices"],
      heart: ["Vanilla", "Cocoa", "Tonka bean"],
      base: ["Dried fruits", "Woody notes"],
    },
  },
  "9": {
    description: "Fresh green Irish meadows in an oil interpretation.",
    notes: {
      top: ["Lemon", "Verbena"],
      heart: ["Violet", "Iris"],
      base: ["Sandalwood", "Amber", "Musk"],
    },
  },
  "10": {
    description: "A bold leather scent with a berry accent. For the confident.",
    notes: {
      top: ["Saffron", "Raspberry"],
      heart: ["Leather", "Jasmine"],
      base: ["Oakmoss", "Amber", "Woody notes"],
    },
  },
};

export function getLocalizedProduct(product: Product, locale: Locale): Product {
  if (locale === "ru") return product;

  if (product.descriptionEn) {
    return { ...product, description: product.descriptionEn };
  }

  const tr = productTranslations[product.id];
  if (!tr) return product;
  return { ...product, description: tr.description };
}
