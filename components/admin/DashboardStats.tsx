import React from "react";
import StatCard from "../common/StatCard";
import { AdminDashboardData } from "../../types/admin";

interface DashboardStatsProps {
  stats: AdminDashboardData | null;
}

type StatConfig = {
  title: string;
  key: keyof AdminDashboardData;
  color: keyof typeof colorMap;
  iconPath: string;
  isCurrency?: boolean;
};

const colorMap = {
  blue: "bg-blue-500/10 text-blue-400",
  indigo: "bg-indigo-500/10 text-indigo-400",
  emerald: "bg-emerald-500/10 text-emerald-400",
  rose: "bg-rose-500/10 text-rose-400",
  sky: "bg-sky-500/10 text-sky-400",
  violet: "bg-violet-500/10 text-violet-400",
  amber: "bg-amber-500/10 text-amber-400",
  slate: "bg-slate-500/10 text-slate-400",
  orange: "bg-orange-500/10 text-orange-400",
  red: "bg-red-500/10 text-red-400",
  teal: "bg-teal-500/10 text-teal-400",
  cyan: "bg-cyan-500/10 text-cyan-400",
  pink: "bg-pink-500/10 text-pink-400",
  lime: "bg-lime-500/10 text-lime-400",
};

export default function DashboardStats({ stats }: DashboardStatsProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-white/5 rounded-3xl border border-white/5"
          />
        ))}
      </div>
    );
  }

  const inventoryStats: StatConfig[] = [
    {
      title: "Total Books",
      key: "totalBook",
      color: "blue",
      iconPath:
        "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
    },
    {
      title: "Total Copies",
      key: "totalCopies",
      color: "indigo",
      iconPath:
        "M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2",
    },
    {
      title: "Available",
      key: "totalAvailableCopies",
      color: "emerald",
      iconPath: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      title: "Damaged",
      key: "totalDamagedCopies",
      color: "rose",
      iconPath:
        "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    },
  ];

  const userStats: StatConfig[] = [
    {
      title: "Active Users",
      key: "totalActiveUser",
      color: "sky",
      iconPath:
        "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    },
    {
      title: "Members",
      key: "totalMembers",
      color: "violet",
      iconPath:
        "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    },
    {
      title: "Librarians",
      key: "totalLibrarian",
      color: "amber",
      iconPath:
        "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    },
    {
      title: "Admins",
      key: "totalAdmin",
      color: "slate",
      iconPath:
        "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    },
  ];

  const activityStats: StatConfig[] = [
    {
      title: "Active Loans",
      key: "totalLoanedCopies",
      color: "orange",
      iconPath:
        "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      title: "Overdue",
      key: "totalOverdueCopies",
      color: "red",
      iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      title: "Reservations",
      key: "totalReservations",
      color: "teal",
      iconPath: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      title: "Categories",
      key: "totalCategories",
      color: "cyan",
      iconPath:
        "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
    },
    {
      title: "Unpaid Fines",
      key: "totalFines",
      color: "pink",
      iconPath:
        "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      title: "Fine Amount",
      key: "totalFineAmount",
      color: "lime",
      iconPath:
        "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z",
      isCurrency: true,
    },
  ];

  const data = stats;

  const renderStatGrid = (statConfigs: StatConfig[]) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statConfigs.map((stat) => (
        <StatCard
          key={stat.key}
          title={stat.title}
          value={
            stat.isCurrency
              ? `$${data[stat.key as keyof AdminDashboardData].toLocaleString()}`
              : data[stat.key as keyof AdminDashboardData]
          }
          colorClass={colorMap[stat.color as keyof typeof colorMap]}
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={stat.iconPath}
              />
            </svg>
          }
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Primary Inventory Stats */}
      {renderStatGrid(inventoryStats)}

      {/* User Stats */}
      {renderStatGrid(userStats)}

      {/* Activity Stats */}
      {renderStatGrid(activityStats)}
    </div>
  );
}
