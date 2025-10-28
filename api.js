import { Platform } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getLocalIp from "./utils/getIP";


// let API_URL = "http://192.168.1.67:5241/api";
let API_URL = "http://192.168.1.187:5241/api";
let AI_API_URL = "http://192.168.1.187:5000/api"

const fetchFromAPI = async (endpoint) => {
  try {
    console.log(`Fetching data from: ${API_URL}${endpoint}`);
    const response = await axios.get(`${API_URL}${endpoint}`, {
      timeout: 10000,
    });
    console.log(`API Response from ${endpoint}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`API Connection Error [${endpoint}]:`, error.toJSON());
    throw error;
  }
};

//-----------------------------------------------------ITEMS-----------------------------------------------------//
export const fetchItems = async () => {
    return fetchFromAPI("/items")
}

// Get all items for a specific user
export const fetchItemByUsersId = async (userId) => {
    return fetchFromAPI(`/items/user/${userId}`);
};

// Create a new item with optional image
export const createItem = async (itemData, file) => {
    try {
      const formData = new FormData();
      for (const key in itemData) {
        if (itemData[key] !== null && itemData[key] !== undefined) {
          formData.append(key, itemData[key]);
        }
      }
  
      if (file) {
        formData.append("file", {
          uri: file.uri,
          name: file.name || "item.jpg",
          type: file.type || "image/jpeg",
        });
      }
  
      const response = await axios.post(`${API_URL}/items`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error creating item:", error.toJSON());
      throw error;
    }
};

// Update item by ID and partition key
export const updateItem = async (id, userId, updateData, file) => {
  try {
    const formData = new FormData();
    
    for (const key in updateData) {
      if (updateData[key] !== null && updateData[key] !== undefined && key !== "ImageUrl") {
        formData.append(key, updateData[key]);
      }
    }

    if (file && file.uri) {
      formData.append("file", {
        uri: file.uri,
        name: file.name || "item.jpg",
        type: file.type || "image/jpeg",
      });
    }

    const response = await axios.put(`${API_URL}/items/${id}/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating item:", error.toJSON());
    throw error;
  }
};
  
// Delete item by ID and partition key
export const deleteItem = async (id, userId) => {
    try {
        const response = await axios.delete(`${API_URL}/items/${id}/${userId}`);
        return response.status === 204;
    } catch (error) {
        console.error("Error deleting item:", error.toJSON());
        throw error;
    }
};

//-----------------------------------------------------USERS-----------------------------------------------------//
// Fetch a single user by ID
export const fetchUserById = async (userId) => {
  return fetchFromAPI(`/users/${userId}`);
};


// Create or sign up new user
export const createUser = async (userData, file) => {
    try {
      const formData = new FormData();
      for (const key in userData) {
        if (userData[key] !== null && userData[key] !== undefined) {
          formData.append(key, userData[key]);
        }
      }
  
      if (file) {
        formData.append("file", {
          uri: file.uri,
          name: file.name || "profile.jpg",
          type: file.type || "image/jpeg",
        });
      }
  
      console.log(`Posting user to: ${API_URL}/users`);
      const response = await axios.post(`${API_URL}/users`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error.toJSON());
      throw error;
    }
};

// Update the user
export const updateUser = async (userId, updateData, file) => {
    try {
      const formData = new FormData();
      for (const key in updateData) {
        if (updateData[key] !== null && updateData[key] !== undefined) {
          formData.append(key, updateData[key]);
        }
      }
  
      if (file) {
        formData.append("file", {
          uri: file.uri,
          name: file.name || "profile.jpg",
          type: file.type || "image/jpeg",
        });
      }
  
      console.log(`Updating user at: ${API_URL}/users/${userId}`);
      const response = await axios.put(`${API_URL}/users/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      return response.data;
    } catch (error) {
      console.error("Error updating user:", error.toJSON());
      throw error;
    }
};

// Delete user
export const deleteUser = async (userId) => {
    try {
        const response = await axios.delete(`${API_URL}/users/${userId}`);
        return response.status === 204;
    } catch (error) {
        console.error("Error deleting item:", error.toJSON());
        throw error;
    }
};

// Login 
export const loginRequest = async (email, password) => {
  try{
    const loginRequestData =
    {
      email:email,
      password:password
    }
    console.log(`sending login request to: ${API_URL}/users/login`);
    const response = await axios.post(`${API_URL}/users/login`,loginRequestData,{
       headers: {"Content-Type":"application/json"},
    })

    await AsyncStorage.setItem("user", JSON.stringify(response)); 

    console.log("User logged in successfully:", response.data);
    return response.data;
  }
  catch(error)
  {
    console.error("Error loging in", error.toJSON());
    throw error;
  }
};

// Scan Function
export const scanReceipt = async (formData) => {
  try {
    const response = await fetch(`${API_URL}/api/receipt/scan`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to scan receipt');
    }

    return await response.json();
  } catch (error) {
    console.error('Error scanning receipt:', error);
    throw error;
  }
};

// Change password
export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/users/${userId}/change-password`,
      {
        currentPassword, 
        newPassword,
      },
      {
        headers: {"Content-Type":"application/json"},
      },
    ); 
    console.log("Change password successfully:", response.data);
    return response.data; 
  } 
  catch (error)
  {
    console.error("Error change password", error.toJSON());
    throw error;
  }
}

// Generate a new recipe using AI 
export const generateAIRecipe = async (inputData) => {
  try {
    // const response = await axios.post(
    //   "http://192.168.1.187:5000/api/recipes/generate",
    const response = await axios.post(`${AI_API_URL}/recipes/generate`,
      inputData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data?.content || "No recipe returned.";
  } catch (error) {
    console.error("Error generating AI recipe:", error.response?.data || error.message);
    throw error;
  }
};
