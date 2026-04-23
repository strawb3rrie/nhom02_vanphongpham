"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { User, Mail, Phone, MapPin, Save, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user, isLoggedIn, updateProfile } = useAuthStore();
  const { addToast } = useToastStore();
  const router = useRouter();
  
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      if (!isLoggedIn) {
        addToast({
          title: "Chưa đăng nhập",
          description: "Vui lòng đăng nhập để xem thông tin cá nhân.",
          type: "error",
        });
        router.push(ROUTES.LOGIN);
      } else if (user) {
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
        });
      }
    }
  }, [isMounted, isLoggedIn, user, router, addToast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      addToast({
        title: "Lỗi",
        description: "Họ và tên không được để trống.",
        type: "error",
      });
      return;
    }
    
    updateProfile({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
    });
    
    addToast({
      title: "Cập nhật thành công",
      description: "Hồ sơ của bạn đã được cập nhật.",
      type: "success",
    });
  };

  if (!isMounted || !isLoggedIn) return null;

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-heading font-bold mb-8">Trang cá nhân</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Sidebar / User Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-1"
          >
            <div className="bg-card border rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 relative">
                <User className="w-12 h-12" />
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-card flex items-center justify-center" title="Đã xác thực">
                  <ShieldCheck className="w-3 h-3 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold mb-1">{user?.name}</h2>
              <p className="text-muted-foreground text-sm mb-6">{user?.email}</p>

              <div className="w-full flex justify-between px-4 py-3 bg-muted/30 rounded-xl mb-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Đơn hàng</p>
                  <p className="font-bold">0</p>
                </div>
                <div className="w-px bg-border my-1"></div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Điểm</p>
                  <p className="font-bold text-primary">0</p>
                </div>
              </div>

              <div className="w-full flex flex-col gap-2 mt-2">
                <Link
                  href="/profile"
                  className="w-full py-2.5 px-4 bg-primary text-primary-foreground font-medium rounded-xl text-sm transition-colors text-center"
                >
                  Thông tin tài khoản
                </Link>
                <Link
                  href={ROUTES.ORDERS || "/orders"}
                  className="w-full py-2.5 px-4 bg-transparent hover:bg-muted text-foreground font-medium rounded-xl text-sm transition-colors text-center"
                >
                  Lịch sử đơn hàng
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="col-span-1 md:col-span-2"
          >
            <div className="bg-card border rounded-3xl p-6 md:p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6 border-b pb-4">Hồ sơ thông tin</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-2">
                      <label htmlFor="name" className="text-sm font-medium">Họ và tên</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <input
                          id="name"
                          type="text"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    {/* Email (Readonly for demo) */}
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email truy cập</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-muted/50 text-muted-foreground cursor-not-allowed"
                          value={formData.email}
                          readOnly
                          title="Không thể đổi email"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Số điện thoại</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        placeholder="VD: 0901234567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <label htmlFor="address" className="text-sm font-medium">Địa chỉ giao hàng mặc định</label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 pointer-events-none">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <textarea
                        id="address"
                        rows={3}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                        placeholder="Nhập địa chỉ nhà, số đường, phường/xã, quận/huyện..."
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Save className="w-5 h-5" />
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
