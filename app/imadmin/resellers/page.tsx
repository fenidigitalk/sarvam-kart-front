"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Eye, Edit2, X } from "lucide-react";
import { api } from "@/lib/axios";
import { toast } from "sonner";

const EditResellerModal = ({ isOpen, onClose, reseller, onSave }: { isOpen: boolean, onClose: () => void, reseller: any, onSave: () => void }) => {
  const [address, setAddress] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const [openingBalanceType, setOpeningBalanceType] = useState("collect");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reseller) {
      setAddress(reseller.address || "");
      setOpeningBalance(reseller.openingBalance === 0 ? "" : reseller.openingBalance.toString());
      setOpeningBalanceType(reseller.openingBalanceType || "collect");
    }
  }, [reseller]);

  if (!isOpen || !reseller) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload: any = { address };
      // Only send opening balance if it's currently 0 or not set, to match backend logic
      if (reseller.openingBalance === 0 && openingBalance !== "") {
        payload.openingBalance = Number(openingBalance);
        payload.openingBalanceType = openingBalanceType;
      }

      const res = await api.put(`/reseller/${reseller._id}`, payload);

      const data = res.data;
      if (data.status === "Success") {
        toast.success("Reseller updated successfully");
        onSave();
        onClose();
      } else {
        toast.error(data.message || "Failed to update reseller");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-lg">Edit Reseller</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00A759]/20 focus:border-[#00A759] outline-none transition-all text-sm resize-none"
              rows={3}
              placeholder="Enter full address"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Opening Balance (₹) {reseller.openingBalance > 0 && <span className="text-red-500 text-xs">(Cannot be changed once set)</span>}
            </label>
            <input
              type="number"
              value={openingBalance}
              onChange={(e) => setOpeningBalance(e.target.value)}
              disabled={reseller.openingBalance > 0}
              className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00A759]/20 focus:border-[#00A759] outline-none transition-all text-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Balance Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="balanceType"
                  value="collect"
                  checked={openingBalanceType === "collect"}
                  onChange={(e) => setOpeningBalanceType(e.target.value)}
                  disabled={reseller.openingBalance > 0}
                  className="accent-[#00A759] w-4 h-4"
                />
                To Collect (You receive)
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="radio"
                  name="balanceType"
                  value="pay"
                  checked={openingBalanceType === "pay"}
                  onChange={(e) => setOpeningBalanceType(e.target.value)}
                  disabled={reseller.openingBalance > 0}
                  className="accent-[#00A759] w-4 h-4"
                />
                To Pay (You owe)
              </label>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-[#00A759] text-white font-semibold text-sm hover:opacity-90 transition-all disabled:opacity-70 flex justify-center items-center"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function ResellersPage() {
  const [resellers, setResellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingReseller, setEditingReseller] = useState<any>(null);

  const fetchResellers = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/reseller?search=${search}&page=${page}&limit=${limit}`);
      const data = res.data;
      if (data.status === "Success") {
        setResellers(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
        }
      }
    } catch (error) {
      console.error("Error fetching resellers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    fetchResellers();
  }, [page, limit, search]);

  const openEditModal = (reseller: any) => {
    setEditingReseller(reseller);
    setIsEditModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <EditResellerModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        reseller={editingReseller} 
        onSave={fetchResellers} 
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Resellers</h1>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search resellers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00A759]/20 focus:border-[#00A759] outline-none transition-all text-sm"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Reseller Details
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Opening Balance
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Outstanding
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Loading resellers...
                  </td>
                </tr>
              ) : resellers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No resellers found.
                  </td>
                </tr>
              ) : (
                resellers.map((reseller) => (
                  <tr
                    key={reseller._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">
                          {reseller.name}
                        </span>
                        <span className="text-sm text-slate-500 truncate max-w-[200px]">
                          {reseller.address || "No address provided"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">
                        {reseller.number}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-900">
                          ₹{reseller.openingBalance}
                        </span>
                        <span className={`text-xs ${reseller.openingBalanceType === 'pay' ? 'text-red-500' : 'text-green-500'}`}>
                          To {reseller.openingBalanceType === 'pay' ? 'Pay' : 'Collect'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`font-medium ${reseller.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ₹{Math.abs(reseller.outstandingBalance || 0)}
                        </span>
                        <span className="text-xs text-slate-500">
                          {(reseller.outstandingBalance || 0) > 0 ? 'Pending Dues' : ((reseller.outstandingBalance || 0) < 0 ? 'Advance' : 'Settled')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(reseller)}
                          className="inline-flex items-center justify-center w-8 h-8 text-slate-500 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <Link
                          href={`/imadmin/resellers/${reseller._id}`}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#00A759] bg-[#00A759]/10 rounded-lg hover:bg-[#00A759]/20 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          Dashboard
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Rows per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="text-sm border border-slate-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-[#00A759]/20 focus:border-[#00A759]"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 text-sm border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-100 transition-colors"
              >
                Previous
              </button>
              <span className="text-sm font-medium text-slate-700">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 text-sm border border-slate-200 rounded-lg disabled:opacity-50 hover:bg-slate-100 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
