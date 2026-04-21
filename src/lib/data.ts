// Type definitions (giữ nguyên)
export interface Product {
  id: number;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  specs: Record<string, string>;
  rating: number;
  reviewCount: number;
  stock: number;
  featured: boolean;
  bulkPricing?: { minQty: number; price: number }[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
}

export interface Promotion {
  id: number;
  code: string;
  discountPercent?: number;
  discountAmount?: number;
  title: string;
  description: string;
  minOrderValue: number;
  validUntil: string;
}

export interface Review {
  id: number;
  productId: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface TeamMember {
  id: number;
  name: string;
  mssv: string;
  role: string;
  avatar: string;
  github: string;
}

// Base URL (giữ nhưng làm gọn)
const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  return process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : `http://localhost:3000`;
};

// ================= PRODUCTS =================
export async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/data/products.json`, {
      next: { revalidate: 60 }, // ✅ cải thiện cache
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch products: ${res.status}`);
    }

    const data: Product[] = await res.json();
    return data;
  } catch (err) {
    console.error("getProducts error:", err);

    // ✅ FIX: không import từ public nữa
    const data = await import("@/data/products.json");
    return data.default as Product[];
  }
}

// ================= PRODUCT DETAIL =================
export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

// ================= CATEGORIES =================
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/data/categories.json`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error("Failed to fetch categories");

    return res.json();
  } catch (err) {
    console.error("getCategories error:", err);

    const data = await import("@/data/categories.json");
    return data.default as Category[];
  }
}

// ================= PROMOTIONS =================
export async function getPromotions(): Promise<Promotion[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/data/promotions.json`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error("Failed to fetch promotions");

    return res.json();
  } catch (err) {
    console.error("getPromotions error:", err);

    const data = await import("@/data/promotions.json");
    return data.default as Promotion[];
  }
}

// ================= REVIEWS =================
export async function getReviews(
  productId: number
): Promise<Review[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/data/reviews.json`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) throw new Error("Failed to fetch reviews");

    const reviews: Review[] = await res.json();
    return reviews.filter((r) => r.productId === productId);
  } catch (err) {
    console.error("getReviews error:", err);

    const data = await import("@/data/reviews.json");
    const reviews = data.default as Review[];
    return reviews.filter((r) => r.productId === productId);
  }
}

// ================= TEAM =================
export async function getTeam(): Promise<TeamMember[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/data/team.json`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) throw new Error("Failed to fetch team");

    return res.json();
  } catch (err) {
    console.error("getTeam error:", err);

    const data = await import("@/data/team.json");
    return data.default as TeamMember[];
  }
}