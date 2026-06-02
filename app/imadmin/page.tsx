"use client";

import React from "react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Orders</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">124</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Active Users</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">892</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Revenue</h3>
          <p className="mt-2 text-3xl font-bold text-slate-900">₹45,200</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
        <p className="text-slate-500">Welcome to the Admin Portal. Use the sidebar to navigate.</p>
      </div>
    </div>
  );
}
