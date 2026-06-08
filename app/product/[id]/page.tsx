"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { api } from "@/lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  addToCartAsync,
  updateQuantityAsync,
  removeFromCartAsync,
  toggleWishlistAsync,
  fetchWishlistAsync
} from "@/store/slices/cartSlice";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const { items: cartItems, wishlist } = useSelector(
    (state: RootState) => state.cart,
  );
  const { token } = useSelector((state: RootState) => state.auth);

  const [product, setProduct] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [selectedThumbIndex, setSelectedThumbIndex] = useState<number>(-1);
  const [activeTab, setActiveTab] = useState<
    "description" | "specifications" | "shipping"
  >("description");
  const [addedAnimation, setAddedAnimation] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/product/${id}`);
        const data = res.data.data;

        const variant = data.variants?.[0] || {};
        const mainImage = data.images?.[0]?.src || "";
        const thumbnails = data.images?.map((img: any) => img.src) || [];

        const adapted = {
          id: data._id,
          _id: data._id,
          shopifyId: data.shopifyId,
          variants: data.variants,
          name: data.title,
          price: data.basePrice || variant.price || 0,
          originalPrice:
            variant.compareAtPrice > (data.basePrice || variant.price)
              ? variant.compareAtPrice
              : null,
          currency: "INR",
          category: data.categories?.length
            ? data.categories.map((c: any) => c.title).join(", ")
            : data.tags?.[0] || "General",
          brand: data.vendor,
          tag: "",
          image: mainImage,
          thumbnails: thumbnails,
          rating: 4.8,
          descriptionHtml: data.description || "",
          sku: variant.sku || "N/A",
        };
        setProduct(adapted);

        if (data.categories?.length > 0) {
          try {
            const relRes = await api.get("/product", {
              params: {
                categoryId: data.categories[0]._id || data.categories[0],
                limit: 5,
              },
            });
            const filtered = relRes.data.data
              .filter(
                (p: any) =>
                  p._id !== data._id && p.shopifyId !== data.shopifyId,
              )
              .slice(0, 4);
            setRelated(filtered);
          } catch (err) {
            console.error("Failed to fetch related", err);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const isWishlisted = product
    ? wishlist.some(
        (item) =>
          (item._id || item.shopifyId || item.id) ===
          (product._id || product.shopifyId || product.id),
      )
    : false;

  // Find if product is in cart
  const cartItem = cartItems.find((item) => {
    if (!product) return false;
    const itemId =
      typeof item.productId === "object" ? item.productId?._id : item.productId;
    const isIdMatch = itemId === product._id;
    const isShopifyIdMatch =
      typeof item.productId === "object" &&
      item.productId?.shopifyId === product.shopifyId;
    return isIdMatch || isShopifyIdMatch;
  });

  const handleAddToCart = async () => {
    if (!product) return;
    
    const payload = {
      productId: product._id,
      variantId:
        product.variants?.[0]?.shopifyVariantId ||
        product.variants?.[0]?._id ||
        "default",
      quantity: quantity,
    };

    if (!token) {
      sessionStorage.setItem("pendingAction", JSON.stringify({ type: "cart", payload, returnUrl: window.location.pathname }));
      router.push("/signin");
      return;
    }

    await dispatch(addToCartAsync(payload));
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleUpdateQuantity = async (delta: number) => {
    if (!cartItem) return;
    const newQty = cartItem.quantity + delta;
    if (newQty <= 0) {
      await dispatch(removeFromCartAsync(cartItem._id));
    } else {
      await dispatch(
        updateQuantityAsync({ cartItemId: cartItem._id, quantity: newQty }),
      );
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A759]"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center text-slate-500">
          Product not found
        </div>
        <Footer />
      </>
    );
  }

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
              {/* <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                  <Star className="w-4 h-4 text-slate-200 fill-current" />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  {product.rating || "4.8"} · 120 ratings
                </span>
              </div> */}

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
                <span className="font-medium">In Stock</span>
              </div>

              {/* Quantity + CTA */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {!cartItem ? (
                  <>
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
                      className={`flex-1 font-bold py-3.5 px-6 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-2.5 shadow-lg ${addedAnimation ? "bg-[#00A759] text-white" : "bg-slate-900 hover:bg-slate-800 text-white"}`}
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
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-between border-2 border-[#00A759] rounded-xl bg-emerald-50 shadow-sm overflow-hidden py-1 px-2">
                    <button
                      onClick={() => handleUpdateQuantity(-1)}
                      className="w-12 h-10 flex items-center justify-center text-[#00A759] hover:bg-[#00A759] hover:text-white rounded-lg transition"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                        In Bag
                      </span>
                      <span className="font-mono font-bold text-xl text-slate-900">
                        {cartItem.quantity}
                      </span>
                    </div>
                    <button
                      onClick={() => handleUpdateQuantity(1)}
                      className="w-12 h-10 flex items-center justify-center text-[#00A759] hover:bg-[#00A759] hover:text-white rounded-lg transition"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                )}

                <button
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (!token) {
                      sessionStorage.setItem("pendingAction", JSON.stringify({ type: "wishlist", payload: product._id || product.shopifyId || product.id, returnUrl: window.location.pathname }));
                      router.push("/signin");
                      return;
                    }
                    await dispatch(toggleWishlistAsync(product._id || product.shopifyId || product.id));
                    if (!isWishlisted) {
                      toast.success("Added to Wishlist");
                      dispatch(fetchWishlistAsync());
                    }
                    else toast.info("Removed from Wishlist");
                  }}
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
                // ["SKU", product.sku],
                ["Available", "Instock"],
                ["Vendor", product.brand],
                ["Collections", product.category],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-slate-50 py-1.5">
                  <span className="text-slate-400 font-mono">{k}:</span>
                  <span className="text-slate-800 font-medium text-right">
                    {v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Full Width Description */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 lg:p-12">
          <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">
            Product Description
          </h3>
          <div
            className="text-sm md:text-base text-slate-700 leading-relaxed font-normal prose prose-base prose-slate max-w-none prose-p:mb-4 prose-ul:list-disc prose-ul:ml-6 prose-ul:my-4 prose-li:my-2"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
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
                  key={item._id || item.shopifyId}
                  href={`/product/${item.shopifyId || item._id}`}
                  className="group bg-white rounded-2xl border border-slate-100 p-3 hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div className="aspect-square bg-blue-50 rounded-xl overflow-hidden relative">
                    <Image
                      src={item.images?.[0]?.src || "/images/placeholder.jpg"}
                      alt={item.title || item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="pt-3 space-y-1">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 line-clamp-1">
                      {item.title || item.name}
                    </h4>
                    <span className="text-xs font-mono font-semibold text-slate-500">
                      ₹
                      {(
                        item.basePrice ||
                        item.variants?.[0]?.price ||
                        0
                      ).toLocaleString()}
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
