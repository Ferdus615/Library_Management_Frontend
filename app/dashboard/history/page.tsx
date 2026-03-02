"use client";

import React, { useState, useEffect } from "react";
import { adminService } from "@/services/admin.service";
import { authService } from "@/services/auth.service";
import { BorrowedBooks, PendingRequest, PendingFine } from "@/types/admin";
import { toast } from "sonner";
import LoanHistory from "@/app/dashboard/history/components/LoanHistory";
import ReservationHistory from "@/app/dashboard/history/components/ReservationHistory";
import FineHistory from "@/app/dashboard/history/components/FineHistory";

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState<
    "loans" | "reservations" | "fines"
  >("loans");
  const [loans, setLoans] = useState<BorrowedBooks[]>([]);
  const [reservations, setReservations] = useState<PendingRequest[]>([]);
  const [fines, setFines] = useState<PendingFine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = authService.getUser();
        if (user) {
          const [loansData, resData, finesData] = await Promise.all([
            adminService.getMemberLoans(user.id),
            adminService.getMemberReservations(user.id),
            adminService.getMemberFines(user.id),
          ]);
          setLoans(loansData.filter((l) => l.return_date));
          setReservations(resData);
          setFines(finesData);
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tight">
          User <span className="text-(--clr-primary-a10)">History</span>
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          A permanent record of your reading activity and reservations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl border border-white/5 w-fit">
        <button
          onClick={() => setActiveTab("fines")}
          className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
            activeTab === "fines"
              ? "bg-white text-black shadow-lg"
              : "text-zinc-500 hover:text-white"
          }`}
        >
          Fines
        </button>

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
        <LoanHistory loans={loans} />
      ) : activeTab === "reservations" ? (
        <ReservationHistory reservations={reservations} />
      ) : (
        <FineHistory fines={fines} />
      )}
    </div>
  );
}
