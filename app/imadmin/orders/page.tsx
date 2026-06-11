"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Link from "next/link";
import CommonTable from "@/components/commonTable";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  fetchAllOrdersAsync,
  fetchOrderStatsAsync,
  updateAdminOrderAsync,
  deleteOrderAsync,
} from "@/store/slices/orderSlice";
import { api } from "@/lib/axios";

// ─── Data ─────────────────────────────────────────────────────────────────────
const PRODUCTS_CATALOG = [
  {
    id: "premium-minimalist-watch",
    name: "Premium Minimalist Watch",
    price: 4999,
    currency: "INR",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCFzlRbT6_nmwjpaSJDECDtsEL3fjq_wt3Di_tS3nlQiyf84e2M2xCu-xwW83K9FMupuTW13s_o8WM4u2W-q2h-whBZZrtkyATG309WVxD_EmOKHAz_x3OXPx34JJ0TPu0tL3dXbdoOQcYxeq_8o0pABK4BkOPcPXJzKSqYlAysIcRUXawVMoQVormzZaod7gbVAdKSppgJe42Y4JCCM5SXK4ff1vwhwOzU4BNkFr0TTqlCZVFAaTRiaOAfCB0mW2ODl-oew_NHbb14",
    brand: "Sarvam Signature",
    category: "Fashion & Apparel",
  },
  {
    id: "studio-wireless-pro",
    name: "Studio Wireless Pro",
    price: 12499,
    currency: "INR",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCmPgr3rrbebMz2UJA6tV2zC7fIC97n5HDFDvrKLP_16eXy8xjjCDopuzwbRR93Qtt0nhij0OWHRyRti2lkiGLXALY0Sb_OEa-f7AtdrTHiu6BnVTHk8BJtlUNne973bqILfnU4A2BpWU-BMXk4FhaECq1sfN9d4Jo3rIQ3MHYwufoHvoMhXGcilu9gRRUyXt5w6pFWnvYVJv3R-5rymBnMmo42xdk7A0xsoNvpMvolz9iD-s9ISVYUVxDsgAT6NbBTCYoy3YiRV9xQ",
    brand: "Minimalist Co.",
    category: "Electronics",
  },
  {
    id: "elite-velocity-runner",
    name: "Elite Velocity Runner",
    price: 7299,
    currency: "INR",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATMi-lRrjRT8QsXeBpbAw4mRpqhpHIItzMRPH0Y6cJfSYukFSYkBj45-AMupdrUaaIpol01GrYNe5_WRSRVeU5TsOGA1P2juABlbpHvlqFd-CZxNWSQQNDP_--8vaY9RzihWshFSmQaah2ufPMW139dEMg2Nlpht33iKInNnGRGfrN34eRlspRY76D2H7jZhgZRrZSQc9jUMh6RItgARWgR8-L4sYM8XrX34pglxxVRtaNtTs5qjo3pASV09Nbg8AY6qhcnpP_HbpU",
    brand: "Urban Loft",
    category: "Fashion & Apparel",
  },
  {
    id: "aviator-classic-series",
    name: "Aviator Classic Series",
    price: 2999,
    currency: "INR",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAGh-rmXRZKkpgi0r5-XfYeYqmtyVemXdxWmdXAkLX9gyzmVABtBfrd9rFeetdhzyU0wFLSbhJl2PR3tEbry59Vdv1ASK_gF9XQA5T66ohMHhK3i83McjzsjfKrC_44H6KK4sAF5H0kbcAkvy8GLRPhKmACwPB2bVVuOW4ayYPb9DPewYOSYN-gyECzjMpAeZ4DH3q1Cmb80bHBF6sx408lpWMiZmTFNR8Hwi2PggeJ3USjsvOxj5UPRivXhWmGoYXcYC3jXDYRIvDA",
    brand: "Urban Loft",
    category: "Fashion & Apparel",
  },
  {
    id: "vantage-x-pro-max",
    name: "Vantage X Pro Max",
    price: 89999,
    currency: "INR",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDy7976Mtd2nvbeTdkTl6Nyy2sbiMP_HQId5uav8dPctV0Z_jECmnzfaNce2SvOFpMV65SR94DcDgTzAAYky0SRNvzL2rPn10_Ln6InWLlB1xoJUsGpnLsqYxUGpU23xCh22PCn7S4P_XdneOH1_ZhKoP-rDjfdY6yhczE17vNZNsaRcMlj2ppZACEtQyPcwpF9HwtnkpbSSaimSmCbPFnNO63DzCMo3lt8ICw5jUoi0adYstKilf0Sc6y-bx8DOql1GmbF-Vrclhul",
    brand: "Minimalist Co.",
    category: "Electronics",
  },
  {
    id: "retro-digital-slr",
    name: "Retro-Digital SLR",
    price: 54999,
    currency: "INR",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD8XmTm-DFDRNLbG0D6vpWXt7c1Wnr3oKDXCyuiOB8LnwXR3qif88hNQ1XXNDgz1o8w_nhGODHrmP7D5kOe1Z4MkilLu8DvOT06RD7zbj1y-iUhujJxSwGij5RGM9MbuzGaNzeQJdxnkFzabzI8WggC_5m4pWKZwMWtQPgzEXy2meg5fozhEeVn7y48xxeUoKxPhWvfVnUfm2qHwTEO35GrLzxXqnztQNprkckbUwdT6coJILaxghPrW464muZqcEJGKrrMq_0d2SBg",
    brand: "Sarvam Signature",
    category: "Electronics",
  },
];

