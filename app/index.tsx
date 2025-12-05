import Preloader from "@/components/ui/Preloader/Preloader";
import { COLORS } from "@/constants/colors";
import useCheckAuth from "@/hook/useCheckAuth";
import { useAppSelector } from "@/store/store";
import { checkRoleAdmin } from "@/utils/checkRoleAdmin";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Auth from "./auth";

const Index: React.FC = () => {
  const { isAuthenticated, userInfo } = useAppSelector((state) => state.auth);
  const { taskId, isRunning, loading } = useAppSelector(
    (state) => state.activeTask
  );

  const isCheckingAuth = useCheckAuth();

  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      checkRoleAdmin(Number(userInfo.role))
        ? router.replace("/(tabs)/objects")
        : router.replace("/(tabs)/tasks");
    }
  }, [isAuthenticated, router]);

  if (isCheckingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <Preloader />
      </View>
    );
  }

  return <Auth />;
};

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
});

export default Index;
