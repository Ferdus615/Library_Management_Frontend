"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalResults: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  label?: string;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalResults,
  itemsPerPage,
  onPageChange,
  label = "records",
  className = "",
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalResults / itemsPerPage));

  if (totalResults === 0) return null;

  return (
    <div
      className={`px-8 py-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between bg-white/2 gap-4 ${className}`}
    >
      <p className="text-xs text-zinc-500 font-medium order-2 sm:order-1">
        Showing{" "}
        <span className="font-bold text-zinc-300">
          {(currentPage - 1) * itemsPerPage + 1}
        </span>
        {" – "}
        <span className="font-bold text-zinc-300">
          {Math.min(currentPage * itemsPerPage, totalResults)}
        </span>{" "}
        of <span className="font-bold text-zinc-300">{totalResults}</span>{" "}
        {label}
      </p>

      <div className="flex items-center gap-2 order-1 sm:order-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1 mx-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            // Smart pagination logic for ellipsis
            if (
              totalPages > 7 &&
              Math.abs(page - currentPage) > 1 &&
              page !== 1 &&
              page !== totalPages
            ) {
              if (page === 2 || page === totalPages - 1) {
                return (
                  <span key={page} className="text-zinc-600 px-1 select-none">
                    ...
                  </span>
                );
              }
              return null;
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all active:scale-90 cursor-pointer ${
                  page === currentPage
                    ? "bg-(--clr-primary-a10) text-white shadow-lg shadow-(--clr-primary-a0)/20"
                    : "bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white border border-white/5"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 cursor-pointer"
          title="Next Page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
