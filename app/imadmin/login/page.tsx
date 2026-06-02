"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Phone, KeyRound, ShieldCheck, ArrowLeft, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { requestOtp, verifyOtp } from "@/store/slices/authSlice";
import { AppDispatch, RootState } from "@/store/store";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    const result = await dispatch(requestOtp({ phone, isAdminLogin: true }));
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

    const result = await dispatch(verifyOtp({ phone, otp, isAdminLogin: true }));
    
    if (verifyOtp.fulfilled.match(result)) {
      router.push("/imadmin");
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2 relative">
          {step === "otp" && (
            <button
              onClick={() => {
                setStep("phone");
                setOtp("");
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto shadow-inner border border-slate-700">
            <ShieldAlert className="w-6 h-6 text-[#00A759]" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            {step === "phone" ? "Admin Portal" : "Admin Verification"}
          </h2>
          <p className="text-xs text-slate-400">
            {step === "phone"
              ? "Authorized personnel only"
              : `Code sent to ${phone}`}
          </p>
        </div>

        {/* Form */}
        {step === "phone" ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono text-slate-500 uppercase">
                Admin Phone
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-slate-700 pr-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-400 font-medium">+91</span>
                </div>
                <input
                  type="tel"
                  placeholder="9999999999"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  maxLength={10}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-20 pr-4 py-3 text-xs text-white outline-none focus:border-[#00A759] transition font-medium placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || phone.length < 10}
              className="w-full bg-[#00A759] hover:bg-[#00c56a] text-slate-950 font-bold py-3.5 rounded-xl text-xs transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Authenticating..." : "Request Access"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono text-slate-500 uppercase">
                Secure OTP
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
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-xs text-white outline-none focus:border-[#00A759] transition font-medium tracking-widest text-center placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="w-full bg-[#00A759] hover:bg-[#00c56a] text-slate-950 font-bold py-3.5 rounded-xl text-xs transition cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Verifying..." : "Enter Portal"}
            </button>
          </form>
        )}

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 mt-6">
          <ShieldCheck className="w-3 h-3" />
          <span>Internal access is logged and monitored.</span>
        </div>
      </motion.div>
    </div>
  );
}
