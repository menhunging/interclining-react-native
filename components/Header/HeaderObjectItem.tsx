import { baseStyle } from "@/constants/baseStyle";
import { COLORS } from "@/constants/colors";
import { ObjectItem } from "@/types/objects/objects";
import { useNavigation } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import IconBack from "../ui/Icons/IconBack";

interface HeaderObjectItemProps {
  loading: boolean;
  obj: ObjectItem | null;
}

const HeaderObjectItem: React.FC<HeaderObjectItemProps> = ({
  obj,
  loading,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
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
              <Text style={styles.objectHeadName}>{obj?.name}</Text>
              <View style={styles.objectHeadZone}>
                <Text style={styles.objectHeadZoneTitle}>Зоны:</Text>
                <Text style={styles.countZone}>{obj?.zones_count}</Text>
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
    left: 0,
    top: 0,
    width: 35,
    height: 35,
  },
  objectHeadName: {},

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

export default HeaderObjectItem;
