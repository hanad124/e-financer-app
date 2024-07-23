import { create } from "zustand";
import { getBudgets as getBudgetsData } from "../apicalls/budgets";
import { getToken } from "../utils/storage";

export const useBudgetsStore = create((set) => ({
  budgets: [],
  isLoading: false,
  setLoading: (value) => set({ isLoading: value }),

  getBudgets: async () => {
    try {
      set({ isLoading: true });
      const token = await getToken();
      if (token) {
        const res = await getBudgetsData();
        if (res.data.success) {
          set({ budgets: res.data.budgets });
        }
      }
    } catch (error) {
      console.error("API call error::::::", error);
    }
    set({ isLoading: false });
  },
}));

const initializeStore = async () => {
  const token = await getToken();
  if (token) {
    const budgets = useBudgetsStore.getState().getBudgets();
    useBudgetsStore.setState({ budgets });
  } else {
    return null;
  }
};

initializeStore();
