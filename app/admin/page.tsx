"use client";

import React, { useState, useEffect } from "react";
import { adminService } from "../../services/admin.service";
import {
  AdminDashboardData,
  ActivityLog,
  PendingRequest,
  OverdueBookDetail,
} from "../../types/admin";
import DashboardStats from "../../components/admin/DashboardStats";
import RecentActivity from "../../components/admin/RecentActivity";
import PendingRequests from "../../components/admin/PendingRequests";
import OverdueBooks from "../../components/admin/OverdueBooks";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardData | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [overdueBooks, setOverdueBooks] = useState<OverdueBookDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsData, activityData, requestsData, overdueData] =
          await Promise.all([
            adminService.getStats(),
            adminService.getActivity(),
            adminService.getRequests(),
            adminService.getOverdue(),
          ]);

        setStats(statsData);
        setActivities(activityData);
        setRequests(requestsData);
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

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center p-6 animate-in zoom-in-95 duration-500">
        <div className="glass border-(--clr-primary-a0)/30 rounded-3xl p-10 max-w-lg text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-(--clr-primary-a0)/20 to-transparent opacity-50" />
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-(--clr-primary-a0)/20 text-(--clr-primary-a10) mb-6 ring-4 ring-white/5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-3">
              Connection Interrupted
            </h2>
            <p className="text-zinc-500 mb-8 max-w-xs mx-auto text-sm leading-relaxed">
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-white text-(--clr-dark-a0) font-bold rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-2xl hover:shadow-white/20"
            >
              Re-establish Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Page Header - Unified Colors */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-8 bg-(--clr-primary-a0) rounded-full" />
            <span className="text-[10px] font-black text-(--clr-primary-a10) uppercase tracking-widest">
              System Overview
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Control <span className="text-zinc-500">Center</span>
          </h1>
          <p className="text-sm text-zinc-500 font-medium max-w-md">
            Advanced monitoring and management hub for BookKeeper operations.
          </p>
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

      {/* Secondary Features Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivity activities={activities} />
        </div>

        {/* Pending Borrow Requests */}
        <div className="lg:col-span-4 lg:row-span-2">
          <PendingRequests requests={requests} />
        </div>

        {/* Ad-hoc Tooling / Quick Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass rounded-3xl p-6 border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity text-(--clr-primary-a10)">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-white mb-2">
              Performance Spike
            </h3>
            <p className="text-xs text-zinc-500 leading-relaxed mb-4">
              Storage optimization recommended based on recent catalog
              expansions.
            </p>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-(--clr-primary-a10) w-3/4 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Overdue Books Table */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
        <OverdueBooks overdueBooks={overdueBooks} />
      </div>

      {/* Footer Branding */}
      <div className="pt-10 flex flex-col items-center gap-4 opacity-20 hover:opacity-100 transition-opacity duration-500">
        <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <p className="text-[10px] font-mono tracking-[0.5em] text-white uppercase italic">
          BookKeeper Core v2.4.0
        </p>
      </div>
    </div>
  );
}
