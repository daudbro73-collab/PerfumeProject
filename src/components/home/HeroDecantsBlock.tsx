"use client";

import Link from "next/link";
import { FlaskConical, ArrowRight } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

export default function HeroDecantsBlock() {
  const { t } = useLocale();

  return (
    <div className="mb-10 rounded-2xl border border-gold/25 bg-milk/70 backdrop-blur-md p-5 sm:p-6 shadow-lg shadow-gold/5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center flex-shrink-0">
          <FlaskConical className="w-6 h-6 text-gold" />
        </div>
        <div className="flex-1">
          <p className="text-gold text-[10px] sm:text-xs tracking-[0.3em] uppercase mb-1.5">
            {t.hero.decantsTag}
          </p>
          <h2 className="text-xl sm:text-2xl font-light text-ink mb-2">
            {t.hero.decantsTitle}{" "}
            <span className="text-gradient-gold font-semibold">
              {t.hero.decantsTitleAccent}
            </span>
          </h2>
          <p className="text-sm text-ink-light leading-relaxed mb-3">
            {t.hero.decantsDesc}
          </p>
          <p className="text-xs text-gold font-medium tracking-wide">
            {t.hero.decantsVolumes}
          </p>
        </div>
        <Link
          href="/catalog"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-gold text-ink text-sm font-medium rounded-full hover:shadow-lg transition-all flex-shrink-0"
        >
          {t.hero.decantsCta}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
