// import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Stack } from "expo-router";


const AuthLayout = () => {
    return (
      <Stack screenOptions={{ headerShown: false}}>
        <Stack.Screen name="sign-in"/>
        <Stack.Screen name="sign-up"/>
        <Stack.Screen name="forgot"/>
        <Stack.Screen name="email"/>
        <Stack.Screen name="create"/>
      </Stack>
    )
}

export default AuthLayout; 