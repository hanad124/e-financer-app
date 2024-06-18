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
  } catch (error) {
    console.error("Error removing token from AsyncStorage:", error);
  }
};
