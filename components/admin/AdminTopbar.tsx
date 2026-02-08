"use client";

import React from "react";
import Image from "next/image";

interface AdminTopbarProps {
  onMenuClick: () => void;
}

export default function AdminTopbar({ onMenuClick }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-(--clr-surface-tonal-a0)/80 backdrop-blur-lg border-b border-(--clr-surface-a20)">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-(--clr-surface-a50) hover:bg-(--clr-surface-a10) hover:text-(--clr-light-a0) transition-colors"
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

        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-(--clr-surface-a10) border border-(--clr-surface-a20)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 text-(--clr-surface-a50)"
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
            placeholder="Search..."
            className="w-48 bg-transparent text-sm text-(--clr-light-a0) placeholder:text-(--clr-surface-a50)/50 focus:outline-none"
          />
          <kbd className="hidden md:inline-flex px-2 py-0.5 text-xs text-(--clr-surface-a50) bg-(--clr-surface-a20) rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-(--clr-surface-a50) hover:bg-(--clr-surface-a10) hover:text-(--clr-light-a0) transition-colors">
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
          {/* Notification badge */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-(--clr-danger-a10) rounded-full"></span>
        </button>

        {/* User menu */}
        <div className="flex items-center gap-3 pl-3 border-l border-(--clr-surface-a20)">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-(--clr-light-a0)">
              Admin User
            </p>
            <p className="text-xs text-(--clr-surface-a50)">Administrator</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-(--clr-primary-a0) to-(--clr-primary-a20) flex items-center justify-center text-sm font-semibold text-white">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
