"use client";

import React, { useState, ButtonHTMLAttributes } from "react";
import ConfirmModal from "./ConfirmModal";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  confirmTitle?: string;
  confirmMessage?: string;
  confirmText?: string;
  onConfirm?: () => Promise<void> | void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  className = "",
  confirmTitle,
  confirmMessage,
  confirmText = "Confirm",
  onConfirm,
  onClick,
  ...props
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (confirmTitle && confirmMessage) {
      e.preventDefault();
      setIsModalOpen(true);
    } else if (onClick) {
      onClick(e);
    }
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      if (onConfirm) {
        await onConfirm();
      } else if (onClick) {
        // Fallback to onClick if onConfirm is not provided
        await onClick({} as React.MouseEvent<HTMLButtonElement>);
      }
    } finally {
      setIsConfirming(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={`px-4 py-2 bg-(--clr-primary-a0)/10 hover:bg-(--clr-primary-a0) text-(--clr-primary-a10) hover:text-white rounded-xl text-xs font-bold transition-all active:scale-95 border border-(--clr-primary-a0)/20 hover:cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </button>

      {confirmTitle && confirmMessage && (
        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirm}
          title={confirmTitle}
          message={confirmMessage}
          confirmText={confirmText}
          isLoading={isConfirming}
        />
      )}
    </>
  );
};

export default ActionButton;
