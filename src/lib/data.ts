// Type definitions
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

// In a real app these would be API calls. Here we just fetch the static JSON files.
// We use the absolute URL for server components if needed, or relative for browser.

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
};

export async function getProducts(): Promise<Product[]> {
  // Using dynamic import of local file as a robust fallback for static generation
  // Or fetch from public dir if running
  try {
    const res = await fetch(`${getBaseUrl()}/data/products.json`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  } catch {
    // Fallback for static build
    const data = await import("../../public/data/products.json");
    return data.default as unknown as Product[];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/data/categories.json`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  } catch {
    const data = await import("../../public/data/categories.json");
    return data.default as Category[];
  }
}

export async function getPromotions(): Promise<Promotion[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/data/promotions.json`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch promotions");
    return res.json();
  } catch {
    const data = await import("../../public/data/promotions.json");
    return data.default as Promotion[];
  }
}

export async function getReviews(productId: number): Promise<Review[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/data/reviews.json`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch reviews");
    const reviews: Review[] = await res.json();
    return reviews.filter(r => r.productId === productId);
  } catch {
    const data = await import("../../public/data/reviews.json");
    const reviews = data.default as Review[];
    return reviews.filter(r => r.productId === productId);
  }
}

export async function getTeam(): Promise<TeamMember[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/data/team.json`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch team");
    return res.json();
  } catch {
    const data = await import("../../public/data/team.json");
    return data.default as TeamMember[];
  }
}
// Type definitions
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

// In a real app these would be API calls. Here we just fetch the static JSON files.
// We use the absolute URL for server components if needed, or relative for browser.

const getBaseUrl = () => {
  if (typeof window !== "undefined") return "";
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT || 3000}`;
};

export async function getProducts(): Promise<Product[]> {
  // Using dynamic import of local file as a robust fallback for static generation
  // Or fetch from public dir if running
  try {
    const res = await fetch(`${getBaseUrl()}/data/products.json`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch products");
    return res.json();
  } catch {
    // Fallback for static build
    const data = await import("../../public/data/products.json");
    return data.default as unknown as Product[];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) || null;
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/data/categories.json`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
  } catch {
    const data = await import("../../public/data/categories.json");
    return data.default as Category[];
  }
}

export async function getPromotions(): Promise<Promotion[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/data/promotions.json`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch promotions");
    return res.json();
  } catch {
    const data = await import("../../public/data/promotions.json");
    return data.default as Promotion[];
  }
}

export async function getReviews(productId: number): Promise<Review[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/data/reviews.json`, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error("Failed to fetch reviews");
    const reviews: Review[] = await res.json();
    return reviews.filter(r => r.productId === productId);
  } catch {
    const data = await import("../../public/data/reviews.json");
    const reviews = data.default as Review[];
    return reviews.filter(r => r.productId === productId);
  }
}

export async function getTeam(): Promise<TeamMember[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/data/team.json`, { cache: 'no-store' });
    if (!res.ok) throw new Error("Failed to fetch team");
    return res.json();
  } catch {
    const data = await import("../../public/data/team.json");
    return data.default as TeamMember[];
  }
}
