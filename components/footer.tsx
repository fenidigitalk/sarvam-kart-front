"use client";

import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import {
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaWhatsapp,
  FaTelegram,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#2d2d2d] text-white">
      <div className="max-w-7xl mx-auto py-12">

        {/* Logo + Tagline */}

        {/* Single Row: Contact | Links | Policies | Social + Newsletter */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">

           {/* Social + Newsletter */}
          <div className="flex-1 space-y-6">
        <div>
          <Link href="/" className="inline-flex items-center no-underline">
            <img
              src="/Images/footer_logo.png"
              alt="Sarvam Cart"
              className="h-10 object-contain drop-shadow-sm"
            />
          </Link>
          <p className="text-xs text-slate-400 mt-1">Digital Dream, E Commerce Reality</p>
        </div>
            {/* Social */}
            <div className="space-y-3">
              <h6 className="text-xs font-bold uppercase tracking-widest text-[#00A759]">Follow Us</h6>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: <FaInstagram size={18} />, href: "https://www.instagram.com/sarvamcart?igsh=b3FmMno1Nzg1NjZh" },
                  { icon: <FaYoutube size={18} />, href: "https://youtube.com/@sarvamcart?si=TElvrr72dzuDjuJr" },
                  { icon: <FaFacebook size={18} />, href: "https://www.facebook.com/profile.php?id=100063820943432&mibextid=ZbWKwL" },
                  { icon: <FaWhatsapp size={18} />, href: "https://t.me/sarvamcart" },
                  { icon: <FaTelegram size={18} />, href: "https://whatsapp.com/channel/0029VaAuaPSK0IBmr2iZRP1d" },
                ].map(({ icon, href }) => (
                  <Link
                    key={icon}
                    href={href}
                    className="w-9 h-9 rounded-full border border-[#ffff] hover:border-[#00A759] hover:text-[#00A759] text-[#ffff] flex items-center justify-center transition"
                  >
                    {icon}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-3">
             
              <div className="flex gap-2 max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  className="flex-1 bg-white text-slate-800 rounded-lg px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-[#00A759] placeholder:text-slate-400 transition"
                />
                <button className="px-4 py-2.5 bg-[#00A759] hover:bg-[#008a4d] text-white rounded-lg text-xs font-bold transition cursor-pointer whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

        

          {/* Quick Links */}
          <div className="min-w-[140px] space-y-3">
            <h6 className="text-xs font-bold uppercase tracking-widest text-[#00A759]">Quick Links</h6>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Contact", href: "/contact" },
                { label: "About", href: "/about" },
                { label: "Shop All", href: "/category" },
                { label: "New Arrivals", href: "/" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-slate-300 hover:text-white transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div className="min-w-[140px] space-y-3">
            <h6 className="text-xs font-bold uppercase tracking-widest text-[#00A759]">Policies</h6>
            <ul className="space-y-2">
              {[
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms & Conditions", href: "/terms-conditions" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-slate-300 hover:text-white transition">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

           {/* Contact */}
          <div className="min-w-[350px] space-y-3">
            <h6 className="text-xs font-bold uppercase tracking-widest text-[#00A759]">Contact Us</h6>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2 text-xs text-slate-300">
                <Mail className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#00A759]" />
                <a href="mailto:sarvamcart@gmail.com" className="hover:text-white transition">
                  sarvamcart@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-xs text-slate-300">
                <Phone className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#00A759]" />
                <a href="tel:+919408558818" className="hover:text-white transition">
                  +91 9408558818
                </a>
              </li>
              <li className="flex items-start gap-2 text-xs text-slate-300">
                <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#00A759]" />
                <span className="leading-relaxed">
                  Ground Floor - 28, Anupum The Business Hub,<br />
                  Puna Simada Road, Yogichowk,<br />
                  Surat, Gujarat, India – 395010
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-center sm:justify-end">
          <span className="text-[13px] text-slate-500">
            © 2026 SarvamcartStore. All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}