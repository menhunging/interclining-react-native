import { COLORS } from "@/constants/colors";
import { authUser, logout } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Auth from "./auth";

const Index: React.FC = () => {
  const { isAuthenticated, userInfo } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      console.log("checkAuth");

      const token = await AsyncStorage.getItem("token");
      if (token) {
        try {
          console.log("authUser");
          dispatch(authUser());
        } catch {
          console.log("logout");
          dispatch(logout());
        }
      }
    };

    checkAuth();

    if (isAuthenticated) {
      router.replace("/(tabs)/objects");
    }
  }, [isAuthenticated, dispatch]);

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
});

export default Index;
