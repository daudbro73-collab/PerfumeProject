"use client";

import { FilterState, FRAGRANCE_FAMILIES } from "@/types";
import { ALL_FAMILIES, ALL_CONCENTRATIONS, ALL_TYPES, toggleArrayItem, createDefaultFilters } from "@/lib/filters";
import { X, SlidersHorizontal } from "lucide-react";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { useLocale } from "@/context/LocaleContext";

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  brands: string[];
  notes: string[];
  isOpen: boolean;
  onClose: () => void;
  maxPrice?: number;
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <h4 className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-2">
        {title}
      </h4>
      {children}
    </div>
  );
}

function CheckboxItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <div
        className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
          checked ? "border-gold bg-gold" : "border-gold/30 group-hover:border-gold/60"
        }`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-ink" fill="currentColor" viewBox="0 0 12 12">
            <path d="M10.28 2.28a1 1 0 00-1.42 0L4.5 6.64 3.14 5.28a1 1 0 00-1.42 1.42l2.5 2.5a1 1 0 001.42 0l5.5-5.5a1 1 0 000-1.42z" />
          </svg>
        )}
      </div>
      <span className="text-sm text-ink-light group-hover:text-ink transition-colors">
        {label}
      </span>
    </label>
  );
}

function FilterContent({
  filters,
  onChange,
  brands,
  notes,
  onClose,
  showMobileHeader,
  maxPrice,
}: {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  brands: string[];
  notes: string[];
  onClose?: () => void;
  showMobileHeader?: boolean;
  maxPrice?: number;
}) {
  const { t } = useLocale();

  const update = (partial: Partial<FilterState>) => {
    onChange({ ...filters, ...partial });
  };

  return (
    <div className="p-5 md:p-6">
      <div
        className={`flex items-center justify-between mb-6 ${
          showMobileHeader ? "" : "hidden"
        }`}
      >
        <h3 className="text-lg font-semibold text-ink flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-gold" />
          {t.catalog.filters}
        </h3>
        {onClose && (
          <button onClick={onClose} className="p-1 text-ink-muted hover:text-ink">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className={`${showMobileHeader ? "hidden" : "flex"} items-center gap-2 mb-6`}>
        <SlidersHorizontal className="w-5 h-5 text-gold" />
        <h3 className="text-lg font-semibold text-ink">{t.catalog.filters}</h3>
      </div>

      <FilterSection title={t.catalog.type}>
        {ALL_TYPES.map((type) => (
          <CheckboxItem
            key={type}
            label={t.productType[type]}
            checked={filters.types.includes(type)}
            onChange={() => update({ types: toggleArrayItem(filters.types, type) })}
          />
        ))}
        <CheckboxItem
          label={t.catalog.inStockOnly}
          checked={filters.inStockOnly}
          onChange={() => update({ inStockOnly: !filters.inStockOnly })}
        />
      </FilterSection>

      <FilterDropdown
        label={t.catalog.brand}
        placeholder={t.catalog.allBrands}
        options={brands.map((b) => ({ value: b, label: b }))}
        selected={filters.brands}
        onChange={(brands) => update({ brands })}
        selectedLabel={t.catalog.selected}
      />

      <FilterDropdown
        label={t.catalog.family}
        placeholder={t.catalog.allFamilies}
        options={ALL_FAMILIES.map((f) => ({
          value: f,
          label: t.families[f].label,
          color: FRAGRANCE_FAMILIES[f].color,
        }))}
        selected={filters.families}
        onChange={(families) =>
          update({ families: families as FilterState["families"] })
        }
        searchable={false}
        selectedLabel={t.catalog.selected}
      />

      <FilterDropdown
        label={t.catalog.concentration}
        placeholder={t.catalog.anyConcentration}
        options={ALL_CONCENTRATIONS.map((c) => ({
          value: c,
          label: t.concentration[c],
        }))}
        selected={filters.concentrations}
        onChange={(concentrations) =>
          update({ concentrations: concentrations as FilterState["concentrations"] })
        }
        searchable={false}
        selectedLabel={t.catalog.selected}
      />

      <FilterDropdown
        label={t.catalog.notes}
        placeholder={t.catalog.allNotes}
        options={notes.map((n) => ({ value: n, label: n }))}
        selected={filters.notes}
        onChange={(notes) => update({ notes })}
        searchPlaceholder={t.catalog.searchNotes}
        notFoundLabel={t.catalog.notFound}
        selectedLabel={t.catalog.selected}
      />

      <FilterSection title={t.catalog.price}>
        <div className="flex items-center gap-3">
          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) =>
              update({ priceRange: [Number(e.target.value), filters.priceRange[1]] })
            }
            className="w-full px-3 py-2 bg-cream border border-gold/20 rounded-lg text-sm text-ink focus:outline-none focus:border-gold"
            placeholder={t.catalog.from}
          />
          <span className="text-ink-muted">—</span>
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) =>
              update({ priceRange: [filters.priceRange[0], Number(e.target.value)] })
            }
            className="w-full px-3 py-2 bg-cream border border-gold/20 rounded-lg text-sm text-ink focus:outline-none focus:border-gold"
            placeholder={t.catalog.to}
          />
        </div>
      </FilterSection>

      <button
        onClick={() => onChange(createDefaultFilters(maxPrice))}
        className="w-full mt-2 py-2.5 text-sm text-ink-muted hover:text-gold border border-gold/20 rounded-lg hover:border-gold/40 transition-all"
      >
        {t.catalog.resetFilters}
      </button>
    </div>
  );
}

export default function FilterPanel({
  filters,
  onChange,
  brands,
  notes,
  isOpen,
  onClose,
  maxPrice,
}: FilterPanelProps) {
  return (
    <>
      {/* Desktop sidebar — only lg+ */}
      <aside className="max-lg:hidden lg:block lg:w-72 xl:w-80 shrink-0">
        <div className="sticky top-24 glass-card rounded-2xl overflow-hidden">
          <FilterContent
            filters={filters}
            onChange={onChange}
            brands={brands}
            notes={notes}
            maxPrice={maxPrice}
          />
        </div>
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-milk shadow-2xl overflow-y-auto">
            <FilterContent
              filters={filters}
              onChange={onChange}
              brands={brands}
              notes={notes}
              onClose={onClose}
              showMobileHeader
              maxPrice={maxPrice}
            />
          </div>
        </div>
      )}
    </>
  );
}
