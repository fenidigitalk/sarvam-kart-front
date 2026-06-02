"use client";

import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  Heart,
  Star,
  ShoppingBag,
  ShieldCheck,
  Plus,
  Minus,
  Check,
  Truck,
  Award,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PRODUCTS_CATALOG } from "@/lib/data";
import { useCart } from "@/context/cartContext";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, toggleWishlist, wishlist } = useCart();

  const product = useMemo(
    () => PRODUCTS_CATALOG.find((p) => p.id === id) || PRODUCTS_CATALOG[0],
    [id],
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedThumbIndex, setSelectedThumbIndex] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "shipping"
  >("description");
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const related = PRODUCTS_CATALOG.filter(
    (p) =>
      p.id !== product.id &&
      (p.category === product.category ||
        p.category === "Home Decor" ||
        p.category === "Kitchen Essentials"),
  ).slice(0, 5);

  const currentImage =
    selectedThumbIndex >= 0 && product.thumbnails?.[selectedThumbIndex]
      ? product.thumbnails[selectedThumbIndex]
      : product.image;

  return (
    <>
      <Header />
      <div className="space-y-12 max-w-[1280px] mx-auto px-5 py-6 mb-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 flex-wrap">
          <Link href="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/" className="hover:text-blue-600 transition">
            New Arrivals
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700 font-medium">{product.name}</span>
        </nav>

        {/* Main Product Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 lg:p-12 flex flex-col lg:flex-row gap-12">
          {/* LEFT: Image Gallery */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div className="flex gap-3">
              {/* Left vertical thumbnails */}
              <div className="flex flex-col gap-3 w-[72px] shrink-0">
                <button
                  onClick={() => setSelectedThumbIndex(-1)}
                  className={`w-[72px] h-[72px] bg-[#00A759] rounded-xl overflow-hidden relative border-2 transition shrink-0 ${
                    selectedThumbIndex === -1
                      ? "border-[#00A759]"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={product.image}
                    alt="Primary"
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
                {product.thumbnails?.map((thumb, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedThumbIndex(i)}
                    className={`w-[72px] h-[72px] bg-[#00A759] rounded-xl overflow-hidden relative border-2 transition shrink-0 ${
                      selectedThumbIndex === i
                        ? "border-[#00A759]"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={thumb}
                      alt={`View ${i + 1}`}
                      fill
                      className="object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>

              {/* Main image */}
              <motion.div
                key={currentImage}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative flex-1 aspect-square bg-blue-50 rounded-2xl overflow-hidden border border-blue-100 group"
              >
                <Image
                  src={currentImage}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                  priority
                />
                {product.tag && (
                  <span className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 text-xs font-mono font-bold uppercase rounded-lg tracking-wider">
                    {product.tag}
                  </span>
                )}
              </motion.div>
            </div>

            {/* Trust Badge */}
            {/* <div className="p-4 bg-blue-50 rounded-xl text-xs text-blue-700 border border-blue-100 flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>
                Import Certified. This batch meets the high premium standard
                guidelines.
              </span>
            </div> */}
          </div>

          {/* RIGHT: Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Brand */}
              <span className="text-xs font-bold font-mono tracking-widest text-[#00A759] block uppercase">
                {product.brand || "ATELIER SARVAM"}
              </span>

              {/* Name */}
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <Star className="w-4 h-4 text-slate-200 fill-current" />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {product.rating || "4.8"} · 120 ratings
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-mono font-bold text-slate-950">
                  {product.currency === "USD" ? "$" : "₹"}
                  {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-sm text-slate-400 line-through font-mono">
                      {product.currency === "USD" ? "$" : "₹"}
                      {product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-bold font-mono">
                      {Math.round(
                        (1 - product.price / product.originalPrice) * 100,
                      )}
                      % OFF
                    </span>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm text-slate-500">Brand</span>
                  <span className="font-medium text-slate-900">
                    {product.brand || "Sarvam"}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-sm text-slate-500">Category</span>
                  <span className="font-medium text-slate-900">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Stock indicator */}
              <div className="flex items-center gap-1.5 text-xs text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium">
                  In Stock — Ready to dispatch
                </span>
              </div>

              {/* Quantity + CTA */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
                  <button
                    onClick={() => setQuantity((q) => (q > 1 ? q - 1 : 1))}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 font-mono font-bold text-center text-xs text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 font-bold py-3.5 px-6 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2.5 bg-[#00A759] min-w-[180px] shadow-lg ${addedAnimation ? "bg-[#00A759] text-white" : "bg[#00A759] hover:bg-[#008a4d] text-white"}`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Shopping Bag</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-3.5 border rounded-xl transition ${isWishlisted ? "border-red-500 bg-red-50 text-red-500" : "border-slate-200 text-slate-400 hover:bg-slate-50 hover:border-slate-300"}`}
                  title={
                    isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"
                  }
                >
                  <Heart
                    className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            </div>

            {/* SKU Info */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs border-t border-slate-100 pt-4">
              {[
                ["SKU", "N/A"],
                ["Available", "Instock"],
                ["Vendor", "Mysarvamcart"],
                ["Collections", "Bathroom Accessories, New Arrivals"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  className="flex justify-between border-b border-slate-50 py-1.5"
                >
                  <span className="text-slate-400 font-mono">{k}:</span>
                  <span className="text-slate-800 font-medium text-right">
                    {v}
                  </span>
                </div>
              ))}
            </div>

            {/* Description only */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                Description
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-light">
                {product.description ||
                  "Crafted to meet raw modern aesthetics and premium luxury. This select drop focuses on material purity, design-led geometry, and absolute durability."}
              </p>
              {product.bulletPoints && (
                <ul className="list-disc pl-4 space-y-1.5 pt-1 text-xs text-slate-600">
                  {product.bulletPoints.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900">
                Complementary Additions
              </h3>
              <p className="text-xs text-slate-500">
                Perfect styling companions for this drop
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/product/${item.id}`}
                  className="group bg-white rounded-2xl border border-slate-100 p-3 hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div className="aspect-square bg-blue-50 rounded-xl overflow-hidden relative">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="pt-3 space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 line-clamp-1">
                      {item.name}
                    </h4>
                    <span className="text-xs font-mono font-semibold text-slate-500">
                      {item.currency === "USD" ? "$" : "₹"}
                      {item.price.toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}