import { create } from "zustand";
import {
  createGoal,
  deleteGoal,
  getGoals,
  updateGoal,
} from "../apicalls/goals";

export const useGoalsStore = create((set, get) => ({
  goals: [],
  goal: {},
  getGoals: async () => {
    const res = await getGoals();
    set({ goals: res.data });
  },
  createGoal: async (payload) => {
    const res = await createGoal(payload);
    set((state) => ({ goals: [...state.goals, res.data] }));
  },
  updateGoal: async (payload) => {
    const res = await updateGoal(payload);
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === res.data.id ? res.data : goal
      ),
    }));
  },
  deleteGoal: async (id) => {
    await deleteGoal(id);
    set((state) => ({
      goals: state.goals.filter((goal) => goal.id !== id),
    }));
  },
  goalId: "",
  setGoalId: (id) => set({ goalId: id }),
}));

const initializeStore = () => {
  useGoalsStore.getState().getGoals();
};

initializeStore();
