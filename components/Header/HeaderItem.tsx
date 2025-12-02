import { baseStyle } from "@/constants/baseStyle";
import { COLORS } from "@/constants/colors";
import { useNavigation } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";
import IconBack from "../ui/Icons/IconBack";
import TextUI from "../ui/Text/Text";

interface HeaderItem {
  mode?: "fullScreenModal" | "default";
  loading?: boolean;
  name: string | null;
  desc: string | null;
}

const HeaderItem: React.FC<HeaderItem> = ({ name, desc, loading, mode }) => {
  const navigation = useNavigation();

  return (
    <View
      style={
        mode === "fullScreenModal"
          ? [styles.header, styles.headerFull]
          : styles.header
      }
    >
      <View style={styles.headerControls}>
        <View style={styles.objectHead}>
          <Pressable
            style={styles.objectHeadIcon}
            onPress={() => navigation.goBack()}
          >
            <IconBack />
          </Pressable>
          {loading ? (
            <>
              <View
                style={[baseStyle.skeleton, { width: 120, height: 16.5 }]}
              />
              <View style={[baseStyle.skeleton, { width: 80, height: 16.5 }]} />
            </>
          ) : (
            <>
              <TextUI fontWeight="medium" style={styles.objectHeadName}>
                {name}
              </TextUI>
              <View style={styles.objectHeadZone}>
                {mode === "fullScreenModal" ? (
                  <TextUI style={styles.objectHeadZoneTitle}>{desc}</TextUI>
                ) : (
                  <>
                    <TextUI style={styles.objectHeadZoneTitle}>Зоны:</TextUI>
                    <TextUI style={styles.countZone}>{desc}</TextUI>
                  </>
                )}
              </View>
            </>
          )}
        </View>
        {/* <ButtonUI mode="btnIcon">
          <FilterIcon />
        </ButtonUI> */}
      </View>
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
  headerFull: {
    // iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 7 }, // соответствует 0px 2px
    shadowOpacity: 0.08, // прозрачность (#0000001A ≈ 10%)
    shadowRadius: 5, // радиус размытия
    // Android
    elevation: 4, // подбирается экспериментально (≈ shadowRadius)
  },
  headerControls: {
    gap: 7,
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  objectHead: {
    gap: 8,
    paddingLeft: 35,
  },
  objectHeadIcon: {
    position: "absolute",
    left: -20,
    top: 0,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  objectHeadName: {
    fontSize: 18,
  },

  objectHeadZone: {
    flexDirection: "row",
    gap: 5,
  },
  objectHeadZoneTitle: {
    opacity: 0.5,
  },
  countZone: {
    fontWeight: 500,
  },
});

export default HeaderItem;
