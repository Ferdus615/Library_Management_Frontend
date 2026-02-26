"use client";

import React from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  itemName?: string;
}

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Deletion",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with heavy blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl glass-light border border-white/10 p-8 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-(--clr-danger-a0)/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-(--clr-primary-a0)/10 blur-3xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-500 hover:bg-white/5 hover:text-white transition-all duration-200"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Icon Header */}
          <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-(--clr-danger-a0)/10 border border-(--clr-danger-a0)/20 text-(--clr-danger-a0) shadow-lg shadow-(--clr-danger-a0)/10">
            <Trash2 size={40} strokeWidth={1.5} className="animate-pulse" />
          </div>

          {/* Title and Content */}
          <h3 className="mb-2 text-2xl font-bold text-white tracking-tight">
            {title}
          </h3>

          <div className="mb-8">
            <p className="text-zinc-400 text-sm leading-relaxed">
              {description}
            </p>
            {itemName && (
              <p className="mt-3 inline-block px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-(--clr-danger-a10) font-mono text-xs">
                {itemName}
              </p>
            )}
          </div>

          {/* Warning Banner */}
          <div className="mb-8 w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-(--clr-warning-a0)/5 border border-(--clr-warning-a0)/10 text-(--clr-warning-a10) text-left">
            <AlertTriangle size={18} className="shrink-0" />
            <span className="text-xs font-medium">
              This will permanently remove the record from the database.
            </span>
          </div>

          {/* Actions */}
          <div className="flex w-full flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3.5 rounded-2xl bg-linear-to-br from-(--clr-danger-a0) to-(--clr-danger-a10) text-white font-black text-sm shadow-lg shadow-(--clr-danger-a0)/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
