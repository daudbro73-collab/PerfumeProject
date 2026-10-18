import { Concentration, Product, ProductType } from "@/types";

export const PRODUCT_VOLUMES = ["5 ml", "10 ml", "20 ml", "50 ml", "100 ml"] as const;
export const FULL_BOTTLE_ML = 100;

export function parseVolumeMl(volume: string): number {
  const match = volume.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 5;
}

export function getDefaultVolume(): string {
  return PRODUCT_VOLUMES[1];
}

export function getOilPricePerMl(product: Product, concentration: Concentration): number {
  const base =
    product.oilPricePerMl ??
    (product.oilPrice != null
      ? product.oilPrice > 500
        ? product.oilPrice / 10
        : product.oilPrice
      : product.price > 500
        ? product.price / 10
        : product.price);

  return concentration === "oil" ? base : base / 2;
}

export function getOriginalDecantPricePerMl(product: Product): number {
  if (product.originalDecantPricePerMl != null) return product.originalDecantPricePerMl;

  const full = product.originalPrice ?? product.price;
  const bottleMl = parseVolumeMl(product.originalVolume ?? "100 мл");
  return Math.round((full / bottleMl) * 1.15);
}

export function getOriginalFullPrice(product: Product): number {
  return product.originalPrice ?? product.price;
}

export function isOriginalFullBottle(volume: string): boolean {
  return parseVolumeMl(volume) >= FULL_BOTTLE_ML;
}

export function getUnitPrice(params: {
  product: Product;
  volume: string;
  productType: ProductType;
}): number {
  const ml = parseVolumeMl(params.volume);

  if (params.productType === "original") {
    if (isOriginalFullBottle(params.volume)) {
      return getOriginalFullPrice(params.product);
    }
    return Math.round(getOriginalDecantPricePerMl(params.product) * ml);
  }

  const perMl = getOilPricePerMl(params.product, params.product.concentration);
  return Math.round(perMl * ml);
}

export function isDecantVolume(productType: ProductType, volume: string): boolean {
  return productType === "original" && !isOriginalFullBottle(volume);
}
