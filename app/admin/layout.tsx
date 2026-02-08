"use client";

import React, { useState } from "react";
import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-(--clr-surface-a0) selection:bg-(--clr-primary-a0)/30 selection:text-(--clr-light-a0)">
      {/* Dynamic Background - Unified with User Dashboard */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Animated Radial Gradients */}
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-(--clr-primary-a0) opacity-20 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] rounded-full bg-(--clr-info-a0) opacity-10 blur-[100px] animate-float" />
        <div className="absolute -bottom-[10%] left-[20%] w-[35%] h-[35%] rounded-full bg-(--clr-success-a0) opacity-10 blur-[120px]" />

        {/* Sophisticated Grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: "200px 200px",
          }}
        />
      </div>

      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Sidebar */}
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-h-screen lg:ml-0 overflow-hidden relative">
          {/* Topbar */}
          <AdminTopbar onMenuClick={() => setSidebarOpen(true)} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto p-6 sm:p-8 lg:p-10 scroll-smooth">
            <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
