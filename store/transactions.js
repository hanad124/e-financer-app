import { create } from "zustand";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../apicalls/transactions";

import { getToken } from "../utils/storage";

export const useTransactionsStore = create((set) => ({
  transactions: [],
  transaction: {},
  transcactionDetails: {},
  isLoading: false,
  setIsLoading: (value) => set({ isLoading: value }),
  getTransactions: async () => {
    try {
      const token = await getToken();
      if (token) {
        set({ isLoading: true });
        const res = await getTransactions();

        console.log("transaction res", res);
        set({ transactions: res?.data });
        set({ isLoading: false });
      }
    } catch (error) {
      // console.error("API call error::::::", error);
    }
  },
  getTransactionById: async (id) => {
    const res = await getTransactionById(id);
    set({ transaction: res?.data });
  },

  createTransaction: async (payload) => {
    try {
      const res = await createTransaction(payload);
      set({ transactions: [...set.transactions, res?.data] });
    } catch (error) {
      // console.error("API call error::::::", error);
    }
  },

  updateTransaction: async (id, payload) => {
    try {
      const res = await updateTransaction(id, payload);
      set({
        transactions: set.transactions.map((transaction) =>
          transaction.id === id ? res?.data : transaction
        ),
      });
    } catch (error) {
      // console.error("API call error::::::", error);
    }
  },

  deleteTransaction: async (id) => {
    try {
      const res = await deleteTransaction(id);
      set({
        transactions: set.transactions.filter(
          (transaction) => transaction.id !== id
        ),
      });
    } catch (error) {
      // console.error("API call error::::::", error);
    }
  },

  transactionId: "",
  setTransactionId: (id) => set({ transactionId: id }),
}));

const initializeStore = async () => {
  const token = await getToken();
  if (token) {
    const transactions = useTransactionsStore.getState().getTransactions();
    useTransactionsStore.setState({ transactions });
  } else {
    return null;
  }
};

initializeStore();
