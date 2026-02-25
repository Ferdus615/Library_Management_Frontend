import {
  AdminDashboardData,
  PendingRequest,
  OverdueBookDetail,
  PendingFine,
  MemberDetails,
  BorrowedBooks,
} from "../types/admin";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function fetchFromApi(endpoint: string) {
  const token = localStorage.getItem("token");
  console.log(`Fetching from: ${API_URL}${endpoint}`);
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to fetch from ${endpoint}`);
  }

  return response.json();
}

export const adminService = {
  getStats: (): Promise<AdminDashboardData> => fetchFromApi("/dashboard/admin"),

  getMembers: (): Promise<MemberDetails[]> => fetchFromApi("/user"),

  getRequests: async (): Promise<PendingRequest[]> => {
    const reservations = await fetchFromApi("/reservation");
    return reservations.filter((r: PendingRequest) => r.status === "PENDING");
  },

  getOverdue: async (): Promise<OverdueBookDetail[]> => {
    const overdues = await fetchFromApi("/dashboard/admin/overdue");
    return overdues;
  },

  getBorrowedBooks: async (): Promise<BorrowedBooks[]> => {
    return await fetchFromApi("/loan");
  },

  getFines: (): Promise<PendingFine[]> => fetchFromApi("/fine"),

  returnBook: async (loanId: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/loan/${loanId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ return_date: new Date() }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to return book");
    }
  },

  updateLoanStatus: async (loanId: string, status: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/loan/${loanId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update loan status");
    }
  },

  payFine: async (fineId: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/fine/pay/${fineId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ paid: true, paid_at: new Date() }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to pay fine");
    }
  },
};
