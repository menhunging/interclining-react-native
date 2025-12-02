import HeaderObjectItem from "@/components/Header/HeaderObjectItem";
import ObjectAppeals from "@/components/Object/ObjectAppeals";
import ObjectTeams from "@/components/Object/ObjectTeams";
import ObjectUsers from "@/components/Object/ObjectUsers";
import Preloader from "@/components/ui/Preloader/Preloader";
import { COLORS } from "@/constants/colors";
import { getObjectById } from "@/store/slices/objectSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const ObjectScreen = () => {
  const dispatch = useAppDispatch();
  const { loading, data: obj, error } = useAppSelector((state) => state.object);

  const { id } = useLocalSearchParams(); // получаем id из URL

  useEffect(() => {
    if (id) {
      dispatch(getObjectById(id));
      // dispatch(fetchUsers());
    }
  }, [id, dispatch]);

  if (!obj) {
    return <Preloader />;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <HeaderObjectItem obj={obj} loading={loading} />
        </View>
        <ScrollView
          style={styles.main}
          contentContainerStyle={styles.scrollContent}
        >
          <ObjectTeams teams={obj.teams} loading={loading} />
          <ObjectUsers users={obj.users} loading={loading} />
          <ObjectAppeals appeals={obj.appeal} loading={loading} />
        </ScrollView>
      </View>
    );
  }
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
  scrollContent: {
    paddingBottom: 40,
  },
});

export default ObjectScreen;
