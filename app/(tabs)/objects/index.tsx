import ObjectsList from "@/components/Objects/ObjectsList";
import { COLORS } from "@/constants/colors";
import { getObjects } from "@/store/slices/objectsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { checkRoleAdmin } from "@/utils/checkRoleAdmin";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

const Objects = () => {
  const { DATA: objects } = useAppSelector((state) => state.objects);
  const { userInfo } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isAdmin = checkRoleAdmin(Number(userInfo.role));

  const fetchObjects = async () => {
    await dispatch(getObjects());
  };

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/(tabs)/tasks");
      return;
    }
    fetchObjects();
  }, [dispatch, isAdmin, router]);

  return (
    <View style={styles.container}>
      {/* <View style={styles.headerWrapper}>
        <Header />
      </View> */}
      <View style={styles.main}>
        <ObjectsList objects={objects} onRefresh={fetchObjects} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.white,
    // iOS
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 }, // соответствует 0px 2px
    shadowOpacity: 0.1, // прозрачность (#0000001A ≈ 10%)
    shadowRadius: 8, // радиус размытия
    // Android
    elevation: 4, // подбирается экспериментально (≈ shadowRadius)
    paddingVertical: 20,
    paddingHorizontal: 20,
    zIndex: 5,
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
  headerWrapper: {
    position: "relative",
    zIndex: 10,
    elevation: 10,
    backgroundColor: COLORS.white,
  },
  main: {
    flex: 1,
    zIndex: 0,
  },
});

export default Objects;
