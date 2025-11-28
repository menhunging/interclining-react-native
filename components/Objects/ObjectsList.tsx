import { COLORS } from "@/constants/colors";
import type { ObjectItem } from "@/types/objects/objects";
import { getFullPhotoUrl } from "@/utils/getFullPhotoUrl";
import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ObjectsListProps {
  objects: ObjectItem[];
  loading?: boolean;
}

const ObjectsList: React.FC<ObjectsListProps> = ({ objects }) => {
  const router = useRouter();

  const renderItem = ({ item }: { item: ObjectItem }) => {
    const { id, name, photo, zones_count, tasks_count, users_count } = item;

    return (
      <TouchableOpacity
        style={styles.objectItem}
        onPress={() => router.push(`/objects/${id}`)} // ✅ переход
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
            <Text>🖼️ Фото не загружено</Text>
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.name}>{name}</Text>
          <View style={styles.infoRow}>
            <View style={styles.infoBlock}>
              <Text>зоны:</Text>
              <Text style={styles.bold}>{zones_count}</Text>
            </View>
            <View style={styles.infoBlock}>
              <Text>задания:</Text>
              <Text style={styles.bold}>{tasks_count}</Text>
            </View>
            <View style={[styles.infoBlock, styles.infoBlockLast]}>
              <Text>сотрудники:</Text>
              <Text style={styles.bold}>{users_count}</Text>
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
      columnWrapperStyle={styles.listRow}
      showsVerticalScrollIndicator={false}
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
    padding: 20,
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
  bold: {
    fontWeight: "500",
  },
  infoBlockLast: {
    borderBottomWidth: 0,
  },
});

export default ObjectsList;
