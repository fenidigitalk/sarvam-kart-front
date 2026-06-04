"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  X,
  Heart,
  ChevronRight,
  Check,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { addToCartAsync, removeFromCartAsync, updateQuantityAsync, fetchCartAsync, clearCartState, toggleWishlist } from "@/store/slices/cartSlice";
import { checkoutOrderAsync } from "@/store/slices/orderSlice";

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: cart, wishlist, totalQuantity, totalPrice } = useSelector((state: RootState) => state.cart);
  const { token } = useSelector((state: RootState) => state.auth);

  const totals = {
    itemCount: cart.length,
    inr: totalPrice,
    usd: 0 // Simplification for now
  };

  const showToast = (msg: string) => alert(msg); // Temporary fallback for showToast

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [activeTab, setActiveTab] = useState<"bag" | "wishlist">("bag");

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showToast("Shopping Bag is empty!");
      return;
    }
    const result = await dispatch(checkoutOrderAsync());
    if (checkoutOrderAsync.fulfilled.match(result)) {
      setOrderPlaced(true);
      dispatch(clearCartState());
      showToast("Order placed successfully!");
    } else {
      showToast(result.payload as string || "Failed to place order.");
    }
  };

  return (
    <>
      <Header />
      <div className="space-y-8 max-w-[1280px] mx-auto px-5 py-6 mb-10">
        {/* Tab Row */}
        <div className="flex border-b border-slate-200 gap-8 text-sm text-slate-500 pb-3">
          <button
            onClick={() => setActiveTab("bag")}
            className={`pb-3 font-bold text-lg relative cursor-pointer flex items-center gap-1.5 transition-colors ${activeTab === "bag" ? "text-slate-900" : "text-slate-400 hover:text-slate-900"}`}
          >
            <span>Shopping Bag</span>
            <span className="text-xs bg-slate-950 text-white px-2 py-0.5 rounded-full font-mono">
              {totals.itemCount}
            </span>
            {activeTab === "bag" && (
              <motion.div
                layoutId="cart-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900"
              />
            )}
          </button>
         
        </div>

        <AnimatePresence mode="wait">
          {/* ── ORDER PLACED SUCCESS ── */}
          {orderPlaced && (
            <motion.div
              key="order-success"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-emerald-50 border border-emerald-200/60 p-8 sm:p-12 text-center rounded-3xl space-y-4 max-w-lg mx-auto"
            >
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Check className="w-8 h-8 font-bold" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Your Premium Order has been Placed!
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                A secure token has been parsed. We are packing your curated
                delivery from Sarvam Delhi logistics bay. Check your email for
                track-codes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    dispatch(clearCartState());
                    setOrderPlaced(false);
                  }}
                  className="px-6 py-3 bg-slate-950 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-800 transition"
                >
                  Return to Home
                </button>
                <Link href="/orders">
                  <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer hover:bg-slate-50 transition">
                    View My Orders
                  </button>
                </Link>
              </div>
            </motion.div>
          )}

          {/* ── SHOPPING BAG TAB ── */}
          {!orderPlaced && activeTab === "bag" && (
            <motion.div
              key="bag-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col lg:flex-row gap-8"
            >
              {/* Cart Items */}
              <div className="flex-1 space-y-4">
                {cart.length === 0 ? (
                  <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 space-y-4">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                    <h4 className="text-sm font-bold text-slate-800">
                      Your Shopping Bag is empty
                    </h4>
                    <p className="text-xs text-slate-500">
                      Discover new curations on our home runway.
                    </p>
                    <Link href="/category">
                      <button className="mt-2 px-5 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-[#00A759] hover:text-slate-950 transition">
                        Explore Collections
                      </button>
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition duration-300"
                    >
                      <Link href={`/product/${item.productId?.shopifyId || item.productId?._id}`}>
                        <div className="w-20 h-20 bg-slate-50 rounded-xl relative cursor-pointer overflow-hidden shrink-0 border border-slate-100">
                          <Image
                            src={item.productId?.images?.[0]?.src || "/images/placeholder.jpg"}
                            alt={item.title}
                            fill
                            className="object-cover hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </Link>

                      <div className="flex-1 min-w-0 space-y-1">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-slate-400">
                          {item.productId?.category || "Category"}
                        </span>
                        <Link href={`/product/${item.productId?.shopifyId || item.productId?._id}`}>
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 hover:text-[#00A759] cursor-pointer">
                            {item.title}
                          </h4>
                        </Link>
                        <div className="text-xs font-mono font-bold text-slate-800">
                          ₹{item.price.toLocaleString()}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {item.sku}
                        </span>
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                        <button
                          onClick={() => {
                            if (item.quantity - 1 <= 0) {
                              dispatch(removeFromCartAsync(item._id));
                            } else {
                              dispatch(updateQuantityAsync({ cartItemId: item._id, quantity: item.quantity - 1 }));
                            }
                          }}
                          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white rounded-lg transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-mono text-xs font-bold text-slate-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => dispatch(updateQuantityAsync({ cartItemId: item._id, quantity: item.quantity + 1 }))}
                          className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-white rounded-lg transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="hidden sm:block text-right">
                        <span className="text-sm font-mono font-bold text-slate-800">
                          ₹
                          {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => dispatch(removeFromCartAsync(item._id))}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="w-full lg:w-80 space-y-4">
                <div className="bg-white border border-slate-100 p-6 rounded-2xl space-y-4 shadow-sm sticky top-24">
                  <h4 className="text-xs font-bold font-mono tracking-widest text-[#00A759] uppercase">
                    Secure Checkout
                  </h4>

                  <div className="space-y-3.5 text-xs text-slate-600">
                    {totals.inr > 0 && (
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span>Boutique Subtotal (INR):</span>
                        <span className="font-mono font-bold text-slate-800">
                          ₹{totals.inr.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                    {totals.usd > 0 && (
                      <div className="flex justify-between border-b border-slate-50 pb-2">
                        <span>Luxe Subtotal (USD):</span>
                        <span className="font-mono font-bold text-slate-800">
                          ${totals.usd.toLocaleString()}
                        </span>
                      </div>
                    )}

                    <div className="pt-4 border-t border-slate-100 flex justify-between items-baseline">
                      <span className="text-sm font-bold text-slate-950">
                        Grand Total:
                      </span>
                      <div className="text-right">
                        {totals.inr > 0 && (
                          <p className="text-lg font-mono font-extrabold text-slate-900">
                            ₹
                            {totals.inr.toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        )}
                        {totals.usd > 0 && (
                          <p className="text-lg font-mono font-extrabold text-slate-900">
                            ${totals.usd.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleCheckout}
                      className="w-full bg-slate-950 text-white font-bold py-3.5 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2 hover:bg-[#00A759] hover:text-slate-950 shadow-md active:scale-95"
                    >
                      <span>Confirm Curated Checkout</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="flex items-center justify-center gap-2 p-3 bg-slate-50 text-slate-400 text-[10px] rounded-lg">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      <span>Encrypted over TLS v1.3</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── WISHLIST TAB ── */}
          {/* {!orderPlaced && activeTab === "wishlist" && (
            <motion.div
              key="wishlist-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {wishlist.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 space-y-4">
                  <Heart className="w-12 h-12 text-slate-200 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-800">
                    Your Wishlist is empty
                  </h4>
                  <p className="text-xs text-slate-500">
                    Tap the heart icon on any product to save it here.
                  </p>
                  <Link href="/categories">
                    <button className="mt-2 px-5 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-[#ffa352] hover:text-slate-950 transition">
                      Browse Boutique
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlist.map((product) => (
                    <motion.div
                      key={product.shopifyId || product._id || product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-lg transition group"
                    >
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
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (!token) return alert("Please login first");
                              dispatch(addToCartAsync({ 
                                productId: product._id || product.id, 
                                variantId: product.variants?.[0]?.shopifyVariantId || product.variants?.[0]?._id || "default", 
                                quantity: 1 
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
                </div>
              )}
            </motion.div>
          )} */}
        </AnimatePresence>
      </div>
      <Footer/>
    </>
  );
}
