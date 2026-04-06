"use client";

import React from "react";
import { Notification } from "@/types/admin";
import {
  Bell,
  Clock,
  AlertCircle,
  BookOpen,
  Calendar,
  AlertTriangle,
  DollarSign,
  CheckCircle2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Pagination from "@/components/ui/Pagination";

interface NotificationsTableProps {
  notifications: Notification[];
  isLoading: boolean;
  totalResults: number;
  currentPage: number;
  totalPages: number;
  goToPage: (page: number) => void;
  itemsPerPage: number;
}

const getIcon = (type: string) => {
  const typeLower = type.toLowerCase();
  switch (typeLower) {
    case "reservation_created":
      return <Calendar className="w-5 h-5 text-blue-400" />;
    case "reservation_ready":
      return <CheckCircle2 className="w-5 h-5 text-green-400" />;
    case "loan_issued":
      return <BookOpen className="w-5 h-5 text-purple-400" />;
    case "loan_overdue":
      return <AlertTriangle className="w-5 h-5 text-orange-400" />;
    case "fine_created":
      return <DollarSign className="w-5 h-5 text-red-100" />;
    case "fine_paid":
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    default:
      return <Bell className="w-5 h-5 text-zinc-400" />;
  }
};

export default function NotificationsTable({
  notifications,
  isLoading,
  totalResults,
  currentPage,
  totalPages,
  goToPage,
  itemsPerPage,
}: NotificationsTableProps) {
  if (isLoading) {
    return (
      <div className="glass rounded-3xl border-white/5 overflow-hidden min-h-[400px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/5 border-t-(--clr-primary-a0) rounded-full animate-spin" />
          <p className="text-zinc-500 font-medium animate-pulse">
            Loading broadcast history...
          </p>
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className="glass rounded-3xl border-white/5 flex flex-col items-center justify-center p-20 text-center gap-6">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-2">
          <Bell className="w-10 h-10 text-zinc-600" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">
            No notifications found
          </h3>
          <p className="text-zinc-500 max-w-xs mx-auto">
            System logs are currently clear. New activity will appear here in
            real-time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-3xl border-white/5 overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/2">
              <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Notification
              </th>
              <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Type
              </th>
              <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Timestamp
              </th>
              <th className="px-6 py-5 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {notifications.map((notification) => (
              <tr
                key={notification.id}
                className="group hover:bg-white/2 transition-colors duration-200"
              >
                <td className="px-6 py-5">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 p-2.5 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 group-hover:border-white/10 transition-all">
                      {getIcon(notification.type)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-(--clr-primary-a0) transition-colors">
                        {notification.title}
                      </h4>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed max-w-md">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-black text-zinc-400 tracking-wider">
                    {notification.type.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-zinc-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">
                      {notification.created_at
                        ? formatDistanceToNow(
                            new Date(notification.created_at),
                            { addSuffix: true },
                          )
                        : "N/A"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  {notification.read ? (
                    <span className="flex items-center gap-1.5 text-zinc-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-600" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">
                        Seen
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-(--clr-primary-a0)">
                      <div className="w-1.5 h-1.5 rounded-full bg-(--clr-primary-a0) animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-tighter">
                        New
                      </span>
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalResults={totalResults}
        itemsPerPage={itemsPerPage}
        onPageChange={goToPage}
        label="system alerts"
      />
    </div>
  );
}
