import AuthForm from "@/components/Auth/AuthForm";
import { COLORS } from "@/constants/colors";
import { StyleSheet, View } from "react-native";

const Auth: React.FC = () => {
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
