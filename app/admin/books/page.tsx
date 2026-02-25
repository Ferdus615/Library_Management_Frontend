"use client";

import React, { useState, useEffect } from "react";
import { adminService } from "@/services/admin.service";
import { Book } from "@/types/admin";
import { toast } from "sonner";
import {
  BookOpen,
  Search,
  Plus,
  Trash2,
  Edit,
  Tag,
  CheckCircle,
  AlertTriangle,
  Layers,
} from "lucide-react";
import Link from "next/link";
import AdminActionButton from "@/components/ui/ActionButton";
import Image from "next/image";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getBooks();
      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      toast.error("Failed to fetch books");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDeleteBook = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await adminService.deleteBook(id);
        toast.success("Book deleted successfully");
        fetchBooks();
      } catch (error) {
        console.error("Failed to delete book:", error);
        toast.error("Failed to delete book");
      }
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const stats = {
    total: books.length,
    available: books.reduce((acc, curr) => acc + curr.available_copies, 0),
    damaged: books.reduce((acc, curr) => acc + curr.damaged_copies, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-white tracking-tight">
            Book <span className="text-(--clr-primary-a10)">Management</span>
          </h1>
          <p className="text-sm text-zinc-500 font-medium">
            Add, edit, and organize the library catalog.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-(--clr-primary-a10) transition-colors" />
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-(--clr-primary-a10)/30 focus:ring-4 focus:ring-(--clr-primary-a10)/5 transition-all w-64"
            />
          </div>
          <Link href="/admin/books/add">
            <AdminActionButton className="h-[42px] px-3 flex items-center gap-2">
              <Plus size={18} />
              Add Book
            </AdminActionButton>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass group relative overflow-hidden p-6 rounded-3xl border border-white/5 transition-all hover:border-white/10">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <BookOpen size={120} />
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-blue-500/10">
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Total Titles
              </p>
              <p className="text-3xl font-black text-white mt-0.5">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="glass group relative overflow-hidden p-6 rounded-3xl border border-white/5 transition-all hover:border-white/10">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <CheckCircle size={120} />
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/10">
              <CheckCircle className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Available Copies
              </p>
              <p className="text-3xl font-black text-white mt-0.5">
                {stats.available}
              </p>
            </div>
          </div>
        </div>

        <div className="glass group relative overflow-hidden p-6 rounded-3xl border border-white/5 transition-all hover:border-white/10">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <AlertTriangle size={120} />
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-amber-500/10">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Damaged Copies
              </p>
              <p className="text-3xl font-black text-white mt-0.5">
                {stats.damaged}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Books Table */}
      <div className="glass rounded-3xl border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} />
                    Book Info
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Tag size={14} />
                    Category
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Layers size={14} />
                    Stock
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-(--clr-primary-a10) border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm text-zinc-500 font-medium">
                        Loading books...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredBooks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-20">
                      <BookOpen size={48} className="text-zinc-500" />
                      <p className="text-lg font-bold text-zinc-400">
                        No books found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBooks.map((book) => (
                  <tr
                    key={book.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 rounded-lg bg-white/5 overflow-hidden relative border border-white/10 transition-transform group-hover:scale-105">
                          {book.cover_image ? (
                            <Image
                              src={book.cover_image}
                              alt={book.title}
                              width={48}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen size={20} className="text-zinc-700" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-(--clr-primary-a10) transition-colors">
                            {book.title}
                          </p>
                          <p className="text-xs text-zinc-500">
                            by {book.author}
                          </p>
                          <p className="text-[10px] text-zinc-600 font-mono mt-0.5">
                            ISBN: {book.isbn}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`${book.category ? "px-3 py-1 bg-white/5 text-zinc-400 text-[10px] font-bold rounded-full uppercase tracking-wider" : "text-zinc-600"}`}
                      >
                        {book.category?.name ? book.category?.name : "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <div className="text-xs text-zinc-300">
                            <span className="font-black">
                              {book.available_copies}
                            </span>
                            <span className="text-zinc-600">
                              {" "}
                              / {book.total_copies}
                            </span>
                          </div>
                          <div className="flex-1 w-20 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 transition-all duration-500"
                              style={{
                                width: `${(book.available_copies / book.total_copies) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                        {book.damaged_copies > 0 && (
                          <p className="text-[10px] text-amber-500/70 font-medium">
                            {book.damaged_copies} damaged
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right border border-(--clr-primary-a0)/20">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/books/edit/${book.id}`}>
                          <AdminActionButton className="bg-white/5 hover:bg-white/10 text-zinc-400 border-white/10">
                            <Edit size={14} />
                          </AdminActionButton>
                        </Link>
                        <AdminActionButton
                          onClick={() => handleDeleteBook(book.id, book.title)}
                          className="bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white border-red-500/10"
                        >
                          <Trash2 size={14} />
                        </AdminActionButton>
                      </div>
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
