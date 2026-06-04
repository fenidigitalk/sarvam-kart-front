"use client";

import { useState } from "react";
import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

const OFFICES = [
  {
    name: "Umino - United States",
    address: "68 St, South New York/NY 98944, United States.",
    email: "blueskytechcompany@gmail.com",
    phone: "+222-1800-262",
    hours: "Everyday 9:00 am - 6:00 pm",
  },
  {
    name: "Umino - United States",
    address: "68 St, South New York/NY 98944, United States.",
    email: "blueskytechcompany@gmail.com",
    phone: "+222-1800-262",
    hours: "Everyday 9:00 am - 6:00 pm",
  },
  {
    name: "Umino - French",
    address: "68 St, South New York/NY 98944, United States.",
    email: "blueskytechcompany@gmail.com",
    phone: "+222-1800-262",
    hours: "Everyday 9:00 am - 6:00 pm",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    comment: "",
    save: false,
  });
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    if (!form.name || !form.email || !form.comment) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: "", email: "", comment: "", save: false });
  }

  return (
    <>
    <Header />
      <div className="bg-white min-h-screen">
        {/* ── Google Map Embed ── */}
        <div className="w-full h-[420px] relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.799!2d72.8311!3d21.1702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e8a67878109%3A0x6a9f301e3a5c8b3!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1680000000000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Sarvam Kart Location"
            className="w-full h-full"
          />
        </div>

        {/* ── Here to Help ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Here to Help
          </h2>
          <p className="text-sm text-black mb-10">
            Have a question? You may find an answer in our FAQs. But you can also contact us:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-14 border-b border-slate-100">
            {OFFICES.map((office) => (
              <div key={office.name}>
                <h3 className="text-base font-bold text-slate-900 mb-3">
                  {office.name}
                </h3>
                <p className="text-sm text-black">{office.address}</p>
                <p className="text-sm text-black">{office.email}</p>
                <p className="text-sm text-black mt-3">{office.phone}</p>
                <p className="text-sm text-black mt-3">
                  Opening Hours: {office.hours}
                </p>
              </div>
            ))}
          </div>

          {/* ── Get in Touch ── */}
          <div className="pt-14">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Get in Touch
            </h2>
            <p className="text-sm text-black mb-8 max-w-2xl">
              We'd love to hear from you about our entire service. Your comments and suggestions will be highly appreciated. Please complete the form below.
            </p>

            {/* Success banner */}
            {submitted && (
              <div className="mb-6 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700 font-medium">
                ✓ Message sent! We'll get back to you shortly.
              </div>
            )}

            <div className="space-y-4">
              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#00A759] focus:ring-1 focus:ring-[#00A759]/20 transition"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#00A759] focus:ring-1 focus:ring-[#00A759]/20 transition"
                />
              </div>

              {/* Comment */}
              <textarea
                placeholder="Comment"
                rows={6}
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#00A759] focus:ring-1 focus:ring-[#00A759]/20 transition resize-none"
              />

              {/* Checkbox */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setForm({ ...form, save: !form.save })}
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    form.save
                      ? "bg-[#00A759] border-[#00A759]"
                      : "border-slate-300 bg-white"
                  }`}
                >
                  {form.save && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-xs text-black">
                  Save my name, email, and website in this browser for the next time I comment.
                </span>
              </label>

              {/* Submit */}
              <div>
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-[#00A759] hover:bg-[#008a4d] text-white text-sm font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
