import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  isLoading: false,
  getCategories: async () => {
    try {
      const token = await getToken();
      if (token) {
        set({ isLoading: true });
        // First, try to load cached categories
        const cachedCategories = await AsyncStorage.getItem("cachedCategories");
        if (cachedCategories) {
          set({
            categories: JSON.parse(cachedCategories),
            isLoading: false,
          });
        }
        // Then, fetch fresh data from the API
        const res = await getCategoriesRes();
        if (res.data.success) {
          set({ categories: res.data });
          // Cache the new data
          await AsyncStorage.setItem(
            "cachedCategories",
            JSON.stringify(res.data)
          );
        }
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      set({ isLoading: false });
    }
  },
  getCategoryIcons: async () => {
    try {
      const token = await getToken();
      if (token) {
        // First, try to load cached icons
        const cachedIcons = await AsyncStorage.getItem("cachedIcons");
        if (cachedIcons) {
          set({ icons: JSON.parse(cachedIcons) });
        }
        // Then, fetch fresh data from the API
        const res = await getCategoryIcons();
        if (res) {
          set({ icons: res.data?.icons });
          // Cache the new data
          await AsyncStorage.setItem(
            "cachedIcons",
            JSON.stringify(res.data?.icons)
          );
        }
      }
    } catch (error) {
      console.error("Error fetching category icons:", error);
    }
  },
  createCategory: async (payload) => {
    try {
      const res = await createCategory(payload);
      if (res.status === 201) {
        set((state) => {
          const newCategories = [...state.categories, res.data];
          AsyncStorage.setItem(
            "cachedCategories",
            JSON.stringify(newCategories)
          );
          return { categories: newCategories };
        });
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  },
  updateCategory: async (payload) => {
    try {
      const res = await updateCategory(payload);
      if (res.status === 200) {
        set((state) => {
          const updatedCategories = state.categories.map((category) =>
            category._id === res.data._id ? res.data : category
          );
          AsyncStorage.setItem(
            "cachedCategories",
            JSON.stringify(updatedCategories)
          );
          return { categories: updatedCategories };
        });
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  },
  deleteCategory: async (payload) => {
    try {
      const res = await deleteCategory(payload);
      if (res.status === 200) {
        set((state) => {
          const filteredCategories = state.categories.filter(
            (category) => category._id !== res.data._id
          );
          AsyncStorage.setItem(
            "cachedCategories",
            JSON.stringify(filteredCategories)
          );
          return { categories: filteredCategories };
        });
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  },
  getCategoryById: async (id) => {
    try {
      const res = await getCategoryById(id);
      if (res.status === 200) {
        return res.data;
      }
    } catch (error) {
      console.error("Error fetching category by ID:", error);
    }
  },

  categoryId: "",
  setCategoryId: (id) => set({ categoryId: id }),
}));

const initializeStore = async () => {
  const token = await getToken();

  if (token) {
    useCategoriesStore.getState().getCategoryIcons();
    useCategoriesStore.getState().getCategories();
  }
};

initializeStore();
