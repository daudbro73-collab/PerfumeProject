"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, Grid3X3, LayoutList } from "lucide-react";
import ProductCard from "@/components/catalog/ProductCard";
import FilterPanel from "@/components/catalog/FilterPanel";
import { useProducts } from "@/context/ProductsContext";
import {
  filterProducts,
  getAllBrands,
  getAllNotes,
  createDefaultFilters,
  countActiveFilters,
  getMaxPrice,
} from "@/lib/filters";
import { FragranceFamily } from "@/types";
import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

function CatalogContent() {
  const { products } = useProducts();
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(createDefaultFilters());
  const [filterOpen, setFilterOpen] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  const maxPrice = useMemo(() => getMaxPrice(products), [products]);

  useEffect(() => {
    setFilters((prev) => {
      if (prev.priceRange[1] === 25000 || prev.priceRange[1] < maxPrice) {
        return { ...prev, priceRange: [prev.priceRange[0], maxPrice] };
      }
      return prev;
    });
  }, [maxPrice]);

  useEffect(() => {
    const family = searchParams.get("family") as FragranceFamily | null;
    if (family) {
      setFilters((prev) => ({ ...prev, families: [family] }));
    }
    const search = searchParams.get("q");
    if (search) {
      setFilters((prev) => ({ ...prev, search }));
    }
  }, [searchParams]);

  useEffect(() => {
    if (filterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [filterOpen]);

  const brands = useMemo(() => getAllBrands(products), [products]);
  const notes = useMemo(() => getAllNotes(products), [products]);
  const filtered = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  );
  const activeCount = countActiveFilters(filters, maxPrice);

  return (
    <div className="min-h-screen bg-milk overflow-x-hidden">
      <div className="bg-gradient-premium border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">{t.catalog.tag}</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-ink">
            {t.catalog.title}{" "}
            <span className="text-gradient-gold font-semibold">{t.catalog.titleAccent}</span>
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Search & controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder={t.catalog.search}
              className="w-full pl-11 pr-4 py-3 bg-cream border border-gold/20 rounded-xl text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-gold transition-colors"
            />
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setFilterOpen(true)}
              className="lg:hidden flex flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-3 bg-cream border border-gold/20 rounded-xl text-sm text-ink hover:border-gold transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-gold" />
              {t.catalog.filters}
              {activeCount > 0 && (
                <span className="w-5 h-5 bg-gold text-ink text-xs rounded-full flex items-center justify-center font-medium">
                  {activeCount}
                </span>
              )}
            </button>

            <div className="flex border border-gold/20 rounded-xl overflow-hidden bg-cream shrink-0">
              <button
                onClick={() => setView("grid")}
                className={cn(
                  "p-3 transition-colors",
                  view === "grid" ? "bg-gold/10 text-gold" : "text-ink-muted hover:text-ink"
                )}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn(
                  "p-3 transition-colors",
                  view === "list" ? "bg-gold/10 text-gold" : "text-ink-muted hover:text-ink"
                )}
                aria-label="List view"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products first on mobile, sidebar on desktop */}
        <div className="lg:grid lg:grid-cols-[288px_1fr] xl:grid-cols-[320px_1fr] lg:gap-8 lg:items-start">
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            brands={brands}
            notes={notes}
            isOpen={filterOpen}
            onClose={() => setFilterOpen(false)}
            maxPrice={maxPrice}
          />

          <div className="min-w-0">
            <p className="text-sm text-ink-muted mb-4 md:mb-6">
              {t.catalog.found}:{" "}
              <span className="text-ink font-medium">{filtered.length}</span>{" "}
              {filtered.length === 1
                ? t.catalog.scent1
                : filtered.length < 5
                ? t.catalog.scent2
                : t.catalog.scent5}
            </p>

            {filtered.length === 0 ? (
              <div className="text-center py-16 md:py-20 glass-card rounded-2xl">
                <p className="text-ink-muted mb-4">{t.catalog.empty}</p>
                <button
                  onClick={() => setFilters(createDefaultFilters(maxPrice))}
                  className="text-sm text-gold hover:text-gold-dark transition-colors"
                >
                  {t.catalog.reset}
                </button>
              </div>
            ) : (
              <div
                className={cn(
                  view === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 md:gap-6"
                    : "flex flex-col gap-2.5 sm:gap-4"
                )}
              >
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} variant={view} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-milk flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CatalogContent />
    </Suspense>
  );
}
