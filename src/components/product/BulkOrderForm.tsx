"use client";

import { useState } from "react";
import { Product } from "@/lib/data";
import { useCartStore } from "@/stores/cartStore";
import { useToastStore } from "@/stores/toastStore";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Package } from "lucide-react";
import { motion } from "framer-motion";
export function BulkOrderForm({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();
  const { isLoggedIn } = useAuthStore();
  const router = useRouter();

  const bulkPricing = product.bulkPricing || [];
  
  // Calculate current price based on quantity
  let currentPrice = product.price;
  let nextTier = null;
  
  for (let i = 0; i < bulkPricing.length; i++) {
    if (qty >= bulkPricing[i].minQty) {
      currentPrice = bulkPricing[i].price;
    }
  }

  // Find next tier for suggestion
  for (let i = 0; i < bulkPricing.length; i++) {
    if (qty < bulkPricing[i].minQty) {
      nextTier = bulkPricing[i];
      break;
    }
  }

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      addToast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để có thể thêm sản phẩm vào giỏ.",
        type: "error"
      });
      router.push("/login");
      return;
    }

    addItem(product, qty, currentPrice);
    addToast({
      title: "Đã thêm vào giỏ hàng",
      description: `Đã thêm ${qty} ${product.name} với giá ${formatPrice(currentPrice)}/sp.`,
      type: "success"
    });
  };

  return (
    <div className="bg-gradient-to-br from-card to-primary/5 border border-primary/10 rounded-3xl p-6 md:p-8 shadow-sm mt-6">
      <div className="flex items-center gap-2 font-bold mb-4">
        <Package className="h-5 w-5 text-primary" />
        <span>Tùy chọn số lượng & Giá sỉ</span>
      </div>

      {bulkPricing.length > 0 && (
        <div className="mb-6 overflow-hidden rounded-2xl border bg-white/50 dark:bg-card">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Số lượng</th>
                <th className="px-4 py-3 font-medium">Đơn giá</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className={qty < bulkPricing[0].minQty ? "bg-primary/5 font-medium" : ""}>
                <td className="px-4 py-3">1 - {bulkPricing[0].minQty - 1}</td>
                <td className="px-4 py-3">{formatPrice(product.price)}</td>
              </tr>
              {bulkPricing.map((tier, index) => {
                const nextMinQty = bulkPricing[index + 1]?.minQty;
                const isCurrentTier = qty >= tier.minQty && (!nextMinQty || qty < nextMinQty);
                return (
                  <tr key={index} className={isCurrentTier ? "bg-primary/5 font-medium text-primary" : ""}>
                    <td className="px-4 py-3">
                      {nextMinQty ? `${tier.minQty} - ${nextMinQty - 1}` : `≥ ${tier.minQty}`}
                    </td>
                    <td className="px-4 py-3">{formatPrice(tier.price)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="qty" className="block text-sm font-medium mb-2">Số lượng mua</label>
          <div className="flex items-center">
            <button 
              type="button"
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-10 h-10 border rounded-l-md bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors font-medium"
            >
              -
            </button>
            <input 
              id="qty"
              type="number" 
              min="1"
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-20 h-10 border-y text-center focus:outline-none focus:ring-1 focus:ring-primary font-medium"
            />
            <button 
              type="button"
              onClick={() => setQty(Math.min(product.stock, qty + 1))}
              className="w-10 h-10 border rounded-r-md bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors font-medium"
            >
              +
            </button>
          </div>
          {nextTier && (
            <p className="text-xs text-muted-foreground mt-2">
              Mua thêm <strong>{nextTier.minQty - qty}</strong> sản phẩm để được giá <strong>{formatPrice(nextTier.price)}</strong>
            </p>
          )}
        </div>

        <div className="flex items-center justify-between py-4 border-t border-border/10 mb-4">
          <span className="font-medium text-muted-foreground">Tạm tính:</span>
          <motion.span 
            key={currentPrice * qty}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-primary"
          >
            {formatPrice(currentPrice * qty)}
          </motion.span>
        </div>

        <button
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold hover:bg-primary/90 hover:scale-[1.02] shadow-xl shadow-primary/20 transition duration-300"
        >
          <ShoppingCart className="h-5 w-5" />
          Thêm vào giỏ
        </button>
      </div>
    </div>
  );
}
