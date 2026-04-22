"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback } from "react";
import { Star, ShoppingCart } from "lucide-react";
import { Product } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/stores/cartStore";
import { useToastStore } from "@/stores/toastStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

/** * Highlight từ khóa tìm kiếm trong text 
 */
function HighlightText({ text, query }: { text: string; query?: string }) {
  if (!query || !query.trim()) return <>{text}</>;

  const regex = new RegExp(
    `(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-yellow-200 dark:bg-yellow-800 text-foreground rounded px-0.5"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

interface ProductCardProps {
  product: Product;
  searchQuery?: string;
}

export function ProductCard({ product, searchQuery }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  // Tính toán phần trăm giảm giá
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault(); // Ngăn chặn Link nhảy trang
      e.stopPropagation(); // Ngăn chặn các sự kiện click lồng nhau

      if (!isLoggedIn) {
        addToast({
          title: "Yêu cầu đăng nhập",
          description: "Vui lòng đăng nhập để có thể thêm sản phẩm vào giỏ.",
          type: "error",
        });
        router.push("/login");
        return;
      }

      addItem(product, 1, product.price);
      addToast({
        title: "Thành công",
        description: `Đã thêm ${product.name} vào giỏ hàng.`,
        type: "success",
      });
    },
    [isLoggedIn, product, addItem, addToast, router]
  );

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border/40 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out"
    >
      {/* Hình ảnh sản phẩm */}
      <div className="relative aspect-square bg-secondary/20 overflow-hidden">
        {/* Badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {discount > 0 && (
            <Badge variant="accent" className="bg-red-500 text-white border-none shadow-sm">
              -{discount}%
            </Badge>
          )}
          {product.bulkPricing && product.bulkPricing.length > 0 && (
            <Badge className="bg-blue-600 text-white border-none shadow-sm">
              Giá sỉ
            </Badge>
          )}
        </div>

        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority={false}
        />
        
        {/* Overlay nút mua nhanh trên Desktop */}
        <div className="hidden md:flex absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center">
           {/* Bạn có thể thêm nút "Xem nhanh" ở đây nếu muốn */}
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-medium text-sm md:text-base leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors min-h-[2.5rem]">
          <HighlightText text={product.name} query={searchQuery} />
        </h3>

        {/* Đánh giá */}
        <div className="flex items-center gap-1 mb-3">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-semibold">{product.rating}</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
            ({product.reviewCount} đánh giá)
          </span>
        </div>

        {/* Giá và Nút thêm */}
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="font-bold text-base md:text-lg text-primary">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through decoration-red-400/50">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 active:scale-95 transition-all"
            title="Thêm vào giỏ hàng"
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Link>
  );
}