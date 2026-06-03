"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { addToCartAsync, updateQuantityAsync, removeFromCartAsync } from "@/store/slices/cartSlice";
import { ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface AddToCartButtonProps {
  product: any;
  variantId?: string;
  className?: string;
  isFullWidth?: boolean;
  hideLabel?: boolean;
}

export default function AddToCartButton({ product, variantId, className = "", isFullWidth = false, hideLabel = false }: AddToCartButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { items } = useSelector((state: RootState) => state.cart);
  const { token } = useSelector((state: RootState) => state.auth);
  const [addedAnimation, setAddedAnimation] = useState(false);
  
  // Try to find if this product is already in the cart
  // Handle case where productId is populated (object) or just an ID (string)
  const cartItem = items.find((item) => {
    const itemId = typeof item.productId === 'object' ? item.productId?._id : item.productId;
    const pId = product._id || product.shopifyId;
    // We match by Mongo _id. But sometimes product from UI only has shopifyId.
    // Ideally we should match by checking both.
    const isIdMatch = itemId === product._id;
    const isShopifyIdMatch = typeof item.productId === 'object' && item.productId?.shopifyId === product.shopifyId;
    return isIdMatch || isShopifyIdMatch;
  });

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      alert("Please login to add items to your cart.");
      router.push("/login");
      return;
    }

    const payload = {
      productId: product._id, // Must be mongo ID, backend needs it. 
      // If we don't have Mongo ID, we might have a problem. Let's assume product._id is available.
      variantId: variantId || product.variants?.[0]?.shopifyVariantId || product.variants?.[0]?._id,
      quantity: 1
    };

    if (!payload.productId) {
      alert("Error: Product ID is missing.");
      return;
    }

    await dispatch(addToCartAsync(payload));
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleUpdateQuantity = async (e: React.MouseEvent, delta: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!cartItem) return;
    
    const newQty = cartItem.quantity + delta;
    if (newQty <= 0) {
      await dispatch(removeFromCartAsync(cartItem._id));
    } else {
      await dispatch(updateQuantityAsync({ cartItemId: cartItem._id, quantity: newQty }));
    }
  };

  if (cartItem) {
    return (
      <div 
        className={`flex items-center justify-between border border-[#00A759] rounded-xl bg-white shadow-sm overflow-hidden ${isFullWidth ? "w-full" : "w-auto"} ${className}`}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        <button
          onClick={(e) => handleUpdateQuantity(e, -1)}
          className="w-10 h-10 flex items-center justify-center text-[#00A759] hover:bg-emerald-50 transition"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="flex-1 text-center font-bold text-sm text-slate-800 font-mono">
          {cartItem.quantity}
        </span>
        <button
          onClick={(e) => handleUpdateQuantity(e, 1)}
          className="w-10 h-10 flex items-center justify-center text-[#00A759] hover:bg-emerald-50 transition"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Not in cart yet
  return (
    <button
      onClick={handleAddToCart}
      className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
        addedAnimation 
          ? "bg-[#00A759] text-white" 
          : "bg-slate-900 text-white hover:bg-slate-800"
      } ${isFullWidth ? "w-full py-3.5" : ""} ${className}`}
    >
      {addedAnimation ? (
        <>
          <Check className="w-4 h-4" />
          {!hideLabel && <span>Added!</span>}
        </>
      ) : (
        <>
          <ShoppingCart className="w-4 h-4" />
          {!hideLabel && <span>Add to Bag</span>}
        </>
      )}
    </button>
  );
}
