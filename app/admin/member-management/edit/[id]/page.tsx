"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminService } from "@/services/admin.service";
import { MemberDetails } from "@/types/admin";
import { toast } from "sonner";
import { ArrowLeft, Save, Shield, Activity } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function EditMemberPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<MemberDetails>>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    role: "",
    is_active: true,
  });

  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const data = await adminService.getMemberById(id);
        setFormData({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone || "",
          address: data.address || "",
          role: data.role,
          is_active: data.is_active,
        });
      } catch (error) {
        console.error("Failed to fetch member data:", error);
        toast.error("Failed to load member data");
        router.push("/admin/member-management");
      } finally {
        setIsFetchingData(false);
      }
    };

    if (id) fetchMemberData();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleActive = () => {
    setFormData((prev) => ({
      ...prev,
      is_active: !prev.is_active,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    setIsConfirmModalOpen(false);
    setIsLoading(true);

    try {
      await adminService.updateMember(id, formData);
      toast.success("Member updated successfully!");
      router.push("/admin/member-management");
    } catch (error: any) {
      console.error("Failed to update member:", error);
      toast.error(error.message || "Failed to update member");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-in fade-in duration-700">
        <div className="w-16 h-16 border-[3px] border-white/5 border-t-(--clr-primary-a0) rounded-full animate-spin shadow-lg shadow-(--clr-primary-a0)/20" />
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
          Retrieving member details...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/member-management"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Edit <span className="text-(--clr-primary-a10)">Member</span>
            </h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium ml-12">
            Update the credentials and permissions for this member accounts.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="glass rounded-3xl border border-white/5 p-8 max-w-4xl">
        <form onSubmit={handleFormSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* First Name */}
            <Input
              label="First Name"
              required
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="bg-white/5 border-white/10 rounded-2xl"
            />

            {/* Last Name */}
            <Input
              label="Last Name"
              required
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="bg-white/5 border-white/10 rounded-2xl"
            />

            {/* Email */}
            <Input
              label="Email Address"
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-white/5 border-white/10 rounded-2xl"
              disabled // Email is usually unique and shouldn't be changed easily
            />

            {/* Phone */}
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+8801..."
              className="bg-white/5 border-white/10 rounded-2xl"
            />

            {/* Address */}
            <div className="md:col-span-2">
              <Input
                label="Full Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street address, City, Country"
                className="bg-white/5 border-white/10 rounded-2xl"
              />
            </div>

            {/* Role selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-zinc-400 flex items-center gap-2">
                <Shield size={14} className="text-(--clr-primary-a10)" />
                Access Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full h-[46px] bg-white/5 border border-white/10 rounded-2xl px-4 text-sm text-white focus:outline-none focus:ring-4 focus:ring-(--clr-primary-a10)/5 focus:border-(--clr-primary-a10)/30 transition-all appearance-none cursor-pointer"
              >
                <option value="MEMBER" className="bg-zinc-900">
                  Member
                </option>
                <option value="LIBRARIAN" className="bg-zinc-900">
                  Librarian
                </option>
                <option value="ADMIN" className="bg-zinc-900">
                  Administrator
                </option>
              </select>
            </div>

            {/* Status activation */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-zinc-400 flex items-center gap-2">
                <Activity size={14} className="text-(--clr-primary-a10)" />
                Account Status
              </label>
              <div
                onClick={handleToggleActive}
                className={`w-full h-[46px] flex items-center justify-between px-4 rounded-2xl border transition-all cursor-pointer ${
                  formData.is_active
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    : "bg-red-500/5 border-red-500/20 text-red-400"
                }`}
              >
                <span className="text-xs font-black uppercase tracking-widest">
                  {formData.is_active
                    ? "Active & Authorized"
                    : "Blocked & Suspended"}
                </span>
                <div
                  className={`w-2 h-2 rounded-full ${formData.is_active ? "bg-emerald-400" : "bg-red-400"} animate-pulse`}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-4 border-t border-white/5">
            <Link href="/admin/member-management">
              <Button
                variant="ghost"
                type="button"
                className="px-8 py-3 rounded-2xl text-sm font-bold text-zinc-500 hover:text-white transition-all"
              >
                Discard Changes
              </Button>
            </Link>
            <Button
              variant="primary"
              type="submit"
              isLoading={isLoading}
              className="px-10 py-3 flex items-center gap-2 min-w-[170px] justify-center bg-linear-to-br from-(--clr-success-a0) to-(--clr-success-a10) font-black text-sm"
            >
              <Save size={18} />
              Update Account
            </Button>
          </div>
        </form>
      </div>
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        title="Update Member Status"
        message={`Are you sure you want to save the changes for ${formData.first_name} ${formData.last_name}?`}
        confirmText="Save Changes"
      />
    </div>
  );
}
