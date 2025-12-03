import { baseStyle } from "@/constants/baseStyle";
import { COLORS } from "@/constants/colors";
import type { ObjectItem } from "@/types/objects/objects";
import { getFullPhotoUrl } from "@/utils/getFullPhotoUrl";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import TextUI from "../ui/Text/Text";

interface ObjectsListProps {
  objects: ObjectItem[];
  loading?: boolean;
  onRefresh?: () => Promise<void> | void;
}

const ObjectsList: React.FC<ObjectsListProps> = ({ objects, onRefresh }) => {
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: ObjectItem }) => {
    const { id, name, photo, zones_count, tasks_count, users_count } = item;

    return (
      <TouchableOpacity
        style={styles.objectItem}
        onPress={() => router.push(`/objects/${id}`)}
      >
        {photo ? (
          <View style={styles.pictureBlock}>
            <Image
              source={{ uri: getFullPhotoUrl(photo) }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ) : (
          <View style={styles.noPhoto}>
            <TextUI>🖼️ Фото не загружено</TextUI>
          </View>
        )}

        <View style={styles.content}>
          <TextUI fontWeight="semibold" style={styles.name}>
            {name}
          </TextUI>
          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <TextUI fontWeight="medium" style={styles.infoBlockTitle}>
                зоны:
              </TextUI>
              <TextUI fontWeight="medium">{zones_count}</TextUI>
            </View>
            <View style={styles.infoBlock}>
              <TextUI fontWeight="medium" style={styles.infoBlockTitle}>
                задания:
              </TextUI>
              <TextUI fontWeight="medium">{tasks_count}</TextUI>
            </View>
            <View style={[styles.infoBlock, styles.infoBlockLast]}>
              <TextUI fontWeight="medium" style={styles.infoBlockTitle}>
                сотрудники:
              </TextUI>
              <TextUI fontWeight="medium">{users_count}</TextUI>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={objects}
      numColumns={2}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      style={styles.list}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <TextUI fontWeight="semibold" style={baseStyle.caption}>
          Объекты
        </TextUI>
      } // заголовок для скролла вместе с обьектами
      columnWrapperStyle={styles.listRow}
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
  },
  listContent: {
    gap: 8,
    paddingHorizontal: 20,
  },
  listRow: {
    columnGap: 8,
    marginBottom: 16,
  },
  objectItem: {
    flexGrow: 0,
    flexBasis: "48%",
    backgroundColor: COLORS.bgGray,
    borderRadius: 14,
    overflow: "hidden",
  },
  pictureBlock: {
    height: 100,
    backgroundColor: "#f0f0f0",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  noPhoto: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eee",
  },
  content: {
    padding: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoRow: {
    alignItems: "flex-start",
    flex: 1,
    fontSize: 14,
  },
  infoBlock: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#90939C33",
    flex: 1,
    gap: 8,
    width: "100%",
  },
  infoBlockTitle: {
    opacity: 0.5,
  },
  infoBlockLast: {
    borderBottomWidth: 0,
  },
});

export default ObjectsList;
