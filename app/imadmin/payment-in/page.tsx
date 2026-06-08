"use client";

import React, { useState, useEffect, useRef } from "react";
import { api } from "@/lib/axios";
import { CreditCard, CheckCircle, Clock, User, Search, ChevronDown, Check, AlertCircle, Plus, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function PaymentInPage() {
  const [view, setView] = useState<"list" | "form">("list");

  // --- List View States ---
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const fetchPayments = async () => {
    setPaymentsLoading(true);
    try {
      const res = await api.get(`/payment?page=${page}&limit=${limit}&search=${search}`);
      const data = res.data;
      if (data.status === "Success") {
        setPayments(data.data);
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages || 1);
        }
      }
    } catch (error) {
      console.error("Error fetching payments", error);
      toast.error("Failed to load payments");
    } finally {
      setPaymentsLoading(false);
    }
  };

  useEffect(() => {
    if (view === "list") {
      fetchPayments();
    }
  }, [page, limit, search, view]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  // --- Form View States ---
  const [resellers, setResellers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [selectedResellerId, setSelectedResellerId] = useState<string>("");
  const [selectedResellerName, setSelectedResellerName] = useState<string>("");
  
  const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  
  const [paymentAmount, setPaymentAmount] = useState<number | string>("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [notes, setNotes] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch resellers based on search
  useEffect(() => {
    if (view !== "form") return;
    const fetchResellers = async () => {
      try {
        const res = await api.get(`/reseller?search=${searchQuery}&limit=20`);
        if (res.data.status === "Success") {
          setResellers(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching resellers", error);
      }
    };
    
    const timeoutId = setTimeout(() => {
      fetchResellers();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [searchQuery, view]);

  // Fetch pending invoices when a reseller is selected
  const fetchPendingInvoices = async (resellerId: string) => {
    if (!resellerId) {
      setPendingInvoices([]);
      return;
    }
    setFetchingData(true);
    try {
      const res = await api.get(`/reseller/${resellerId}/pending-invoices?limit=100`);
      if (res.data.status === "Success") {
        const sorted = res.data.data.sort((a: any, b: any) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        setPendingInvoices(sorted);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load pending invoices");
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    if (view === "form" && selectedResellerId) {
      fetchPendingInvoices(selectedResellerId);
    }
    setPaymentAmount("");
    setNotes("");
    setSelectedOrderIds([]);
  }, [selectedResellerId, view]);

  const calculatedAllocations = React.useMemo(() => {
    const amount = Number(paymentAmount) || 0;
    if (amount <= 0 || pendingInvoices.length === 0 || selectedOrderIds.length === 0) return [];
    
    let remainingAmount = amount;
    const allocations = [];
    
    // Allocate based on the exact order the user selected the checkboxes
    const checkedInvoices = selectedOrderIds
      .map(id => pendingInvoices.find(o => o._id === id))
      .filter(Boolean);

    for (const order of checkedInvoices) {
      if (remainingAmount <= 0) break;
      
      const orderPending = order.pendingAmount !== undefined ? order.pendingAmount : order.totalAmount; 
      
      if (remainingAmount >= orderPending) {
        allocations.push({ 
          orderId: order._id, 
          allocatedAmount: orderPending, 
          orderNumber: order.orderNumber,
          type: "full" 
        });
        remainingAmount -= orderPending;
      } else {
        allocations.push({ 
          orderId: order._id, 
          allocatedAmount: remainingAmount, 
          orderNumber: order.orderNumber,
          type: "partial" 
        });
        remainingAmount = 0;
      }
    }
    return allocations;
  }, [paymentAmount, pendingInvoices, selectedOrderIds]);

  const unallocatedAmount = React.useMemo(() => {
    const amount = Number(paymentAmount) || 0;
    const allocated = calculatedAllocations.reduce((sum, a) => sum + a.allocatedAmount, 0);
    return amount - allocated;
  }, [paymentAmount, calculatedAllocations]);

  const handlePayment = async () => {
    if (!selectedResellerId) {
      toast.error("Please select a reseller first");
      return;
    }
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (calculatedAllocations.length === 0) {
      toast.error("Amount is zero or no selected invoices to allocate");
      return;
    }
    
    setLoading(true);
    try {
      const res = await api.post(`/payment/payment-in`, {
        resellerId: selectedResellerId,
        amount: Number(paymentAmount),
        allocations: calculatedAllocations.map(a => ({ orderId: a.orderId, allocatedAmount: a.allocatedAmount })),
        paymentMode,
        notes
      });
      const data = res.data;
      if (data.status === "Success") {
        toast.success("Payment recorded successfully");
        setPaymentAmount("");
        setNotes("");
        setSelectedResellerId("");
        setSelectedResellerName("");
        setPendingInvoices([]);
        setView("list"); // Switch back to list after success
      } else {
        toast.error(data.message || "Failed to record payment");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const totalPendingAmount = pendingInvoices.reduce((sum, order) => {
    return sum + (order.pendingAmount !== undefined ? order.pendingAmount : order.totalAmount);
  }, 0);

  if (view === "list") {
    return (
      <div className="space-y-6 max-w-7xl mx-auto pb-12 animation-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              <CreditCard className="w-6 h-6 text-[#00A759]" /> Payment In
            </h1>
            <p className="text-slate-500 text-sm mt-1">Manage and view all received payments</p>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search payments..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00A759]/20 focus:border-[#00A759] outline-none transition-all text-sm"
              />
            </div>
            <button
              onClick={() => setView("form")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#00A759] text-white rounded-xl font-medium shadow-md shadow-[#00A759]/20 hover:bg-[#008f4c] transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add Payment
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date & Ref</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Reseller</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Mode</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paymentsLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="w-6 h-6 border-2 border-[#00A759]/30 border-t-[#00A759] rounded-full animate-spin mx-auto"></div>
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 bg-slate-50/50">
                      <p className="font-medium text-slate-700">No payments found</p>
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{payment.paymentNumber}</div>
                        <div className="text-sm text-slate-500">{new Date(payment.createdAt).toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        {payment.userId ? (
                          <>
                            <div className="font-medium text-slate-900">{payment.userId.name || payment.userId.fullName}</div>
                            <div className="text-sm text-slate-500">{payment.userId.number}</div>
                          </>
                        ) : (
                          <span className="text-slate-400">Unknown</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 uppercase">
                          {payment.paymentMode}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-[#00A759]">₹{payment.amount.toFixed(2)}</div>
                        {payment.allocations && payment.allocations.length > 0 && (
                          <div className="text-xs text-slate-500 mt-0.5">{payment.allocations.length} order(s)</div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {!paymentsLoading && totalPages > 1 && (
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

        <style jsx global>{`
          .animation-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  // --- FORM VIEW ---
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animation-fade-in">
      <div className="flex items-center gap-4 mb-2">
        <button 
          onClick={() => setView("list")}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-slate-800">Record New Payment</h2>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2">
            1. Select Reseller
          </h1>
        </div>
        
        {/* Searchable Custom Dropdown */}
        <div className="w-full md:w-80 relative" ref={dropdownRef}>
          <div 
            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors flex items-center justify-between"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <User className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-sm font-medium text-slate-700 truncate">
              {selectedResellerName || "Search and Select..."}
            </span>
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
          
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animation-dropdown">
              <div className="p-2 border-b border-slate-100 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search name or number..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#00A759]/20 focus:border-[#00A759]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="max-h-60 overflow-y-auto py-1">
                {resellers.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-slate-500 text-center">No resellers found</div>
                ) : (
                  resellers.map((r) => (
                    <div 
                      key={r._id} 
                      className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-slate-50 flex items-center justify-between ${selectedResellerId === (r.userId || r._id) ? 'bg-[#00A759]/5' : ''}`}
                      onClick={() => {
                        setSelectedResellerId(r.userId || r._id);
                        setSelectedResellerName(`${r.name} (${r.number})`);
                        setIsDropdownOpen(false);
                        setSearchQuery("");
                      }}
                    >
                      <div>
                        <div className="font-medium text-slate-800">{r.name}</div>
                        <div className="text-xs text-slate-500">{r.number}</div>
                      </div>
                      {selectedResellerId === (r.userId || r._id) && (
                        <Check className="w-4 h-4 text-[#00A759]" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedResellerId ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Invoices Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="font-semibold text-slate-800 text-lg">Pending Invoices</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Orders will be paid from oldest to newest.</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-slate-500 uppercase font-semibold">Total Due</p>
                    <p className="font-bold text-red-600 text-lg">₹{totalPendingAmount.toFixed(2)}</p>
                  </div>
                  <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1.5 rounded-lg">{pendingInvoices.length} Unpaid</span>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase w-12 text-center">
                        <input
                          type="checkbox"
                          checked={selectedOrderIds.length === pendingInvoices.length && pendingInvoices.length > 0}
                          onChange={(e) => {
                            if (e.target.checked) {
                              // If checked all, maybe only select what fits? But user might not want to check all if it's limited.
                              // Let's just allow check all, but the actual allocation will stop at the payment limit.
                              setSelectedOrderIds(pendingInvoices.map(o => o._id));
                            } else {
                              setSelectedOrderIds([]);
                            }
                          }}
                          disabled={Number(paymentAmount) <= 0}
                          className="w-4 h-4 text-[#00A759] rounded border-slate-300 focus:ring-[#00A759] cursor-pointer accent-[#00A759] disabled:opacity-50"
                        />
                      </th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date & Order #</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Amount Due</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Payment Allocated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fetchingData ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="w-6 h-6 border-2 border-[#00A759]/30 border-t-[#00A759] rounded-full animate-spin mx-auto"></div>
                        </td>
                      </tr>
                    ) : pendingInvoices.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500 bg-slate-50/50">
                          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                          <p className="font-medium text-slate-700">No pending invoices</p>
                          <p className="text-sm">This reseller's account is clear.</p>
                        </td>
                      </tr>
                    ) : (
                      pendingInvoices.map((order) => {
                        const isChecked = selectedOrderIds.includes(order._id);
                        const allocation = calculatedAllocations.find(a => a.orderId === order._id);
                        const orderPendingAmount = order.pendingAmount !== undefined ? order.pendingAmount : order.totalAmount;
                        
                        const amountEntered = Number(paymentAmount) || 0;
                        const isDisabled = amountEntered <= 0 || (!isChecked && unallocatedAmount <= 0);
                        
                        return (
                          <tr key={order._id} className={`transition-colors ${allocation ? (allocation.type === 'full' ? 'bg-[#00A759]/5' : 'bg-amber-50') : 'hover:bg-slate-50/50'}`}>
                            <td className="px-6 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                disabled={isDisabled}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedOrderIds(prev => [...prev, order._id]);
                                  } else {
                                    setSelectedOrderIds(prev => prev.filter(id => id !== order._id));
                                  }
                                }}
                                className="w-4 h-4 text-[#00A759] rounded border-slate-300 focus:ring-[#00A759] cursor-pointer accent-[#00A759] disabled:opacity-50 disabled:cursor-not-allowed"
                              />
                            </td>
                            <td className="px-6 py-4">
                              {allocation ? (
                                allocation.type === 'full' ? (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-[#00A759]/10 text-[#00A759]">
                                    <CheckCircle className="w-3.5 h-3.5" /> Fully Paid
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-700">
                                    <AlertCircle className="w-3.5 h-3.5" /> Partially Paid
                                  </span>
                                )
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                                  <Clock className="w-3 h-3" /> Unpaid
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-medium text-[#00A759]">#{order.orderNumber}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-bold text-slate-900">₹{orderPendingAmount}</div>
                              {order.totalAmount !== orderPendingAmount && (
                                <div className="text-xs text-slate-500 mt-0.5">Total: ₹{order.totalAmount}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {allocation ? (
                                <div className="font-bold text-lg text-slate-900">
                                  ₹{allocation.allocatedAmount.toFixed(2)}
                                </div>
                              ) : (
                                <span className="text-slate-400 font-medium">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payment Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-6">
              <h3 className="font-bold text-slate-900 text-lg mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#00A759]" /> 2. Record Payment
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount Received (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">₹</span>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00A759]/20 focus:border-[#00A759] outline-none transition-all text-lg font-bold text-slate-900"
                    />
                  </div>
                  {Number(paymentAmount) > totalPendingAmount && totalPendingAmount > 0 && (
                    <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Amount exceeds total pending dues.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00A759]/20 focus:border-[#00A759] outline-none transition-all text-sm"
                  >
                    <option value="cash">Cash</option>
                    <option value="online">Online / UPI</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    placeholder="Transaction ID or reference..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00A759]/20 focus:border-[#00A759] outline-none transition-all text-sm resize-none"
                  ></textarea>
                </div>

                {calculatedAllocations.length > 0 && (
                  <div className="bg-[#00A759]/5 p-4 rounded-xl border border-[#00A759]/20 mt-2">
                    <div className="flex justify-between items-center mb-3">
                      <p className="text-xs font-bold text-[#00A759] uppercase tracking-wider">Allocation Summary</p>
                      <span className="text-xs font-medium text-[#00A759] bg-[#00A759]/10 px-2 py-0.5 rounded-full">
                        {calculatedAllocations.length} order(s)
                      </span>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-700 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                      {calculatedAllocations.map((alloc, idx) => (
                        <li key={idx} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                          <div>
                            <span className="font-medium block">#{alloc.orderNumber}</span>
                            <span className={`text-[10px] font-bold uppercase ${alloc.type === 'full' ? 'text-[#00A759]' : 'text-amber-600'}`}>
                              {alloc.type}
                            </span>
                          </div>
                          <span className="font-bold">₹{alloc.allocatedAmount.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={loading || !paymentAmount || Number(paymentAmount) <= 0 || pendingInvoices.length === 0}
                  className="w-full py-3.5 mt-4 bg-[#00A759] hover:bg-[#008f4c] text-white rounded-xl font-semibold shadow-lg shadow-[#00A759]/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Confirm Payment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <Search className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Select a Reseller</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Search and select a reseller from the dropdown above to view their pending invoices and automatically allocate payments.
          </p>
        </div>
      )}

      <style jsx global>{`
        .animation-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animation-dropdown {
          animation: slideDown 0.2s ease-out forwards;
          transform-origin: top;
        }
        @keyframes slideDown {
          from { opacity: 0; transform: scaleY(0.95); }
          to { opacity: 1; transform: scaleY(1); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
