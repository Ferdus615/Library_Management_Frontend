import React from "react";
import { PendingFine } from "@/types/admin";
import { DollarSign, CheckCircle2, XCircle } from "lucide-react";

interface FineHistoryProps {
  fines: PendingFine[];
}

const FineHistory: React.FC<FineHistoryProps> = ({ fines }) => {
  if (fines.length === 0) {
    return (
      <div className="py-20 text-center glass rounded-[3rem] border-white/5 opacity-30">
        <DollarSign size={48} className="mx-auto mb-4" />
        <p className="text-lg font-bold">No fine records found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {fines.map((fine) => (
        <div
          key={fine.id}
          className="glass group p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-6 text-center sm:text-left">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                fine.paid
                  ? "bg-(--clr-success-a0)/20 text-(--clr-success-a10)"
                  : "bg-(--clr-danger-a0)/20 text-(--clr-danger-a10)"
              }`}
            >
              {fine.paid ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
            </div>
            <div>
              <h3 className="font-medium text-sm group-hover:text-(--clr-primary-a10) transition-colors">
                {fine.book_title}
              </h3>
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-1">
                <span
                  className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                    fine.paid
                      ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                      : "text-rose-400 bg-rose-400/10 border-rose-400/20"
                  }`}
                >
                  {fine.paid ? "Paid" : "Unpaid"}
                </span>
                <span className="text-xs font-black text-(--clr-info-a20)">
                  ${fine.total_amount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-black/20 px-6 py-3 rounded-2xl border border-white/5">
            <div className="text-center sm:text-right">
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-tight">
                Due Date
              </p>
              <p className="text-xs font-mono text-white/40">
                {new Date(fine.loan.due_date).toLocaleDateString()}
              </p>
            </div>
            <div className="w-px h-8 bg-white/5" />
            <div className="text-center sm:text-left">
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-tight">
                {fine.paid ? "Paid At" : "Returned At"}
              </p>
              <p className="text-xs font-mono text-white/40">
                {fine.paid_at
                  ? new Date(fine.paid_at).toLocaleDateString()
                  : fine.loan.return_date
                    ? new Date(fine.loan.return_date).toLocaleDateString()
                    : "Not Returned"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FineHistory;
