import React from "react";

interface ActivityItemProps {
  action: string;
  user: string;
  target: string;
  time: string;
  type: "borrow" | "return" | "register" | "overdue";
}

export default function ActivityItem({
  action,
  user,
  target,
  time,
  type,
}: ActivityItemProps) {
  const typeColors = {
    borrow: "bg-(--clr-info-a0)/20 text-(--clr-info-a10)",
    return: "bg-(--clr-success-a0)/20 text-(--clr-success-a10)",
    register: "bg-(--clr-primary-a0)/20 text-(--clr-primary-a10)",
    overdue: "bg-(--clr-danger-a0)/20 text-(--clr-danger-a10)",
  };

  const typeIcons = {
    borrow: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    return: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    register: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
        />
      </svg>
    ),
    overdue: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div className="flex items-start gap-3 py-3 border-b border-(--clr-surface-a20) last:border-0">
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 ${typeColors[type]}`}
      >
        {typeIcons[type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-(--clr-light-a0)">
          <span className="font-medium">{user}</span>{" "}
          <span className="text-(--clr-surface-a50)">{action}</span>{" "}
          <span className="font-medium">{target}</span>
        </p>
        <p className="text-xs text-(--clr-surface-a50) mt-0.5">{time}</p>
      </div>
    </div>
  );
}
