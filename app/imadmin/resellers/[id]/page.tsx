"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { CreditCard, User, BookOpen, BarChart3, ArrowLeft, Download, FileText, CheckCircle, Clock, History } from "lucide-react";
import { toast } from "sonner";
import Pagination from "@/components/Pagination";

// --- Tab Components ---

const LedgerTab = ({ resellerId, onBalanceUpdate }: { resellerId: string, onBalanceUpdate?: (balance: number) => void }) => {
  const [ledger, setLedger] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const fetchLedger = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/reseller/${resellerId}/ledger?page=${page}&limit=50`);
      if (res.data.status === "Success") {
        setLedger(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
        
        // Update total balance if we are on the last page or if it's the first fetch
        if (res.data.data.length > 0) {
          const lastItem = res.data.data[res.data.data.length - 1];
          if (onBalanceUpdate && page === res.data.pagination.totalPages) {
            onBalanceUpdate(lastItem.balance);
          }
        }
      }
    } catch (err) {
      toast.error("Failed to load ledger");
    } finally {
      setLoading(false);
    }
  }, [resellerId, onBalanceUpdate]);

  useEffect(() => {
    fetchLedger(currentPage);
  }, [currentPage, fetchLedger]);

  const downloadFile = async (type: "pdf" | "excel") => {
    try {
      const res = await api.get(`/reseller/${resellerId}/ledger/${type}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ledger-${resellerId}.${type === "pdf" ? "pdf" : "xlsx"}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error(`Failed to download ${type.toUpperCase()}`);
    }
  };

  const totalSales = ledger.filter(t => t.type === 'sales_invoice').reduce((sum, t) => sum + (t.debit || 0), 0);
  const totalReceived = ledger.filter(t => t.type === 'payment_in').reduce((sum, t) => sum + (t.credit || 0), 0);

  return (
    <div className="space-y-6 animation-fade-in">
      <div className="flex justify-end gap-3">
        <button onClick={() => downloadFile("excel")} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition shadow-sm font-medium text-sm">
          <Download className="w-4 h-4" /> Download Excel
        </button>
        <button onClick={() => downloadFile("pdf")} className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition shadow-sm font-medium text-sm">
          <FileText className="w-4 h-4" /> Print PDF
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Voucher Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Notes</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Debit</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Credit</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase bg-slate-100/50">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ledger.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No ledger entries found</td>
                </tr>
              ) : (
                ledger.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">{new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      {item.type === 'opening_balance' ? 'Opening Balance' : item.type === 'sales_invoice' ? 'Sales Invoices' : 'Payment In'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{item.notes || '-'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-red-500">{item.debit > 0 ? `₹${item.debit}` : '-'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-green-500">{item.credit > 0 ? `₹${item.credit}` : '-'}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800 bg-slate-50/30">₹{item.balance}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

const TransactionsHistoryTab = ({ resellerId }: { resellerId: string }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchTransactions = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/reseller/${resellerId}/transactions?page=${page}&limit=15`);
      if (res.data.status === "Success") {
        setTransactions(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, [resellerId]);

  useEffect(() => {
    fetchTransactions(currentPage);
  }, [currentPage, fetchTransactions]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[300px] animation-fade-in">
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-lg">Transaction History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Type</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Notes</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.length === 0 && !loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No transactions found</td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">{new Date(t.date || t.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                      t.entryType === 'credit' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {t.type === 'payment_in' ? 'Payment In' : t.type === 'sales_invoice' ? 'Sales Invoice' : 'Opening Balance'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{t.notes || '-'}</td>
                  <td className={`px-6 py-4 text-right font-bold ${t.entryType === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.entryType === 'credit' ? '+' : '-'}₹{t.amount}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

const PendingInvoicesTab = ({ resellerId }: { resellerId: string }) => {
  const [pendingInvoices, setPendingInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedOrders, setSelectedOrders] = useState<any[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<number | string>("");
  const [paymentMode, setPaymentMode] = useState("cash");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInvoices = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/reseller/${resellerId}/pending-invoices?page=${page}&limit=10`);
      if (res.data.status === "Success") {
        setPendingInvoices(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }, [resellerId]);

  useEffect(() => {
    fetchInvoices(currentPage);
  }, [currentPage, fetchInvoices]);

  // Automatically select orders based on entered amount
  useEffect(() => {
    if (!paymentAmount || isNaN(Number(paymentAmount))) {
      setSelectedOrders([]);
      return;
    }

    let remainingAmount = Number(paymentAmount);
    const allocations = [];

    for (const order of pendingInvoices) {
      if (remainingAmount <= 0) break;
      const orderPending = order.totalAmount; 
      
      if (remainingAmount >= orderPending) {
        allocations.push({ orderId: order._id, allocatedAmount: orderPending, orderNumber: order.orderNumber });
        remainingAmount -= orderPending;
      } else {
        allocations.push({ orderId: order._id, allocatedAmount: remainingAmount, orderNumber: order.orderNumber });
        remainingAmount = 0;
      }
    }
    
    setSelectedOrders(allocations);
  }, [paymentAmount, pendingInvoices]);

  const handlePayment = async () => {
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await api.post(`/payment/payment-in`, {
        resellerId,
        amount: Number(paymentAmount),
        allocations: selectedOrders.map(a => ({ orderId: a.orderId, allocatedAmount: a.allocatedAmount })),
        paymentMode,
        notes
      });
      if (res.data.status === "Success") {
        toast.success("Payment recorded successfully");
        setPaymentAmount("");
        setNotes("");
        fetchInvoices(1); // Reset to page 1
      } else {
        toast.error(res.data.message || "Failed to record payment");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animation-fade-in">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[300px]">
          {loading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          )}
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-semibold text-slate-800 text-lg">Pending Invoices</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Order #</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Total Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingInvoices.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No pending invoices found</td>
                  </tr>
                ) : (
                  pendingInvoices.map((order) => {
                    const allocation = selectedOrders.find(a => a.orderId === order._id);
                    return (
                      <tr key={order._id} className={`transition-colors ${allocation ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'}`}>
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
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>

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

            {selectedOrders.length > 0 && (
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mt-2">
                <p className="text-xs font-semibold text-indigo-800 uppercase tracking-wider mb-2">Payment Allocation</p>
                <ul className="space-y-1.5 text-sm text-indigo-900">
                  {selectedOrders.map((alloc, idx) => (
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
              disabled={isSubmitting || !paymentAmount || Number(paymentAmount) <= 0}
              className="w-full py-3.5 mt-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-medium shadow-md shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
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
  );
};

const ReportTab = ({ resellerId }: { resellerId: string }) => {
  const [report, setReport] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReport = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/reseller/${resellerId}/item-report?page=${page}&limit=10`);
      if (res.data.status === "Success") {
        setReport(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      toast.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  }, [resellerId]);

  useEffect(() => {
    fetchReport(currentPage);
  }, [currentPage, fetchReport]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animation-fade-in relative min-h-[300px]">
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      )}
      <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-lg">Item Wise Purchase Report</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Product Details</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">SKU</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Total Quantity Bought</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Total Spent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {report.length === 0 && !loading ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-slate-500">No purchases found</td>
              </tr>
            ) : (
              report.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-900">{item.title}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.sku || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-sm">
                      {item.totalQuantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    ₹{item.totalSpent}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

// --- Main Page ---

export default function ResellerDashboard() {
  const params = useParams();
  const router = useRouter();
  const resellerId = params.id as string;

  const [activeTab, setActiveTab] = useState("ledger");
  const [balance, setBalance] = useState<number>(0);

  // We can fetch balance on load to populate the header
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await api.get(`/reseller/${resellerId}/ledger?page=1&limit=1`);
        if (res.data.status === "Success" && res.data.data.length > 0) {
          // Note: A 1-limit ledger call gets the oldest item. To get latest balance, 
          // we should ideally add a stats endpoint. For now, we'll let the Ledger tab update it.
        }
      } catch (e) {
        // Handle silently
      }
    };
    fetchBalance();
  }, [resellerId]);

  const tabs = [
    { id: "ledger", label: "Ledger (Statement)", icon: BookOpen },
    { id: "transactions", label: "Transactions History", icon: History },
    { id: "report", label: "Item Wise Report", icon: BarChart3 },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Resellers
      </button>

      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
              <User className="w-10 h-10 text-indigo-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-1 text-white">Reseller Dashboard</h1>
              <p className="text-indigo-200/80 font-medium">Manage payments, statements, and reports</p>
            </div>
          </div>
          <div className="bg-white/10 px-6 py-4 rounded-2xl border border-white/20 backdrop-blur-sm">
            <span className="block text-indigo-200/80 text-sm font-medium mb-1">Current Outstanding Balance</span>
            <span className="text-3xl font-bold text-white tracking-tight">
              ₹{balance}
            </span>
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto hide-scrollbar gap-2 p-1 bg-white rounded-2xl shadow-sm border border-slate-100">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                isActive 
                  ? "bg-indigo-50 text-indigo-700 shadow-sm" 
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6">
        {activeTab === "ledger" && <LedgerTab resellerId={resellerId} onBalanceUpdate={setBalance} />}
        {activeTab === "transactions" && <TransactionsHistoryTab resellerId={resellerId} />}
        {activeTab === "report" && <ReportTab resellerId={resellerId} />}
        {activeTab === "profile" && (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center text-slate-500">
            <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p>Profile details management coming soon.</p>
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
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
