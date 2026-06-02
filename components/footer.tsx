"use client";

import React from 'react';
import Link from 'next/link';
import { Truck, ShieldCheck, Award, Mail, MapPin, Phone, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white ">

      {/* Trust Strip */}
      {/* <div className="bg-[#00A759] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-[#00A759]" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">Curated Free Delivery</h5>
                <p className="text-[10px] text-[#ffff] mt-0.5">Complimentary tracked delivery across all Indian metro cities.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#00A759]" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">Authentic Lineage</h5>
                <p className="text-[10px] text-[#ffff] mt-0.5">Every item carries certified authenticity labels and direct provenance logs.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-[#00A759]" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">7-Day Return Guarantee</h5>
                <p className="text-[10px] text-[#ffff] mt-0.5">No-questions-asked pickup if you change your mind.</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 cursor-pointer">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-md">
                <span className="text-base font-bold text-[#ffb070]">S</span>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900">
                  Sarvam <span className="text-[#00A759] font-serif italic font-medium">Kart</span>
                </h1>
                <span className="text-[10px] tracking-widest uppercase text-slate-400 font-mono">Luxe Boutique</span>
              </div>
            </Link>

            <p className="text-[12px] text-slate-500 leading-relaxed max-w-xs font-light">
              Curating luxury physical staples for lifestyle, tech elegance, and interior perfection. Standard verified operations from Mumbai & Delhi hubs.
            </p>

            {/* Contact */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[12px] text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-[#00A759] shrink-0" />
                <span>Delhi Office Hub — Connaught Place, New Delhi</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-slate-500">
                <Mail className="w-3.5 h-3.5 text-[#00A759] shrink-0" />
                <span>concierge@sarvam.in</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-slate-500">
                <Phone className="w-3.5 h-3.5 text-[#00A759] shrink-0" />
                <span>+91 98765 43210</span>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: <Instagram className="w-4 h-4" />, label: 'Instagram' },
                { icon: <Twitter className="w-4 h-4" />, label: 'Twitter' },
                { icon: <Youtube className="w-4 h-4" />, label: 'YouTube' },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  title={label}
                  className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-500 flex items-center justify-center transition"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Boutique Hubs */}
          <div className="space-y-4">
            <h6 className="text-[13px] font-bold font-mono tracking-widest text-[#00A759] uppercase">Boutique Hubs</h6>
            <ul className="space-y-2.5 text-xs text-slate-500">
              {[
                { label: 'Fashion & Apparel', href: '/category'},
                { label: 'Electronics', href: '/category' },
                { label: 'Home Decor', href: '/category' },
                { label: 'Personal Care', href: '/category' },
                { label: 'Home & Kitchen', href: '/category' },
                { label: 'New Arrivals', href: '/category' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-slate-900 hover:font-medium transition cursor-pointer">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-4">
            <h6 className="text-[13px] font-bold font-mono tracking-widest text-[#00A759] uppercase">Customer Care</h6>
            <ul className="space-y-2.5 text-xs text-slate-500">
              {[
                { label: 'Track Your Order', href: '/orders' },
                { label: 'Returns & Exchanges', href: '#' },
                { label: 'Shipping Policy', href: '#' },
                { label: 'Size Guide', href: '#' },
                { label: 'FAQs', href: '#' },
                { label: 'Contact Support', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-slate-900 hover:font-medium transition cursor-pointer">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h6 className="text-[13px] font-bold font-mono tracking-widest text-[#00A759] uppercase">Company</h6>
            <ul className="space-y-2.5 text-xs text-slate-500">
              {[
                { label: 'About Sarvam Kart', href: '#' },
                { label: 'Provenance & Care', href: '#' },
                { label: 'Artisan Collective', href: '#' },
                { label: 'Privacy Charter', href: '#' },
                { label: 'Terms of Service', href: '#' },
                { label: 'Delhi Custom Duty Logs', href: '#' },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="hover:text-slate-900 hover:font-medium transition cursor-pointer">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Newsletter Strip */}
        <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h5 className="text-sm font-bold text-[#00A759]">Join the Boutique Collective</h5>
            <p className="text-[11px] text-slate-500 mt-0.5">Exclusive drops, styling guides, and early access. No spam, ever.</p>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="email"
              placeholder="Enter your email..."
              className="flex-1 sm:w-64 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:border-slate-800 transition placeholder:text-slate-400 text-slate-700"
            />
            <button className="px-4 py-2.5 bg-[#00A759] text-white rounded-xl text-xs font-bold hover:bg-[#008a4d] transition whitespace-nowrap cursor-pointer">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 font-mono text-[10px] text-slate-400">
          <span>© 2026 Sarvam Kart Luxury Collective. All authentic rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-700 cursor-pointer transition">SSL Encryption</span>
            <span>·</span>
            <span className="hover:text-slate-700 cursor-pointer transition">Privacy Charter</span>
            <span>·</span>
            <span className="hover:text-slate-700 cursor-pointer transition">Cookie Settings</span>
          </div>
        </div>
      </div>
    </footer>
  );
}