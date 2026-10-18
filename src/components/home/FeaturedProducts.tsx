"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import { useLocale } from "@/context/LocaleContext";
import { FragranceFamily, FRAGRANCE_FAMILIES } from "@/types";
import { formatPrice } from "@/lib/utils";
import ProductImage from "@/components/catalog/ProductImage";
import { getProductTypes } from "@/lib/productTypes";

const SLIDE_DURATION = 5500;

export default function FeaturedProducts() {
  const { products } = useProducts();
  const { t, locale } = useLocale();
  const slides = products.filter((p) => p.featured);
  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback(
    (nextIndex: number, dir: number) => {
      setDirection(dir);
      setIndex((nextIndex + slides.length) % slides.length);
      setProgress(0);
    },
    [slides.length]
  );

  const next = useCallback(() => goTo(index + 1, 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1, -1), [goTo, index]);

  useEffect(() => {
    if (slides.length <= 1) return;
    setProgress(0);
    const start = Date.now();
    const interval = setInterval(() => {
      const pct = Math.min(((Date.now() - start) / SLIDE_DURATION) * 100, 100);
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(interval);
        next();
      }
    }, 40);
    return () => clearInterval(interval);
  }, [index, slides.length, next]);

  if (!slides.length) return null;

  const current = slides[index];

  return (
    <section id="featured" className="py-16 md:py-24 bg-milk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-end sm:justify-between sm:text-left w-full mb-8 gap-4">
          <div>
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">{t.featured.tag}</p>
            <h2 className="text-4xl md:text-5xl font-light text-ink">
              {t.featured.title}{" "}
              <span className="text-gradient-gold font-semibold">{t.featured.titleAccent}</span>
            </h2>
          </div>
          <Link href="/catalog" className="text-sm text-gold hover:text-gold-dark transition-colors tracking-wide">
            {t.featured.allCatalog}
          </Link>
        </div>

        <div className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden border border-gold/20 shadow-2xl shadow-gold/10 bg-ink aspect-[4/5] sm:aspect-[16/10] lg:aspect-[2.2/1] max-h-[360px] sm:max-h-[320px] lg:max-h-[340px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="absolute inset-0"
            >
              <ProductImage
                productId={current.id}
                image={current.image}
                alt={current.name}
                priority={index === 0}
                sizes="100vw"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-ink/30 lg:to-ink/92" />

              <span className="absolute top-3 left-3 px-2.5 py-0.5 bg-gradient-gold text-ink text-[10px] font-bold uppercase tracking-wider rounded-full z-10">
                {t.featured.hit}
              </span>

              <div className="absolute bottom-0 left-0 right-0 lg:top-0 lg:bottom-0 lg:left-auto lg:w-[38%] p-4 sm:p-5 flex flex-col items-center text-center justify-end lg:items-start lg:text-left lg:justify-center">
                <p className="text-[10px] text-gold uppercase tracking-[0.25em] mb-1">
                  {current.brand}
                </p>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-milk mb-1 leading-tight">
                  {current.name}
                </h3>
                {current.inspiredBy && (
                  <p className="text-xs text-milk/50 mb-2 line-clamp-1">
                    {t.featured.inspiredBy} {current.inspiredBy}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 mb-3 justify-center lg:justify-start">
                  {current.families.slice(0, 2).map((f: FragranceFamily) => (
                    <span
                      key={f}
                      className="px-2 py-0.5 text-[10px] rounded-full text-ink font-medium"
                      style={{ backgroundColor: FRAGRANCE_FAMILIES[f].color }}
                    >
                      {t.families[f].label}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-center lg:justify-between gap-3 w-full">
                  <div>
                    <p className="text-lg sm:text-xl font-semibold text-gradient-gold">
                      {formatPrice(current.price, locale)}
                    </p>
                    <p className="text-[10px] text-milk/40">
                      {t.product.volumesShort} · {getProductTypes(current).map((type) => t.productType[type]).join(" · ")}
                    </p>
                  </div>
                  <Link
                    href={`/product/${current.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-gold text-ink text-xs font-medium rounded-full hover:shadow-lg transition-all flex-shrink-0"
                  >
                    {t.featured.details}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {slides.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-milk/10 backdrop-blur border border-milk/20 flex items-center justify-center text-milk hover:bg-gold/20 z-20"
                aria-label={t.featured.prev}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="absolute right-2 lg:right-[calc(38%+8px)] top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-milk/10 backdrop-blur border border-milk/20 flex items-center justify-center text-milk hover:bg-gold/20 z-20"
                aria-label={t.featured.next}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}

          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-milk/10 z-20">
            <div
              className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {slides.length > 1 && (
          <div className="flex flex-col items-center gap-3 mt-4 px-1 w-full max-w-2xl">
            <div className="flex gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i, i > index ? 1 : -1)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? "w-8 bg-gold" : "w-1.5 bg-gold/30 hover:bg-gold/50"
                  }`}
                  aria-label={`${t.featured.slide} ${i + 1}`}
                />
              ))}
            </div>
            <span className="text-xs text-ink-muted tabular-nums">
              {String(index + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
