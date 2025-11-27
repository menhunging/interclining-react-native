import Header from "@/components/Header/Header";
import { COLORS } from "@/constants/colors";
import { useAppSelector } from "@/store/store";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

const Objects = () => {
  const { isAuthenticated, userInfo } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // console.log("123");
  }, []);

  return (
    <View>
      <Header />
      <View>
        <Text>Обьекты {userInfo.login}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.white,
    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, // соответствует 0px 2px
    shadowOpacity: 0.1, // прозрачность (#0000001A ≈ 10%)
    shadowRadius: 8, // радиус размытия
    // Android
    elevation: 4, // подбирается экспериментально (≈ shadowRadius)
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerControls: {
    gap: 7,
    flexDirection: "row",
  },
  headerControlsInput: {
    backgroundColor: COLORS.bgGray,
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  btn: {
    marginTop: 50,
  },
  headerStatus: {
    flexDirection: "row",
    marginTop: 20,
  },
  headerStatusText: {
    fontSize: 14,
    fontFamily: "Manrope-SemiBold",
    color: COLORS.primary,
    backgroundColor: COLORS.bgGray,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});

export default Objects;
