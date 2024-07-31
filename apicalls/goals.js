import { axiosInstance } from ".";

export const createGoal = async (goal) => {
  try {
    const res = await axiosInstance.post("/goals", goal);
    return res;
  } catch (error) {
    // console.error(error);
  }
};

export const getGoals = async () => {
  try {
    const res = await axiosInstance.get("/goals");
    return res;
  } catch (error) {
    // console.error(error);
  }
};

export const updateGoal = async (goal) => {
  try {
    const res = await axiosInstance.put(`/goals/${goal.id}`, goal);
    return res;
  } catch (error) {
    // console.error(error);
  }
};

export const deleteGoal = async (id) => {
  try {
    const res = await axiosInstance.delete(`/goals/${id}`);
    return res;
  } catch (error) {
    // console.error(error);
  }
};

// send-push-notification
export const sendPushNotification = async (id, payload) => {
  try {
    const res = await axiosInstance.post(
      `/goals/send-push-notification`,
      payload
    );
    return res;
  } catch (error) {
    // console.error(error);
  }
};
