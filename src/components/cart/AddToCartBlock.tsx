"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Product, ProductType } from "@/types";
import { useCart } from "@/context/CartContext";
import { useLocale } from "@/context/LocaleContext";
import { formatPrice } from "@/lib/utils";
import { getProductTypes, productHasBothTypes } from "@/lib/productTypes";
import {
  PRODUCT_VOLUMES,
  getDefaultVolume,
  getUnitPrice,
  getOilPricePerMl,
  getOriginalDecantPricePerMl,
  getOriginalFullPrice,
  isOriginalFullBottle,
} from "@/lib/volumes";

interface AddToCartBlockProps {
  product: Product;
}

export default function AddToCartBlock({ product }: AddToCartBlockProps) {
  const { addItem } = useCart();
  const { t, locale } = useLocale();
  const types = getProductTypes(product);
  const [selectedType, setSelectedType] = useState<ProductType>(types[0]);
  const [volume, setVolume] = useState(getDefaultVolume());
  const [quantity, setQuantity] = useState(1);

  const unitPrice = getUnitPrice({ product, volume, productType: selectedType });

  const handleAdd = () => {
    addItem({
      productId: product.id,
      name: product.name,
      brand: product.brand,
      volume,
      productType: selectedType,
      quantity,
    });
  };

  const priceHint =
    selectedType === "oil" ? (
      <p className="text-xs text-ink-muted">
        {formatPrice(getOilPricePerMl(product, product.concentration), locale)} {t.product.per1ml}
        {product.concentration !== "oil" && ` · ${t.product.concentrationDiscount}`}
      </p>
    ) : (
      <p className="text-xs text-ink-muted">
        {t.product.decant}: {formatPrice(getOriginalDecantPricePerMl(product), locale)} {t.product.per1ml}
        {" · "}
        {t.product.fullBottle}: {formatPrice(getOriginalFullPrice(product), locale)} (100 мл)
      </p>
    );

  return (
    <div className="glass-card rounded-2xl p-6 mb-8 space-y-5">
      {productHasBothTypes(product) && (
        <div>
          <p className="text-xs text-gold uppercase tracking-wider mb-2">
            {t.product.selectType}
          </p>
          <div className="flex gap-2">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setVolume(getDefaultVolume());
                }}
                className={`flex-1 py-2.5 text-sm rounded-full border transition-all ${
                  selectedType === type
                    ? "bg-gold/15 border-gold text-ink font-medium"
                    : "border-gold/20 text-ink-muted hover:border-gold/40"
                }`}
              >
                {t.productType[type]}
              </button>
            ))}
          </div>
        </div>
      )}

      {priceHint}

      <div>
        <p className="text-xs text-gold uppercase tracking-wider mb-2">
          {t.product.selectVolume}
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {PRODUCT_VOLUMES.map((v) => (
            <button
              key={v}
              onClick={() => setVolume(v)}
              className={`py-2 text-sm rounded-lg border transition-all ${
                volume === v
                  ? "bg-gold/15 border-gold text-ink font-medium"
                  : "border-gold/20 text-ink-muted hover:border-gold/40"
              }`}
            >
              {v}
              {selectedType === "original" && isOriginalFullBottle(v) && (
                <span className="block text-[9px] text-gold mt-0.5">{t.product.fullBottle}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gold uppercase tracking-wider mb-2">
            {t.product.quantity}
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center hover:border-gold"
            >
              −
            </button>
            <span className="text-lg font-medium w-6 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center hover:border-gold"
            >
              +
            </button>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold text-ink">
            {formatPrice(unitPrice * quantity, locale)}
          </p>
          <p className="text-xs text-ink-muted">
            {t.productType[selectedType]} · {volume}
          </p>
        </div>
      </div>

      <button
        onClick={handleAdd}
        disabled={!product.inStock}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-gold text-ink font-medium rounded-full hover:shadow-xl hover:shadow-gold/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingCart className="w-5 h-5" />
        {t.product.addToCart}
      </button>
    </div>
  );
}
