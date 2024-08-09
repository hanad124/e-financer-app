import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../apicalls/transactions";

import { getToken } from "../utils/storage";

export const useTransactionsStore = create((set, get) => ({
  transactions: [],
  transaction: {},
  transactionDetails: {},
  isLoading: false,
  setIsLoading: (value) => set({ isLoading: value }),
  getTransactions: async () => {
    try {
      const token = await getToken();
      if (token) {
        set({ isLoading: true });
        // First, try to load cached transactions
        const cachedTransactions = await AsyncStorage.getItem(
          "cachedTransactions"
        );
        if (cachedTransactions) {
          set({
            transactions: JSON.parse(cachedTransactions),
            isLoading: false,
          });
        }
        // Then, fetch fresh data from the API
        const res = await getTransactions();
        if (res?.data) {
          set({ transactions: res.data });
          // Cache the new data
          await AsyncStorage.setItem(
            "cachedTransactions",
            JSON.stringify(res.data)
          );
        }
        set({ isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      set({ isLoading: false });
    }
  },
  getTransactionById: async (id) => {
    const res = await getTransactionById(id);
    set({ transaction: res?.data });
  },
  createTransaction: async (payload) => {
    try {
      const res = await createTransaction(payload);
      set((state) => {
        const newTransactions = [res?.data, ...state.transactions];
        AsyncStorage.setItem(
          "cachedTransactions",
          JSON.stringify(newTransactions)
        );
        return { transactions: newTransactions };
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
    }
  },
  updateTransaction: async (id, payload) => {
    try {
      const res = await updateTransaction(id, payload);
      set((state) => {
        const updatedTransactions = state.transactions.map((transaction) =>
          transaction.id === id ? res?.data : transaction
        );
        AsyncStorage.setItem(
          "cachedTransactions",
          JSON.stringify(updatedTransactions)
        );
        return { transactions: updatedTransactions };
      });
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  },
  deleteTransaction: async (id) => {
    try {
      await deleteTransaction(id);
      set((state) => {
        const filteredTransactions = state.transactions.filter(
          (transaction) => transaction.id !== id
        );
        AsyncStorage.setItem(
          "cachedTransactions",
          JSON.stringify(filteredTransactions)
        );
        return { transactions: filteredTransactions };
      });
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  },
  transactionId: "",
  setTransactionId: (id) => set({ transactionId: id }),
}));

const initializeStore = async () => {
  const token = await getToken();
  if (token) {
    // Load cached transactions immediately
    const cachedTransactions = await AsyncStorage.getItem("cachedTransactions");
    if (cachedTransactions) {
      useTransactionsStore.setState({
        transactions: JSON.parse(cachedTransactions),
      });
    }
    // Then fetch fresh data
    useTransactionsStore.getState().getTransactions();
  }
};

initializeStore();
