"use client";

import Link from "next/link";
import { ArrowRight, Droplets, Sparkles, Shield } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import HeroBackgroundSlideshow from "./HeroBackgroundSlideshow";
import HeroDecantsBlock from "./HeroDecantsBlock";

export default function Hero() {
  const { t } = useLocale();

  const perks = [
    { icon: Droplets, title: t.hero.oilTitle, desc: t.hero.oilDesc },
    { icon: Sparkles, title: t.hero.originalTitle, desc: t.hero.originalDesc },
    { icon: Shield, title: t.hero.qualityTitle, desc: t.hero.qualityDesc },
  ];

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      <HeroBackgroundSlideshow />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full z-10">
        <div className="max-w-3xl">
          <p className="text-gold text-sm tracking-[0.4em] uppercase mb-6">
            {t.hero.tagline}
          </p>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-ink leading-[1.1] mb-6">
            {t.hero.title}{" "}
            <span className="text-gradient-gold font-semibold italic">{t.hero.titleAccent}</span>
          </h1>

          <p className="text-ink-light text-base md:text-lg leading-relaxed mb-10 max-w-xl">
            {t.hero.desc}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-gold text-ink font-medium rounded-full hover:shadow-xl hover:shadow-gold/30 transition-all text-sm tracking-wide"
            >
              {t.hero.catalog}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#featured"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-gold/30 text-ink-light rounded-full hover:border-gold hover:bg-gold/5 transition-all text-sm tracking-wide backdrop-blur-sm bg-milk/30"
            >
              {t.hero.featured}
            </Link>
          </div>

          <HeroDecantsBlock />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {perks.map((item) => (
              <div key={item.title} className="flex items-start gap-3 backdrop-blur-sm bg-milk/40 rounded-xl p-3 border border-gold/10">
                <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm font-medium text-ink">{item.title}</p>
                  <p className="text-xs text-ink-muted">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
