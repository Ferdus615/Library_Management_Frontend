import React, { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-white dark:ring-offset-gray-950 duration-300 active:scale-95 hover:scale-[1.02]";

    const variants = {
      primary:
        "bg-(--clr-primary-a0) text-white hover:bg-(--clr-primary-a10) shadow-lg shadow-(--clr-primary-a0)/25",
      secondary:
        "bg-(--clr-surface-a10) text-(--clr-light-a0) hover:bg-(--clr-surface-a20)",
      outline:
        "border border-(--clr-surface-a20) bg-transparent hover:border-(--clr-primary-a10) hover:text-(--clr-primary-a10) text-(--clr-light-a0)",
      ghost:
        "text-(--clr-surface-a50) hover:bg-(--clr-surface-a10) hover:text-(--clr-light-a0)",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} h-10 py-2 px-4 ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </>
        ) : (
          children
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
