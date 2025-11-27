import Preloader from "@/components/ui/Preloader/Preloader";
import { COLORS } from "@/constants/colors";
import { STORAGE_KEYS } from "@/constants/constants";
import { authUser, logout } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Auth from "./auth";

const Index: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        const result = await dispatch(authUser());
        if (authUser.rejected.match(result)) {
          dispatch(logout());
        }
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/(tabs)/objects");
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
