import React from "react";
import {
  BookOpen,
  User,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Search,
} from "lucide-react";
import ActionButton from "@/components/ui/ActionButton";
import { BorrowedBooks } from "@/types/admin";
import Image from "next/image";

interface BorrowedBooksTableProps {
  borrowedBooks: BorrowedBooks[];
  isLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onReturn: (loanId: string) => void;
  searchQuery: string;
  onSearchClear: () => void;
}

export default function BorrowedBooksTable({
  borrowedBooks,
  isLoading,
  currentPage,
  itemsPerPage,
  totalRecords,
  onPageChange,
  onReturn,
  searchQuery,
  onSearchClear,
}: BorrowedBooksTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));

  const goToPage = (page: number) => {
    onPageChange(Math.min(Math.max(1, page), totalPages));
  };

  return (
    <div className="glass rounded-4xl border border-white/5 overflow-hidden shadow-2xl shadow-black/20">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                  <BookOpen size={14} />
                  Item Details
                </div>
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                  <User size={14} />
                  Member Info
                </div>
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  Dates
                </div>
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                <div className="flex items-center gap-2">
                  <Clock size={14} />
                  Status
                </div>
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-8 py-24 text-center text-zinc-500"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-(--clr-primary-a0)/20 border-t-(--clr-primary-a10) rounded-full animate-spin" />
                    <p className="font-medium animate-pulse">
                      Synchronizing inventory records...
                    </p>
                  </div>
                </td>
              </tr>
            ) : borrowedBooks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-8 py-24 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <Search className="w-10 h-10 text-zinc-700" />
                    <p className="text-zinc-500 text-lg font-bold">
                      {searchQuery
                        ? "No borrowed books match your search"
                        : "No borrowed books found"}
                    </p>
                    {searchQuery && (
                      <button
                        onClick={onSearchClear}
                        className="text-xs text-(--clr-primary-a10) font-bold hover:underline underline-offset-4"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              borrowedBooks.map((item) => (
                <tr
                  key={item.id}
                  className="group hover:bg-white/2 transition-colors"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 rounded-lg bg-zinc-800 overflow-hidden shrink-0 border border-white/10 group-hover:border-(--clr-primary-a0)/50 transition-all duration-300">
                        {item.book.cover_image ? (
                          <Image
                            src={item.book.cover_image}
                            alt={item.book.title}
                            width={100}
                            height={100}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen className="w-5 h-5 text-zinc-600" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 max-w-[200px]">
                        <p
                          title={item.book.title}
                          className="text-sm font-black text-white truncate group-hover:text-(--clr-primary-a10) transition-colors"
                        >
                          {item.book.title}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">
                          ISBN: {item.book.isbn}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                        <User className="w-3.5 h-3.5 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white leading-none">
                          {item.user.first_name} {item.user.last_name}
                        </p>
                        <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                          {item.user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1.5 font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-500" />
                        <span className="text-[10px] text-zinc-400">
                          Issued:{" "}
                          {new Date(item.issue_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-1 h-1 rounded-full ${item.status === "overdue" ? "bg-red-500 animate-pulse" : "bg-zinc-600"}`}
                        />
                        <span
                          className={`text-[10px] ${item.status === "overdue" ? "text-red-400 font-bold" : "text-zinc-500"}`}
                        >
                          Due: {new Date(item.due_date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border transition-colors ${
                        item.status === "issued"
                          ? "bg-(--clr-primary-a0)/10 text-(--clr-primary-a10) border-(--clr-primary-a0)/20"
                          : item.status === "returned"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20 animate-pulse"
                      }`}
                    >
                      {item.status === "issued" && (
                        <Clock className="w-3 h-3" />
                      )}
                      {item.status === "returned" && (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                      {item.status === "overdue" && (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {item.status !== "returned" ? (
                      <div className="flex items-center justify-end gap-2">
                        <ActionButton
                          onClick={() => onReturn(item.id)}
                          className="bg-zinc-800 hover:bg-emerald-600 border-white/5 hover:border-emerald-500 transition-all duration-300"
                          confirmTitle="Return Book"
                          confirmMessage={`Are you sure you want to mark "${item.book.title}" as returned?`}
                          confirmText="Mark as Returned"
                        >
                          <div className="flex items-center gap-2">
                            <RotateCcw className="w-3.5 h-3.5 translate-y-px" />
                            <span>Return</span>
                          </div>
                        </ActionButton>
                      </div>
                    ) : (
                      <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest italic pr-4">
                        Received
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && totalRecords > 0 && (
        <div className="flex items-center justify-between px-8 py-4 border-t border-white/5 bg-white/2">
          <p className="text-xs text-zinc-500">
            Showing{" "}
            <span className="font-bold text-zinc-300">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>
            {" – "}
            <span className="font-bold text-zinc-300">
              {Math.min(currentPage * itemsPerPage, totalRecords)}
            </span>{" "}
            of <span className="font-bold text-zinc-300">{totalRecords}</span>{" "}
            records
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      page === currentPage
                        ? "bg-(--clr-primary-a10) text-white shadow-lg"
                        : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
