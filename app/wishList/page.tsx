"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, X, Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  addToCartAsync,
  toggleWishlist,
} from "@/store/slices/cartSlice";

export default function WishlistPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { wishlist } = useSelector((state: RootState) => state.cart);
  const { token } = useSelector((state: RootState) => state.auth);

  return (
    <>
      <Header />
      <div className="max-w-[1280px] mx-auto px-5 py-6 mb-10 space-y-8">

        {/* ── Page Heading ── */}
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <h1 className="text-lg font-bold text-slate-900">Saved Desires</h1>
          <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full font-mono">
            {wishlist.length}
          </span>
        </div>

        <AnimatePresence mode="wait">
          {wishlist.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white p-12 text-center rounded-2xl border border-slate-100 space-y-4"
            >
              <Heart className="w-12 h-12 text-slate-200 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">
                Your Wishlist is empty
              </h4>
              <p className="text-xs text-slate-500">
                Tap the heart icon on any product to save it here.
              </p>
              <Link href="/category">
                <button className="mt-2 px-5 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-[#00A759] hover:text-slate-950 transition">
                  Browse Boutique
                </button>
              </Link>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              <AnimatePresence>
                {wishlist.map((product) => (
                  <motion.div
                    key={product.shopifyId || product._id || product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition group"
                  >
                    {/* Product Image */}
                    <Link href={`/product/${product.shopifyId || product._id || product.id}`}>
                      <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden cursor-pointer">
                        <Image
                          src={product.images?.[0]?.src || product.image || "/images/placeholder.jpg"}
                          alt={product.title || product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="p-4 space-y-3">
                      <div>
                        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400 block">
                          {product.category || product.categories?.[0]?.title || "Category"}
                        </span>
                        <Link href={`/product/${product.shopifyId || product._id || product.id}`}>
                          <h4 className="text-sm font-bold text-slate-900 hover:text-[#00A759] cursor-pointer truncate">
                            {product.title || product.name}
                          </h4>
                        </Link>
                        <span className="text-sm font-mono font-bold text-slate-800 mt-1 block">
                          ₹{(product.basePrice || product.price || 0).toLocaleString()}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (!token) return alert("Please login first");
                            dispatch(addToCartAsync({
                              productId: product._id || product.id,
                              variantId:
                                product.variants?.[0]?.shopifyVariantId ||
                                product.variants?.[0]?._id ||
                                "default",
                              quantity: 1,
                            }));
                            dispatch(toggleWishlist(product));
                          }}
                          className="flex-1 px-3 py-2 bg-slate-900 hover:bg-[#00A759] hover:text-slate-950 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Move to Bag</span>
                        </button>
                        <button
                          onClick={() => dispatch(toggleWishlist(product))}
                          className="p-2 border border-red-100 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
      <Footer />
    </>
  );
}