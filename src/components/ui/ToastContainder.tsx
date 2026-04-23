"use client";

import { useToastStore } from "@/stores/toastStore";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-24 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => {
          const Icon = 
            toast.type === "success" ? CheckCircle :
            toast.type === "error" ? AlertCircle :
            toast.type === "warning" ? AlertTriangle : Info;

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -50, scale: 0.3 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              className={cn(
                "flex items-start gap-4 p-4 rounded-lg shadow-lg border overflow-hidden",
                "bg-background text-foreground",
                toast.type === "success" && "border-green-500",
                toast.type === "error" && "border-red-500",
                toast.type === "warning" && "border-yellow-500",
              )}
            >
              <Icon 
                className={cn(
                  "h-5 w-5 shrink-0",
                  toast.type === "success" ? "text-green-500" :
                  toast.type === "error" ? "text-red-500" :
                  toast.type === "warning" ? "text-yellow-500" : "text-primary"
                )} 
              />
              <div className="flex-1 space-y-1">
                <p className="font-medium text-sm">{toast.title}</p>
                {toast.description && (
                  <p className="text-sm text-muted-foreground opacity-90">{toast.description}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 p-1 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
