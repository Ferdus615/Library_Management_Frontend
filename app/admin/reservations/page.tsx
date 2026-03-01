"use client";

import React, { useState, useEffect } from "react";
import { adminService } from "@/services/admin.service";
import { PendingRequest } from "@/types/admin";
import { toast } from "sonner";
import ReservationStats from "./components/ReservationStats";
import ReservationsTable from "./components/ReservationsTable";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<PendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getRequests();
      setReservations(data);
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-white tracking-tight">
          Reservation{" "}
          <span className="text-(--clr-primary-a10)">Management</span>
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Monitor and manage pending book borrow requests.
        </p>
      </div>

      {/* Stats Section */}
      <ReservationStats reservations={reservations} />

      {/* Table Section */}
      <ReservationsTable
        reservations={reservations}
        isLoading={isLoading}
        onReceive={handleReservationReceived}
        onCancel={handleCancelReservation}
      />
    </div>
  );
}
