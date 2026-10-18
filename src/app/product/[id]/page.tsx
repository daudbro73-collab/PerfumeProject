"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import { useLocale } from "@/context/LocaleContext";
import { FRAGRANCE_FAMILIES, FragranceFamily } from "@/types";
import { formatPrice } from "@/lib/utils";
import ProductCard from "@/components/catalog/ProductCard";
import ProductImage from "@/components/catalog/ProductImage";
import { getLocalizedProduct } from "@/lib/localizeProduct";
import AddToCartBlock from "@/components/cart/AddToCartBlock";
import {
  getProductTypes,
  productHasBothTypes,
  getProductMinPrice,
  formatProductTypesLabel,
} from "@/lib/productTypes";
import {
  getOilPricePerMl,
  getOriginalDecantPricePerMl,
  getOriginalFullPrice,
} from "@/lib/volumes";

export default function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { getProduct, products } = useProducts();
  const { t, locale } = useLocale();
  const rawProduct = getProduct(id);
  const product = rawProduct ? getLocalizedProduct(rawProduct, locale) : undefined;

  if (!product) {
    return (
      <div className="min-h-screen bg-milk flex items-center justify-center">
        <div className="text-center">
          <p className="text-ink-muted mb-4">{t.product.notFound}</p>
          <Link href="/catalog" className="text-gold hover:text-gold-dark">
            {t.product.backToCatalog}
          </Link>
        </div>
      </div>
    );
  }

  const related = products
    .filter(
      (p) =>
        p.id !== product.id &&
        p.families.some((f: FragranceFamily) => product.families.includes(f))
    )
    .slice(0, 3);

  const noteLevels = [
    { key: "top" as const, label: t.product.topNotes, color: "#E8D5A3" },
    { key: "heart" as const, label: t.product.heartNotes, color: "#C9A962" },
    { key: "base" as const, label: t.product.baseNotes, color: "#8B6914" },
  ];

  return (
    <div className="min-h-screen bg-milk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.product.back}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          <div className="relative aspect-[4/5] max-h-[280px] sm:max-h-[400px] lg:max-h-[600px] mx-auto w-full max-w-sm lg:max-w-none bg-cream rounded-2xl overflow-hidden">
            <ProductImage
              productId={product.id}
              image={product.image}
              alt={product.name}
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div>
            <p className="text-gold text-sm tracking-[0.2em] uppercase mb-2">
              {product.brand}
            </p>
            <h1
              className="text-4xl md:text-5xl font-light text-ink mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {product.name}
            </h1>
            {product.inspiredBy && (
              <p className="text-ink-muted mb-6">
                {t.product.inspiredBy}{" "}
                <span className="text-ink-light">{product.inspiredBy}</span>
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-6">
              {product.families.map((f) => (
                <Link
                  key={f}
                  href={`/catalog?family=${f}`}
                  className="px-3 py-1 text-xs rounded-full border transition-colors hover:opacity-80"
                  style={{
                    backgroundColor: `${FRAGRANCE_FAMILIES[f].color}33`,
                    borderColor: FRAGRANCE_FAMILIES[f].color,
                  }}
                >
                  {t.families[f].label}
                </Link>
              ))}
            </div>

            <p className="text-3xl font-semibold text-ink mb-1">
              {productHasBothTypes(rawProduct!) ? (
                <>
                  {t.product.from}{" "}
                  {formatPrice(getProductMinPrice(rawProduct!), locale)}
                </>
              ) : getProductTypes(rawProduct!).includes("oil") ? (
                <>
                  {formatPrice(getOilPricePerMl(rawProduct!, product.concentration), locale)}
                  <span className="text-base font-normal text-ink-muted ml-2">
                    {t.product.per1ml}
                  </span>
                </>
              ) : (
                <>
                  {formatPrice(getOriginalDecantPricePerMl(rawProduct!), locale)}
                  <span className="text-base font-normal text-ink-muted ml-2">
                    {t.product.per1ml} ({t.product.decant})
                  </span>
                </>
              )}
            </p>
            <p className="text-sm text-ink-muted mb-2">
              {t.product.volumesShort} · {formatProductTypesLabel(rawProduct!, t.productType)} ·{" "}
              {t.concentration[product.concentration]}
            </p>
            {getProductTypes(rawProduct!).includes("oil") &&
              product.concentration !== "oil" && (
                <p className="text-xs text-ink-muted mb-2">{t.product.concentrationDiscount}</p>
              )}
            {getProductTypes(rawProduct!).includes("original") && (
              <p className="text-sm text-ink-muted mb-8">
                {t.product.fullBottle} 100 мл —{" "}
                {formatPrice(getOriginalFullPrice(rawProduct!), locale)}
              </p>
            )}
            {!getProductTypes(rawProduct!).includes("original") && (
              <div className="mb-8" />
            )}

            <p className="text-ink-light leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="glass-card rounded-2xl p-6 mb-8">
              <h3
                className="text-xl font-semibold text-ink mb-5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {t.product.pyramid}
              </h3>
              {noteLevels.map((level) => (
                <div key={level.key} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: level.color }}
                    />
                    <span className="text-sm font-medium text-ink">
                      {level.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pl-5">
                    {product.notes[level.key].map((note) => (
                      <span
                        key={note}
                        className="px-2.5 py-1 bg-gold/10 text-ink-light text-xs rounded-full"
                      >
                        {note}
                      </span>
              ))}
                  </div>
                </div>
              ))}
            </div>

            {product.inStock ? (
              <AddToCartBlock product={rawProduct!} />
            ) : (
              <p className="text-ink-muted text-sm">{t.product.outOfStock}</p>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2
              className="text-3xl font-light text-ink mb-8"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t.product.similar}{" "}
              <span className="text-gradient-gold font-semibold">
                {t.product.similarAccent}
              </span>
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
