import AuthForm from "@/components/Auth/AuthForm";
import { COLORS } from "@/constants/colors";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

const Auth: React.FC = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const router = useRouter();

  //   useEffect(() => {
  //     if (isAuthenticated) {
  //       dispatch(authUser());
  //       //   router.replace("/(tabs)/objects");
  //     }
  //   }, [isAuthenticated, dispatch]);

  return (
    <View style={styles.root}>
      <AuthForm />
    </View>
  );
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

export default Auth;
