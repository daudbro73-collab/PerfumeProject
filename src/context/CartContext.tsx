"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { getUnitPrice, isDecantVolume } from "@/lib/volumes";
import { ProductType } from "@/types";
import { useProducts } from "@/context/ProductsContext";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  volume: string;
  quantity: number;
  unitPrice: number;
  isDecant: boolean;
  productType: ProductType;
}

interface AddToCartParams {
  productId: string;
  name: string;
  brand: string;
  volume: string;
  productType: ProductType;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (params: AddToCartParams) => boolean;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const STORAGE_KEY = "elixir-cart";

const CartContext = createContext<CartContextType | null>(null);

function makeItemId(productId: string, productType: ProductType, volume: string) {
  return `${productId}-${productType}-${volume}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { products, getProduct } = useProducts();
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    const validIds = new Set(products.map((p) => p.id));
    setItems((prev) => prev.filter((i) => validIds.has(i.productId)));
  }, [products]);

  const addItem = useCallback(
    (params: AddToCartParams): boolean => {
      const product = getProduct(params.productId);
      if (!product?.inStock) return false;

      const unitPrice = getUnitPrice({
        product,
        volume: params.volume,
        productType: params.productType,
      });
      const isDecant = isDecantVolume(params.productType, params.volume);
      const id = makeItemId(params.productId, params.productType, params.volume);

      setItems((prev) => {
        const existing = prev.find((i) => i.id === id);
        if (existing) {
          return prev.map((i) =>
            i.id === id ? { ...i, quantity: i.quantity + params.quantity } : i
          );
        }
        return [
          ...prev,
          {
            id,
            productId: params.productId,
            name: params.name,
            brand: params.brand,
            volume: params.volume,
            quantity: params.quantity,
            unitPrice,
            isDecant,
            productType: params.productType,
          },
        ];
      });
      setIsOpen(true);
      return true;
    },
    [getProduct]
  );

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(id);
        return;
      }
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i))
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
        count,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
