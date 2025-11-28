import { Stack } from "expo-router";

const ObjectsStackLayout = () => {
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
    </Stack>
  );
};

export default ObjectsStackLayout;
