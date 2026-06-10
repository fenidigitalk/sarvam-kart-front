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
        <h1 className="text-3xl font-bold text-black mb-2">
          Terms & Conditions
        </h1>
        <p className="text-sm text-slate-400">
          <Link href="/" className="hover:text-black transition">
            Home
          </Link>
          {" / "}
          <span className="text-black">Terms & Conditions</span>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 pt-4 pb-14 space-y-6">
        {/* Intro */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <p className="text-sm text-slate-600 leading-relaxed">
            Welcome to{" "}
            <span className="font-semibold text-slate-900">SARVAM CART,</span>{" "}
            By using our application, website, and services, you agree to the
            following Terms & Conditions. Please read them carefully before
            placing any order.
          </p>
        </div>

        {/* Section 1 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              1
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Product Availability & Color
            </h2>
          </div>
          <ul className="space-y-2">
            {[
              "No color choice is available for any product.",
              "Product color will be provided as per available stock only.",
              "All product videos and images are for reference purposes only.",
              "Actual products may vary slightly.",
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
              Cancellation Policy
            </h2>
          </div>
          <p className="text-sm text-slate-600 mb-2">
            Customers are not allowed to cancel more than 3 orders within a
            one-month period.
          </p>
          <p className="text-sm text-slate-600 ">
            Excessive order cancellations may result in account restrictions or
            refusal of service.
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              3
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Warranty & Guarantee
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            No guarantee or warranty is available on any product sold by SARVAM
            CART.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed mt-2">
            SARVAM CART does not sell branded products unless specifically
            mentioned.
          </p>
        </div>

        {/* Section 4 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              4
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Delivery & Transport Responsibility
            </h2>
          </div>
          <p className="text-sm text-slate-600 mb-2">
            SARVAM CART is not responsible for any transport damage after
            product delivery.
          </p>
          <p className="text-sm text-slate-600">
            Customers are advised to check products carefully at the time of
            delivery or pickup.
          </p>
        </div>

        {/* Section 5 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              5
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Minimum Order Amount
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            <span className="font-bold">For customers in Surat:</span> Minimum
            order amount is ₹50.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed mt-2">
            <span className="font-bold">For customers outside Surat:</span>{" "}
            Minimum order amount is ₹2000.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed mt-2">
            Courier charges will apply for out-of-Surat orders.
          </p>
        </div>

        {/* Section 6 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              6
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Return & Replacement Policy
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Please pay attention to local sellers and inspect goods carefully
            before accepting delivery. After purchase or delivery, SARVAM CART
            does not accept returns or replacements for any product.
          </p>
        </div>

        {/* Section 7 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              7
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Self Pick-Up & Delivery
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Customers in Surat can choose self pick-up of orders.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed mt-2">
            SARVAM CART does not provide delivery services in Surat.
          </p>
        </div>

        {/* Section 8 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              8
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Out of Surat Parcel Opening Policy
            </h2>
          </div>
          <ul className="space-y-2">
            {[
              "Customers outside Surat must record a 360° video while opening the parcel.",
              "Missing item claims will only be accepted if a complete parcel opening video is provided.",
              "Claims without opening video proof may be rejected.",
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

        {/* Section 9 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              9
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Customer Conduct
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Verbal or written abuse, threats, harassment, or inappropriate
            behavior toward SARVAM CART employees, sellers, members, or
            representatives will result in immediate termination of services.
          </p>
        </div>

        {/* Section 10 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              10
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Legal Use of Services
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            Customers may not use SARVAM CART services for illegal or
            unauthorized purposes. Users must comply with all applicable laws,
            regulations, and service obligations while using the platform.
          </p>
        </div>

        {/* Section 11 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              11
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Service Modification
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            SARVAM CART reserves the right to modify, suspend, or terminate
            services at any time without prior notice.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Certain features or services may not be available in all locations
            or jurisdictions.
          </p>
        </div>

        {/* Section 12 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              12
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Right to Refuse Service
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            SARVAM CART reserves the right to refuse service to anyone for any
            reason at any time.
          </p>
        </div>

        {/* Section 13 */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-black shrink-0">
              13
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Acceptance of Terms
            </h2>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            By placing an order or using SARVAM CART services, you agree to
            follow all Terms & Conditions mentioned above.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
