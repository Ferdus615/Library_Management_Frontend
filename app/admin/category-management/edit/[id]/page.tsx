"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminService } from "@/services/admin.service";
import { AddCategory } from "@/types/admin";
import { toast } from "sonner";
import { ArrowLeft, Save, Tag, AlignLeft, Hash } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function EditCategoryPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [formData, setFormData] = useState<AddCategory>({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;
      try {
        const category = await adminService.getCategoryById(id as string);
        setFormData({
          name: category.name,
          description: category.description || "",
        });
      } catch (error) {
        console.error("Failed to fetch category:", error);
        toast.error("Failed to fetch category details");
        router.push("/admin/category-management");
      } finally {
        setIsFetching(false);
      }
    };

    fetchCategory();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    setIsConfirmModalOpen(false);
    setIsLoading(true);

    try {
      await adminService.updateCategory(id as string, formData);
      toast.success("Category updated successfully!");
      router.push("/admin/category-management");
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Failed to update category:", err);
      toast.error(err.message || "Failed to update category");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-(--clr-primary-a10) border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-500 font-medium">Loading category details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/category-management"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Edit <span className="text-(--clr-primary-a10)">Category</span>
            </h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium ml-12">
            Update the category information and description.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="glass rounded-3xl border border-white/5 p-8 max-w-2xl">
        <form onSubmit={handleFormSubmit} className="space-y-8">
          {/* Category Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-(--clr-surface-a50) flex items-center gap-2">
              <Hash size={14} className="text-(--clr-primary-a0)" />
              Category Name
              <span className="text-red-400 ml-0.5">*</span>
            </label>
            <Input
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Science Fiction"
              className="bg-white/5 border-white/10 rounded-2xl"
              label={""}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-(--clr-surface-a50) flex items-center gap-2">
              <AlignLeft size={14} className="text-(--clr-primary-a0)" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Briefly describe this category and what types of books it includes..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-(--clr-primary-a10)/30 focus:ring-4 focus:ring-(--clr-primary-a10)/5 transition-all resize-none"
            />
            <p className="text-xs text-zinc-600">
              Optional. Helps librarians understand what books belong here.
            </p>
          </div>

          {/* Preview Card */}
          {formData.name && (
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Tag size={12} />
                Preview
              </p>
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 mt-0.5 shrink-0">
                  <Tag className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {formData.name}
                  </p>
                  {formData.description ? (
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                      {formData.description}
                    </p>
                  ) : (
                    <p className="text-xs text-zinc-700 mt-1 italic">
                      No description provided.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-4">
            <Link href="/admin/category-management">
              <Button
                variant="ghost"
                type="button"
                className="px-6 py-3 rounded-2xl text-sm font-bold text-zinc-400 hover:text-white"
              >
                Cancel
              </Button>
            </Link>
            <Button
              variant="primary"
              type="submit"
              isLoading={isLoading}
              className="px-8 py-3 flex items-center gap-2 min-w-[160px] justify-center"
            >
              <Save size={18} />
              Update Category
            </Button>
          </div>
        </form>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        title="Update Category"
        message={`Are you sure you want to update the "${formData.name}" category?`}
        confirmText="Update Category"
      />
    </div>
  );
}
