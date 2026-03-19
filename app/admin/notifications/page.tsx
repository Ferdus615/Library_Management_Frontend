"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/services/admin.service";
import { notificationService } from "@/services/notification.service";
import { Notification } from "@/types/admin";
import { toast } from "sonner";
import { ArrowLeft, Bell, RefreshCcw, CheckCircle } from "lucide-react";
import NotificationsTable from "./components/NotificationsTable";

const ITEMS_PER_PAGE = 10;

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      toast.success("Notification marked as read");
    } catch {
      toast.error("Failed to mark notification as read");
    }
  };

  const fetchNotifications = async (showRefresh = false) => {
    if (showRefresh) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const response = await adminService.getNotifications({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
      });
      setNotifications(response.data || []);
      setTotalRecords(response.total || 0);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const totalPages = Math.max(1, Math.ceil(totalRecords / ITEMS_PER_PAGE));

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-all active:scale-95 flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-white tracking-tight">
          Back
        </h2>
      </div>

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

        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllAsRead}
            disabled={isLoading || notifications.every((n) => n.read)}
            className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold text-(--clr-primary-a0) transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            Mark All Read
          </button>
          <button
            onClick={() => fetchNotifications(true)}
            disabled={isLoading || isRefreshing}
            className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCcw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            {isRefreshing ? "Syncing..." : "Refresh Feed"}
          </button>
        </div>
      </div>

      <NotificationsTable
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
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
