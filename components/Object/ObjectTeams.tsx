import { baseStyle } from "@/constants/baseStyle";
import { COLORS } from "@/constants/colors";

import { ObjectItem } from "@/types/objects/objects";
import { StyleSheet, View } from "react-native";
import TextUI from "../ui/Text/Text";

interface ObjectTeamsProps {
  loading: boolean;
  teams: ObjectItem["teams"];
}

const ObjectTeams: React.FC<ObjectTeamsProps> = ({ teams, loading }) => {
  return (
    <View style={baseStyle.block}>
      <View>
        <TextUI fontWeight="semibold" style={baseStyle.caption}>
          Статус команд по объекту
        </TextUI>
      </View>

      {loading ? (
        <View style={styles.teams}>
          {[...Array(2)].map((_, index) => (
            <View key={index} style={styles.team}>
              <View style={[baseStyle.skeleton, { width: 100, height: 22 }]} />
              <View style={[baseStyle.skeleton, { width: 60, height: 30 }]} />
            </View>
          ))}
        </View>
      ) : teams && teams.length > 0 ? (
        <View style={styles.teams}>
          {teams.map((team, index) => (
            <View key={team.id || index} style={styles.team}>
              <TextUI style={styles.teamName}>{team.name}</TextUI>
              <TextUI fontWeight="medium" style={styles.teamDesc}>
                <TextUI>{team.users.length}</TextUI>
                <TextUI style={styles.teamDescFull}>
                  /{team.users.length}
                </TextUI>
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
  teams: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    rowGap: 13,
    justifyContent: "space-between",
  },
  team: {
    justifyContent: "space-between",
    backgroundColor: COLORS.bgGray,
    borderRadius: 12,
    padding: 8,
    height: 74,
    flexGrow: 0,
    flexBasis: "48.5%",
  },
  teamName: {
    fontSize: 16,
  },
  teamDesc: {
    fontSize: 22,
  },
  teamDescFull: {
    opacity: 0.5,
  },
});

export default ObjectTeams;
