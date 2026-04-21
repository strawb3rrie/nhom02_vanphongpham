import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 min-h-screen bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-8 bg-card rounded-2xl shadow-xl border">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-lg font-medium text-foreground tracking-tight animate-pulse">
          Đang tải dữ liệu...
        </p>
      </div>
    </div>
  );
}