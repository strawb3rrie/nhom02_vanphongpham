"use client";

import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { ProductCard } from "@/components/product/ProductCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Pagination } from "@/components/ui/Pagination";
import { ROUTES } from "@/lib/constants";
import { Product, Category } from "@/lib/data";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowUpDown, Star } from "lucide-react";
import { useState, useEffect, useMemo } from "react";

const ITEMS_PER_PAGE = 8;

type SortOption = "default" | "price-asc" | "price-desc" | "rating" | "name";

const PRICE_RANGES = [
  { label: "Tất cả", min: 0, max: Infinity },
  { label: "Dưới 10.000đ", min: 0, max: 10000 },
  { label: "10.000đ - 50.000đ", min: 10000, max: 50000 },
  { label: "50.000đ - 100.000đ", min: 50000, max: 100000 },
  { label: "Trên 100.000đ", min: 100000, max: Infinity },
];

const RATING_OPTIONS = [
  { label: "Tất cả", value: 0 },
  { label: "Từ 4 sao", value: 4 },
  { label: "Từ 4.5 sao", value: 4.5 },
  { label: "5 sao", value: 5 },
];

/** Highlight từ khóa tìm kiếm trong text */
function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 text-foreground rounded px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

export default function ProductsPageClient({
  initialProducts,
  categories,
  categoryParam,
  queryParam,
}: {
  initialProducts: Product[];
  categories: Category[];
  categoryParam?: string;
  queryParam?: string;
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [priceRange, setPriceRange] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, [categoryParam, queryParam]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryParam, queryParam, sortBy, priceRange, minRating]);

  // Filter + Sort
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by category
    if (categoryParam) {
      result = result.filter((p) => p.category === categoryParam);
    }

    // Filter by search query
    if (queryParam) {
      const q = queryParam.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Filter by price range
    const range = PRICE_RANGES[priceRange];
    if (range && priceRange > 0) {
      result = result.filter((p) => p.price >= range.min && p.price < range.max);
    }

    // Filter by rating
    if (minRating > 0) {
      result = result.filter((p) => p.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name, "vi"));
        break;
    }

    return result;
  }, [initialProducts, categoryParam, queryParam, sortBy, priceRange, minRating]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const currentCategoryName = categoryParam
    ? categories.find((c) => c.id === categoryParam)?.name
    : "Tất cả sản phẩm";

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Sản phẩm", href: ROUTES.PRODUCTS },
          ...(categoryParam
            ? [{ label: currentCategoryName || "Danh mục" }]
            : []),
        ]}
      />

      <div className="flex flex-col md:flex-row gap-8 mt-6">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-card border rounded-2xl p-6 sticky top-24 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-bold text-lg mb-4">Danh mục</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href={ROUTES.PRODUCTS}
                    className={`block py-2 px-3 rounded-lg transition-colors ${!categoryParam ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted"}`}
                  >
                    Tất cả sản phẩm
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`${ROUTES.PRODUCTS}?category=${c.id}`}
                      className={`block py-2 px-3 rounded-lg transition-colors ${categoryParam === c.id ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted"}`}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price Range */}
            <div>
              <h3 className="font-bold text-base mb-3 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Khoảng giá
              </h3>
              <ul className="space-y-1.5">
                {PRICE_RANGES.map((range, i) => (
                  <li key={i}>
                    <button
                      onClick={() => setPriceRange(i)}
                      className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-colors ${priceRange === i ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"}`}
                    >
                      {range.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Rating Filter */}
            <div>
              <h3 className="font-bold text-base mb-3 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Đánh giá
              </h3>
              <ul className="space-y-1.5">
                {RATING_OPTIONS.map((opt) => (
                  <li key={opt.value}>
                    <button
                      onClick={() => setMinRating(opt.value)}
                      className={`w-full text-left py-2 px-3 rounded-lg text-sm transition-colors flex items-center gap-2 ${minRating === opt.value ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"}`}
                    >
                      {opt.value > 0 && (
                        <span className="flex items-center gap-0.5">
                          {Array.from({ length: Math.floor(opt.value) }).map(
                            (_, j) => (
                              <Star
                                key={j}
                                className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                              />
                            )
                          )}
                        </span>
                      )}
                      <span>{opt.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-heading">
                {queryParam
                  ? <>Kết quả cho &ldquo;{queryParam}&rdquo;</>
                  : currentCategoryName}
              </h1>
              <p className="text-muted-foreground mt-1">
                Hiển thị {filteredProducts.length} sản phẩm
              </p>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 border rounded-lg px-3 py-2 bg-card text-sm">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent focus:outline-none cursor-pointer"
              >
                <option value="default">Mặc định</option>
                <option value="price-asc">Giá tăng dần</option>
                <option value="price-desc">Giá giảm dần</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="name">Tên A → Z</option>
              </select>
            </div>
          </div>

          {/* Loading Skeleton */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div
                  key={i}
                  className="bg-card border rounded-2xl overflow-hidden"
                >
                  <Skeleton className="aspect-square w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex justify-between items-end">
                      <Skeleton className="h-6 w-1/3" />
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : paginatedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    searchQuery={queryParam}
                  />
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h2 className="text-xl font-medium mb-2">
                Không tìm thấy sản phẩm
              </h2>
              <p className="text-muted-foreground mb-6">
                Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.
              </p>
              <Link
                href={ROUTES.PRODUCTS}
                className="inline-flex px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
              >
                Xem tất cả sản phẩm
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export { HighlightText };
