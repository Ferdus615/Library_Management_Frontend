"use client";

import React, { useState, useEffect } from "react";
import { adminService } from "@/services/admin.service";
import { authService } from "@/services/auth.service";
import { BorrowedBooks } from "@/types/admin";
import { toast } from "sonner";
import {
  BookOpen,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";

export default function MyBorrowsPage() {
  const [loans, setLoans] = useState<BorrowedBooks[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const currentUser = authService.getUser();
        if (currentUser) {
          const data = await adminService.getMemberLoans(currentUser.id);
          // Only show active loans (not returned)
          setLoans(data.filter((loan) => !loan.return_date));
        }
      } catch (error) {
        console.error("Failed to fetch loans:", error);
        toast.error("Failed to load your active loans");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const getDaysRemaining = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStatus = (dueDate: string) => {
    const days = getDaysRemaining(dueDate);
    if (days < 0)
      return {
        label: "Overdue",
        color: "text-red-400 bg-red-400/10 border-red-400/20",
        icon: AlertTriangle,
      };
    if (days <= 2)
      return {
        label: "Due Soon",
        color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
        icon: Clock,
      };
    return {
      label: "Active",
      color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
      icon: CheckCircle2,
    };
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tight">
          My <span className="text-(--clr-primary-a10)">Borrows</span>
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Manage your currently issued books and monitor upcoming deadlines.
        </p>
      </div>

      {/* active loans overview */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="glass h-32 rounded-3xl animate-pulse border-white/5"
            />
          ))}
        </div>
      ) : loans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center glass rounded-3xl border-white/5">
          <BookOpen size={48} className="mb-4 text-zinc-700 animate-float" />
          <p className="text-xl font-bold text-white/40">No active loans</p>
          <p className="text-sm text-zinc-600 max-w-xs mx-auto mt-2">
            You don&apos;t have any books borrowed at the moment.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {loans.map((loan) => {
            const status = getStatus(loan.due_date);
            const daysLeft = getDaysRemaining(loan.due_date);

            return (
              <div
                key={loan.id}
                className="glass group relative flex flex-col md:flex-row items-center gap-6 p-6 rounded-4xl border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                {/* Book Thumbnail */}
                <div className="relative w-16 h-24 rounded-xl overflow-hidden bg-white/5 shrink-0 shadow-2xl">
                  {loan.book.cover_image ? (
                    <Image
                      src={loan.book.cover_image}
                      alt={loan.book.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <BookOpen size={24} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 text-center md:text-left">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                    <span
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${status.color}`}
                    >
                      <status.icon size={12} />
                      {status.label}
                    </span>
                    {daysLeft >= 0 && daysLeft <= 7 && (
                      <span className="px-3 py-1 rounded-lg bg-white/5 text-zinc-400 text-[10px] font-bold uppercase tracking-wider border border-white/5">
                        {daysLeft === 0
                          ? "Due today"
                          : `${daysLeft} days remaining`}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-white truncate group-hover:text-(--clr-primary-a10) transition-colors">
                    {loan.book.title}
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    {loan.book.author}
                  </p>
                </div>

                {/* Timeline and Dates */}
                <div className="flex flex-col sm:flex-row items-center gap-8 py-4 px-8 bg-black/20 rounded-2xl border border-white/5">
                  <div className="text-center sm:text-right">
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">
                      Issued
                    </p>
                    <p className="text-sm font-mono text-white/60">
                      {new Date(loan.issue_date).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowRight
                    size={16}
                    className="text-zinc-700 hidden sm:block"
                  />
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest mb-1">
                      Deadline
                    </p>
                    <p className="text-sm font-mono text-white font-bold">
                      {new Date(loan.due_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
