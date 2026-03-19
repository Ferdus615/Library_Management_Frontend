"use client";

import React, { useEffect, useState } from "react";
import { authService } from "@/services/auth.service";
import {
  User as UserIcon,
  IdCard,
  Mail,
  Shield,
  Activity,
  Phone,
  MapPin,
  Calendar,
  LogOut,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { adminService } from "@/services/admin.service";
import { MemberDetails } from "@/types/admin";
import router from "next/router";
import { toast } from "sonner";

export default function AdminProfilePage() {
  const [userInfo, setUserInfo] = useState<MemberDetails>();

  const fetchUser = async () => {
    try {
      const user = authService.getUser();
      if (!user) {
        router.push("/admin/login");
        return;
      }

      const userId = user.id;
      const userInfo = await adminService.getMemberById(userId);
      setUserInfo(userInfo);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load user data");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = () => {
    authService.logout();
  };

  if (!userInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-in fade-in duration-700">
        <div className="w-16 h-16 border-[3px] border-white/5 border-t-(--clr-primary-a0) rounded-full animate-spin shadow-lg shadow-(--clr-primary-a0)/20" />
      </div>
    );
  }

  const userName = `${userInfo.first_name} ${userInfo.last_name}`;
  const roleLabel =
    userInfo.role.charAt(0).toUpperCase() + userInfo.role.slice(1);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header Profile Section */}
      <div className="glass p-8 rounded-3xl border-white/5 relative overflow-hidden group shadow-sm shadow-black/20">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-linear-to-bl from-(--clr-primary-a0)/10 to-transparent blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-28 h-28 shrink-0 rounded-2xl bg-linear-to-br from-(--clr-primary-a0) to-(--clr-primary-a20) p-1 shadow-xl shadow-(--clr-primary-a0)/20">
            <div className="w-full h-full rounded-xl bg-(--clr-surface-a0) flex items-center justify-center border border-white/10">
              <UserIcon size={40} className="text-(--clr-primary-a10)" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left pt-2 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
              <h1 className="text-3xl font-medium tracking-tight text-white">
                {userName}
              </h1>
              <span
                className={`w-fit mx-auto md:mx-0 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  userInfo.is_active
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                {userInfo.is_active ? "Active Staff" : "Inactive"}
              </span>
            </div>
            
            <p className="text-zinc-400 font-medium flex items-center justify-center md:justify-start gap-2 text-sm">
              <IdCard size={14} className="text-zinc-500" />
              Staff ID: <span className="text-zinc-300">{userInfo.id}</span>
            </p>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="rounded-xl border-white/10 bg-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 text-zinc-300 transition-all duration-300"
            >
              <LogOut size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Account Info */}
        <div className="lg:col-span-2 glass p-8 rounded-3xl border-white/5 space-y-8 shadow-sm shadow-black/20 relative">
          <div className="flex items-center justify-between border-b border-white/5 pb-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                <Settings size={18} className="text-zinc-400" />
              </div>
              <h2 className="text-lg font-medium text-white tracking-wide">Account Details</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2 group">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-1">
                <Mail size={12} className="text-(--clr-primary-a10)" />
                Email Address
              </p>
              <div className="bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors rounded-xl px-5 py-3.5">
                <p className="text-base font-light text-zinc-200 truncate">
                  {userInfo.email}
                </p>
              </div>
            </div>

            <div className="space-y-2 group">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-1">
                <Phone size={12} className="text-(--clr-primary-a10)" />
                Contact Number
              </p>
              <div className="bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors rounded-xl px-5 py-3.5">
                <p className="text-base font-light text-zinc-200">
                  {userInfo.phone || "Not Provided"}
                </p>
              </div>
            </div>

            <div className="space-y-2 group">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-1">
                <Shield size={12} className="text-(--clr-primary-a10)" />
                Role
              </p>
              <div className="bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors rounded-xl px-5 py-3.5">
                <p className="text-base font-medium text-(--clr-primary-a0)">
                  {roleLabel}
                </p>
              </div>
            </div>

            <div className="sm:col-span-2 space-y-2 group mt-2">
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-1">
                <MapPin size={12} className="text-(--clr-primary-a10)" />
                Primary Address
              </p>
              <div className="bg-white/5 border border-white/5 group-hover:border-white/10 transition-colors rounded-xl px-5 py-4">
                <p className="text-base font-light text-zinc-300 leading-relaxed">
                  {userInfo.address ||
                    "No address on file. Please update your records at the front desk."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Membership Badge / Quick Stats */}
        <div className="flex flex-col gap-6">
          <div className="glass p-8 rounded-3xl border-indigo-500/10 bg-linear-to-b from-indigo-500/5 to-transparent flex-1 flex flex-col items-center justify-center text-center shadow-sm shadow-black/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="w-14 h-14 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 ring-4 ring-indigo-500/5 group-hover:scale-110 transition-transform duration-500">
              <Activity size={24} />
            </div>
            <h3 className="text-base font-medium text-white mb-2 tracking-wide">System Access</h3>
            <p className="text-xs text-zinc-400 font-light leading-relaxed max-w-[200px]">
              You have authorized access to manage library records and systems.
            </p>
          </div>

          <div className="glass p-6 rounded-3xl border-white/5 bg-white/2 flex flex-row items-center justify-between shadow-sm shadow-black/20 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <Calendar size={20} className="text-zinc-400" />
              </div>
              <div className="text-left">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">
                  Joined
                </p>
                <p className="text-sm font-medium text-zinc-200">
                  {userInfo.created_at}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
