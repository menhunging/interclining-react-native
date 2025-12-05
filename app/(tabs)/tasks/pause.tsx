import HeaderItem from "@/components/Header/HeaderItem";
import ButtonUI from "@/components/ui/Button/ButtonUI";
import TextUI from "@/components/ui/Text/Text";
import { COLORS } from "@/constants/colors";
import { useAppSelector } from "@/store/store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

type PauseReason = "extra_work" | "late" | "other" | null;

const PauseScreen: React.FC = () => {
  const { task } = useAppSelector((state) => state.tasks);

  const { id } = useLocalSearchParams();

  const router = useRouter();

  // причина паузы
  const [selectedReasons, setSelectedReasons] = useState<PauseReason>(null);
  const [customReason, setCustomReason] = useState<string>("");

  const getReasonText = (reason: PauseReason): string => {
    switch (reason) {
      case "extra_work":
        return "Дополнительная работа";
      case "late":
        return "Не успеваю";
      case "other":
        return "Другое";
      default:
        return "";
    }
  };

  const reasonIcons: Record<Exclude<PauseReason, null | "other">, any> = {
    extra_work: require("@/assets/images/ic-paused1.png"),
    late: require("@/assets/images/ic-paused2.png"),
  };

  const reasonOptions: Exclude<PauseReason, null>[] = [
    "extra_work",
    "late",
    "other",
  ];

  const handleNext = () => {
    if (!selectedReasons) {
      Alert.alert("Ошибка", "Надо выбрать причину или написать причину паузы");
      return;
    }

    router.push({
      pathname: "/tasks/pause-photo",
      params: {
        id,
        reasons: selectedReasons,
        customReason: selectedReasons === "other" ? customReason : "",
      },
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.wrapper} edges={["top", "right", "left"]}>
        <View style={styles.container}>
          <View style={styles.headerWrapper}>
            <HeaderItem
              mode="fullScreenModal"
              name={task?.name_zone || "Пауза"}
              desc="Не могу выполнить задание"
            />
          </View>

          <ScrollView
            style={styles.main}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.content}>
              <TextUI fontWeight="medium" style={styles.title}>
                Укажите причину паузы
              </TextUI>

              <View style={styles.reasonsList}>
                {reasonOptions.map((reason) => (
                  <Pressable
                    key={reason}
                    style={[
                      styles.reasonBlock,
                      selectedReasons === reason && styles.reasonBlockSelected,
                    ]}
                    onPress={() => setSelectedReasons(reason)}
                  >
                    <View style={styles.reasonContent}>
                      <TextUI
                        fontWeight="medium"
                        style={[
                          styles.reasonText,
                          selectedReasons === reason &&
                            styles.reasonTextSelected,
                        ]}
                      >
                        {getReasonText(reason)}
                      </TextUI>
                      {reason !== "other" ? (
                        <View style={styles.reasonIcon}>
                          <Image
                            source={reasonIcons[reason]}
                            style={styles.reasonImage}
                            resizeMode="contain"
                          />
                        </View>
                      ) : (
                        <View style={[styles.inputOther]}>
                          <TextInput
                            style={
                              selectedReasons === reason &&
                              styles.inputOtherSelected
                            }
                            placeholderTextColor={
                              selectedReasons === reason
                                ? COLORS.whiteA55
                                : COLORS.primary
                            }
                            value={customReason}
                            onChangeText={setCustomReason}
                            placeholder="Напишите причину"
                            numberOfLines={3}
                          />
                        </View>
                      )}
                    </View>
                  </Pressable>
                ))}
              </View>

              <View style={styles.controls}>
                <ButtonUI
                  style={[styles.btn]}
                  onPress={handleNext}
                  disabled={Boolean(!selectedReasons)}
                >
                  Далее
                </ButtonUI>
              </View>
            </View>
          </ScrollView>
        </View>
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
    fontSize: 18,
    marginBottom: 24,
    textAlign: "center",
  },
  reasonsList: {
    gap: 16,
  },
  reasonBlock: {
    width: "100%",
    minHeight: 90,
    backgroundColor: COLORS.bgGray,
    borderRadius: 12,
    padding: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  reasonBlockSelected: {
    borderColor: COLORS.white,
    backgroundColor: COLORS.green,
  },
  reasonContent: {
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 15,
  },
  reasonIcon: {
    width: 156,
    height: 176,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  reasonImage: {
    width: 130,
    height: 130,
  },
  reasonText: {
    fontSize: 16,
    maxWidth: 140,
  },
  reasonTextSelected: {
    color: COLORS.white,
  },
  customReasonContainer: {
    marginBottom: 24,
  },
  customReasonLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  customReasonInput: {
    minHeight: 80,
  },
  photosCount: {
    fontSize: 16,
    marginBottom: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
    justifyContent: "center",
  },
  photoContainer: {
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
  photoRequired: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 20,
    color: COLORS.red,
  },
  inputOther: {
    width: "100%",
  },
  inputOtherSelected: {
    color: COLORS.white,
  },
  controls: {
    gap: 12,
    marginTop: "auto",
  },
  btn: {
    marginBottom: 0,
  },
  sendBtn: {
    backgroundColor: COLORS.black,
  },
  btnDisabled: {
    opacity: 0.5,
  },
});

export default PauseScreen;
