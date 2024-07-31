import { axiosInstance } from ".";

export const createBudget = (budget) => {
  try {
    const res = axiosInstance.post("/budgets", budget);
    return res;
  } catch (error) {
    // console.error("failed creating budgets", error);
    return error.response;
  }
};

export const updateBudget = (id, payload) => {
  try {
    const res = axiosInstance.patch(`/budgets/${id}`, payload);
    return res;
  } catch (error) {
    // console.error("failed updating budget", error);
    return error.response;
  }
};

export const deleteBudget = (id) => {
  try {
    const res = axiosInstance.delete(`/budgets/${id}`);
    return res;
  } catch (error) {
    // console.error("failed deleting budget", error);
    return error.response;
  }
};

export const getBudgets = () => {
  try {
    const res = axiosInstance.get("/budgets");
    return res;
  } catch (error) {
    // console.error("failed fetching budgets", error);
    return error.response;
  }
};

export const getBudgetById = (id) => {
  try {
    const res = axiosInstance.get(`/budgets/${id}`);
    return res;
  } catch (error) {
    // console.error("failed fetching budget by id", error);
    return error.response;
  }
};
