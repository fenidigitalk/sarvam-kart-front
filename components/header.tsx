"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  ChevronDown,
  X,
  Folder,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchCategories } from "@/store/slices/categorySlice";
import { fetchCartAsync, fetchWishlistAsync } from "@/store/slices/cartSlice";
import { api } from "@/lib/axios";

export default function Header() {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { totalQuantity, wishlist, items } = useSelector((state: RootState) => state.cart);
  const { token } = useSelector((state: RootState) => state.auth);
  const { categories, loading } = useSelector((state: RootState) => state.category);

  const cartCount = items.length;
  const wishlistCount = wishlist.length;



  useEffect(() => {
    if (categories.length === 0 && !loading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length, loading]);

  useEffect(() => {
    if (token) {
      dispatch(fetchCartAsync());
      dispatch(fetchWishlistAsync());
    }
  }, [dispatch, token]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoryOpen(false);
      }
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    setShowSearchDropdown(true);
    
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await api.get(`/product?search=${encodeURIComponent(searchQuery)}&limit=5`);
        setSearchResults(res.data.data || []);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <>
    
      {/* Main Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-[100] shadow-sm">
        <div className="max-w-[1280px] mx-auto py-3 flex items-center justify-between gap-5">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center shrink-0 no-underline"
          >
            <img src="/logo.png" alt="Sarvam Cart" className="h-14 w-auto object-contain drop-shadow-sm" />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 relative max-w-[560px]" ref={searchDropdownRef}>
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Type to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (searchQuery.trim()) setShowSearchDropdown(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  setShowSearchDropdown(false);
                  router.push(`/category?search=${encodeURIComponent(searchQuery.trim())}`);
                }
              }}
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

            {/* Search Dropdown */}
            {showSearchDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-[200]">
                {isSearching ? (
                  <div className="p-4 text-center text-sm text-slate-500">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <div className="max-h-[300px] overflow-y-auto">
                    {searchResults.map((product) => (
                      <Link 
                        key={product._id || product.id}
                        href={`/product/${product.shopifyId || product._id || product.id}`}
                        onClick={() => {
                          setShowSearchDropdown(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 no-underline"
                      >
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img src={product.images[0]?.src || product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                              <Search className="w-4 h-4" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-800 truncate">{product.title}</h4>
                          <p className="text-xs text-slate-500 truncate">{product.category}</p>
                        </div>
                        <div className="text-sm font-bold text-[#00A759]">
                          ₹{product.price || product.variants?.[0]?.price || 0}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-slate-500">No products found for "{searchQuery}"</div>
                )}
              </div>
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
            <Link href="/wishList" className="no-underline">
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
            <Link href="/profile" className="no-underline">
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
                    {loading ? (
                      <div className="p-4 text-center text-sm text-slate-500">Loading categories...</div>
                    ) : categories.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-500">No categories found</div>
                    ) : (
                      <div className="grid grid-cols-2 gap-1">
                        {categories.map((cat, i) => (
                          <div
                            key={cat._id || i}
                            onClick={() => {
                              setCategoryOpen(false);
                              router.push(
                                `/category?category=${encodeURIComponent(cat.title)}`,
                              );
                            }}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-orange-50 transition-colors group"
                          >
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 shrink-0 flex items-center justify-center border border-slate-200">
                              {cat.image ? (
                                <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
                              ) : (
                                <Folder className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                            <span className="text-[12px] font-semibold text-slate-700 group-hover:text-[#00A759] transition-colors">
                              {cat.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link href="/contact" className="no-underline">
                <button className="px-4 py-3 bg-transparent border-none cursor-pointer text-[13px] font-semibold text-slate-700 hover:text-[#00A759] transition-colors">
                  Contact
                </button>
              </Link>

              <Link href="/about" className="no-underline">
                <button className="px-4 py-3 bg-transparent border-none cursor-pointer text-[13px] font-semibold text-slate-700 hover:text-[#00A759] transition-colors">
                  About 
                </button>
              </Link>

              <Link href="/category?category=New%20Arrivals" className="no-underline">
                <button className="px-4 py-3 bg-transparent border-none cursor-pointer text-[13px] font-semibold text-slate-700 hover:text-[#00A759] transition-colors">
                  New Arrivals
                </button>
              </Link>

            
            </nav>

            {/* Branch Badge */}
            {/* <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-full px-3.5 py-1.5 cursor-pointer hover:bg-[#d9f1e6] hover:border[#d9f1e6] transition-colors">
              <MapPin className="w-3 h-3 text-[#00A759]" />
              <span className="text-[11px] font-bold text-slate-500 tracking-[0.5px]">
                KATARGAM BRANCH
              </span>
            </div> */}
          </div>
        </div>

      </header>
    </>
  );
}
