// "use client";

// import React, { useState } from "react";
// import { motion, AnimatePresence } from "motion/react";
// import {
//   Package,
//   Truck,
//   CheckCircle,
//   Clock,
//   XCircle,
//   ChevronDown,
//   ChevronUp,
//   ArrowLeft,
//   ShoppingBag,
//   MapPin,
//   Star,
//   RefreshCw,
// } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "@/store/store";
// import { addToCartAsync } from "@/store/slices/cartSlice";
// import { toast } from "sonner";
// import { PRODUCTS_CATALOG } from "@/lib/data";
// import Header from "@/components/header";
// import Footer from "@/components/footer";

// import { fetchMyOrdersAsync } from "@/store/slices/orderSlice";
// import { useEffect } from "react";

// type OrderStatus = "delivered" | "shipped" | "processing" | "cancelled" | "pending" | "completed";

// const STATUS_CONFIG: Record<
//   OrderStatus,
//   {
//     label: string;
//     color: string;
//     bg: string;
//     icon: React.ReactNode;
//     steps: string[];
//     currentStep: number;
//   }
// > = {
//   delivered: {
//     label: "Delivered",
//     color: "text-emerald-700",
//     bg: "bg-emerald-50 border-emerald-200",
//     icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
//     steps: [
//       "Order Placed",
//       "Confirmed",
//       "Dispatched",
//       "Out for Delivery",
//       "Delivered",
//     ],
//     currentStep: 4,
//   },
//   completed: {
//     label: "Delivered",
//     color: "text-emerald-700",
//     bg: "bg-emerald-50 border-emerald-200",
//     icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
//     steps: [
//       "Order Placed",
//       "Confirmed",
//       "Dispatched",
//       "Out for Delivery",
//       "Delivered",
//     ],
//     currentStep: 4,
//   },
//   shipped: {
//     label: "Out for Delivery",
//     color: "text-blue-700",
//     bg: "bg-blue-50 border-blue-200",
//     icon: <Truck className="w-4 h-4 text-blue-600" />,
//     steps: [
//       "Order Placed",
//       "Confirmed",
//       "Dispatched",
//       "Out for Delivery",
//       "Delivered",
//     ],
//     currentStep: 3,
//   },
//   processing: {
//     label: "Processing",
//     color: "text-amber-700",
//     bg: "bg-amber-50 border-amber-200",
//     icon: <Clock className="w-4 h-4 text-amber-600" />,
//     steps: [
//       "Order Placed",
//       "Confirmed",
//       "Dispatched",
//       "Out for Delivery",
//       "Delivered",
//     ],
//     currentStep: 1,
//   },
//   pending: {
//     label: "Processing",
//     color: "text-amber-700",
//     bg: "bg-amber-50 border-amber-200",
//     icon: <Clock className="w-4 h-4 text-amber-600" />,
//     steps: [
//       "Order Placed",
//       "Confirmed",
//       "Dispatched",
//       "Out for Delivery",
//       "Delivered",
//     ],
//     currentStep: 1,
//   },
//   cancelled: {
//     label: "Cancelled",
//     color: "text-red-700",
//     bg: "bg-red-50 border-red-200",
//     icon: <XCircle className="w-4 h-4 text-red-500" />,
//     steps: ["Order Placed", "Cancelled"],
//     currentStep: 1,
//   },
// };

// export default function OrdersPage() {
//   const dispatch = useDispatch<AppDispatch>();
//   const { user: currentUser } = useSelector((state: RootState) => state.auth);
//   const { myOrders, loading } = useSelector((state: RootState) => state.order);

//   useEffect(() => {
//     if (currentUser) {
//       dispatch(fetchMyOrdersAsync());
//     }
//   }, [currentUser, dispatch]);

//   const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
//   const [filterStatus, setFilterStatus] = useState<"all" | OrderStatus>("all");

//   const filteredOrders = myOrders.filter(
//     (o) => filterStatus === "all" || o.orderStatus === filterStatus,
//   );

