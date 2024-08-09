import { create } from "zustand";
import {
  createGoal,
  deleteGoal,
  getGoals,
  updateGoal,
} from "../apicalls/goals";
import { getToken } from "../utils/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useGoalsStore = create((set, get) => ({
  goals: [],
  goal: {},
  isLoading: false,
  getGoals: async () => {
    set({ isLoading: true });
    const token = await getToken();
    if (token) {
      try {
        const cachedGoals = await AsyncStorage.getItem("cachedGoals");
        if (cachedGoals) {
          set({ goals: JSON.parse(cachedGoals), isLoading: false });
        }
        const res = await getGoals();
        const newGoals = res?.data || [];
        set({ goals: newGoals, isLoading: false });
        await AsyncStorage.setItem("cachedGoals", JSON.stringify(newGoals));
      } catch (error) {
        console.error("Error fetching goals:", error);
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  },
  createGoal: async (payload) => {
    const res = await createGoal(payload);
    set((state) => {
      const newGoals = [...state.goals, res.data];
      AsyncStorage.setItem("cachedGoals", JSON.stringify(newGoals));
      return { goals: newGoals };
    });
  },
  updateGoal: async (payload) => {
    const res = await updateGoal(payload);
    set((state) => {
      const newGoals = state.goals.map((goal) =>
        goal.id === res.data.id ? res.data : goal
      );
      AsyncStorage.setItem("cachedGoals", JSON.stringify(newGoals));
      return { goals: newGoals };
    });
  },
  deleteGoal: async (id) => {
    await deleteGoal(id);
    set((state) => {
      const newGoals = state.goals.filter((goal) => goal.id !== id);
      AsyncStorage.setItem("cachedGoals", JSON.stringify(newGoals));
      return { goals: newGoals };
    });
  },
  goalId: "",
  setGoalId: (id) => set({ goalId: id }),
}));

const initializeStore = async () => {
  const cachedGoals = await AsyncStorage.getItem("cachedGoals");
  if (cachedGoals) {
    useGoalsStore.setState({ goals: JSON.parse(cachedGoals) });
  }
  useGoalsStore.getState().getGoals();
};

initializeStore();
