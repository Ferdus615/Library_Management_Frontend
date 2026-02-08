import React from "react";

interface BorrowRequestProps {
  id: string;
  user: string;
  book: string;
  requestedAt: string;
}

export default function BorrowRequestRow({
  user,
  book,
  requestedAt,
}: BorrowRequestProps) {
  return (
    <div className="flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-(--clr-surface-a10) transition-colors">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-(--clr-light-a0) truncate">
          {book}
        </p>
        <p className="text-xs text-(--clr-surface-a50)">by {user}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs text-(--clr-surface-a50)">{requestedAt}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-(--clr-success-a0)/20 text-(--clr-success-a10) hover:bg-(--clr-success-a0)/30 transition-colors">
          Approve
        </button>
        <button className="px-3 py-1.5 text-xs font-medium rounded-lg bg-(--clr-danger-a0)/20 text-(--clr-danger-a10) hover:bg-(--clr-danger-a0)/30 transition-colors">
          Reject
        </button>
      </div>
    </div>
  );
}
