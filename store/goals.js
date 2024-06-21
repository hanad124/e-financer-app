import { create } from "zustand";
import {
  createGoal,
  deleteGoal,
  getGoals,
  updateGoal,
} from "../apicalls/goals";

export const useGoalsStore = create((set) => ({
  goals: [],
  goal: {},
  getGoals: async () => {
    const res = await getGoals();
    set({ goals: res.data });
  },

  createGoal: async (payload) => {
    const res = await createGoal(payload);
    set({ goals: [...goals, res.data] });
  },
  updateGoal: async (payload) => {
    const res = await updateGoal(payload);
    set({ goals: [...goals, res.data] });
  },
  deleteGoal: async (payload) => {
    const res = await deleteGoal(payload);
    set({ goals: [...goals, res.data] });
  },

  goalId: "",
  setGoalId: (id) => set({ goalId: id }),
}));

const initializeStore = () => {
  const store = useGoalsStore.getState();
  store.getGoals();
  return store;
};

initializeStore();
