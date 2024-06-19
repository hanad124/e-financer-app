import AsyncStorage from "@react-native-async-storage/async-storage";

// Function to save token to AsyncStorage
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem("token", token);
  } catch (error) {
    console.error("Error saving token to AsyncStorage:", error);
  }
};

// Function to get token from AsyncStorage
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token;
  } catch (error) {
    console.error("Error getting token from AsyncStorage:", error);
    return null;
  }
};

// Function to remove token from AsyncStorage
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("token");
    console.log("Token removed from AsyncStorage");
  } catch (error) {
    console.error("Error removing token from AsyncStorage:", error);
  }
};

// store user data in AsyncStorage
export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem("user", JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user to AsyncStorage:", error);
  }
};

// get user data from AsyncStorage
export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem("user");
    return JSON.parse(user);
  } catch (error) {
    console.error("Error getting user from AsyncStorage:", error);
    return null;
  }
};
