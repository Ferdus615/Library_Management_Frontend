"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { authService } from "../../services/auth.service";
import {
  LayoutDashboard,
  Book,
  BookOpenCheck,
  LibraryBig,
  CircleDollarSign,
  CalendarCheck,
  Users,
  LogOut,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Books",
    href: "/admin/books",
    icon: <Book className="h-5 w-5" />,
  },
  {
    label: "Borrowed Books",
    href: "/admin/borrowed-books",
    icon: <BookOpenCheck className="h-5 w-5" />,
  },
  {
    label: "Fines",
    href: "/admin/fines",
    icon: <CircleDollarSign className="h-5 w-5" />,
  },
  {
    label: "Reservations",
    href: "/admin/reservations",
    icon: <CalendarCheck className="h-5 w-5" />,
  },
  {
    label: "Member Management",
    href: "/admin/member-management",
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Category Management",
    href: "/admin/category-management",
    icon: <LibraryBig className="h-5 w-5" />,
  },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleLogout = () => {
    authService.logout();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-all duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar with Glassmorphism - Unified with Member Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 glass border-r border-white/5 flex flex-col
          transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0 shadow-2xl shadow-black/50" : "-translate-x-full"}`}
      >
        {/* Logo Section */}
        <div className="items-center gap-3 px-6 py-8 border-b border-white/5 relative group">
          <div className="absolute inset-0 bg-linear-to-r from-(--clr-primary-a0)/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col gap-5">
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

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-(--clr-primary-a0)/10 border border-(--clr-primary-a0)/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-(--clr-primary-a10) opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-(--clr-primary-a0)"></span>
              </span>
              <span className="text-[10px] font-bold text-(--clr-primary-a10) uppercase tracking-wider">
                Live System
              </span>
            </div>
          </div>
        </div>

        <div className="">
          {/* Navigation */}
          <nav className="flex flex-col gap-2 p-4 mt-4">
            {navItems.map((item, index) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 group
                  ${
                    isActive
                      ? "bg-(--clr-primary-a0) text-white shadow-lg shadow-(--clr-primary-a0)/25"
                      : "text-(--clr-surface-a50) hover:bg-white/5 hover:text-white"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={`transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${isActive ? "text-white" : "text-(--clr-primary-a10)"}`}
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

          {/* Footer/Logout */}
        </div>

        <div className="mt-auto p-4 mb-5">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-white/5 text-(--clr-surface-a50) hover:bg-(--clr-danger-a0)/20 hover:text-(--clr-danger-a10) hover:border-(--clr-danger-a0)/30 transition-all duration-300 group cursor-pointer"
          >
            <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
