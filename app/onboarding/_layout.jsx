import { Stack } from "expo-router";


const OnboardingLayout = () => {
    return (
        <Stack screenOptions={{ headerShown: false}}>
          <Stack.Screen name="index" options={{ headerShown: false}} />
        </Stack>
    )
}

export default OnboardingLayout; 