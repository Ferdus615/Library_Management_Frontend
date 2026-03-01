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
  BookQueryDto,
  Reservation,
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

  getMemberById: (id: string): Promise<MemberDetails> =>
    fetchFromApi(`/user/${id}`),

  updateMember: async (
    id: string,
    data: Partial<MemberDetails>,
  ): Promise<MemberDetails> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/user/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update member");
    }

    return response.json();
  },

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

  borrowBook: async (
    userId: string,
    bookId: string,
  ): Promise<BorrowedBooks> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/loan`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        book_id: bookId,
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to borrow book!");
    }

    return response.json();
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

  receiveReservation: async (reservationID: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_URL}/reservation/receive/${reservationID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to receive reservation");
    }
  },

  cancelReservation: async (reservationId: string): Promise<void> => {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_URL}/reservation/cancel/${reservationId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to cancel reservation");
    }
  },

  getMemberReservations: (userId: string): Promise<PendingRequest[]> =>
    fetchFromApi(`/user/reservations/${userId}`),

  getMemberLoans: (userId: string): Promise<BorrowedBooks[]> =>
    fetchFromApi(`/user/loans/${userId}`),

  getMemberFines: (userId: string): Promise<PendingFine[]> =>
    fetchFromApi(`/user/fines/${userId}`),

  getBooks: async (query?: BookQueryDto): Promise<Book[]> => {
    let endpoint = "/book";
    if (query) {
      const params = new URLSearchParams();
      if (query.title) params.append("title", query.title);
      if (query.author) params.append("author", query.author);
      if (query.isbn) params.append("isbn", query.isbn);
      if (query.categoryId) params.append("categoryId", query.categoryId);
      if (query.page) params.append("page", query.page.toString());
      if (query.limit) params.append("limit", query.limit.toString());

      const queryString = params.toString();
      if (queryString) endpoint += `?${queryString}`;
    }
    return fetchFromApi(endpoint);
  },

  getCategories: async (): Promise<Category[]> => fetchFromApi("/category"),

  getBookReservations: (id: string): Promise<Reservation[]> =>
    fetchFromApi(`/book/reservations/${id}`),

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
