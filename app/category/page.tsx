"use client";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PRODUCTS_CATALOG } from "@/lib/data";
import { useCart } from "@/context/cartContext";
import {
  Heart,
  ShoppingCart,
  Star,
  SlidersHorizontal,
  ChevronDown,
  Search,
  Grid3X3,
  List,
} from "lucide-react";

const ALL_CATEGORIES = [
  "All",
  "Home & Kitchen",
  "Fashion & Apparel",
  "Home Decor",
  "Electronics",
  "Personal Care",
  "Kitchen Essentials",
];

function CategoryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get("category") || searchParams.get("cat") || "All";

  const { addToCart, toggleWishlist, wishlist } = useCart();

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceMax, setPriceMax] = useState(120000);
  const [sortOrder, setSortOrder] = useState<
    "default" | "price-asc" | "price-desc" | "rating"
  >("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const filteredProducts = useMemo(() => {
    return PRODUCTS_CATALOG.filter((p) => {
      if (
        searchQuery &&
        !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      if (selectedCategory !== "All" && p.category !== selectedCategory)
        return false;
      if (p.price > priceMax) return false;
      return true;
    }).sort((a, b) => {
      if (sortOrder === "price-asc") return a.price - b.price;
      if (sortOrder === "price-desc") return b.price - a.price;
      if (sortOrder === "rating")
        return parseFloat(b.rating || "4") - parseFloat(a.rating || "4");
      return 0;
    });
  }, [selectedCategory, priceMax, sortOrder, searchQuery]);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: PRODUCTS_CATALOG.length };
    PRODUCTS_CATALOG.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-[1280px] mx-auto px-5 py-6 flex gap-6 mb-10">
          {/* ── Sidebar Filters ── */}
          {filtersOpen && (
            <aside className="w-60 shrink-0 space-y-4">
              {/* Search */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-xs outline-none focus:border-[#00A759] transition-colors"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4">
                <p className="text-[11px] font-black text-[#00A759] tracking-widest uppercase mb-3">
                  Categories
                </p>
                <div className="space-y-0.5">
                  {ALL_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);

                        if (cat === "All") {
                          router.push("/category");
                        } else {
                          router.push(
                            `/category?category=${encodeURIComponent(cat)}`,
                          );
                        }
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all border-l-[3px] cursor-pointer ${
                        selectedCategory === cat
                          ? "bg-[#dff3ea] text-[#00A759] border-[#00A759]"
                          : "text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <span>{cat}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          selectedCategory === cat
                            ? "bg-[#00A759] text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {categoryCounts[cat] || 0}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4">
                <div className="flex justify-between items-center mb-3">
                  <p className="text-[11px] font-black text-[#00A759] tracking-widest uppercase">
                    Max Price
                  </p>
                  <span className="text-xs font-bold text-slate-800">
                    ₹{priceMax.toLocaleString("en-IN")}
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={120000}
                  step={500}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#00A759]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹100</span>
                  <span>₹1,20,000</span>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setPriceMax(120000);
                  setSortOrder("default");
                  setSearchQuery("");
                }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </aside>
          )}

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-100 px-5 py-3.5 flex justify-between items-center mb-5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                    filtersOpen
                      ? "bg-[#dff3ea] border-[#00A759] text-[#00A759]"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                </button>
                <span className="text-[13px] text-slate-500">
                  <strong className="text-slate-800">
                    {filteredProducts.length}
                  </strong>{" "}
                  products found
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as any)}
                    className="pl-3 pr-7 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 outline-none cursor-pointer appearance-none"
                  >
                    <option value="default">Sort: Popular</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>

                {/* View Toggle */}
                <div className="flex bg-slate-50 border border-slate-200 rounded-lg overflow-hidden">
                  {(
                    [
                      { mode: "grid", Icon: Grid3X3 },
                      { mode: "list", Icon: List },
                    ] as const
                  ).map(({ mode, Icon }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`p-1.5 transition-colors cursor-pointer ${
                        viewMode === mode
                          ? "bg-[#00A759] text-white"
                          : "text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center space-y-4">
                <div className="text-5xl">🔍</div>
                <h3 className="text-base font-bold text-slate-800">
                  No products found
                </h3>
                <p className="text-sm text-slate-500">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setPriceMax(120000);
                    setSearchQuery("");
                  }}
                  className="px-6 py-2.5 bg-[#00A759] text-white rounded-xl text-sm font-bold cursor-pointer hover:bg-[#008a4d] transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              /* Grid View */
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-200 group"
                  >
                    <Link href={`/product/${product.id}`}>
                      <div className="relative aspect-square bg-slate-50 overflow-hidden">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        {(product.badge || product.tag) && (
                          <span
                            className={`absolute top-2.5 left-2.5 text-[9px] font-black px-2 py-1 rounded-md tracking-wider ${
                              product.tag
                                ? "bg-[#00A759] text-white"
                                : "bg-[#1a1a2e] text-[#ffa352]"
                            }`}
                          >
                            {product.tag || product.badge}
                          </span>
                        )}
                      </div>
                    </Link>

                    {/* Wishlist btn */}
                    <div className="relative">
                      <button
                        onClick={() => toggleWishlist(product)}
                        className="absolute -top-12 right-2.5 w-8 h-8 bg-white/95 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer border border-slate-100"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${wishlist.some((w) => w.id === product.id) ? "fill-red-500 text-red-500" : "text-slate-400"}`}
                        />
                      </button>
                    </div>

                    <div className="p-4 space-y-2">
                      <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
                        {product.category}
                      </span>
                      <Link href={`/product/${product.id}`}>
                        <p className="text-[13px] font-bold text-slate-800 hover:text-[#00A759] line-clamp-2 leading-snug cursor-pointer transition-colors">
                          {product.name}
                        </p>
                      </Link>

                      {product.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-[11px] text-slate-500 font-semibold">
                            {product.rating}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                        <div>
                          <span className="text-base font-black text-slate-900">
                            {product.currency === "USD" ? "$" : "₹"}
                            {product.price.toLocaleString()}
                          </span>
                          {product.originalPrice && (
                            <span className="text-[11px] text-slate-400 line-through ml-1.5">
                              {product.currency === "USD" ? "$" : "₹"}
                              {product.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="flex items-center gap-1 bg-[#00A759] hover:bg-[#008a4d] text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <ShoppingCart className="w-3 h-3" /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-4 items-center hover:shadow-lg transition-shadow duration-200"
                  >
                    <Link href={`/product/${product.id}`} className="shrink-0">
                      <div className="w-[90px] h-[90px] rounded-xl overflow-hidden bg-slate-50 relative">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                        {product.category}
                      </span>
                      <Link href={`/product/${product.id}`}>
                        <p className="text-sm font-bold text-slate-800 hover:text-[#00A759] cursor-pointer transition-colors truncate">
                          {product.name}
                        </p>
                      </Link>
                      {product.description && (
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {product.description}
                        </p>
                      )}
                      {product.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-[11px] text-slate-500 font-semibold">
                            {product.rating}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2.5 shrink-0">
                      <div className="text-right">
                        <p className="text-base font-black text-slate-900">
                          {product.currency === "USD" ? "$" : "₹"}
                          {product.price.toLocaleString()}
                        </p>
                        {product.originalPrice && (
                          <p className="text-[11px] text-slate-400 line-through">
                            {product.currency === "USD" ? "$" : "₹"}
                            {product.originalPrice.toLocaleString()}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleWishlist(product)}
                          className={`p-1.5 border rounded-lg cursor-pointer transition-colors ${
                            wishlist.some((w) => w.id === product.id)
                              ? "bg-red-50 border-red-200"
                              : "bg-slate-50 border-slate-200 hover:bg-red-50 hover:border-red-200"
                          }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${wishlist.some((w) => w.id === product.id) ? "fill-red-500 text-red-500" : "text-slate-400"}`}
                          />
                        </button>
                        <button
                          onClick={() => addToCart(product, 1)}
                          className="flex items-center gap-1.5 bg-[#00A759] hover:bg-[#008a4d] text-white text-xs font-bold px-4 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default function CategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-400">
          Loading...
        </div>
      }
    >
      <CategoryContent />
    </Suspense>
  );
}
