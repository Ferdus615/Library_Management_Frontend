import React from "react";
import { BorrowedBooks } from "@/types/admin";
import { History as HistoryIcon, CheckCircle2, ArrowRight } from "lucide-react";

interface LoanHistoryProps {
  loans: BorrowedBooks[];
}

const LoanHistory: React.FC<LoanHistoryProps> = ({ loans }) => {
  if (loans.length === 0) {
    return (
      <div className="py-20 text-center glass rounded-[3rem] border-white/5 opacity-30">
        <HistoryIcon size={48} className="mx-auto mb-4" />
        <p className="text-lg font-bold">No completed loans yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {loans.map((loan) => (
        <div
          key={loan.id}
          className="glass group p-6 rounded-3xl border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-6 text-center sm:text-left">
            <div className="w-12 h-12 rounded-2xl bg-(--clr-success-a0)/20 flex items-center justify-center text-(--clr-success-a10)">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h3 className="font-medium text-sm group-hover:text-(--clr-primary-a10) transition-colors">
                {loan.book.title}
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                Returned on {new Date(loan.return_date!).toLocaleDateString()}
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
      ))}
    </div>
  );
};

export default LoanHistory;
