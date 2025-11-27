import ButtonUI from "@/components/ui/Button/ButtonUI";
import FilterIcon from "@/components/ui/Icons/FilterIcon";
import { COLORS } from "@/constants/colors";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const Header = () => {
  return (
    <View style={styles.header}>
      <View style={styles.headerControls}>
        <TextInput style={styles.headerControlsInput} placeholder="Search..." />
        <ButtonUI mode="btnIcon">
          <FilterIcon />
        </ButtonUI>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false} // убираем полоску скролла
        contentContainerStyle={styles.headerStatus}
      >
        <View style={[styles.headerStatusText]}>
          <View style={[styles.beforeElement, styles.inWorkCircle]} />
          <Text>В работе</Text>
        </View>
        <View style={[styles.headerStatusText]}>
          <View style={[styles.beforeElement, styles.doneCircle]} />
          <Text>Выполнено</Text>
        </View>
        <View style={[styles.headerStatusText]}>
          <View style={[styles.beforeElement, styles.pauseCircle]} />
          <Text> На паузе</Text>
        </View>
        <View style={[styles.headerStatusText]}>
          <View style={[styles.beforeElement, styles.skipCircle]} />
          <Text>Пропуск</Text>
        </View>
        <View style={[styles.headerStatusText]}>
          <View style={[styles.beforeElement, styles.planCircle]} />
          <Text>Плановые</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.white,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    paddingTop: 20,
    paddingBottom: 20,
    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, // соответствует 0px 2px
    shadowOpacity: 0.1, // прозрачность (#0000001A ≈ 10%)
    shadowRadius: 8, // радиус размытия
    // Android
    elevation: 4, // подбирается экспериментально (≈ shadowRadius)
  },
  headerControls: {
    gap: 7,
    flexDirection: "row",
    paddingHorizontal: 20,
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
    gap: 8,
    paddingHorizontal: 20,
  },
  headerStatusText: {
    fontSize: 14,
    fontFamily: "Manrope-SemiBold",
    color: COLORS.primary,
    backgroundColor: COLORS.bgGray,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    flexDirection: "row",
    gap: 5,
  },
  inWorkCircle: {
    backgroundColor: "#2E5AEA",
  },
  doneCircle: {
    backgroundColor: "#68F35C",
  },
  pauseCircle: {
    backgroundColor: "#1E90FF",
  },
  skipCircle: {
    backgroundColor: "#F35C5C",
  },
  planCircle: {
    backgroundColor: "#8A2BE2",
  },
  beforeElement: {
    width: 12,
    height: 12,
    borderRadius: "50%",
  },
});

export default Header;
