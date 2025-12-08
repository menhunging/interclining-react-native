import ButtonUI from "@/components/ui/Button/ButtonUI";
import IconBigCheckCircle from "@/components/ui/Icons/IconBigCheckCircle";
import TextUI from "@/components/ui/Text/Text";
import { COLORS } from "@/constants/colors";
import { completeTask } from "@/store/slices/activeTaskSlice";
import { useAppDispatch } from "@/store/store";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const SuccessScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleGoBack = async () => {
    // очищаем активную задачу
    await dispatch(completeTask());
    // закрываем все модальные экраны (success, finish, [id])
    router.dismissAll();
    router.replace(`/tasks/`);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.wrapper} edges={["top", "right", "left"]}>
        <View style={styles.container}>
          <View style={styles.main}>
            <View style={styles.content}>
              <View style={styles.successIcon}>
                <IconBigCheckCircle />
              </View>

              <TextUI fontWeight="medium" style={styles.title}>
                Задание выполнено!
              </TextUI>

              <View style={styles.controls}>
                <ButtonUI style={styles.btn} onPress={handleGoBack}>
                  Вернуться к задачам
                </ButtonUI>
              </View>
            </View>
          </View>
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
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    marginBottom: 30,
    color: COLORS.green,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: "center",
    marginBottom: 20,
  },
  controls: {
    width: "100%",
    maxWidth: 300,
  },
  btn: {
    marginBottom: 0,
  },
});

export default SuccessScreen;
