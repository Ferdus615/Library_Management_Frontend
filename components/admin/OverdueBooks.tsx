import React from "react";
import OverdueBookRow from "./OverdueBookRow";
import { OverdueBookDetail } from "../../types/admin";

interface OverdueBooksProps {
  overdueBooks: OverdueBookDetail[];
}

export default function OverdueBooks({ overdueBooks }: OverdueBooksProps) {
  return (
    <div className="rounded-xl bg-(--clr-surface-tonal-a0) border border-(--clr-surface-a20) p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-(--clr-light-a0)">
            Overdue Books
          </h2>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-(--clr-warning-a0)/20 text-(--clr-warning-a10)">
            {overdueBooks.length} overdue
          </span>
        </div>
        <button className="text-sm text-(--clr-primary-a10) hover:text-(--clr-primary-a20) transition-colors">
          Send Reminders
        </button>
      </div>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2"> */}
      <div className="flex flex-col gap-2">
        {overdueBooks.length > 0 ? (
          overdueBooks.map((item, index) => (
            <OverdueBookRow
              key={index}
              book={item.book.title}
              user={`${item.user.first_name} ${item.user.last_name}`}
              issueDate={new Date(item.issue_date).toLocaleDateString()}
              dueDate={new Date(item.due_date).toLocaleDateString()}
              daysOverdue={Math.floor(
                // eslint-disable-next-line react-hooks/purity
                (Date.now() - new Date(item.due_date).getTime()) /
                  (1000 * 60 * 60 * 24),
              )}
            />
          ))
        ) : (
          <div className="col-span-full py-8 text-center text-(--clr-surface-a50)">
            Great job! No overdue books.
          </div>
        )}
      </div>
    </div>
  );
}
