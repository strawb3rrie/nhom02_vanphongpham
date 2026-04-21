"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <button
      onClick={() =>
        setTheme(resolvedTheme === "dark" ? "light" : "dark")
      }
      className="w-14 h-7 bg-gray-300"
    >
      {resolvedTheme === "dark" ? <Moon /> : <Sun />}
    </button>
  );
}