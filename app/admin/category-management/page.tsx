"use client";

import React from "react";

export default function AdminCategoryManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Category management
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Organize books into genres and subject areas.
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-zinc-400">
          Taxonomy Engine Loading
        </h3>
        <p className="text-sm text-zinc-600 max-w-xs mx-auto mt-2">
          The system is re-indexing categories for optimal search performance.
        </p>
      </div>
    </div>
  );
}
