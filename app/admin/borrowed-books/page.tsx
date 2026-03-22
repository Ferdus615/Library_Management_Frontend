"use client";

import React, { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { BorrowedBooks } from "@/types/admin";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import BorrowedBooksStats from "./components/BorrowedBooksStats";
import BorrowedBooksTable from "./components/BorrowedBooksTable";

const ITEMS_PER_PAGE = 8;

export default function AdminBorrowedBooksPage() {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBooks[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
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

  const fetchBorrows = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getBorrowedBooks({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch,
      });
      setBorrowedBooks(data.data || []);
      setTotalRecords(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch borrows", error);
      toast.error("Failed to load borrowed books data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrows();
  }, [currentPage, debouncedSearch]);

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

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
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

      {/* Stats Grid */}
      <BorrowedBooksStats
        borrowedBooks={borrowedBooks}
        totalRecords={totalRecords}
      />

      {/* Main Table Container */}
      <BorrowedBooksTable
        borrowedBooks={borrowedBooks}
        isLoading={isLoading}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalRecords={totalRecords}
        onPageChange={setCurrentPage}
        onReturn={handleReturn}
        searchQuery={searchQuery}
        onSearchClear={() => setSearchQuery("")}
      />
    </div>
  );
}
