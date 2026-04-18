"use client";

import React, { useState, useEffect, useCallback } from "react";
import { adminService } from "@/services/admin.service";
import { Book, Reservation } from "@/types/admin";
import { toast } from "sonner";
import { Search, Plus, X } from "lucide-react";
import Link from "next/link";
import ActionButton from "@/components/ui/ActionButton";
import DeleteModal from "@/components/ui/deleteModal";
import { CategorySelect } from "@/components/ui/CategorySelect";
import BookStats from "./components/BookStats";
import BooksTable from "./components/BooksTable";
import BookReservationsModal from "./components/BookReservationsModal";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Reservations modal state
  const [isReservationsModalOpen, setIsReservationsModalOpen] = useState(false);
  const [selectedBookForReservations, setSelectedBookForReservations] =
    useState<{ id: string; title: string } | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);

  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    try {
      const booksResponse = await adminService.getBooks({
        title: debouncedSearch || undefined,
        categoryId: selectedCategory === "all" ? undefined : selectedCategory,
        page: currentPage,
        limit: itemsPerPage,
      });
      setBooks(booksResponse.data || []);
      setTotalRecords(booksResponse.total || 0);
    } catch (error) {
      console.error("Failed to fetch books:", error);
      toast.error("Failed to fetch books");
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedCategory, currentPage, itemsPerPage]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Debounce search moved to useEffect above

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

  const handleViewReservations = async (bookId: string, bookTitle: string) => {
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-white tracking-tight">
            Book <span className="text-(--clr-primary-a10)">Management</span>
          </h1>
          <p className="text-sm text-zinc-500 font-medium">
            Add, edit, and organize the library catalog.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative group w-full sm:w-64">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-(--clr-primary-a10) transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-10 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-(--clr-primary-a0)/50 focus:border-(--clr-primary-a0)/50 transition-all"
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

          {/* Category Filter */}
          <CategorySelect
            label="Category"
            placeholder="All Categories"
            nullLabel="All Categories"
            value={selectedCategory}
            onChange={(value) => {
              setSelectedCategory(value);
              setCurrentPage(1);
            }}
            className="min-w-[180px]"
          />

          {/* Add Book Button */}
          <Link href="/admin/books/add">
            <ActionButton className="h-[42px] px-3 flex items-center gap-2">
              <Plus size={18} />
              <span className="hidden sm:inline">Add Book</span>
            </ActionButton>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <BookStats books={books} />

      {/* Table */}
      <BooksTable
        books={books}
        isLoading={isLoading}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        totalRecords={totalRecords}
        onPageChange={setCurrentPage}
        onViewReservations={handleViewReservations}
        onDeleteBook={openDeleteModal}
      />

      {/* Reservations Modal */}
      <BookReservationsModal
        isOpen={isReservationsModalOpen}
        onClose={closeReservationsModal}
        bookTitle={selectedBookForReservations?.title}
        reservations={reservations}
        isLoading={isLoadingReservations}
      />

      {/* Delete Modal */}
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