//   const handleReorder = async (order: any) => {
//     for (const item of order.items) {
//       const product = PRODUCTS_CATALOG.find((p) => p.id === item.productId);
//       if (product) {
//         await dispatch(addToCartAsync({
//           productId: product.id,
//           variantId: "default",
//           quantity: item.quantity
//         }));
//       }
//     }
//     toast.success(`Reordered ${order.items.length} item(s) — added to your Bag!`);
//   };

//   // Guest view
//   if (!currentUser) {
//     return (
//       <div className="max-w-md mx-auto py-20 text-center space-y-6 max-w-[1280px] mx-auto px-5 py-6">
//         <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
//           <Package className="w-8 h-8 text-slate-400" />
//         </div>
//         <div>
//           <h2 className="text-xl font-bold text-slate-900">
//             Sign in to view your orders
//           </h2>
//           <p className="text-xs text-slate-500 mt-2">
//             Your order history is linked to your Sarvam account.
//           </p>
//         </div>
//         <Link href="/signin">
//           <button className="px-8 py-3.5 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-[#00A759] hover:text-slate-950 transition">
//             Sign In Now
//           </button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Header />
//       <div className="space-y-8 max-w-[1280px] mx-auto px-5 py-6 mb-10">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div>

//             <h1 className="text-2xl font-bold tracking-tight text-slate-900">
//               My Orders
//             </h1>
//             <p className="text-xs text-slate-500 mt-1">
//               Hello,{" "}
//               <span className="font-semibold text-slate-700">
//                 {currentUser.fullName}
//               </span>{" "}
//               — {myOrders.length} orders total
//             </p>
//           </div>

//         </div>

//         {/* Orders List */}
//         {filteredOrders.length === 0 ? (
//           <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 space-y-4">
//             <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto" />
//             <p className="text-sm font-bold text-slate-700">No orders found</p>
//             <Link href="/">
//               <button className="px-5 py-2.5 bg-slate-950 text-white rounded-xl text-xs font-semibold hover:bg-[#ffa352] hover:text-slate-950 transition">
//                 Start Shopping
//               </button>
//             </Link>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {filteredOrders.map((order) => {
//               const config = STATUS_CONFIG[(order.orderStatus as OrderStatus) || "processing"];
//               const isExpanded = expandedOrder === order._id;

