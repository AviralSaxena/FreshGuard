import { View, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import profile from "../constants/profile";
import { fetchUserById } from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const ProfileIcon = ({ route, size }) => {
  const router = useRouter();
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem("user");
        const parsed = stored ? JSON.parse(stored) : null;
        const userId = parsed?.data?.userId || parsed?.userId || parsed?.id;

        if (!userId) throw new Error("User ID not found in storage");

        const user = await fetchUserById(userId);
        setUserImage(user.imageUrl); 
        console.log("Loaded user:", user);
        // Do something with `user`
      } catch (err) {
        console.error("Error loading user by ID:", err.message);
      }
    };

    loadUser();
  }, []);


  const handlePress = () => {
    if (route) router.push(route); 
  };

  // Use provided size or fallback to 15% of screen width
  const iconSize = size || width * 0.15; // Default size if not provided
  const containerSize = iconSize * 1.1; // Slightly larger container for padding

  return (
    <View style={[styles.container, { width: containerSize, height: containerSize, borderRadius: containerSize / 2 }]}>
      <TouchableOpacity
        style={[styles.profile, { width: iconSize, height: iconSize, borderRadius: iconSize / 2 }]}
        onPress={handlePress}
      >
        <Image
          source={{ uri: userImage }}
          style={[styles.icon, { width: iconSize, height: iconSize}]} // Dynamically change icon size
        />
      </TouchableOpacity>
    </View>
  );
};

export default ProfileIcon;

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(212, 240, 171, 0.53)", // Light greenish background
  },
  profile: {
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    resizeMode: "cover",
    borderRadius: 50, 
  },
});
