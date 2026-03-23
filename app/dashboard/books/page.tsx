"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminService } from "@/services/admin.service";
import { authService } from "@/services/auth.service";
import { Book } from "@/types/admin";
import { User } from "@/types/auth";
import { toast } from "sonner";
import { Search, BookOpen, Bookmark, CheckCircle2 } from "lucide-react";
import ActionButton from "@/components/ui/ActionButton";
import Image from "next/image";
import { CategorySelect } from "@/components/ui/CategorySelect";
import Pagination from "@/components/ui/Pagination";

export default function MemberBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // 8 per page for grid layout
  const [user, setUser] = useState<User | null>(null);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getBooks({
        title: debouncedSearch || undefined,
        categoryId: selectedCategory === "all" ? undefined : selectedCategory,
        page: currentPage,
        limit: itemsPerPage,
      });
      setBooks(data.data || []);
      setTotalRecords(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      toast.error("Failed to load library catalog");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedCategory, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    setUser(authService.getUser());
  }, []);

  const handleBorrow = async (bookId: string) => {
    if (!user) {
      toast.error("Please log in to borrow books");
      return;
    }

    try {
      await adminService.borrowBook(user.id, bookId);
      toast.success("Book borrowed successfully!");
      fetchBooks();
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to borrow book");
    }
  };

  const handleReserve = async (bookId: string) => {
    if (!user) {
      toast.error("Please log in to reserve books");
      return;
    }

    try {
      await adminService.reserveBook(user.id, bookId);
      toast.success("Reservation successful! You are now in the waitlist.");
      fetchBooks(); // Refresh current page
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || "Failed to reserve book");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tight">
          Library <span className="text-(--clr-primary-a10)">Catalog</span>
        </h1>
        <p className="text-sm text-zinc-500 font-medium max-w-2xl">
          Explore our collection of physical books. If a book is unavailable,
          you can join the waitlist to be notified when it returns.
        </p>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-(--clr-primary-a10) transition-colors" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-(--clr-primary-a10)/30 focus:ring-4 focus:ring-(--clr-primary-a10)/5 transition-all"
          />
        </div>
        <CategorySelect
          placeholder="All Categories"
          nullLabel="All Categories"
          value={selectedCategory === "all" ? "" : selectedCategory}
          onChange={(value) => {
            setSelectedCategory(value || "all");
            setCurrentPage(1);
          }}
          className="min-w-[200px]"
        />
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="glass rounded-4xl h-[500px] animate-pulse border-white/5"
            />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
          <BookOpen size={64} className="mb-4 text-zinc-500" />
          <p className="text-xl font-bold text-white">No books found</p>
          <p className="text-sm text-zinc-500">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="glass group relative flex flex-col rounded-4xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300"
              >
                {/* Cover Image */}
                <div className="relative aspect-3/4 overflow-hidden bg-white/5">
                  {book.cover_image ? (
                    <Image
                      src={book.cover_image}
                      alt={book.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-20">
                      <BookOpen size={48} />
                      <span className="text-[10px] font-bold uppercase mt-2">
                        No Cover
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider backdrop-blur-md border ${
                        book.available_copies > 0
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {book.available_copies > 0 ? "Available" : "Waitlist"}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex-1 space-y-2 mb-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-lg bg-(--clr-primary-a0)/10 text-(--clr-primary-a10) text-[9px] font-bold uppercase tracking-wider">
                        {book.category?.name || "Uncategorized"}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium">
                      by {book.author}
                    </p>

                    <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5">
                      <div className="flex flex-col">
                        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">
                          Availability
                        </span>
                        <span className="text-xs text-white font-mono">
                          {book.available_copies} / {book.total_copies}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-tighter">
                          Publication
                        </span>
                        <span className="text-xs text-white font-mono">
                          {book.publication_year}
                        </span>
                      </div>
                    </div>
                  </div>

                  {book.available_copies > 0 ? (
                    <ActionButton
                      onClick={() => handleBorrow(book.id)}
                      className="w-full h-11 text-sm bg-(--clr-success-a0)/10 hover:bg-(--clr-success-a0) text-(--clr-success-a10) hover:text-black border-(--clr-success-a0)/20"
                    >
                      <CheckCircle2 size={14} className="mr-2 inline-block" />
                      Borrow Book
                    </ActionButton>
                  ) : (
                    <ActionButton
                      onClick={() => handleReserve(book.id)}
                      className="w-full h-11 text-sm"
                    >
                      <Bookmark size={14} className="mr-2 inline-block" />
                      Join Waitlist
                    </ActionButton>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalResults={totalRecords}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            label="books"
            className="rounded-3xl border border-white/5"
          />
        </div>
      )}
    </div>
  );
}
