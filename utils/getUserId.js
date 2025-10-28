import AsyncStorage from "@react-native-async-storage/async-storage";

export const getUserId = async () => {
  try {
    const userData = await AsyncStorage.getItem("user");
    if (!userData) return null;
    const parsed = JSON.parse(userData);
    console.log("📦 Parsed user:", parsed);
    
    return parsed?.userId;
  } catch (e) {
    console.error("Failed to load userId:", e);
    return null;
  }
};
