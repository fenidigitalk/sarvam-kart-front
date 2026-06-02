"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { User, Phone, KeyRound, ArrowLeft, Edit3, X, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cartContext";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { requestOtp, updateUserProfile, logout } from "@/store/slices/authSlice";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);
  const { setCurrentUser, showToast, currentUser } = useCart();

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
    } else if (currentUser) {
      setName(currentUser.name || "");
      // Extract phone from email mock if needed, but preferably rely on Redux user
      setPhone(currentUser.email?.split("@")[0] || "");
    }
  }, [user, currentUser]);

  if (!user && !currentUser) {
    return (
      <>
        <Header />
        <div className="max-w-md mx-auto py-24 text-center px-4">
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
    const hasPhoneChanged = phone !== user?.phone && phone !== currentUser?.email?.split("@")[0];

    if (!name.trim() || !phone.trim() || phone.length < 10) {
      toast.error("Please provide valid details.");
      return;
    }

    if (hasPhoneChanged) {
      // Need OTP verification for new phone
      const result = await dispatch(requestOtp({ phone })); // <-- Pass object
      if (requestOtp.fulfilled.match(result)) {
        setStep("otp");
        showToast("OTP sent to new phone number");
      } else {
        toast.error(result.payload as string);
      }
    } else {
      // Just updating name
      const result = await dispatch(updateUserProfile({ id: user?._id || "", fullName: name }));
      if (updateUserProfile.fulfilled.match(result)) {
        setCurrentUser({ ...currentUser, name } as any);
        setIsEditing(false);
        showToast("Profile updated successfully!");
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
      setCurrentUser({ name, email: phone + "@sarvam.in" });
      setIsEditing(false);
      setStep("edit");
      setOtp("");
      showToast("Profile and Phone updated successfully!");
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleSignOut = () => {
    dispatch(logout());
    setCurrentUser(null);
    showToast("Logged out successfully");
    router.push("/signin");
  };

  return (
    <>
      <Header />
      <div className="max-w-md mx-auto py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl space-y-6 text-center relative"
        >
          {/* Header Controls */}
          {isEditing && step === "edit" && (
            <button
              onClick={() => {
                setIsEditing(false);
                setName(user?.fullName || "");
                setPhone(user?.phone || "");
              }}
              className="absolute left-6 top-6 p-2 text-slate-400 hover:text-slate-600 transition bg-slate-50 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {step === "otp" && (
            <button
              onClick={() => {
                setStep("edit");
                setOtp("");
              }}
              className="absolute left-6 top-6 p-2 text-slate-400 hover:text-slate-600 transition bg-slate-50 rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute right-6 top-6 p-2 text-[#00A759] hover:bg-[#00A759]/10 transition rounded-full flex items-center gap-2 text-xs font-bold"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          )}

          {/* Profile Icon */}
          <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center text-3xl font-bold text-white uppercase mx-auto shadow-inner">
            {name ? name.slice(0, 2) : <User className="w-8 h-8" />}
          </div>

          {/* View Mode */}
          {!isEditing && (
            <>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{name || "User"}</h2>
                <p className="text-sm text-slate-500 mt-1">{phone ? `+91 ${phone}` : "No phone available"}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-4">
                <Link href="/orders">
                  <button className="w-full py-3.5 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-[#ffa352] hover:text-slate-950 transition">
                    My Orders
                  </button>
                </Link>
                <Link href="/cart">
                  <button className="w-full py-3.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition">
                    My Bag
                  </button>
                </Link>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSignOut}
                  className="w-full py-3 border border-red-200 text-red-500 rounded-xl text-xs font-bold hover:bg-red-50 transition"
                >
                  Sign Out
                </button>
              </div>
            </>
          )}

          {/* Edit Mode */}
          {isEditing && step === "edit" && (
            <div className="space-y-4 text-left pt-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 py-3 text-xs text-slate-800 outline-none focus:bg-white focus:border-slate-800 transition font-medium"
                  />
                </div>
              </div>

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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    maxLength={10}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-20 pr-4 py-3 text-xs text-slate-800 outline-none focus:bg-white focus:border-slate-800 transition font-medium"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveClick}
                disabled={loading || !name.trim() || phone.length < 10}
                className="w-full mt-4 bg-[#00A759] hover:bg-[#00904c] text-white font-bold py-3.5 rounded-xl text-xs transition cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? "Saving..." : <><Check className="w-4 h-4" /> Save Changes</>}
              </button>
            </div>
          )}

          {/* OTP Mode */}
          {isEditing && step === "otp" && (
            <div className="space-y-4 text-left pt-2">
              <div className="text-center pb-2">
                <h3 className="font-bold text-slate-900">Verify New Number</h3>
                <p className="text-xs text-slate-500 mt-1">We sent a code to {phone}</p>
              </div>

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
                  />
                </div>
              </div>

              <button
                onClick={handleOtpSubmit}
                disabled={loading || otp.length < 4}
                className="w-full bg-slate-950 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-xs transition cursor-pointer disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Confirm & Update"}
              </button>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
