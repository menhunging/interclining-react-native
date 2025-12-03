import { COLORS } from "@/constants/colors";
import { useAppSelector } from "@/store/store";
import { checkRoleAdmin } from "@/utils/checkRoleAdmin";
import { Ionicons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Alert } from "react-native";

const TabsLayout = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  const { taskId, isRunning } = useAppSelector((state) => state.activeTask);
  const router = useRouter();

  const isAdmin = checkRoleAdmin(Number(userInfo.role));
  const hasActiveTask = taskId && isRunning;

  const handleTabPress = (tabName: string) => {
    if (hasActiveTask && tabName !== "tasks") {
      Alert.alert(
        "Завершите задачу",
        "Прежде чем перейти к другим разделам, завершите активную задачу",
        [
          {
            text: "ОК",
            onPress: () => router.navigate(`/tasks/${taskId}`),
          },
        ]
      );
      return false; // блокируем переход
    }
    return true; // разрешаем переход
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.green,
        tabBarInactiveTintColor: COLORS.primary,
        headerShown: false,
        tabBarStyle: hasActiveTask ? { display: "none" } : undefined,
      }}
    >
      <Tabs.Screen
        name="objects"
        listeners={{
          tabPress: (e) => {
            if (!handleTabPress("objects")) {
              e.preventDefault();
            }
          },
        }}
        options={{
          title: "Сводка",
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: "Задания",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="appeals"
        listeners={{
          tabPress: (e) => {
            if (!handleTabPress("appeals")) {
              e.preventDefault();
            }
          },
        }}
        options={{
          title: "Обращения",
          href: isAdmin ? undefined : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        listeners={{
          tabPress: (e) => {
            if (!handleTabPress("scan")) {
              e.preventDefault();
            }
          },
        }}
        options={{
          title: "Скан",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="scan-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        listeners={{
          tabPress: (e) => {
            if (!handleTabPress("profile")) {
              e.preventDefault();
            }
          },
        }}
        options={{
          title: "Выход",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="exit-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
