"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  User,
  Phone,
  KeyRound,
  ShieldCheck,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useDispatch, useSelector } from "react-redux";
import { requestOtp, verifyOtp, addReseller } from "@/store/slices/authSlice";
import { addToCartAsync, toggleWishlistAsync, fetchWishlistAsync } from "@/store/slices/cartSlice";
import { AppDispatch, RootState } from "@/store/store";

import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, isNewUser, user: currentUser } = useSelector((state: RootState) => state.auth);

  const [step, setStep] = useState<"phone" | "otp" | "profile">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    const result = await dispatch(requestOtp({ phone }));
    if (requestOtp.fulfilled.match(result)) {
      setStep("otp");
      toast.success("OTP sent successfully!");
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error("Please enter a valid OTP.");
      return;
    }

    const result = await dispatch(verifyOtp({ phone, otp, isAdminLogin: false }));
    
    if (verifyOtp.fulfilled.match(result)) {
      if (result.payload.isNewUser) {
        setStep("profile");
        toast.success("Please complete your profile.");
      } else {
        toast.success("Logged in securely ✓");
        await handlePendingAction();
      }
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter your full name.");
      return;
    }
    if (!address.trim()) {
      toast.error("Please enter your address.");
      return;
    }

    const result = await dispatch(addReseller({ name, number: phone, address }));
    if (addReseller.fulfilled.match(result)) {
      toast.success("Account created and logged in securely ✓");
      await handlePendingAction();
    } else {
      toast.error(result.payload as string);
    }
  };

  const handlePendingAction = async () => {
    const pendingAction = sessionStorage.getItem("pendingAction");
    if (pendingAction) {
      try {
        const { type, payload, returnUrl } = JSON.parse(pendingAction);
        sessionStorage.removeItem("pendingAction");
        
        if (type === "cart") {
          await dispatch(addToCartAsync(payload));
          toast.success("Item added to bag");
        } else if (type === "wishlist") {
          await dispatch(toggleWishlistAsync(payload));
          dispatch(fetchWishlistAsync());
          toast.success("Item added to wishlist");
        }
        
        if (returnUrl) {
          router.push(returnUrl);
          return;
        }
      } catch (err) {
        console.error("Error processing pending action", err);
      }
    }
    router.push("/profile");
  };

  // Already logged in state
  useEffect(() => {
    if (currentUser && !isNewUser) {
      const pendingAction = sessionStorage.getItem("pendingAction");
      if (pendingAction) {
        handlePendingAction();
      } else {
        router.push("/profile");
      }
    }
  }, [currentUser, isNewUser, router]);

  if (currentUser && !isNewUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-500">Redirecting to profile...</p>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="max-w-md mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-2 relative">
            {step === "otp" && (
              <button
                onClick={() => {
                  setStep("phone");
                  setOtp("");
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <User className="w-6 h-6 text-[#00A759]" />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {step === "phone" ? "Welcome Back" : step === "otp" ? "Verify OTP" : "Complete Profile"}
            </h2>
            <p className="text-xs text-slate-500">
              {step === "phone"
                ? "Enter your phone number to sign in or create an account"
                : step === "otp"
                ? `We've sent a code to ${phone}`
                : "Just one more step to setup your reseller account."}
            </p>
          </div>

          {/* Form */}
          {step === "phone" ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-slate-200 pr-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-xs text-slate-500 font-medium">+91</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="9999999999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-20 pr-4 py-3 text-xs text-slate-800 outline-none focus:bg-white focus:border-slate-800 transition font-medium"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || phone.length < 10}
                className="w-full bg-slate-950 hover:bg-[#00A759] hover:text-slate-950 text-white font-bold py-3.5 rounded-xl text-xs transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Verify / Next"}
              </button>
            </form>
          ) : step === "otp" ? (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">
                  6-Digit OTP
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <KeyRound className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-800 outline-none focus:bg-white focus:border-slate-800 transition font-medium tracking-widest text-center"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="w-full bg-slate-950 hover:bg-[#00A759] hover:text-slate-950 text-white font-bold py-3.5 rounded-xl text-xs transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Authenticating..." : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-500 cursor-not-allowed font-medium"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:bg-white focus:border-slate-800 transition font-medium"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">
                  Address
                </label>
                <textarea
                  placeholder="Enter your complete address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:bg-white focus:border-slate-800 transition font-medium resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !name.trim() || !address.trim()}
                className="w-full bg-slate-950 hover:bg-[#00A759] hover:text-slate-950 text-white font-bold py-3.5 rounded-xl text-xs transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "Creating Profile..." : "Create Account"}
              </button>
            </form>
          )}

          {/* Security note */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 mt-6">
            <ShieldCheck className="w-3 h-3" />
            <span>256-bit SSL encryption. Your data stays private.</span>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
