export interface Notification {
  id: string;
  title: string;
  message: string;
  type:
    | "OVERDUE"
    | "RESERVATION_READY"
    | "RESERVATION_EXPIRED"
    | "FINE_CREATED"
    | "FINE_INCREMENT"
    | string;
  is_read: boolean;
  created_at: string;
}
