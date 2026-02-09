"use client";

import React from "react";

export default function AdminBooksPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Book Management
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Add, edit, and organize the library catalog.
        </p>
      </div>

      <div className="glass-light rounded-[2rem] border-white/5 p-12 text-center">
        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-(--clr-primary-a10)">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-zinc-400">
          Inventory Module Coming Soon
        </h3>
        <p className="text-sm text-zinc-600 max-w-xs mx-auto mt-2">
          The engineering team is currently synchronizing the physical database
          with the digital ledger.
        </p>
      </div>
    </div>
  );
}
