import { axiosInstance } from ".";

export const login = async (payload) => {
  console.log("payload", payload);
  try {
    const res = await axiosInstance.post("/auth/login", payload);
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
    return res;
  } catch (error) {
    console.error("API call error", error);
    return error.response;
  }
};

// user-info
export const getUserInfo = async () => {
  try {
    const res = await axiosInstance.get("/auth/user-info");
    console.log("response", res);
    return res;
  } catch (error) {
    console.error("API call error:::::", error);
    return error.response;
  }
};

// update user profile
export const updateProfile = async (payload) => {
  try {
    const res = await axiosInstance.patch("/auth/update-profile", payload);
    return res;
  } catch (error) {
    console.error("API call error", error);
    return error.response;
  }
};

// /verify-email-link
export const verifyEmailLink = async (payload) => {
  try {
    const res = await axiosInstance.post("/auth/verify-email-link", payload);
    return res;
  } catch (error) {
    console.error("API call error", error);
    return error.response;
  }
};
