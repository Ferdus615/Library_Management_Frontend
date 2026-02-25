"use client";

import React, { useEffect, useState } from "react";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Search,
  User,
  AlertCircle,
  MoreVertical,
  ArrowRightLeft,
  RotateCcw,
} from "lucide-react";
import AdminActionButton from "@/components/admin/AdminActionButton";
import { BorrowedBooks } from "@/types/admin";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner"; // Assuming sonner is available for notifications

export default function AdminBorrowedBooksPage() {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBooks[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBorrows = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getBorrowedBooks();
      setBorrowedBooks(data);
    } catch (error) {
      console.error("Failed to fetch borrows", error);
      toast.error("Failed to load borrowed books data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  const handleReturn = async (loanId: string) => {
    try {
      await adminService.returnBook(loanId);
      toast.success("Book marked as returned successfully");
      fetchBorrows(); // Refresh data
    } catch (error) {
      toast.error("Failed to return book");
      console.error(error);
    }
  };

  const filteredBooks = borrowedBooks.filter(
    (item) =>
      item.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = {
    active: borrowedBooks.filter((b) => b.status === "issued").length,
    overdue: borrowedBooks.filter((b) => b.status === "overdue").length,
    returned: borrowedBooks.filter((b) => b.status === "returned").length,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-(--clr-primary-a0)/10 border border-(--clr-primary-a0)/20">
            <BookOpen className="w-3.5 h-3.5 text-(--clr-primary-a10)" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-(--clr-primary-a10)">
              Circulation Management
            </span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            Borrowed <span className="text-(--clr-primary-a10)">Books</span>
          </h1>
          <p className="text-zinc-500 font-medium max-w-md">
            Monitor active loans, track due dates, and manage book returns in
            real-time.
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
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-(--clr-primary-a0)/50 focus:border-(--clr-primary-a0)/50 transition-all"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Active Loans",
            value: stats.active,
            icon: ArrowRightLeft,
            color: "text-(--clr-primary-a10)",
            bg: "bg-(--clr-primary-a10)/10",
          },
          {
            label: "Overdue Books",
            value: stats.overdue,
            icon: AlertCircle,
            color: "text-(--clr-danger-a10)",
            bg: "bg-(--clr-danger-a10)/10",
          },
          {
            label: "Total Returns",
            value: stats.returned,
            icon: CheckCircle2,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
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

      {/* Main Table Container */}
      <div className="glass rounded-4xl border border-white/5 overflow-hidden shadow-2xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                  Item Details
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                  Member Info
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                  Dates
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                  Status
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
              ) : filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Search className="w-10 h-10 text-zinc-700" />
                      <p className="text-zinc-500 font-medium">
                        No borrowed books matching your criteria.
                      </p>
                      <button
                        onClick={() => setSearchQuery("")}
                        className="text-xs text-(--clr-primary-a10) font-bold hover:underline underline-offset-4"
                      >
                        Clear all filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBooks.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-white/2 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 rounded-lg bg-zinc-800 overflow-hidden shrink-0 border border-white/10 group-hover:border-(--clr-primary-a0)/50 transition-all duration-300">
                          {item.book.cover_image ? (
                            <img
                              src={item.book.cover_image}
                              alt={item.book.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen className="w-5 h-5 text-zinc-600" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 max-w-[200px]">
                          <p className="text-sm font-black text-white truncate group-hover:text-(--clr-primary-a10) transition-colors">
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
                            Out:{" "}
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
                    <td className="px-8 py-5 text-right">
                      {item.status !== "returned" ? (
                        <div className="flex items-center justify-end gap-2">
                          <AdminActionButton
                            onClick={() => handleReturn(item.id)}
                            className="bg-zinc-800 hover:bg-emerald-600 border-white/5 hover:border-emerald-500 transition-all duration-300"
                          >
                            <div className="flex items-center gap-2">
                              <RotateCcw className="w-3.5 h-3.5 translate-y-px" />
                              <span>Return</span>
                            </div>
                          </AdminActionButton>
                        </div>
                      ) : (
                        <div className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest italic pr-4">
                          Finalized
                        </div>
                      )}
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
