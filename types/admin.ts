export interface AdminDashboardData {
  totalBook: number;
  totalCopies: number;
  totalAvailableCopies: number;
  totalDamagedCopies: number;
  totalLoanedCopies: number;
  totalOverdueCopies: number;
  totalActiveUser: number;
  totalMembers: number;
  totalLibrarian: number;
  totalAdmin: number;
  totalReservations: number;
  totalFines: number;
  totalFineAmount: number;
  totalCategories: number;
}

export interface MemberDashboardData {
  activeLoans: number;
  overdueLoans: number;
  totalReservation: number;
  totalFines: number;
  totalFineAmount: number;
}

// Keeping these as they might be used in other specific components or if the API expands
export interface ActivityLog {
  type: "borrow" | "return" | "register" | "overdue";
  user: string;
  target: string;
  time: string;
  action: string;
}

export interface PendingRequest {
  id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
  };
  book: {
    id: string;
    title: string;
  };
  status: string;
  created_at: string;
}

export interface OverdueBookDetail {
  id: string;
  user: {
    first_name: string;
    last_name: string;
  };
  book: {
    title: string;
  };
  due_date: string;
}
