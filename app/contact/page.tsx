"use client";

import { useState } from "react";
import React from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { MapPin, Mail, Phone, Clock } from "lucide-react";

const INFO_CARDS = [
  {
    icon: <MapPin className="w-5 h-5 text-[#00A759]" />,
    title: "Our Office",
    value: "Ground Floor - 28, Anupum The Business Hub, Puna Simada Road, Yogichowk, Surat, Gujarat – 395010",
  },
  {
    icon: <Mail className="w-5 h-5 text-[#00A759]" />,
    title: "Email Us",
    value: "sarvamcart@gmail.com",
  },
  {
    icon: <Phone className="w-5 h-5 text-[#00A759]" />,
    title: "Call Us",
    value: "+91 9408558818",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", comment: "", save: false });
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

        {/* Google Map */}
        <div className="w-full h-[420px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.799!2d72.8311!3d21.1702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04e8a67878109%3A0x6a9f301e3a5c8b3!2sSurat%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1680000000000"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Sarvam Cart Location"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

          {/* Here to Help */}
          <p className="text-xs font-bold uppercase tracking-widest text-[#00A759] mb-1 text-center">Get in touch</p>
          <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Here to Help</h2>
          <p className="text-sm text-slate-500 mb-8 text-center">
            Have a question? You may find an answer in our FAQs. But you can also contact us directly.
          </p>

          {/* Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12 ">
            {INFO_CARDS.map(({ icon, title, value }) => (
              <div key={title} className="border border-slate-200 rounded-2xl p-5 bg-white">
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center mb-3">
                  {icon}
                </div>
                <p className="text-sm font-semibold text-slate-800 mb-1">{title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{value}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-12 flex flex-col items-center text-center">

            <p className="text-xs font-bold uppercase tracking-widest text-[#00A759] mb-1">Send a message</p>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Leave Us a Message</h2>
            <p className="text-sm text-slate-500 mb-8 max-w-xl">
              We'd love to hear from you. Please complete the form below and we'll get back to you shortly.
            </p>

            {submitted && (
              <div className="w-full max-w-2xl mb-6 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700 font-medium flex items-center gap-2">
                ✓ Message sent! We'll get back to you shortly.
              </div>
            )}

            <div className="space-y-4 w-full max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#00A759] focus:ring-2 focus:ring-[#00A759]/10 transition"
                />
                <input
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#00A759] focus:ring-2 focus:ring-[#00A759]/10 transition"
                />
              </div>

              <textarea
                placeholder="Your message..."
                rows={6}
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-[#00A759] focus:ring-2 focus:ring-[#00A759]/10 transition resize-none"
              />

              <label className="flex items-center gap-3 cursor-pointer select-none text-left">
                <div
                  onClick={() => setForm({ ...form, save: !form.save })}
                  className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${form.save ? "bg-[#00A759] border-[#00A759]" : "border-slate-300 bg-white"
                    }`}
                >
                  {form.save && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-xs text-slate-500">
                  Save my name and email for the next time I comment.
                </span>
              </label>

              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-[#00A759] hover:bg-[#008a4d] text-white text-sm font-bold rounded-xl transition-colors cursor-pointer"
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