"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminService } from "@/services/admin.service";
import { PendingFine } from "@/types/admin";
import ActionButton from "@/components/ui/ActionButton";
import { toast } from "sonner";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  User as UserIcon,
  BookOpen,
  DollarSign,
  Activity,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const ITEMS_PER_PAGE = 8;

export default function FinesPage() {
  const [fines, setFines] = useState<PendingFine[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [paidCount, setPaidCount] = useState(0);
  const [totalUnpaidAmount, setTotalUnpaidAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchFines = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await adminService.getFines({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch,
      });
      setFines(response.data || []);
      setTotalRecords(response.total || 0);
      setActiveCount(response.activeCount || 0);
      setPaidCount(response.paidCount || 0);
      setTotalUnpaidAmount(response.totalUnpaidAmount || 0);
    } catch (error) {
      console.error("Failed to fetch fines:", error);
      toast.error("Failed to fetch fines data");
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchFines();
  }, [fetchFines]);

  const stats = {
    active: activeCount,
    paid: paidCount,
    unpaidAmount: totalUnpaidAmount,
  };

  const handlePayFine = async (fineID: string) => {
    try {
      await adminService.payFine(fineID);
      toast.success("Fine paid successfully!");
      fetchFines(); // Refresh the list
    } catch (error) {
      toast.error("Failed to pay fine");
      console.error(error);
    }
  };

  // Pagination derived values
  const totalPages = Math.max(1, Math.ceil(totalRecords / ITEMS_PER_PAGE));
  const paginatedFines = fines;

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-white tracking-tight">
            Fine <span className="text-(--clr-primary-a10)">Management</span>
          </h1>
          <p className="text-sm text-zinc-500 font-medium">
            Track and process member late return penalties.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative group w-full md:w-80">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-(--clr-primary-a10) transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search member or book..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-(--clr-primary-a0)/50 focus:border-(--clr-primary-a0)/50 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-zinc-500 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* stat card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Active fine",
            value: stats.active,
            icon: BanknoteArrowDown,
            color: "text-(--clr-warning-a10)",
            bg: "bg-(--clr-warning-a10)/10",
          },
          {
            label: "Paid fine",
            value: stats.paid,
            icon: BanknoteArrowUp,
            color: "text-(--clr-success-a10)",
            bg: "bg-(--clr-success-a10)/10",
          },
          {
            label: "Total Unpaid Amount",
            value: `$${stats.unpaidAmount.toFixed(2)}`,
            icon: DollarSign,
            color: "text-(--clr-danger-a10)",
            bg: "bg-(--clr-danger-a10)/10",
          },
        ].map(
          (stat, i) =>
            stat && (
              <div
                key={i}
                className="glass group relative overflow-hidden p-6 rounded-3xl border border-white/5 transition-all hover:border-white/10"
              >
                <div
                  className={`absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity`}
                >
                  <stat.icon size={120} />
                </div>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-2xl ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-black text-white mt-0.5">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ),
        )}
      </div>

      <div className="glass rounded-3xl border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <UserIcon size={14} />
                    Member
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} />
                    Book
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <DollarSign size={14} />
                    Amount
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Activity size={14} />
                    Status
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-24 text-center text-zinc-500"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-(--clr-primary-a0)/20 border-t-(--clr-primary-a10) rounded-full animate-spin" />
                      <p className="font-medium animate-pulse">
                        Loading fine data...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedFines.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <Search className="w-10 h-10 text-zinc-700" />
                      <p className="text-zinc-500 text-lg font-bold">
                        {searchQuery
                          ? "No fines match your search"
                          : "No fine records found"}
                      </p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-xs text-(--clr-primary-a10) font-bold hover:underline underline-offset-4"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedFines.map((fine) => (
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
                        {fine.book_title}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono italic">
                        Due: {new Date(fine.loan.due_date).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-black text-(--clr-info-a20)">
                        ${fine.total_amount.toFixed(2)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          fine.paid
                            ? "bg-(--clr-success-a0)/20 text-(--clr-success-a10)"
                            : "bg-(--clr-danger-a0)/20 text-(--clr-danger-a10)"
                        }`}
                      >
                        {fine.paid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!fine.paid && (
                        <ActionButton
                          onClick={() => handlePayFine(fine.id)}
                          confirmTitle="Settle Fine"
                          confirmMessage={`Are you sure you want to mark this fine of $${fine.total_amount.toFixed(2)} for "${fine.book_title}" as paid?`}
                          confirmText="Mark as Paid"
                        >
                          Paid
                        </ActionButton>
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
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/2">
            <p className="text-xs text-zinc-500">
              Showing{" "}
              <span className="font-bold text-zinc-300">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>
              {" – "}
              <span className="font-bold text-zinc-300">
                {Math.min(currentPage * ITEMS_PER_PAGE, totalRecords)}
              </span>{" "}
              of <span className="font-bold text-zinc-300">{totalRecords}</span>{" "}
              records
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
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
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
