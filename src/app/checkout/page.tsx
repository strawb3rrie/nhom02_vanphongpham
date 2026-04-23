"use client";

import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { useOrderStore } from "@/stores/orderStore";
import { useToastStore } from "@/stores/toastStore";
import { useAuthStore } from "@/stores/authStore"; // Thêm AuthStore
import { formatPrice } from "@/lib/utils";
import { ROUTES, SITE_CONFIG } from "@/lib/constants";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { CreditCard, Truck, Wallet, CheckCircle, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore(); // Lấy thông tin user hiện tại
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

  // Tự động điền thông tin nếu user đã login
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      }));
    }
  }, [user]);

  // Tính toán phí ship bằng useMemo để tối ưu hiệu năng
  const subtotal = getSubtotal();
  const { shippingFee, finalTotal } = useMemo(() => {
    const fee = subtotal >= SITE_CONFIG.freeShippingThreshold ? 0 : SITE_CONFIG.shippingFee;
    return {
      shippingFee: fee,
      finalTotal: getTotal() + fee
    };
  }, [subtotal, getTotal]);

  useEffect(() => {
    if (items.length === 0 && !orderComplete) {
      router.replace(ROUTES.CART);
    }
  }, [items, router, orderComplete]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^(0|84)(3|5|7|8|9)([0-9]{8})$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại Việt Nam không hợp lệ";
    }
    if (!formData.address.trim()) newErrors.address = "Vui lòng nhập địa chỉ cụ thể";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      addToast({ title: "Thông tin chưa hợp lệ", type: "error" });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Giả lập gọi API thực tế
      await new Promise(resolve => setTimeout(resolve, 2000));

      addOrder({
        items: [...items],
        subtotal,
        discount: discountAmount,
        shippingFee,
        total: finalTotal,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
        },
        paymentMethod: formData.paymentMethod,
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      
      clearCart();
      setOrderComplete(true);
      addToast({
        title: "Đặt hàng thành công!",
        description: "Đơn hàng của bạn đang được xử lý.",
        type: "success"
      });
    } catch (err) {
      addToast({ title: "Có lỗi xảy ra", description: "Vui lòng thử lại sau.", type: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trang trạng thái thành công
  if (orderComplete) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Cảm ơn bạn đã mua hàng!</h1>
          <p className="text-muted-foreground mb-8">
            Đơn hàng của bạn đã được tiếp nhận. Bạn có thể theo dõi tiến độ trong phần lịch sử mua hàng.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => router.push(ROUTES.ORDERS)} className="bg-primary text-white px-8 py-3 rounded-xl font-bold">Xem đơn hàng</button>
            <button onClick={() => router.push("/")} className="bg-secondary px-8 py-3 rounded-xl font-bold">Tiếp tục mua sắm</button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="bg-slate-50 min-h-screen"> {/* Thêm background nhẹ để tách biệt các card */}
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "Giỏ hàng", href: ROUTES.CART }, { label: "Thanh toán" }]} />
        <h1 className="text-3xl font-bold font-heading my-8">Quy trình thanh toán</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cột trái: Thông tin & Thanh toán */}
          <div className="lg:col-span-7 space-y-6">
            {/* Bước 1: Thông tin */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">1</span>
                Thông tin người nhận
              </h2>
              {/* ... Giữ nguyên input của bạn, có thể thêm class focus:border-primary ... */}
            </div>

            {/* Bước 2: Thanh toán */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm">2</span>
                Hình thức thanh toán
              </h2>
              {/* ... Phần Radio Button Payment của bạn ... */}
            </div>
          </div>

          {/* Cột phải: Tóm tắt đơn hàng (Sticky) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>
              
              <div className="max-h-60 overflow-y-auto mb-6 pr-2 custom-scrollbar">
                 {/* Map items ở đây */}
              </div>

              <div className="space-y-3 py-4 border-t border-dashed">
                <div className="flex justify-between text-slate-600">
                  <span>Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t mb-6">
                <span className="text-lg font-bold">Tổng thanh toán</span>
                <span className="text-2xl font-bold text-primary">{formatPrice(finalTotal)}</span>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary text-white rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : null}
                {isSubmitting ? "Đang xử lý đơn hàng..." : "Xác nhận đặt hàng"}
              </button>
              
              <p className="text-center text-xs text-slate-400 mt-4">
                Bằng cách nhấn đặt hàng, bạn đồng ý với Điều khoản dịch vụ của chúng tôi.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}