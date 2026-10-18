/** Stock Unsplash photos — premium perfume imagery */
const u = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

export const STOCK_IMAGES: Record<string, string> = {
  "1": u("photo-1774682060910-ba9a26f958ad"),
  "2": u("photo-1779562194252-baf05466a528"),
  "3": u("photo-1773527142301-9aa77252e5c2"),
  "4": u("photo-1775639698865-8621fbccb000"),
  "5": u("photo-1768025719875-48ed072f3084"),
  "6": u("photo-1779562194252-baf05466a528", 800),
  "7": u("photo-1774682060910-ba9a26f958ad", 800),
  "8": u("photo-1773527142301-9aa77252e5c2", 800),
  "9": u("photo-1768025719875-48ed072f3084", 800),
  "10": u("photo-1775639698865-8621fbccb000", 800),
};

export function getProductImage(productId: string, fallback?: string): string {
  if (fallback?.startsWith("http") || fallback?.startsWith("data:")) return fallback;
  return STOCK_IMAGES[productId] ?? STOCK_IMAGES["1"];
}
