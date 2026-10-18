import { Product, ProductType } from "@/types";
import { getOilPricePerMl, getOriginalDecantPricePerMl, getOriginalFullPrice, getUnitPrice } from "@/lib/volumes";

export function getProductTypes(product: Pick<Product, "types" | "type">): ProductType[] {
  if (product.types?.length) return product.types;
  if (product.type) return [product.type];
  return ["oil"];
}

export function productHasType(
  product: Pick<Product, "types" | "type">,
  type: ProductType
): boolean {
  return getProductTypes(product).includes(type);
}

export function productHasBothTypes(product: Pick<Product, "types" | "type">): boolean {
  const types = getProductTypes(product);
  return types.includes("oil") && types.includes("original");
}

export function getProductMinPrice(product: Product): number {
  const types = getProductTypes(product);
  const prices = types.map((type) =>
    getUnitPrice({ product, volume: "5 ml", productType: type })
  );
  return Math.min(...prices);
}

export function normalizeProduct(product: Product): Product {
  const types: ProductType[] =
    product.types?.length > 0
      ? product.types
      : product.type
        ? [product.type]
        : ["oil"];

  const hasOil = types.includes("oil");
  const hasOriginal = types.includes("original");

  let oilPricePerMl: number | undefined;
  if (hasOil) {
    if (product.oilPricePerMl != null) {
      oilPricePerMl = product.oilPricePerMl;
    } else if (product.oilPrice != null) {
      oilPricePerMl = product.oilPrice > 500 ? product.oilPrice / 10 : product.oilPrice;
    } else {
      oilPricePerMl = product.price > 500 ? product.price / 10 : product.price;
    }
  }

  const originalPrice = hasOriginal ? getOriginalFullPrice(product) : undefined;
  const originalDecantPricePerMl = hasOriginal
    ? product.originalDecantPricePerMl ?? getOriginalDecantPricePerMl({ ...product, originalPrice })
    : undefined;

  return {
    ...product,
    types,
    oilPricePerMl,
    originalDecantPricePerMl,
    originalPrice,
    originalVolume: hasOriginal ? "100 мл" : product.originalVolume,
    oilPrice: oilPricePerMl,
    type: (hasOil && !hasOriginal ? "oil" : hasOriginal && !hasOil ? "original" : types[0]) as ProductType,
    price: hasOil ? (oilPricePerMl ?? product.price) : (originalPrice ?? product.price),
    volume: "100 мл",
    notesEn: undefined,
  };
}

export function formatProductTypesLabel(
  product: Pick<Product, "types" | "type">,
  labels: Record<ProductType, string>
): string {
  return getProductTypes(product).map((type) => labels[type]).join(" · ");
}

export function formatOilPriceLabel(product: Product): string {
  return `${getOilPricePerMl(product, product.concentration)} ₽/мл`;
}
