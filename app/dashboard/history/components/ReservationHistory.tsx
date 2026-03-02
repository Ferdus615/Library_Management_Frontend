import React from "react";
import { PendingRequest } from "@/types/admin";
import { Bookmark, Clock } from "lucide-react";

interface ReservationHistoryProps {
  reservations: PendingRequest[];
}

const ReservationHistory: React.FC<ReservationHistoryProps> = ({
  reservations,
}) => {
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

  if (reservations.length === 0) {
    return (
      <div className="py-20 text-center glass rounded-[3rem] border-white/5 opacity-30">
        <Bookmark size={48} className="mx-auto mb-4" />
        <p className="text-lg font-bold">No reservation history</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reservations.map((res) => (
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
              <h3 className="font-medium text-sm group-hover:text-(--clr-primary-a10) transition-colors">
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
                  Requested on {new Date(res.created_at).toLocaleDateString()}
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
      ))}
    </div>
  );
};

export default ReservationHistory;
