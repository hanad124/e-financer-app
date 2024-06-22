import { create } from "zustand";
import { getUserInfo } from "../apicalls/auth";
import { getToken } from "../utils/storage";

export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  fetchUser: () => {},

  getUserInfo: async () => {
    try {
      // check if token is present
      const token = await getToken();
      if (!token) return;
      const user = await getUserInfo();
      set({ user });
    } catch (error) {
      console.error("API call error::::::", error);
    }
  },
}));

const initializeStore = async () => {
  const user = await getUserInfo();
  useAuthStore.setState({ user });

  // fetch user info
  useAuthStore.getState().getUserInfo();
};

initializeStore();
