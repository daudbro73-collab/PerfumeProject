"use client";

import { useRef, useState } from "react";
import { Upload, X, ImageIcon } from "lucide-react";
import { processProductImageFile, isProductImageSrc } from "@/lib/imageUpload";

interface ProductImageUploadProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ProductImageUpload({ value, onChange }: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const previewSrc = isProductImageSrc(value) ? value : null;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const dataUrl = await processProductImageFile(file);
      onChange(dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить фото");
    } finally {
      setLoading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3">
      {previewSrc ? (
        <div className="relative w-full max-w-[200px] aspect-[4/5] rounded-xl overflow-hidden bg-cream border border-gold/15">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewSrc} alt="Превью товара" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-ink/70 text-milk hover:bg-ink transition-colors"
            aria-label="Удалить фото"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full max-w-[200px] aspect-[4/5] rounded-xl border border-dashed border-gold/30 bg-cream/50 text-ink-muted">
          <div className="text-center px-4">
            <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Фото не выбрано</p>
          </div>
        </div>
      )}

      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <button
          type="button"
          disabled={loading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-gold/25 text-ink hover:border-gold/50 hover:bg-gold/5 transition-all disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {loading ? "Загрузка..." : previewSrc ? "Заменить фото" : "Загрузить с устройства"}
        </button>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
      <p className="text-xs text-ink-muted">JPG, PNG или WebP · до 10 МБ</p>
    </div>
  );
}
