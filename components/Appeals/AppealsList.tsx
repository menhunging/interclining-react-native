import { COLORS } from "@/constants/colors";
import { useAppSelector } from "@/store/store";
import { Appeal } from "@/types/appeals/appeals";
import { checkRoleAdmin } from "@/utils/checkRoleAdmin";
import { formatDateTime } from "@/utils/formatDateTime";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import IconArrowRight from "../ui/Icons/IconArrowRight";
import TextUI from "../ui/Text/Text";

interface AppealsListProps {
  appeals: Appeal[];
  loading?: boolean;
  onRefresh?: () => Promise<void> | void;
}

const AppealsList: React.FC<AppealsListProps> = ({ appeals, onRefresh }) => {
  const router = useRouter();

  const { userInfo } = useAppSelector((state) => state.auth);

  const isAdmin = checkRoleAdmin(Number(userInfo.role));

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Appeal }) => {
    const { id, name_zone, name_object, message, date_create, status } = item;

    return (
      <TouchableOpacity
        style={[styles.appeals]}
        onPress={() => {
          router.push(`/appeals/${id}`);
        }}
      >
        <View style={styles.appealsDates}>
          <TextUI fontWeight="medium" style={styles.appealsDatesStart}>
            {formatDateTime(date_create)}
          </TextUI>
          <View style={styles.appealStatus}>
            {status === null && <View style={styles.statusOne}></View>}
            {status === 2 && <View style={styles.statusSuccess}></View>}
            {status === 1 && <View style={styles.statusTwo}></View>}
          </View>
          <View style={styles.appealsIconArrowRight}>
            <IconArrowRight />
          </View>
        </View>
        <View style={styles.appealPausedRow}>
          <TextUI fontWeight="semibold" style={styles.title}>
            Обьект:
          </TextUI>
          <TextUI fontWeight="semibold" style={styles.name}>
            {name_object}
          </TextUI>
        </View>
        <TextUI fontWeight="medium" style={styles.title}>
          Зона:
        </TextUI>
        <TextUI fontWeight="semibold" style={styles.name}>
          {name_zone}
        </TextUI>
        <TextUI fontWeight="medium" style={styles.text}>
          {message}
        </TextUI>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={appeals}
      numColumns={1}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={handleRefresh}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    width: "100%",
    backgroundColor: COLORS.white,
    paddingVertical: 20,
  },

  listContent: {
    gap: 8,
    paddingBottom: 20,
  },

  appeals: {
    padding: 12,
    backgroundColor: COLORS.bgGray,
    borderRadius: 14,
    gap: 8,
    borderWidth: 2,
    borderColor: COLORS.bgGray,
  },

  appealsDates: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  appealsDatesStart: {
    borderRadius: 50,
    fontSize: 18,
  },

  appealsDatesEnd: {
    backgroundColor: COLORS.white,
    color: COLORS.black,
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    fontSize: 18,
    // iOS
    shadowColor: "#0000001A", // цвет тени
    shadowOffset: { width: -1, height: 1 }, // смещение
    shadowOpacity: 1, // прозрачность (0–1)
    shadowRadius: 6, // радиус размытия
    // Android
    elevation: 4, // подбирается экспериментально
  },

  appealsDatesEndText: {
    fontSize: 18,
  },

  title: {
    color: COLORS.tabNotActiveColor,
    fontSize: 16,
  },

  name: {
    color: COLORS.primary,
    fontSize: 18,
  },

  text: {
    color: COLORS.primary,
    fontSize: 16,
  },

  appealsIconArrowRight: {
    marginLeft: "auto",
  },

  appealPausedRow: {
    gap: 8,
  },

  appealStatus: {},

  statusOne: {
    backgroundColor: "#777777",
    borderRadius: "50%",
    width: 12,
    height: 12,
  },

  statusTwo: {
    backgroundColor: "#5C7FF3",
    borderRadius: "50%",
    width: 12,
    height: 12,
  },
  statusSuccess: {
    backgroundColor: "#68F35C",
    borderRadius: "50%",
    width: 12,
    height: 12,
  },
});

export default AppealsList;
