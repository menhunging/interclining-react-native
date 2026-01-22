import ButtonUI from "@/components/ui/Button/ButtonUI";
import FilterIcon from "@/components/ui/Icons/FilterIcon";
import { COLORS } from "@/constants/colors";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import FilterModal from "../FilterModal";
import IconSearch from "../ui/Icons/IocnSearch";

interface HeaderProps {
  onStatusPress?: (status: number) => void;
  activeStatus?: number;
  onFilterPress?: () => void;
  currentStatus?: number;
  currentFilters?: {
    id_object: string;
    id_zones: string;
    id_user: string;
    id_teams: string;
  };
  setCurrentFilters: (filters: {
    id_object: string;
    id_zones: string;
    id_user: string;
    id_teams: string;
  }) => void;
  searchText?: string;
  onSearchChange?: (text: string) => void;
}

const statusItems: {
  id: number;
  label: string;
  circleStyle: keyof typeof styles;
}[] = [
  { id: 10, label: "Не назначено", circleStyle: "planCircle" },
  { id: 1, label: "В работе", circleStyle: "inWorkCircle" },
  { id: 2, label: "Выполнено", circleStyle: "doneCircle" },
];

const HeaderAppeals: React.FC<HeaderProps> = ({
  onStatusPress,
  activeStatus = 1,
  currentFilters = { id_object: "", id_user: "", id_zones: "", id_teams: "" },
  setCurrentFilters,
  searchText = "",
  onSearchChange,
}) => {
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const handleFilterPress = () => {
    setFilterModalVisible(true);
  };

  const handleApplyFilters = (filters: {
    id_object: string;
    id_zones: string;
    id_user: string;
    id_teams: string;
  }) => {
    console.log("123", filters);

    setCurrentFilters && setCurrentFilters(filters);
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerControls}>
        <View style={styles.headerInputItem}>
          <View style={styles.headerInputItemIcon}>
            <IconSearch />
          </View>
          <TextInput
            style={styles.headerControlsInput}
            placeholder="Поиск..."
            placeholderTextColor="#1C1C1C"
            value={searchText}
            onChangeText={onSearchChange}
          />
        </View>
        <ButtonUI mode="btnIcon" onPress={handleFilterPress}>
          <FilterIcon />
        </ButtonUI>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false} // убираем полоску скролла
        contentContainerStyle={styles.headerStatus}
      >
        {statusItems.map(({ id, label, circleStyle }) => (
          <TouchableOpacity
            key={id}
            style={[
              styles.headerStatusText,
              activeStatus === id ? styles.activeStatus : undefined,
            ]}
            onPress={() => onStatusPress?.(id)}
          >
            <View style={[styles.beforeElement, styles[circleStyle]]} />
            <Text
              style={activeStatus === id ? { color: COLORS.white } : undefined}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleApplyFilters}
        initialFilters={currentFilters}
      />
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
    paddingLeft: 40,
    paddingRight: 20,
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
  inWorkCircle: { backgroundColor: "#2E5AEA" },
  doneCircle: { backgroundColor: "#68F35C" },
  pauseCircle: { backgroundColor: "#1E90FF" },
  skipCircle: { backgroundColor: "#F35C5C" },
  planCircle: { backgroundColor: "#777777" },
  beforeElement: {
    width: 12,
    height: 12,
    borderRadius: "50%",
  },
  beforeElementActive: {
    backgroundColor: COLORS.white,
  },
  headerInputItem: {
    flex: 1,
  },
  headerInputItemIcon: {
    position: "absolute",
    zIndex: 1,
    top: 12,
    left: 13,
  },
  activeStatus: {
    backgroundColor: COLORS.green,
    color: COLORS.white,
  },
});

export default HeaderAppeals;
