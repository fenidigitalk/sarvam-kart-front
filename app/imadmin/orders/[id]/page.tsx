"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { ArrowLeft, Save, Plus, Trash2, Clock, CreditCard, User, AlertCircle, Search } from "lucide-react";
import { toast } from "sonner";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [resellerBalance, setResellerBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [items, setItems] = useState<any[]>([]);
  const [paymentMode, setPaymentMode] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [orderStatus, setOrderStatus] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState("");

  // Payment In State
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentNotes, setPaymentNotes] = useState("");
  const [processingPayment, setProcessingPayment] = useState(false);

  // Search products
  const [productSearch, setProductSearch] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [showProductDrop, setShowProductDrop] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOrderDetails();
    fetchProducts();
  }, [orderId]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setShowProductDrop(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const res = await api.get(`/order/${orderId}`);
      const data = res.data;
      if (data.status === "Success") {
        setOrder(data.data);
        setItems(data.data.items);
        setPaymentMode(data.data.paymentMode || "");
        setPaymentStatus(data.data.paymentStatus || "pending");
        setOrderStatus(data.data.orderStatus || "pending");
        setDeliveryStatus(data.data.deliveryStatus || "");

        // Fetch reseller pending balance
        if (data.data.userId?._id) {
          fetchResellerLedger(data.data.userId._id);
        }
      } else {
        toast.error(data.message || "Failed to fetch order");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching order");
    } finally {
      setLoading(false);
    }
  };

  const fetchResellerLedger = async (resellerId: string) => {
    try {
      const res = await api.get(`/reseller/${resellerId}/ledger`);
      const data = res.data;
      if (data.status === "Success" && data.data.length > 0) {
        setResellerBalance(data.data[data.data.length - 1].balance);
      } else {
        setResellerBalance(0);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get(`/product?limit=100`);
      const data = res.data;
      if (data.status === "Success") {
        setProducts(data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateOrder = async () => {
    setSaving(true);
    try {
      const payload = {
        items: items.map(i => ({
          productId: i.productId,
          variantId: i.variantId || "11111111111111",
          quantity: i.quantity,
          price: i.price,
          title: i.title,
          sku: i.sku || "",
        })),
        paymentMode,
        paymentStatus,
        orderStatus: "completed",
        deliveryStatus
      };

      const res = await api.put(`/order/${orderId}`, payload);
      const data = res.data;
      if (data.status === "Success") {
        toast.success("Order updated successfully");
        setOrder(data.data);
        router.push("/imadmin/orders");
      } else {
        toast.error(data.message || "Failed to update order");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handlePaymentIn = async () => {
    if (!paymentAmount || Number(paymentAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    setProcessingPayment(true);
    try {
      // First, update the order to save any changes in items/prices
      const payload = {
        items: items.map(i => ({
          productId: i.productId,
          variantId: i.variantId || "11111111111111",
          quantity: i.quantity,
          price: i.price,
          title: i.title,
          sku: i.sku || "",
        })),
        paymentMode,
        paymentStatus,
        orderStatus: "completed",
        deliveryStatus
      };
      
      const orderRes = await api.put(`/order/${orderId}`, payload);
      if (orderRes.data.status !== "Success") {
        toast.error(orderRes.data.message || "Failed to update order before payment");
        setProcessingPayment(false);
        return;
      }

      // Then, record the payment
      const res = await api.post(`/payment/payment-in`, {
        resellerId: order.userId._id,
        amount: Number(paymentAmount),
        allocations: [{ orderId: order._id, allocatedAmount: Number(paymentAmount) }],
        paymentMode: "cash", // Assuming cash for simple inline form
        notes: paymentNotes
      });
      const data = res.data;
      if (data.status === "Success") {
        toast.success("Order updated and payment recorded successfully");
        setPaymentAmount("");
        setPaymentNotes("");
        router.push("/imadmin/orders"); // navigate back
      } else {
        toast.error(data.message || "Failed to record payment");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setProcessingPayment(false);
    }
  };

  // Item management
  const updateQty = (idx: number, newQty: number) => {
    const newItems = [...items];
    newItems[idx].quantity = Math.max(1, newQty);
    setItems(newItems);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const addItem = (product: any) => {
    if (items.some(i => i.productId === product._id)) {
      toast.error("Product already in order");
      return;
    }
    const newItem = {
      productId: product._id,
      title: product.title,
      price: product.basePrice || product.variants?.[0]?.price || product.price || 0,
      quantity: 1,
      image: product.images?.[0]?.src || ""
    };
    setItems([...items, newItem]);
    setProductSearch("");
    setShowProductDrop(false);
  };

  const filteredProducts = products.filter(p => p.title.toLowerCase().includes(productSearch.toLowerCase()));
  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const isCompleted = order?.orderStatus?.toLowerCase() === "completed";

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-[#00A759]/30 border-t-[#00A759] rounded-full animate-spin"></div></div>;
  if (!order) return <div className="text-center py-20 text-slate-500">Order not found</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animation-fade-in">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            Order #{order.orderNumber}
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${orderStatus === 'completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
              {orderStatus.toUpperCase()}
            </span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        {!isCompleted && (
          <button
            onClick={handleUpdateOrder}
            disabled={saving}
            className="px-5 py-2.5 bg-[#00A759] text-white rounded-xl font-medium shadow-sm hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        )}
      </div>

      {resellerBalance !== null && (
        <div className={`p-4 rounded-xl flex items-start gap-3 border ${resellerBalance > 0 ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
          <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${resellerBalance > 0 ? 'text-red-500' : 'text-green-500'}`} />
          <div>
            <h4 className={`font-semibold ${resellerBalance > 0 ? 'text-red-800' : 'text-green-800'}`}>
              Reseller Outstanding Balance: ₹{resellerBalance}
            </h4>
            <p className={`text-sm mt-0.5 ${resellerBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {resellerBalance > 0 ? "This reseller has pending dues. Review carefully before processing this order." : "This reseller has no pending dues. Safe to process."}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Products List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-semibold text-slate-800 text-lg">Order Items</h3>
            </div>
            <div className="p-6">
              {/* Add Product Search */}
              {!isCompleted && (
                <div className="relative mb-6" ref={dropRef}>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search products to add..."
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value);
                        setShowProductDrop(true);
                      }}
                      onFocus={() => setShowProductDrop(true)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00A759]/20 focus:border-[#00A759] outline-none transition-all text-sm"
                    />
                  </div>
                  {showProductDrop && filteredProducts.length > 0 && (
                    <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                      {filteredProducts.map((p) => (
                        <div
                          key={p._id}
                          onClick={() => addItem(p)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                        >
                          <img src={p.images?.[0]?.src || ""} alt={p.title} className="w-10 h-10 rounded-lg object-cover border border-slate-100 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 truncate">{p.title}</p>
                            <p className="text-xs font-semibold text-[#00A759]">₹{p.basePrice || p.variants?.[0]?.price || p.price || 0}</p>
                          </div>
                          <button className="w-8 h-8 rounded-full bg-[#00A759]/10 text-[#00A759] flex items-center justify-center hover:bg-[#00A759] hover:text-white transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors bg-white">
                    <img src={item.image} alt={item.title} className="w-14 h-14 rounded-xl object-cover border border-slate-100 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 text-sm truncate">{item.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs font-bold text-slate-400">₹</span>
                        {isCompleted ? (
                          <span className="text-sm font-bold text-slate-900 px-1">{item.price}</span>
                        ) : (
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[idx].price = Number(e.target.value) || 0;
                              setItems(newItems);
                            }}
                            className="w-20 px-1 py-0.5 text-xs font-bold text-[#00A759] bg-slate-50 border border-slate-200 rounded outline-none focus:border-[#00A759]"
                          />
                        )}
                      </div>
                    </div>
                    
                    {isCompleted ? (
                      <div className="w-20 text-center text-sm font-bold text-slate-800">Qty: {item.quantity}</div>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-lg border border-slate-200">
                        <button onClick={() => updateQty(idx, item.quantity - 1)} className="w-7 h-7 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold">−</button>
                        <span className="w-8 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                        <button onClick={() => updateQty(idx, item.quantity + 1)} className="w-7 h-7 rounded-md bg-[#00A759] text-white flex items-center justify-center hover:opacity-90 font-bold">+</button>
                      </div>
                    )}
                    
                    <div className="w-20 text-right font-bold text-slate-900">
                      ₹{item.price * item.quantity}
                    </div>

                    {!isCompleted && (
                      <button onClick={() => removeItem(idx)} className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {items.length === 0 && <p className="text-center text-slate-500 py-4">No items in this order.</p>}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="font-medium text-slate-600">Total Amount</span>
                <span className="text-2xl font-bold text-[#00A759]">₹{totalAmount}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          {/* Status Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="font-semibold text-slate-800 mb-4 text-lg">Order Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Reseller</label>
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                    {order.userId?.fullName?.substring(0, 2).toUpperCase() || <User className="w-5 h-5"/>}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 text-sm">{order.userId?.fullName || "Guest"}</p>
                    <p className="text-xs text-slate-500">{order.userId?.phone || "No phone"}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Order Status</label>
                <div className={`px-4 py-2 rounded-xl border text-sm font-bold inline-block ${isCompleted ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                  {orderStatus.toUpperCase()}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Payment Mode</label>
                <select 
                  value={paymentMode} 
                  onChange={(e) => setPaymentMode(e.target.value)}
                  disabled={isCompleted}
                  className={`w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium ${isCompleted ? 'opacity-70 cursor-not-allowed' : 'focus:ring-2 focus:ring-[#00A759]/20 focus:border-[#00A759]'}`}
                >
                  <option value="">Select Mode</option>
                  <option value="cash">Cash</option>
                  <option value="online">Online</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Delivery Method</label>
                <select 
                  value={deliveryStatus} 
                  onChange={(e) => setDeliveryStatus(e.target.value)}
                  disabled={isCompleted}
                  className={`w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium ${isCompleted ? 'opacity-70 cursor-not-allowed' : 'focus:ring-2 focus:ring-[#00A759]/20 focus:border-[#00A759]'}`}
                >
                  <option value="">Select Delivery</option>
                  <option value="pickup_by_customer">By Hand</option>
                  <option value="courier">Courier</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Payment Status</label>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold border ${paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-200' : paymentStatus === 'partial' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                    {paymentStatus.toUpperCase()}
                  </span>
                  {paymentStatus !== 'paid' && (
                    <span className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3"/> Awaiting payment</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Payment In Panel */}
          {paymentStatus !== 'paid' && !isCompleted && (
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-sm border border-indigo-100 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-bl-full -mr-10 -mt-10 pointer-events-none"></div>
              
              <h3 className="font-bold text-indigo-900 mb-4 flex items-center gap-2 text-lg">
                <CreditCard className="w-5 h-5 text-indigo-600" /> Payment In
              </h3>
              
              <div className="space-y-4 relative z-10">
                <div>
                  <label className="block text-sm font-medium text-indigo-800 mb-1.5">Amount Received</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500 font-medium">₹</span>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder={totalAmount.toString()}
                      className="w-full pl-8 pr-4 py-2.5 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold text-indigo-900"
                    />
                  </div>
                </div>

                <button
                  onClick={handlePaymentIn}
                  disabled={processingPayment || !paymentAmount}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {processingPayment ? "Processing..." : "Record Payment"}
                </button>
              </div>
            </div>
          )}
        </div>
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