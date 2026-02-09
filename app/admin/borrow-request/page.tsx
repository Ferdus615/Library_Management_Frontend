"use client";

import React from "react";

export default function AdminBorrowRequestPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Borrow Requests
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Approve or decline book issuance requests.
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
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-zinc-400">
          Request Queue Synced
        </h3>
        <p className="text-sm text-zinc-600 max-w-xs mx-auto mt-2">
          All requests are currently being processed by the background engine.
        </p>
      </div>
    </div>
  );
}
