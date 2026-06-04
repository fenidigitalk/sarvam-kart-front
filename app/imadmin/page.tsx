"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ImAdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/imadmin/login");
    } else {
      router.push("/imadmin/orders");
    }
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-slate-500">Redirecting...</div>
    </div>
  );
}
