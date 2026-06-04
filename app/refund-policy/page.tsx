"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* ── Page Title ── */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Refund policy
          </h1>
          <p className="text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-800 transition">
              Home
            </Link>
            {" / "}
            <span className="text-slate-700">Refund policy</span>
          </p>
        </div>

        {/* ── Intro ── */}
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          At Sarvam Cart, customer satisfaction is important to us.
        </p>

        {/* ── Section 1 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Return Eligibility</h2>
          <p className="text-sm text-slate-600 mb-4">
            Products may be eligible for return if:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 ml-6">
            <li>
              The item received is damaged
            </li>
            <li>Wrong product is delivered</li>
            <li>Product has manufacturing defects</li>
          </ul>
        </section>

        {/* ── Section 2 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            2. Return Request Timeline
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Customers must request a return within 
            <span className="font-extrabold"> 3–7 days</span> of delivery.
          </p>
        </section>

        {/* ── Section 3 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Non-Returnable Items</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            The following items may not be eligible for return:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 ml-6">
            <li>Used products</li>
            <li>Customized items</li>
            <li>Products damaged by misuse</li>
          </ul>
        </section>

        {/* ── Section 4 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            4. Refund Process
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 ml-6">
            <li>Refunds will be initiated after inspection and approval of the returned product.</li>
            <li>Refunds are generally processed within 
               <span className="font-extrabold"> 5–10 business days</span> to the original payment method.</li>
          </ul>
        </section>

        {/* ── Section 5 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            5. Exchange Policy
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Exchange requests are subject to product availability.
          </p>
        </section>

        {/* ── Section 6 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            6. Cancellation Policy
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            Orders can only be cancelled before dispatch. Once shipped, cancellation requests may not be accepted.
          </p>
        </section>

        {/* ── Section 7 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            7. Contact for Returns
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            For any return or refund requests, contact:
          </p>
          <div className="text-sm text-slate-600 space-y-1">
            <p className="font-bold text-slate-900">Sarvam Cart</p>
            <p>Phone: 08047634175</p>
            <p>Website: www.sarvamcart.net</p>   
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
