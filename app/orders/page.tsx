"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ShoppingBag,
  MapPin,
  Star,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/cartContext";
import { PRODUCTS_CATALOG } from "@/lib/data";
import Header from "@/components/header";
import Footer from "@/components/footer";

// ── Mock orders data ──
const MOCK_ORDERS = [
  {
    id: "SK-2026-0042",
    date: "May 22, 2026",
    status: "delivered",
    total: "$378.00",
    items: [
      { productId: "luxe-minimalist-ceramic-tea-set", quantity: 1 },
      { productId: "minimalist-ceramic-watch", quantity: 1 },
    ],
    address: "Flat 402, Pearl Residency, Surat, Gujarat 395007",
    tracking: "DLH-SKT-9821043",
  },
  {
    id: "SK-2026-0031",
    date: "May 10, 2026",
    status: "shipped",
    total: "₹12,499",
    items: [{ productId: "studio-wireless-pro", quantity: 1 }],
    address: "Flat 402, Pearl Residency, Surat, Gujarat 395007",
    tracking: "MUM-SKT-7762219",
  },
  {
    id: "SK-2026-0019",
    date: "April 28, 2026",
    status: "processing",
    total: "₹17,297",
    items: [
      { productId: "elite-velocity-runner", quantity: 1 },
      { productId: "aviator-classic-series", quantity: 2 },
    ],
    address: "Flat 402, Pearl Residency, Surat, Gujarat 395007",
    tracking: "DEL-SKT-5512804",
  },
  {
    id: "SK-2026-0007",
    date: "April 5, 2026",
    status: "cancelled",
    total: "₹8,499",
    items: [{ productId: "essence-de-nuit-perfume", quantity: 1 }],
    address: "Flat 402, Pearl Residency, Surat, Gujarat 395007",
    tracking: "—",
  },
];

type OrderStatus = "delivered" | "shipped" | "processing" | "cancelled";

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    bg: string;
    icon: React.ReactNode;
    steps: string[];
    currentStep: number;
  }
> = {
  delivered: {
    label: "Delivered",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
    steps: [
      "Order Placed",
      "Confirmed",
      "Dispatched",
      "Out for Delivery",
      "Delivered",
    ],
    currentStep: 4,
  },
  shipped: {
    label: "Out for Delivery",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: <Truck className="w-4 h-4 text-blue-600" />,
    steps: [
      "Order Placed",
      "Confirmed",
      "Dispatched",
      "Out for Delivery",
      "Delivered",
    ],
    currentStep: 3,
  },
  processing: {
    label: "Processing",
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
    icon: <Clock className="w-4 h-4 text-amber-600" />,
    steps: [
      "Order Placed",
      "Confirmed",
      "Dispatched",
      "Out for Delivery",
      "Delivered",
    ],
    currentStep: 1,
  },
  cancelled: {
    label: "Cancelled",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: <XCircle className="w-4 h-4 text-red-500" />,
    steps: ["Order Placed", "Cancelled"],
    currentStep: 1,
  },
};

