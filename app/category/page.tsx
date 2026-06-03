"use client";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useState, Suspense, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchCategories } from "@/store/slices/categorySlice";
import { toggleWishlist } from "@/store/slices/cartSlice";
import { api } from "@/lib/axios";
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

  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading: categoriesLoading } = useSelector((state: RootState) => state.category);
  const { wishlist } = useSelector((state: RootState) => state.cart);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(1000);
  const [sortOrder, setSortOrder] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(true);

  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  // Sync initialCategory from URL
  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Fetch categories if not fetched
  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length, categoriesLoading]);

  const fetchProducts = async (pageNumber: number, reset = false) => {
    setLoading(true);
    try {
      let url = `/product?page=${pageNumber}&limit=12`;
      if (selectedCategory && selectedCategory !== "All") {
        const catObj = categories.find((c: any) => c.title === selectedCategory);
        let handleToUse = catObj?.handle;
        if (!handleToUse) {
          // Fallback to generating a handle from the title
          handleToUse = selectedCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }
        url += `&categoryHandle=${handleToUse}`; 
      }
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`; 
      }
      if (priceMin > 0) {
        url += `&minPrice=${priceMin}`;
      }
      if (priceMax < 1000) {
        url += `&maxPrice=${priceMax}`;
      }
      if (sortOrder && sortOrder !== "default") {
        url += `&sort=${sortOrder}`;
      }

      const res = await api.get(url);
      const newProducts = res.data.data || [];
      const totalRecords = res.data.pagination?.totalRecords || 0;

      setProducts((prev) => {
        if (reset) return newProducts;
        // Prevent duplicates
        const existingIds = new Set(prev.map((p) => p._id));
        const filtered = newProducts.filter((p: any) => !existingIds.has(p._id));
        return [...prev, ...filtered];
      });

      if (reset) {
        setHasMore(newProducts.length > 0 && newProducts.length < totalRecords);
        if (totalRecords === undefined && newProducts.length === 12) setHasMore(true);
      } else {
        if (newProducts.length === 0 || newProducts.length < 12) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      fetchProducts(1, true);
    }, 400);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, priceMin, priceMax, sortOrder, searchQuery, categories]);

  const lastElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchProducts(nextPage, false);
            return nextPage;
          });
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="w-full px-5 py-6 flex gap-6 flex-1">
          {/* ── Sidebar Filters ── */}
          {filtersOpen && (
            <aside className="w-60 shrink-0 space-y-4 sticky top-[134px] self-start max-h-[calc(100vh-140px)] overflow-y-auto pb-4 custom-scrollbar pr-2">
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
                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      router.push("/category");
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all border-l-[3px] cursor-pointer ${
                      selectedCategory === "All"
                        ? "bg-[#dff3ea] text-[#00A759] border-[#00A759]"
                        : "text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-800"
                    }`}
                  >
                    <span>All</span>
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => {
                        setSelectedCategory(cat.title);
                        router.push(
                          `/category?category=${encodeURIComponent(cat.title)}`,
                        );
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-all border-l-[3px] cursor-pointer ${
                        selectedCategory === cat.title
                          ? "bg-[#dff3ea] text-[#00A759] border-[#00A759]"
                          : "text-slate-500 border-transparent hover:bg-slate-50 hover:text-slate-800"
                      }`}
                    >
                      <span>{cat.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-2xl border border-slate-100 p-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-[11px] font-black text-[#00A759] tracking-widest uppercase">
                    Price Range
                  </p>
                  <span className="text-xs font-bold text-slate-800">
                    ₹{priceMin.toLocaleString("en-IN")} - ₹{priceMax === 1000 ? "1,000+" : priceMax.toLocaleString("en-IN")}
                  </span>
                </div>
                
                <div className="relative h-1.5 bg-slate-200 rounded-full mb-4 mt-3">
                  <div 
                    className="absolute h-full bg-[#00A759] rounded-full pointer-events-none" 
                    style={{ 
                      left: `${(priceMin / 1000) * 100}%`, 
                      right: `${100 - (priceMax / 1000) * 100}%` 
                    }} 
                  />
                  
                  <input 
                    type="range" 
                    min={0} 
                    max={1000} 
                    step={10} 
                    value={priceMin} 
                    onChange={(e) => {
                      const val = Math.min(Number(e.target.value), priceMax - 10);
                      setPriceMin(val);
                    }}
                    className="absolute w-full top-[-7px] h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#00A759] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-grab active:[&::-webkit-slider-thumb]:cursor-grabbing [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20"
                  />
                  
                  <input 
                    type="range" 
                    min={0} 
                    max={1000} 
                    step={10} 
                    value={priceMax} 
                    onChange={(e) => {
                      const val = Math.max(Number(e.target.value), priceMin + 10);
                      setPriceMax(val);
                    }}
                    className="absolute w-full top-[-7px] h-1.5 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-[#00A759] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-grab active:[&::-webkit-slider-thumb]:cursor-grabbing [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:relative [&::-webkit-slider-thumb]:z-20"
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>₹0</span>
                  <span>₹1,000+</span>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setPriceMin(0);
                  setPriceMax(1000);
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
          <div className="flex-1 min-w-0 flex flex-col">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl border border-slate-100 px-5 py-3.5 flex justify-between items-center mb-5 sticky top-[134px] z-20 shadow-sm">
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
              </div>

              <div className="flex items-center gap-2.5">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="pl-3 pr-7 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 bg-slate-50 outline-none cursor-pointer appearance-none"
                  >
                    <option value="default">Sort by: Default</option>
                    <option value="name-asc">Alphabetically, A-Z</option>
                    <option value="name-desc">Alphabetically, Z-A</option>
                    <option value="price-asc">Price, low to high</option>
                    <option value="price-desc">Price, high to low</option>
                    <option value="date-asc">Date, old to new</option>
                    <option value="date-desc">Date, new to old</option>
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
            {products.length === 0 && !loading ? (
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {products.map((product, index) => {
                  const isLastElement = index === products.length - 1;
                  const imageUrl = product.images?.[0]?.src || "/images/placeholder.jpg";
                  const categoryName = product.categories?.[0]?.title || "Uncategorized";

                  return (
                  <div
                    key={product._id || product.shopifyId}
                    ref={isLastElement ? lastElementRef : null}
                    className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-200 group flex flex-col"
                  >
                    <Link href={`/product/${product.shopifyId || product.id}`}>
                      <div className="relative aspect-square bg-slate-50 overflow-hidden">
                        <Image
                          src={imageUrl}
                          alt={product.title || product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        {/* {(product.status === "active") && (
                          <span
                            className="absolute top-2.5 left-2.5 text-[9px] font-black px-2 py-1 rounded-md tracking-wider bg-[#00A759] text-white"
                          >
                            NEW
                          </span>
                        )} */}
                      </div>
                    </Link>

                    {/* Wishlist btn */}
                    <div className="relative">
                      <button
                        onClick={() => dispatch(toggleWishlist(product))}
                        className="absolute -top-12 right-2.5 w-8 h-8 bg-white/95 rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform cursor-pointer border border-slate-100"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${wishlist.some((w: any) => (w._id || w.id || w.shopifyId) === (product._id || product.id || product.shopifyId)) ? "fill-red-500 text-red-500" : "text-slate-400"}`}
                        />
                      </button>
                    </div>

                    <div className="p-4 space-y-2 flex-1 flex flex-col">
                      <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
                        {categoryName}
                      </span>
                      <Link href={`/product/${product.shopifyId || product.id}`}>
                        <p className="text-[13px] font-bold text-slate-800 hover:text-[#00A759] line-clamp-2 leading-snug cursor-pointer transition-colors">
                          {product.title || product.name}
                        </p>
                      </Link>

                      <div className="mt-auto pt-2 border-t border-slate-50 flex items-center justify-between">
                        <div>
                          <span className="text-base font-black text-slate-900">
                            ₹{(product.basePrice || product.price || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="z-10 mt-1" onClick={(e) => e.preventDefault()}>
                          <AddToCartButton 
                            product={product} 
                            hideLabel={true}
                            className="!p-2 h-8 w-16" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
                {loading && (
                  <div className="col-span-full flex justify-center py-6">
                    <div className="animate-spin w-6 h-6 border-2 border-slate-200 border-t-[#00A759] rounded-full"></div>
                  </div>
                )}
              </div>
            ) : (
              /* List View */
              <div className="space-y-3">
                {products.map((product, index) => {
                  const isLastElement = index === products.length - 1;
                  const imageUrl = product.images?.[0]?.src || "/images/placeholder.jpg";
                  const categoryName = product.categories?.[0]?.title || "Uncategorized";

                  return (
                  <div
                    key={product._id || product.shopifyId}
                    ref={isLastElement ? lastElementRef : null}
                    className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-4 items-center hover:shadow-lg transition-shadow duration-200"
                  >
                    <Link href={`/product/${product.shopifyId || product.id}`} className="shrink-0">
                      <div className="w-[90px] h-[90px] rounded-xl overflow-hidden bg-slate-50 relative">
                        <Image
                          src={imageUrl}
                          alt={product.title || product.name}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-1">
                        {categoryName}
                      </span>
                      <Link href={`/product/${product.shopifyId || product.id}`}>
                        <p className="text-sm font-bold text-slate-800 hover:text-[#00A759] cursor-pointer transition-colors truncate">
                          {product.title || product.name}
                        </p>
                      </Link>
                    </div>

                    <div className="flex flex-col items-end gap-2.5 shrink-0">
                      <div className="text-right">
                        <p className="text-base font-black text-slate-900">
                          ₹{(product.basePrice || product.price || 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => dispatch(toggleWishlist(product))}
                          className={`p-1.5 border rounded-lg cursor-pointer transition-colors ${
                            wishlist.some((w: any) => (w._id || w.id || w.shopifyId) === (product._id || product.id || product.shopifyId))
                              ? "bg-red-50 border-red-200"
                              : "bg-slate-50 border-slate-200 hover:bg-red-50 hover:border-red-200"
                          }`}
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${wishlist.some((w: any) => (w._id || w.id || w.shopifyId) === (product._id || product.id || product.shopifyId)) ? "fill-red-500 text-red-500" : "text-slate-400"}`}
                          />
                        </button>
                        <div className="z-10" onClick={(e) => e.preventDefault()}>
                          <AddToCartButton 
                            product={product} 
                            hideLabel={true}
                            className="!p-2 h-9 w-24" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )})}
                {loading && (
                  <div className="w-full flex justify-center py-6">
                    <div className="animate-spin w-6 h-6 border-2 border-slate-200 border-t-[#00A759] rounded-full"></div>
                  </div>
                )}
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
