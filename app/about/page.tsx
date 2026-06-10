"use client";

import React from "react";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { ShieldCheck, TruckIcon, Tag, Headphones, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Banner */}
        <div className="w-full rounded-2xl overflow-hidden mb-10">
          <img
            src="/images/hero_sec2.jpeg"
            alt="About Sarvam Cart"           
            className="w-full h-[550px] object-cover"
          />
        </div>

        {/* Welcome Section */}
        <div className="flex items-start gap-5 bg-white border border-slate-100 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-1">
            <Sparkles className="w-6 h-6 text-[#00A759]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">
              Welcome to SARVAM CART – Smart Shopping, Better Living!
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              SARVAM CART is your trusted online shopping destination, bringing quality products,
              great prices, and fast service together in one place. From daily essentials to trending
              products, we make shopping simple, secure, and convenient for everyone.
              Your satisfaction is our priority.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { num: "10K+", label: "Happy Customers" },
            { num: "500+", label: "Products" },
            { num: "Fast", label: "Delivery" },
            { num: "24/7", label: "Support" },
          ].map(({ num, label }) => (
            <div key={label} className="bg-slate-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-[#00A759]">{num}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        
      </div>
      <Footer />
    </div>
  );
}