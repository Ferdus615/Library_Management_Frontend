import React from "react";
import { Clock, Activity, XCircle } from "lucide-react";
import { PendingRequest } from "@/types/admin";

interface ReservationStatsProps {
  reservations: PendingRequest[];
}

export default function ReservationStats({
  reservations,
}: ReservationStatsProps) {
  const stats = {
    pending: reservations.filter((r) => r.status === "pending").length,
    ready: reservations.filter((r) => r.status === "ready").length,
    expired: reservations.filter((r) => r.status === "expried").length, // 'expried' spelling from backend
  };

  return (
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
  );
}
