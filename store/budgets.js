import { create } from "zustand";
import {
  getBudgets as getBudgetsData,
  getBudgetById,
} from "../apicalls/budgets";
import { getToken } from "../utils/storage";

export const useBudgetsStore = create((set) => ({
  budgets: [],
  budget: {},
  budgetId: "",
  setBudgetId: (id) => set({ budgetId: id }),
  isLoading: false,
  setLoading: (value) => set({ isLoading: value }),

  getBudgets: async () => {
    try {
      set({ isLoading: true });
      const token = await getToken();
      if (token) {
        const res = await getBudgetsData();
        console.log("Budgets res|||", res);
        // if (res.data.success) {
        set({ budgets: res.data });
        // }
      }
    } catch (error) {
      // console.error("API call error::::::", error);
    }
    set({ isLoading: false });
  },

  getBudgetById: async (id) => {
    const res = await getBudgetById(id);
    set({ budget: res?.data });
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
