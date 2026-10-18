"use client";

import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { WhatsAppIcon, TelegramIcon, InstagramIcon } from "@/components/icons/BrandIcons";
import { useLocale } from "@/context/LocaleContext";
import { WHATSAPP_PHONE, TELEGRAM_URL, CONTACT_PHONE, CONTACT_EMAIL } from "@/lib/constants";

const integrations = [
  { name: "WhatsApp", icon: WhatsAppIcon, href: `https://wa.me/${WHATSAPP_PHONE}`, color: "#25D366" },
  { name: "Telegram", icon: TelegramIcon, href: TELEGRAM_URL, color: "#26A5E4" },
  { name: "Instagram", icon: InstagramIcon, href: "https://instagram.com", color: "#E4405F" },
];

export default function Footer() {
  const { t } = useLocale();

  return (
    <footer className="bg-ink text-milk mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-3xl text-gradient-gold font-semibold mb-4">Élixir Parfum</h3>
            <p className="text-milk/60 text-sm leading-relaxed">{t.footer.desc}</p>
          </div>

          <div>
            <h4 className="text-gold-light font-medium mb-4 tracking-wide uppercase text-sm">
              {t.footer.nav}
            </h4>
            <ul className="space-y-2 text-sm text-milk/60">
              <li><Link href="/catalog" className="hover:text-gold transition-colors">{t.nav.catalog}</Link></li>
              <li><Link href="/#wheel" className="hover:text-gold transition-colors">{t.nav.wheel}</Link></li>
              <li><Link href="/#pyramid" className="hover:text-gold transition-colors">{t.nav.pyramid}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold-light font-medium mb-4 tracking-wide uppercase text-sm">
              {t.footer.contacts}
            </h4>
            <ul className="space-y-3 text-sm text-milk/60">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                <a href={`tel:${CONTACT_PHONE}`} className="hover:text-gold transition-colors">
                  +7 (900) 123-45-67
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-gold transition-colors">
                  {CONTACT_EMAIL}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-gold-light font-medium mb-4 tracking-wide uppercase text-sm">
              {t.footer.messengers}
            </h4>
            <div className="flex gap-3">
              {integrations.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="w-10 h-10 rounded-full bg-milk/10 flex items-center justify-center hover:bg-milk/20 transition-colors"
                  aria-label={item.name}
                  style={{ color: item.color }}
                >
                  <item.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-milk/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-milk/40">
          <p>&copy; {new Date().getFullYear()} Élixir Parfum. {t.footer.rights}</p>
          <div className="flex items-center gap-4">
            <Link href="/admin" className="hover:text-gold/60 transition-colors">
              CRM
            </Link>
            <p>{t.footer.made}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
