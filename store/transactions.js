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
  getTransactions: async () => {
    const res = await getTransactions();
    set({ transactions: res?.data });
  },
  getTransactionById: async (id) => {
    const res = await getTransactionById(id);
    set({ transaction: res?.data });
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
