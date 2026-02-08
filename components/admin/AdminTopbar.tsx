"use client";

import React from "react";

interface AdminTopbarProps {
  onMenuClick: () => void;
}

export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 h-18 glass border-b border-white/5 mx-6 mt-4 rounded-2xl flex items-center justify-between px-6 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-xl text-(--clr-surface-a50) hover:bg-white/5 hover:text-white transition-all duration-200"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Premium Search Bar */}
        <div className="hidden sm:flex items-center flex-1 max-w-md gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 group focus-within:border-(--clr-primary-a0)/50 focus-within:bg-white/10 transition-all duration-300">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-zinc-500 group-focus-within:text-(--clr-primary-a0) transition-colors"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search books, authors, or ISBN..."
            className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />
          <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium text-zinc-500 bg-white/5 border border-white/10 rounded">
            <span>⌘</span>K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Admin Stats Quick Look - Unified colors */}
        <div className="hidden md:flex items-center gap-6 pr-6 border-r border-white/5">
          <div className="text-right">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Active Loans
            </p>
            <p className="text-sm font-semibold text-white">1,284</p>
          </div>
          <div className="text-right text-(--clr-primary-a10)">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
              Late Returns
            </p>
            <p className="text-sm font-semibold text-white">42</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-white tracking-tight">
              System Admin
            </span>
            <span className="text-[10px] text-(--clr-primary-a10) font-mono uppercase">
              Role: Superuser
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-(--clr-primary-a0) to-(--clr-primary-a10) p-[1px] shadow-lg shadow-(--clr-primary-a0)/20">
            <div className="w-full h-full rounded-[11px] bg-(--clr-dark-a0) flex items-center justify-center text-xs font-black text-white">
              AD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
