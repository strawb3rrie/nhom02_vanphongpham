import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="w-32 h-32 bg-muted rounded-full flex items-center justify-center mb-8 relative">
        <FileQuestion className="h-16 w-16 text-muted-foreground" />
        <div className="absolute -bottom-2 -right-2 bg-background font-black font-heading text-4xl text-primary drop-shadow-md">
          404
        </div>
      </div>
      
      <h1 className="text-3xl md:text-5xl font-heading font-bold mb-4">Không tìm thấy trang</h1>
      
      <p className="text-muted-foreground text-lg mb-8 max-w-md">
        Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị gỡ bỏ.
      </p>
      
      <Link 
        href={ROUTES.HOME}
        className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold inline-flex items-center gap-2 hover:bg-primary/90 transition-transform active:scale-95"
      >
        <ArrowLeft className="h-5 w-5" />
        Quay lại trang chủ
      </Link>
    </div>
  );
}
