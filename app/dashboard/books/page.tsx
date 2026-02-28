"use client";

import React, { useState, useEffect } from "react";
import { adminService } from "@/services/admin.service";
import { authService } from "@/services/auth.service";
import { Book, Category } from "@/types/admin";
import { User } from "@/types/auth";
import { toast } from "sonner";
import { Search, Filter, BookOpen, Bookmark, CheckCircle2 } from "lucide-react";
import AdminActionButton from "@/components/ui/ActionButton";
import Image from "next/image";

export default function MemberBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksData, catsData] = await Promise.all([
          adminService.getBooks(),
          adminService.getCategories(),
        ]);
        setBooks(booksData);
        setCategories(catsData);
        setUser(authService.getUser());
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load library catalog");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleReserve = async (bookId: string) => {
    if (!user) {
      toast.error("Please log in to reserve books");
      return;
    }

    try {
      await adminService.reserveBook(user.id, bookId);
      toast.success("Reservation successful! You are now in the waitlist.");
      // Refresh books to update status if needed
      const updatedBooks = await adminService.getBooks();
      setBooks(updatedBooks);
    } catch (error: any) {
      toast.error(error.message || "Failed to reserve book");
    }
  };

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.includes(searchQuery);
    const matchesCategory =
      selectedCategory === "all" || book.category?.id === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
            placeholder="Search by title, author, or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-(--clr-primary-a10)/30 focus:ring-4 focus:ring-(--clr-primary-a10)/5 transition-all"
          />
        </div>
        <div className="relative group min-w-[200px]">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-(--clr-primary-a10) transition-colors" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full appearance-none bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-10 text-sm text-white focus:outline-none focus:border-(--clr-primary-a10)/30 focus:ring-4 focus:ring-(--clr-primary-a10)/5 transition-all cursor-pointer"
          >
            <option value="all" className="bg-zinc-900">
              All Categories
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-zinc-900">
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Books Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="glass rounded-3xl h-[400px] animate-pulse border-white/5"
            />
          ))}
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
          <BookOpen size={64} className="mb-4 text-zinc-500" />
          <p className="text-xl font-bold text-white">No books found</p>
          <p className="text-sm text-zinc-500">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="glass group relative flex flex-col rounded-[2rem] border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-300"
            >
              {/* Cover Image */}
              <div className="relative aspect-[3/4] overflow-hidden bg-white/5">
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
                  <div className="flex items-center justify-center gap-2 py-2 text-xs font-bold text-zinc-500 bg-white/5 rounded-xl border border-white/5">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    Visit Library to Issue
                  </div>
                ) : (
                  <AdminActionButton
                    onClick={() => handleReserve(book.id)}
                    className="w-full h-11 text-sm bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black border-amber-500/20"
                  >
                    <Bookmark size={14} className="mr-2 inline-block" />
                    Join Waitlist
                  </AdminActionButton>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
