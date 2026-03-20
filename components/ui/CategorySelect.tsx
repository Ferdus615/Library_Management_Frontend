"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search, ChevronDown, Check, X, Loader2 } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { Category } from "@/types/admin";

interface CategorySelectProps {
  label?: string;
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  nullLabel?: string;
}

export const CategorySelect: React.FC<CategorySelectProps> = ({
  label,
  value,
  onChange,
  placeholder = "Select Category",
  className = "",
  required = false,
  nullLabel = "No Category",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch categories based on search
  const fetchCategories = useCallback(async (search: string = "") => {
    setIsLoading(true);
    try {
      const response = await adminService.getCategories({
        search: search || undefined,
        limit: 20, // Show top 20 matches
      });
      setCategories(response.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch categories when opened or search term changes
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        fetchCategories(searchTerm);
      }, 300); // Debounce search
      return () => clearTimeout(timer);
    }
  }, [isOpen, searchTerm, fetchCategories]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Fetch initial selected category name if value exists
  useEffect(() => {
    const fetchSelectedCategoryName = async () => {
      if (value) {
        try {
          // Check if it's already in the current list
          const existing = categories.find(c => c.id === value);
          if (existing) {
            setSelectedCategoryName(existing.name);
          } else {
            const cat = await adminService.getCategoryById(value);
            setSelectedCategoryName(cat.name);
          }
        } catch (error) {
          console.error("Failed to fetch selected category name:", error);
          // Don't show "Unknown" because it might be still loading or initial empty string
          if (value !== "") setSelectedCategoryName("Selected Category");
        }
      } else {
        setSelectedCategoryName(null);
      }
    };

    fetchSelectedCategoryName();
  }, [value, categories]);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (category: Category | null) => {
    if (category) {
      onChange(category.id);
      setSelectedCategoryName(category.name);
    } else {
      onChange("");
      setSelectedCategoryName(null);
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className={`space-y-2 relative ${className}`} ref={containerRef}>
      {label && (
        <label className="text-sm font-medium leading-none text-(--clr-surface-a50)">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        onClick={handleToggle}
        className="w-full h-10 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white flex items-center justify-between cursor-pointer focus:ring-2 focus:ring-(--clr-primary-a0) transition-all hover:bg-white/10"
      >
        <span className={!selectedCategoryName ? "text-zinc-500" : ""}>
          {selectedCategoryName || placeholder}
        </span>
        <div className="flex items-center gap-2">
          {value && (
            <X
              size={14}
              className="text-zinc-500 hover:text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(null);
              }}
            />
          )}
          <ChevronDown
            size={16}
            className={`text-zinc-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-white/5 bg-zinc-950/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-(--clr-primary-a0)/50"
                onClick={(e) => e.stopPropagation()}
              />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 animate-spin" size={14} />
              )}
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {!required && !searchTerm && (
              <div
                onClick={() => handleSelect(null)}
                className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                  !value ? "bg-(--clr-primary-a0)/20 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span>{nullLabel}</span>
                {!value && <Check size={14} className="text-(--clr-primary-a0)" />}
              </div>
            )}
            
            {categories.length > 0 ? (
              categories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleSelect(cat)}
                  className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between transition-colors ${
                    value === cat.id ? "bg-(--clr-primary-a0)/20 text-white" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{cat.name}</span>
                  {value === cat.id && <Check size={14} className="text-(--clr-primary-a0)" />}
                </div>
              ))
            ) : (
              !isLoading && (
                <div className="px-3 py-8 text-xs text-zinc-500 text-center italic">
                  No categories found
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};
