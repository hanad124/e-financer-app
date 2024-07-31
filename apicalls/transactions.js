import { axiosInstance } from ".";

export const getTransactions = async () => {
  try {
    const res = await axiosInstance.get("/transactions");
    return res;
  } catch (error) {
    // console.error("----- Transactions API call error ----", error);
    return error.response;
  }
};

// create transaction
export const createTransaction = async (payload) => {
  try {
    const res = await axiosInstance.post("/transactions", payload);
    return res;
  } catch (error) {
    // console.error("API call error", error);
    return error.response;
  }
};

// update transaction
export const updateTransaction = async (id, payload) => {
  try {
    const res = await axiosInstance.patch(`/transactions/${id}`, payload);
    return res;
  } catch (error) {
    // console.error("API call error", error);
    return error.response;
  }
};

// delete transaction
export const deleteTransaction = async (payload) => {
  try {
    const res = await axiosInstance.delete(`/transactions/${payload}`);

    return res;
  } catch (error) {
    // console.error("API call error", error);
    return error.response;
  }
};

// get transaction by id
export const getTransactionById = async (id) => {
  try {
    const res = await axiosInstance.get(`/transactions/${id}`);
    return res;
  } catch (error) {
    // console.error("API call error", error);
    return error.response;
  }
};
