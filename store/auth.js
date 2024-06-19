import { create } from "zustand";
import { getUserInfo } from "../apicalls/auth";

export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),

  getUserInfo: async () => {
    try {
      const res = await getUserInfo();
      set({ user: res.data });
    } catch (error) {
      console.error("API call error::::::", error);
    }
  },
}));

const initializeStore = async () => {
  const user = await getUserInfo();
  useAuthStore.setState({ user });
};

initializeStore();
