"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, User, Menu, X, Search, LogOut, FileText, Settings, ChevronDown } from "lucide-react";
import { ROUTES, SITE_CONFIG } from "@/lib/constants";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useDebounce } from "@/hooks/useDebounce";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { items } = useCartStore();
  const { user, isLoggedIn, logout } = useAuthStore();
  
  const cartCount = items.reduce((sum: any, item: { quantity: any; }) => sum + item.quantity, 0);
  const debouncedQuery = useDebounce(searchQuery, 300);

  // Fetch search suggestions
  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await fetch("/data/products.json");
        const products = await res.json();
        const query = debouncedQuery.toLowerCase();
        const matched = products
          .filter(
            (p: { name: string; description: string }) =>
              p.name.toLowerCase().includes(query) ||
              p.description.toLowerCase().includes(query)
          )
          .map((p: { name: string }) => p.name)
          .slice(0, 5);
        setSuggestions(matched);
      } catch {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  // Close suggestions and user menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
      setMobileMenuOpen(false);
    }
  };

  const handleSelectSuggestion = (name: string) => {
    setSearchQuery(name);
    setShowSuggestions(false);
    router.push(`${ROUTES.SEARCH}?q=${encodeURIComponent(name)}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-secondary/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-28 md:h-36 flex items-center justify-between gap-6">
        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Logo */}
        <Link
          href={ROUTES.HOME}
          className="shrink-0 flex items-center gap-2"
        >
          <Image
            src="/logo.png"
            alt={SITE_CONFIG.name}
            width={300}
            height={150}
            style={{ width: "auto" }}
            className="h-20 md:h-32 w-auto object-contain transform hover:scale-105 transition-transform duration-300 origin-left"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-medium">
          <Link
            href={ROUTES.PRODUCTS}
            className="text-sm text-primary hover:text-[#B91C1C] transition-colors"
          >
            Sản phẩm
          </Link>
          <Link
            href={ROUTES.ABOUT}
            className="text-sm text-primary hover:text-[#B91C1C] transition-colors"
          >
            Giới thiệu
          </Link>
          <Link
            href={ROUTES.CONTACT}
            className="text-sm text-primary hover:text-[#B91C1C] transition-colors"
          >
            Liên hệ
          </Link>
        </nav>

        {/* Search with Suggestions */}
        <div ref={searchRef} className="hidden md:block md:flex-1 max-w-md relative">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="search"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full pl-4 pr-10 py-2.5 text-sm rounded-full border border-border/50 bg-muted/50 hover:bg-muted focus:bg-background focus:outline-none focus:ring-1 focus:ring-ring transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(true)}
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Search className="h-5 w-5 text-primary" />
            </button>
          </form>

          {/* Suggestions Dropdown */}
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-xl shadow-lg overflow-hidden z-50"
              >
                {suggestions.map((name, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectSuggestion(name)}
                    className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center gap-3 text-sm"
                  >
                    <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span>{name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isLoggedIn ? (
            <div className="relative hidden md:block" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="px-3 py-2 flex items-center gap-2 hover:bg-muted rounded-full transition-colors text-sm font-medium"
              >
                <div className="bg-primary/10 p-1.5 rounded-full text-primary">
                  <User className="h-4 w-4" />
                </div>
                <span className="max-w-30 truncate">{user?.name}</span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-card border rounded-xl shadow-xl overflow-hidden z-50 flex flex-col py-2"
                  >
                    <div className="px-4 py-3 border-b mb-1 bg-muted/30">
                      <p className="text-sm font-bold truncate">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <Link
                      href={ROUTES.ORDERS || "/orders"}
                      onClick={() => setShowUserMenu(false)}
                      className="px-4 py-2.5 text-sm hover:bg-muted flex items-center gap-3 transition-colors"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" /> Lịch sử đơn hàng
                    </Link>
                    <Link
                      href="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="px-4 py-2.5 text-sm hover:bg-muted flex items-center gap-3 transition-colors"
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" /> Thông tin cá nhân
                    </Link>
                    <div className="h-px bg-border my-1"></div>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 flex items-center gap-3 text-left w-full transition-colors font-medium"
                    >
                      <LogOut className="h-4 w-4" /> Đăng xuất
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href={ROUTES.LOGIN}
              className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors hidden md:flex text-primary"
              title="Đăng nhập"
            >
              <User className="h-5 w-5" />
            </Link>
          )}
          <Link
            href={ROUTES.CART}
            className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors relative text-primary"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent text-accent-foreground text-[10px] flex items-center justify-center font-bold">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t overflow-hidden bg-background"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
              <form onSubmit={handleSearch} className="relative mb-2">
                <input
                  type="search"
                  placeholder="Tìm kiếm..."
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border bg-muted focus:outline-none focus:ring-2 focus:ring-primary/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  <Search className="h-5 w-5" />
                </button>
              </form>
              <Link
                href={ROUTES.PRODUCTS}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 rounded-xl hover:bg-muted transition-colors font-medium"
              >
                Sản phẩm
              </Link>
              <Link
                href={ROUTES.ABOUT}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 rounded-xl hover:bg-muted transition-colors font-medium"
              >
                Giới thiệu
              </Link>
              <Link
                href={ROUTES.CONTACT}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 rounded-xl hover:bg-muted transition-colors font-medium"
              >
                Liên hệ
              </Link>
              <Link
                href={ROUTES.ORDERS}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 rounded-xl hover:bg-muted transition-colors font-medium"
              >
                Đơn hàng
              </Link>
              <Link
                href={ROUTES.LOGIN}
                onClick={() => setMobileMenuOpen(false)}
                className="py-3 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-center hover:bg-[#B91C1C] transition-colors"
              >
                Đăng nhập
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
