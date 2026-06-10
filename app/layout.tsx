import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Global styles

import Toast from "@/components/Toast";

import { Toaster } from "sonner";
import ReduxProvider from "@/store/ReduxProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Sarvam Cart | Premium Curated E-commerce",
  description:
    "Sarvam Cart is a premium curated e-commerce experience showcasing beautiful lifestyle, home decor, and fashion drops with seamless state tracking.",
  icons: {
    icon: "/favicon.png",
  },
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
          <ReduxProvider>
            <Toaster position="top-right" richColors />
            <Toast />
            {children}
          </ReduxProvider>
      </body>
    </html>
  );
}
