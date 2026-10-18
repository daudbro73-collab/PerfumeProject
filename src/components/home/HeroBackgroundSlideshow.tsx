"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const SLIDES = [
  {
    id: "white-linen",
    src: "https://images.unsplash.com/photo-1613521076081-2820f9746a2d?auto=format&fit=crop&w=1920&q=80",
    alt: "Perfume bottle on white linen",
  },
  {
    id: "minimal",
    src: "https://images.unsplash.com/photo-1768025719875-48ed072f3084?auto=format&fit=crop&w=1920&q=80",
    alt: "Minimalist perfume still life",
  },
  {
    id: "elegant",
    src: "https://images.unsplash.com/photo-1779562194252-baf05466a528?auto=format&fit=crop&w=1920&q=80",
    alt: "Elegant fragrance bottle",
  },
  {
    id: "soft-neutral",
    src: "https://images.unsplash.com/photo-1667803547275-621d478cc01d?auto=format&fit=crop&w=1920&q=80",
    alt: "Glass bottle on soft neutral background",
  },
  {
    id: "luxury-light",
    src: "https://images.unsplash.com/photo-1773527142301-9aa77252e5c2?auto=format&fit=crop&w=1920&q=80",
    alt: "Luxury perfume bottle in soft light",
  },
  {
    id: "flatlay",
    src: "https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=1920&q=80",
    alt: "Perfume and beauty flat lay",
  },
];

const INTERVAL = 6000;

export default function HeroBackgroundSlideshow() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, INTERVAL);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={SLIDES[index].id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={SLIDES[index].src}
            alt={SLIDES[index].alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover object-center brightness-105 saturate-[0.85]"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-milk/55 backdrop-blur-[1px]" />
      <div className="absolute inset-0 bg-gradient-to-r from-milk/88 via-milk/62 to-milk/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-milk/75 via-milk/25 to-transparent" />
    </div>
  );
}
