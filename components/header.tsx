"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Download,
  MapPin,
  ChevronDown,
  X,
} from "lucide-react";
import { useCart } from "@/context/cartContext";
import { useRouter } from "next/navigation";

const categories = [
  { name: "Home & Kitchen", icon: "🏠" },
  { name: "Fashion & Apparel", icon: "👗" },
  { name: "Home Decor", icon: "🪴" },
  { name: "Electronics", icon: "⚡" },
  { name: "Personal Care", icon: "🧴" },
  { name: "Kitchen Essentials", icon: "🍳" },
  // { name: "Office Stationery Product", icon: "📎" },
  // { name: "Winter Product", icon: "🧥" },
  // { name: "Craft Product", icon: "✂️" },
  // { name: "Cleaning Product", icon: "🧹" },
  // { name: "Bottle Product", icon: "🍶" },
  // { name: "Furniture", icon: "🪑" },
  // { name: "Summer Product", icon: "☀️" },
  // { name: "Computer Product", icon: "💻" },
  // { name: "Bag Cover", icon: "🎒" },
  // { name: "Kids Stationary", icon: "✏️" },
  // { name: "Wipes Product", icon: "🧻" },
  // { name: "Pet Product", icon: "🐾" },
  // { name: "Soft Toys", icon: "🧸" },
  // { name: "Glass Product", icon: "🥛" },
  // { name: "Holi", icon: "🎨" },
  // { name: "Night Lamp", icon: "🌙" },
  // { name: "Wallpaper", icon: "🖼️" },
  // { name: "Travel", icon: "✈️" },
  // { name: "Hair Brushes", icon: "💇" },
  // { name: "Electronics", icon: "📺" },
  // { name: "Fashion & Apparel", icon: "👔" },
  // { name: "Personal Care", icon: "🧴" },
];

export default function Header() {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { totals, wishlist } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const cartCount = totals.itemCount;
  const wishlistCount = wishlist.length;
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Main Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-[1280px] mx-auto px-5 py-3 flex items-center justify-between gap-5">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 no-underline"
          >
            <div className="w-10 h-10 rounded-[10px] bg-[#00A759] flex items-center justify-center text-xl ">
              🛒
            </div>
            <div>
              <div className="text-[18px] font-black text-[#1a1a2e] font-serif tracking-tight">
                Sarvam <span className="text-[#00A759]">Kart</span>
              </div>
              <div className="text-[9px] text-slate-400 font-mono tracking-widest">
                PREMIUM BOUTIQUE
              </div>
            </div>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 relative max-w-[560px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Type to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 pl-10 pr-9 border border-slate-200 rounded-full text-[13px] text-slate-800 bg-slate-50 outline-none focus:border-[#00A759] focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {/* My Orders */}
            <Link href="/orders" className="no-underline">
              <button className="flex items-center gap-1.5 px-3 py-2 bg-transparent border-none cursor-pointer text-[12px] font-semibold text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                My Orders
              </button>
            </Link>

            {/* Wishlist */}
            <Link href="/cart" className="no-underline">
              <button className="relative p-2 bg-transparent border-none cursor-pointer text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                <Heart
                  className="w-[18px] h-[18px]"
                  style={{
                    color: wishlistCount > 0 ? "#ef4444" : "#475569",
                    fill: wishlistCount > 0 ? "#ef4444" : "none",
                  }}
                />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                    {wishlistCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="no-underline">
              <button className="relative p-2 bg-transparent border-none cursor-pointer text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                <ShoppingCart className="w-[18px] h-[18px]" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-[#00A759] rounded-full text-[9px] text-white flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>

            {/* User */}
            <Link href="/signin" className="no-underline">
              <button className="p-2 bg-transparent border-none cursor-pointer text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                <User className="w-[18px] h-[18px]" />
              </button>
            </Link>
          </div>
        </div>

        {/* Navigation Bar */}
        <div className="border-t border-slate-100 bg-white">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between">
            <nav className="flex items-center">
              {/* Home */}
              <Link href="/" className="no-underline">
                <button className="px-4 py-3 bg-transparent border-none cursor-pointer text-[13px] font-semibold text-slate-700 hover:text-[#00A759] transition-colors">
                  Home
                </button>
              </Link>

              {/* Category Dropdown */}
              <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setCategoryOpen(!categoryOpen)}
                    className="flex items-center gap-1.5 px-4 py-2.5 mx-1 rounded-lg border-none cursor-pointer text-[13px] font-semibold text-slate-700 hover:text-[#00A759] transition-all bg-transparent"
                  >
                    Category
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${categoryOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                {/* Dropdown */}
                {categoryOpen && (
                  <div className="absolute left-0 top-[48px] w-[520px] bg-white rounded-2xl border border-slate-200 shadow-xl z-[200] p-4">
                    <div className="grid grid-cols-2 gap-1">
                      {categories.map((cat, i) => (
                        <div
                          key={i}
                          onClick={() => {
                            setCategoryOpen(false);
                            router.push(
                              `/category?category=${encodeURIComponent(cat.name)}`,
                            );
                          }}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-orange-50 transition-colors group"
                        >
                          <span className="text-xl shrink-0">{cat.icon}</span>
                          <span className="text-[12px] font-semibold text-slate-700 group-hover:text-[#00A759] transition-colors">
                            {cat.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* All Collections */}
              <Link href="/all-collections" className="no-underline">
                <button className="px-4 py-3 bg-transparent border-none cursor-pointer text-[13px] font-semibold text-slate-700 hover:text-[#00A759] transition-colors">
                  All Collections
                </button>
              </Link>
            </nav>

            {/* Branch Badge */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3.5 py-1.5 cursor-pointer hover:bg-[#d9f1e6] hover:border[#d9f1e6] transition-colors">
              <MapPin className="w-3 h-3 text-[#00A759]" />
              <span className="text-[11px] font-bold text-slate-500 tracking-[0.5px]">
                KATARGAM BRANCH
              </span>
            </div>
          </div>
        </div>

      </header>
    </>
  );
}
