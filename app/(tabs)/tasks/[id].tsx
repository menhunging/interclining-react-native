import HeaderItem from "@/components/Header/HeaderItem";
import ButtonUI from "@/components/ui/Button/ButtonUI";
import IconCheckCircle from "@/components/ui/Icons/IconCheckCircle";
import IconDesc from "@/components/ui/Icons/IconDesc";
import IconFinish from "@/components/ui/Icons/iconFinish";
import TextUI from "@/components/ui/Text/Text";
import { COLORS } from "@/constants/colors";
import {
  startTaskTimer,
  updateTimer,
  updateTimerSync,
} from "@/store/slices/activeTaskSlice";
import { getTaskById } from "@/store/slices/tasksSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ITask } from "@/types/typesMobile/tasks";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const TaskScreen: React.FC<ITask> = () => {
  const dispatch = useAppDispatch();
  const { task } = useAppSelector((state) => state.tasks);
  const { taskId, currentTime, isRunning } = useAppSelector(
    (state) => state.activeTask
  );
  const router = useRouter();

  const { id } = useLocalSearchParams();
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [localTimer, setLocalTimer] = useState<number>(currentTime);

  // Проверяем, является ли эта задача активной
  const isCurrentActiveTask = taskId === id;

  const handleStart = async () => {
    if (id) {
      await dispatch(startTaskTimer(id as string));
      setLocalTimer(0); // сбрасываем локальный таймер при старте
    }
  };

  const handleStop = async () => {
    // переходим на страницу завершения, таймер продолжает идти
    dispatch(updateTimerSync(localTimer));
    const formattedTime = formatTime(localTimer);
    router.push(`/tasks/finish?id=${id}&timer=${formattedTime}`);
  };

  // для вывода времени в нашем формате
  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    const paddedHours = String(hours).padStart(2, "0");
    const paddedMinutes = String(minutes).padStart(2, "0");
    const paddedSeconds = String(seconds).padStart(2, "0");

    return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
  };

  // синхронизируем локальный таймер с Redux при первой загрузке
  useEffect(() => {
    if (isCurrentActiveTask && currentTime > 0) {
      setLocalTimer(currentTime);
    }
  }, [currentTime, isCurrentActiveTask]);

  // эффект для обновления таймера в UI
  useEffect(() => {
    if (isRunning && isCurrentActiveTask) {
      timerIntervalRef.current = setInterval(() => {
        setLocalTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRunning, isCurrentActiveTask]);

  // грузим задачу только при изменении id
  useEffect(() => {
    if (id) {
      // TODO надо будет решить проблему повторного рендера, может и вправду в продакшене этого не будет. Попробовать
      dispatch(getTaskById(id));
    }
  }, [id, dispatch]);

  // если задача активная — обновляем таймер
  useEffect(() => {
    if (isCurrentActiveTask) {
      dispatch(updateTimer());
    }
  }, [isCurrentActiveTask, dispatch]);

  if (task) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.wrapper} edges={["top", "right", "left"]}>
          <View style={styles.container}>
            <View style={styles.headerWrapper}>
              <HeaderItem
                hideArrow={isRunning}
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

                <View style={styles.taskControls}>
                  {isRunning && isCurrentActiveTask && (
                    <TextUI style={styles.timer}>
                      Таймер: {formatTime(localTimer)}
                    </TextUI>
                  )}

                  <ButtonUI
                    style={styles.btn}
                    onPress={
                      !isRunning || !isCurrentActiveTask
                        ? handleStart
                        : handleStop
                    }
                  >
                    {isRunning && isCurrentActiveTask ? (
                      <View style={styles.btnContent}>
                        <IconCheckCircle />
                        <TextUI style={styles.btnContentText}>Завершить</TextUI>
                      </View>
                    ) : (
                      "Начать"
                    )}
                  </ButtonUI>
                </View>
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

  btnContent: {
    alignItems: "center",
    gap: 6,
    flexDirection: "row",
    justifyContent: "center",
  },

  btnContentText: {
    fontFamily: "Manrope-SemiBold",
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },

  timer: {
    marginTop: "auto",
    textAlign: "center",
    marginBottom: 10,
  },

  taskControls: {
    marginTop: "auto",
  },
});

export default TaskScreen;
