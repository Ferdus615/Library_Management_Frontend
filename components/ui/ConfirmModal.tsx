"use client";
import React, { useEffect } from "react";
import { X, HelpCircle, AlertCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDanger?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  isDanger = false,
}: ConfirmModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop with heavy blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-3xl glass-light border border-white/10 p-8 shadow-2xl transition-all duration-300 animate-in fade-in zoom-in-95">
        {/* Decorative background glow */}
        <div className={`absolute -top-24 -right-24 h-48 w-48 rounded-full ${isDanger ? "bg-(--clr-danger-a0)/20" : "bg-(--clr-info-a0)/20"} blur-3xl`} />
        <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-(--clr-primary-a0)/10 blur-3xl" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-zinc-500 hover:bg-white/5 hover:text-white transition-all duration-200"
          disabled={isLoading}
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          {/* Icon Header */}
          <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ${isDanger ? "bg-(--clr-danger-a0)/10 border border-(--clr-danger-a0)/20 text-(--clr-danger-a0) shadow-(--clr-danger-a0)/10" : "bg-(--clr-info-a0)/10 border border-(--clr-info-a0)/20 text-(--clr-info-a10) shadow-(--clr-info-a0)/10"} shadow-lg`}>
            {isDanger ? (
              <AlertCircle size={40} strokeWidth={1.5} className="animate-pulse" />
            ) : (
              <HelpCircle size={40} strokeWidth={1.5} className="animate-pulse" />
            )}
          </div>

          {/* Title and Content */}
          <h3 className="mb-2 text-2xl font-bold text-white tracking-tight">
            {title}
          </h3>

          <div className="mb-8">
            <p className="text-zinc-400 text-sm leading-relaxed px-4">
              {message}
            </p>
          </div>

          {/* Actions */}
          <div className="flex w-full flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all duration-300 disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 px-6 py-3.5 rounded-2xl ${isDanger ? "bg-linear-to-br from-(--clr-danger-a0) to-(--clr-danger-a10) shadow-(--clr-danger-a0)/20" : "bg-linear-to-br from-(--clr-info-a0) to-(--clr-info-a10) shadow-(--clr-info-a0)/20"} text-white font-black text-sm shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              {isLoading && (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              )}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
