import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
        // First, try to load cached budgets
        const cachedBudgets = await AsyncStorage.getItem("cachedBudgets");
        if (cachedBudgets) {
          set({ budgets: JSON.parse(cachedBudgets), isLoading: false });
        }
        // Then, fetch fresh data from the API
        const res = await getBudgetsData();
        if (res.data) {
          set({ budgets: res.data });
          // Cache the new data
          await AsyncStorage.setItem("cachedBudgets", JSON.stringify(res.data));
        }
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
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
    useBudgetsStore.getState().getBudgets();
  }
};

initializeStore();
