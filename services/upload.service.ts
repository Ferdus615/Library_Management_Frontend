const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const uploadService = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/file/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Note: Content-Type is intentionally omitted to let the browser set it with the boundary
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to upload image");
    }

    return response.json();
  },
};
