"use client";

import React, { useState } from "react";
import { authService } from "@/services/auth.service";
import { User } from "@/types/auth";
import {
  User as UserIcon,
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

export default function MemberProfilePage() {
  const [user] = useState<User | null>(() => authService.getUser());

  const handleLogout = () => {
    authService.logout();
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-in fade-in duration-700">
        <div className="w-16 h-16 border-[3px] border-white/5 border-t-(--clr-primary-a0) rounded-full animate-spin shadow-lg shadow-(--clr-primary-a0)/20" />
      </div>
    );
  }

  const userName = `${user.first_name} ${user.last_name}`;
  const roleLabel = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Profile Section */}
      <div className="glass p-10 rounded-[3rem] border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-(--clr-primary-a0)/20 to-transparent blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative flex flex-col md:flex-row items-center gap-8">
          <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-(--clr-primary-a0) to-(--clr-primary-a20) p-1 shadow-2xl shadow-(--clr-primary-a0)/30">
            <div className="w-full h-full rounded-[2.3rem] bg-(--clr-surface-a0) flex items-center justify-center border border-white/10">
              <UserIcon size={48} className="text-(--clr-primary-a10)" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <h1 className="text-4xl font-black text-white tracking-tight">
                {userName}
              </h1>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                {user.is_active ? "Verified Member" : "Inactive"}
              </span>
            </div>
            <p className="text-zinc-500 font-medium flex items-center justify-center md:justify-start gap-2">
              <Mail size={14} />
              {user.email}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="rounded-2xl border-white/5 bg-white/5 hover:bg-red-500 hover:text-white hover:border-red-500 text-zinc-400 group"
            >
              <LogOut size={16} className="mr-2 group-hover:animate-pulse" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Account Info */}
        <div className="md:col-span-2 glass p-8 rounded-[2.5rem] border-white/5 space-y-8">
          <div className="flex items-center gap-3 border-b border-white/5 pb-6">
            <Settings size={20} className="text-zinc-600" />
            <h2 className="text-xl font-bold text-white">Account Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-3">
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest flex items-center gap-2">
                <Shield size={12} className="text-(--clr-primary-a10)" />
                Security Role
              </p>
              <p className="text-lg font-bold text-white bg-white/5 px-4 py-3 rounded-2xl border border-white/5 w-fit">
                {roleLabel}
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest flex items-center gap-2">
                <Phone size={12} className="text-(--clr-primary-a10)" />
                Contact Number
              </p>
              <p className="text-lg font-bold text-white bg-white/5 px-4 py-3 rounded-2xl border border-white/5 w-fit">
                {user.phone || "Not Provided"}
              </p>
            </div>

            <div className="sm:col-span-2 space-y-3">
              <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest flex items-center gap-2">
                <MapPin size={12} className="text-(--clr-primary-a10)" />
                Primary Address
              </p>
              <p className="text-lg font-bold text-white bg-white/5 px-6 py-4 rounded-2xl border border-white/5">
                {user.address ||
                  "No address on file. Please update your records at the front desk."}
              </p>
            </div>
          </div>
        </div>

        {/* Membership Badge / Quick Stats */}
        <div className="flex flex-col gap-6">
          <div className="glass p-8 rounded-[2.5rem] border-white/5 bg-gradient-to-br from-indigo-500/10 to-transparent flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
              <Activity size={32} />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Elite Status</h3>
            <p className="text-xs text-zinc-500 font-medium">
              Your account is in good standing. Rewards system coming soon.
            </p>
          </div>

          <div className="glass p-8 rounded-[3rem] border-white/10 bg-white/5 flex flex-col items-center justify-center text-center group cursor-help">
            <Calendar
              size={24}
              className="text-zinc-700 mb-2 group-hover:text-white transition-colors"
            />
            <p className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">
              Member Since
            </p>
            <p className="text-sm font-bold text-white mt-1">Winter 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}
