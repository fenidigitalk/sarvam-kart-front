import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Global styles
import { CartProvider } from "@/context/cartContext";
import Toast from "@/components/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Sarvam Kart | Premium Curated E-commerce",
  description:
    "Sarvam Kart is a premium curated e-commerce experience showcasing beautiful lifestyle, home decor, and fashion drops with seamless state tracking.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        suppressHydrationWarning
        className="font-sans antialiased  text-[#141d23] min-h-screen"
      >
        <CartProvider>
           <Toast />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
