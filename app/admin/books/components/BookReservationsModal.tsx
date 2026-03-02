import { Reservation } from "@/types/admin";
import { History, X, Clock, User, Calendar } from "lucide-react";

interface BookReservationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookTitle?: string;
  reservations: Reservation[];
  isLoading: boolean;
}

export default function BookReservationsModal({
  isOpen,
  onClose,
  bookTitle,
  reservations,
  isLoading,
}: BookReservationsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-[2.5rem] glass-light border border-white/10 flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <History className="text-(--clr-primary-a10)" />
              History
            </h3>
            <p className="text-sm text-zinc-500 mt-1 font-medium italic">
              &quot;{bookTitle}&quot;
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-12 h-12 border-2 border-(--clr-primary-a10) border-t-transparent rounded-full animate-spin shadow-lg shadow-(--clr-primary-a10)/20" />
              <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">
                Retrieving logs...
              </p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
              <Clock size={48} className="mb-4 text-zinc-500" />
              <p className="text-lg font-bold text-white">No Record History</p>
              <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">
                Everything is up to date
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-white/10 hover:bg-white/[0.07] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-tight">
                        {res.user.first_name} {res.user.last_name}
                      </p>
                      <p className="text-xs text-zinc-500 font-medium">
                        {res.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <span
                        className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                          res.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-500"
                            : res.status === "READY"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-zinc-500/10 text-zinc-500"
                        }`}
                      >
                        {res.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-zinc-600 font-mono">
                      <Calendar size={10} />
                      {new Date(res.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-white/5 flex justify-end bg-white/5">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-2xl bg-white/5 text-white font-bold text-sm border border-white/5 hover:bg-white/10 transition-all"
          >
            Close Logs
          </button>
        </div>
      </div>
    </div>
  );
}
