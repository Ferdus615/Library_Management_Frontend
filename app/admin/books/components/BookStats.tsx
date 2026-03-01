import { Book } from "@/types/admin";
import { BookOpen, CheckCircle, AlertTriangle } from "lucide-react";

interface BookStatsProps {
  books: Book[];
}

export default function BookStats({ books }: BookStatsProps) {
  const available = books.reduce((acc, curr) => acc + curr.available_copies, 0);
  const damaged = books.reduce((acc, curr) => acc + curr.damaged_copies, 0);

  const stats = [
    {
      label: "Showing",
      value: books.length,
      suffix: "Titles",
      icon: BookOpen,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Available Copies",
      value: available,
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Damaged Copies",
      value: damaged,
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
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
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-3xl font-black text-white mt-0.5">
                {stat.value}
                {stat.suffix && (
                  <span className="text-xs font-medium text-zinc-500 capitalize ml-1">
                    {stat.suffix}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
