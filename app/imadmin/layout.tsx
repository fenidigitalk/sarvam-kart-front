"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  LogOut,
  Menu,
  X,
  UserPlus,
  CreditCard
} from "lucide-react";

import { api } from "@/lib/axios";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (pathname === "/imadmin/login") {
      setIsAuthenticated(true);
      return;
    }

    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/imadmin/login");
    } else {
      const checkUser = async () => {
        try {
          const res = await api.get('/user/me');
          const role = res.data.data.role;
          setUserRole(role);
          
          if (pathname.includes("/imadmin/staff") && role !== 'admin' && role !== 'superadmin') {
            router.push("/imadmin/orders");
          } else {
            setIsAuthenticated(true);
          }
        } catch (error) {
          localStorage.removeItem("admin_token");
          router.push("/imadmin/login");
        }
      };
      checkUser();
    }
  }, [pathname, router]);

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (pathname === "/imadmin/login") {
    return <>{children}</>;
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/imadmin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Sidebar Overlay */}
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
        >
          <Menu className="w-5 h-5 text-slate-700" />
        </button>
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-950 text-white transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Admin Panel</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">

          <Link
            href="/imadmin/orders"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              pathname.includes("/imadmin/orders")
                ? "bg-[#00A759] text-white"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="font-medium text-sm">Orders</span>
          </Link>


          {(userRole === 'admin' || userRole === 'superadmin') && (
            <Link
              href="/imadmin/staff"
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                pathname.includes("/imadmin/staff")
                  ? "bg-[#00A759] text-white"
                  : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <UserPlus className="w-5 h-5" />
              <span className="font-medium text-sm">Add Staff</span>
            </Link>
          )}

          <Link
            href="/imadmin/resellers"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              pathname.includes("/imadmin/resellers")
                ? "bg-[#00A759] text-white"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <UserPlus className="w-5 h-5" />
            <span className="font-medium text-sm">Resellers</span>
          </Link>

          <Link
            href="/imadmin/payment-in"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
              pathname.includes("/imadmin/payment-in")
                ? "bg-[#00A759] text-white"
                : "text-slate-400 hover:bg-slate-900 hover:text-white"
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="font-medium text-sm">Payment In</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
