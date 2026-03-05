import { authService } from "./auth.service";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    const token = authService.getToken();
    const user = authService.getUser();
    const response = await fetch(`${API_URL}/notification/${user?.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch notifications");
    }

    return response.json();
  },

  markAsRead: async (id: string): Promise<Notification> => {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/notification/${id}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to mark notification as read");
    }

    return response.json();
  },

  deleteNotification: async (id: string): Promise<void> => {
    const token = authService.getToken();
    const response = await fetch(`${API_URL}/notification/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete notification");
    }
  },
};
