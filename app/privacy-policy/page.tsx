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
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-800 transition">
              Home
            </Link>
            {" / "}
            <span className="text-slate-700">Privacy Policy</span>
          </p>
        </div>

        {/* ── Intro ── */}
        <p className="text-sm text-slate-600 leading-relaxed mb-10">
          Welcome to{" "}
          <span className="font-semibold text-slate-900">Sarvam Cart.</span>{" "}
          Your privacy is important to us. This Privacy Policy explains how we
          collect, use, and protect your personal information when you visit or
          make a purchase from our website.
        </p>

        {/* ── Section 1 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            1. Information We Collect
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            We may collect the following information from customers:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 ml-6    ">
            <li>Name</li>
            <li>Mobile number</li>
            <li>Email address</li>
            <li>Shipping &amp; billing address</li>
            <li>Payment information</li>
            <li>Order history</li>
            <li>IP address and browser details</li>
          </ul>
        </section>

        {/* ── Section 2 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            2. How We Use Your Information
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            Your information is used to:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 ml-6">
            <li>Process and deliver orders</li>
            <li>Provide customer support</li>
            <li>Improve our website and services</li>
            <li>Send order updates and promotional offers</li>
            <li>Prevent fraudulent transactions</li>
          </ul>
        </section>

        {/* ── Section 3 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            3. Payment Security
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            We use secure payment gateways for online transactions. Your payment
            details are encrypted and processed securely through trusted
            third-party providers.
          </p>
        </section>

        {/* ── Section 4 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            4. Sharing of Information
          </h2>
          <p className="text-sm text-slate-600 mb-4">
            We do not sell or rent your personal information. Information may
            only be shared with:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-slate-600 ml-6">
            <li>Shipping and logistics partners</li>
            <li>Payment gateway providers</li>
            <li>Government authorities when legally required</li>
          </ul>
        </section>

        {/* ── Section 5 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Cookies</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Our website may use cookies to improve browsing experience and
            analyze website traffic.
          </p>
        </section>

        {/* ── Section 6 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            6. Your Rights
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            You may request access, correction, or deletion of your personal
            information by contacting us.
          </p>
        </section>

        {/* ── Section 7 ── */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            7. Contact Information
          </h2>
          <div className="text-sm text-slate-600 space-y-1">
            <p className="font-bold text-slate-900">Sarvam Cart</p>
            <p>Mr. Ramesh Kidecha</p>
            <p>
              Shop No. 28, Anupam The Business Hub, Puna Simada Road, Yogi
              Chowk, Surat - 394211, Gujarat, India
            </p>
            <p>Phone: 08047634175</p>
            <p>
              Website:{" "}
              <a
                href="https://www.sarvamcart.in"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-slate-900 hover:text-[#00A759] transition"
              >
                www.sarvamcart.in
              </a>
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
