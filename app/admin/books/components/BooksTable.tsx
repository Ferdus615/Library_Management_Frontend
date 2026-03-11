"use client";

import { Book } from "@/types/admin";
import {
  BookOpen,
  Tag,
  Layers,
  History,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ActionButton from "@/components/ui/ActionButton";

interface BooksTableProps {
  books: Book[];
  isLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  totalRecords: number;
  onPageChange: (page: number) => void;
  onViewReservations: (bookId: string, bookTitle: string) => void;
  onDeleteBook: (bookId: string, bookTitle: string) => void;
}

export default function BooksTable({
  books,
  isLoading,
  currentPage,
  itemsPerPage,
  totalRecords,
  onPageChange,
  onViewReservations,
  onDeleteBook,
}: BooksTableProps) {
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));

  return (
    <div className="glass rounded-3xl border-white/5 overflow-hidden shadow-2xl shadow-black/20">
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
              <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest text-center">
                <div className="flex items-center justify-center gap-2">
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
          <tbody className="divide-y divide-white/5">
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-24 text-center text-zinc-500"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-(--clr-primary-a0)/20 border-t-(--clr-primary-a10) rounded-full animate-spin" />
                    <p className="font-medium animate-pulse">
                      Loading inventory records...
                    </p>
                  </div>
                </td>
              </tr>
            ) : books.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <Search className="w-12 h-12 text-zinc-700" />
                    <p className="text-zinc-500 font-medium text-lg">
                      No books found in this view
                    </p>
                    <p className="text-sm text-zinc-600 max-w-xs">
                      Try adjusting your search terms or category filters.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              books.map((book) => (
                <tr
                  key={book.id}
                  className="group hover:bg-white/2 transition-colors"
                >
                  {/* Book Info */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 rounded-lg bg-zinc-800 overflow-hidden shrink-0 border border-white/10 group-hover:border-(--clr-primary-a0)/50 transition-all duration-300">
                        {book.cover_image ? (
                          <Image
                            src={book.cover_image}
                            alt={book.title}
                            width={48}
                            height={64}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen size={20} className="text-zinc-700" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className="text-sm font-black text-white group-hover:text-(--clr-primary-a10) transition-colors truncate max-w-[200px]"
                          title={book.title}
                        >
                          {book.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 underline-offset-2">
                          <p className="text-[10px] text-zinc-500 font-medium truncate max-w-[120px]">
                            by {book.author}
                          </p>
                          <p className="text-[10px] text-zinc-600 font-mono">
                            {book.isbn}
                          </p>
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-5 text-center">
                    <span
                      className={`${book.category ? "px-3 py-1 bg-white/5 text-zinc-400 text-[10px] font-bold rounded-full uppercase tracking-wider border border-white/5" : "text-zinc-600 text-[10px] italic"}`}
                    >
                      {book.category?.name ?? "N/A"}
                    </span>
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5 min-w-[120px]">
                      <div className="flex items-center justify-between text-[10px] mb-0.5">
                        <span
                          className={`font-black ${book.available_copies === 0 ? "text-red-400" : "text-zinc-300"}`}
                        >
                          {book.available_copies} available
                        </span>
                        <span className="text-zinc-600">
                          {book.total_copies} total
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                          className={`h-full transition-all duration-700 ${book.available_copies === 0 ? "bg-red-500/50" : "bg-(--clr-primary-a10)"}`}
                          style={{
                            width: `${Math.min(100, (book.available_copies / book.total_copies) * 100)}%`,
                          }}
                        />
                      </div>
                      {book.damaged_copies > 0 && (
                        <p className="text-[9px] text-amber-500/70 font-bold uppercase tracking-tighter">
                          {book.damaged_copies} damaged
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <ActionButton
                        onClick={() => onViewReservations(book.id, book.title)}
                        className="bg-white/5 hover:bg-cyan-500/20 text-zinc-500 hover:text-cyan-400 border-white/5"
                        title="View Reservations"
                      >
                        <History size={14} />
                      </ActionButton>

                      <Link href={`/admin/books/edit/${book.id}`}>
                        <ActionButton className="bg-white/5 hover:bg-white/10 text-zinc-500 hover:text-white border-white/5">
                          <Edit size={14} />
                        </ActionButton>
                      </Link>

                      <ActionButton
                        onClick={() => onDeleteBook(book.id, book.title)}
                        className="bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white border-red-500/10"
                      >
                        <Trash2 size={14} />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && totalRecords > 0 && (
        <div className="px-8 py-4 border-t border-white/5 flex items-center justify-between bg-white/2">
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
            books
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
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
                    onClick={() => onPageChange(page)}
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
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
