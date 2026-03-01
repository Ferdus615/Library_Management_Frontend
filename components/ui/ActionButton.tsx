"use client";

import React, { ButtonHTMLAttributes } from "react";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 bg-(--clr-primary-a0)/10 hover:bg-(--clr-primary-a0) text-(--clr-primary-a10) hover:text-white rounded-xl text-xs font-bold transition-all active:scale-95 border border-(--clr-primary-a0)/20 hover:cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default ActionButton;
