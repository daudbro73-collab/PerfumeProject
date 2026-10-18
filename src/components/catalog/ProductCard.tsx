"use client";

import Link from "next/link";
import { Product, FRAGRANCE_FAMILIES } from "@/types";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/catalog/ProductImage";
import { useLocale } from "@/context/LocaleContext";
import { getLocalizedProduct } from "@/lib/localizeProduct";
import {
  getProductMinPrice,
} from "@/lib/productTypes";

function getVolumeLabel(product: Product, t: ReturnType<typeof useLocale>["t"]) {
  return t.product.volumesShort;
}

function getCardPrice(product: Product) {
  return getProductMinPrice(product);
}

interface ProductCardProps {
  product: Product;
  variant?: "grid" | "list";
}

export default function ProductCard({ product, variant = "grid" }: ProductCardProps) {
  const { t, locale } = useLocale();
  const localized = getLocalizedProduct(product, locale);

  if (variant === "list") {
    return (
      <Link
        href={`/product/${product.id}`}
        className="group glass-card rounded-2xl overflow-hidden hover:shadow-lg hover:shadow-gold/10 transition-all flex flex-row min-h-[100px]"
      >
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 self-center my-3 ml-3 rounded-xl overflow-hidden bg-cream">
          <ProductImage
            productId={product.id}
            image={product.image}
            alt={product.name}
            sizes="112px"
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="p-3 sm:p-4 flex-1 min-w-0 flex flex-col justify-center">
          <p className="text-[9px] sm:text-[10px] text-gold uppercase tracking-[0.15em] mb-0.5 truncate">{product.brand}</p>
          <h3 className="text-sm sm:text-base font-semibold text-ink group-hover:text-gold-dark transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
          {product.inspiredBy && (
            <p className="text-[11px] text-ink-muted truncate hidden sm:block">
              {t.product.inspiredBy} {product.inspiredBy}
            </p>
          )}
          <p className="text-xs text-ink-light line-clamp-1 mt-1 mb-1.5 hidden md:block">{localized.description}</p>
          <div className="flex items-center justify-between gap-2">
            <span className="text-base sm:text-lg font-semibold text-ink">{formatPrice(getCardPrice(product), locale)}</span>
            <span className="text-[10px] sm:text-xs text-ink-muted truncate">
              {getVolumeLabel(product, t)}
            </span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/product/${product.id}`}
      className="group glass-card rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-gold/10 transition-all duration-300 sm:hover:-translate-y-1"
    >
      <div className="relative aspect-[4/5] sm:aspect-[3/4] max-h-[200px] sm:max-h-[280px] md:max-h-none bg-cream overflow-hidden">
        <ProductImage
          productId={product.id}
          image={product.image}
          alt={product.name}
          sizes="(max-width: 640px) 45vw, (max-width: 1200px) 33vw, 25vw"
          className="transition-transform duration-700 group-hover:scale-105"
        />

        {product.featured && (
          <span className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 px-1.5 sm:px-2.5 py-0.5 bg-gradient-gold text-ink text-[8px] sm:text-[10px] font-semibold uppercase tracking-wider rounded-full z-10">
            {t.product.hit}
          </span>
        )}

        {!product.inStock && (
          <span className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 px-1.5 sm:px-2.5 py-0.5 bg-ink/80 text-milk text-[8px] sm:text-[10px] font-medium uppercase tracking-wider rounded-full z-10">
            {t.product.noStock}
          </span>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 bg-gradient-to-t from-ink/70 to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 z-10 hidden sm:block">
          <div className="flex flex-wrap gap-1">
            {product.families.slice(0, 2).map((f) => (
              <span
                key={f}
                className="px-2 py-0.5 text-[10px] rounded-full text-ink"
                style={{ backgroundColor: `${FRAGRANCE_FAMILIES[f].color}cc` }}
              >
                {t.families[f].label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-2.5 sm:p-4 md:p-5">
        <p className="text-[9px] sm:text-[10px] text-gold uppercase tracking-[0.15em] mb-0.5 truncate">{product.brand}</p>
        <h3 className="text-sm sm:text-lg font-semibold text-ink mb-0.5 sm:mb-1 group-hover:text-gold-dark transition-colors line-clamp-2 leading-tight">
          {product.name}
        </h3>
        {product.inspiredBy && (
          <p className="text-[10px] sm:text-xs text-ink-muted mb-1 sm:mb-2 line-clamp-1 hidden sm:block">
            {t.product.inspiredBy} {product.inspiredBy}
          </p>
        )}
        <div className="flex items-center justify-between gap-1 mt-1.5 sm:mt-3">
          <span className="text-sm sm:text-lg font-semibold text-ink">{formatPrice(getCardPrice(product), locale)}</span>
          <span className="text-[9px] sm:text-xs text-ink-muted truncate">
            {getVolumeLabel(product, t)}
          </span>
        </div>
      </div>
    </Link>
  );
}
