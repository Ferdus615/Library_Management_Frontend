import React from "react";
import Link from "next/link";
import BorrowRequestRow from "./BorrowRequestRow";
import { PendingRequest } from "../../types/admin";

interface PendingRequestsProps {
  requests: PendingRequest[];
}

export default function PendingRequests({ requests }: PendingRequestsProps) {
  return (
    <div className="lg:col-span-2 rounded-xl bg-(--clr-surface-tonal-a0) border border-(--clr-surface-a20) p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-(--clr-light-a0)">
          Pending Borrow Requests
        </h2>
        <span className="px-2 py-1 text-xs font-medium rounded-full bg-(--clr-warning-a0)/20 text-(--clr-warning-a10)">
          {requests.length} pending
        </span>
      </div>
      <div className="space-y-1">
        {requests.length > 0 ? (
          requests.map((request) => (
            <BorrowRequestRow
              key={request.id}
              id={request.id}
              user={`${request.user.first_name} ${request.user.last_name}`}
              book={request.book.title}
              requestedAt={new Date(request.created_at).toLocaleDateString()}
            />
          ))
        ) : (
          <p className="text-sm text-(--clr-surface-a50) py-8 text-center">
            No pending requests
          </p>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-(--clr-surface-a20)">
        <Link
          href="/admin/borrow-request"
          className="text-sm text-(--clr-primary-a10) hover:text-(--clr-primary-a20) transition-colors"
        >
          View all requests →
        </Link>
      </div>
    </div>
  );
}
