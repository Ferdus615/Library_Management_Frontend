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
  issue_date: string;
  due_date: string;
}

export interface PendingFine {
  id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  loan: {
    id: string;
    issue_date: string;
    due_date: string;
    return_date: string | null;
    status: string;
    book?: {
      title: string;
    };
  };
  book_title: string;
  total_amount: number;
  paid: boolean;
  paid_at: string | null;
}

export interface MemberDetails {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  publication_year: number;
  total_copies: number;
  available_copies: number;
  damaged_copies: number;
  cover_image: string | null;
  category: {
    id: string | null;
    name: string | null;
  } | null;
}

export interface AddBook {
  title: string;
  author: string;
  isbn: string;
  publication_year: number;
  total_copies: number;
  category_id: string;
  cover_image: string | null;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  bookCount?: number;
  _count?: {
    books: number;
  };
}

export interface AddCategory {
  name: string;
  description: string;
}

export interface BorrowedBooks {
  id: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
  book: {
    id: string;
    title: string;
    author: string;
    isbn: string;
    cover_image: string | null;
  };
  issue_date: string;
  due_date: string;
  return_date: string | null;
  status: string;
}
export interface BookQueryDto {
  title?: string;
  author?: string;
  isbn?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedBookResponse {
  data: Book[];
  total: number;
}

export interface UserQueryDto {
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedUserResponse {
  data: MemberDetails[];
  total: number;
}

export interface LoanQueryDto {
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedLoanResponse {
  data: BorrowedBooks[];
  total: number;
}

export interface ReservationQueryDto {
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedReservationResponse {
  data: Reservation[];
  total: number;
}

export interface CategoryQueryDto {
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedCategoryResponse {
  data: Category[];
  total: number;
}

export interface FineQueryDto {
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedFineResponse {
  data: PendingFine[];
  total: number;
  activeCount: number;
  paidCount: number;
}

export interface Reservation {
  id: string;
  status: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  book: {
    id: string;
    title: string;
    cover_image: string | null;
  };
  ready_at: string | null;
  expires_at: string | null;
  created_at: string;
}
