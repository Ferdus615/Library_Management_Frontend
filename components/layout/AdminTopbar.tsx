"use client";

import { authService } from "@/services/auth.service";
import React, { useEffect, useState } from "react";
import { Menu, Search, Command } from "lucide-react";
import NotificationDropdown from "./NotificationDropdown";

interface AdminTopbarProps {
  onMenuClick: () => void;
}

export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const user = authService.getUser();

  const userName = user?.first_name + " " + user?.last_name;
  const userRole = user?.role;
  const getInitials = () => {
    const firstName = user?.first_name[0] || "?";
    const lastName = user?.last_name[0] || "?";
    return firstName + lastName;
  };

  return (
    <header className="sticky top-0 z-30 h-18 glass border-b border-white/5 mx-6 mt-4 rounded-2xl flex items-center justify-between px-3 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-xl text-(--clr-surface-a50) hover:bg-white/5 hover:text-white transition-all duration-200"
          aria-label="Toggle menu"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Premium Search Bar */}
        <div className="hidden sm:flex items-center flex-1 max-w-md gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 group focus-within:border-(--clr-primary-a0)/50 focus-within:bg-white/10 transition-all duration-300">
          <Search className="h-5 w-5 text-zinc-500 group-focus-within:text-(--clr-primary-a0) transition-colors" />
          <input
            type="text"
            placeholder="Search books, authors, or ISBN..."
            className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
          />
          <kbd className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono font-medium text-zinc-500 bg-white/5 border border-white/10 rounded">
            <Command size={10} />K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notification Button */}
        <NotificationDropdown />

        {/* initials */}
        <div className="flex items-center gap-3 border-l-2 border-white/5 pl-5">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-white tracking-tight">
              {userName ? userName : ""}
            </span>
            <span className="text-[10px] text-(--clr-primary-a10) font-mono uppercase">
              Role: {userRole ? userRole : ""}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-(--clr-primary-a0) to-(--clr-primary-a10) p-px shadow-lg shadow-(--clr-primary-a0)/20">
            <div className="w-full h-full rounded-[11px] bg-(--clr-surface-a10) flex items-center justify-center text-xs font-black text-white">
              {getInitials()}
            </div>
            <div className="absolute bottom-3 right-5 w-3.5 h-3.5 bg-(--clr-success-a0) border-2 border-(--clr-surface-a0) rounded-full" />
          </div>
        </div>
      </div>
    </header>
  );
}
