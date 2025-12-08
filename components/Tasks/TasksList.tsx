import { COLORS } from "@/constants/colors";
import { useAppSelector } from "@/store/store";
import { ITask } from "@/types/typesMobile/tasks";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import IconArrowRight from "../ui/Icons/IconArrowRight";
import IconFinish from "../ui/Icons/iconFinish";
import TextUI from "../ui/Text/Text";

interface TasksListProps {
  tasks: ITask[];
  loading?: boolean;
  onRefresh?: () => Promise<void> | void;
}

const TasksList: React.FC<TasksListProps> = ({ tasks, onRefresh }) => {
  const router = useRouter();
  const { taskId, isRunning } = useAppSelector((state) => state.activeTask);

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setRefreshing(false);
  };

  const handleTaskPress = (taskIdParam: string) => {
    // Если есть активная задача и она не совпадает с выбранной
    if (taskId && isRunning && taskId !== taskIdParam) {
      Alert.alert(
        "Невозможно перейти",
        "Завершите текущую задачу перед началом новой",
        [
          { text: "ОК" },
          {
            text: "Перейти к активной",
            onPress: () => router.push(`/tasks/${taskId}`),
          },
        ]
      );
      return;
    }

    router.push(`/tasks/${taskIdParam}`);
  };

  const renderItem = ({ item }: { item: ITask }) => {
    const { id, name, description, time_start, time_end, name_zone,date_start} = item;
    const isActiveTask = taskId === id && isRunning;

    return (
      <TouchableOpacity
        style={[styles.task, isActiveTask && styles.activeTask]}
        onPress={() => handleTaskPress(id)}
      >
        <View style={styles.tasksDates}>
          <TextUI fontWeight="medium" style={styles.tasksDatesStart}>
            {time_start.slice(0, -3)}
          </TextUI>
          <View style={styles.tasksDatesEnd}>
            <IconFinish />
            <TextUI fontWeight="medium" style={styles.tasksDatesEndText}>
              {time_end.slice(0, -3)}
            </TextUI>
          </View>
          <View style={styles.activeIndicator}>
            <TextUI style={styles.activeText}>{date_start}</TextUI>
          </View>
          <View style={styles.tasksIconArrowRight}>
            <IconArrowRight />
          </View>
        </View>
        <TextUI fontWeight="medium" style={styles.title}>
          Зона:
        </TextUI>
        <TextUI fontWeight="semibold" style={styles.name}>
          {name_zone}
        </TextUI>
        <TextUI fontWeight="medium" style={styles.text}>
          {description}
        </TextUI>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={tasks}
      numColumns={1}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.white,
    paddingVertical: 20,
  },
  listContent: {
    gap: 8,
    paddingBottom: 20,
  },
  task: {
    padding: 12,
    backgroundColor: COLORS.bgGray,
    borderRadius: 14,
    gap: 8,
  },
  activeTask: {
    backgroundColor: COLORS.green + "20", // полупрозрачный зеленый
    borderWidth: 2,
    borderColor: COLORS.green,
  },
  activeIndicator: {
    backgroundColor: COLORS.green,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  activeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  tasksDates: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  tasksDatesStart: {
    backgroundColor: COLORS.black,
    color: COLORS.white,
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 18,
  },
  tasksDatesEnd: {
    backgroundColor: COLORS.white,
    color: COLORS.black,
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    fontSize: 18,
    // iOS
    shadowColor: "#0000001A", // цвет тени
    shadowOffset: { width: -1, height: 1 }, // смещение
    shadowOpacity: 1, // прозрачность (0–1)
    shadowRadius: 6, // радиус размытия
    // Android
    elevation: 4, // подбирается экспериментально
  },
  tasksDatesEndText: {
    fontSize: 18,
  },
  title: {
    color: COLORS.tabNotActiveColor,
    fontSize: 16,
  },
  name: {
    color: COLORS.primary,
    fontSize: 18,
  },
  text: {
    color: COLORS.primary,
    fontSize: 16,
  },
  tasksIconArrowRight: {
    marginLeft: "auto",
  },
});

export default TasksList;
