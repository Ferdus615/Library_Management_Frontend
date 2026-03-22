import React from "react";
import { ArrowRightLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { BorrowedBooks } from "@/types/admin";

interface BorrowedBooksStatsProps {
  borrowedBooks: BorrowedBooks[];
  totalRecords: number;
}

export default function BorrowedBooksStats({
  borrowedBooks,
  totalRecords,
}: BorrowedBooksStatsProps) {
  const stats = {
    active: borrowedBooks.filter((b) => b.status === "issued").length,
    overdue: borrowedBooks.filter((b) => b.status === "overdue").length,
    returned: borrowedBooks.filter((b) => b.status === "returned").length,
    total: totalRecords,
  };

  const statItems = [
    {
      label: "Active Loans",
      value: stats.active,
      icon: ArrowRightLeft,
      color: "text-(--clr-primary-a10)",
      bg: "bg-(--clr-primary-a10)/10",
    },
    {
      label: "Overdue Books",
      value: stats.overdue,
      icon: AlertCircle,
      color: "text-(--clr-danger-a10)",
      bg: "bg-(--clr-danger-a10)/10",
    },
    {
      label: "Total Returns",
      value: stats.returned,
      icon: CheckCircle2,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statItems.map((stat, i) => (
        <div
          key={i}
          className="glass group relative overflow-hidden p-6 rounded-3xl border border-white/5 transition-all hover:border-white/10"
        >
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <stat.icon size={120} />
          </div>
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-3xl font-black text-white mt-0.5">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
