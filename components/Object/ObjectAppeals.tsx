import { baseStyle } from "@/constants/baseStyle";
import { COLORS } from "@/constants/colors";

import { ObjectItem } from "@/types/objects/objects";
import { formatDateTime } from "@/utils/formatDateTime";
import { StyleSheet, View } from "react-native";
import TextUI from "../ui/Text/Text";

interface ObjectAppealsProps {
  loading: boolean;
  appeals: ObjectItem["appeal"];
}

const ObjectAppeals: React.FC<ObjectAppealsProps> = ({ appeals, loading }) => {
  return (
    <View style={baseStyle.block}>
      <View>
        <TextUI fontWeight="semibold" style={baseStyle.caption}>
          Последние обращения
        </TextUI>
      </View>

      {loading ? (
        <View style={styles.appeals}>
          {[...Array(2)].map((_, index) => (
            <View key={index} style={styles.appeal}>
              <View style={[baseStyle.skeleton, { width: 100, height: 25 }]} />
              <View style={[baseStyle.skeleton, { width: 140, height: 22 }]} />
              <View
                style={[baseStyle.skeleton, { width: "100%", height: 19 }]}
              />
            </View>
          ))}
        </View>
      ) : appeals && appeals.length > 0 ? (
        <View style={styles.appeals}>
          {appeals.map((appeal, index) => (
            <View key={appeal.id || index} style={styles.appeal}>
              <TextUI style={styles.appealDate}>
                {formatDateTime(appeal.date_create)}
              </TextUI>
              <TextUI fontWeight="semibold" style={styles.appealName}>
                {appeal.name_zone}
              </TextUI>
              <TextUI style={styles.appealMessage}>{appeal.message}</TextUI>
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
  appeals: {
    width: "100%",
    gap: 13,
  },
  appeal: {
    backgroundColor: COLORS.bgGray,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  appealDate: {
    color: COLORS.gray,
    fontSize: 18,
  },
  appealName: {
    fontSize: 16,
  },
  appealMessage: {},
});

export default ObjectAppeals;
