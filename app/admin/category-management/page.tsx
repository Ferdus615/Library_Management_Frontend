"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  X,
} from "lucide-react";
import ActionButton from "@/components/ui/ActionButton";
import DeleteModal from "@/components/ui/deleteModal";
import Link from "next/link";
import Pagination from "@/components/ui/Pagination";

const ITEMS_PER_PAGE = 8;

export default function AdminCategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getCategories({
        page: currentPage,
        limit: ITEMS_PER_PAGE,
        search: debouncedSearch,
      });
      setCategories(response.data || []);
      setTotalRecords(response.total || 0);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Failed to fetch categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [currentPage, debouncedSearch]);

  const openDeleteModal = (id: string, name: string) => {
    setCategoryToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await adminService.deleteCategory(id);
      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
      toast.error("Failed to delete category");
    }
  };

  // Pagination derived values
  const paginatedCategories = categories;

  const goToPage = (page: number) => {
    const totalPages = Math.max(1, Math.ceil(totalRecords / ITEMS_PER_PAGE));
    setCurrentPage(Math.min(Math.max(1, page), totalPages));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
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
      </div>

      {/* Stats + Controls Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        {/* Stat Card */}
        <div className="glass group relative overflow-hidden p-6 rounded-3xl border border-white/5 transition-all hover:border-white/10 min-w-[200px]">
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
                {totalRecords}
              </p>
            </div>
          </div>
        </div>

        {/* Search + Add Button */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-(--clr-primary-a10) transition-colors" />
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl py-2.5 pl-11 pr-10 text-sm text-white focus:outline-none focus:border-(--clr-primary-a10)/30 focus:ring-4 focus:ring-(--clr-primary-a10)/5 transition-all w-64"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-zinc-500 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <Link href="/admin/category-management/add">
            <ActionButton className="h-[42px] px-4 flex items-center gap-2">
              <Plus size={18} />
              Add Category
            </ActionButton>
          </Link>
        </div>
      </div>

      {/* Search result hint */}
      {searchQuery && !isLoading && (
        <p className="text-xs text-zinc-500">
          Found <span className="font-bold text-white">{totalRecords}</span>{" "}
          {totalRecords === 1 ? "category" : "categories"} matching &ldquo;
          {searchQuery}&rdquo;
        </p>
      )}

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
                      <div className="w-8 h-8 border-2 border-(--clr-primary-a10) border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm text-zinc-500 font-medium">
                        Loading categories...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedCategories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <Tag size={48} className="text-zinc-500" />
                      <p className="text-lg font-bold text-zinc-400">
                        {searchQuery
                          ? "No categories match your search"
                          : "No categories found"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedCategories.map((cat) => (
                  <tr
                    key={cat.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-indigo-500/10 shrink-0">
                          <Tag className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-(--clr-primary-a10) transition-colors">
                            {cat.name}
                          </p>
                          <p className="text-[10px] text-zinc-600 font-mono mt-0.5">
                            ID: {cat.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-zinc-400 line-clamp-1">
                        {cat.description || (
                          <span className="text-zinc-600 italic">
                            No description provided.
                          </span>
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-white">
                          {cat.bookCount ?? 0}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                          Books
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/category-management/edit/${cat.id}`}
                        >
                          <ActionButton className="bg-white/5 hover:bg-white/10 text-zinc-400 border-white/10">
                            <Edit size={14} />
                          </ActionButton>
                        </Link>
                        <ActionButton
                          onClick={() => openDeleteModal(cat.id, cat.name)}
                          className="bg-red-500/5 hover:bg-red-500 text-red-500 hover:text-white border-red-500/10"
                        >
                          <Trash2 size={14} />
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalResults={totalRecords}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={goToPage}
          label="categories"
        />
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={() => {
          if (categoryToDelete) {
            handleDeleteCategory(categoryToDelete.id);
            closeDeleteModal();
          }
        }}
        itemName={categoryToDelete?.name}
      />
    </div>
  );
}
