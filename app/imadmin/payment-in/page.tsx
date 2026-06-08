"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/axios";
import { CreditCard, CheckCircle, Clock, User, Search } from "lucide-react";
import { toast } from "sonner";

export default function PaymentInPage() {
  const [resellers, setResellers] = useState<any[]>([]);
  const [selectedResellerId, setSelectedResellerId] = useState<string>("");
  const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);
  
  const [selectedOrders, setSelectedOrders] = useState<any[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<number | string>("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [notes, setNotes] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  // Fetch all resellers on mount
  useEffect(() => {
    const fetchResellers = async () => {
      try {
        const res = await api.get(`/reseller?limit=1000`);
        if (res.data.status === "Success") {
          setResellers(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching resellers", error);
        toast.error("Failed to load resellers");
      } finally {
        setFetchingData(false);
      }
    };
    fetchResellers();
  }, []);

  // Fetch pending invoices when a reseller is selected
  const fetchPendingInvoices = async (resellerId: string) => {
    if (!resellerId) {
      setPendingInvoices([]);
      return;
    }
    setFetchingData(true);
    try {
      const res = await api.get(`/reseller/${resellerId}/pending-invoices`);
      if (res.data.status === "Success") {
        setPendingInvoices(res.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load pending invoices");
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    fetchPendingInvoices(selectedResellerId);
    setPaymentAmount("");
    setNotes("");
  }, [selectedResellerId]);

  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  // Calculate allocations based on manually selected orders and entered payment amount
  const calculatedAllocations = React.useMemo(() => {
    const amount = Number(paymentAmount) || 0;
    if (amount <= 0 || selectedOrderIds.length === 0) return [];
    
    let remainingAmount = amount;
    const allocations = [];
    
    for (const orderId of selectedOrderIds) {
      if (remainingAmount <= 0) break;
      const order = pendingInvoices.find(o => o._id === orderId);
      if (!order) continue;
      
      const orderPending = order.totalAmount;
      if (remainingAmount >= orderPending) {
        allocations.push({ orderId: order._id, allocatedAmount: orderPending, orderNumber: order.orderNumber });
        remainingAmount -= orderPending;
      } else {
        allocations.push({ orderId: order._id, allocatedAmount: remainingAmount, orderNumber: order.orderNumber });
        remainingAmount = 0;
      }
    }
    return allocations;
  }, [paymentAmount, selectedOrderIds, pendingInvoices]);


  const handlePayment = async () => {
    if (!selectedResellerId) {
      toast.error("Please select a reseller first");
      return;
    }
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      toast.error("Please enter a valid amount");
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
        fetchPendingInvoices(selectedResellerId);
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

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animation-fade-in">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-600" /> Payment In
          </h1>
          <p className="text-slate-500 text-sm mt-1">Record payments received from resellers</p>
        </div>
        
        <div className="w-full md:w-80 relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <User className="w-4 h-4 text-slate-400" />
          </div>
          <select
            value={selectedResellerId}
            onChange={(e) => setSelectedResellerId(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none appearance-none transition-all text-sm font-medium text-slate-700"
          >
            <option value="">Select a Reseller...</option>
            {resellers.map((r) => (
              <option key={r._id} value={r.userId || r._id}>
                {r.name} ({r.number})
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <Search className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {selectedResellerId ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Invoices Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="font-semibold text-slate-800 text-lg">Pending Invoices</h3>
                <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">{pendingInvoices.length} Unpaid</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase w-12 text-center">Select</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Order #</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Total Amount</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {fetchingData ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
                        </td>
                      </tr>
                    ) : pendingInvoices.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500 bg-slate-50/50">
                          <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                          <p className="font-medium text-slate-700">No pending invoices</p>
                          <p className="text-sm">This reseller's account is clear.</p>
                        </td>
                      </tr>
                    ) : (
                      pendingInvoices.map((order) => {
                        const isSelected = selectedOrderIds.includes(order._id);
                        return (
                          <tr key={order._id} className={`transition-colors ${isSelected ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'}`}>
                            <td className="px-6 py-4 text-center">
                              <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={() => {
                                  if (isSelected) {
                                    setSelectedOrderIds(prev => prev.filter(id => id !== order._id));
                                  } else {
                                    setSelectedOrderIds(prev => [...prev, order._id]);
                                  }
                                }}
                                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                              />
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                            <td className="px-6 py-4 text-sm font-medium text-indigo-600">#{order.orderNumber}</td>
                            <td className="px-6 py-4 text-sm font-bold text-slate-900">₹{order.totalAmount}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3 h-3" /> {order.paymentStatus || 'Pending'}
                              </span>
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
                <CreditCard className="w-5 h-5 text-indigo-500" /> Record Payment In
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
                      className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-lg font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Payment Mode</label>
                  <select
                    value={paymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm"
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
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-sm resize-none"
                  ></textarea>
                </div>

                {calculatedAllocations.length > 0 && (
                  <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mt-2">
                    <p className="text-xs font-semibold text-indigo-800 uppercase tracking-wider mb-2">Payment Allocation</p>
                    <ul className="space-y-1.5 text-sm text-indigo-900">
                      {calculatedAllocations.map((alloc, idx) => (
                        <li key={idx} className="flex justify-between items-center">
                          <span>Order #{alloc.orderNumber}</span>
                          <span className="font-bold">₹{alloc.allocatedAmount}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={loading || !paymentAmount || Number(paymentAmount) <= 0 || pendingInvoices.length === 0}
                  className="w-full py-3.5 mt-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-medium shadow-md shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-indigo-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Select a Reseller</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Choose a reseller from the dropdown above to view their pending invoices and record a new payment.
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
      `}</style>
    </div>
  );
}
