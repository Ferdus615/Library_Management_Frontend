import React, { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        <label className="text-sm font-medium leading-none text-(--clr-surface-a50) peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
        <input
          ref={ref}
          className={`flex h-10 w-full rounded-md border border-(--clr-surface-a20) bg-transparent px-3 py-2 text-sm text-(--clr-light-a0) 
            placeholder:text-(--clr-surface-a50)/50 focus:outline-none focus:ring-2 focus:ring-(--clr-primary-a0) focus:border-transparent 
            disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 ${
            error ? "border-(--clr-danger-a0) focus:ring-(--clr-danger-a0)" : ""
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="text-sm font-medium text-(--clr-danger-a10) animate-pulse">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
