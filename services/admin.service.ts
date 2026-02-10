import {
  AdminDashboardData,
  MemberDashboardData,
  ActivityLog,
  PendingRequest,
  OverdueBookDetail,
  PendingFine,
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

  getMemberStats: (): Promise<MemberDashboardData> =>
    fetchFromApi("/dashboard/member"),

  // These mapping since backend doesn't have specific dashboard sub-endpoints yet
  getActivity: async (): Promise<ActivityLog[]> => {
    // For now, returning empty or fetching from loans as a placeholder
    return [];
  },

  getRequests: async (): Promise<PendingRequest[]> => {
    const reservations = await fetchFromApi("/reservation");
    return reservations.filter((r: PendingRequest) => r.status === "PENDING");
  },

  getOverdue: async (): Promise<OverdueBookDetail[]> => {
    const overdues = await fetchFromApi("/dashboard/admin/overdue");
    return overdues;
  },

  getFines: (): Promise<PendingFine[]> => fetchFromApi("/fine"),
};
