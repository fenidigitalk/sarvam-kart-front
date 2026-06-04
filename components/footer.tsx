"use client";

import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from 'lucide-react';

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
  </svg>
);

const YoutubeIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" />
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
  </svg>
);


export default function Footer() {
  return (
    <footer className="bg-[#2d2d2d] text-white">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Contact Us Column */}
          <div className="space-y-3">
            <h6 className="text-sm font-bold text-white">Contact Us</h6>
            <p className="text-xs text-[#ffff]">Got Question? Call us 24/7</p>

            <a
              href="tel:+555-1900-2628"
              className="block text-2xl font-bold text-[#00A759] hover:text-[#00c96b] transition"
            >
              +555-1900-2628
            </a>

            <div className="space-y-2 pt-1">
              <div className="flex items-start gap-2 text-xs text-[#ffff]">
                
                <span>
                  268 St, South New York/NY 98944, United States. 
                  <br />
                  blueskytechcompany@gmail.com
                </span>
              </div>
            </div>

           {/* Social Icons */}
             <div className="flex items-center gap-2 pt-2">
               {[
                { icon: <InstagramIcon />, label: 'Instagram' },
                { icon: <TikTokIcon />,   label: 'TikTok' },
                { icon: <YoutubeIcon />,  label: 'YouTube' },
                { icon: <TwitterIcon />,  label: 'Twitter' },
                { icon: <FacebookIcon />, label: 'Facebook' },
                { icon: <PinterestIcon />,label: 'Pinterest' },
              ].map(({ icon, label }) => (
                <button
                  key={label}
                  title={label}
                  className="w-9 h-9 rounded-full border border-[#ffff] hover:border-[#00A759] hover:text-[#00A759] text-[#ffff] flex items-center justify-center transition"
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h6 className="text-sm font-bold text-white">Customer Service</h6>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "#" },
                { label: "Shop All", href: "/category" },
                { label: "Contact Us", href: "#" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs text-[#ffff] hover:text-white transition"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Shop By Categories */}
          <div className="space-y-4">
            <h6 className="text-sm font-bold text-white">Shop By Categories</h6>
            <ul className="space-y-2.5">
              {[
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Shipping Policy", href: "/shipping-policy" },
                { label: "Term Of Services", href: "/terms-of-service" },
                { label: "Return & Refund", href: "/refund-policy" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-xs text-[#ffff] hover:text-white transition"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h6 className="text-sm font-bold text-white">
              Sign Up to Newsletter
            </h6>
            <p className="text-xs text-[#ffff] leading-relaxed">
              Enter your email address to get $10 off your first order and free
              shipping. Updates information on Sales and Offers.
            </p>
            <div className="space-y-2 pt-1">
              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full bg-white text-slate-800 rounded-lg px-4 py-3 text-xs outline-none focus:ring-2 focus:ring-[#00A759] placeholder:text-slate-400 transition"
              />
              <button className="w-full px-4 py-3 bg-[#00A759] hover:bg-[#008a4d] text-white rounded-lg text-xs font-bold transition cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono"></div>
          <span className="text-[10px] text-[#ffff] font-mono text-right">
           © 2026 SarvamcartStore. All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}