"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  // Ensure we only render the toggle after mounting to avoid hydration mismatch
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-14 h-7 rounded-full bg-muted/50 animate-pulse shrink-0" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "relative w-14 h-7 rounded-full transition-colors flex items-center shrink-0 border shadow-inner",
        isDark 
          ? "bg-slate-700/80 border-slate-600 hover:bg-slate-700" 
          : "bg-sky-200 border-sky-300 hover:bg-sky-300"
      )}
      aria-label="Toggle theme"
    >
      <div 
        className={cn(
          "absolute left-0.5 w-6 h-6 rounded-full bg-white flex items-center justify-center transition-transform duration-500 ease-spring shadow-sm",
          isDark ? "translate-x-7" : "translate-x-0"
        )}
      >
        {isDark ? (
          <Moon className="h-3.5 w-3.5 text-slate-800" />
        ) : (
          <Sun className="h-3.5 w-3.5 text-amber-500" />
        )}
      </div>
    </button>
  );
}
