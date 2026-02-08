import React from "react";
import Link from "next/link";
import ActivityItem from "./ActivityItem";
import { ActivityLog } from "../../types/admin";

interface RecentActivityProps {
  activities: ActivityLog[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="lg:col-span-1 rounded-xl bg-(--clr-surface-tonal-a0) border border-(--clr-surface-a20) p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-(--clr-light-a0)">
          Recent Activity
        </h2>
        <Link
          href="/admin/activity"
          className="text-xs text-(--clr-primary-a10) hover:text-(--clr-primary-a20) transition-colors"
        >
          View all
        </Link>
      </div>
      <div className="space-y-1">
        {activities.length > 0 ? (
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
          <p className="text-sm text-(--clr-surface-a50) py-4 text-center">
            No recent activity
          </p>
        )}
      </div>
    </div>
  );
}
