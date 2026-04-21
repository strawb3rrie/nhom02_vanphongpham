"use client";

import { useState, useMemo, useCallback } from "react";
import { Product } from "@/lib/data";
import { useCartStore } from "@/stores/cartStore";
import { useToastStore } from "@/stores/toastStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { ShoppingCart, Package, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function BulkOrderForm({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  const bulkPricing = product.bulkPricing || [];

  // Tính toán giá hiện tại và bậc giá tiếp theo
  // Sử dụng useMemo để tránh tính toán lại mỗi lần render trừ khi qty hoặc product thay đổi
  const { currentPrice, nextTier } = useMemo(() => {
    let price = product.price;
    let next = null;

    // Tìm giá áp dụng cho số lượng hiện tại
    for (const tier of bulkPricing) {
      if (qty >= tier.minQty) {
        price = tier.price;
      }
    }

    // Tìm bậc giá tiếp theo để gợi ý cho khách hàng
    for (const tier of bulkPricing) {
      if (qty < tier.minQty) {
        next = tier;
        break;
      }
    }

    return { currentPrice: price, nextTier: next };
  }, [qty, product, bulkPricing]);

  const handleAddToCart = useCallback(() => {
    if (!isLoggedIn) {
      addToast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để có thể thêm sản phẩm vào giỏ.",
        type: "error",
      });
      router.push("/login");
      return;
    }

    if (qty > product.stock) {
      addToast({
        title: "Số lượng không hợp lệ",
        description: `Rất tiếc, chúng tôi chỉ còn ${product.stock} sản phẩm trong kho.`,
        type: "error",
      });
      return;
    }

    addItem(product, qty, currentPrice);
    addToast({
      title: "Đã thêm vào giỏ hàng",
      description: `Đã thêm ${qty} ${product.name} vào giỏ hàng thành công.`,
      type: "success",
    });
  }, [isLoggedIn, qty, product, currentPrice, addItem, addToast, router]);

  return (
    <div className="bg-gradient-to-br from-card to-primary/5 border border-primary/10 rounded-3xl p-6 md:p-8 shadow-sm mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 font-bold text-lg">
          <Package className="h-5 w-5 text-primary" />
          <span>Giá sỉ & Số lượng</span>
        </div>
        {product.stock <= 10 && product.stock > 0 && (
          <span className="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-md animate-pulse">
            Chỉ còn {product.stock} trong kho
          </span>
        )}
      </div>

      {/* Bảng giá sỉ */}
      {bulkPricing.length > 0 && (
        <div className="mb-6 overflow-hidden rounded-2xl border border-border/60 bg-white/40 dark:bg-card/40 backdrop-blur-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3 font-semibold">Số lượng mua</th>
                <th className="px-4 py-3 font-semibold text-right">Đơn giá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-medium">
              {/* Giá bán lẻ mặc định */}
              <tr className={qty < bulkPricing[0].minQty ? "bg-primary/10 text-primary" : "text-muted-foreground"}>
                <td className="px-4 py-3 italic">Mặc định (1 - {bulkPricing[0].minQty - 1})</td>
                <td className="px-4 py-3 text-right">{formatPrice(product.price)}</td>
              </tr>
              {/* Các bậc giá sỉ */}
              {bulkPricing.map((tier, index) => {
                const nextMinQty = bulkPricing[index + 1]?.minQty;
                const isCurrentTier = qty >= tier.minQty && (!nextMinQty || qty < nextMinQty);
                return (
                  <tr key={index} className={isCurrentTier ? "bg-primary/10 text-primary" : "text-muted-foreground"}>
                    <td className="px-4 py-3">
                      {nextMinQty ? `${tier.minQty} - ${nextMinQty - 1}` : `Từ ${tier.minQty} trở lên`}
                    </td>
                    <td className="px-4 py-3 text-right">{formatPrice(tier.price)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Điều khiển số lượng */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-3 flex-1">
            <label htmlFor="qty" className="text-sm font-semibold text-muted-foreground">Chọn số lượng mua:</label>
            <div className="flex items-center h-12">
              <button 
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-12 h-full border border-r-0 rounded-l-xl bg-background hover:bg-muted flex items-center justify-center transition-colors text-xl font-bold"
              >
                −
              </button>
              <input 
                id="qty"
                type="number" 
                min="1"
                max={product.stock}
                value={qty}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (isNaN(value)) setQty(1);
                  else setQty(Math.min(product.stock, Math.max(1, value)));
                }}
                className="w-20 h-full border text-center focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-lg bg-background"
              />
              <button 
                type="button"
                onClick={() => setQty(Math.min(product.stock, qty + 1))}
                className="w-12 h-full border border-l-0 rounded-r-xl bg-background hover:bg-muted flex items-center justify-center transition-colors text-xl font-bold"
              >
                +
              </button>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground font-medium mb-1">Thành tiền tạm tính:</p>
            <AnimatePresence mode="wait">
              <motion.div 
                key={currentPrice * qty}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="text-3xl font-black text-primary tracking-tight"
              >
                {formatPrice(currentPrice * qty)}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Gợi ý mua thêm để giảm giá */}
        {nextTier && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-xl text-xs"
          >
            <Info className="h-4 w-4 shrink-0 mt-0.5" />
            <p>
              Tiết kiệm hơn: Mua thêm <strong>{nextTier.minQty - qty}</strong> sản phẩm nữa để nhận mức giá ưu đãi 
              <span className="font-bold"> {formatPrice(nextTier.price)}</span>/sp.
            </p>
          </motion.div>
        )}

        {/* Nút thêm vào giỏ */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="group relative w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-5 rounded-2xl font-bold hover:bg-primary/90 transition duration-300 shadow-xl shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden active:scale-[0.98]"
        >
          <ShoppingCart className="h-5 w-5 group-hover:rotate-12 transition-transform" />
          {product.stock > 0 ? "Thêm vào giỏ hàng ngay" : "Hết hàng tạm thời"}
          
          {/* Hiệu ứng bóng sáng khi hover */}
          <div className="absolute inset-0 w-1/2 h-full bg-white/10 skew-x-[-25deg] -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-700 ease-in-out" />
        </button>
      </div>
    </div>
  );
}