"use client";

import { authService } from "@/services/auth.service";
import React from "react";

export default function MemberProfilePage() {
  const user = authService.getUser();

  const userName = user ? user.first_name + " " + user.last_name : "Loading...";
  const status = user ? user.role : "Loading...";
  const userStatus = status[0].toUpperCase() + status.slice(1);
  const email = user ? user.email : "Loading...";
  const membershipState = user
    ? user.is_active
      ? "Active"
      : "Inactive"
    : "Loading...";

  const info = [
    { label: "Email", value: email },
    { label: "Status", value: userStatus },
    { label: "State", value: membershipState },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center text-(--clr-primary-a10)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Your Profile
          </h1>
        </div>
        <p className="text-sm text-zinc-500 font-medium">
          Manage your personal details and app settings.
        </p>
      </div>

      <div className="glass-light rounded-[2rem] border-white/5 p-10">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-zinc-400">{userName}</span>
        </div>

        {info.map((item, index) => {
          return (
            <div key={index} className="flex items-center gap-2 mt-1">
              <span className="text-sm font-medium text-(--clr-surface-a50)">
                {item.label}:
              </span>
              <p className="text-sm text-(--clr-surface-a50)"> {item.value} </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
