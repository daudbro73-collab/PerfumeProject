"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  BarChart3,
  Settings,
  X,
  Copy,
  Download,
  Upload,
  RotateCcw,
  ShoppingBag,
  ExternalLink,
  Search,
} from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import { useOrders } from "@/context/OrdersContext";
import {
  Product,
  ProductType,
  Concentration,
  FRAGRANCE_FAMILIES,
  CONCENTRATION_LABELS,
  PRODUCT_TYPE_LABELS,
} from "@/types";
import { OrderStatus } from "@/context/OrdersContext";
import { formatPrice } from "@/lib/utils";
import AdminAuthGate from "@/components/admin/AdminAuthGate";
import ProductImageUpload from "@/components/admin/ProductImageUpload";
import { ALL_FAMILIES, ALL_CONCENTRATIONS, ALL_TYPES } from "@/lib/filters";
import { normalizeProduct, getProductTypes, formatProductTypesLabel } from "@/lib/productTypes";

const emptyProduct: Omit<Product, "id" | "createdAt"> = {
  name: "",
  brand: "",
  inspiredBy: "",
  type: "oil",
  types: ["oil"],
  concentration: "oil",
  families: [],
  notes: { top: [], heart: [], base: [] },
  description: "",
  price: 0,
  oilPricePerMl: 0,
  originalDecantPricePerMl: 0,
  originalPrice: 0,
  originalVolume: "100 мл",
  volume: "10 мл",
  image: "",
  inStock: true,
  featured: false,
};

type Tab = "products" | "orders" | "analytics" | "integrations";

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Новый",
  confirmed: "Подтверждён",
  completed: "Выполнен",
  cancelled: "Отменён",
};

export default function AdminPage() {
  return (
    <AdminAuthGate>
      <AdminDashboard />
    </AdminAuthGate>
  );
}

