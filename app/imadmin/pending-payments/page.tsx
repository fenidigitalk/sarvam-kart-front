// "use client";

// import { useState, useEffect } from "react";
// import React from "react";
// import CommonTable from "@/components/commonTable";

// // ─── Types ───────────────────────────────────────────────────────────────────

// interface PendingProduct {
//   id: string;
//   name: string;
//   category: string;
//   image: string;
//   price: number;
//   qty: number;
// }

// interface PendingPaymentRow {
//   id: string;
//   vendorName: string;
//   vendorAvatar: string;
//   pendingAmount: number;
//   products: PendingProduct[];
//   dueDate: string;
// }

// // ─── Mock Data ────────────────────────────────────────────────────────────────

// const MOCK_DATA: PendingPaymentRow[] = [
//   {
//     id: "PP-001",
//     vendorName: "Sarvam Signature",
//     vendorAvatar: "SS",
//     pendingAmount: 64997,
//     dueDate: "2024-06-10",
//     products: [
//       {
//         id: "P001",
//         name: "Elite Velocity Runner",
//         category: "Fashion & Apparel",
//         image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop",
//         price: 7299,
//         qty: 5,
//       },
//       {
//         id: "P002",
//         name: "Classic Oxford Shirt",
//         category: "Men's Wear",
//         image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=80&h=80&fit=crop",
//         price: 3699,
//         qty: 7,
//       },
//     ],
//   },
//   {
//     id: "PP-002",
//     vendorName: "Minimalist Co.",
//     vendorAvatar: "MC",
//     pendingAmount: 102498,
//     dueDate: "2024-06-08",
//     products: [
//       {
//         id: "P003",
//         name: "Linen Blend Trousers",
//         category: "Bottom Wear",
//         image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=80&h=80&fit=crop",
//         price: 4199,
//         qty: 4,
//       },
//       {
//         id: "P004",
//         name: "Merino Wool Sweater",
//         category: "Winter Wear",
//         image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=80&h=80&fit=crop",
//         price: 5999,
//         qty: 6,
//       },
//       {
//         id: "P005",
//         name: "Slim Fit Chinos",
//         category: "Bottom Wear",
//         image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=80&h=80&fit=crop",
//         price: 3299,
//         qty: 8,
//       },
//     ],
//   },
//   {
//     id: "PP-003",
//     vendorName: "Urban Loft",
//     vendorAvatar: "UL",
//     pendingAmount: 21897,
//     dueDate: "2024-06-15",
//     products: [
//       {
//         id: "P006",
//         name: "Graphic Tee Pack",
//         category: "Casual Wear",
//         image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=80&h=80&fit=crop",
//         price: 1299,
//         qty: 9,
//       },
//     ],
//   },

// ];

// // ─── Avatar Helper ─────────────────────────────────────────────────────────────

// const AVATAR_COLORS: Record<string, string> = {
//   SS: "bg-purple-100 text-purple-700",
//   MC: "bg-blue-100 text-blue-700",
//   UL: "bg-orange-100 text-orange-700",
//   PF: "bg-rose-100 text-rose-700",
// };

// function VendorAvatar({ initials }: { initials: string }) {
//   const cls = AVATAR_COLORS[initials] ?? "bg-gray-100 text-gray-600";
//   return (
//     <span
//       className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${cls}`}
//     >
//       {initials}
//     </span>
//   );
// }

// // ─── Confirm Modal ─────────────────────────────────────────────────────────────

// interface ConfirmModalProps {
//   open: boolean;
//   title: string;
//   message: string;
//   confirmLabel?: string;
//   confirmClass?: string;
//   onConfirm: () => void;
//   onCancel: () => void;
// }

// function ConfirmModal({
//   open,
//   title,
//   message,
//   confirmLabel = "Confirm",
//   confirmClass = "bg-red-500 hover:bg-red-600 text-white",
//   onConfirm,
//   onCancel,
// }: ConfirmModalProps) {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
//       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-fade-in">
//         <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
//         <p className="text-sm text-gray-500 mb-5">{message}</p>
//         <div className="flex gap-3 justify-end">
//           <button
//             onClick={onCancel}
//             className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${confirmClass}`}
//           >
//             {confirmLabel}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Update Drawer ─────────────────────────────────────────────────────────────

// interface UpdateDrawerProps {
//   open: boolean;
//   row: PendingPaymentRow | null;
//   onClose: () => void;
//   onSave: (id: string, amount: number) => void;
// }

