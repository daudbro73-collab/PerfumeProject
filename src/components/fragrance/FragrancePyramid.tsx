"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "@/context/LocaleContext";

export default function FragrancePyramid() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const { t } = useLocale();

  const activeLevel = pinned ?? hovered;

  const handleSelect = (key: string) => {
    setPinned((prev) => (prev === key ? null : key));
    setHovered(null);
  };

  const levels = [
    { key: "top" as const, label: t.pyramid.top, subtitle: t.pyramid.topSub, color: "#E8D5A3", borderColor: "#C9A962", desc: t.pyramid.topDesc },
    { key: "heart" as const, label: t.pyramid.heart, subtitle: t.pyramid.heartSub, color: "#C9A962", borderColor: "#A68B3D", desc: t.pyramid.heartDesc },
    { key: "base" as const, label: t.pyramid.base, subtitle: t.pyramid.baseSub, color: "#8B6914", borderColor: "#6B5010", desc: t.pyramid.baseDesc },
  ];

  const noteExamples = t.pyramid.noteExamples;

  return (
    <section id="pyramid" className="py-16 md:py-24 bg-milk">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3">{t.pyramid.tag}</p>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-light text-ink mb-4">
            {t.pyramid.title}{" "}
            <span className="text-gradient-gold font-semibold">{t.pyramid.titleAccent}</span>
          </h2>
          <p className="text-ink-muted max-w-2xl mx-auto text-sm md:text-base">{t.pyramid.desc}</p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12">
          <div className="relative w-full max-w-[min(100%,260px)] sm:max-w-[300px] lg:max-w-[340px] mx-auto">
            {levels.map((level, i) => {
              const widthPercent = 40 + i * 30;
              const isActive = activeLevel === level.key;
              const isPinned = pinned === level.key;

              return (
                <motion.div
                  key={level.key}
                  className="mx-auto cursor-pointer relative"
                  style={{ width: `${widthPercent}%` }}
                  onMouseEnter={() => !pinned && setHovered(level.key)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleSelect(level.key)}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div
                    className="relative py-3 sm:py-4 text-center transition-all duration-300"
                    style={{
                      background: `linear-gradient(180deg, ${level.color}${isActive ? "FF" : "CC"} 0%, ${level.color}88 100%)`,
                      clipPath:
                        i === 0
                          ? "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)"
                          : i === 1
                          ? "polygon(10% 0%, 90% 0%, 100% 100%, 0% 100%)"
                          : "polygon(5% 0%, 95% 0%, 100% 100%, 0% 100%)",
                      boxShadow: isActive
                        ? `0 6px 24px ${level.color}66, inset 0 1px 0 rgba(255,255,255,0.3)`
                        : `0 3px 12px ${level.color}33`,
                      border: isActive
                        ? `${isPinned ? 2.5 : 2}px solid ${level.borderColor}`
                        : "2px solid transparent",
                    }}
                  >
                    <p className="text-ink font-semibold text-xs sm:text-sm leading-tight px-1">
                      {level.label}
                    </p>
                    <p className="text-ink-muted text-[10px] mt-0.5 hidden sm:block leading-tight">
                      {level.subtitle}
                    </p>

                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 shimmer rounded-sm"
                      />
                    )}
                  </div>
                </motion.div>
              );
            })}

            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          </div>

          <div className="w-full max-w-sm min-h-[200px] mx-auto">
            <AnimatePresence mode="wait">
              {activeLevel ? (
                <motion.div
                  key={activeLevel}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="glass-card rounded-2xl p-5 md:p-6"
                >
                  {(() => {
                    const level = levels.find((l) => l.key === activeLevel)!;
                    return (
                      <>
                        <h3 className="text-xl font-semibold text-ink mb-1">{level.label}</h3>
                        <p className="text-gold text-xs tracking-wide mb-3">{level.subtitle}</p>
                        <p className="text-ink-muted text-sm mb-4 leading-relaxed">{level.desc}</p>
                        <div className="flex flex-wrap gap-1.5">
                          {noteExamples[level.key].map((note) => (
                            <span
                              key={note}
                              className="px-2.5 py-1 bg-gold/10 text-ink-light text-xs rounded-full border border-gold/20"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card rounded-2xl p-6 text-center"
                >
                  <div className="text-3xl mb-3">△</div>
                  <p className="text-ink-muted text-sm">{t.pyramid.hint}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
