"use client";

import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useOrders } from "@/context/OrdersContext";
import { useLocale } from "@/context/LocaleContext";
import { formatPrice } from "@/lib/utils";
import { WHATSAPP_PHONE } from "@/lib/constants";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, clearCart } =
    useCart();
  const { addOrder } = useOrders();
  const { t, locale } = useLocale();

  if (!isOpen) return null;

  const itemWord =
    items.length === 1
      ? t.cart.items
      : items.length < 5
      ? t.cart.items2
      : t.cart.items5;

  const buildWhatsAppMessage = () => {
    const lines = items.map(
      (i) =>
        `• ${i.name} (${i.brand}) — ${i.volume}, ${t.productType[i.productType]}, ${i.isDecant ? t.cart.decant : t.cart.full} × ${i.quantity} = ${formatPrice(i.unitPrice * i.quantity, locale)}`
    );
    return encodeURIComponent(
      `${t.cart.title}:\n\n${lines.join("\n")}\n\n${t.cart.total}: ${formatPrice(total, locale)}`
    );
  };

  const handleCheckout = () => {
    addOrder(items, total);
    window.open(
      `https://wa.me/${WHATSAPP_PHONE}?text=${buildWhatsAppMessage()}`,
      "_blank"
    );
    clearCart();
    closeCart();
  };

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-ink/40" onClick={closeCart} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-milk shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gold/15">
          <h2 className="text-xl font-semibold text-ink">{t.cart.title}</h2>
          <button
            onClick={closeCart}
            className="p-2 text-ink-muted hover:text-ink transition-colors"
            aria-label={t.cart.remove}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-ink-muted mb-2">{t.cart.empty}</p>
              <p className="text-sm text-ink-muted/70">{t.cart.emptyHint}</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="glass-card rounded-xl p-4 border border-gold/10"
                >
                  <div className="flex justify-between gap-3 mb-2">
                    <div>
                      <p className="text-[10px] text-gold uppercase tracking-wider">
                        {item.brand}
                      </p>
                      <p className="font-medium text-ink text-sm">{item.name}</p>
                      <p className="text-xs text-ink-muted mt-0.5">
                        {item.volume} · {t.productType[item.productType]} ·{" "}
                        {item.isDecant ? t.cart.decant : t.cart.full}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-ink-muted hover:text-red-500 transition-colors p-1"
                      aria-label={t.cart.remove}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full border border-gold/30 flex items-center justify-center text-ink hover:border-gold"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-medium w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full border border-gold/30 flex items-center justify-center text-ink hover:border-gold"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-semibold text-ink">
                      {formatPrice(item.unitPrice * item.quantity, locale)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-5 border-t border-gold/15 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-ink-muted text-sm">
                {items.length} {itemWord}
              </span>
              <span className="text-xl font-semibold text-ink">
                {formatPrice(total, locale)}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCheckout}
              className="block w-full text-center px-6 py-3.5 bg-gradient-gold text-ink font-medium rounded-full hover:shadow-lg transition-all text-sm"
            >
              {t.cart.checkout}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
