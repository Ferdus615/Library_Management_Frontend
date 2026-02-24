"use client";

import { adminService } from "@/services/admin.service";
import { MemberDetails } from "@/types/admin";
import React, { useEffect, useState } from "react";

export default function AdminMemberManagementPage() {
  const [members, setMembers] = useState<MemberDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await adminService.getMembers();
        setMembers(data);
      } catch (error) {
        console.error("Faild to fetch fines:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMembers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black text-white tracking-tight">
          Member Management
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Oversee user accounts, memberships, and status.
        </p>
      </div>

      <div className="glass-light rounded-3xl border-white/5 p-12 text-center">
        <div className="overflow-x-auto"></div>
      </div>
    </div>
  );
}
