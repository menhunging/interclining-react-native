import HeaderItem from "@/components/Header/HeaderItem";
import ButtonUI from "@/components/ui/Button/ButtonUI";
import IconDesc from "@/components/ui/Icons/IconDesc";
import IconFinish from "@/components/ui/Icons/iconFinish";
import TextUI from "@/components/ui/Text/Text";
import { COLORS } from "@/constants/colors";
import { getTaskById } from "@/store/slices/tasksSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ITask } from "@/types/typesMobile/tasks";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const TaskScreen: React.FC<ITask> = () => {
  const dispatch = useAppDispatch();
  const { loading, task } = useAppSelector((state) => state.tasks);

  const { id } = useLocalSearchParams(); // получаем id из URL

  useEffect(() => {
    if (id) {
      dispatch(getTaskById(id));
      // dispatch(fetchUsers());
    }
  }, [id, dispatch]);

  if (task) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.wrapper} edges={["top", "right", "left"]}>
          <View style={styles.container}>
            <View style={styles.headerWrapper}>
              <HeaderItem
                mode={"fullScreenModal"}
                name={task.name_zone}
                desc={task.name}
              />
            </View>
            <ScrollView
              style={styles.main}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.tasksDates}>
                <TextUI fontWeight="medium" style={styles.tasksDatesStart}>
                  {task.time_start.slice(0, -3)}
                </TextUI>
                <View style={styles.tasksDatesEnd}>
                  <IconFinish />
                  <TextUI fontWeight="medium" style={styles.tasksDatesEndText}>
                    {task.time_end.slice(0, -3)}
                  </TextUI>
                </View>
              </View>

              <View style={styles.taskBlock}>
                <View style={styles.taskCaption}>
                  <IconDesc />
                  <TextUI style={styles.taskCaptionText}>Описание</TextUI>
                </View>
                <View>
                  <TextUI>{task.description}</TextUI>
                </View>

                <ButtonUI style={styles.btn}>Начать</ButtonUI>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerWrapper: {
    position: "relative",
    zIndex: 10,
    backgroundColor: COLORS.white,
  },
  main: {
    flex: 1,
    zIndex: 0,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 20,
    flex: 1,
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

  taskCaption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    marginTop: 30,
  },

  taskCaptionText: {
    color: COLORS.green,
  },

  taskBlock: {
    flex: 1,
  },

  btn: {
    marginTop: "auto",
  },
});

export default TaskScreen;
