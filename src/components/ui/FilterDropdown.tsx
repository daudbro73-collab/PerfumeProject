"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterDropdownProps {
  label: string;
  placeholder: string;
  options: { value: string; label: string; color?: string }[];
  selected: string[];
  onChange: (selected: string[]) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  notFoundLabel?: string;
  selectedLabel?: string;
}

export default function FilterDropdown({
  label,
  placeholder,
  options,
  selected,
  onChange,
  searchable = true,
  searchPlaceholder = "Search...",
  notFoundLabel = "Not found",
  selectedLabel = "selected",
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  const displayText =
    selected.length === 0
      ? placeholder
      : selected.length === 1
      ? options.find((o) => o.value === selected[0])?.label ?? selected[0]
      : `${selected.length} ${selectedLabel}`;

  return (
    <div className="mb-5" ref={ref}>
      <h4 className="text-xs font-semibold text-gold uppercase tracking-[0.2em] mb-2">
        {label}
      </h4>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={cn(
            "w-full flex items-center justify-between gap-2 px-3.5 py-2.5 bg-cream border rounded-xl text-sm transition-all",
            open
              ? "border-gold shadow-sm shadow-gold/10"
              : "border-gold/20 hover:border-gold/40"
          )}
        >
          <span
            className={cn(
              "truncate",
              selected.length ? "text-ink font-medium" : "text-ink-muted"
            )}
          >
            {displayText}
          </span>
          <div className="flex items-center gap-1 flex-shrink-0">
            {selected.length > 0 && (
              <span
                role="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange([]);
                }}
                className="p-0.5 text-ink-muted hover:text-ink rounded"
              >
                <X className="w-3.5 h-3.5" />
              </span>
            )}
            <ChevronDown
              className={cn(
                "w-4 h-4 text-gold transition-transform",
                open && "rotate-180"
              )}
            />
          </div>
        </button>

        {open && (
          <div className="absolute z-30 top-full left-0 right-0 mt-1.5 bg-milk border border-gold/25 rounded-xl shadow-xl shadow-gold/10 overflow-hidden">
            {searchable && options.length > 5 && (
              <div className="p-2 border-b border-gold/10">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-muted" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="w-full pl-8 pr-3 py-2 bg-cream border border-gold/15 rounded-lg text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:border-gold"
                  />
                </div>
              </div>
            )}
            <div className="max-h-52 overflow-y-auto scrollbar-hide p-1.5">
              {filtered.length === 0 ? (
                <p className="text-xs text-ink-muted text-center py-4">{notFoundLabel}</p>
              ) : (
                filtered.map((option) => {
                  const checked = selected.includes(option.value);
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => toggle(option.value)}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-sm transition-colors",
                        checked
                          ? "bg-gold/10 text-ink"
                          : "text-ink-light hover:bg-gold/5"
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0",
                          checked ? "border-gold bg-gold" : "border-gold/30"
                        )}
                      >
                        {checked && (
                          <svg className="w-2.5 h-2.5 text-ink" fill="currentColor" viewBox="0 0 12 12">
                            <path d="M10.28 2.28a1 1 0 00-1.42 0L4.5 6.64 3.14 5.28a1 1 0 00-1.42 1.42l2.5 2.5a1 1 0 001.42 0l5.5-5.5a1 1 0 000-1.42z" />
                          </svg>
                        )}
                      </div>
                      {option.color && (
                        <span
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: option.color }}
                        />
                      )}
                      <span className="truncate">{option.label}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
