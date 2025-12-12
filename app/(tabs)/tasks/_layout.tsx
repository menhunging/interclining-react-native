import { useAppSelector } from "@/store/store";
import { Stack } from "expo-router";

const TaskStackLayout = () => {
  const { isRunning } = useAppSelector((state) => state.activeTask);

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
          gestureEnabled: !isRunning,
        }}
      />
      <Stack.Screen
        name="finish"
        options={{
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="success"
        options={{
          presentation: "card",
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name="pause"
        options={{
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="pause-photo"
        options={{
          presentation: "card",
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          presentation: "card",
        }}
      />
    </Stack>
  );
};

export default TaskStackLayout;
