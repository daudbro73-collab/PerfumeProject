"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, Sparkles, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/context/LocaleContext";
import { useCart } from "@/context/CartContext";
import LanguageSwitcher from "@/components/layout/LanguageSwitcher";

export default function Header() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLocale();
  const { count, openCart } = useCart();

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/catalog", label: t.nav.catalog },
    { href: "/#wheel", label: t.nav.wheel },
    { href: "/#pyramid", label: t.nav.pyramid },
  ];

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <Sparkles className="hidden md:block w-6 h-6 text-gold group-hover:rotate-12 transition-transform" />
            <span className="text-2xl md:text-3xl font-semibold text-gradient-gold tracking-wide">
              Élixir
            </span>
            <span className="hidden md:inline text-xs text-ink-muted ml-2 tracking-widest uppercase">
              Parfum
            </span>
          </Link>

          <nav className={cn("hidden lg:flex items-center gap-8 flex-1 justify-center", isAdmin && "lg:hidden")}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-ink-light hover:text-gold transition-colors tracking-wide"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            <LanguageSwitcher className="hidden lg:flex" />

            {!isAdmin && (
              <button
                onClick={openCart}
                className="relative p-2.5 text-ink-light hover:text-gold transition-colors"
                aria-label={t.nav.cart}
              >
                <ShoppingCart className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] bg-gold text-ink text-[10px] font-bold rounded-full flex items-center justify-center">
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </button>
            )}

            {!isAdmin && (
              <Link
                href="/catalog"
                className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-gold text-ink text-sm font-medium rounded-full hover:shadow-lg hover:shadow-gold/25 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                {t.nav.catalog}
              </Link>
            )}

            {!isAdmin && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-ink-light hover:text-gold transition-colors"
                aria-label={t.nav.menu}
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {!isAdmin && (
      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="px-4 pb-4 space-y-1 border-t border-gold/10">
          <div className="py-2 px-4">
            <LanguageSwitcher />
          </div>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 text-ink-light hover:text-gold hover:bg-gold/5 rounded-lg transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      )}
    </header>
  );
}
