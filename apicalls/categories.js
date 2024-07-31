import { axiosInstance } from ".";

// get all categories
export const getCategories = async () => {
  try {
    const res = await axiosInstance.get("/categories");
    return res;
  } catch (error) {
    // console.error("API call error", error);
    return error.response;
  }
};

// get all categories/icons
export const getCategoryIcons = async () => {
  try {
    const res = await axiosInstance.get("/categories/icons");
    return res;
  } catch (error) {
    // console.error("API call error", error);
    return error.response;
  }
};

// create category
export const createCategory = async (payload) => {
  try {
    const res = await axiosInstance.post("/categories", payload);
    return res;
  } catch (error) {
    // console.error("API call error", error);
    return error.response;
  }
};

// update category
export const updateCategory = async (id, payload) => {
  try {
    const res = await axiosInstance.patch(`/categories/${id}`, payload);
    return res;
  } catch (error) {
    // console.error("API call error", error);
    return error.response;
  }
};

// delete category
export const deleteCategory = async (payload) => {
  try {
    const res = await axiosInstance.delete(`/categories/${payload}`);
    return res;
  } catch (error) {
    // console.error("API call error", error);
    return error.response;
  }
};

// get category by id
export const getCategoryById = async (id) => {
  try {
    const res = await axiosInstance.get(`/categories/${id}`);
    return res;
  } catch (error) {
    // console.error("API call error", error);
    return error.response;
  }
};
