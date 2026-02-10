"use client";

import React, { useState, useEffect } from "react";
import { adminService } from "@/services/admin.service";
import { PendingFine } from "@/types/admin";

export default function FinesPage() {
  const [fines, setFines] = useState<PendingFine[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
    fetchFines();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Fine Management
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Track and process member late return penalties.
        </p>
      </div>

      <div className="glass rounded-3xl border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Member
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Book
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Amount
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest text-right">
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
                        {fine.loan.book.title}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono italic">
                        Due: {new Date(fine.loan.due_date).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-(--clr-danger-a10)">
                        ${fine.total_amount.toFixed(2)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          fine.paid
                            ? "bg-(--clr-primary-a0)/20 text-(--clr-primary-a10)"
                            : "bg-(--clr-danger-a0)/20 text-(--clr-danger-a10)"
                        }`}
                      >
                        {fine.paid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!fine.paid && (
                        <button className="px-4 py-2 bg-(--clr-primary-a0)/10 hover:bg-(--clr-primary-a0) text-(--clr-primary-a10) hover:text-white rounded-xl text-xs font-bold transition-all active:scale-95 border border-(--clr-primary-a0)/20">
                          Mark Paid
                        </button>
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
