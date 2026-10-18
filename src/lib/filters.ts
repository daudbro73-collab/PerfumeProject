import {
  Product,
  FilterState,
  FragranceFamily,
  Concentration,
  ProductType,
} from "@/types";
import { getProductTypes } from "@/lib/productTypes";
import { DEFAULT_PRICE_MAX } from "@/lib/constants";

export function getAllBrands(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.brand))].sort();
}

export function getAllNotes(products: Product[]): string[] {
  const notes = new Set<string>();
  products.forEach((p) => {
    [...p.notes.top, ...p.notes.heart, ...p.notes.base].forEach((n) =>
      notes.add(n)
    );
  });
  return [...notes].sort();
}

export function getMaxPrice(products: Product[]): number {
  if (!products.length) return DEFAULT_PRICE_MAX;
  const max = Math.max(
    ...products.flatMap((p) => {
      const prices = [p.price];
      if (p.oilPricePerMl) prices.push(p.oilPricePerMl * 5);
      if (p.originalDecantPricePerMl) prices.push(p.originalDecantPricePerMl * 5);
      if (p.originalPrice) prices.push(p.originalPrice);
      return prices;
    })
  );
  return Math.ceil(max / 1000) * 1000 || DEFAULT_PRICE_MAX;
}

export function filterProducts(
  products: Product[],
  filters: FilterState
): Product[] {
  return products.filter((product) => {
    if (filters.inStockOnly && !product.inStock) return false;

    if (filters.search) {
      const q = filters.search.toLowerCase();
      const allNotes = [
        ...product.notes.top,
        ...product.notes.heart,
        ...product.notes.base,
      ].join(" ");
      const haystack = [
        product.name,
        product.brand,
        product.inspiredBy ?? "",
        product.description,
        product.descriptionEn ?? "",
        allNotes,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (filters.brands.length && !filters.brands.includes(product.brand)) {
      return false;
    }

    if (
      filters.types.length &&
      !filters.types.some((type) => getProductTypes(product).includes(type))
    ) {
      return false;
    }

    if (
      filters.concentrations.length &&
      !filters.concentrations.includes(product.concentration)
    ) {
      return false;
    }

    if (
      filters.families.length &&
      !filters.families.some((f) => product.families.includes(f))
    ) {
      return false;
    }

    if (filters.notes.length) {
      const productNotes = [
        ...product.notes.top,
        ...product.notes.heart,
        ...product.notes.base,
      ];
      if (!filters.notes.some((n) => productNotes.includes(n))) {
        return false;
      }
    }

    if (
      product.price < filters.priceRange[0] ||
      product.price > filters.priceRange[1]
    ) {
      return false;
    }

    return true;
  });
}

export function createDefaultFilters(maxPrice = DEFAULT_PRICE_MAX): FilterState {
  return {
    brands: [],
    notes: [],
    families: [],
    concentrations: [],
    types: [],
    search: "",
    priceRange: [0, maxPrice],
    inStockOnly: false,
  };
}

export const defaultFilters: FilterState = createDefaultFilters();

export function countActiveFilters(
  filters: FilterState,
  maxPrice = DEFAULT_PRICE_MAX
): number {
  let count = 0;
  if (filters.brands.length) count++;
  if (filters.notes.length) count++;
  if (filters.families.length) count++;
  if (filters.concentrations.length) count++;
  if (filters.types.length) count++;
  if (filters.search) count++;
  if (filters.inStockOnly) count++;
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice) count++;
  return count;
}

export function toggleArrayItem<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

export const ALL_FAMILIES: FragranceFamily[] = [
  "floral",
  "oriental",
  "woody",
  "fresh",
  "chypre",
  "fougere",
  "gourmand",
  "citrus",
  "aquatic",
  "spicy",
  "leather",
  "green",
];

export const ALL_CONCENTRATIONS: Concentration[] = [
  "oil",
  "parfum",
  "extrait",
  "edp",
  "edt",
  "edc",
];

export const ALL_TYPES: ProductType[] = ["oil", "original"];
