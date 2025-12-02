import { COLORS } from "@/constants/colors";
import { ITask } from "@/types/typesMobile/tasks";
import { useRouter } from "expo-router";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import IconArrowRight from "../ui/Icons/IconArrowRight";
import IconFinish from "../ui/Icons/iconFinish";
import TextUI from "../ui/Text/Text";

interface TasksListProps {
  tasks: ITask[];
  loading?: boolean;
}

const TasksList: React.FC<TasksListProps> = ({ tasks }) => {
  const router = useRouter();

  const renderItem = ({ item }: { item: ITask }) => {
    const { id, name, description, time_start, time_end } = item;

    return (
      <TouchableOpacity
        style={styles.task}
        onPress={() => router.push(`/tasks/${id}`)}
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
          <View style={styles.tasksIconArrowRight}>
            <IconArrowRight />
          </View>
        </View>
        <TextUI fontWeight="medium" style={styles.title}>
          Зона: {id}
        </TextUI>
        <TextUI fontWeight="semibold" style={styles.name}>
          {name}
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
  },
  task: {
    padding: 12,
    backgroundColor: COLORS.bgGray,
    borderRadius: 14,
    gap: 8,
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