// function UpdateDrawer({ open, row, onClose, onSave }: UpdateDrawerProps) {
//   const [amount, setAmount] = useState("");

//   useEffect(() => {
//     if (row) setAmount(String(row.pendingAmount));
//   }, [row]);

//   if (!row) return null;

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
//         onClick={onClose}
//       />
//       {/* Drawer */}
//       <div
//         className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
//           <div>
//             <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Update Payment</p>
//             <h2 className="text-base font-semibold text-gray-900 mt-0.5">{row.vendorName}</h2>
//           </div>
//           <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
//             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {/* Body */}
//         <div className="flex-1 overflow-y-auto p-5 space-y-5">
//           <div>
//             <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
//               Pending Amount (₹)
//             </label>
//             <input
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A759]/30 focus:border-[#00A759] transition-colors"
//             />
//           </div>

//           <div>
//             <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Products</p>
//             <div className="space-y-2">
//               {row.products.map((p) => (
//                 <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
//                   <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
//                   <div className="flex-1 min-w-0">
//                     <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
//                     <p className="text-xs text-gray-400">{p.category}</p>
//                   </div>
//                   <div className="text-right shrink-0">
//                     <p className="text-sm font-semibold text-gray-800">₹{p.price.toLocaleString("en-IN")}</p>
//                     <p className="text-xs text-gray-400">Qty: {p.qty}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
//           <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium">
//             Cancel
//           </button>
//           <button
//             onClick={() => { onSave(row.id, Number(amount)); onClose(); }}
//             className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
//             style={{ backgroundColor: "#00A759" }}
//           >
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

// // ─── View Drawer ───────────────────────────────────────────────────────────────

// interface ViewDrawerProps {
//   open: boolean;
//   row: PendingPaymentRow | null;
//   onClose: () => void;
// }

// function ViewDrawer({ open, row, onClose }: ViewDrawerProps) {
//   if (!row) return null;

//   const grandTotal = row.products.reduce((sum, p) => sum + p.price * p.qty, 0);

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
//         onClick={onClose}
//       />
//       {/* Drawer */}
//       <div
//         className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
//       >
//         {/* Header */}
//         <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
//           <div>
//             <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Pending Payment Details</p>
//             <h2 className="text-base font-semibold text-gray-900 mt-0.5">{row.id}</h2>
//           </div>
//           <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors">
//             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {/* Vendor info */}
//         <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
//           <VendorAvatar initials={row.vendorAvatar} />
//           <div>
//             <p className="text-sm font-semibold text-gray-900">{row.vendorName}</p>
//             <p className="text-xs text-gray-400">Due: {new Date(row.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
//           </div>
//           <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
//             Pending
//           </span>
//         </div>

//         {/* Products */}
//         <div className="flex-1 overflow-y-auto p-5">
//           <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
//             {row.products.length} Product{row.products.length > 1 ? "s" : ""} with Pending Payment
//           </p>
//           <div className="space-y-3">
//             {row.products.map((p) => (
//               <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50/60 transition-colors">
//                 <img
//                   src={p.image}
//                   alt={p.name}
//                   className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100"
//                   onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&size=48&background=e5e7eb&color=374151`; }}
//                 />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-semibold text-gray-800 truncate">{p.name}</p>
//                   <p className="text-xs text-gray-400 mt-0.5">{p.category}</p>
//                   <p className="text-xs text-gray-400 mt-0.5">
//                     ₹{p.price.toLocaleString("en-IN")} × {p.qty}
//                   </p>
//                 </div>
//                 <div className="text-right shrink-0">
//                   <p className="text-sm font-bold text-gray-900">
//                     ₹{(p.price * p.qty).toLocaleString("en-IN")}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Footer totals */}
//         <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 space-y-2">
//           <div className="flex justify-between text-sm text-gray-500">
//             <span>Total Qty</span>
//             <span className="font-medium text-gray-700">
//               {row.products.reduce((s, p) => s + p.qty, 0)} items
//             </span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="font-semibold text-gray-700">Grand Total</span>
//             <span className="font-bold text-base" style={{ color: "#00A759" }}>
//               ₹{grandTotal.toLocaleString("en-IN")}
//             </span>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// // ─── Main Page ─────────────────────────────────────────────────────────────────

// export default function PendingPaymentsPage() {
//   const [data, setData] = useState<PendingPaymentRow[]>(MOCK_DATA);
//   const [filtered, setFiltered] = useState<PendingPaymentRow[]>(MOCK_DATA);

//   // Drawers
//   const [viewOpen, setViewOpen] = useState(false);
//   const [updateOpen, setUpdateOpen] = useState(false);
//   const [selectedRow, setSelectedRow] = useState<PendingPaymentRow | null>(null);

//   // Confirm modal
//   const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const PAGE_SIZE = 5;
//   const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
//   const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

//   // Search
//   function handleSearch(val: string) {
//     const q = val.toLowerCase();
//     setFiltered(data.filter((r) => r.vendorName.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)));
//     setCurrentPage(1);
//   }

//   // Delete
//   function handleDelete(id: string) {
//     const next = data.filter((r) => r.id !== id);
//     setData(next);
//     setFiltered(next);
//     setDeleteConfirm({ open: false, id: null });
//   }

//   // Update
//   function handleUpdate(id: string, amount: number) {
//     const next = data.map((r) => (r.id === id ? { ...r, pendingAmount: amount } : r));
//     setData(next);
//     setFiltered(next);
//   }

//   const columns = [
//     {
//       header: "Vendor",
//       headerClassName: "",
//       render: (row: PendingPaymentRow) => (
//         <div className="flex items-center gap-2.5">
//           <VendorAvatar initials={row.vendorAvatar} />
//           <div>
//             <p className="text-sm font-semibold text-gray-800">{row.vendorName}</p>
//             <p className="text-xs text-gray-400">{row.id}</p>
//           </div>
//         </div>
//       ),
//     },

//     {
//       header: "Products",
//       render: (row: PendingPaymentRow) => (
//         <span className="inline-flex items-center gap-1 text-sm text-gray-600">
//           <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
//             {row.products.length}
//           </span>
//           {row.products.length === 1 ? "item" : "items"}
//         </span>
//       ),
//     },
//     {
//       header: "Pending Amount",
//       render: (row: PendingPaymentRow) => (
//         <span className="text-sm font-bold text-red-500">
//           ₹{row.pendingAmount.toLocaleString("en-IN")}
//         </span>
//       ),
//     },
//     {
//       header: "Actions",
//       headerClassName: "text-right",
//       className: "text-right",
//       render: (row: PendingPaymentRow) => (
//         <div className="flex items-center gap-1.5 justify-end">
//           {/* View */}
//           <button
//             onClick={() => { setSelectedRow(row); setViewOpen(true); }}
//             title="View"
//             className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-[#00A759] hover:text-[#00A759] transition-colors"
//           >
//             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//               <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//             </svg>
//           </button>
//           {/* Update */}
//           <button
//             onClick={() => { setSelectedRow(row); setUpdateOpen(true); }}
//             title="Update"
//             className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
//           >
//             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//             </svg>
//           </button>
//           {/* Delete */}
//           <button
//             onClick={() => setDeleteConfirm({ open: true, id: row.id })}
//             title="Delete"
//             className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-red-500 hover:text-red-500 transition-colors"
//           >
//             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//             </svg>
//           </button>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="space-y-5">
//       {/* Page Header */}
//       <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm gap-3">
//         <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#00A759" }}>
//           <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//         </div>
//         <div>
//           <h1 className="text-lg font-bold text-gray-900">Pending Payments</h1>
//           <p className="text-sm text-gray-400">{data.length} vendors with outstanding payments</p>
//         </div>

//         {/* Summary chip */}
//         <div className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-100">
//           <span className="text-xs text-red-400 font-medium">Total Pending</span>
//           <span className="text-sm font-bold text-red-500">
//             ₹{data.reduce((s, r) => s + r.pendingAmount, 0).toLocaleString("en-IN")}
//           </span>
//         </div>
//       </div>

//       {/* Table */}
//       <CommonTable<PendingPaymentRow>
//         columns={columns}
//         data={paginated}
//         onSearch={handleSearch}
//         searchPlaceholder="Search by vendor or payment ID..."
//         showingText={`Showing ${paginated.length} of ${filtered.length} records`}
//         currentPage={currentPage}
//         totalPages={totalPages}
//         onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
//         onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//         gridTemplateColumns="2fr 1fr 1fr 1.5fr "
//         emptyMessage="No pending payments found."
//       />

//       {/* View Drawer */}
//       <ViewDrawer
//         open={viewOpen}
//         row={selectedRow}
//         onClose={() => { setViewOpen(false); setSelectedRow(null); }}
//       />

//       {/* Update Drawer */}
//       <UpdateDrawer
//         open={updateOpen}
//         row={selectedRow}
//         onClose={() => { setUpdateOpen(false); setSelectedRow(null); }}
//         onSave={handleUpdate}
//       />

//       {/* Delete Confirm Modal */}
//       <ConfirmModal
//         open={deleteConfirm.open}
//         title="Delete Pending Payment?"
"use client";

import { useState, useEffect } from "react";
import React from "react";
import CommonTable from "@/components/commonTable"; // adjust path as needed
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { fetchPendingPaymentsAsync, fetchOrderStatsAsync } from "@/store/slices/orderSlice";

// ─── Types ───────────────────────────────────────────────────────────────────

interface PendingProduct {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  qty: number;
}

interface PendingOrder {
  orderId: string;
  products: PendingProduct[];
}

interface PendingPaymentRow {
  id: string;
  vendorName: string;
  vendorAvatar: string;
  pendingAmount: number;
  orders: PendingOrder[];
}



// ─── Avatar Helper ─────────────────────────────────────────────────────────────

const AVATAR_COLORS: Record<string, string> = {
  SS: "bg-purple-100 text-purple-700",
  MC: "bg-blue-100 text-blue-700",
  UL: "bg-orange-100 text-orange-700",
};

function VendorAvatar({ initials }: { initials: string }) {
  const cls = AVATAR_COLORS[initials] ?? "bg-gray-100 text-gray-600";
  return (
    <span
      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${cls}`}
    >
      {initials}
    </span>
  );
}

// ─── Confirm Modal ─────────────────────────────────────────────────────────────

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmClass?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  confirmClass = "bg-red-500 hover:bg-red-600 text-white",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-5">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Update Drawer ─────────────────────────────────────────────────────────────

interface UpdateDrawerProps {
  open: boolean;
  row: PendingPaymentRow | null;
  onClose: () => void;
  onSave: (id: string, amount: number) => void;
}

function UpdateDrawer({ open, row, onClose, onSave }: UpdateDrawerProps) {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (row) setAmount(String(row.pendingAmount));
  }, [row]);

  if (!row) return null;

  const allProducts = row.orders.flatMap((o) => o.products);

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
              Update Payment
            </p>
            <h2 className="text-base font-semibold text-gray-900 mt-0.5">
              {row.vendorName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Pending Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A759]/30 focus:border-[#00A759] transition-colors"
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              All Pending Products
            </p>
            <div className="space-y-2">
              {allProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&size=40&background=e5e7eb&color=374151`;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-400">{p.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-semibold text-gray-800">
                      ₹{p.price.toLocaleString("en-IN")}
                    </p>
                    <p className="text-xs text-gray-400">Qty: {p.qty}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(row.id, Number(amount));
              onClose();
            }}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: "#00A759" }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
}

