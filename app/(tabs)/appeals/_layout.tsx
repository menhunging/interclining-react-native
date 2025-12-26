import { Stack } from "expo-router";

const AppealStackLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="[id]"
        options={{
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="addTask"
        options={{
          presentation: "card",
        }}
      />
    </Stack>
  );
};

export default AppealStackLayout;