export default function OrdersPage() {
  const { currentUser, addToCart, showToast } = useCart();
  const [expandedOrder, setExpandedOrder] = useState<string | null>(
    "SK-2026-0042",
  );
  const [filterStatus, setFilterStatus] = useState<"all" | OrderStatus>("all");

  const filteredOrders = MOCK_ORDERS.filter(
    (o) => filterStatus === "all" || o.status === filterStatus,
  );

  const handleReorder = (order: (typeof MOCK_ORDERS)[0]) => {
    order.items.forEach((item) => {
      const product = PRODUCTS_CATALOG.find((p) => p.id === item.productId);
      if (product) addToCart(product, item.quantity);
    });
    showToast(`Reordered ${order.items.length} item(s) — added to your Bag!`);
  };

  // Guest view
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-6 max-w-[1280px] mx-auto px-5 py-6">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
          <Package className="w-8 h-8 text-slate-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Sign in to view your orders
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Your order history is linked to your Sarvam account.
          </p>
        </div>
        <Link href="/signin">
          <button className="px-8 py-3.5 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-[#00A759] hover:text-slate-950 transition">
            Sign In Now
          </button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="space-y-8 max-w-[1280px] mx-auto px-5 py-6 mb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
           
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              My Orders
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Hello,{" "}
              <span className="font-semibold text-slate-700">
                {currentUser.name}
              </span>{" "}
              — {MOCK_ORDERS.length} orders total
            </p>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {(
              [
                "all",
                "delivered",
                "shipped",
                "processing",
                "cancelled",
              ] as const
            ).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition cursor-pointer ${
                  filterStatus === status
                    ? "bg-slate-950 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status === "all" ? "All Orders" : status}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto" />
            <p className="text-sm font-bold text-slate-700">No orders found</p>
            <Link href="/">
              <button className="px-5 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-semibold hover:bg-[#ffa352] hover:text-slate-950 transition">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const config = STATUS_CONFIG[order.status as OrderStatus];
              const isExpanded = expandedOrder === order.id;

              return (
                <motion.div
                  key={order.id}
                  layout
                  className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition"
                >
                  {/* Order Header */}
                  <div
                    className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
                    onClick={() =>
                      setExpandedOrder(isExpanded ? null : order.id)
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                        <Package className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 font-mono">
                            {order.id}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${config.bg} ${config.color}`}
                          >
                            {config.icon}
                            {config.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {order.date} · {order.items.length} item
                          {order.items.length > 1 ? "s" : ""} · {order.total}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      {order.status !== "cancelled" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReorder(order);
                          }}
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-semibold transition"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Reorder</span>
                        </button>
                      )}
                      <button className="p-2 text-slate-400 hover:text-slate-700 transition">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-100 p-5 space-y-6">
                          {/* Tracking Progress */}
                          {order.status !== "cancelled" && (
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold font-mono tracking-widest text-[#00A759] uppercase">
                                Shipment Track
                              </h4>
                              <div className="flex items-center gap-0">
                                {config.steps.map((step, i) => (
                                  <React.Fragment key={step}>
                                    <div className="flex flex-col items-center gap-1.5">
                                      <div
                                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                                          i <= config.currentStep
                                            ? "bg-slate-950 border-slate-950 text-white"
                                            : "bg-white border-slate-200 text-slate-400"
                                        }`}
                                      >
                                        {i <= config.currentStep ? "✓" : i + 1}
                                      </div>
                                      <span
                                        className={`text-[9px] font-medium text-center w-14 leading-tight ${i <= config.currentStep ? "text-slate-700" : "text-slate-400"}`}
                                      >
                                        {step}
                                      </span>
                                    </div>
                                    {i < config.steps.length - 1 && (
                                      <div
                                        className={`flex-1 h-0.5 mb-5 ${i < config.currentStep ? "bg-slate-950" : "bg-slate-200"}`}
                                      />
                                    )}
                                  </React.Fragment>
                                ))}
                              </div>
                              {order.tracking !== "—" && (
                                <p className="text-[10px] text-slate-500 font-mono">
                                  Tracking ID:{" "}
                                  <span className="font-bold text-slate-700">
                                    {order.tracking}
                                  </span>
                                </p>
                              )}
                            </div>
                          )}

                          {/* Order Items */}
                          <div className="space-y-3">
                            <h4 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase">
                              Items Ordered
                            </h4>
                            {order.items.map((item) => {
                              const product = PRODUCTS_CATALOG.find(
                                (p) => p.id === item.productId,
                              );
                              if (!product) return null;
                              return (
                                <div
                                  key={item.productId}
                                  className="flex items-center gap-3 bg-slate-50 rounded-xl p-3"
                                >
                                  <Link href={`/product/${product.id}`}>
                                    <div className="w-14 h-14 bg-white rounded-lg relative overflow-hidden border border-slate-100 cursor-pointer shrink-0">
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
                                    <Link href={`/product/${product.id}`}>
                                      <p className="text-xs font-bold text-slate-900 hover:text-[#ffa352] truncate cursor-pointer">
                                        {product.name}
                                      </p>
                                    </Link>
                                    <p className="text-[10px] text-slate-500">
                                      Qty: {item.quantity} ·{" "}
                                      {product.currency === "USD" ? "$" : "₹"}
                                      {product.price.toLocaleString()}
                                    </p>
                                  </div>
                                  {order.status === "delivered" && (
                                    <button className="flex items-center gap-1 px-2.5 py-1.5 border border-amber-200 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-semibold hover:bg-amber-100 transition whitespace-nowrap">
                                      <Star className="w-3 h-3" />
                                      Rate
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Delivery Address */}
                          <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 rounded-xl p-3">
                            <MapPin className="w-3.5 h-3.5 text-[#00A759] shrink-0 mt-2" />
                            <div>
                              <span className="font-semibold text-slate-800 block">
                                Delivery Address
                              </span>
                              <span className="text-slate-500">
                                {order.address}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
      <Footer/>
    </>
  );
}
