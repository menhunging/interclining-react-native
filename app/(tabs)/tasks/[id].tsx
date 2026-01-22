import HeaderItem from "@/components/Header/HeaderItem";
import ButtonUI from "@/components/ui/Button/ButtonUI";
import IconCheckCircle from "@/components/ui/Icons/IconCheckCircle";
import IconDesc from "@/components/ui/Icons/IconDesc";
import IconFinish from "@/components/ui/Icons/iconFinish";
import ImageSlider from "@/components/ui/ImageSlider/ImageSlider";
import Preloader from "@/components/ui/Preloader/Preloader";
import TextUI from "@/components/ui/Text/Text";
import { COLORS } from "@/constants/colors";
import {
  startTaskTimer,
  updateTimerSync,
} from "@/store/slices/activeTaskSlice";
import { getTaskById } from "@/store/slices/tasksSlice";
import { clearCurrentTask } from "@/store/slices/zonesSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { ITask } from "@/types/typesMobile/tasks";
import { checkRoleAdmin } from "@/utils/checkRoleAdmin";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const TaskScreen: React.FC<ITask> = () => {
  const { id } = useLocalSearchParams();

  const router = useRouter();

  const dispatch = useAppDispatch();

  const { currentTask } = useAppSelector((state) => state.zones); // если сканируем qr, currentTask  будет содержать task объект
  const { userInfo } = useAppSelector((state) => state.auth);
  const { task, loading } = useAppSelector((state) => state.tasks);
  const { taskId, currentTime, isRunning } = useAppSelector(
    (state) => state.activeTask,
  );

  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [localTimer, setLocalTimer] = useState<number>(0);

  const isAdmin = checkRoleAdmin(Number(userInfo.role));

  // Проверяем, является ли эта задача активной
  const isCurrentActiveTask = taskId === id;

  const [isAfterScanning, setAfterScanning] = useState(false);

  const handleStart = async () => {
    if (id) {
      await dispatch(
        startTaskTimer({
          taskId: id as string,
          initialTime: String(localTimer),
        }),
      );
    }
  };

  const handleStop = async () => {
    // переходим на страницу завершения, таймер продолжает идти
    dispatch(updateTimerSync(localTimer));
    router.push(`/tasks/finish?id=${id}&timer=${localTimer}`);
  };

  // для парсинга времени из формата HH:MM:SS в секунды
  const parseTimeToSeconds = (timeString: string): number => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds;
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

  useEffect(() => {
    if (id) {
      dispatch(getTaskById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentTask) {
      setAfterScanning(true);
    }
  }, [currentTask]);

  // при размонтировании компонента currentTaskID будем очищать
  useFocusEffect(
    useCallback(() => {
      return () => {
        dispatch(clearCurrentTask());
      };
    }, []),
  );

  // Инициализируем таймер каждый раз при загрузке новой задачи
  useEffect(() => {
    if (task) {
      // Если задача активна, используем время из Redux, иначе из базы данных
      const initialTime =
        isCurrentActiveTask && currentTime !== 0
          ? currentTime
          : task.time_current
            ? parseTimeToSeconds(task.time_current)
            : 0;

      setLocalTimer(Number(initialTime));
    }
  }, [task, currentTime]);

  // Синхронизируем с Redux когда задача активна (включая паузу)
  useEffect(() => {
    if (isCurrentActiveTask) {
      setLocalTimer(currentTime);
    }
  }, [currentTime, isCurrentActiveTask]);

  // эффект для локального таймера в UI - только инкремент каждую секунду
  useEffect(() => {
    if (isRunning && !timerIntervalRef.current) {
      timerIntervalRef.current = setInterval(() => {
        setLocalTimer((prev) => prev + 1);
      }, 1000);
    } else if (!isRunning && timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, [isRunning]);

  if (task) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.wrapper} edges={["top", "right", "left"]}>
          <View style={styles.container}>
            <View style={styles.headerWrapper}>
              <HeaderItem
                isRunningTimer={isRunning}
                edit={true}
                mode={"fullScreenModal"}
                name={task.name_zone}
                desc={task.name}
                taskId={id as string}
                currentTime={localTimer}
                loading={loading}
              />
            </View>

            {!loading ? (
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
                    <TextUI
                      fontWeight="medium"
                      style={styles.tasksDatesEndText}
                    >
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

                  {isAdmin && task.status === 3 ? (
                    <>
                      <View style={styles.taskCaption}>
                        <IconDesc />
                        <TextUI style={styles.taskCaptionText}>
                          Причина паузы
                        </TextUI>
                      </View>
                      <View>
                        <TextUI>
                          {task.why_description
                            ? task.why_description
                            : task.why_name}
                        </TextUI>
                      </View>

                      {task.why_pause_photo &&
                        task.why_pause_photo.length > 0 && (
                          <ImageSlider photos={task.why_pause_photo} />
                        )}
                    </>
                  ) : undefined}

                  {isAdmin && task.id_user ? (
                    <>
                      <View style={styles.taskCaption}>
                        <IconDesc />
                        <TextUI style={styles.taskCaptionText}>
                          Исполнитель
                        </TextUI>
                      </View>
                      <View>
                        <TextUI>
                          {task.name_user} {task.surname_user}
                        </TextUI>
                      </View>
                    </>
                  ) : undefined}

                  {isAdmin && task.time_start_fact ? (
                    <>
                      <View style={styles.taskCaption}>
                        <IconDesc />
                        <TextUI style={styles.taskCaptionText}>
                          Дата/время начало (факт)
                        </TextUI>
                      </View>
                      <View>
                        <TextUI>
                          {task.date_start.split("-").reverse().join(".")}
                          {" в "}
                          {task.time_start_fact}
                        </TextUI>
                      </View>
                    </>
                  ) : undefined}

                  {isAdmin && task.data_success ? (
                    <>
                      <View style={styles.taskCaption}>
                        <IconDesc />
                        <TextUI style={styles.taskCaptionText}>
                          Дата/время завершения (факт)
                        </TextUI>
                      </View>
                      <View>
                        <TextUI>
                          {task.date_start.split("-").reverse().join(".")}
                          {" в "}
                          {task.data_success}
                        </TextUI>
                      </View>
                    </>
                  ) : undefined}

                  {isAdmin && task.id_team ? (
                    <>
                      <View style={styles.taskCaption}>
                        <IconDesc />
                        <TextUI style={styles.taskCaptionText}>Команда</TextUI>
                      </View>
                      <View>
                        <TextUI>{task.name_team}</TextUI>
                      </View>
                    </>
                  ) : undefined}

                  {!isAdmin && task.status !== 2 && (
                    <View style={styles.taskControls}>
                      {/* {isRunning && isCurrentActiveTask && (
                        <TextUI style={styles.timer}>
                          Таймер: {formatTime(localTimer)}
                        </TextUI>
                      )} */}

                      {(isAfterScanning || isRunning) && (
                        <ButtonUI
                          style={styles.btn}
                          onPress={!isRunning ? handleStart : handleStop}
                        >
                          {isRunning ? (
                            <View style={styles.btnContent}>
                              <IconCheckCircle />
                              <TextUI style={styles.btnContentText}>
                                Завершить
                              </TextUI>
                            </View>
                          ) : (
                            <TextUI style={styles.btnContentText}>
                              Начать
                            </TextUI>
                          )}
                        </ButtonUI>
                      )}
                    </View>
                  )}
                </View>
              </ScrollView>
            ) : (
              <Preloader />
            )}
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