//               return (
//                 <motion.div
//                   key={order._id}
//                   layout
//                   className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-md transition"
//                 >
//                   {/* Order Header */}
//                   <div
//                     className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer"
//                     onClick={() =>
//                       setExpandedOrder(isExpanded ? null : order._id)
//                     }
//                   >
//                     <div className="flex items-center gap-4">
//                       <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
//                         <Package className="w-5 h-5 text-slate-400" />
//                       </div>
//                       <div>
//                         <div className="flex items-center gap-2">
//                           <span className="text-sm font-bold text-slate-900 font-mono">
//                             {order.orderNumber}
//                           </span>
//                           <span
//                             className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${config.bg} ${config.color}`}
//                           >
//                             {config.icon}
//                             {config.label}
//                           </span>
//                         </div>
//                         <p className="text-xs text-slate-500 mt-0.5">
//                           {new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} item
//                           {(order.items?.length || 0) !== 1 ? "s" : ""} · ₹{order.totalAmount}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-3 self-end sm:self-center">
//                       {/* {order.orderStatus !== "cancelled" && (
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleReorder(order);
//                           }}
//                           className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-semibold transition"
//                         >
//                           <RefreshCw className="w-3 h-3" />
//                           <span>Reorder</span>
//                         </button>
//                       )} */}
//                       <button className="p-2 text-slate-400 hover:text-slate-700 transition">
//                         {isExpanded ? (
//                           <ChevronUp className="w-4 h-4" />
//                         ) : (
//                           <ChevronDown className="w-4 h-4" />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Expanded Details */}
//                   <AnimatePresence>
//                     {isExpanded && (
//                       <motion.div
//                         initial={{ height: 0, opacity: 0 }}
//                         animate={{ height: "auto", opacity: 1 }}
//                         exit={{ height: 0, opacity: 0 }}
//                         transition={{ duration: 0.25 }}
//                         className="overflow-hidden"
//                       >
//                         <div className="border-t border-slate-100 p-5 space-y-6">
//                           {/* Tracking Progress */}
//                           {order.orderStatus !== "cancelled" && (
//                             <div className="space-y-3">
//                               <h4 className="text-xs font-bold font-mono tracking-widest text-[#00A759] uppercase">
//                                 Shipment Track
//                               </h4>
//                               <div className="flex items-center gap-0">
//                                 {config.steps.map((step, i) => (
//                                   <React.Fragment key={step}>
//                                     <div className="flex flex-col items-center gap-1.5">
//                                       <div
//                                         className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
//                                           i <= config.currentStep
//                                             ? "bg-slate-950 border-slate-950 text-white"
//                                             : "bg-white border-slate-200 text-slate-400"
//                                         }`}
//                                       >
//                                         {i <= config.currentStep ? "✓" : i + 1}
//                                       </div>
//                                       <span
//                                         className={`text-[9px] font-medium text-center w-14 leading-tight ${i <= config.currentStep ? "text-slate-700" : "text-slate-400"}`}
//                                       >
//                                         {step}
//                                       </span>
//                                     </div>
//                                     {i < config.steps.length - 1 && (
//                                       <div
//                                         className={`flex-1 h-0.5 mb-5 ${i < config.currentStep ? "bg-slate-950" : "bg-slate-200"}`}
//                                       />
//                                     )}
//                                   </React.Fragment>
//                                 ))}
//                               </div>
//                               {order.tracking && order.tracking !== "—" && (
//                                 <p className="text-[10px] text-slate-500 font-mono">
//                                   Tracking ID:{" "}
//                                   <span className="font-bold text-slate-700">
//                                     {order.tracking}
//                                   </span>
//                                 </p>
//                               )}
//                             </div>
//                           )}

//                           {/* Order Items */}
//                           <div className="space-y-3">
//                             <h4 className="text-xs font-bold font-mono tracking-widest text-slate-400 uppercase">
//                               Items Ordered
//                             </h4>
//                             {order.items.map((item) => {
//                               const product = PRODUCTS_CATALOG.find(
//                                 (p) => p.id === item.productId,
//                               );
//                               if (!product) return null;
//                               return (
//                                 <div
//                                   key={item.productId}
//                                   className="flex items-center gap-3 bg-slate-50 rounded-xl p-3"
//                                 >
//                                   <Link href={`/product/${product.id}`}>
//                                     <div className="w-14 h-14 bg-white rounded-lg relative overflow-hidden border border-slate-100 cursor-pointer shrink-0">
//                                       <Image
//                                         src={product.image}
//                                         alt={product.name}
//                                         fill
//                                         className="object-cover"
//                                         referrerPolicy="no-referrer"
//                                       />
//                                     </div>
//                                   </Link>
//                                   <div className="flex-1 min-w-0">
//                                     <Link href={`/product/${product.id}`}>
//                                       <p className="text-xs font-bold text-slate-900 hover:text-[#ffa352] truncate cursor-pointer">
//                                         {product.name}
//                                       </p>
//                                     </Link>
//                                     <p className="text-[10px] text-slate-500">
//                                       Qty: {item.quantity} ·{" "}
//                                       {product.currency === "USD" ? "$" : "₹"}
//                                       {product.price.toLocaleString()}
//                                     </p>
//                                   </div>
//                                   {order.orderStatus === "delivered" && (
//                                     <button className="flex items-center gap-1 px-2.5 py-1.5 border border-amber-200 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-semibold hover:bg-amber-100 transition whitespace-nowrap">
//                                       <Star className="w-3 h-3" />
//                                       Rate
//                                     </button>
//                                   )}
//                                 </div>
//                               );
//                             })}
//                           </div>

