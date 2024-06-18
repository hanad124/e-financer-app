import { axiosInstance } from ".";

export const login = async (payload) => {
  console.log("payload", payload);
  try {
    const res = await axiosInstance.post("/auth/login", payload);
    console.log("response", res);
    return res;
  } catch (error) {
    console.error("API call error", error);
    return error.response;
  }
};

// sign up
export const signUp = async (payload) => {
  console.log("payload", payload);
  try {
    const res = await axiosInstance.post("/auth/register", payload);
    console.log("response", res);
    return res;
  } catch (error) {
    console.error("API call error", error);
    return error.response;
  }
};
