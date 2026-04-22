"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { ROUTES, SITE_CONFIG } from "@/lib/constants";
import { ArrowRight, Mail, Lock, User } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { addToast } = useToastStore();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Vui lòng nhập họ tên";
    
    if (!formData.email) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
    
    if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu";
    else if (formData.password.length < 6) newErrors.password = "Mật khẩu phải từ 6 ký tự";
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    // Mock registration API 
    setTimeout(() => {
      login({
        id: `usr_${Math.random().toString(36).substring(2, 9)}`,
        name: formData.name,
        email: formData.email,
      });
      
      addToast({
        title: "Tạo tài khoản thành công",
        description: `Chào mừng ${formData.name} đến với ${SITE_CONFIG.name}`,
        type: "success"
      });
      
      router.push(ROUTES.HOME);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-card border rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">Đăng ký</h1>
          <p className="text-muted-foreground">Tạo tài khoản mua sắm mới</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Họ và tên</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                placeholder="Nhập họ và tên"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 bg-muted/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.name ? 'border-red-500 ring-red-500/20' : ''}`}
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 bg-muted/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.email ? 'border-red-500 ring-red-500/20' : ''}`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Mật khẩu</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 bg-muted/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.password ? 'border-red-500 ring-red-500/20' : ''}`}
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Xác nhận mật khẩu</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 bg-muted/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${errors.confirmPassword ? 'border-red-500 ring-red-500/20' : ''}`}
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-transform active:scale-95 disabled:opacity-70 disabled:pointer-events-none mt-6"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Tạo tài khoản <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Đã có tài khoản?{" "}
          <Link href={ROUTES.LOGIN} className="text-primary font-bold hover:underline">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
