"use client";

import React, { useState, useEffect } from "react";
import { adminService } from "../../services/admin.service";
import {
  AdminDashboardData,
  ActivityLog,
  PendingRequest,
  OverdueBookDetail,
} from "../../types/admin";
import DashboardStats from "../../components/admin/DashboardStats";
import RecentActivity from "../../components/admin/RecentActivity";
import PendingRequests from "../../components/admin/PendingRequests";
import OverdueBooks from "../../components/admin/OverdueBooks";

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardData | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [overdueBooks, setOverdueBooks] = useState<OverdueBookDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [statsData, activityData, requestsData, overdueData] =
          await Promise.all([
            adminService.getStats(),
            adminService.getActivity(),
            adminService.getRequests(),
            adminService.getOverdue(),
          ]);

        setStats(statsData);
        setActivities(activityData);
        setRequests(requestsData);
        setOverdueBooks(overdueData);
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError(
          "Failed to load dashboard data. Please check your connection.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-(--clr-primary-a0)/30 border-t-(--clr-primary-a0) rounded-full animate-spin" />
          <p className="text-(--clr-surface-a50) animate-pulse">
            Loading dashboard insights...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center p-6">
        <div className="bg-(--clr-danger-a0)/10 border border-(--clr-danger-a0)/20 rounded-xl p-8 max-w-md text-center">
          <div className="flex justify-center mb-4 text-(--clr-danger-a10)">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-(--clr-light-a0) mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-(--clr-surface-a50) mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-(--clr-primary-a0) hover:bg-(--clr-primary-a10) text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--clr-light-a0)">
            Admin Dashboard
          </h1>
          <p className="text-sm text-(--clr-surface-a50) mt-1">
            Welcome back! Monitor your library system operations.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm font-medium rounded-lg bg-(--clr-surface-a10) text-(--clr-light-a0) border border-(--clr-surface-a20) hover:bg-(--clr-surface-a20) transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 text-sm font-medium rounded-lg bg-(--clr-primary-a0) text-white shadow-lg shadow-(--clr-primary-a0)/25 hover:bg-(--clr-primary-a10) transition-colors">
            + Add Book
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardStats stats={stats} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <RecentActivity activities={activities} />

        {/* Pending Borrow Requests */}
        <PendingRequests requests={requests} />
      </div>

      {/* Overdue Books Section */}
      <OverdueBooks overdueBooks={overdueBooks} />
    </div>
  );
}
