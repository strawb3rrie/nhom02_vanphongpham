"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { useOrderStore } from "@/stores/orderStore";
import { useToastStore } from "@/stores/toastStore";
import { formatPrice } from "@/lib/utils";
import { ROUTES, SITE_CONFIG } from "@/lib/constants";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CreditCard, Truck, Wallet, CheckCircle } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getTotal, discountAmount, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const { addToast } = useToastStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    note: "",
    paymentMethod: "cod"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate Shipping
  const subtotal = getSubtotal();
  const shippingFee = subtotal >= SITE_CONFIG.freeShippingThreshold ? 0 : SITE_CONFIG.shippingFee;
  const finalTotal = getTotal() + shippingFee;

  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.replace(ROUTES.CART);
    }
  }, [items, router, orderComplete]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ giao hàng";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    // Mock API call
    setTimeout(() => {
      addOrder({
        items: [...items],
        subtotal: getSubtotal(),
        discount: discountAmount,
        shippingFee,
        total: finalTotal,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
        },
        paymentMethod: formData.paymentMethod,
      });
      
      clearCart();
      setIsSubmitting(false);
      setOrderComplete(true);
      
      addToast({
        title: "Đặt hàng thành công!",
        description: "Chúng tôi sẽ sớm liên hệ để xác nhận đơn hàng.",
        type: "success"
      });
    }, 1500);
  };

  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold font-heading mb-4 text-center">Đặt hàng thành công!</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-md">
          Cảm ơn bạn đã tin tưởng và mua sắm tại {SITE_CONFIG.name}. Mã vận đơn của bạn đã được lưu lại trong mục đơn hàng.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => router.push(ROUTES.HOME)}
            className="px-6 py-3 border border-border rounded-full font-medium hover:bg-muted transition-colors"
          >
            Về trang chủ
          </button>
          <button 
            onClick={() => router.push(ROUTES.ORDERS)}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            Xem đơn hàng
          </button>
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb 
        items={[
          { label: "Giỏ hàng", href: ROUTES.CART },
          { label: "Thanh toán" }
        ]} 
      />
      
      <h1 className="text-3xl font-bold font-heading mb-8">Thanh toán</h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-8">
          {/* Shipping Address */}
          <section className="bg-card border rounded-2xl p-6">
            <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
              Thông tin giao hàng
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">Họ và tên *</label>
                <input 
                  id="fullName"
                  name="fullName"
                  type="text" 
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.fullName ? 'border-red-500' : ''}`}
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">Số điện thoại *</label>
                <input 
                  id="phone"
                  name="phone"
                  type="tel" 
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.phone ? 'border-red-500' : ''}`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label htmlFor="address" className="text-sm font-medium">Địa chỉ nhận hàng *</label>
                <input 
                  id="address"
                  name="address"
                  type="text" 
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  className={`w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.address ? 'border-red-500' : ''}`}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="note" className="text-sm font-medium">Ghi chú đơn hàng (Tùy chọn)</label>
                <textarea 
                  id="note"
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-y"
                ></textarea>
              </div>
            </div>
          </section>

          {/* Payment Method */}
          <section className="bg-card border rounded-2xl p-6">
            <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</span>
              Phương thức thanh toán
            </h2>
            
            <div className="space-y-3">
              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${formData.paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="cod" 
                  checked={formData.paymentMethod === 'cod'}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <Truck className="h-6 w-6 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-sm text-muted-foreground">Thanh toán bằng tiền mặt khi giao hàng</p>
                </div>
              </label>

              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${formData.paymentMethod === 'bank' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="bank" 
                  checked={formData.paymentMethod === 'bank'}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <CreditCard className="h-6 w-6 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">Chuyển khoản ngân hàng</p>
                  <p className="text-sm text-muted-foreground">Thực hiện thanh toán vào tài khoản ngân hàng</p>
                </div>
              </label>

              <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${formData.paymentMethod === 'ewallet' ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}>
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="ewallet" 
                  checked={formData.paymentMethod === 'ewallet'}
                  onChange={handleChange}
                  className="w-4 h-4 text-primary focus:ring-primary"
                />
                <Wallet className="h-6 w-6 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">Ví điện tử (Momo / ZaloPay)</p>
                  <p className="text-sm text-muted-foreground">Thanh toán an toàn qua ví điện tử</p>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-card border rounded-2xl p-6 sticky top-24">
            <h2 className="text-xl font-bold font-heading border-b pb-4 mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">3</span>
              Kiểm tra đơn hàng
            </h2>
            
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 text-sm">
                  <div className="relative w-12 h-12 bg-white rounded border overflow-hidden shrink-0">
                    <Image src={item.product.images[0]} alt="" fill className="object-contain p-1" sizes="48px" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium line-clamp-1">{item.product.name}</p>
                    <p className="text-muted-foreground text-xs mt-1">SL: {item.quantity}</p>
                  </div>
                  <div className="font-medium shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 text-sm border-y py-4 mb-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính:</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              
              {discountAmount > 0 && (
                <div className="flex justify-between items-center text-green-600">
                  <span>Giảm giá:</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí vận chuyển:</span>
                <span className="font-medium">{shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-6">
              <span className="font-bold">Tổng cộng:</span>
              <span className="text-2xl font-bold text-primary">{formatPrice(finalTotal)}</span>
            </div>
            
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang xử lý...
                </>
              ) : (
                "Hoàn tất đặt hàng"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
