"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Phone, KeyRound, ArrowLeft, Edit3, X, Check, FileText, Download, History, CreditCard, Clock, BarChart3 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { requestOtp, updateUserProfile, logout } from "@/store/slices/authSlice";
import { fetchMyOrderStatsAsync } from "@/store/slices/orderSlice";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import Pagination from "@/components/Pagination";

const getDateRange = (filter: string) => {
  if (!filter || filter === "all") return { startDate: "", endDate: "" };
  
  const end = new Date();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  
  switch (filter) {
    case "today":
      break;
    case "last7days":
      start.setDate(end.getDate() - 7);
      break;
    case "last30days":
      start.setDate(end.getDate() - 30);
      break;
    case "last365days":
      start.setDate(end.getDate() - 365);
      break;
    case "thisweek":
      const day = start.getDay();
      const diff = start.getDate() - day + (day === 0 ? -6 : 1);
      start.setDate(diff);
      break;
    case "thismonth":
      start.setDate(1);
      break;
  }
  return { startDate: start.toISOString(), endDate: end.toISOString() };
};

// --- Tab Components ---

const LedgerTab = ({ user }: { user: any }) => {
  const [ledger, setLedger] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateFilter, setDateFilter] = useState("all");
  const [finalBalance, setFinalBalance] = useState<number>(0);
  
  const fetchLedger = useCallback(async (page: number, filter: string) => {
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRange(filter);
      const url = `/reseller/my-ledger?page=${page}&limit=50${startDate ? `&startDate=${startDate}&endDate=${endDate}` : ''}`;
      const res = await api.get(url);
      if (res.data.status === "Success") {
        setLedger(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
        setFinalBalance(res.data.finalBalance || 0);
      }
    } catch (err) {
      toast.error("Failed to load ledger");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLedger(currentPage, dateFilter);
  }, [currentPage, dateFilter, fetchLedger]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter]);

  const downloadFile = async (type: "pdf" | "excel") => {
    try {
      const { startDate, endDate } = getDateRange(dateFilter);
      let endpointUrl = `/reseller/${user._id}/ledger/${type}`;
      if (startDate) endpointUrl += `?startDate=${startDate}&endDate=${endDate}`;

      const res = await api.get(endpointUrl, { responseType: 'blob' });
      const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', `ledger-${user._id}.${type === "pdf" ? "pdf" : "xlsx"}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error(`Failed to download ${type.toUpperCase()}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl relative min-h-[400px]"
    >
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-[#00A759] rounded-full animate-spin"></div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Account Ledger</h3>
          <p className="text-xs text-slate-500 mt-1">Detailed statement of your account activities.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
          <select 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="thisweek">This Week</option>
            <option value="thismonth">This Month</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last365days">Last 365 Days</option>
          </select>
          <div className="flex gap-2">
          <button onClick={() => downloadFile("pdf")} className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border border-red-100">
            <Download className="w-4 h-4" /> PDF
          </button>
          <button onClick={() => downloadFile("excel")} className="flex items-center gap-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer border border-emerald-100">
            <Download className="w-4 h-4" /> Excel
          </button>
        </div>
        </div>
      </div>

      {ledger.length === 0 && !loading ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800">No Records Found</h4>
          <p className="text-sm text-slate-500">Your ledger statement is currently empty.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Voucher Type</th>
                <th className="py-3 px-4 font-semibold text-right">Debit (In)</th>
                <th className="py-3 px-4 font-semibold text-right">Credit (Out)</th>
                <th className="py-3 px-4 font-semibold text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {ledger.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    {new Date(item.date).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short", year: "numeric"
                    })}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md text-xs">
                      {item.type === 'opening_balance' ? 'Opening Balance' : item.type === 'sales_invoice' ? 'Sales Invoice' : item.type === 'payment_in' ? 'Payment In' : item.type}
                    </span>
                    {item.notes && <p className="text-[10px] text-slate-400 mt-1">{item.notes}</p>}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-red-600">
                    {item.debit > 0 ? `₹${item.debit.toLocaleString("en-IN")}` : "-"}
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-[#00A759]">
                    {item.credit > 0 ? `₹${item.credit.toLocaleString("en-IN")}` : "-"}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 bg-slate-50/50">
                    ₹{Math.abs(item.balance || 0).toLocaleString("en-IN")}
                    <span className="text-[10px] font-normal text-slate-500 ml-1">
                      {(item.balance || 0) > 0 ? 'Dr' : ((item.balance || 0) < 0 ? 'Cr' : '')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && (
            <div className="flex justify-end p-4 border-t border-slate-100 bg-slate-50">
              <div className="text-right">
                <span className="text-sm font-semibold text-slate-500 uppercase mr-4">Closing Balance:</span>
                <span className={`text-lg font-bold ${finalBalance > 0 ? 'text-red-600' : 'text-[#00A759]'}`}>
                  ₹{Math.abs(finalBalance).toLocaleString("en-IN")}
                  <span className="text-sm font-medium ml-1">
                    {finalBalance > 0 ? 'Dr' : (finalBalance < 0 ? 'Cr' : '')}
                  </span>
                </span>
              </div>
            </div>
          )}
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </motion.div>
  );
};