function AdminDashboard() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    resetToSeed,
    exportCatalog,
    importCatalog,
  } = useProducts();
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const [tab, setTab] = useState<Tab>("products");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(emptyProduct);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        (p.inspiredBy?.toLowerCase().includes(q) ?? false)
    );
  }, [products, search]);

  const openCreate = () => {
    setForm(emptyProduct);
    setCreating(true);
    setEditing(null);
  };

  const openEdit = (product: Product) => {
    const normalized = normalizeProduct(product);
    const { id, createdAt, ...rest } = normalized;
    setForm({
      ...emptyProduct,
      ...rest,
      types: getProductTypes(normalized),
      notesEn: undefined,
      descriptionEn: rest.descriptionEn ?? "",
    });
    setEditing(product);
    setCreating(false);
  };

  const closeForm = () => {
    setCreating(false);
    setEditing(null);
    setForm(emptyProduct);
  };

  const parseNotes = (val: string): string[] =>
    val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const notesToString = (notes: string[]) => notes.join(", ");

  const handleSave = () => {
    if (!form.types.length) return;

    const hasOil = form.types.includes("oil");
    const hasOriginal = form.types.includes("original");

    const { id: _id, createdAt: _ca, ...data } = normalizeProduct({
      id: editing?.id ?? "temp",
      createdAt: editing?.createdAt ?? "",
      ...form,
      types: form.types,
      oilPricePerMl: hasOil ? Number(form.oilPricePerMl ?? form.oilPrice ?? form.price) : undefined,
      originalDecantPricePerMl: hasOriginal
        ? Number(form.originalDecantPricePerMl ?? 0)
        : undefined,
      originalPrice: hasOriginal ? Number(form.originalPrice ?? 0) : undefined,
      originalVolume: hasOriginal ? "100 мл" : undefined,
      notes: {
        top: parseNotes(notesToString(form.notes.top)),
        heart: parseNotes(notesToString(form.notes.heart)),
        base: parseNotes(notesToString(form.notes.base)),
      },
      notesEn: undefined,
    });

    if (editing) {
      updateProduct(editing.id, data);
    } else {
      addProduct(data);
    }
    closeForm();
  };

  const handleExport = () => {
    const blob = new Blob([exportCatalog()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `elixir-catalog-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importCatalog(reader.result as string);
      if (result.ok) {
        alert("Каталог успешно импортирован");
      } else {
        alert(`Ошибка: ${result.error}`);
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.inStock).length,
    oils: products.filter((p) => getProductTypes(p).includes("oil")).length,
    originals: products.filter((p) => getProductTypes(p).includes("original")).length,
    featured: products.filter((p) => p.featured).length,
    ordersTotal: orders.length,
    ordersPending: orders.filter((o) => o.status === "pending").length,
    revenue: orders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + o.total, 0),
  };

  return (
    <div className="min-h-screen bg-milk">
      <div className="bg-ink text-milk">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-gold text-sm tracking-[0.3em] uppercase mb-2">
              Панель управления
            </p>
            <h1 className="text-3xl md:text-4xl font-light">
              CRM <span className="text-gradient-gold font-semibold">Élixir</span>
            </h1>
          </div>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gold/40 text-gold text-sm rounded-full hover:bg-gold/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Открыть каталог
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          {(
            [
              { key: "products" as Tab, label: "Товары", icon: Package },
              { key: "orders" as Tab, label: "Заказы", icon: ShoppingBag },
              { key: "analytics" as Tab, label: "Аналитика", icon: BarChart3 },
              { key: "integrations" as Tab, label: "Интеграции", icon: Settings },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all ${
                tab === item.key
                  ? "bg-gradient-gold text-ink font-medium"
                  : "bg-cream text-ink-muted hover:text-ink border border-gold/10"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {item.key === "orders" && stats.ordersPending > 0 && (
                <span className="w-5 h-5 bg-ink text-milk text-xs rounded-full flex items-center justify-center">
                  {stats.ordersPending}
                </span>
              )}
            </button>
          ))}
        </div>

        {tab === "products" && (
          <>
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center mb-6">
              <div className="relative flex-1 max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск товаров..."
                  className="form-input pl-10"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExport}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs border border-gold/20 rounded-lg hover:border-gold text-ink-muted hover:text-ink"
                >
                  <Download className="w-3.5 h-3.5" />
                  Экспорт
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs border border-gold/20 rounded-lg hover:border-gold text-ink-muted hover:text-ink"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Импорт
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImport}
                />
                <button
                  onClick={() => {
                    if (confirm("Сбросить каталог к демо-данным?")) resetToSeed();
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs border border-gold/20 rounded-lg hover:border-gold text-ink-muted hover:text-ink"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Сброс
                </button>
                <button
                  onClick={openCreate}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-gold text-ink text-sm font-medium rounded-full hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Добавить
                </button>
              </div>
            </div>

            <p className="text-ink-muted text-sm mb-4">
              {stats.total} товаров · {stats.inStock} в наличии · изменения сразу видны в{" "}
              <Link href="/catalog" className="text-gold hover:underline">
                каталоге
              </Link>
            </p>

            {/* Mobile cards */}
            <div className="md:hidden space-y-2.5 mb-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="glass-card rounded-xl p-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-ink text-sm truncate">{product.name}</p>
                    <p className="text-xs text-ink-muted truncate">
                      {product.brand} · {formatPrice(product.price)}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-0.5 text-[10px] rounded-full ${
                        product.inStock
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.inStock ? "В наличии" : "Нет"}
                    </span>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    <button
                      onClick={() => openEdit(product)}
                      className="p-2 text-ink-muted hover:text-gold"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => duplicateProduct(product.id)}
                      className="p-2 text-ink-muted hover:text-gold"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm("Удалить товар?")) deleteProduct(product.id);
                      }}
                      className="p-2 text-ink-muted hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card rounded-2xl overflow-hidden hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gold/10 text-left">
                      <th className="px-4 py-3 text-ink-muted font-medium">Название</th>
                      <th className="px-4 py-3 text-ink-muted font-medium hidden sm:table-cell">Бренд</th>
                      <th className="px-4 py-3 text-ink-muted font-medium hidden md:table-cell">Тип</th>
                      <th className="px-4 py-3 text-ink-muted font-medium">Цена</th>
                      <th className="px-4 py-3 text-ink-muted font-medium hidden sm:table-cell">Статус</th>
                      <th className="px-4 py-3 text-ink-muted font-medium w-32">Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-gold/5 hover:bg-gold/5 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <Link
                            href={`/product/${product.id}`}
                            className="font-medium text-ink hover:text-gold"
                          >
                            {product.name}
                          </Link>
                          {product.featured && (
                            <span className="ml-2 text-[10px] text-gold uppercase">Хит</span>
                          )}
                          {product.inspiredBy && (
                            <p className="text-xs text-ink-muted">мотив: {product.inspiredBy}</p>
                          )}
                        </td>
                        <td className="px-4 py-3 text-ink-light hidden sm:table-cell">
                          {product.brand}
                        </td>
                        <td className="px-4 py-3 text-ink-light hidden md:table-cell">
                          {formatProductTypesLabel(product, PRODUCT_TYPE_LABELS)}
                        </td>
                        <td className="px-4 py-3 text-ink font-medium">
                          {formatPrice(product.price)}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              product.inStock
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {product.inStock ? "В наличии" : "Нет"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <button
                              onClick={() => openEdit(product)}
                              className="p-1.5 text-ink-muted hover:text-gold transition-colors"
                              title="Редактировать"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => duplicateProduct(product.id)}
                              className="p-1.5 text-ink-muted hover:text-gold transition-colors"
                              title="Дублировать"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Удалить товар?")) deleteProduct(product.id);
                              }}
                              className="p-1.5 text-ink-muted hover:text-red-500 transition-colors"
                              title="Удалить"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {tab === "orders" && (
          <div className="space-y-4">
            <p className="text-ink-muted text-sm mb-2">
              Заказы создаются при оформлении через корзину → WhatsApp
            </p>
            {orders.length === 0 ? (
              <div className="glass-card rounded-2xl p-12 text-center text-ink-muted">
                Заказов пока нет
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="glass-card rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <div>
                      <p className="text-xs text-ink-muted">
                        {new Date(order.createdAt).toLocaleString("ru-RU")}
                      </p>
                      <p className="text-lg font-semibold text-ink">
                        {formatPrice(order.total)} · {order.items.length} поз.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value as OrderStatus)
                        }
                        className="form-input py-2 text-sm w-auto"
                      >
                        {(Object.keys(ORDER_STATUS_LABELS) as OrderStatus[]).map((s) => (
                          <option key={s} value={s}>
                            {ORDER_STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => {
                          if (confirm("Удалить заказ?")) deleteOrder(order.id);
                        }}
                        className="p-2 text-ink-muted hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <ul className="space-y-1 text-sm text-ink-light">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.name} ({item.brand}) — {item.volume},{" "}
                        {item.isDecant ? "отливант" : "флакон"} × {item.quantity} ={" "}
                        {formatPrice(item.unitPrice * item.quantity)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "analytics" && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Всего товаров", value: stats.total },
              { label: "В наличии", value: stats.inStock },
              { label: "Хиты", value: stats.featured },
              { label: "Заказов", value: stats.ordersTotal },
              { label: "Новых заказов", value: stats.ordersPending },
              { label: "Выручка (оформ.)", value: formatPrice(stats.revenue) },
              { label: "Масляные духи", value: stats.oils },
              { label: "Оригиналы", value: stats.originals },
            ].map((item) => (
              <div key={item.label} className="glass-card rounded-2xl p-6 text-center">
                <p className="text-2xl font-semibold text-ink mb-1">{item.value}</p>
                <p className="text-xs text-ink-muted">{item.label}</p>
              </div>
            ))}
          </div>
        )}

        {tab === "integrations" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: "WhatsApp", status: "Активен", desc: "Корзина → wa.me/79001234567" },
              { name: "Telegram", status: "Активен", desc: "@elixir_parfum" },
              { name: "Instagram Direct", status: "Скоро", desc: "" },
              { name: "1С Синхронизация", status: "Скоро", desc: "Импорт/экспорт JSON доступен" },
              { name: "Wildberries", status: "Скоро", desc: "" },
              { name: "Ozon", status: "Скоро", desc: "" },
            ].map((item) => (
              <div key={item.name} className="glass-card rounded-2xl p-5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-ink font-medium text-sm">{item.name}</span>
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      item.status === "Активен"
                        ? "bg-green-100 text-green-700"
                        : "bg-gold/10 text-gold"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                {item.desc && <p className="text-xs text-ink-muted">{item.desc}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {(creating || editing) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-ink/50" onClick={closeForm} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-milk rounded-t-2xl sm:rounded-2xl shadow-2xl">
            <div className="sticky top-0 bg-milk border-b border-gold/10 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-semibold text-ink">
                {editing ? "Редактировать товар" : "Новый товар"}
              </h2>
              <button onClick={closeForm} className="p-1 text-ink-muted hover:text-ink">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <FormField label="Название">
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="form-input"
                />
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Бренд">
                  <input
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="form-input"
                  />
                </FormField>
                <FormField label="По мотивам (необязательно)">
                  <input
                    value={form.inspiredBy || ""}
                    onChange={(e) => setForm({ ...form, inspiredBy: e.target.value })}
                    className="form-input"
                  />
                </FormField>
              </div>

              <FormField label="Тип товара">
                <div className="flex flex-wrap gap-2">
                  {ALL_TYPES.map((type) => {
                    const active = form.types.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          const nextTypes = active
                            ? form.types.length > 1
                              ? form.types.filter((x) => x !== type)
                              : form.types
                            : [...form.types, type];
                          setForm({
                            ...form,
                            types: nextTypes,
                            type: nextTypes[0] ?? "oil",
                            volume: nextTypes.includes("oil") ? "10 мл" : form.originalVolume || "100 мл",
                          });
                        }}
                        className={`px-3 py-2 text-xs sm:text-sm rounded-full border transition-all ${
                          active
                            ? "bg-gold text-ink border-gold"
                            : "border-gold/20 text-ink-muted hover:border-gold/50"
                        }`}
                      >
                        {PRODUCT_TYPE_LABELS[type]}
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-ink-muted mt-2">
                  Можно выбрать оба типа для одного аромата
                </p>
              </FormField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label="Концентрация">
                  <select
                    value={form.concentration}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        concentration: e.target.value as Concentration,
                      })
                    }
                    className="form-input"
                  >
                    {ALL_CONCENTRATIONS.map((c) => (
                      <option key={c} value={c}>
                        {CONCENTRATION_LABELS[c]}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              {form.types.includes("oil") && (
                <FormField label="Цена за 1 мл (концентрация «масло», ₽)">
                  <input
                    type="number"
                    step="1"
                    value={form.oilPricePerMl ?? form.oilPrice ?? form.price}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        oilPricePerMl: Number(e.target.value),
                        oilPrice: Number(e.target.value),
                        price: Number(e.target.value),
                      })
                    }
                    className="form-input"
                  />
                  <p className="text-xs text-ink-muted mt-1.5">
                    Другие концентрации — цена в 2 раза ниже. Не относится к оригиналу.
                  </p>
                </FormField>
              )}

              {form.types.includes("original") && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Цена отливанта за 1 мл (₽)">
                    <input
                      type="number"
                      step="1"
                      value={form.originalDecantPricePerMl ?? 0}
                      onChange={(e) =>
                        setForm({ ...form, originalDecantPricePerMl: Number(e.target.value) })
                      }
                      className="form-input"
                    />
                  </FormField>
                  <FormField label="Цена полного флакона (100 мл, ₽)">
                    <input
                      type="number"
                      value={form.originalPrice ?? 0}
                      onChange={(e) =>
                        setForm({ ...form, originalPrice: Number(e.target.value) })
                      }
                      className="form-input"
                    />
                  </FormField>
                </div>
              )}

              <FormField label="Фото товара">
                <ProductImageUpload
                  value={form.image}
                  onChange={(image) => setForm({ ...form, image })}
                />
              </FormField>

              <FormField label="Семейства ароматов">
                <div className="flex flex-wrap gap-2">
                  {ALL_FAMILIES.map((f) => {
                    const active = form.families.includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            families: active
                              ? form.families.filter((x) => x !== f)
                              : [...form.families, f],
                          })
                        }
                        className={`px-3 py-1 text-xs rounded-full border transition-all ${
                          active
                            ? "bg-gold text-ink border-gold"
                            : "border-gold/20 text-ink-muted hover:border-gold/50"
                        }`}
                      >
                        {FRAGRANCE_FAMILIES[f].labelRu}
                      </button>
                    );
                  })}
                </div>
              </FormField>

              <FormField label="Верхние ноты (через запятую)">
                <input
                  value={notesToString(form.notes.top)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notes: { ...form.notes, top: parseNotes(e.target.value) },
                    })
                  }
                  className="form-input"
                />
              </FormField>
              <FormField label="Ноты сердца">
                <input
                  value={notesToString(form.notes.heart)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notes: { ...form.notes, heart: parseNotes(e.target.value) },
                    })
                  }
                  className="form-input"
                />
              </FormField>
              <FormField label="Базовые ноты">
                <input
                  value={notesToString(form.notes.base)}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      notes: { ...form.notes, base: parseNotes(e.target.value) },
                    })
                  }
                  className="form-input"
                />
              </FormField>

              <FormField label="Описание">
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="form-input resize-none"
                />
              </FormField>

              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.inStock}
                    onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                    className="accent-gold"
                  />
                  <span className="text-sm text-ink-light">В наличии</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="accent-gold"
                  />
                  <span className="text-sm text-ink-light">Хит продаж (главная)</span>
                </label>
              </div>

              <button
                onClick={handleSave}
                disabled={!form.name || !form.brand}
                className="w-full py-3 bg-gradient-gold text-ink font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
              >
                {editing ? "Сохранить изменения" : "Добавить товар"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .form-input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          background: var(--color-cream);
          border: 1px solid rgba(201, 169, 98, 0.2);
          border-radius: 0.75rem;
          font-size: 0.875rem;
          color: var(--color-ink);
          outline: none;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          border-color: var(--color-gold);
        }
      `}</style>
    </div>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink-muted uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
