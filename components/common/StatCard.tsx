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
    <div className="group relative overflow-hidden rounded-2xl bg-(--clr-surface-tonal-a0) border border-(--clr-surface-a20) p-6 transition-all duration-300 hover:border-(--clr-primary-a0)/50 hover:shadow-2xl hover:shadow-black/40 hover:-translate-y-1">
      {/* Background Glow */}
      <div
        className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 blur-2xl transition-opacity group-hover:opacity-20 ${colorClass.split(" ")[0]}`}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${colorClass}`}
          >
            {icon}
          </div>
          {trend && (
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                trend.isPositive
                  ? "bg-(--clr-success-a0)/20 text-(--clr-success-a10)"
                  : "bg-(--clr-danger-a0)/20 text-(--clr-danger-a10)"
              }`}
            >
              <span className="text-sm">{trend.isPositive ? "↑" : "↓"}</span>{" "}
              {trend.value}
            </span>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-(--clr-surface-a50) mb-1 group-hover:text-(--clr-surface-a70) transition-colors">
            {title}
          </p>
          <p className="text-3xl font-bold text-(--clr-light-a0) tracking-tight">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div
        className={`absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-transparent via-current to-transparent opacity-50 transition-all duration-500 group-hover:w-full ${colorClass.split(" ")[1]}`}
      />
    </div>
  );
}
