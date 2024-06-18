import { create } from "zustand";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from "../apicalls/categories";

export const useCategoriesStore = create((set) => ({
  categories: [],
  totalIncome: 0,
  totalExpense: 0,
  getCategories: async () => {
    const res = await getCategories();
    if (res.status === 200) {
      set({ categories: res.data });
    }
  },
  createCategory: async (payload) => {
    const res = await createCategory(payload);
    if (res.status === 201) {
      set((state) => ({
        categories: [...state.categories, res.data],
      }));
    }
  },
  updateCategory: async (payload) => {
    const res = await updateCategory(payload);
    if (res.status === 200) {
      set((state) => ({
        categories: state.categories.map((category) =>
          category._id === res.data._id ? res.data : category
        ),
      }));
    }
  },
  deleteCategory: async (payload) => {
    const res = await deleteCategory(payload);
    if (res.status === 200) {
      set((state) => ({
        categories: state.categories.filter(
          (category) => category._id !== res.data._id
        ),
      }));
    }
  },
  getCategoryById: async (id) => {
    const res = await getCategoryById(id);
    if (res.status === 200) {
      return res.data;
    }
  },
}));

const initializeStore = async () => {
  useCategoriesStore.getState().getCategories();
};

initializeStore();
