"use client";

import React, { useState, useEffect } from "react";
import { adminService } from "@/services/admin.service";
import { Notification } from "@/types/admin";
import { toast } from "sonner";
import { Bell, RefreshCcw } from "lucide-react";
import NotificationsTable from "./components/NotificationsTable";

const ITEMS_PER_PAGE = 10;

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchNotifications = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const data = await adminService.getNotifications({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      setNotifications(data.data || []);
      setTotalRecords(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      toast.error("Failed to fetch system notifications");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentPage]);

  const totalPages = Math.max(1, Math.ceil(totalRecords / ITEMS_PER_PAGE));

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-(--clr-primary-a0)/20 rounded-lg">
              <Bell className="w-5 h-5 text-(--clr-primary-a0)" />
            </div>
            <span className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em]">
              System Broadcasts
            </span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">
            System{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-(--clr-primary-a0) to-(--clr-primary-a10)">
              Notifications
            </span>
          </h1>
          <p className="text-sm text-zinc-500 font-medium max-w-md">
            View all automated alerts and system-generated communications sent
            to library members.
          </p>
        </div>

        <button
          onClick={() => fetchNotifications(true)}
          disabled={isLoading || isRefreshing}
          className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCcw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          {isRefreshing ? "Syncing..." : "Refresh Feed"}
        </button>
      </div>

      <NotificationsTable
        notifications={notifications}
        isLoading={isLoading}
        totalResults={totalRecords}
        currentPage={currentPage}
        totalPages={totalPages}
        goToPage={goToPage}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </div>
  );
}
