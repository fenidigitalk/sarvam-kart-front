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
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-800 transition">
              Home
            </Link>
            {" / "}
            <span className="text-slate-700">Terms of Service</span>
          </p>
        </div>

        {/* ── Intro ── */}
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          Welcome to Sarvam Cart. By accessing or using our website, you agree
          to the following Terms of Service.
        </p>

        {/* ── Section 1 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">1. General</h2>
          <p className="text-sm text-slate-600 mb-4">
            By using this website, you confirm that you are at least 18 years
            old or using the website under parental supervision.
          </p>
        </section>

        {/* ── Section 2 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            2. Products & Pricing
          </h2>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 ml-6">
            <li>
              Product prices and availability are subject to change without
              prior notice.
            </li>
            <li>We reserve the right to discontinue products at any time.</li>
          </ul>
        </section>

        {/* ── Section 3 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Orders</h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            We reserve the right to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 ml-6">
            <li>Refuse or cancel any order</li>
            <li>Limit quantities purchased</li>
            <li>Verify customer information before processing</li>
          </ul>
        </section>

        {/* ── Section 4 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            4. Payments
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            All payments must be completed through approved payment methods
            available on the website.
          </p>
        </section>

        {/* ── Section 5 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            5. Intellectual Property
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            All website content including logos, images, text, graphics, and
            designs are the property of Sarvam Cart and may not be copied
            without permission.
          </p>
        </section>

        {/* ── Section 6 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            6. Limitation of Liability
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed mb-3">
            We are not liable for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 ml-6">
            <li>Indirect or incidental damages</li>
            <li>Delivery delays caused by third-party logistics</li>
            <li>Temporary website downtime</li>
          </ul>
        </section>

        {/* ── Section 7 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            7. Governing Law
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            These terms are governed by the laws of India and any disputes shall
            be subject to the jurisdiction of Surat, Gujarat.
          </p>
        </section>

        {/* ── Section 8 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            8. Contact Us
          </h2>
          <div className="text-sm text-slate-600 space-y-1">
            <p className="font-bold text-slate-900">Sarvam Cart</p>
            <p>Mr. Ramesh Kidecha</p>
            <p>Phone: 08047634175</p>
            <p>
              Address: Shop No. 28, Anupam The Business Hub, Puna Simada Road,
              Yogi Chowk, Surat - 394211, Gujarat, India
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
