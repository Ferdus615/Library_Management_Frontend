import React from "react";
import Link from "next/link";
import ActivityItem from "./ActivityItem";
import { ActivityLog } from "../../types/admin";

interface RecentActivityProps {
  activities: ActivityLog[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="lg:col-span-1 glass-light rounded-3xl border border-white/5 p-6 h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-(--clr-primary-a0)/5 to-transparent blur-2xl opacity-50 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">
          System Activity
        </h2>
        <Link
          href="/admin/activity"
          className="text-xs font-bold text-zinc-500 hover:text-(--clr-primary-a10) transition-all uppercase tracking-widest border-b border-white/10 pb-1"
        >
          View All
        </Link>
      </div>

      <div className="relative z-10 space-y-3">
        {activities && activities.length > 0 ? (
          activities.map((activity, index) => (
            <ActivityItem
              key={index}
              {...activity}
              time={new Date(activity.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          ))
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 rounded-2xl border border-dashed border-white/5 bg-white/5">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-700">
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
                  strokeWidth={1}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
                Quiet Mode
              </h3>
              <p className="text-xs text-zinc-600 max-w-[140px] font-medium leading-relaxed">
                System activity is currently suppressed or synchronized.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
