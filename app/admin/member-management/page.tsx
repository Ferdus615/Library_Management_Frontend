"use client";

import { adminService } from "@/services/admin.service";
import { MemberDetails } from "@/types/admin";
import React, { useEffect, useState } from "react";
import AdminActionButton from "@/components/ui/ActionButton";

export default function AdminMemberManagementPage() {
  const [members, setMembers] = useState<MemberDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const name = (member: MemberDetails) => {
    return `${member.first_name} ${member.last_name}`;
  };

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
        <h1 className="text-4xl font-black text-white tracking-tight">
          Member <span className="text-(--clr-primary-a10)">Management</span>
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Oversee user accounts, memberships, and status.
        </p>
      </div>

      <div className="glass-light rounded-3xl border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Name
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Phone
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Address
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Active Status
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    Loading user data...
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-zinc-500"
                  >
                    No member data found.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white group-hover:text-(--clr-primary-a10) transition-colors">
                        {name(member)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-light text-white">
                        {member.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-light text-white">
                        {member.phone ? member.phone : "---"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-light text-white">
                        {member.address ? member.address : "---"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-light text-white">
                        {member.role}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-light text-white">
                        {member.is_active ? "Active" : "Blocked"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <AdminActionButton
                        onClick={() => console.log("Edit", member.id)}
                      >
                        Edit
                      </AdminActionButton>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
