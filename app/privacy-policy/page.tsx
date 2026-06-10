"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Header />

      {/* Hero */}
      <div className=" py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-black mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-400">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          {" / "}
          <span className="text-black">Privacy Policy</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 pt-4 pb-14 space-y-6">
        {/* Intro */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <p className="text-sm text-slate-600 leading-relaxed">
            At{" "}
            <span className="font-semibold text-slate-900">SARVAM CART,</span>{" "}
            we value your privacy and are committed to protecting your personal
            information. This Privacy Policy explains how we collect, use, and
            safeguard your information when you use our website, mobile
            application, and services.
          </p>
        </div>

        {/* Section 1 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              1
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Information We Collect
            </h2>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            We may collect personal information when you visit our platform,
            create an account, or place an order, including:
          </p>
          <ul className="space-y-2">
            {[
              "Full name",
              "Email address",
              "Phone number",
              "Billing & shipping address",
              "Order history and shopping preferences",
              "Device, browser, and app usage details",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-2.5 text-sm text-slate-600"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Section 2 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              2
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              How We Use Your Information
            </h2>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            Your personal information may be used to:
          </p>
          <ul className="space-y-2">
            {[
              "Process and fulfill orders",
              "Provide customer support and service assistance",
              "Improve our application, website, and user experience",
              "Send order updates, notifications, and promotional offers (only with your permission)",
              "Maintain account security and prevent fraudulent activity",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-2.5 text-sm text-slate-600"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              3
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Cookies & Tracking Technologies
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            SARVAM CART may use cookies and similar technologies to improve your
            browsing experience and website functionality.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed mt-2">
            You can disable cookies in your browser settings, but some features
            of the platform may not function properly.
          </p>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              4
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Third-Party Services
            </h2>
          </div>
          <p className="text-sm text-slate-600 mb-4">
            We may share limited information with trusted third-party services
            such as:
          </p>
          <ul className="space-y-2 mb-4">
            {[
              "Payment gateway providers",
              "Courier and shipping partners",
              "Customer support and technical service providers",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-center gap-2.5 text-sm text-slate-600"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-slate-600">
            This information is only shared when necessary to complete services
            or transactions. SARVAM CART does not sell, rent, or trade customer
            personal data.
          </p>
        </div>

        {/* Section 5 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              5
            </span>
            <h2 className="text-lg font-bold text-slate-900">Data Security</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            We implement reasonable security measures to help protect your
            personal information from unauthorized access, misuse, or
            disclosure.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed mt-3">
            However, no digital platform or online system is completely secure.
            Customers are advised to use strong passwords and protect their
            account login details.
          </p>
        </div>

        {/* Section 6 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              6
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Customer Rights
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Customers may request updates, corrections, or deletion of personal
            information where applicable, subject to legal and operational
            requirements.
          </p>
        </div>

        {/* Section 7 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              7
            </span>
            <h2 className="text-lg font-bold text-slate-900">Policy Updates</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            SARVAM CART reserves the right to modify or update this Privacy
            Policy at any time. Changes will become effective immediately after
            being published on the platform.
          </p>
        </div>

        {/* Section 8 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              8
            </span>
            <h2 className="text-lg font-bold text-slate-900">Contact Us</h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            For privacy-related concerns or questions, customers may contact
            SARVAM CART customer support through the application or website.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed mt-3">
            By using{" "}
            <span className="font-semibold text-slate-800">SARVAM CART</span>{" "}
            services, you agree to this Privacy Policy.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
