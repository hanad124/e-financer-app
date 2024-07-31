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
      if (!token) return;
      const user = await getUserInfo();
      set({ user, isAuthenticated: true });
      set({ isLoading: false });
    } catch (error) {
      // console.error(":::::::API call error::::::", error);
    }
  },
}));

const initializeStore = async () => {
  const token = await getToken();
  if (token) {
    const user = useAuthStore.getState().getUserInfo();
    useAuthStore.setState({ user, isAuthenticated: true });
  } else {
    useAuthStore.setState({ isAuthenticated: false });
    return null;
  }
};

initializeStore();