const TransactionsHistoryTab = ({ user }: { user: any }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [dateFilter, setDateFilter] = useState("all");

  const fetchTransactions = useCallback(async (page: number, filter: string) => {
    setLoading(true);
    try {
      const { startDate, endDate } = getDateRange(filter);
      const url = `/reseller/my-transactions?page=${page}&limit=15${startDate ? `&startDate=${startDate}&endDate=${endDate}` : ''}`;
      const res = await api.get(url);
      if (res.data.status === "Success") {
        setTransactions(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions(currentPage, dateFilter);
  }, [currentPage, dateFilter, fetchTransactions]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl relative min-h-[400px]"
    >
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-[#00A759] rounded-full animate-spin"></div>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Transaction History</h3>
          <p className="text-xs text-slate-500 mt-1">Your recent payments and invoices.</p>
        </div>
        <select 
          value={dateFilter} 
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="thisweek">This Week</option>
          <option value="thismonth">This Month</option>
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
          <option value="last365days">Last 365 Days</option>
        </select>
      </div>

      {transactions.length === 0 && !loading ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800">No Transactions Found</h4>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Type</th>
                <th className="py-3 px-4 font-semibold">Notes</th>
                <th className="py-3 px-4 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {transactions.map((t) => (
                <tr key={t._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    {new Date(t.date || t.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${
                      t.entryType === 'credit' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {t.type === 'payment_in' ? 'Payment In' : t.type === 'sales_invoice' ? 'Sales Invoice' : 'Opening Balance'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{t.notes || '-'}</td>
                  <td className={`py-3 px-4 text-right font-bold ${t.entryType === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {t.entryType === 'credit' ? '+' : '-'}₹{t.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </motion.div>
  );
};

const PendingInvoicesTab = ({ user, myStats }: { user: any, myStats: any }) => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInvoices = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/reseller/my-pending-invoices?page=${page}&limit=10`);
      if (res.data.status === "Success") {
        setInvoices(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices(currentPage);
  }, [currentPage, fetchInvoices]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl relative min-h-[400px]"
    >
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-[#00A759] rounded-full animate-spin"></div>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Pending Invoices</h3>
          <p className="text-xs text-slate-500 mt-1">Your unpaid or partially paid invoices.</p>
        </div>
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-xl border border-red-100 flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          <span className="font-bold text-sm">Total Due: ₹{myStats?.pendingAmount?.toLocaleString("en-IN") || 0}</span>
        </div>
      </div>

      {invoices.length === 0 && !loading ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Check className="w-12 h-12 text-[#00A759] mx-auto mb-3" />
          <h4 className="font-bold text-slate-800">All Clear!</h4>
          <p className="text-sm text-slate-500">You have no pending invoices.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Order ID</th>
                <th className="py-3 px-4 font-semibold">Date</th>
                <th className="py-3 px-4 font-semibold">Total Amount</th>
                <th className="py-3 px-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {invoices.map((inv) => (
                <tr key={inv._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono font-bold text-slate-800">{inv.orderNumber || inv._id.slice(-6).toUpperCase()}</span>
                  </td>
                  <td className="py-4 px-4 text-slate-600">
                    {new Date(inv.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="py-4 px-4 font-bold text-slate-800">
                    ₹{(inv.totalAmount || 0).toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                      <Clock className="w-3 h-3" /> {inv.paymentStatus || 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </motion.div>
  );
};

const ReportTab = ({ user }: { user: any }) => {
  const [report, setReport] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchReport = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const res = await api.get(`/reseller/my-item-report?page=${page}&limit=10`);
      if (res.data.status === "Success") {
        setReport(res.data.data);
        setTotalPages(res.data.pagination.totalPages);
      }
    } catch (err) {
      toast.error("Failed to load report");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReport(currentPage);
  }, [currentPage, fetchReport]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-xl relative min-h-[400px]"
    >
      {loading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-3xl">
          <div className="w-8 h-8 border-4 border-slate-200 border-t-[#00A759] rounded-full animate-spin"></div>
        </div>
      )}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-slate-900">Item Wise Purchase Report</h3>
        <p className="text-xs text-slate-500 mt-1">Summary of items you have purchased.</p>
      </div>

      {report.length === 0 && !loading ? (
        <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800">No Purchases Found</h4>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Product</th>
                <th className="py-3 px-4 font-semibold">SKU</th>
                <th className="py-3 px-4 font-semibold text-center">Total Quantity</th>
                <th className="py-3 px-4 font-semibold text-right">Total Spent</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {report.map((item, idx) => (
                <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 font-medium text-slate-900">{item.title}</td>
                  <td className="py-4 px-4 text-slate-500">{item.sku || '-'}</td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold text-sm">
                      {item.totalQuantity}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-slate-900">₹{item.totalSpent}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </motion.div>
  );
};

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading: authLoading } = useSelector((state: RootState) => state.auth);
  const { myStats } = useSelector((state: RootState) => state.order);

  const [activeTab, setActiveTab] = useState<"profile" | "pending-invoices" | "transactions" | "ledger" | "report">("profile");

  const [isEditing, setIsEditing] = useState(false);
  const [step, setStep] = useState<"edit" | "otp">("edit");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  // Initialize form with current user data
  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setPhone(user.phone || "");
      dispatch(fetchMyOrderStatsAsync());
    }
  }, [user, dispatch]);

  if (!user) {
    return (
      <>
        <Header />
        <div className="max-w-md mx-auto py-24 text-center px-4 min-h-[60vh]">
          <div className="w-20 h-20 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Authentication Required</h2>
          <p className="text-sm text-slate-500 mb-8">Please log in to view and manage your profile details.</p>
          <Link href="/signin">
            <button className="bg-slate-950 hover:bg-[#00A759] hover:text-slate-950 text-white font-bold py-3.5 px-10 rounded-xl text-xs transition cursor-pointer">
              Go to Login
            </button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const handleSaveClick = async () => {
    const hasPhoneChanged = phone !== user?.phone;

    if (!name.trim() || !phone.trim() || phone.length < 10) {
      toast.error("Please provide valid details.");
      return;
    }

    if (hasPhoneChanged) {
      const result = await dispatch(requestOtp({ phone }));
      if (requestOtp.fulfilled.match(result)) {
        setStep("otp");
        toast.success("OTP sent to new phone number");
      } else {
        toast.error(result.payload as string);
      }
    } else {
      const result = await dispatch(updateUserProfile({ id: user?._id || "", fullName: name }));
      if (updateUserProfile.fulfilled.match(result)) {
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(result.payload as string);
      }
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp || otp.length < 4) {
      toast.error("Please enter a valid OTP.");
      return;
    }

    const result = await dispatch(updateUserProfile({ 
      id: user?._id || "", 
      fullName: name, 
      phone: phone, 
      otp: otp 
    }));

    if (updateUserProfile.fulfilled.match(result)) {
      setIsEditing(false);
      setStep("edit");
      setOtp("");
      toast.success("Profile and Phone updated successfully!");
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleSignOut = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    router.push("/signin");
  };

  return (
    <>
      <Header />
      <div className="max-w-5xl mx-auto py-12 px-5 min-h-[70vh]">
        
        {/* TAB NAVIGATION */}
        <div className="flex overflow-x-auto hide-scrollbar bg-slate-100 rounded-2xl p-1.5 mb-8 mx-auto shadow-inner w-full md:w-max">
          <button onClick={() => setActiveTab("profile")} className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "profile" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <User className="w-4 h-4" /> Profile
          </button>
          <button onClick={() => setActiveTab("pending-invoices")} className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "pending-invoices" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <CreditCard className="w-4 h-4" /> Pending Invoices
          </button>
          <button onClick={() => setActiveTab("transactions")} className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "transactions" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <History className="w-4 h-4" /> Transactions
          </button>
          <button onClick={() => setActiveTab("ledger")} className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "ledger" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <FileText className="w-4 h-4" /> Ledger
          </button>
          {/* <button onClick={() => setActiveTab("report")} className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${activeTab === "report" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <BarChart3 className="w-4 h-4" /> Report
          </button> */}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "profile" && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto bg-white border border-slate-100 rounded-3xl p-8 shadow-xl space-y-6 text-center relative"
            >
              {/* Header Controls */}
              {isEditing && step === "edit" && (
                <button onClick={() => { setIsEditing(false); setName(user?.fullName || ""); setPhone(user?.phone || ""); }} className="absolute left-6 top-6 p-2 text-slate-400 hover:text-slate-600 transition bg-slate-50 rounded-full cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              )}
              {step === "otp" && (
                <button onClick={() => { setStep("edit"); setOtp(""); }} className="absolute left-6 top-6 p-2 text-slate-400 hover:text-slate-600 transition bg-slate-50 rounded-full cursor-pointer">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              {!isEditing && (
                <button onClick={() => setIsEditing(true)} className="absolute right-6 top-6 p-2 text-[#00A759] hover:bg-[#00A759]/10 transition rounded-full flex items-center gap-2 text-xs font-bold cursor-pointer">
                  <Edit3 className="w-4 h-4" /> Edit
                </button>
              )}

              {/* Profile Icon */}
              <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-3xl font-bold text-white uppercase mx-auto shadow-inner">
                {name ? name.slice(0, 2) : <User className="w-8 h-8" />}
              </div>

              {!isEditing ? (
                <div className="space-y-6 pt-2">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{user.fullName || "User"}</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">{user.phone ? `+91 ${user.phone}` : "No phone added"}</p>
                    <p className="text-xs font-mono text-slate-400 mt-2 bg-slate-50 py-1 px-3 rounded-full inline-block">ID: {user._id}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100">
                    <button onClick={handleSignOut} className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3.5 rounded-xl text-xs transition cursor-pointer border border-red-100">
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-left pt-2">
                  <div className="text-center pb-2">
                    <h3 className="font-bold text-slate-900">Edit Profile</h3>
                    <p className="text-xs text-slate-500 mt-1">Update your personal details below.</p>
                  </div>
                  {step === "edit" ? (
                    <>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Full Name</label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2"><User className="w-4 h-4 text-slate-400" /></div>
                          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-800 outline-none focus:bg-white focus:border-slate-800 transition font-medium" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">Phone Number</label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-slate-200 pr-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-500 font-medium">+91</span>
                          </div>
                          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} maxLength={10} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-20 pr-4 py-3 text-xs text-slate-800 outline-none focus:bg-white focus:border-slate-800 transition font-medium" />
                        </div>
                      </div>
                      <button onClick={handleSaveClick} disabled={authLoading || !name.trim() || phone.length < 10} className="w-full mt-4 bg-[#00A759] hover:bg-[#00904c] text-white font-bold py-3.5 rounded-xl text-xs transition cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2">
                        {authLoading ? "Saving..." : <><Check className="w-4 h-4" /> Save Changes</>}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="text-center pb-2">
                        <h3 className="font-bold text-slate-900">Verify New Number</h3>
                        <p className="text-xs text-slate-500 mt-1">We sent a code to {phone}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">6-Digit OTP</label>
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2"><KeyRound className="w-4 h-4 text-slate-400" /></div>
                          <input type="text" placeholder="123456" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} maxLength={6} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-800 outline-none focus:bg-white focus:border-slate-800 transition font-medium tracking-widest text-center" />
                        </div>
                      </div>
                      <button onClick={handleOtpSubmit} disabled={authLoading || otp.length < 4} className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-xs transition cursor-pointer disabled:opacity-70">
                        {authLoading ? "Verifying..." : "Confirm & Update"}
                      </button>
                    </>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "pending-invoices" && <PendingInvoicesTab user={user} myStats={myStats} />}
          {activeTab === "transactions" && <TransactionsHistoryTab user={user} />}
          {activeTab === "ledger" && <LedgerTab user={user} />}
          {activeTab === "report" && <ReportTab user={user} />}
        </AnimatePresence>
      </div>
      <Footer />
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}
