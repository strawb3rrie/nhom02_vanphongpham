"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { ROUTES, SITE_CONFIG } from "@/lib/constants";
import { ArrowRight, Mail, Lock } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { addToast } = useToastStore();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Vui lòng nhập email";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
    
    if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    if (formData.email !== "user@ute.edu.vn" || formData.password !== "123456") {
      setErrors({ email: "Email hoặc mật khẩu không chính xác (Thử dùng tài khoản mẫu)." });
      return;
    }
    
    setIsLoading(true);
    
    // Mock login simulation
    setTimeout(() => {
      login({
        id: "usr_123",
        name: "Người dùng UTE",
        email: formData.email,
        phone: "0123456789",
        address: "1 Võ Văn Ngân, Thủ Đức"
      });
      
      addToast({
        title: "Đăng nhập thành công",
        description: `Chào mừng trở lại với ${SITE_CONFIG.name}`,
        type: "success"
      });
      
      router.push(ROUTES.HOME);
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[70vh]">
      <div className="w-full max-w-md bg-card border rounded-3xl p-8 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-heading font-bold mb-2">Đăng nhập</h1>
          <p className="text-muted-foreground">Chào mừng trở lại {SITE_CONFIG.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Mật khẩu</label>
              <Link href="#" className="text-sm text-primary hover:underline font-medium">
                Quên mật khẩu?
              </Link>
            </div>
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

          <div className="flex items-center">
            <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <label htmlFor="remember" className="ml-2 text-sm text-muted-foreground">
              Ghi nhớ đăng nhập
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-transform active:scale-95 disabled:opacity-70 disabled:pointer-events-none mt-4"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Đăng nhập <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Chưa có tài khoản?{" "}
          <Link href={ROUTES.REGISTER} className="text-primary font-bold hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
}
