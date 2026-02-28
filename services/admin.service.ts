import {
  AdminDashboardData,
  MemberDashboardData,
  PendingRequest,
  OverdueBookDetail,
  PendingFine,
  MemberDetails,
  BorrowedBooks,
  Book,
  Category,
  AddBook,
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

  getMembers: (): Promise<MemberDetails[]> => fetchFromApi("/user"),

  getRequests: async (): Promise<PendingRequest[]> => {
    const reservations = await fetchFromApi("/reservation");
    return reservations;
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

  cancelReservation: async (reservationId: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/reservation/${reservationId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to cancel reservation");
    }
  },

  reserveBook: async (userId: string, bookId: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/reservation`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: userId, book_id: bookId }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to reserve book");
    }
  },

  getMemberReservations: (userId: string): Promise<PendingRequest[]> =>
    fetchFromApi(`/user/reservations/${userId}`),

  getMemberLoans: (userId: string): Promise<BorrowedBooks[]> =>
    fetchFromApi(`/user/loans/${userId}`),

  getBooks: async (): Promise<Book[]> => fetchFromApi("/book"),

  getCategories: async (): Promise<Category[]> => fetchFromApi("/category"),

  deleteBook: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/book/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete book");
    }
  },

  deleteCategory: async (id: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/category/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete category");
    }
  },

  addBook: async (bookData: AddBook): Promise<Book> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/book`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to add book");
    }

    return response.json();
  },

  updateBook: async (id: string, bookData: Partial<AddBook>): Promise<Book> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/book/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update book");
    }

    return response.json();
  },

  getBookById: (id: string): Promise<Book> => fetchFromApi(`/book/${id}`),
};
