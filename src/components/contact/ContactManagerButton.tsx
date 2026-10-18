"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Send, Phone, X, CircleHelp } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";

export default function ContactManagerButton() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { t } = useLocale();

  if (pathname.startsWith("/admin")) return null;

  const managers = [
    {
      name: "WhatsApp",
      desc: t.contact.whatsapp,
      icon: MessageCircle,
      href: "https://wa.me/79001234567",
      color: "#25D366",
    },
    {
      name: "Telegram",
      desc: t.contact.telegram,
      icon: Send,
      href: "https://t.me/elixir_parfum",
      color: "#0088cc",
    },
    {
      name: t.contact.call,
      desc: "+7 (900) 123-45-67",
      icon: Phone,
      href: "tel:+79001234567",
      color: "#C9A962",
    },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center gap-2.5 p-3.5 sm:px-5 sm:py-3.5 bg-gradient-gold text-ink font-medium text-sm rounded-full shadow-xl shadow-gold/30 hover:shadow-2xl hover:shadow-gold/40 hover:scale-105 transition-all"
        aria-label={t.contact.label}
      >
        <CircleHelp className="w-5 h-5" />
        <span className="hidden sm:inline">{t.contact.label}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-sm bg-milk rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gold/10 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-ink">{t.contact.title}</h3>
                <p className="text-xs text-ink-muted mt-0.5">{t.contact.subtitle}</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 text-ink-muted hover:text-ink">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {managers.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-xl border border-gold/15 hover:border-gold/40 hover:bg-gold/5 transition-all group"
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                    style={{ backgroundColor: `${item.color}18`, color: item.color }}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-ink text-sm">{item.name}</p>
                    <p className="text-xs text-ink-muted">{item.desc}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
