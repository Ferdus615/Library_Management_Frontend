"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminService } from "@/services/admin.service";
import { Category } from "@/types/admin";
import { toast } from "sonner";
import { ArrowLeft, Save, Image as ImageIcon, Plus } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function AddBookPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCategories, setIsFetchingCategories] = useState(true);

  // need to fix backend also
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    publication_year: "",
    total_copies: "",
    categoryId: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await adminService.getCategories();
        setCategories(data);
        if (data.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: data[0].id }));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        toast.error("Failed to load categories");
      } finally {
        setIsFetchingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "total_copies" ? parseInt(value) || 0 : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real scenario, we would upload the image here first
      // and get the URL. For now, we'll simulate or prepare for it.
      const cover_image = "";

      if (imageFile) {
        // Preparation for image upload
        // const uploadResult = await uploadService.upload(imageFile);
        // cover_image = uploadResult.url;
        toast.info("Image upload is prepared. Sending basic data for now.");
      }

      await adminService.addBook({ ...formData, cover_image });
      toast.success("Book added successfully!");
      router.push("/admin/books");
    } catch (error: unknown) {
      const err = error as Error;
      console.error("Failed to add book:", err);
      toast.error(err.message || "Failed to add book");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Link
              href="/admin/books"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Add <span className="text-(--clr-primary-a10)">New Book</span>
            </h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium ml-12">
            Fill in the details to add a new title to the library catalog.
          </p>
        </div>

        <Link href="/admin/category-management">
          <Button
            variant="outline"
            className="h-[42px] px-4 flex items-center gap-2 border-white/10 text-zinc-300"
          >
            <Plus size={18} />
            Manage Categories
          </Button>
        </Link>
      </div>

      {/* Form Section */}
      <div className="glass rounded-3xl border border-white/5 p-8 max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Title */}
            <Input
              label="Book Title"
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. The Great Gatsby"
              className="bg-white/5 border-white/10 rounded-2xl"
            />

            {/* Author */}
            <Input
              label="Author Name"
              required
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="e.g. F. Scott Fitzgerald"
              className="bg-white/5 border-white/10 rounded-2xl"
            />

            {/* ISBN */}
            <Input
              label="ISBN Number"
              required
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="e.g. 978-0743273565"
              className="bg-white/5 border-white/10 rounded-2xl"
            />

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-(--clr-surface-a50)">
                Category
              </label>
              <select
                required
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                disabled={isFetchingCategories}
                className="w-full h-10 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-(--clr-primary-a0) transition-all appearance-none cursor-pointer"
              >
                {isFetchingCategories ? (
                  <option>Loading categories...</option>
                ) : (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="bg-zinc-900">
                      {cat.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Publication Year */}
            <Input
              label="Publication Year"
              required
              name="publication_year"
              value={formData.publication_year}
              onChange={handleChange}
              placeholder="e.g. 1925"
              className="bg-white/5 border-white/10 rounded-2xl"
            />

            {/* Total Copies */}
            <Input
              label="Total Copies"
              required
              type="number"
              min="1"
              name="total_copies"
              value={formData.total_copies.toString()}
              onChange={handleChange}
              className="bg-white/5 border-white/10 rounded-2xl"
            />

            {/* Image Upload Selection */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none text-(--clr-surface-a50) flex items-center gap-2">
                  <ImageIcon size={14} className="text-(--clr-primary-a0)" />
                  Cover Image
                </label>
                <div className="flex items-center gap-6 p-4 bg-white/5 border border-dashed border-white/20 rounded-2xl">
                  {imagePreview ? (
                    <div className="relative w-24 h-32 rounded-lg bg-white/10 overflow-hidden border border-white/10">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-black/80 transition-colors"
                      >
                        <Plus className="rotate-45" size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-24 h-32 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                      <ImageIcon className="text-zinc-700" size={32} />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-xs text-zinc-400 mb-2">
                      Upload a high-quality cover image for the book. Supports
                      JPG, PNG (Max 5MB).
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="text-xs text-zinc-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-(--clr-primary-a10) file:text-white hover:file:bg-(--clr-primary-a0) file:cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <Link href="/admin/books">
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
              className="px-8 py-3 flex items-center gap-2 min-w-[140px] justify-center"
            >
              <Save size={18} />
              Add Book
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
