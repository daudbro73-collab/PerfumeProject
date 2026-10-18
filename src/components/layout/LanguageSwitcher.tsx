"use client";

import { useLocale } from "@/context/LocaleContext";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();

  return (
    <div className={cn("inline-flex w-fit items-center rounded-full border border-gold/25 overflow-hidden text-[11px] font-medium", className)}>
      {(["ru", "en"] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => setLocale(lang)}
          className={cn(
            "px-2 py-1 uppercase tracking-wide transition-all min-w-[2rem]",
            locale === lang
              ? "bg-gradient-gold text-ink"
              : "text-ink-muted hover:text-ink hover:bg-gold/5"
          )}
        >
          {lang}
        </button>
      ))}
    </div>
  );
}
