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
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ActionButton from "@/components/ui/ActionButton";

interface BooksTableProps {
  books: Book[];
  isLoading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onViewReservations: (bookId: string, bookTitle: string) => void;
  onDeleteBook: (bookId: string, bookTitle: string) => void;
}

export default function BooksTable({
  books,
  isLoading,
  currentPage,
  itemsPerPage,
  onPageChange,
  onViewReservations,
  onDeleteBook,
}: BooksTableProps) {
  return (
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
                  {/* Book Info */}
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
                        <span className="flex items-center gap-5 mt-1">
                          <p className="text-xs text-zinc-500">
                            by {book.author}
                          </p>
                          <p className="text-[10px] text-zinc-600 font-mono">
                            ISBN: {book.isbn}
                          </p>
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`${book.category ? "px-3 py-1 bg-white/5 text-zinc-400 text-[10px] font-bold rounded-full uppercase tracking-wider" : "text-zinc-600"}`}
                    >
                      {book.category?.name ?? "N/A"}
                    </span>
                  </td>

                  {/* Stock */}
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

                  {/* Actions */}
                  <td className="px-6 py-4 text-right border border-(--clr-surface-a30)/20">
                    <div className="flex items-center justify-end gap-2">
                      <ActionButton
                        onClick={() => onViewReservations(book.id, book.title)}
                        className="bg-white/5 hover:bg-white/10 text-cyan-500 border-white/10"
                        title="View Reservations"
                      >
                        <History size={14} />
                      </ActionButton>

                      <Link href={`/admin/books/edit/${book.id}`}>
                        <ActionButton className="bg-white/5 hover:bg-white/10 text-zinc-400 border-white/10">
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

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/5">
        <p className="text-xs text-zinc-500 font-medium">
          Page <span className="text-white">{currentPage}</span>
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || isLoading}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={books.length < itemsPerPage || isLoading}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 transition-all"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