// ─── View Drawer ───────────────────────────────────────────────────────────────

interface ViewDrawerProps {
  open: boolean;
  row: PendingPaymentRow | null;
  onClose: () => void;
}

function ViewDrawer({ open, row, onClose }: ViewDrawerProps) {
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  // Reset expanded state when a new row opens
  useEffect(() => {
    setExpandedOrders(new Set());
  }, [row?.id]);

  if (!row) return null;

  function toggleOrder(orderId: string) {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  }

  const totalQty = row.orders
    .flatMap((o) => o.products)
    .reduce((s, p) => s + p.qty, 0);
  const grandTotal = row.orders
    .flatMap((o) => o.products)
    .reduce((s, p) => s + p.price * p.qty, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-50 bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
              Pending Payment Details
            </p>
            
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Vendor info strip */}
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3 bg-gray-50/50">
          <VendorAvatar initials={row.vendorAvatar} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {row.vendorName}
            </p>
           
          </div>
         
        </div>

        {/* Orders list */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {row.orders.length} Order{row.orders.length > 1 ? "s" : ""} with
            Pending Payment
          </p>

          {row.orders.map((order) => {
            const isExpanded = expandedOrders.has(order.orderId);
            const orderTotal = order.products.reduce(
              (s, p) => s + p.price * p.qty,
              0,
            );

            return (
              <div
                key={order.orderId}
                className="rounded-xl border border-gray-100 overflow-hidden"
              >
                {/* Order ID row — clickable */}
                <button
                  onClick={() => toggleOrder(order.orderId)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50/70 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    {/* Chevron */}
                    <svg
                      className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-90" : "rotate-0"}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-800">
                        {order.orderId}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.products.length} product
                        {order.products.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-red-500">
                    ₹{orderTotal.toLocaleString("en-IN")}
                  </span>
                </button>

                {/* Products — collapsible */}
                {isExpanded && (
                  <div className="border-t border-gray-100 divide-y divide-gray-50 bg-gray-50/40">
                    {order.products.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 px-4 py-3"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-11 h-11 rounded-xl object-cover shrink-0 border border-gray-100"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&size=44&background=e5e7eb&color=374151`;
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {p.name}
                          </p>
                          <p className="text-xs text-gray-400">{p.category}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            ₹{p.price.toLocaleString("en-IN")} × {p.qty}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-gray-900">
                            ₹{(p.price * p.qty).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer totals */}
        <div className="px-5 py-4 border-t border-gray-100 bg-gray-50/50 space-y-2">
          <div className="flex justify-between text-sm text-gray-500">
            <span>Total Qty</span>
            <span className="font-medium text-gray-700">{totalQty} items</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold text-gray-700">Grand Total</span>
            <span className="font-bold text-base" style={{ color: "#00A759" }}>
              ₹{grandTotal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function PendingPaymentsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { pendingPayments, pendingPagination, stats, loading } = useSelector((state: RootState) => state.order);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    dispatch(fetchOrderStatsAsync());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchPendingPaymentsAsync({ page: currentPage, limit: PAGE_SIZE, search: debouncedSearch }));
  }, [dispatch, currentPage, debouncedSearch]);

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PendingPaymentRow | null>(
    null,
  );

  const totalPages = Math.ceil(pendingPagination.totalRecords / PAGE_SIZE);

  function handleSearch(val: string) {
    setSearchQuery(val);
    setCurrentPage(1);
  }

  const columns = [
    {
      header: "Vendor",
      render: (row: PendingPaymentRow) => (
        <div className="flex items-center gap-2.5">
          <VendorAvatar initials={row.vendorAvatar} />
          <div>
            <p className="text-sm font-semibold text-gray-800">
              {row.vendorName}
            </p>
            <p className="text-xs text-gray-400">{row.id}</p>
          </div>
        </div>
      ),
    },
    
    {
      header: "Orders",
      render: (row: PendingPaymentRow) => (
        <span className="inline-flex items-center gap-1 text-sm text-gray-600">
          <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
            {row.orders.length}
          </span>
          {row.orders.length === 1 ? "order" : "orders"}
        </span>
      ),
    },
    {
      header: "Pending Amount",
      render: (row: PendingPaymentRow) => (
        <span className="text-sm font-bold text-red-500">
          ₹{row.pendingAmount.toLocaleString("en-IN")}
        </span>
      ),
    },
    {
      header: "Actions",
      headerClassName: "text-right",
      className: "text-right",
      render: (row: PendingPaymentRow) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            onClick={() => {
              setSelectedRow(row);
              setViewOpen(true);
            }}
            title="View"
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-[#00A759] hover:text-[#00A759] transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center "
          style={{ backgroundColor: "#00A759" }}
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h1 className="text-lg font-bold text-gray-900">Pending Payments</h1>
          <p className="text-sm text-gray-400">
            {pendingPagination.totalRecords} vendors with outstanding payments
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 border border-red-100">
          <span className="text-xs text-red-400 font-medium">
            Total Pending
          </span>
          <span className="text-sm font-bold text-red-500">
            ₹{stats.pendingAmount?.toLocaleString("en-IN") || 0}
          </span>
        </div>
      </div>

      {/* Table */}
      <CommonTable<PendingPaymentRow>
        columns={columns}
        data={pendingPayments}
        onSearch={handleSearch}
        searchPlaceholder="Search by vendor..."
        showingText={`Showing ${pendingPayments.length} of ${pendingPagination.totalRecords} records`}
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={() => setCurrentPage((p) => Math.max(1, p - 1))}
        onNext={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
        gridTemplateColumns="2fr 1fr 1fr 1.5fr"
        emptyMessage="No pending payments found."
      />

      <ViewDrawer
        open={viewOpen}
        row={selectedRow}
        onClose={() => {
          setViewOpen(false);
          setSelectedRow(null);
        }}
      />
    </div>
  );
}
