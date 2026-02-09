"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { User } from "@/types/auth";
import { authService } from "@/services/auth.service";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
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
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
  },
  {
    label: "Books",
    href: "/dashboard/books",
    icon: (
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
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
  },
  {
    label: "My Borrows",
    href: "/dashboard/borrows",
    icon: (
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
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
  },
  {
    label: "History",
    href: "/dashboard/history",
    icon: (
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
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: (
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
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar with Glassmorphism */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 glass border-r border-white/5 
          transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0 shadow-2xl shadow-black/50" : "-translate-x-full"}`}
      >
        {/* Logo Section */}
        <div className="flex items-center gap-3 px-6 py-8 border-b border-white/5 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-(--clr-primary-a0)/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center gap-3">
            <div className="p-2 bg-(--clr-primary-a0)/20 rounded-xl">
              <Image
                src="/brand/logo-icon-w.svg"
                alt="BookKeeper"
                width={32}
                height={32}
                priority
                className="animate-in fade-in duration-1000"
              />
            </div>
            <span className="text-xl/4 font-extralight text-white tracking-tight">
              book
              <br />
              keeper
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 p-4 mt-4">
          {navItems.map((item, index) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group
                  ${
                    isActive
                      ? "bg-(--clr-primary-a0) text-white shadow-lg shadow-(--clr-primary-a0)/25"
                      : "text-(--clr-surface-a50) hover:bg-white/5 hover:text-white"
                  }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-white" : "text-(--clr-primary-a10)"}`}
                >
                  {item.icon}
                </div>
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Status / Quick Actions */}
        <div className="mt-auto p-4 mb-4">
          <div className="glass-light rounded-2xl p-4 border-white/10 group cursor-pointer hover:border-white/20 transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-(--clr-primary-a0) to-(--clr-primary-a20) border border-white/20" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">
                  Membership Status
                </p>
                <p className="text-xs text-(--clr-success-a10) font-medium">
                  Active Member
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
