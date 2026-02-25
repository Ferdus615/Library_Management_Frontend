"use client";

import React, { useState, useEffect } from "react";
import { adminService } from "@/services/admin.service";
import { Category } from "@/types/admin";
import { toast } from "sonner";
import {
  Tag,
  Search,
  Plus,
  Trash2,
  Edit,
  Hash,
  AlignLeft,
  BookOpen,
} from "lucide-react";
import AdminActionButton from "@/components/ui/ActionButton";

export default function AdminCategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = async (id: string, name: string) => {
    if (
      confirm(
        `Are you sure you want to delete category "${name}"? This might affect books in this category.`,
      )
    ) {
      try {
        await adminService.deleteCategory(id);
        toast.success("Category deleted successfully");
        fetchCategories();
      } catch (error) {
        console.error("Failed to delete category:", error);
        toast.error("Failed to delete category");
      }
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black text-white tracking-tight">
            Category{" "}
            <span className="text-(--clr-primary-a10)">Management</span>
          </h1>
          <p className="text-sm text-zinc-500 font-medium">
            Organize books into genres and subject areas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-(--clr-primary-a10) transition-colors" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-(--clr-primary-a10)/30 focus:ring-4 focus:ring-(--clr-primary-a10)/5 transition-all w-64"
            />
          </div>
          <AdminActionButton className="h-[42px] px-6">
            <Plus size={18} />
            Add Category
          </AdminActionButton>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass group relative overflow-hidden p-6 rounded-3xl border border-white/5 transition-all hover:border-white/10">
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <Tag size={120} />
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10">
              <Tag className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Total Categories
              </p>
              <p className="text-3xl font-black text-white mt-0.5">
                {categories.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="glass rounded-3xl border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest w-1/3">
                  <div className="flex items-center gap-2">
                    <Hash size={14} />
                    Category Name
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <AlignLeft size={14} />
                    Description
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest w-40">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} />
                    Book Count
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-zinc-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-2 border-(--clr-primary-a10) border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm text-zinc-500 font-medium">
                        Loading categories...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-20">
                      <Tag size={48} className="text-zinc-500" />
                      <p className="text-lg font-bold text-zinc-400">
                        No categories found
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-white group-hover:text-(--clr-primary-a10) transition-colors">
                        {cat.name}
                      </p>
                      <p className="text-[10px] text-zinc-600 font-mono mt-0.5">
                        ID: {cat.id}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-zinc-400 line-clamp-1">
                        {cat.description || "No description provided."}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">
                          {cat._count?.books || 0}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                          Books
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right border border-(--clr-primary-a0)/20">
                      <div className="flex items-center justify-end gap-2">
                        <AdminActionButton className="bg-white/5 hover:bg-white/10 text-zinc-400 border-white/10">
                          <Edit size={14} />
                        </AdminActionButton>
                        <AdminActionButton
                          onClick={() => handleDeleteCategory(cat.id, cat.name)}
                          className="bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white border-red-500/10"
                        >
                          <Trash2 size={14} />
                        </AdminActionButton>
                      </div>
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
