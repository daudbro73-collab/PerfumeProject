import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { ProductsProvider } from "@/context/ProductsContext";
import { LocaleProvider } from "@/context/LocaleContext";
import ServiceWorkerRegister from "@/components/pwa/ServiceWorkerRegister";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { OrdersProvider } from "@/context/OrdersContext";
import CartDrawer from "@/components/cart/CartDrawer";
import ContactManagerButton from "@/components/contact/ContactManagerButton";

const montserrat = Montserrat({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Élixir Parfum — Масляные духи и оригинальная парфюмерия",
    template: "%s | Élixir Parfum",
  },
  description:
    "Премиальные масляные духи по мотивам ароматов ведущих брендов и оригинальная парфюмерия. Каталог с фильтрами, колесо ароматов и пирамида нот.",
  keywords: [
    "парфюмерия",
    "масляные духи",
    "духи",
    "ароматы",
    "нишевая парфюмерия",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Élixir Parfum",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Élixir Parfum",
    title: "Élixir Parfum — Масляные духи и оригинальная парфюмерия",
    description: "Премиальные масляные духи и оригинальная парфюмерия",
  },
};

export const viewport: Viewport = {
  themeColor: "#C9A962",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={montserrat.variable}>
      <body className="min-h-screen flex flex-col bg-milk font-sans">
        <ProductsProvider>
          <LocaleProvider>
            <OrdersProvider>
            <CartProvider>
            <ServiceWorkerRegister />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ContactManagerButton />
          <CartDrawer />
            </CartProvider>
            </OrdersProvider>
          </LocaleProvider>
        </ProductsProvider>
      </body>
    </html>
  );
}
