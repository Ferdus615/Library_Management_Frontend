"use client";

import React, { useState, useEffect, useMemo } from "react";
import { adminService } from "@/services/admin.service";
import { PendingRequest } from "@/types/admin";
import { toast } from "sonner";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import ReservationStats from "./components/ReservationStats";
import ReservationsTable from "./components/ReservationsTable";

const ITEMS_PER_PAGE = 8;

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getRequests();
      setReservations(data || []);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
      toast.error("Failed to fetch reservations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // Reset to page 1 whenever search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleReservationReceived = async (id: string) => {
    try {
      await adminService.receiveReservation(id);
      toast.success("Reservation received successfully");
      fetchReservations();
    } catch (error) {
      console.error("Failed to receive reservation:", error);
      toast.error("Failed to receive reservation");
    }
  };

  const handleCancelReservation = async (id: string) => {
    try {
      await adminService.cancelReservation(id);
      toast.success("Reservation cancelled successfully");
      fetchReservations();
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
      toast.error("Failed to cancel reservation");
    }
  };

  const filteredReservations = useMemo(() => {
    return reservations.filter(
      (res) =>
        res.book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${res.user.first_name} ${res.user.last_name}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        res.user.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [reservations, searchQuery]);

  // Pagination derived values
  const totalPages = Math.max(
    1,
    Math.ceil(filteredReservations.length / ITEMS_PER_PAGE),
  );
  const paginatedReservations = filteredReservations.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-white tracking-tight">
            Reservation{" "}
            <span className="text-(--clr-primary-a10)">Management</span>
          </h1>
          <p className="text-sm text-zinc-500 font-medium">
            Monitor and manage pending book borrow requests.
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

      {/* Stats Section */}
      <ReservationStats reservations={reservations} />

      {/* Table Section */}
      <ReservationsTable
        reservations={paginatedReservations}
        isLoading={isLoading}
        onReceive={handleReservationReceived}
        onCancel={handleCancelReservation}
        searchQuery={searchQuery}
        clearSearch={() => setSearchQuery("")}
        totalResults={filteredReservations.length}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </div>
  );
}
