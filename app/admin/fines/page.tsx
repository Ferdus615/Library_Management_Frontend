"use client";

import React, { useState, useEffect } from "react";
import { adminService } from "@/services/admin.service";
import { PendingFine } from "@/types/admin";
import AdminActionButton from "@/components/ui/ActionButton";
import { toast } from "sonner";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  User as UserIcon,
  BookOpen,
  DollarSign,
  Activity,
} from "lucide-react";

export default function FinesPage() {
  const [fines, setFines] = useState<PendingFine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFines = async () => {
    try {
      const data = await adminService.getFines();
      setFines(data);
    } catch (error) {
      console.error("Failed to fetch fines:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  const stats = {
    active: fines.filter((fine) => fine.paid === false).length,
    paid: fines.filter((fine) => fine.paid === true).length,
  };

  const handlePayFine = async (fineID: string) => {
    try {
      await adminService.payFine(fineID);
      toast.success("Fine paid successfully!");
      fetchFines(); // Refresh the list
    } catch (error) {
      toast.error("Failed to pay fine");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tight">
          Fine <span className="text-(--clr-primary-a10)">Management</span>
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Track and process member late return penalties.
        </p>
      </div>

      {/* stat card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          {
            label: "Active fine",
            value: stats.active,
            icon: BanknoteArrowDown,
            color: "text-(--clr-warning-a10)",
            bg: "bg-(--clr-warning-a10)/10",
          },
          {
            label: "Paid fine",
            value: stats.paid,
            icon: BanknoteArrowUp,
            color: "text-(--clr-success-a10)",
            bg: "bg-(--clr-success-a10)/10",
          },
        ].map(
          (stat, i) =>
            stat && (
              <div
                key={i}
                className="glass group relative overflow-hidden p-6 rounded-3xl border border-white/5 transition-all hover:border-white/10"
              >
                <div
                  className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity`}
                >
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
            ),
        )}
      </div>

      <div className="glass rounded-3xl border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <UserIcon size={14} />
                    Member
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} />
                    Book
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} />
                    Amount
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Activity size={14} />
                    Status
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    Loading fine data...
                  </td>
                </tr>
              ) : fines.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    No fine records found.
                  </td>
                </tr>
              ) : (
                fines.map((fine) => (
                  <tr
                    key={fine.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white group-hover:text-(--clr-primary-a10) transition-colors">
                        {fine.user.first_name} {fine.user.last_name}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        {fine.user.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-white">
                        {fine.book_title}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono italic">
                        Due: {new Date(fine.loan.due_date).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-(--clr-info-a20)">
                        ${fine.total_amount.toFixed(2)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          fine.paid
                            ? "bg-(--clr-success-a0)/20 text-(--clr-success-a10)"
                            : "bg-(--clr-danger-a0)/20 text-(--clr-danger-a10)"
                        }`}
                      >
                        {fine.paid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right border border-(--clr-primary-a0)/20">
                      {!fine.paid && (
                        <AdminActionButton
                          onClick={() => handlePayFine(fine.id)}
                        >
                          Paid
                        </AdminActionButton>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
