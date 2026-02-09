import { User, AuthResponse } from "../types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const authService = {
  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  },

  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  getUser: (): User | null => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    }
    return null;
  },

  login: async (formData: Record<string, any>): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Login failed");
    }

    const data = await response.json();
    if (data.access_token) {
      authService.setToken(data.access_token);
    }
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  },

  register: async (formData: Record<string, any>): Promise<User> => {
    const response = await fetch(`${API_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Registration failed");
    }

    return (await response.json()) as User;
  },

  logout: () => {
    authService.removeToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
};
