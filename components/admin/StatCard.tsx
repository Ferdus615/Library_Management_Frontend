import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export default function StatCard({
  title,
  value,
  icon,
  colorClass,
  trend,
}: StatCardProps) {
  return (
    <div className="rounded-xl bg-(--clr-surface-tonal-a0) border border-(--clr-surface-a20) p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-lg ${colorClass}`}
        >
          {icon}
        </div>
        {trend && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              trend.isPositive
                ? "bg-(--clr-success-a0)/20 text-(--clr-success-a10)"
                : "bg-(--clr-danger-a0)/20 text-(--clr-danger-a10)"
            }`}
          >
            {trend.isPositive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>
      <p className="text-sm font-medium text-(--clr-surface-a50) mb-1">
        {title}
      </p>
      <p className="text-3xl font-bold text-(--clr-light-a0)">{value}</p>
    </div>
  );
}
