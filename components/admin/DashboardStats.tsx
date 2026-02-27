import React from "react";
import StatCard from "../common/StatCard";
import { AdminDashboardData } from "../../types/admin";
import {
  Book,
  BookCopy,
  CheckCircle,
  AlertTriangle,
  Users,
  UserRoundCheck,
  Briefcase,
  ShieldCheck,
  BookOpen,
  Clock,
  CalendarClock,
  Tag,
  HandCoins,
  Wallet,
  LucideIcon,
} from "lucide-react";

interface DashboardStatsProps {
  stats: AdminDashboardData | null;
}

type StatConfig = {
  title: string;
  key: keyof AdminDashboardData;
  color: keyof typeof colorMap;
  icon: LucideIcon;
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
      icon: Book,
    },
    {
      title: "Total Copies",
      key: "totalCopies",
      color: "indigo",
      icon: BookCopy,
    },
    {
      title: "Available",
      key: "totalAvailableCopies",
      color: "emerald",
      icon: CheckCircle,
    },
    {
      title: "Damaged",
      key: "totalDamagedCopies",
      color: "rose",
      icon: AlertTriangle,
    },
  ];

  const userStats: StatConfig[] = [
    {
      title: "Active Users",
      key: "totalActiveUser",
      color: "sky",
      icon: Users,
    },
    {
      title: "Members",
      key: "totalMembers",
      color: "violet",
      icon: UserRoundCheck,
    },
    {
      title: "Librarians",
      key: "totalLibrarian",
      color: "amber",
      icon: Briefcase,
    },
    {
      title: "Admins",
      key: "totalAdmin",
      color: "slate",
      icon: ShieldCheck,
    },
  ];

  const activityStats: StatConfig[] = [
    {
      title: "Active Loans",
      key: "totalLoanedCopies",
      color: "orange",
      icon: BookOpen,
    },
    {
      title: "Overdue",
      key: "totalOverdueCopies",
      color: "red",
      icon: Clock,
    },
    {
      title: "Reservations",
      key: "totalReservations",
      color: "teal",
      icon: CalendarClock,
    },
    {
      title: "Categories",
      key: "totalCategories",
      color: "cyan",
      icon: Tag,
    },
    {
      title: "Unpaid Fines",
      key: "totalFines",
      color: "pink",
      icon: HandCoins,
    },
    {
      title: "Fine Amount",
      key: "totalFineAmount",
      color: "lime",
      icon: Wallet,
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
          icon={<stat.icon size={24} />}
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
