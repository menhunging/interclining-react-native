import AppInitializer from "@/components/AppInitializer";
import { COLORS } from "@/constants/colors";
import { store } from "@/store/store";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar, StyleSheet } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Manrope-Regular": require("../assets/fonts/Manrope-Regular.ttf"),
    "Manrope-Bold": require("../assets/fonts/Manrope-Bold.ttf"),
    "Manrope-Medium": require("../assets/fonts/Manrope-Medium.ttf"),
    "Manrope-Light": require("../assets/fonts/Manrope-Light.ttf"),
    "Manrope-SemiBold": require("../assets/fonts/Manrope-SemiBold.ttf"),
    "Manrope-ExtraBold": require("../assets/fonts/Manrope-ExtraBold.ttf"),
  });

  if (!fontsLoaded) return null;

  return (
    <Provider store={store}>
      <AppInitializer>
        <SafeAreaProvider>
          <SafeAreaView style={styles.wrapper} edges={["top", "right", "left"]}>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_right",
                contentStyle: {
                  backgroundColor: COLORS.white,
                },
              }}
            >
              <Stack.Screen
                name="index"
                options={{
                  gestureEnabled: true,
                }}
              />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar barStyle="dark-content" backgroundColor={"#fff"} />
          </SafeAreaView>
        </SafeAreaProvider>
      </AppInitializer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    fontFamily: "Manrope-Regular",
    flex: 1,
    backgroundColor: COLORS.white,
  },
});
