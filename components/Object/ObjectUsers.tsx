import { baseStyle } from "@/constants/baseStyle";
import { COLORS } from "@/constants/colors";

import { ObjectItem } from "@/types/objects/objects";
import { StyleSheet, View } from "react-native";
import TextUI from "../ui/Text/Text";

interface ObjectUsersProps {
  loading: boolean;
  users: ObjectItem["users"];
}

const ObjectUsers: React.FC<ObjectUsersProps> = ({ users, loading }) => {
  return (
    <View style={baseStyle.block}>
      <View>
        <TextUI fontWeight="semibold" style={baseStyle.caption}>
          Сотрудники по объекту
        </TextUI>
      </View>

      {loading ? (
        <View style={styles.users}>
          {[...Array(2)].map((_, index) => (
            <View key={index} style={styles.user}>
              <View style={[baseStyle.skeleton, { width: 100, height: 22 }]} />
            </View>
          ))}
        </View>
      ) : users && users.length > 0 ? (
        <View style={styles.users}>
          {users.map((user, index) => (
            <View key={user.id || index} style={styles.user}>
              <TextUI style={styles.userName}>
                {user.name} {user.surname}
              </TextUI>
            </View>
          ))}
        </View>
      ) : (
        <TextUI fontWeight="semibold" style={baseStyle.emptyText}>
          Нет данных
        </TextUI>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  users: {
    width: "100%",
    gap: 13,
  },
  user: {
    backgroundColor: COLORS.bgGray,
    borderRadius: 12,
    padding: 8,
  },
  userName: {
    fontSize: 16,
  },
});

export default ObjectUsers;