//                           {/* Delivery Address */}
//                           <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 rounded-xl p-3">
//                             <MapPin className="w-3.5 h-3.5 text-[#00A759] shrink-0 mt-2" />
//                             <div>
//                               <span className="font-semibold text-slate-800 block">
//                                 Delivery Address
//                               </span>
//                               <span className="text-slate-500">
//                                 {order.address || "Your default address"}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </motion.div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//       <Footer/>
//     </>
//   );
// }

"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  QrCode,
  X,
  Star,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { fetchMyOrdersAsync } from "@/store/slices/orderSlice";

// ─── Types ────────────────────────────────────────────────────────────────────

type OrderStatus =
  | "delivered"
  | "shipped"
  | "processing"
  | "cancelled"
  | "pending"
  | "completed";

// ─── Status Config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: React.ReactNode;
    steps: string[];
    currentStep: number;
  }
> = {
  delivered: {
    label: "Delivered",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
    steps: [
      "Order Placed",
      "Confirmed",
      "Dispatched",
      "Out for Delivery",
      "Delivered",
    ],
    currentStep: 4,
  },
  completed: {
    label: "Delivered",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
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
    bg: "bg-blue-50",
    border: "border-blue-200",
    icon: <Truck className="w-3.5 h-3.5 text-blue-600" />,
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
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
    steps: [
      "Order Placed",
      "Confirmed",
      "Dispatched",
      "Out for Delivery",
      "Delivered",
    ],
    currentStep: 1,
  },
  pending: {
    label: "Processing",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    icon: <Clock className="w-3.5 h-3.5 text-amber-600" />,
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
    bg: "bg-red-50",
    border: "border-red-200",
    icon: <XCircle className="w-3.5 h-3.5 text-red-500" />,
    steps: ["Order Placed", "Cancelled"],
    currentStep: 1,
  },
};

// ─── Pill Config ───────────────────────────────────────────────────────────────

const PAYMENT_PILL: Record<
  string,
  { bg: string; text: string; border: string; label: string }
> = {
  cash: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    label: "Cash",
  },
  online: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    label: "Online",
  },
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    label: "Pending",
  },
};

const DELIVERY_PILL: Record<
  string,
  { bg: string; text: string; border: string; label: string }
> = {
  courier: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    border: "border-purple-200",
    label: "Courier",
  },
  pickup_by_customer: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    label: "Pickup",
  },
};

function PaymentBadge({ mode }: { mode: string }) {
  const c = PAYMENT_PILL[mode?.toLowerCase()];
  if (!c) return <span className="text-xs text-slate-400">—</span>;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}
    >
      {c.label}
    </span>
  );
}

function DeliveryBadge({ status }: { status: string }) {
  const c = DELIVERY_PILL[status?.toLowerCase()];
  if (!c) return <span className="text-xs text-slate-400">—</span>;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}
    >
      {c.label}
    </span>
  );
}

// ─── QR Modal ─────────────────────────────────────────────────────────────────

