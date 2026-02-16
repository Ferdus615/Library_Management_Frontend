"use client";

import React, { useState, useEffect } from "react";
import { adminService } from "@/services/admin.service";
import { PendingRequest } from "@/types/admin";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await adminService.getRequests();
        setReservations(data);
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReservations();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Reservations
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Manage pending book borrow requests.
        </p>
      </div>

      <div className="glass rounded-3xl border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Book
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Member
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Request Date
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
                    colSpan={4}
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    Loading reservations...
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    No pending reservations found.
                  </td>
                </tr>
              ) : (
                reservations.map((res) => (
                  <tr
                    key={res.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white group-hover:text-(--clr-primary-a10) transition-colors">
                        {res.book.title}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        ID: {res.book.id}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-white">
                        {res.user.first_name} {res.user.last_name}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        ID: {res.user.id}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-zinc-400">
                        {new Date(res.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="px-4 py-2 bg-(--clr-primary-a0)/10 hover:bg-(--clr-primary-a0) text-(--clr-primary-a10) hover:text-white rounded-xl text-xs font-bold transition-all active:scale-95 border border-(--clr-primary-a0)/20">
                        Process
                      </button>
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
