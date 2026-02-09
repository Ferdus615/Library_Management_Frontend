"use client";

import React, { useState, useEffect } from "react";
import { adminService } from "../../services/admin.service";
import { MemberDashboardData } from "../../types/admin";
import MemberStats from "../../components/dashboard/MemberStats";

export default function Dashboard() {
  const [stats, setStats] = useState<MemberDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const statsData = await adminService.getMemberStats();
        setStats(statsData);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(
          "Synchronization failure. Could not retrieve catalog metrics.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
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
            Authenticating catalog...
          </h2>
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-[0.2em] animate-pulse">
            Retrieving personal statistics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      {/* <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1.5 w-8 bg-(--clr-primary-a0) rounded-full" />
          <span className="text-[10px] font-black text-(--clr-primary-a10) uppercase tracking-widest">
            Reader Dashboard
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
          Welcome back, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
            Explorer.
          </span>
        </h1>
        <p className="text-sm md:text-base text-zinc-500 font-medium mt-4 max-w-xl leading-relaxed">
          Your personal portal to the world&apos;s most expansive digital
          collection. Discover, borrow, and manage your library journey.
        </p>
      </div> */}

      {/* Stats Grid */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
        <MemberStats stats={stats} />
      </div>

      {/* Content orchestration */}
      <div className=" gap-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-400">
        {/* Left: Enhanced Activity Card */}
        <div className="glass-light rounded-[2.5rem] border-white/5 p-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-(--clr-primary-a0)/10 to-transparent blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-(--clr-primary-a10)">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Timeline
                </h2>
              </div>
              <button className="text-xs font-bold text-zinc-500 hover:text-white transition-colors uppercase tracking-widest border-b border-white/10 pb-1">
                Full History
              </button>
            </div>

            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-white/5 rounded-[2rem] bg-black/20">
              <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6 text-zinc-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 animate-float"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white/40 mb-2">
                Blank Pages
              </h3>
              <p className="text-sm text-zinc-600 max-w-xs mx-auto mb-8 font-medium">
                Your reading journey hasn&apos;t started yet. Let&apos;s find
                something worth your time.
              </p>
              <button className="px-10 py-4 bg-white text-black font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 hover:shadow-white/20">
                Browse Archives
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
