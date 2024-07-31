import { create } from "zustand";
import {
  getCategories as getCategoriesRes,
  getCategoryIcons,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from "../apicalls/categories";

import { getToken } from "../utils/storage";

export const useCategoriesStore = create((set) => ({
  categories: [],
  category: {},
  icons: [],
  totalIncome: 0,
  totalExpense: 0,
  getCategories: async () => {
    try {
      const token = await getToken();
      if (token) {
        const res = await getCategoriesRes();
        console.log("::::Categories resdata:: ", res.status);
        if (res.data.success) {
          set({ categories: res.data });
        }
      }
    } catch (error) {
      // console.error("API call error::::::", error);
    }
  },
  getCategoryIcons: async () => {
    const token = await getToken();
    if (token) {
      const res = await getCategoryIcons();
      if (res) {
        set({ icons: res.data?.icons });
      }
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

  categoryId: "",
  setCategoryId: (id) => set({ categoryId: id }),
}));

const initializeStore = async () => {
  const token = await getToken();

  console.log("emitting", token);
  if (token) {
    useCategoriesStore.getState().getCategoryIcons();
    useCategoriesStore.getState().getCategories();
  }
};

initializeStore();
