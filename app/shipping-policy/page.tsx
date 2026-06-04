"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ShippingPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* ── Page Title ── */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Shipping policy
          </h1>
          <p className="text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-800 transition">
              Home
            </Link>
            {" / "}
            <span className="text-slate-700">Shipping Policy</span>
          </p>
        </div>

        {/* ── Intro ── */}
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Thank you for shopping with Sarvam Cart.
        </p>

        {/* ── Section 1 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            1. Order Processing
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 ml-6    ">
            <li>Orders are usually processed within 1–3 business days after payment confirmation.</li>
            <li>Orders placed on weekends or public holidays will be processed on the next working day.</li>
            
          </ul>
        </section>

        {/* ── Section 2 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            2. Shipping Timeline
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 ml-6">
            <li>Delivery timelines may vary depending on the location.</li>
            <li>Estimated delivery time is generally 3–10 business days across India.</li>
          </ul>
        </section>

        {/* ── Section 3 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            3. Shipping Charges
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 ml-6">
            <li>Shipping charges, if applicable, will be displayed during checkout.</li>
            <li>Free shipping offers may be available on selected products or order values.</li>
          </ul>
        </section>

        {/* ── Section 4 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            4. Delays
          </h2>
          <p className="text-sm text-slate-600 mb-4">
           Delivery delays may occur due to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 ml-6">
            <li>Natural disasters</li>
            <li>Courier issues</li>
            <li>Public holidays</li>
            <li>Unforeseen circumstances</li>
          </ul>
        </section>

        {/* ── Section 5 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Incorrect Address</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Customers are responsible for providing accurate shipping details. We are not responsible for delays or losses caused by incorrect addresses..
          </p>
        </section>

        {/* ── Section 6 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            6. Order Tracking
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Tracking details will be shared through SMS, email, or WhatsApp once the order is shipped.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
