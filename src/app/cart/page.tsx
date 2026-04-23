
"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";
import { Trash2, ArrowRight, Minus, Plus, ShoppingCart, Tag } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { useState } from "react";
import { useToastStore } from "@/stores/toastStore";

import { Product } from "@/lib/data";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, getTotal, applyCoupon, removeCoupon, couponCode, discountAmount } = useCartStore();
  const { addToast } = useToastStore();
  const [couponInput, setCouponInput] = useState("");

  const handleUpdateQty = (productId: number, newQty: number, product: Product) => {
    if (newQty < 1) return;
    
    // Check bulk pricing again when quantity changes
    let newPrice = product.price;
    const bulkPricing = product.bulkPricing || [];
    
    for (let i = 0; i < bulkPricing.length; i++) {
      if (newQty >= bulkPricing[i].minQty) {
        newPrice = bulkPricing[i].price;
      }
    }
    
    updateQuantity(productId, newQty, newPrice);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponInput.toUpperCase() === "WELCOME10") {
      const discount = getSubtotal() * 0.1;
      applyCoupon(couponInput.toUpperCase(), discount);
      addToast({ title: "Thành công", description: `Đã áp dụng mã giảm giá 10%`, type: "success" });
    } else {
      addToast({ title: "Lỗi", description: "Mã giảm giá không hợp lệ", type: "error" });
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold font-heading mb-2">Giỏ hàng trống</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Chưa có sản phẩm nào trong giỏ hàng của bạn. Cùng khám phá hàng ngàn sản phẩm văn phòng phẩm chất lượng nhé!
        </p>
        <Link 
          href={ROUTES.PRODUCTS}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-colors"
        >
          Tiếp tục mua hàng
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Giỏ hàng" }]} />
      
      <h1 className="text-3xl font-bold font-heading mb-8">Giỏ hàng của bạn</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-card border rounded-2xl overflow-hidden">
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-muted-foreground font-medium text-sm">
              <div className="col-span-6">Sản phẩm</div>
              <div className="col-span-3 text-center">Số lượng</div>
              <div className="col-span-2 text-right">Tổng</div>
              <div className="col-span-1"></div>
            </div>
            
            <div className="divide-y">
              {items.map((item) => (
                <div key={item.product.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center">
                  <div className="col-span-12 md:col-span-6 flex gap-4">
                    <div className="relative w-20 h-20 md:w-24 md:h-24 bg-white rounded-lg border overflow-hidden shrink-0">
                      <Image 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <Link href={`/products/${item.product.slug}`} className="font-semibold hover:text-primary transition-colors line-clamp-2">
                        {item.product.name}
                      </Link>
                      <div className="text-sm text-primary font-medium mt-1">
                        {formatPrice(item.price)}
                        {item.price < item.product.price && <span className="ml-2 text-xs bg-accent text-accent-foreground px-1.5 py-0.5 rounded">Giá sỉ</span>}
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-6 md:col-span-3 flex justify-start md:justify-center">
                    <div className="flex items-center border rounded-lg overflow-hidden h-9">
                      <button 
                        onClick={() => handleUpdateQty(item.product.id, item.quantity - 1, item.product)}
                        className="w-9 h-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <input 
                        type="number" 
                        value={item.quantity}
                        readOnly
                        className="w-12 h-full text-center font-medium focus:outline-none"
                      />
                      <button 
                        onClick={() => handleUpdateQty(item.product.id, Math.min(item.product.stock, item.quantity + 1), item.product)}
                        className="w-9 h-full flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="col-span-5 md:col-span-2 text-right font-bold text-foreground">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                  
                  <div className="col-span-1 flex justify-end">
                    <button 
                      onClick={() => removeItem(item.product.id)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-80 xl:w-96 shrink-0">
          <div className="bg-card border rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-bold font-heading border-b pb-4 mb-4">Tóm tắt đơn hàng</h2>
            
            <div className="space-y-3 text-sm mb-6 border-b pb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính:</span>
                <span className="font-medium">{formatPrice(getSubtotal())}</span>
              </div>
              
              {couponCode && (
                <div className="flex justify-between items-center text-green-600">
                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    <span>Mã {couponCode}</span>
                    <button onClick={removeCoupon} className="text-xs hover:underline ml-1">(Xóa)</button>
                  </div>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
            </div>
            
            <form onSubmit={handleApplyCoupon} className="flex gap-2 mb-6">
              <input 
                type="text" 
                placeholder="Mã giảm giá" 
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary uppercase"
              />
              <button type="submit" className="bg-secondary text-secondary-foreground px-4 rounded-lg text-sm font-medium hover:bg-secondary/90 transition-colors">
                Áp dụng
              </button>
            </form>

            <div className="flex justify-between items-end mb-6">
              <span className="font-bold">Tổng cộng:</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-primary">{formatPrice(getTotal())}</span>
                <p className="text-xs text-muted-foreground">(Chưa bao gồm phí vận chuyển)</p>
              </div>
            </div>
            
            <Link 
              href={ROUTES.CHECKOUT}
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
            >
              Tiến hành thanh toán
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
