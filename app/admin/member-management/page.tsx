"use client";

import { adminService } from "@/services/admin.service";
import { MemberDetails } from "@/types/admin";
import React, { useEffect, useState, useMemo } from "react";
import ActionButton from "@/components/ui/ActionButton";
import {
  Users,
  UserCheck,
  UserX,
  Search,
  Mail,
  Phone,
  MapPin,
  Shield,
  Activity,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const ITEMS_PER_PAGE = 8;

export default function AdminMemberManagementPage() {
  const [members, setMembers] = useState<MemberDetails[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const data = await adminService.getMembers({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch,
      });
      setMembers(data.data || []);
      setTotalRecords(data.total || 0);
    } catch (error) {
      console.error("Failed to fetch members:", error);
      toast.error("Failed to load members data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [currentPage, debouncedSearch]);

  const stats = {
    total: totalRecords,
    active: members.filter((m) => m.is_active).length, // These will only be for the current page, which is acceptable unless we add stat endpoints
    blocked: members.filter((m) => !m.is_active).length,
  };

  // Pagination derived values
  const totalPages = Math.max(1, Math.ceil(totalRecords / ITEMS_PER_PAGE));
  const paginatedMembers = members;

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-white tracking-tight">
            Member <span className="text-(--clr-primary-a10)">Management</span>
          </h1>
          <p className="text-sm text-zinc-500 font-medium">
            Oversee user accounts, memberships, and account status.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative group w-full md:w-80">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-(--clr-primary-a10) transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search members..."
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Total Members",
            value: stats.total,
            icon: Users,
            color: "text-(--clr-primary-a10)",
            bg: "bg-(--clr-primary-a10)/10",
          },
          {
            label: "Active Accounts",
            value: stats.active,
            icon: UserCheck,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
          },
          {
            label: "Blocked Accounts",
            value: stats.blocked,
            icon: UserX,
            color: "text-red-400",
            bg: "bg-red-400/10",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="glass group relative overflow-hidden p-6 rounded-3xl border border-white/5 transition-all hover:border-white/10"
          >
            <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon size={120} />
            </div>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-2xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  {stat.label}
                </p>
                <p className="text-3xl font-black text-white mt-0.5">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="glass rounded-3xl border-white/5 overflow-hidden shadow-2xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-5 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <UserIcon size={14} />
                    Member Info
                  </div>
                </th>
                <th className="px-6 py-5 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Phone size={14} />
                    Contact
                  </div>
                </th>
                <th className="px-6 py-5 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    Address
                  </div>
                </th>
                <th className="px-6 py-5 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Shield size={14} />
                    Role
                  </div>
                </th>
                <th className="px-6 py-5 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Activity size={14} />
                    Status
                  </div>
                </th>
                <th className="px-6 py-5 text-xs font-bold text-zinc-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-24 text-center text-zinc-500"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-(--clr-primary-a0)/20 border-t-(--clr-primary-a10) rounded-full animate-spin" />
                      <p className="font-medium animate-pulse">
                        Loading member directory...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <Search className="w-10 h-10 text-zinc-700" />
                      <p className="text-zinc-500 text-lg font-bold">
                        {searchQuery
                          ? "No members match your search"
                          : "No members found"}
                      </p>
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-xs text-(--clr-primary-a10) font-bold hover:underline underline-offset-4"
                        >
                          Clear all filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="group hover:bg-white/2 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-(--clr-primary-a10) transition-colors">
                          {member.first_name} {member.last_name}
                        </p>
                        <p className="flex items-center gap-1.5 text-[10px] text-zinc-500 mt-1">
                          <Mail size={10} className="text-zinc-600" />
                          {member.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[11px] font-mono text-zinc-400">
                        {member.phone || "---"}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <p
                        className="text-xs text-zinc-400 max-w-[150px] truncate"
                        title={member.address || "No address provided"}
                      >
                        {member.address || "---"}
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-0.5 bg-zinc-800 text-zinc-500 text-[9px] font-black uppercase tracking-wider rounded-md border border-white/5">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                          member.is_active
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}
                      >
                        <div
                          className={`w-1 h-1 rounded-full ${member.is_active ? "bg-emerald-400" : "bg-red-400"}`}
                        />
                        {member.is_active ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/member-management/edit/${member.id}`}
                        >
                          <ActionButton>Edit</ActionButton>
                        </Link>
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
          <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 bg-white/2">
            <p className="text-xs text-zinc-500">
              Showing{" "}
              <span className="font-bold text-zinc-300">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>
              {" – "}
              <span className="font-bold text-zinc-300">
                {Math.min(currentPage * ITEMS_PER_PAGE, totalRecords)}
              </span>{" "}
              of <span className="font-bold text-zinc-300">{totalRecords}</span>{" "}
              members
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
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
                      onClick={() => goToPage(page)}
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
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
