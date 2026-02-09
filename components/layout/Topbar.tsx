import React, { useState, useEffect } from "react";
import Link from "next/link";
import { authService } from "../../services/auth.service";
import { User } from "../../types/auth";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userData = authService.getUser();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(userData);
  }, []);

  const getInitials = () => {
    if (!user) return "??";
    const first = user.first_name?.[0] || "";
    const last = user.last_name?.[0] || "";
    return (first + last).toUpperCase() || "U";
  };

  return (
    <header className="sticky top-0 z-30 h-18 glass border-b border-white/5 mx-6 mt-4 rounded-2xl flex items-center justify-between px-6 transition-all duration-300">
      {/* Search and Branding (Mobile) */}
      <div className="flex items-center gap-4 flex-1">
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

      {/* Action Icons and User Section */}
      <div className="flex items-center gap-4">
        {/* Quick Actions */}
        <div className="flex items-center gap-2 pr-4 border-r border-white/5">
          <button className="p-2.5 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition-all duration-200 relative group">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-(--clr-danger-a10) rounded-full ring-2 ring-(--clr-surface-tonal-a0) group-hover:ring-transparent transition-all" />
          </button>

          <button
            className="p-2.5 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition-all duration-200"
            title="Logout"
            onClick={() => authService.logout()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>

        {/* User Profile */}
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 p-1 rounded-xl hover:bg-white/5 transition-all duration-200 group"
        >
          <div className="hidden text-right lg:block">
            <p className="text-sm font-semibold text-white tracking-tight capitalize">
              {user ? `${user.first_name} ${user.last_name}` : "Loading..."}
            </p>
            <p className="text-xs text-zinc-500 font-medium capitalize">
              {user?.role || "Synchronizing..."}
            </p>
          </div>
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-(--clr-primary-a0) to-(--clr-primary-a20) p-[1px]">
              <div className="w-full h-full rounded-[11px] bg-(--clr-surface-a10) flex items-center justify-center text-sm font-bold text-white group-hover:bg-transparent transition-colors">
                {getInitials()}
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-(--clr-success-a0) border-2 border-(--clr-surface-a0) rounded-full" />
          </div>
        </Link>
      </div>
    </header>
  );
}
