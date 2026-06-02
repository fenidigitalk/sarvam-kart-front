"use client";

import React, { createContext, useContext, useState, useMemo } from 'react';
import { Product } from '@/lib/data';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: Product[];
  currentUser: { name: string; email: string } | null;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  toggleWishlist: (product: Product) => void;
  moveWishlistToCart: (product: Product) => void;
  setCurrentUser: (user: { name: string; email: string } | null) => void;
  totals: { inr: number; usd: number; itemCount: number };
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

import { PRODUCTS_CATALOG, WISHLIST_PRESETS } from '@/lib/data';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([
    {
      product: PRODUCTS_CATALOG.find(p => p.id === 'minimalist-ceramic-watch')!,
      quantity: 1
    },
    {
      product: PRODUCTS_CATALOG.find(p => p.id === 'studio-bass-headphones')!,
      quantity: 1
    }
  ]);
  const [wishlist, setWishlist] = useState<Product[]>(WISHLIST_PRESETS);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added "${product.name}" to your Bag`);
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find(i => i.product.id === productId);
    if (item) {
      setCart(prev => prev.filter(i => i.product.id !== productId));
      showToast(`Removed "${item.product.name}" from Cart`);
    }
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const nextQ = item.quantity + delta;
          return { ...item, quantity: nextQ < 1 ? 1 : nextQ };
        }
        return item;
      })
    );
  };

  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some(item => item.id === product.id);
    if (exists) {
      setWishlist(prev => prev.filter(item => item.id !== product.id));
      showToast(`Removed "${product.name}" from Wishlist`);
    } else {
      setWishlist(prev => [...prev, product]);
      showToast(`Added "${product.name}" to Wishlist`);
    }
  };

  const moveWishlistToCart = (product: Product) => {
    addToCart(product, 1);
    setWishlist(prev => prev.filter(item => item.id !== product.id));
  };

  const clearCart = () => setCart([]);

  const totals = useMemo(() => {
    let inr = 0, usd = 0;
    cart.forEach(item => {
      if (item.product.currency === 'USD') usd += item.product.price * item.quantity;
      else inr += item.product.price * item.quantity;
    });
    return { inr, usd, itemCount: cart.reduce((acc, c) => acc + c.quantity, 0) };
  }, [cart]);

  return (
    <CartContext.Provider value={{
      cart, wishlist, currentUser, addToCart, removeFromCart,
      updateQuantity, toggleWishlist, moveWishlistToCart,
      setCurrentUser, totals, toastMessage, showToast, clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}