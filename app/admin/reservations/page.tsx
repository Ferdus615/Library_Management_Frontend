"use client";

import React, { useState, useEffect } from "react";
import { adminService } from "@/services/admin.service";
import { PendingRequest } from "@/types/admin";
import { toast } from "sonner";
import {
  Clock,
  BookOpen,
  User as UserIcon,
  Calendar,
  XCircle,
  Activity,
} from "lucide-react";
import ActionButton from "@/components/ui/ActionButton";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getRequests();
      setReservations(data);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
      toast.error("Failed to fetch reservations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleReservationReceived = async (id: string) => {
    try {
      await adminService.receiveReservation(id);
      toast.success("Reservation received successfully");
      fetchReservations();
    } catch (error) {
      console.error("Failed to receive reservation:", error);
      toast.error("Failed to receive reservation");
    }
  };

  const handleCancelReservation = async (id: string) => {
    try {
      await adminService.cancelReservation(id);
      toast.success("Reservation cancelled successfully");
      fetchReservations();
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
      toast.error("Failed to cancel reservation");
    }
  };

  const stats = {
    pending: reservations.filter((r) => r.status === "pending").length,
    ready: reservations.filter((r) => r.status === "ready").length,
    expired: reservations.filter((r) => r.status === "expried").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tight">
          Reservation{" "}
          <span className="text-(--clr-primary-a10)">Management</span>
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Monitor and manage pending book borrow requests.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Stats */}
        <div className="glass group relative overflow-hidden p-6 rounded-3xl border border-white/5 transition-all hover:border-white/10">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Clock size={120} />
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-(--clr-primary-a10)/10">
              <Clock className="w-6 h-6 text-(--clr-primary-a10)" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Pending Requests
              </p>
              <p className="text-3xl font-black text-white mt-0.5">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        {/* Ready Stats */}
        <div className="glass group relative overflow-hidden p-6 rounded-3xl border border-white/5 transition-all hover:border-white/10">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Activity size={120} />
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10">
              <Activity className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Ready for Pickup
              </p>
              <p className="text-3xl font-black text-white mt-0.5">
                {stats.ready}
              </p>
            </div>
          </div>
        </div>

        {/* Expired Stats */}
        <div className="glass group relative overflow-hidden p-6 rounded-3xl border border-white/5 transition-all hover:border-white/10">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <XCircle size={120} />
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-red-500/10">
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Expired Requests
              </p>
              <p className="text-3xl font-black text-white mt-0.5">
                {stats.expired}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} />
                    Book
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <UserIcon size={14} />
                    Member
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    Request Date
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Activity size={14} />
                    Status
                  </div>
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
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-(--clr-primary-a10) border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm font-medium">
                        Loading reservations...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : reservations.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-bold text-zinc-400">
                      No pending reservations
                    </p>
                    <p className="text-sm text-zinc-600">
                      All requests have been processed.
                    </p>
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
                      <p className="text-sm font-medium text-zinc-200">
                        {res.user.first_name} {res.user.last_name}
                      </p>
                      <p className="text-[10px] text-zinc-500">
                        ID: {res.user.id}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-zinc-400">
                        {new Date(res.created_at).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-(--clr-primary-a10)/10 text-(--clr-primary-a10) text-[10px] font-bold rounded-lg uppercase tracking-wider">
                        {res.status}
                      </span>
                    </td>

                    <td className="flex items-center gap-2 px-6 py-7 text-right border-l border-(--clr-info-a10)/10">
                      <ActionButton
                        onClick={() => handleReservationReceived(res.id)}
                        className="bg-(--clr-success-a10)/10 border-(--clr-success-a10)/20 text-(--clr-success-a10) hover:bg-(--clr-success-a0) hover:text-white"
                      >
                        Received
                      </ActionButton>

                      <ActionButton
                        onClick={() => handleCancelReservation(res.id)}
                        className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-red-500/20"
                      >
                        <div className="flex items-center gap-1">
                          <XCircle size={14} />
                          Cancel
                        </div>
                      </ActionButton>
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
