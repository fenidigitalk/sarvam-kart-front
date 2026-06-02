"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Eye,
  EyeOff,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cartContext";
import Header from "@/components/header";
import Footer from "@/components/footer";

type Mode = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const { setCurrentUser, showToast, currentUser } = useCart();

  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [keepSession, setKeepSession] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setNotification("Please fill in all required fields.");
      return;
    }
    if (mode === "register" && form.password !== form.confirmPassword) {
      setNotification("Passwords do not match.");
      return;
    }

    setLoading(true);
    setNotification("Syncing secure tokens...");

    setTimeout(() => {
      if (mode === "login") {
        setCurrentUser({
          name: form.name || form.email.split("@")[0],
          email: form.email,
        });
        showToast("Logged in securely ✓");
        router.push("/");
      } else {
        setMode("login");
        setNotification(
          "Account created! Please sign in with your credentials.",
        );
        setLoading(false);
      }
    }, 1200);
  };

  const handleSocialAuth = (provider: "google" | "apple") => {
    const names = { google: "Google User", apple: "Apple Curator" };
    const emails = { google: "user@google.com", apple: "curator@apple.com" };
    setCurrentUser({ name: names[provider], email: emails[provider] });
    showToast(
      `Authenticated with ${provider === "google" ? "Google" : "Apple ID"}`,
    );
    router.push("/");
  };

  // Already logged in state
  if (currentUser) {
    return (
      <>
        <Header />
      <div className="max-w-md mx-auto py-12">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl space-y-6 text-center"
        >
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center text-2xl font-bold text-white uppercase mx-auto">
            {currentUser.name.slice(0, 2)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {currentUser.name}
            </h2>
            <p className="text-xs text-slate-500 mt-1">{currentUser.email}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/orders">
              <button className="w-full py-3 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-[#ffa352] hover:text-slate-950 transition">
                My Orders
              </button>
            </Link>
            <Link href="/cart">
              <button className="w-full py-3 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-100 transition">
                My Bag
              </button>
            </Link>
          </div>
          <button
            onClick={() => {
              setCurrentUser(null);
              showToast("Logged out successfully");
            }}
            className="w-full py-3 border border-red-200 text-red-500 rounded-xl text-xs font-semibold hover:bg-red-50 transition"
          >
            Sign Out
          </button>
        </motion.div>
      </div>
      </>
    );
  }

  return (
    <>
    <Header/>
    <div className="max-w-md mx-auto py-12">
     
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <User className="w-6 h-6 text-[#00A759]" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {mode === "login" ? "Boutique Login" : "Mint Sarvam Pass"}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === "login"
              ? "Enter credentials to unlock secure catalog drops"
              : "Join the premium curated mailing list"}
          </p>
        </div>

        {/* Notification */}
        {notification && (
          <div className="p-3 bg-slate-50 rounded-xl text-center text-xs text-slate-600 font-mono flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping shrink-0" />
            <span>{notification}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Elena Rose"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:bg-white focus:border-slate-800 transition"
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">
              Email Address
            </label>
            <input
              type="email"
              placeholder="curator@sarvam.in"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:bg-white focus:border-slate-800 transition"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-11 text-xs text-slate-800 outline-none focus:bg-white focus:border-slate-800 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {mode === "register" && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold font-mono text-slate-400 uppercase">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:bg-white focus:border-slate-800 transition"
                required
              />
            </div>
          )}

          {mode === "login" && (
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepSession}
                  onChange={(e) => setKeepSession(e.target.checked)}
                  className="accent-slate-900 rounded"
                />
                <span>Keep me signed in</span>
              </label>
              <button type="button" className="hover:underline text-[#00A759] font-medium">
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-950 hover:bg-[#00A759] hover:text-slate-950 text-white font-bold py-3.5 rounded-xl text-xs transition cursor-pointer disabled:opacity-70 disabled:cursor-wait"
          >
            {loading
              ? "Authenticating..."
              : mode === "login"
                ? "Sign in securely"
                : "Create Master Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 border-b border-slate-100" />
          <span className="relative z-10 bg-white px-3 text-[10px] font-bold font-mono uppercase text-slate-400">
            Atelier Providers
          </span>
        </div>

        {/* Social Auth */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialAuth("google")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.8 0 3.2.62 4.28 1.54l3.18-3.18C17.5 1.7 14.9 1 12 1 7.24 1 3.2 3.82 1.34 7.92l3.86 3C6.12 7.7 8.84 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.25c0-.82-.07-1.6-.22-2.35H12v4.45h6.47c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-2 3.71-4.94 3.71-8.55z"
              />
              <path
                fill="#FBBC05"
                d="M5.2 14.04c-.24-.72-.38-1.5-.38-2.3a8.2 8.2 0 01.38-2.3L1.34 6.44C.5 8.12 0 10 0 12c0 2 .5 3.88 1.34 5.56l3.86-3.52z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.7-2.87c-1.1.74-2.52 1.19-4.26 1.19-3.16 0-5.88-2.66-6.8-5.88l-3.86 3C3.2 20.18 7.24 23 12 23z"
              />
            </svg>
            <span>Google</span>
          </button>
          <button
            type="button"
            onClick={() => handleSocialAuth("apple")}
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <span className="text-sm font-extrabold text-slate-900 leading-none"></span>
            <span>Apple ID</span>
          </button>
        </div>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-slate-500">
          {mode === "login"
            ? "New to Sarvam Kart?"
            : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setNotification(null);
            }}
            className="text-[#00A759] font-bold hover:underline"
          >
            {mode === "login" ? "Create an account" : "Sign in here"}
          </button>
        </div>

        {/* Security note */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400">
          <ShieldCheck className="w-3 h-3" />
          <span>256-bit SSL encryption. Your data stays private.</span>
        </div>
      </motion.div>
    </div>
    <Footer/>
    </>
  );
}
