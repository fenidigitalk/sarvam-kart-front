"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { api } from "@/lib/axios";
import AddToCartButton from "@/components/AddToCartButton";
import {
  ShoppingCart,
  Heart,
  Star,
  ChevronRight,
  Truck,
  ShieldCheck,
  Award,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchCategories } from "@/store/slices/categorySlice";

const FEATURED_CATEGORIES = [
  {
    name: "Fashion & Apparel",
    icon: "👗",
    color: "#fff0e6",
    border: "#ffd4b0",
  },
  { name: "Electronics", icon: "📱", color: "#e6f0ff", border: "#b0c4ff" },
  { name: "Home Decor", icon: "🪴", color: "#e6fff0", border: "#b0ffd4" },
  { name: "Personal Care", icon: "🧴", color: "#fff0f6", border: "#ffb0d4" },
  { name: "Home & Kitchen", icon: "🏠", color: "#f0e6ff", border: "#d4b0ff" },
  { name: "Kids Toys", icon: "🧸", color: "#fffae6", border: "#ffedb0" },
];

const HIGHLIGHT_VIDEOS = [
  "/videos/sarvam_cart_video1.mp4",
  "/videos/sarvam_cart_video4.mp4",
  "/videos/sarvam_cart_video3.mp4",
  "/videos/sarvam_cart_video2.mp4",
  "/videos/sarvam_cart_video5.mp4",
  "/videos/sarvam_cart_video6.mp4",
  "/videos/sarvam_cart_video3.mp4",
  "/videos/sarvam_cart_video4.mp4",
];

const bannerImages = [
   "/Images/hero_sec1.jpeg",
   "/Images/hero_sec2.jpeg",
   "/Images/hero_sec3.jpeg",
];

export default function HomePage() {
  const [hlOffset, setHlOffset] = useState(0);
  const [current, setCurrent] = useState(0);

  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [bestSellers, setBestSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading: categoriesLoading } = useSelector((state: RootState) => state.category);

  useEffect(() => {
    if (categories.length === 0 && !categoriesLoading) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length, categoriesLoading]);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === bannerImages.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  // Fetch New Arrivals and Best Sellers
  useEffect(() => {
    async function fetchHomeProducts() {
      try {
        const [naRes, bsRes] = await Promise.all([
          api.get('/product?categoryHandle=new-arrivals&limit=5'),
          api.get('/product?categoryHandle=best-seller&limit=5')
        ]);
        setNewArrivals(naRes.data.data || []);
        setBestSellers(bsRes.data.data || []);
      } catch (err) {
        console.error("Failed to fetch home products", err);
      } finally {
        setLoading(false);
      }
    }
    fetchHomeProducts();
  }, []);

  return (
    <>
      <div className="min-h-screen bg-[#f8fafc] font-sans ">
        <Header />
        <section className="w-full relative overflow-hidden mb-8">
          <div className="relative w-full h-[280px] sm:h-[380px] md:h-[500px] lg:h-[650px]">
            {bannerImages.map((img, i) => (
              <div
                key={i}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  current === i ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={img}
                  alt={`banner-${i}`}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            ))}

            {/* Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {bannerImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`transition-all rounded-full ${
                    current === i ? "w-7 h-2 bg-white" : "w-2 h-2 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <main className="max-w-[1280px] mx-auto px-5 py-6">
          {/* CATEGORIES */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800">
                  Shop by Category
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Find what you're looking for
                </p>
              </div>
              <Link
                href="/all-collections"
                className="flex items-center gap-1 text-sm font-semibold text-[#00A759]"
              >
                View All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {categoriesLoading && categories.length === 0 ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin w-8 h-8 border-4 border-slate-200 border-t-[#00A759] rounded-full"></div>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 sm:gap-6">
                {categories.slice(0, 6).map((cat, i) => (
                  <Link
                    key={cat._id || i}
                    href={`/category?category=${encodeURIComponent(cat.title)}`}
                    className="flex flex-col items-center group bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all cursor-pointer"
                  >
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-3 bg-slate-50 border border-slate-100 overflow-hidden">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="text-2xl sm:text-3xl">📁</div>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-700 text-center leading-tight line-clamp-2">
                      {cat.title}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {/* TODAY'S HIGHLIGHT */}
          <div className="mb-10">
            <h2 className="text-xl font-extrabold text-slate-800 mb-5">
              Today's Highlight
            </h2>
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex gap-3 transition-transform duration-300"
                  style={{ transform: `translateX(-${hlOffset * 152}px)` }}
                >
                  {HIGHLIGHT_VIDEOS.map((src, i) => (
                    <div
                      key={i}
                      className="flex-none w-[200px] h-[300px] rounded-[14px] overflow-hidden border-2 border-[#d1e8ff] cursor-pointer hover:scale-[1.03] transition-transform"
                    >
                      <video
                        src={src}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={() => setHlOffset((o) => Math.max(0, o - 1))}
                className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center"
              >
                ‹
              </button>
              <button
                onClick={() => setHlOffset((o) => Math.min(3, o + 1))}
                className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border border-slate-200 shadow flex items-center justify-center"
              >
                ›
              </button>
            </div>
          </div>
          
          {/* PRODUCTS: New Arrivals */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800">
                  New Arrivals
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fresh drops this week
                </p>
              </div>
              <Link
                href="/category?category=New%20Arrivals"
                className="flex items-center gap-1 text-sm font-semibold text-[#00A759]"
              >
                See All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin w-8 h-8 border-4 border-slate-200 border-t-[#00A759] rounded-full"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {newArrivals.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
          
          {/* TRENDING / Best Seller */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-xl font-extrabold text-slate-800">
                  🔥 Best Sellers
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Most loved by our customers
                </p>
              </div>
              <Link
                href="/category?category=Best%20Seller"
                className="flex items-center gap-1 text-sm font-semibold text-[#00A759]"
              >
                See All <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin w-8 h-8 border-4 border-slate-200 border-t-[#00A759] rounded-full"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {bestSellers.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

/* PRODUCT CARD */
function ProductCard({ product }: { product: any }) {
  const imageUrl = product.images?.[0]?.src || "/images/placeholder.jpg";
  const categoryName = product.categories?.[0]?.title || "Uncategorized";
  
  return (
    <Link href={`/product/${product.shopifyId}`}>
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden cursor-pointer transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-square bg-slate-50">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover"
          />

          {/* {(product.status === "active") && (
            <span className="absolute top-2 left-2 text-[10px] px-2 py-1 rounded bg-[#dff3ea] text-[#00A759] font-bold">
              NEW
            </span>
          )} */}

          <button
            onClick={(e) => e.preventDefault()}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
          >
            <Heart className="w-4 h-4 text-red-500" />
          </button>
        </div>

        <div className="p-3">
          <div className="text-[10px] uppercase text-slate-400 font-semibold truncate">
            {categoryName}
          </div>

          <div className="text-sm font-bold text-slate-800 line-clamp-1">
            {product.title}
          </div>

          <div className="flex justify-between items-center mt-2">
            <div className="font-bold text-slate-800">
              ₹{(product.basePrice || 0).toLocaleString()}
            </div>

            <div className="z-10 mt-1" onClick={(e) => e.preventDefault()}>
              <AddToCartButton 
                product={product} 
                hideLabel={true}
                className="!p-2 h-9 w-20 flex-shrink-0" 
              />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
