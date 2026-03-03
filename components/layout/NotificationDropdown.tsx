"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  Check,
  Trash2,
  X,
  Info,
  AlertTriangle,
  Book,
  Calendar,
} from "lucide-react";
import {
  notificationService,
  Notification,
} from "@/services/notification.service";
import { formatDistanceToNow } from "date-fns";

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Poll for notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.markAsRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "reservation_created":
      case "reservation_ready":
        return <Calendar className="h-4 w-4 text-blue-400" />;
      case "loan_issued":
      case "loan_returned":
        return <Book className="h-4 w-4 text-green-400" />;
      case "loan_overdue":
      case "fine_created":
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return <Info className="h-4 w-4 text-blue-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group p-2.5 rounded-xl text-zinc-400 hover:bg-white/5 hover:text-white transition-all duration-200"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-(--clr-surface-tonal-a0) group-hover:ring-transparent transition-all" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 glass border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                {unreadCount} New
              </span>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {loading && notifications.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-sm">
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="h-6 w-6 text-zinc-600" />
                </div>
                <p className="text-zinc-500 text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-white/5 transition-colors relative group ${
                      !notification.is_read ? "bg-white/2" : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      <div
                        className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          !notification.is_read ? "bg-white/10" : "bg-white/5"
                        }`}
                      >
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p
                            className={`text-sm font-medium truncate ${
                              !notification.is_read
                                ? "text-white"
                                : "text-zinc-400"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <span className="text-[10px] text-zinc-500 whitespace-nowrap">
                            {formatDistanceToNow(
                              new Date(notification.created_at),
                              { addSuffix: true },
                            )}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                          {notification.message}
                        </p>

                        <div className="mt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!notification.is_read && (
                            <button
                              onClick={(e) =>
                                handleMarkAsRead(notification.id, e)
                              }
                              className="text-[10px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 bg-blue-400/10 px-2 py-1 rounded-md transition-colors"
                            >
                              <Check className="h-3 w-3" /> Mark as Read
                            </button>
                          )}
                          <button
                            onClick={(e) => handleDelete(notification.id, e)}
                            className="text-[10px] font-semibold text-zinc-500 hover:text-red-400 flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md transition-colors"
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-3 border-t border-white/5 bg-white/5 text-center">
            <button
              onClick={() => setIsOpen(false)}
              className="text-xs text-zinc-400 hover:text-white transition-colors"
            >
              Close Panel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
