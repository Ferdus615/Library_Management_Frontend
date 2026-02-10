"use client";

import React, { useState, useEffect } from "react";
import { adminService } from "../../services/admin.service";
import { AdminDashboardData, OverdueBookDetail } from "../../types/admin";
import DashboardStats from "../../components/admin/DashboardStats";
import OverdueBooks from "../../components/admin/OverdueBooks";
import { authService } from "@/services/auth.service";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardData | null>(null);
  const [overdueBooks, setOverdueBooks] = useState<OverdueBookDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const user = authService.getUser();
  const userName = user?.first_name + " " + user?.last_name;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsData, overdueData] = await Promise.all([
          adminService.getStats(),
          adminService.getOverdue(),
        ]);

        setStats(statsData);
        setOverdueBooks(overdueData);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(
          "An error occurred while fetching system metrics. Please check server availability.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-in fade-in duration-700">
        <div className="relative">
          <div className="w-16 h-16 border-[3px] border-white/5 border-t-(--clr-primary-a0) rounded-full animate-spin shadow-lg shadow-(--clr-primary-a0)/20" />
          <div className="absolute inset-0 bg-(--clr-primary-a0)/20 blur-xl animate-pulse rounded-full" />
        </div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-white mb-1">
            Synchronizing Core...
          </h2>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-[0.2em] animate-pulse">
            Metric aggregation in progress
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Page Header - Unified Colors */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-1">
          {error && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="glass border-(--clr-danger-a0)/30 rounded-2xl p-4 bg-(--clr-danger-a0)/10 flex items-center gap-4 group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-(--clr-danger-a0)/10 to-transparent opacity-50" />
                <div className="relative z-10 p-2 bg-(--clr-danger-a0)/20 rounded-xl text-(--clr-danger-a10)">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="relative z-10 flex-1">
                  <h4 className="text-sm font-bold text-white">
                    System Sync Error
                  </h4>
                  <p className="text-xs text-zinc-400 font-medium">{error}</p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="relative z-10 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {!error && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="relative z-10 flex gap-1">
                <p className="text-sm font-light">Hello, </p>
                <h4 className="text-sm font-bold text-white">{userName}.</h4>
              </div>
              <p className="text-sm font-extralight">Welcome to book keeper!</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className="px-6 py-3 text-sm font-bold rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all active:scale-95">
            Logs
          </button>
          <button className="px-6 py-3 text-sm font-bold rounded-2xl bg-(--clr-primary-a0) text-white shadow-2xl shadow-(--clr-primary-a0)/40 hover:bg-(--clr-primary-a10) transition-all active:scale-95 group flex items-center gap-2">
            <span>+</span> Catalog Action
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
        <DashboardStats stats={stats} />
      </div>

      {/* Overdue Books Table */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
        <OverdueBooks overdueBooks={overdueBooks} />
      </div>
    </div>
  );
}
