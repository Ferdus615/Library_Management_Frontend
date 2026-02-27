"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminService } from "@/services/admin.service";
import { Book, Category, Reservation } from "@/types/admin";
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
  History,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
  User,
  Calendar,
  Clock,
} from "lucide-react";
import Link from "next/link";
import AdminActionButton from "@/components/ui/ActionButton";
import Image from "next/image";
import DeleteModal from "@/components/common/deleteModal";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const [isReservationsModalOpen, setIsReservationsModalOpen] = useState(false);
  const [selectedBookForReservations, setSelectedBookForReservations] =
    useState<{
      id: string;
      title: string;
    } | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getBooks({
        title: searchQuery || undefined,
        categoryId: selectedCategory === "all" ? undefined : selectedCategory,
        page: currentPage,
        limit: itemsPerPage,
      });
      setBooks(data);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      toast.error("Failed to fetch books");
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory, currentPage, itemsPerPage]);

  const fetchCategories = async () => {
    try {
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    fetchCategories();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDeleteBook = async (id: string) => {
    try {
      await adminService.deleteBook(id);
      toast.success("Book deleted successfully");
      fetchBooks();
    } catch (error) {
      console.error("Failed to delete book:", error);
      toast.error("Failed to delete book");
    }
  };

  const fetchReservations = async (bookId: string, bookTitle: string) => {
    setSelectedBookForReservations({ id: bookId, title: bookTitle });
    setIsReservationsModalOpen(true);
    setIsLoadingReservations(true);
    try {
      const data = await adminService.getBookReservations(bookId);
      setReservations(data);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
      toast.error("Failed to fetch reservation history");
    } finally {
      setIsLoadingReservations(false);
    }
  };

  const openDeleteModal = (id: string, title: string) => {
    setBookToDelete({ id, title });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setBookToDelete(null);
  };

  const closeReservationsModal = () => {
    setIsReservationsModalOpen(false);
    setSelectedBookForReservations(null);
    setReservations([]);
  };

  const stats = {
    total: books.length, // This is current page count, ideally backend should return total count
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
              placeholder="Search title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-(--clr-primary-a10)/30 focus:ring-4 focus:ring-(--clr-primary-a10)/5 transition-all w-48 sm:w-64"
            />
          </div>

          <div className="relative group min-w-[160px]">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-(--clr-primary-a10) transition-colors" />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full appearance-none bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-10 text-sm text-white focus:outline-none focus:border-(--clr-primary-a10)/30 focus:ring-4 focus:ring-(--clr-primary-a10)/5 transition-all cursor-pointer"
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

          <Link href="/admin/books/add">
            <AdminActionButton className="h-[42px] px-3 flex items-center gap-2">
              <Plus size={18} />
              <span className="hidden sm:inline">Add Book</span>
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
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Showing
              </p>
              <p className="text-3xl font-black text-white mt-0.5">
                {books.length}{" "}
                <span className="text-xs font-medium text-zinc-500 capitalize">
                  Titles
                </span>
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
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
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
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
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
              ) : books.length === 0 ? (
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
                books.map((book) => (
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
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <AdminActionButton
                          onClick={() => fetchReservations(book.id, book.title)}
                          className="bg-white/5 hover:bg-white/10 text-cyan-500 border-white/10"
                          title="View Reservations"
                        >
                          <History size={14} />
                        </AdminActionButton>
                        <Link href={`/admin/books/edit/${book.id}`}>
                          <AdminActionButton className="bg-white/5 hover:bg-white/10 text-zinc-400 border-white/10">
                            <Edit size={14} />
                          </AdminActionButton>
                        </Link>
                        <AdminActionButton
                          onClick={() => openDeleteModal(book.id, book.title)}
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

        {/* Pagination Section */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/5">
          <p className="text-xs text-zinc-500 font-medium">
            Page <span className="text-white">{currentPage}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || isLoading}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={books.length < itemsPerPage || isLoading}
              className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Reservations Modal */}
      {isReservationsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={closeReservationsModal}
          />
          <div className="relative w-full max-w-2xl transform overflow-hidden rounded-[2.5rem] glass-light border border-white/10 flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-300">
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                  <History className="text-(--clr-primary-a10)" />
                  History
                </h3>
                <p className="text-sm text-zinc-500 mt-1 font-medium italic">
                  &quot;{selectedBookForReservations?.title}&quot;
                </p>
              </div>
              <button
                onClick={closeReservationsModal}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-8 overflow-y-auto custom-scrollbar">
              {isLoadingReservations ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="w-12 h-12 border-2 border-(--clr-primary-a10) border-t-transparent rounded-full animate-spin shadow-lg shadow-(--clr-primary-a10)/20" />
                  <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">
                    Retrieving logs...
                  </p>
                </div>
              ) : reservations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                  <Clock size={48} className="mb-4 text-zinc-500" />
                  <p className="text-lg font-bold text-white">
                    No Record History
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">
                    Everything is up to date
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reservations.map((res) => (
                    <div
                      key={res.id}
                      className="p-5 rounded-3xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-white/10 hover:bg-white/[0.07] transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white uppercase tracking-tight">
                            {res.user.first_name} {res.user.last_name}
                          </p>
                          <p className="text-xs text-zinc-500 font-medium">
                            {res.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 justify-end mb-1">
                          <span
                            className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                              res.status === "PENDING"
                                ? "bg-amber-500/10 text-amber-500"
                                : res.status === "READY"
                                  ? "bg-emerald-500/10 text-emerald-500"
                                  : "bg-zinc-500/10 text-zinc-500"
                            }`}
                          >
                            {res.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-600 font-mono">
                          <Calendar size={10} />
                          {new Date(res.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-8 border-t border-white/5 flex justify-end bg-white/5">
              <button
                onClick={closeReservationsModal}
                className="px-8 py-3 rounded-2xl bg-white/5 text-white font-bold text-sm border border-white/5 hover:bg-white/10 transition-all"
              >
                Close Logs
              </button>
            </div>
          </div>
        </div>
      )}

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={() => {
          if (bookToDelete) {
            handleDeleteBook(bookToDelete.id);
            closeDeleteModal();
          }
        }}
        itemName={bookToDelete?.title}
      />
    </div>
  );
}