function QRModal({ order, onClose }: { order: any; onClose: () => void }) {
  const frontUrl = process.env.NEXT_PUBLIC_FRONT_URL || (typeof window !== "undefined" ? window.location.origin : "");
  const orderUrl = `${frontUrl}/imadmin/orders/${order._id}`;
  const qrOrderUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(orderUrl)}&bgcolor=FFFFFF&color=000000&margin=20`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs mx-4 p-6 flex flex-col items-center gap-4">
        <div className="flex items-center justify-between w-full">
          <div>
            <p className="text-xs text-slate-400 font-mono">
              {order.orderNumber}
            </p>
            <p className="text-sm font-bold text-slate-800 mt-0.5">
              Order QR Code
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 border border-slate-100 rounded-xl bg-slate-50">
          <img
            src={qrOrderUrl}
            alt="Order QR Code"
            className="w-48 h-48 rounded-lg"
          />
        </div>
        <p className="text-[10px] text-slate-400 text-center break-all px-2">
          {orderUrl}
        </p>
      </div>
    </div>
  );
}

// ─── Expanded Row ─────────────────────────────────────────────────────────────

function ExpandedRow({ order }: { order: any }) {
  const config =
    STATUS_CONFIG[(order.orderStatus as OrderStatus) || "processing"];

  return (
    <div className="px-6 py-5 bg-slate-50/60 border-t border-slate-100 space-y-5">
      {/* Shipment Track */}
      {order.orderStatus !== "cancelled" && (
        <div className="space-y-3">
          <p className="text-[10px] font-bold font-mono tracking-widest text-[#00A759] uppercase">
            Shipment Track
          </p>
          <div className="flex items-center">
            {config.steps.map((step, i) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center gap-1.5 shrink-0">
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-colors ${
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
        </div>
      )}

      {/* Items — using item.image and item.title from API */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold font-mono tracking-widest text-slate-400 uppercase">
          Items Ordered
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {order.items?.map((item: any) => (
            <div
              key={item._id}
              className="flex items-center gap-3 bg-white rounded-xl p-3 border border-slate-100"
            >
              {item.image ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden relative border border-slate-100 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <Package className="w-5 h-5 text-slate-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">
                  {item.title}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  ₹{Number(item.price).toLocaleString("en-IN")} ×{" "}
                  {item.quantity}
                </p>
                <p
                  className="text-xs font-bold mt-0.5"
                  style={{ color: "#00A759" }}
                >
                  ₹
                  {(Number(item.price) * item.quantity).toLocaleString("en-IN")}
                </p>
              </div>
              {(order.orderStatus === "delivered" ||
                order.orderStatus === "completed") && (
                <button className="flex items-center gap-1 px-2 py-1.5 border border-amber-200 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-semibold hover:bg-amber-100 transition shrink-0">
                  <Star className="w-3 h-3" />
                  Rate
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Address */}
      {order.address && (
        <div className="flex items-start gap-2 text-xs text-slate-600 bg-white rounded-xl p-3 border border-slate-100">
          <MapPin className="w-3.5 h-3.5 text-[#00A759] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-800 block">
              Delivery Address
            </span>
            <span className="text-slate-500">{order.address}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 8;

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const { myOrders, loading } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    if (currentUser) dispatch(fetchMyOrdersAsync());
  }, [currentUser, dispatch]);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [qrOrder, setQrOrder] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = myOrders.filter((o: any) =>
    o.orderNumber?.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  // Guest
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-6 px-5">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
          <Package className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Sign in to view your orders
        </h2>
        <p className="text-xs text-slate-500">
          Your order history is linked to your Sarvam account.
        </p>
        <Link href="/signin">
          <button className="px-8 py-3.5 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-[#00A759] transition">
            Sign In Now
          </button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-[1280px] mx-auto px-5 py-6 mb-10 space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Orders
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Hello,{" "}
            <span className="font-semibold text-slate-700">
              {currentUser.fullName}
            </span>{" "}
            — {myOrders.length} orders total
          </p>
        </div>

        {/* Empty */}
        {!loading && myOrders.length === 0 ? (
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
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative w-full max-w-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search by order number..."
                  className="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:border-[#00A759] transition-colors"
                />
              </div>
            </div>

            {/* Desktop Header */}
            <div
              className="hidden md:grid px-6 py-3 bg-gray-50 border-b border-gray-200"
              style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 0.8fr" }}
            >
              {[
                "Order Number",
                "Order Status",
                "Payment",
                "Delivery",
                "Total",
                "Actions",
              ].map((h) => (
                <span
                  key={h}
                  className="text-xs font-semibold text-gray-500 tracking-wider uppercase"
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Skeleton */}
            {loading && (
              <div className="divide-y divide-gray-100">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="hidden md:grid px-6 py-4 animate-pulse gap-4"
                    style={{
                      gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 0.8fr",
                    }}
                  >
                    {Array.from({ length: 6 }).map((_, ci) => (
                      <div key={ci} className="h-4 bg-gray-100 rounded w-3/4" />
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Rows */}
            {!loading && (
              <div className="divide-y divide-gray-100">
                {paginated.map((order: any) => {
                  const config =
                    STATUS_CONFIG[
                      (order.orderStatus as OrderStatus) || "processing"
                    ];
                  const isExpanded = expandedId === order._id;

                  return (
                    <React.Fragment key={order._id}>
                      {/* Desktop Row */}
                      <div
                        className="hidden md:grid px-6 py-3 items-center hover:bg-gray-50/60 transition-colors"
                        style={{
                          gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 0.8fr",
                        }}
                      >
                        {/* Order Number */}
                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg w-fit">
                          {order.orderNumber}
                        </span>

                        {/* Order Status */}
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border w-fit ${config.bg} ${config.color} ${config.border}`}
                        >
                          {config.icon}
                          {config.label}
                        </span>

                        {/* Payment — paymentMode field */}
                        <PaymentBadge mode={order.paymentMode} />

                        {/* Delivery — deliveryStatus field */}
                        <DeliveryBadge status={order.deliveryStatus} />

                        {/* Total */}
                        <span
                          className="text-sm font-bold"
                          style={{ color: "#00A759" }}
                        >
                          ₹{Number(order.totalAmount).toLocaleString("en-IN")}
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setQrOrder(order)}
                            className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:border-[#00A759] hover:text-[#00A759] flex items-center justify-center transition-colors"
                            title="View QR"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setExpandedId(isExpanded ? null : order._id)
                            }
                            className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center transition-colors"
                            title="Details"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Mobile Card */}
                      <div className="md:hidden p-4 space-y-2">
                        {[
                          {
                            label: "Order Number",
                            value: (
                              <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                {order.orderNumber}
                              </span>
                            ),
                          },
                          {
                            label: "Status",
                            value: (
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${config.color} ${config.border}`}
                              >
                                {config.icon}
                                {config.label}
                              </span>
                            ),
                          },
                          {
                            label: "Payment",
                            value: <PaymentBadge mode={order.paymentMode} />,
                          },
                          {
                            label: "Delivery",
                            value: (
                              <DeliveryBadge status={order.deliveryStatus} />
                            ),
                          },
                          {
                            label: "Total",
                            value: (
                              <span
                                className="text-sm font-bold"
                                style={{ color: "#00A759" }}
                              >
                                ₹
                                {Number(order.totalAmount).toLocaleString(
                                  "en-IN",
                                )}
                              </span>
                            ),
                          },
                        ].map(({ label, value }) => (
                          <div
                            key={label}
                            className="flex justify-between items-center gap-4"
                          >
                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider shrink-0">
                              {label}
                            </span>
                            <div className="text-sm text-gray-700 text-right">
                              {value}
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => setQrOrder(order)}
                            className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 hover:border-[#00A759] hover:text-[#00A759] flex items-center justify-center transition-colors"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              setExpandedId(isExpanded ? null : order._id)
                            }
                            className="w-8 h-8 rounded-lg border border-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Inline Expanded Row */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            key={`expanded-${order._id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.22 }}
                            className="overflow-hidden"
                          >
                            <ExpandedRow order={order} />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-t border-gray-200">
              <span className="text-sm text-gray-500">
                Showing {paginated.length} of {filtered.length} orders
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${currentPage === page ? "text-white border" : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100"}`}
                      style={
                        currentPage === page
                          ? {
                              backgroundColor: "#00A759",
                              borderColor: "#00A759",
                            }
                          : {}
                      }
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* QR Modal */}
      {qrOrder && <QRModal order={qrOrder} onClose={() => setQrOrder(null)} />}

      <Footer />
    </>
  );
}
