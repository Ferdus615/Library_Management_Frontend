"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { adminService } from "@/services/admin.service";
import { Category, Book } from "@/types/admin";
import { toast } from "sonner";
import { ArrowLeft, Save, Image as ImageIcon, Plus } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function EditBookPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    publication_year: 0,
    total_copies: 0,
    category_id: "",
    cover_image: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catsData, bookData] = await Promise.all([
          adminService.getCategories(),
          adminService.getBookById(id),
        ]);

        setCategories(catsData);
        setFormData({
          title: bookData.title,
          author: bookData.author,
          isbn: bookData.isbn,
          publication_year: parseInt(bookData.publication_year),
          total_copies: bookData.total_copies,
          category_id: bookData.category?.id || "",
          cover_image: bookData.cover_image || "",
        });

        if (bookData.cover_image) {
          setImagePreview(bookData.cover_image);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast.error("Failed to load book data");
        router.push("/admin/books");
      } finally {
        setIsFetchingData(false);
      }
    };

    if (id) fetchData();
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "total_copies" || name === "publication_year"
          ? parseInt(value) || 0
          : value,
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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConfirmModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    setIsConfirmModalOpen(false);
    setIsLoading(true);

    try {
      let cover_image = formData.cover_image;

      // Image upload logic temporarily disabled for testing like in Add Book
      /*
      if (imageFile) {
        toast.loading("Uploading image...", { id: "uploading" });
        const uploadResult = await uploadService.uploadImage(imageFile);
        cover_image = uploadResult.url;
        toast.success("Image uploaded successfully", { id: "uploading" });
      }
      */

      await adminService.updateBook(id, { ...formData, cover_image });
      toast.success("Book updated successfully!");
      router.push("/admin/books");
    } catch (error: any) {
      console.error("Failed to update book:", error);
      toast.error(error.message || "Failed to update book");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-in fade-in duration-700">
        <div className="w-16 h-16 border-[3px] border-white/5 border-t-(--clr-primary-a0) rounded-full animate-spin shadow-lg shadow-(--clr-primary-a0)/20" />
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">
          Retrieving book details...
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
              href="/admin/books"
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"
            >
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Edit <span className="text-(--clr-primary-a10)">Book</span>
            </h1>
          </div>
          <p className="text-sm text-zinc-500 font-medium ml-12">
            Update the information for this catalog entry.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="glass rounded-3xl border border-white/5 p-8 max-w-4xl">
        <form onSubmit={handleFormSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input
              label="Book Title"
              required
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="bg-white/5 border-white/10 rounded-2xl"
            />

            <Input
              label="Author Name"
              required
              name="author"
              value={formData.author}
              onChange={handleChange}
              className="bg-white/5 border-white/10 rounded-2xl"
            />

            <Input
              label="ISBN Number"
              required
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="bg-white/5 border-white/10 rounded-2xl"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none text-(--clr-surface-a50)">
                Category
              </label>
              <select
                required
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full h-10 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-(--clr-primary-a0) transition-all appearance-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-zinc-900">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Publication Year"
              required
              name="publication_year"
              value={formData.publication_year}
              onChange={handleChange}
              className="bg-white/5 border-white/10 rounded-2xl"
            />

            <Input
              label="Total Copies"
              required
              min={1}
              name="total_copies"
              value={formData.total_copies}
              onChange={handleChange}
              className="bg-white/5 border-white/10 rounded-2xl"
            />

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
                      Upload a new cover image or keep the current one.
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
              className="px-8 py-3 flex items-center gap-2 min-w-[140px] justify-center bg-linear-to-br from-(--clr-success-a0) to-(--clr-success-a10) font-black text-sm"
            >
              <Save size={18} />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        title="Save Changes"
        message={`Are you sure you want to save the changes for "${formData.title}"?`}
        confirmText="Save Changes"
      />
    </div>
  );
}
