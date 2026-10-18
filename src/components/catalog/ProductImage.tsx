import Image from "next/image";
import { cn } from "@/lib/utils";
import { getProductImage } from "@/data/stock-images";

interface ProductImageProps {
  productId: string;
  image?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

export default function ProductImage({
  productId,
  image,
  alt,
  className,
  priority = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
}: ProductImageProps) {
  const src = getProductImage(productId, image);
  const isDataUrl = src.startsWith("data:");

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      unoptimized={isDataUrl}
      className={cn("object-cover object-center", className)}
    />
  );
}
