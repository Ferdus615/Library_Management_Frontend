import { authService } from "./auth.service";
import { Notification } from "../types/notification";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function fetchFromApi(endpoint: string, options: RequestInit = {}) {
  const token = authService.getToken();

  if (token && authService.isTokenExpired(token)) {
    authService.logout();
    throw new Error("Session expired. Please login again.");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    authService.logout();
    throw new Error("Unauthorized. Please login again.");
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || `Failed to fetch from ${endpoint}`);
  }

  if (response.status === 204) return;
  return response.json();
}

export const notificationService = {
  getNotifications: async (): Promise<Notification[]> => {
    const user = authService.getUser();
    if (!user) return [];
    return fetchFromApi(`/notification/${user.id}`);
  },

  markAsRead: async (id: string): Promise<Notification> => {
    return fetchFromApi(`/notification/${id}/read`, {
      method: "PATCH",
    });
  },

  deleteNotification: async (id: string): Promise<void> => {
    return fetchFromApi(`/notification/${id}`, {
      method: "DELETE",
    });
  },

  markAllAsRead: async (): Promise<void> => {
    const user = authService.getUser();
    if (!user) return;
    return fetchFromApi(`/notification/read-all/${user.id}`, {
      method: "PATCH",
    });
  },
};
