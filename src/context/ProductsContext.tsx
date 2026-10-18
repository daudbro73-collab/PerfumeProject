"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { Product } from "@/types";
import { normalizeProduct } from "@/lib/productTypes";
import { initialProducts } from "@/data/products";

const STORAGE_KEY = "perfume-crm-products";

interface ProductsContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Product;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  getProduct: (id: string) => Product | undefined;
  resetToSeed: () => void;
  exportCatalog: () => string;
  importCatalog: (json: string) => { ok: boolean; error?: string };
}

const ProductsContext = createContext<ProductsContextType | null>(null);

function isValidProduct(obj: unknown): obj is Product {
  if (!obj || typeof obj !== "object") return false;
  const p = obj as Product;
  return (
    typeof p.id === "string" &&
    typeof p.name === "string" &&
    typeof p.brand === "string" &&
    typeof p.price === "number" &&
    Array.isArray(p.families)
  );
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(
    initialProducts.map((p) => normalizeProduct(p))
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Product[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed.map((p) => normalizeProduct(p as Product)));
        }
      } catch {
        setProducts(initialProducts);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    }
  }, [products, hydrated]);

  const addProduct = useCallback(
    (product: Omit<Product, "id" | "createdAt">): Product => {
      const newProduct: Product = normalizeProduct({
        ...product,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString().split("T")[0],
      });
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    },
    []
  );

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? normalizeProduct({ ...p, ...updates }) : p))
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const duplicateProduct = useCallback(
    (id: string) => {
      const source = products.find((p) => p.id === id);
      if (!source) return;
      const { id: _id, createdAt: _ca, ...rest } = source;
      addProduct({ ...rest, name: `${rest.name} (копия)` });
    },
    [products, addProduct]
  );

  const getProduct = useCallback(
    (id: string) => products.find((p) => p.id === id),
    [products]
  );

  const resetToSeed = useCallback(() => {
    setProducts(initialProducts);
  }, []);

  const exportCatalog = useCallback(
    () => JSON.stringify(products, null, 2),
    [products]
  );

  const importCatalog = useCallback((json: string) => {
    try {
      const parsed = JSON.parse(json) as unknown;
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return { ok: false, error: "Пустой или неверный формат" };
      }
      if (!parsed.every(isValidProduct)) {
        return { ok: false, error: "Некорректная структура товаров" };
      }
      setProducts(parsed.map((p) => normalizeProduct(p)));
      return { ok: true };
    } catch {
      return { ok: false, error: "Ошибка парсинга JSON" };
    }
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        getProduct,
        resetToSeed,
        exportCatalog,
        importCatalog,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const ctx = useContext(ProductsContext);
  if (!ctx) throw new Error("useProducts must be used within ProductsProvider");
  return ctx;
}
