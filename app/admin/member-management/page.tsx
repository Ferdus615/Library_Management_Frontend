"use client";

import React from "react";

export default function AdminMemberManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Member Management
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Oversee user accounts, memberships, and fine balances.
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
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-zinc-400">
          Member Directory Initializing
        </h3>
        <p className="text-sm text-zinc-600 max-w-xs mx-auto mt-2">
          Loading member dossiers and historical activity records.
        </p>
      </div>
    </div>
  );
}
