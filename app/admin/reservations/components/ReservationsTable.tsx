import React from "react";
import {
  BookOpen,
  User as UserIcon,
  Calendar,
  Activity,
  XCircle,
  Clock,
  Search,
} from "lucide-react";
import { PendingRequest } from "@/types/admin";
import ActionButton from "@/components/ui/ActionButton";
import Pagination from "@/components/ui/Pagination";

interface ReservationsTableProps {
  reservations: PendingRequest[];
  isLoading: boolean;
  onReceive: (id: string) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
  searchQuery: string;
  clearSearch: () => void;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  itemsPerPage: number;
}

export default function ReservationsTable({
  reservations,
  isLoading,
  onReceive,
  onCancel,
  searchQuery,
  clearSearch,
  totalResults,
  currentPage,
  totalPages,
  goToPage,
  itemsPerPage,
}: ReservationsTableProps) {
  return (
    <div className="glass rounded-3xl border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <BookOpen size={14} />
                  Book
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <UserIcon size={14} />
                  Member
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  Request Date
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Activity size={14} />
                  Status
                </div>
              </th>
              <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest text-right">
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
                      Loading reservations...
                    </p>
                  </div>
                </td>
              </tr>
            ) : reservations.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-24 text-center text-zinc-500"
                >
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    {searchQuery ? (
                      <Search className="w-10 h-10 text-zinc-700" />
                    ) : (
                      <Clock className="w-10 h-10 text-zinc-700" />
                    )}
                    <p className="text-zinc-500 font-medium text-lg font-bold">
                      {searchQuery
                        ? "No reservations match your search"
                        : "No pending reservations"}
                    </p>
                    {searchQuery ? (
                      <button
                        onClick={clearSearch}
                        className="text-xs text-(--clr-primary-a10) font-bold hover:underline underline-offset-4"
                      >
                        Clear all filters
                      </button>
                    ) : (
                      <p className="text-sm text-zinc-600">
                        All requests have been processed.
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              reservations.map((res) => (
                <tr
                  key={res.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-4 align-middle">
                    <p className="text-sm font-bold text-white group-hover:text-(--clr-primary-a10) transition-colors">
                      {res.book.title}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-mono">
                      ID: {res.book.id}
                    </p>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <p className="text-sm font-medium text-zinc-200">
                      {res.user.first_name} {res.user.last_name}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      ID: {res.user.id}
                    </p>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <p className="text-sm text-zinc-400">
                      {new Date(res.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </td>
                  <td className="px-6 py-4 align-middle">
                    <span className="px-2 py-1 bg-(--clr-primary-a10)/10 text-(--clr-primary-a10) text-[10px] font-bold rounded-lg uppercase tracking-wider">
                      {res.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-right border-l border-(--clr-surface-a30)/20 align-middle">
                    <div className="flex items-center justify-end gap-2">
                      <ActionButton
                        onClick={() => onReceive(res.id)}
                        className="bg-(--clr-success-a10)/10 border-(--clr-success-a10)/20 text-(--clr-success-a10) hover:bg-(--clr-success-a0) hover:text-white"
                        confirmTitle="Receive Book"
                        confirmMessage={`Are you sure you want to mark "${res.book.title}" as received?`}
                        confirmText="Mark Received"
                      >
                        Received
                      </ActionButton>

                      <ActionButton
                        onClick={() => onCancel(res.id)}
                        className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-red-500/20"
                        confirmTitle="Cancel Reservation"
                        confirmMessage={`Are you sure you want to cancel the reservation for "${res.book.title}"?`}
                        confirmText="Cancel Reservation"
                      >
                        <div className="flex items-center gap-1">
                          <XCircle size={14} />
                          Cancel
                        </div>
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalResults={totalResults}
        itemsPerPage={itemsPerPage}
        onPageChange={goToPage}
        label="records"
      />
    </div>
  );
}