const VENDORS = ["Sarvam Signature", "Minimalist Co.", "Urban Loft"];
const PAYMENT_OPTIONS = ["Cash", "Online", "Pending"]; // This is payment mode
const PAYMENT_STATUS_OPTIONS = ["Pending", "Partial", "Paid"];
const DELIVERY_OPTIONS = ["Courier", "By Hand"];
const ORDER_STATUS_OPTIONS = ["Pending", "Completed"];
const ITEMS_PER_PAGE = 8;

const generateOrderId = () =>
  "ORD-" +
  Date.now().toString().slice(-8) +
  Math.random().toString(36).slice(2, 5).toUpperCase();

interface Product {
  id: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  brand: string;
  category: string;
  variantId?: string;
}

// Each order line item: product + qty
interface OrderItem {
  product: Product;
  qty: number;
}

// An order belongs to one vendor, can have multiple products
interface Order {
  id: string;
  orderNumber: string;
  vendor: string;
  items: OrderItem[];
  paymentMethod: string;
  paymentStatus: string;
  deliveryMethod: string;
  orderStatus: string;
}

interface FormState {
  vendor: string;
  items: OrderItem[];
  paymentMethod: string;
  paymentStatus: string;
  deliveryMethod: string;
  orderStatus: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const orderTotalQty = (o: Order) => o.items.reduce((s, i) => s + i.qty, 0);
const orderTotalPrice = (o: Order) =>
  o.items.reduce((s, i) => s + i.product.price * i.qty, 0);

// ─── Pill colors ──────────────────────────────────────────────────────────────
const PILL_COLORS: Record<
  string,
  { activeBg: string; activeText: string; activeBorder: string }
> = {
  Cash: {
    activeBg: "bg-green-100",
    activeText: "text-green-700",
    activeBorder: "border-green-400",
  },
  Online: {
    activeBg: "bg-blue-100",
    activeText: "text-blue-700",
    activeBorder: "border-blue-400",
  },
  Pending: {
    activeBg: "bg-amber-100",
    activeText: "text-amber-700",
    activeBorder: "border-amber-400",
  },
  Courier: {
    activeBg: "bg-purple-100",
    activeText: "text-purple-700",
    activeBorder: "border-purple-400",
  },
  "By Hand": {
    activeBg: "bg-orange-100",
    activeText: "text-orange-700",
    activeBorder: "border-orange-400",
  },
  Processing: {
    activeBg: "bg-blue-100",
    activeText: "text-blue-700",
    activeBorder: "border-blue-400",
  },
  Completed: {
    activeBg: "bg-emerald-100",
    activeText: "text-emerald-700",
    activeBorder: "border-emerald-400",
  },
  Paid: {
    activeBg: "bg-green-100",
    activeText: "text-green-700",
    activeBorder: "border-green-400",
  },
  Partial: {
    activeBg: "bg-yellow-100",
    activeText: "text-yellow-700",
    activeBorder: "border-yellow-400",
  },
  Cancelled: {
    activeBg: "bg-red-100",
    activeText: "text-red-700",
    activeBorder: "border-red-400",
  },
};

const PILL_FULL: Record<
  string,
  {
    bg: string;
    text: string;
    activeBg: string;
    activeText: string;
    activeBorder: string;
  }
> = {
  Cash: {
    bg: "bg-green-50",
    text: "text-green-600",
    activeBg: "bg-green-100",
    activeText: "text-green-700",
    activeBorder: "border-green-400",
  },
  Online: {
    bg: "bg-blue-50",
    text: "text-blue-500",
    activeBg: "bg-blue-100",
    activeText: "text-blue-700",
    activeBorder: "border-blue-400",
  },
  Pending: {
    bg: "bg-amber-50",
    text: "text-amber-500",
    activeBg: "bg-amber-100",
    activeText: "text-amber-700",
    activeBorder: "border-amber-400",
  },
  Courier: {
    bg: "bg-purple-50",
    text: "text-purple-500",
    activeBg: "bg-purple-100",
    activeText: "text-purple-700",
    activeBorder: "border-purple-400",
  },
  "By Hand": {
    bg: "bg-orange-50",
    text: "text-orange-400",
    activeBg: "bg-orange-100",
    activeText: "text-orange-700",
    activeBorder: "border-orange-400",
  },
  Processing: {
    bg: "bg-blue-50",
    text: "text-blue-500",
    activeBg: "bg-blue-100",
    activeText: "text-blue-700",
    activeBorder: "border-blue-400",
  },
  Completed: {
    bg: "bg-emerald-50",
    text: "text-emerald-500",
    activeBg: "bg-emerald-100",
    activeText: "text-emerald-700",
    activeBorder: "border-emerald-400",
  },
  Paid: {
    bg: "bg-green-50",
    text: "text-green-500",
    activeBg: "bg-green-100",
    activeText: "text-green-700",
    activeBorder: "border-green-400",
  },
  Partial: {
    bg: "bg-yellow-50",
    text: "text-yellow-500",
    activeBg: "bg-yellow-100",
    activeText: "text-yellow-700",
    activeBorder: "border-yellow-400",
  },
  Cancelled: {
    bg: "bg-red-50",
    text: "text-red-500",
    activeBg: "bg-red-100",
    activeText: "text-red-700",
    activeBorder: "border-red-400",
  },
};

// ─── Static Badge (view panel) ────────────────────────────────────────────────
function Badge({ label }: { label: string }) {
  if (!label) return null;
  const c = PILL_COLORS[label];
  if (!c) return null;
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.activeBg} ${c.activeText} ${c.activeBorder}`}
    >
      {label}
    </span>
  );
}

// ─── PillToggle (modal form) ──────────────────────────────────────────────────
function PillToggle({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => {
        const c = PILL_FULL[opt] ?? {
          bg: "bg-gray-50",
          text: "text-gray-500",
          activeBg: "bg-gray-100",
          activeText: "text-gray-700",
          activeBorder: "border-gray-400",
        };
        const selected = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(selected ? "" : opt)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${selected ? `${c.activeBg} ${c.activeText} ${c.activeBorder}` : `${c.bg} ${c.text} border-transparent hover:border-gray-200`}`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ─── InlineSelect (table dropdown — Payment & Delivery) ──────────────────────
function InlineSelect({
  value,
  options,
  placeholder,
  onChange,
}: {
  value: string;
  options: string[];
  placeholder: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const c = value ? PILL_COLORS[value] : null;

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center gap-1.5 transition-all ${
          value
            ? `px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c?.activeBg} ${c?.activeText} ${c?.activeBorder}`
            : "px-3 py-1.5 rounded-lg border border-dashed border-gray-300 text-xs text-gray-400 bg-gray-50 hover:border-gray-400 hover:text-gray-500"
        }`}
      >
        {value ? (
          <>
            {value}
            <svg
              className="w-3 h-3 opacity-60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </>
        ) : (
          <>
            <svg
              className="w-3 h-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            {placeholder}
          </>
        )}
      </button>
      {open && (
        <div className="absolute z-30 top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden min-w-[110px]">
          {options.map((opt) => {
            const oc = PILL_COLORS[opt];
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors ${isSelected ? "bg-gray-50" : ""}`}
              >
                <span
                  className={`inline-block w-2 h-2 rounded-full border ${oc?.activeBg} ${oc?.activeBorder}`}
                />
                <span className={oc?.activeText}>{opt}</span>
                {isSelected && (
                  <svg
                    className="w-3 h-3 ml-auto text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── View Panel (slides in from right) ───────────────────────────────────────
function ViewPanel({
  order,
  onClose,
}: {
  order: Order | null;
  onClose: () => void;
}) {
  const visible = !!order;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${visible ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-base">Order Details</h2>
            {order && (
              <p className="text-xs font-mono text-gray-400 mt-0.5">
                {order.id}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {order && (
          <>
            {/* Vendor + badges */}
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide">
                  Vendor
                </p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">
                  {order.vendor}
                </p>
              </div>
              <div className="flex gap-1.5 flex-wrap justify-end">
                {order.paymentMethod && <Badge label={order.paymentMethod} />}
                {order.deliveryMethod && <Badge label={order.deliveryMethod} />}
              </div>
            </div>

            {/* Product list */}
            <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-2">
                {order.items.length} Product
                {order.items.length !== 1 ? "s" : ""}
              </p>
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/60"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm leading-tight truncate">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {item.product.category}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-gray-500">
                        ₹{item.product.price.toLocaleString()}
                      </span>
                      <span className="text-gray-300">×</span>
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                        style={{
                          backgroundColor: "#00A75915",
                          color: "#00A759",
                        }}
                      >
                        {item.qty}
                      </span>
                      <span className="text-gray-300">=</span>
                      <span
                        className="text-xs font-bold"
                        style={{ color: "#00A759" }}
                      >
                        ₹{(item.product.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer summary */}
            <div className="px-5 py-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Qty</span>
                <span className="font-bold text-gray-800">
                  {orderTotalQty(order)} items
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Grand Total</span>
                <span
                  className="text-lg font-bold"
                  style={{ color: "#00A759" }}
                >
                  ₹{orderTotalPrice(order).toLocaleString()}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ─── Order Form Modal ─────────────────────────────────────────────────────────
function OrderFormModal({
  open,
  editingId,
  form,
  setForm,
  onSave,
  onClose,
}: {
  open: boolean;
  editingId: string | null;
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  onSave: () => void;
  onClose: () => void;
}) {
  const [productSearch, setProductSearch] = useState("");
  const [showDrop, setShowDrop] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      setProductSearch("");
      setShowDrop(false);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setShowDrop(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!open) return null;

  // Filter products by vendor (if vendor selected) and search
  const vendorProducts = form.vendor
    ? PRODUCTS_CATALOG.filter((p) => p.brand === form.vendor)
    : PRODUCTS_CATALOG;
  const filteredProducts = vendorProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) &&
      !form.items.some((i) => i.product.id === p.id),
  );

  const addItem = (p: Product) => {
    setForm((f) => ({ ...f, items: [...f.items, { product: p, qty: 1 }] }));
    setProductSearch("");
    setShowDrop(false);
  };

  const updateQty = (idx: number, qty: number) => {
    setForm((f) => {
      const items = [...f.items];
      items[idx] = { ...items[idx], qty: Math.max(1, qty) };
      return { ...f, items };
    });
  };

  const removeItem = (idx: number) => {
    setForm((f) => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "#00A759" }}
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    editingId
                      ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      : "M12 4v16m8-8H4"
                  }
                />
              </svg>
            </div>
            <h2 className="font-bold text-gray-800 text-base">
              {editingId ? "Edit Order" : "Add New Order"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Vendor */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Customer / Reseller Name
            </label>
            <input
              type="text"
              value={form.vendor}
              onChange={(e) =>
                setForm((f) => ({ ...f, vendor: e.target.value }))
              }
              readOnly={!!editingId}
              className={`w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none ${editingId ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-gray-50"}`}
              placeholder="Enter name"
            />
          </div>

          {/* Add Products */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Products *
            </label>
            <div className="relative" ref={dropRef}>
              <input
                type="text"
                placeholder={
                  form.vendor
                    ? "Search & add products..."
                    : "Select vendor first"
                }
                value={productSearch}
                disabled={!form.vendor}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setShowDrop(true);
                }}
                onFocus={() => setShowDrop(true)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#00A759] bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {showDrop && filteredProducts.length > 0 && (
                <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                  {filteredProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => addItem(p)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {p.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          ₹{p.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Added items */}
            {form.items.length > 0 && (
              <div className="mt-3 space-y-2">
                {form.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 bg-gray-50/60"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-9 h-9 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate">
                        {item.product.name}
                      </p>
                      <p
                        className="text-xs font-medium"
                        style={{ color: "#00A759" }}
                      >
                        ₹{item.product.price.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => updateQty(idx, item.qty - 1)}
                        className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 bg-white text-sm font-bold"
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-sm font-bold text-gray-800">
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(idx, item.qty + 1)}
                        className="w-7 h-7 rounded-lg border flex items-center justify-center text-white text-sm font-bold hover:opacity-90"
                        style={{
                          backgroundColor: "#00A759",
                          borderColor: "#00A759",
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="w-7 h-7 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 flex items-center justify-center text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Status (Automated) */}
          <div className="grid gap-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Payment Status
              </label>
              <div className="text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg inline-block">
                {form.paymentStatus
                  ? form.paymentStatus.charAt(0).toUpperCase() +
                    form.paymentStatus.slice(1)
                  : "Pending"}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Status updates automatically via the Order Details page.
              </p>
            </div>
            {/* <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Payment Status
              </label>
              <PillToggle
                options={PAYMENT_STATUS_OPTIONS}
                value={form.paymentStatus}
                onChange={(v) => setForm((f) => ({ ...f, paymentStatus: v }))}
              />
            </div> */}
          </div>

          {/* Delivery Method */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Delivery Method
            </label>
            <PillToggle
              options={DELIVERY_OPTIONS}
              value={form.deliveryMethod}
              onChange={(v) => setForm((f) => ({ ...f, deliveryMethod: v }))}
            />
          </div>

          {/* Order Status */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Order Status
            </label>
            <PillToggle
              options={ORDER_STATUS_OPTIONS}
              value={form.orderStatus}
              onChange={(v) => setForm((f) => ({ ...f, orderStatus: v }))}
            />
          </div>

          {/* Total preview */}
          {form.items.length > 0 && (
            <div
              className="flex items-center justify-between rounded-xl px-4 py-3"
              style={{
                backgroundColor: "#00A75910",
                border: "1px solid #00A75928",
              }}
            >
              <span className="text-sm text-gray-500">
                {form.items.reduce((s, i) => s + i.qty, 0)} items
              </span>
              <span className="text-lg font-bold" style={{ color: "#00A759" }}>
                ₹
                {form.items
                  .reduce((s, i) => s + i.product.price * i.qty, 0)
                  .toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3 rounded-b-2xl">
          <button
            onClick={onSave}
            className="flex-1 py-2.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: "#00A759" }}
          >
            {editingId ? "Update Order" : "Save Order"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminOrderPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { allOrders, pagination, stats, loading } = useSelector(
    (state: RootState) => state.order,
  );

  const { adminToken } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchOrderStatsAsync());
  }, [dispatch]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    dispatch(
      fetchAllOrdersAsync({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch,
      }),
    );
  }, [dispatch, currentPage, debouncedSearch]);

  const orders = useMemo<Order[]>(() => {
    return allOrders.map((o) => ({
      id: o._id,
      orderNumber: o.orderNumber,
      vendor: o.userId?.fullName || "Guest",
      items: o.items.map((i: any) => ({
        product: {
          id: i.productId?._id || i.productId,
          name: i.title,
          price: i.price,
          currency: "INR",
          image: i.image || i.productId?.images?.[0]?.src || "",
          brand: "",
          category: "",
          variantId: i.variantId,
        },
        qty: i.quantity,
      })),
      paymentMethod: o.paymentMode
        ? o.paymentMode.charAt(0).toUpperCase() + o.paymentMode.slice(1)
        : "",
      paymentStatus: o.paymentStatus
        ? o.paymentStatus.charAt(0).toUpperCase() + o.paymentStatus.slice(1)
        : "Pending",
      deliveryMethod:
        o.deliveryStatus === "pickup_by_customer"
          ? "By Hand"
          : o.deliveryStatus === "courier"
            ? "Courier"
            : "",
      orderStatus: o.orderStatus
        ? o.orderStatus.charAt(0).toUpperCase() + o.orderStatus.slice(1)
        : "Pending",
    }));
  }, [allOrders]);

  const emptyForm: FormState = {
    vendor: "",
    items: [],
    paymentMethod: "",
    paymentStatus: "Pending",
    deliveryMethod: "",
    orderStatus: "Pending",
  };
  const [form, setForm] = useState<FormState>(emptyForm);

  const updateOrderField = async (
    id: string,
    field: "paymentMethod" | "paymentStatus" | "deliveryMethod" | "orderStatus",
    value: string,
  ) => {
    const data: any = {};
    if (field === "paymentMethod")
      data.paymentMode = value ? value.toLowerCase() : "";
    if (field === "paymentStatus")
      data.paymentStatus = value ? value.toLowerCase() : "";
    if (field === "deliveryMethod") {
      data.deliveryStatus =
        value === "By Hand"
          ? "pickup_by_customer"
          : value === "Courier"
            ? "courier"
            : "";
    }
    if (field === "orderStatus")
      data.orderStatus = value ? value.toLowerCase() : "";
    await dispatch(updateAdminOrderAsync({ orderId: id, data }));
    dispatch(fetchOrderStatsAsync());
  };

  const totalPages = Math.max(
    1,
    Math.ceil((pagination?.totalRecords || 0) / ITEMS_PER_PAGE),
  );
  const paginated = orders; // Backend already paginated this

  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowModal(true);
  };
  const openEdit = (order: Order) => {
    setForm({
      vendor: order.vendor,
      items: order.items,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      deliveryMethod: order.deliveryMethod,
      orderStatus: order.orderStatus,
    });
    setEditingId(order.id);
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSave = async () => {
    if (!form.vendor || form.items.length === 0) {
      alert("Vendor and at least one product are required!");
      return;
    }

    // Convert Form back to backend structure
    const data: any = {
      items: form.items.map((i) => ({
        productId: i.product.id,
        variantId: i.product.variantId || "11111111111111", // Fallback for mock data
        quantity: i.qty,
        price: i.product.price,
        title: i.product.name,
      })),
    };

    // Always send these fields so we can clear them if needed
    data.paymentMode = form.paymentMethod
      ? form.paymentMethod.toLowerCase()
      : "";
    data.paymentStatus = form.paymentStatus
      ? form.paymentStatus.toLowerCase()
      : "";
    data.deliveryStatus =
      form.deliveryMethod === "By Hand"
        ? "pickup_by_customer"
        : form.deliveryMethod === "Courier"
          ? "courier"
          : "";
    if (form.orderStatus) data.orderStatus = form.orderStatus.toLowerCase();

    if (editingId) {
      await dispatch(updateAdminOrderAsync({ orderId: editingId, data }));
    } else {
      // Create order logic if needed
      // If creating new... wait, AdminOrderPage doesn't create orders yet, it only updates.
      // But just in case:
    }

    dispatch(fetchOrderStatsAsync());
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this order?")) {
      await dispatch(deleteOrderAsync(id));
    }
  };

 const handleDownload = async (orderId: string) => {
  try {
    const res = await api.get(`/order/${orderId}/pdf`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement("a");
    a.href = url;
    a.download = `order-${orderId}.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    console.log("Error:", err);
    alert("PDF download failed!");
  }
};

  interface Column<T> {
    header: string;
    render: (item: T, idx?: number) => React.ReactNode;
    className?: string;
    headerClassName?: string;
  }

  // 7 columns: Order ID, Vendor, Qty, Total, Payment, Delivery, Actions
  const columns: Column<Order>[] = [
    {
      header: "Order ID",
      render: (o) => (
        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg whitespace-nowrap">
          {o.orderNumber}
        </span>
      ),
    },
    {
      header: "Vendor",
      render: (o) => (
        <span className="text-gray-700 font-medium text-sm">{o.vendor}</span>
      ),
    },
    {
      header: "Products",
      render: (o) => (
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
          {o.items.length} item{o.items.length !== 1 ? "s" : ""}
        </span>
      ),
    },
    {
      header: "Qty",
      className: "flex items-center justify-right",
      render: (o) => (
        <span
          className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
          style={{ backgroundColor: "#00A75915", color: "#00A759" }}
        >
          {orderTotalQty(o)}
        </span>
      ),
    },
    {
      header: "Total",
      render: (o) => (
        <span className="font-bold text-sm" style={{ color: "#00A759" }}>
          ₹{orderTotalPrice(o).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Order Status",
      render: (o) => {
        const isCompleted = o.orderStatus?.toLowerCase() === "completed";
        return isCompleted ? (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
            COMPLETED
          </span>
        ) : (
          <InlineSelect
            value={o.orderStatus}
            options={ORDER_STATUS_OPTIONS}
            placeholder="Select"
            onChange={(v) => updateOrderField(o.id, "orderStatus", v)}
          />
        );
      },
    },
    // {
    //   header: "Payment Status",
    //   render: (o) => (
    //     <InlineSelect
    //       value={o.paymentStatus}
    //       options={PAYMENT_STATUS_OPTIONS}
    //       placeholder="Select"
    //       onChange={(v) => updateOrderField(o.id, "paymentStatus", v)}
    //     />
    //   ),
    // },
    {
      header: "Payment Status",
      render: (o) => {
        const rawStatus = o.paymentStatus || "pending";
        const capStatus =
          rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1);
        const c = PILL_FULL[capStatus] || PILL_FULL["Pending"];
        return (
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${c.activeBg} ${c.activeText} ${c.activeBorder}`}
          >
            {capStatus}
          </span>
        );
      },
    },
    {
      header: "Delivery",
      render: (o) => {
        const isCompleted = o.orderStatus?.toLowerCase() === "completed";
        return (
          <InlineSelect
            value={o.deliveryMethod}
            options={DELIVERY_OPTIONS}
            placeholder="Select"
            onChange={(v) => updateOrderField(o.id, "deliveryMethod", v)}
          />
        );
      },
    },
    {
      header: "Actions",
      headerClassName: "text-center",
      render: (o) => {
        const isCompleted = o.orderStatus?.toLowerCase() === "completed";
        return (
          <div className="flex items-center justify-center gap-1.5">
            <button
              onClick={() => setViewOrder(o)}
              className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 flex items-center justify-center transition-colors text-sm"
              title="View"
            >
              👁️
            </button>
            {/* COMPLETED — Download PDF */}
            {isCompleted && (
              <button
                onClick={() => handleDownload(o.id)}
                className="w-8 h-8 rounded-lg border border-green-200 text-green-600 hover:bg-green-50 flex items-center justify-center transition-colors text-sm"
                title="Download Invoice PDF"
              >
                ⬇️
              </button>
            )}

            {!isCompleted && (
              <>
                <Link
                  href={`/imadmin/orders/${o.id}`}
                  className="w-8 h-8 rounded-lg border border-blue-200 text-blue-500 hover:bg-blue-50 flex items-center justify-center transition-colors text-sm"
                  title="Edit"
                >
                  ✏️
                </Link>
                <button
                  onClick={() => handleDelete(o.id)}
                  className="w-8 h-8 rounded-lg border border-red-200 text-red-400 hover:bg-red-50 flex items-center justify-center transition-colors text-sm"
                  title="Delete"
                >
                  🗑️
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="font-sans">
      <ViewPanel order={viewOrder} onClose={() => setViewOrder(null)} />

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#00A759" }}
          >
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 leading-tight">
              Order Management
            </h1>
            <p className="text-xs text-gray-500">
              {orders.length} total orders
            </p>
          </div>
        </div>
        {/* <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#00A759" }}
        >
          <span className="text-base leading-none font-bold">+</span>
          New Order
        </button> */}
      </div>

      {/* Content */}
      <div className="py-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Orders Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Total Orders
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {stats?.totalOrders || 0}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center text-xl">
              📦
            </div>
          </div>
          {/* Completed Payments Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Completed Payments
              </p>
              <p className="text-3xl font-bold text-green-600 mt-2">
                ₹{(stats?.completedAmount || 0).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-500 flex items-center justify-center text-xl">
              💸
            </div>
          </div>
          {/* Pending Payments Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Pending Payments
              </p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                ₹{(stats?.pendingAmount || 0).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-500 flex items-center justify-center text-xl">
              ⏳
            </div>
          </div>
        </div>

        <CommonTable
          columns={columns}
          data={paginated}
          emptyMessage="No orders found."
          onSearch={useCallback((q: string) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }, [])}
          searchPlaceholder="Search by vendor, order ID, product..."
          showingText={`Showing ${paginated.length} of ${pagination?.totalRecords || 0} orders`}
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
          onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          headerBg="bg-gray-50"
          footerBg="bg-gray-50"
          gridTemplateColumns="1.2fr 1.2fr 0.8fr 0.6fr 1fr 1fr 1fr 1fr 1.2fr"
        />
      </div>
    </div>
  );
}
