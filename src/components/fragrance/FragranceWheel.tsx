"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FragranceFamily } from "@/types";
import { useLocale, useFamilyLabel } from "@/context/LocaleContext";

const WHEEL_FAMILIES: FragranceFamily[] = [
  "citrus",
  "green",
  "aquatic",
  "fresh",
  "floral",
  "chypre",
  "fougere",
  "woody",
  "oriental",
  "gourmand",
  "spicy",
  "leather",
];

const FAMILY_COLORS: Record<FragranceFamily, string> = {
  floral: "#E8B4CB",
  oriental: "#C9A962",
  woody: "#8B6914",
  fresh: "#A8D8EA",
  chypre: "#6B8E6B",
  fougere: "#7A9E7E",
  gourmand: "#D4A574",
  citrus: "#F5D76E",
  aquatic: "#6EC6CA",
  spicy: "#C45C26",
  leather: "#9A7B8C",
  green: "#8FBC8F",
};

function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

function getSliceChordWidth(radius: number, sliceAngleDeg: number) {
  return 2 * radius * Math.sin((sliceAngleDeg * Math.PI) / 360);
}

function getLabelFontSize(label: string, chordWidth: number, isActive: boolean) {
  const charWidth = 0.56;
  const fitted = (chordWidth - 5) / (label.length * charWidth);
  const target = isActive ? 14 : 13;
  return Math.min(target, Math.max(9.5, fitted));
}

function describeArc(
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number
) {
  const start1 = polarToCartesian(cx, cy, outerR, startAngle);
  const end1 = polarToCartesian(cx, cy, outerR, endAngle);
  const start2 = polarToCartesian(cx, cy, innerR, endAngle);
  const end2 = polarToCartesian(cx, cy, innerR, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${start1.x.toFixed(2)} ${start1.y.toFixed(2)}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${end1.x.toFixed(2)} ${end1.y.toFixed(2)}`,
    `L ${start2.x.toFixed(2)} ${start2.y.toFixed(2)}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 0 ${end2.x.toFixed(2)} ${end2.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

function WheelInfoPanel({ family }: { family: FragranceFamily }) {
  const { t } = useLocale();
  const info = useFamilyLabel(family);

  return (
    <>
      <div
        className="w-12 h-12 rounded-full mb-4"
        style={{ backgroundColor: FAMILY_COLORS[family] }}
      />
      <h3 className="text-3xl font-semibold text-ink mb-2">{info.label}</h3>
      <p className="text-ink-muted text-sm mb-6 leading-relaxed">{info.desc}</p>
      <Link
        href={`/catalog?family=${family}`}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-gold text-ink text-sm font-medium rounded-full hover:shadow-lg hover:shadow-gold/25 transition-all"
      >
        {t.wheel.pickScent}
      </Link>
    </>
  );
}

export default function FragranceWheel() {
  const { t } = useLocale();
  const [hovered, setHovered] = useState<FragranceFamily | null>(null);
  const [pinned, setPinned] = useState<FragranceFamily | null>(null);

  const cx = 200;
  const cy = 200;
  const innerR = 64;
  const outerR = 188;
  const labelR = outerR - 14;
  const sliceAngle = 360 / WHEEL_FAMILIES.length;
  const gap = 1.2;
  const chordWidth = getSliceChordWidth(labelR, sliceAngle - gap);

  const activeFamily = pinned ?? hovered;

  const handleSelect = (family: FragranceFamily) => {
    setPinned((prev) => (prev === family ? null : family));
    setHovered(null);
  };

  const getLabel = (family: FragranceFamily) =>
    t.families[family].label;

  return (
    <section id="wheel" className="py-20 md:py-28 bg-gradient-premium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-gold text-sm tracking-[0.3em] uppercase mb-3 font-medium">
            {t.wheel.tag}
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-ink">
            {t.wheel.title}{" "}
            <span className="text-gradient-gold font-semibold">{t.wheel.titleAccent}</span>
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
          <div className="relative w-full max-w-[min(100%,300px)] sm:max-w-[380px] lg:max-w-[480px] aspect-square mx-auto">
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full"
              role="img"
              aria-label={t.wheel.ariaLabel}
              shapeRendering="geometricPrecision"
            >
              <defs>
                <radialGradient id="wheelCenter" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F5E6C8" />
                  <stop offset="100%" stopColor="#C9A962" />
                </radialGradient>
              </defs>

              {WHEEL_FAMILIES.map((family, i) => {
                const startAngle = i * sliceAngle + gap / 2;
                const endAngle = (i + 1) * sliceAngle - gap / 2;
                const isPinned = pinned === family;
                const isActive = activeFamily === family;
                const midAngle = startAngle + (endAngle - startAngle) / 2;
                const labelPos = polarToCartesian(cx, cy, labelR, midAngle);
                const label = getLabel(family);
                const textRotation = midAngle > 90 && midAngle < 270 ? midAngle + 180 : midAngle;
                const fontSize = getLabelFontSize(label, chordWidth, isActive);

                return (
                  <g key={family}>
                    <path
                      d={describeArc(cx, cy, innerR, outerR, startAngle, endAngle)}
                      fill={FAMILY_COLORS[family]}
                      fillOpacity={isActive ? 1 : activeFamily ? 0.4 : 0.88}
                      stroke={isActive ? "#A68B3D" : "#FAF7F2"}
                      strokeWidth={isPinned ? 2.5 : isActive ? 2 : 1.5}
                      className="cursor-pointer"
                      style={{ transition: "fill-opacity 0.2s, stroke 0.2s" }}
                      onMouseEnter={() => !pinned && setHovered(family)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => handleSelect(family)}
                    />
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      pointerEvents="none"
                      fill={isActive ? "#1A1A1A" : "#2D2A26"}
                      fontSize={fontSize}
                      fontWeight={isActive ? 600 : 500}
                      fontFamily="var(--font-montserrat), Montserrat, sans-serif"
                      transform={`rotate(${textRotation}, ${labelPos.x}, ${labelPos.y})`}
                      stroke="#FAF7F2"
                      strokeWidth={0.35}
                      paintOrder="stroke"
                    >
                      <tspan>{label}</tspan>
                    </text>
                  </g>
                );
              })}

              <circle cx={cx} cy={cy} r={innerR - 4} fill="url(#wheelCenter)" stroke="#A68B3D" strokeWidth={1} />
              <text x={cx} y={cy - 7} textAnchor="middle" fill="#1A1A1A" fontSize="14" fontWeight="600" fontFamily="var(--font-montserrat), Montserrat, sans-serif">
                Élixir
              </text>
              <text x={cx} y={cy + 11} textAnchor="middle" fill="#6B6560" fontSize="7" letterSpacing="3" fontWeight="500" fontFamily="var(--font-montserrat), Montserrat, sans-serif">
                PARFUM
              </text>
            </svg>
          </div>

          <div className="w-full max-w-md min-h-[240px] mx-auto">
            <AnimatePresence mode="wait">
              {activeFamily ? (
                <motion.div
                  key={activeFamily}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="glass-card rounded-2xl p-8"
                >
                  <WheelInfoPanel family={activeFamily} />
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card rounded-2xl p-8 text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold/10 flex items-center justify-center">
                    <span className="text-2xl">✦</span>
                  </div>
                  <p className="text-ink-muted text-sm">{t.wheel.hoverHint}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
