import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync(); 

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"), 
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"), 
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"), 
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"), 
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"), 
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"), 
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"), 
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"), 
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"), 
  });

  useEffect(() => {
    if(error) throw error; 
    if(fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, error])

  if(!fontsLoaded && !error) return null; 

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="profile/index" options={{ title: "Profile" }} />
          <Stack.Screen name="screens/ScanReceipt" options={{ title: "Scan Receipt" }}/>
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default RootLayout; 