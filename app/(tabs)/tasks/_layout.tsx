import { Stack } from "expo-router";

const TaskStackLayout = () => {
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
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen
        name="finish"
        options={{
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen
        name="success"
        options={{
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen
        name="pause"
        options={{
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen
        name="pause-photo"
        options={{
          presentation: "fullScreenModal",
        }}
      />
    </Stack>
  );
};

export default TaskStackLayout;
