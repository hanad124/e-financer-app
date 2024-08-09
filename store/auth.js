// src/store/auth.js
import { create } from "zustand";
import { getUserInfo } from "../apicalls/auth";
import { getToken } from "../utils/storage";

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  isLoading: false,
  setLoading: (value) => set({ isLoading: value }),

  getUserInfo: async () => {
    try {
      set({ isLoading: true });
      const token = await getToken();
      if (!token) {
        set({ isAuthenticated: false, isLoading: false });
        return;
      }
      const user = await getUserInfo();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      console.error("Error fetching user info:", error);
      set({ isAuthenticated: false, isLoading: false });
    }
  },
}));

const initializeStore = async () => {
  await useAuthStore.getState().getUserInfo();
};

// Load user data when the app starts
initializeStore();

// Re-fetch user data when the app comes to the foreground
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      initializeStore();
    }
  });
}
