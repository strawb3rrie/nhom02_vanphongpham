import Link from "next/link";
import Image from "next/image";
import { SITE_CONFIG, ROUTES } from "@/lib/constants";
import { getAssetPath } from "@/lib/utils";
import { MapPin, Phone, Mail, Globe, MessageCircle, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-auto border-t border-border/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Image src={getAssetPath("/logo.png")} alt={SITE_CONFIG.name} width={400} height={150} style={{ width: "auto" }} className="h-28 md:h-32 w-auto object-contain mb-6" />
            <p className="text-muted-foreground mb-6 leading-relaxed">{SITE_CONFIG.description}</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition-colors" aria-label="Facebook"><Globe className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Zalo"><MessageCircle className="h-5 w-5" /></a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Telegram"><Send className="h-5 w-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-4">Danh mục</h4>
            <ul className="space-y-2">
              <li><Link href={`${ROUTES.PRODUCTS}?category=but-viet`} className="hover:text-primary transition-colors">Bút viết</Link></li>
              <li><Link href={`${ROUTES.PRODUCTS}?category=so-vo`} className="hover:text-primary transition-colors">Sổ, Vở</Link></li>
              <li><Link href={`${ROUTES.PRODUCTS}?category=dung-cu`} className="hover:text-primary transition-colors">Dụng cụ học tập</Link></li>
              <li><Link href={`${ROUTES.PRODUCTS}?category=van-phong`} className="hover:text-primary transition-colors">Văn phòng</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2">
              <li><Link href={ROUTES.ABOUT} className="hover:text-primary transition-colors">Về chúng tôi</Link></li>
              <li><Link href={ROUTES.CONTACT} className="hover:text-primary transition-colors">Liên hệ</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Chính sách đổi trả</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Liên hệ</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span>1 Võ Văn Ngân, Phường Linh Chiểu, Thủ Đức, TP.HCM</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>(028) 3896 8641</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>contact@ute-stationery.vn</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-16 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {SITE_CONFIG.name}. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
