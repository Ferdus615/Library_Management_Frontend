import React from "react";

interface OverdueBookProps {
  book: string;
  user: string;
  dueDate: string;
  daysOverdue: number;
}

export default function OverdueBookRow({
  book,
  user,
  dueDate,
  daysOverdue,
}: OverdueBookProps) {
  return (
    <div className="flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-(--clr-surface-a10) transition-colors">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-(--clr-danger-a0)/20 text-(--clr-danger-a10) shrink-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-(--clr-light-a0) truncate">
          {book}
        </p>
        <p className="text-xs text-(--clr-surface-a50)">Borrowed by {user}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-medium text-(--clr-danger-a10)">
          {daysOverdue} days overdue
        </p>
        <p className="text-xs text-(--clr-surface-a50)">Due: {dueDate}</p>
      </div>
    </div>
  );
}
