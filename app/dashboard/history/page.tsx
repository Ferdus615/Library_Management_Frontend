"use client";

import React, { useState, useEffect } from "react";
import { adminService } from "@/services/admin.service";
import { authService } from "@/services/auth.service";
import { BorrowedBooks, PendingRequest } from "@/types/admin";
import { toast } from "sonner";
import {
  History as HistoryIcon,
  Bookmark,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<"loans" | "reservations">("loans");
  const [loans, setLoans] = useState<BorrowedBooks[]>([]);
  const [reservations, setReservations] = useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = authService.getUser();
        if (user) {
          const [loansData, resData] = await Promise.all([
            adminService.getMemberLoans(user.id),
            adminService.getMemberReservations(user.id),
          ]);
          setLoans(loansData.filter((l) => l.return_date));
          setReservations(resData);
        }
      } catch (error) {
        console.error("History fetch error:", error);
        toast.error("Failed to load history records");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getReservationStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "fulfilled":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "cancelled":
        return "text-zinc-500 bg-zinc-500/10 border-zinc-500/20";
      case "pending":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      default:
        return "text-indigo-400 bg-indigo-400/10 border-indigo-400/20";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tight">
          Service <span className="text-(--clr-primary-a10)">History</span>
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          A permanent record of your reading activity and reservations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 w-fit">
        <button
          onClick={() => setActiveTab("loans")}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === "loans"
              ? "bg-white text-black shadow-lg"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          Past Loans
        </button>
        <button
          onClick={() => setActiveTab("reservations")}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === "reservations"
              ? "bg-white text-black shadow-lg"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          Reservations
        </button>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="glass h-24 rounded-3xl animate-pulse border-white/5"
            />
          ))}
        </div>
      ) : activeTab === "loans" ? (
        <div className="space-y-4">
          {loans.length === 0 ? (
            <div className="py-20 text-center glass rounded-[3rem] border-white/5 opacity-30">
              <HistoryIcon size={48} className="mx-auto mb-4" />
              <p className="text-lg font-bold">No completed loans yet</p>
            </div>
          ) : (
            loans.map((loan) => (
              <div
                key={loan.id}
                className="glass group p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-6 text-center sm:text-left">
                  <div className="w-12 h-12 rounded-2xl bg-(--clr-success-a0)/20 flex items-center justify-center text-(--clr-success-a10)">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-(--clr-primary-a10) transition-colors">
                      {loan.book.title}
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium">
                      Returned on{" "}
                      {new Date(loan.return_date!).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-black/20 px-6 py-3 rounded-2xl border border-white/5">
                  <div className="text-center sm:text-right">
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-tight">
                      Issue
                    </p>
                    <p className="text-xs font-mono text-white/40">
                      {new Date(loan.issue_date).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowRight size={14} className="text-zinc-800" />
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-tight">
                      Return
                    </p>
                    <p className="text-xs font-mono text-white/40">
                      {new Date(loan.return_date!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.length === 0 ? (
            <div className="py-20 text-center glass rounded-[3rem] border-white/5 opacity-30">
              <Bookmark size={48} className="mx-auto mb-4" />
              <p className="text-lg font-bold">No reservation history</p>
            </div>
          ) : (
            reservations.map((res) => (
              <div
                key={res.id}
                className="glass group p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row items-center justify-between gap-6"
              >
                <div className="flex items-center gap-6 text-center sm:text-left">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center`}
                  >
                    <Bookmark className="text-zinc-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white group-hover:text-(--clr-primary-a10) transition-colors">
                      {res.book.title}
                    </h3>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getReservationStatusStyle(
                          res.status,
                        )}`}
                      >
                        {res.status}
                      </span>
                      <span className="text-[10px] text-zinc-600">
                        Requested on{" "}
                        {new Date(res.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {res.status.toLowerCase() === "pending" && (
                    <button className="px-4 py-2 bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-red-500/10 transition-all active:scale-95">
                      Cancel Request
                    </button>
                  )}
                  <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                    <Clock size={14} className="text-zinc-600" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
