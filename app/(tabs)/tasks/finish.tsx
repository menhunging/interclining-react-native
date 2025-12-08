import HeaderItem from "@/components/Header/HeaderItem";
import ButtonUI from "@/components/ui/Button/ButtonUI";
import IconBack from "@/components/ui/Icons/IconBack";
import TextUI from "@/components/ui/Text/Text";
import { baseStyle } from "@/constants/baseStyle";
import { COLORS } from "@/constants/colors";
import { stopTaskTimer } from "@/store/slices/activeTaskSlice";
import { finishTask, uploadTaskPhotos } from "@/store/slices/tasksSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const FinishScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { task } = useAppSelector((state) => state.tasks);

  const { id, timer } = useLocalSearchParams();

  const { taskId, isRunning } = useAppSelector((state) => state.activeTask);

  const router = useRouter();

  // локальный таймер для продолжения отсчета
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [localTimer, setLocalTimer] = useState<number>(0);

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

  // состояние камеры
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [photos, setPhotos] = useState<
    Array<{ uri: string; name: string; type: string }>
  >([]);
  const cameraRef = useRef<CameraView>(null);

  // Проверяем, является ли эта задача активной
  const isCurrentActiveTask = taskId === id;

  // инициализация локального таймера
  useEffect(() => {
    if (timer) {
      setLocalTimer(Number(timer));
    }
  }, [timer]);

  // эффект для локального таймера - только инкремент каждую секунду
  useEffect(() => {
    if (isRunning && isCurrentActiveTask && !timerIntervalRef.current) {
      timerIntervalRef.current = setInterval(() => {
        setLocalTimer((prev) => prev + 1);
      }, 1000);
    } else if (!isRunning && timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isRunning, isCurrentActiveTask]);

  // проверка разрешений камеры
  useEffect(() => {
    if (permission && !permission.granted) {
      Alert.alert(
        "Разрешение на камеру",
        "Для фотографирования нужно разрешение на использование камеры",
        [
          { text: "Отмена", style: "cancel" },
          { text: "Разрешить", onPress: requestPermission },
        ]
      );
    }
  }, [permission]);

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: false,
        });
        if (photo?.uri) {
          // Создаем объект файла для FormData
          const fileName = `photo_${Date.now()}.jpg`;
          const fileObj = {
            uri: photo.uri,
            name: fileName,
            type: "image/jpeg",
          };
          setPhotos((prev) => [...prev, fileObj]);
          setShowCamera(false);
        }
      } catch (error) {
        console.error("Ошибка при фотографировании:", error);
        Alert.alert("Ошибка", "Не удалось сделать фото");
      }
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = async () => {
    try {
      // останавливаем таймер перед отправкой
      await dispatch(stopTaskTimer());

      let uploadedPhotos: string[] = [];

      // Сначала отправляем фото, если они есть
      if (photos.length > 0) {
        uploadedPhotos = await dispatch(uploadTaskPhotos({ photos })).unwrap();
      }

      // Затем завершаем задачу с актуальным временем
      const formattedTime = formatTime(localTimer);
      await dispatch(
        finishTask({ id, time: formattedTime, photos: uploadedPhotos })
      ).unwrap();

      router.push(`/tasks/success`);
    } catch (error) {
      console.error("Ошибка при отправке:", error);
      Alert.alert("Ошибка", "Не удалось отправить данные. Попробуйте еще раз.");
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.wrapper} edges={["top", "right", "left"]}>
          <View style={baseStyle.container}>
            <View style={styles.NotCamera}>
              <TextUI style={styles.centerText}>
                Нет разрешения на использование камеры
              </TextUI>
              <ButtonUI onPress={requestPermission} style={styles.btn}>
                Запросить разрешение
              </ButtonUI>
            </View>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.wrapper} edges={["top", "right", "left"]}>
        <View style={styles.container}>
          <View style={styles.headerWrapper}>
            <HeaderItem
              mode="fullScreenModal"
              name={"Завершение"}
              desc="Подтверждение выполнения"
            />
          </View>

          <ScrollView
            style={styles.main}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.content}>
              <TextUI fontWeight="medium" style={styles.title}>
                Сделать фото
              </TextUI>

              <TextUI style={styles.subtitle}>
                (обязательно для этой уборки)
              </TextUI>

              <View style={styles.photosSection}>
                {photos.length > 0 && (
                  <TextUI style={styles.photosTitle}>
                    Сделанные фото ({photos.length})
                  </TextUI>
                )}

                <View style={styles.photosGrid}>
                  {photos.map((photo, index) => (
                    <View key={index} style={styles.photoContainer}>
                      <Image source={{ uri: photo.uri }} style={styles.photo} />
                      <Pressable
                        style={styles.removePhotoBtn}
                        onPress={() => removePhoto(index)}
                      >
                        <TextUI style={styles.removePhotoText}>&times;</TextUI>
                      </Pressable>
                    </View>
                  ))}

                  <Pressable
                    style={styles.addPhotoBtn}
                    onPress={() => setShowCamera(true)}
                  >
                    <TextUI style={styles.addPhotoText}>+</TextUI>
                  </Pressable>
                </View>
              </View>

              <View style={styles.controls}>
                {isRunning && isCurrentActiveTask && (
                  <TextUI style={styles.timer}>
                    Таймер: {formatTime(localTimer)}
                  </TextUI>
                )}

                <ButtonUI
                  style={styles.btn}
                  onPress={() => setShowCamera(true)}
                >
                  Сделать фото
                </ButtonUI>

                {photos.length > 0 && (
                  <ButtonUI
                    style={[styles.btn, styles.sendBtn]}
                    onPress={handleSend}
                  >
                    Отправить ({photos.length})
                  </ButtonUI>
                )}
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Модальное окно камеры */}
        <Modal
          visible={showCamera}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          <View style={styles.cameraContainer}>
            <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
              <View style={styles.cameraControls}>
                <Pressable
                  style={styles.cameraBtn}
                  onPress={() => setShowCamera(false)}
                >
                  <IconBack />
                </Pressable>

                <Pressable style={styles.captureBtn} onPress={takePhoto}>
                  <View style={styles.captureBtnInner} />
                </Pressable>

                <Pressable
                  style={styles.cameraBtn}
                  onPress={() =>
                    setFacing((current) =>
                      current === "back" ? "front" : "back"
                    )
                  }
                >
                  <TextUI style={styles.flipText}>↻</TextUI>
                </Pressable>
              </View>
            </CameraView>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
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
  content: {
    flex: 1,
  },
  NotCamera: {
    flex: 1,
    justifyContent: "center",
  },
  centerText: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 30,
  },
  timer: {
    marginTop: "auto",
    textAlign: "center",
  },
  photosSection: {
    flex: 1,
    marginBottom: 20,
  },
  photosTitle: {
    fontSize: 18,
    marginBottom: 16,
    fontWeight: "500",
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  photoContainer: {
    position: "relative",
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  removePhotoBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.red,
    justifyContent: "center",
    alignItems: "center",
  },
  removePhotoText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  addPhotoBtn: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.green,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.bgGray,
  },
  addPhotoText: {
    fontSize: 32,
    color: COLORS.green,
    fontWeight: "bold",
  },
  controls: {
    gap: 12,
  },
  btn: {
    marginBottom: 0,
  },
  sendBtn: {
    backgroundColor: COLORS.black,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  cameraBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  captureBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
  },
  flipText: {
    fontSize: 20,
    color: COLORS.white,
  },
});

export default FinishScreen;
