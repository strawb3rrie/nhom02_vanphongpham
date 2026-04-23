"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { Star, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useCartStore } from "@/stores/cartStore";
import { useToastStore } from "@/stores/toastStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

/** Highlight từ khóa tìm kiếm trong text */
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

export function ProductCard({
  product,
  searchQuery,
}: {
  product: Product;
  searchQuery?: string;
}) {
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
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
      title: "Thêm vào giỏ thành công",
      description: `${product.name} đã được thêm vào giỏ hàng.`,
      type: "success",
    });
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col bg-card rounded-2xl md:rounded-3xl overflow-hidden border border-border/40 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
    >
      <div className="relative aspect-[4/3] sm:aspect-square bg-secondary/30 dark:bg-secondary/20 overflow-hidden">
        {discount > 0 && (
          <Badge
            variant="accent"
            className="absolute top-3 left-3 z-10"
          >
            -{discount}%
          </Badge>
        )}
        {product.bulkPricing && product.bulkPricing.length > 0 && (
          <Badge variant="accent" className="absolute top-3 right-3 z-10">
            Có giá sỉ
          </Badge>
        )}
        <div className="relative w-full h-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
      </div>

      <div className="p-5 md:p-6 flex flex-col flex-1">
        <h3 className="font-semibold text-base leading-snug line-clamp-2 mb-3 group-hover:text-primary transition-colors">
          <HighlightText text={product.name} query={searchQuery} />
        </h3>

        <div className="flex items-center gap-1 mb-3">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-muted-foreground">
            ({product.reviewCount})
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between">
          <div>
            <div className="font-heading font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              {formatPrice(product.price)}
            </div>
            {product.originalPrice && (
              <div className="text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
          </div>

          <div className="opacity-0 translate-y-2 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-200 absolute md:relative bottom-4 right-4 md:bottom-auto md:right-auto">
            <button
              onClick={handleAddToCart}
              className="p-3 md:p-2.5 lg:p-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-200 shadow-sm"
              aria-label="Thêm vào giỏ"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
