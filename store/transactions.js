import { create } from "zustand";
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../apicalls/transactions";

export const useTransactionsStore = create((set) => ({
  transactions: [],
  transaction: {},
  getTransactions: async () => {
    const res = await getTransactions();
    set({ transactions: res.data });
  },
  getTransactionById: async (id) => {
    const res = await getTransactionById(id);
    set({ transaction: res.data });
  },
  createTransaction: async (payload) => {
    const res = await createTransaction(payload);
    set({ transactions: [...transactions, res.data] });
  },
  updateTransaction: async (payload) => {
    const res = await updateTransaction(payload);
    set({ transactions: [...transactions, res.data] });
  },
  deleteTransaction: async (payload) => {
    const res = await deleteTransaction(payload);
    set({ transactions: [...transactions, res.data] });
  },

  transactionId: "",
  setTransactionId: (id) => set({ transactionId: id }),
}));

const initializeStore = async () => {
  useTransactionsStore.getState().getTransactions();
};

initializeStore();
