"use client";

import React from "react";
import Image from "next/image";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* ── Banner Image ── */}
        <div className="w-full rounded-2xl overflow-hidden mb-12">
          <Image
            src="/images/about.jpeg"
            alt="About Sarvam Kart"
            width={1200}
            height={400}
            className="w-full h-auto object-cover"
            priority
          />
        </div>

        {/* ── Why Choose Us ── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-3">
            Why Choose Us
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Lorem ipsum dolor sit amet conse ctetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam. Lorem ipsum dolor sit amet conse ctetur adipisicing
            elit.It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.
          </p>
        </section>

        {/* ── Our Team ── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-3">Our Team</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Lorem ipsum dolor sit amet conse ctetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam. Lorem ipsum dolor sit amet conse ctetur adipisicing
            elit.It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.
          </p>
        </section>

        {/* ── Testimonials ── */}
        <section className="mb-10">
          <h2 className="text-xl font-bold text-slate-900 mb-3">
            Testimonials
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Lorem ipsum dolor sit amet conse ctetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam. Lorem ipsum dolor sit amet conse ctetur adipisicing
            elit.It has survived not only five centuries, but also the leap into
            electronic typesetting, remaining essentially unchanged. It was
            popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop
            publishing software like Aldus PageMaker including versions of Lorem
            Ipsum.
          </p>
        </section>
      </div>
      <Footer />
    </div>
  );
}
