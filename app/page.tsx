"use client";

import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { PRODUCTS_CATALOG } from "@/lib/data";
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
  const [heroIdx, setHeroIdx] = useState(0);
  const heroImages = PRODUCTS_CATALOG.slice(0, 5);

  useEffect(() => {
    const t = setInterval(
      () => setHeroIdx((i) => (i + 1) % heroImages.length),
      3000,
    );
    return () => clearInterval(t);
  }, []);

  const newArrivals = PRODUCTS_CATALOG.slice(0, 5);
  const trending = PRODUCTS_CATALOG.slice(5, 10);
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === bannerImages.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
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
          {/* HERO */}
          {/* <div className="relative flex justify-between items-center overflow-hidden rounded-[20px] px-14 py-12 min-h-[280px] mb-8 bg-[#00A759]">
            <div className="absolute -right-10 -top-10 w-[300px] h-[300px] rounded-full bg-[rgba(255,107,53,0.08)]" />
            <div className="absolute right-[60px] -bottom-[60px] w-[200px] h-[200px] rounded-full bg-[rgba(255,163,82,0.06)]" />

            <div className="relative z-10 max-w-[500px]">
              <div className="inline-flex items-center gap-1 bg-white/10 border border-white/20 border border-[rgba(255,107,53,0.3)] rounded-full px-3 py-1 mb-4">
                <Zap className="w-3 h-3 text-[#ffa352]" />
                <span className="text-[11px] font-bold tracking-widest text-[#ffff]">
                  NEW ARRIVALS DROP
                </span>
              </div>

              <h1 className="text-[42px] font-black text-white leading-[1.1] mb-4 font-serif">
                Premium Quality,
                <br />
                <span className="text-#ffff">Unbeatable Prices</span>
              </h1>

              <p className="text-sm text-white mb-7 leading-6">
                Discover 1000+ curated products across 40+ categories. From
                fashion to electronics, we've got everything you need.
              </p>

              <div className="flex gap-3">
                <Link href="/category">
                  <button className="bg-white/10 border border-white/20 text-white px-7 py-3 rounded-xl text-sm font-bold  hover:-translate-y-0.5 transition">
                    Shop Now →
                  </button>
                </Link>

                <Link href="/boutique">
                  <button className="bg-white/10 border border-white/20 text-white px-7 py-3 rounded-xl text-sm font-semibold hover:bg-white/15 transition">
                    Browse Categories
                  </button>
                </Link>
              </div>
            </div>

            <div className="relative z-10 w-[350px]">
             
              <div className="relative w-[340px] h-[240px] rounded-[20px] overflow-hidden border-[3px] border-[rgba(255,163,82,0.3)] shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                {heroImages.map((p, i) => (
                  <div
                    key={p.id}
                    className={`absolute inset-0 transition-opacity duration-600 ${i === heroIdx ? "opacity-100" : "opacity-0"}`}
                  >
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex justify-center gap-1.5 mt-3">
                {heroImages.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroIdx(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === heroIdx ? "w-4 bg-white" : "w-1.5 bg-white/40"}`}
                  />
                ))}
              </div>
            </div>
          </div> */}

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

            <div className="grid grid-cols-6 gap-3">
              {FEATURED_CATEGORIES.map((cat, i) => (
                <Link
                  key={i}
                  href={`/category?category=${encodeURIComponent(cat.name)}`}
                >
                  <div
                    className="rounded-2xl text-center p-5 cursor-pointer transition hover:-translate-y-1 hover:shadow-lg"
                    style={{
                      background: cat.color,
                      border: `1.5px solid ${cat.border}`,
                    }}
                  >
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <div className="text-xs font-bold text-slate-700">
                      {cat.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
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
          {/* TRUST BADGES */}
          {/* <div className="grid grid-cols-4 gap-3 mb-9">
            {[
              {
                icon: Truck,
                title: "Free Delivery",
                desc: "On orders above ₹499",
                color: "#ff6b35",
              },
              {
                icon: ShieldCheck,
                title: "100% Authentic",
                desc: "Certified genuine products",
                color: "#22c55e",
              },
              {
                icon: Award,
                title: "Easy Returns",
                desc: "7-day return policy",
                color: "#f59e0b",
              },
              {
                icon: Zap,
                title: "Fast Support",
                desc: "24/7 customer service",
                color: "#6366f1",
              },
            ].map((x, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-5 py-4 shadow-sm"
              >
                <x.icon className="w-5 h-5" style={{ color: x.color }} />
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    {x.title}
                  </div>
                  <div className="text-xs text-slate-400">{x.desc}</div>
                </div>
              </div>
            ))}
          </div> */}
          {/* PRODUCTS */}
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
            </div>

            <div className="grid grid-cols-5 gap-4">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
          {/* TRENDING */}
          <div className="mb-10">
            <h2 className="text-xl font-extrabold text-slate-800 mb-5">
              🔥 Trending Now
            </h2>

            <div className="grid grid-cols-5 gap-4">
              {trending.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}

/* PRODUCT CARD */
function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/product/${product.id}`}>
      <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden cursor-pointer transition hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-square bg-slate-50">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />

          {(product.badge || product.tag) && (
            <span className="absolute top-2 left-2 text-[10px] px-2 py-1 rounded bg-[#dff3ea] text-[#00A759] font-bold">
              {product.badge || product.tag}
            </span>
          )}

          <button
            onClick={(e) => e.preventDefault()}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
          >
            <Heart className="w-4 h-4 text-red-500" />
          </button>
        </div>

        <div className="p-3">
          <div className="text-[10px] uppercase text-slate-400 font-semibold">
            {product.category}
          </div>

          <div className="text-sm font-bold text-slate-800 line-clamp-1">
            {product.name}
          </div>

          {product.rating && (
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              {product.rating}
            </div>
          )}

          <div className="flex justify-between items-center mt-2">
            <div className="font-bold text-slate-800">
              {product.currency === "USD" ? "$" : "₹"}
              {product.price.toLocaleString()}
            </div>

            <button
              onClick={(e) => e.preventDefault()}
              className="bg-[#00A759] hover:bg-[#008c4a] text-white p-2 rounded-lg"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
