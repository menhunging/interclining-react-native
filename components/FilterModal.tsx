import ButtonUI from "@/components/ui/Button/ButtonUI";
import { COLORS } from "@/constants/colors";
import { getObjectById } from "@/store/slices/objectSlice";
import { getObjects } from "@/store/slices/objectsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { checkRoleAdmin } from "@/utils/checkRoleAdmin";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TextUI from "./ui/Text/Text";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: {
    id_object: string;
    id_zones: string;
    id_user: string;
    id_teams: string;
  }) => void;
  initialFilters?: {
    id_object: string;
    id_zones: string;
    id_user: string;
    id_teams: string;
  };
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
  initialFilters = {
    id_object: "",
    id_zones: "",
    id_user: "",
    id_teams: "",
  },
}) => {
  const dispatch = useAppDispatch();

  const [selectedObjects, setSelectedObjects] = useState<string>(
    initialFilters.id_object
  );

  const [selectedZones, setSelectedZones] = useState<string>(
    initialFilters.id_zones
  );

  const [selectedUsers, setSelectedUsers] = useState<string>(
    initialFilters.id_user
  );

  const [selectedTeams, setSelectedTeams] = useState<string>(
    initialFilters.id_teams
  );

  const { DATA: tasks } = useAppSelector((state) => state.tasks);
  const { userInfo } = useAppSelector((state) => state.auth);
  const { DATA: objects } = useAppSelector((state) => state.objects);
  const { data: object, loading: loadObjectItem } = useAppSelector(
    (state) => state.object
  );

  const isAdmin = checkRoleAdmin(Number(userInfo.role));

  const handleApply = () => {
    onApply({
      id_object: selectedObjects,
      id_zones: selectedZones,
      id_user: selectedUsers,
      id_teams: selectedTeams,
    });
    onClose();
  };

  const handleClear = () => {
    setSelectedTeams("");
    setSelectedUsers("");
    setSelectedZones("");
    setSelectedObjects("");
    onClose();
  };

  const fetchObjects = async () => {
    await dispatch(getObjects());
  };

  const fetchObjItem = async () => {
    if (isAdmin) {
      await dispatch(getObjectById(selectedObjects));
    } else {
      await dispatch(getObjectById(String(tasks[0]?.id_object)));
    }
  };

  useEffect(() => {
    if (visible) {
      fetchObjects();
    }
  }, [dispatch]);

  useEffect(() => {
    if (visible) {
      fetchObjItem();
    }
  }, [visible, selectedObjects, dispatch]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TextUI style={styles.title} fontWeight="medium">
            Фильтры
          </TextUI>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {isAdmin && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Объекты</Text>
              <View style={styles.itemsContainer}>
                <TouchableOpacity
                  key={0}
                  style={[
                    styles.filterItem,
                    selectedObjects === "" && styles.filterItemSelected,
                  ]}
                  onPress={() => setSelectedObjects("")}
                >
                  <TextUI
                    style={[
                      styles.filterItemText,
                      selectedObjects === "" && styles.filterItemTextSelected,
                    ]}
                    fontWeight="medium"
                  >
                    Все
                  </TextUI>
                </TouchableOpacity>
                {objects.map((obj) => (
                  <TouchableOpacity
                    key={obj.id}
                    style={[
                      styles.filterItem,
                      selectedObjects === obj.id && styles.filterItemSelected,
                    ]}
                    onPress={() => setSelectedObjects(obj.id)}
                  >
                    <TextUI
                      style={[
                        styles.filterItemText,
                        // selectedObjects.includes(obj.id) &&
                        selectedObjects === obj.id &&
                          styles.filterItemTextSelected,
                      ]}
                      fontWeight="medium"
                    >
                      {obj.name}
                    </TextUI>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* если под админом то выводим только тогда когда выбран обьект и если не под админом выводим из обьекта который достаем из первого tasks */}
          {!loadObjectItem && ((isAdmin && selectedObjects) || !isAdmin) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Зоны</Text>

              {object?.zones ? (
                <View style={styles.itemsContainer}>
                  {object?.zones.map((zone) => (
                    <TouchableOpacity
                      key={zone.id_zone}
                      style={[
                        styles.filterItem,
                        selectedZones === String(zone.id_zone) &&
                          styles.filterItemSelected,
                      ]}
                      onPress={
                        selectedZones === String(zone.id_zone)
                          ? () => setSelectedZones(String(""))
                          : () => setSelectedZones(String(zone.id_zone))
                      }
                    >
                      <TextUI
                        style={[
                          styles.filterItemText,
                          selectedZones === String(zone.id_zone) &&
                            styles.filterItemTextSelected,
                        ]}
                        fontWeight="medium"
                      >
                        {zone.name_zone}
                      </TextUI>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <TextUI>В этом обьекте нет зон</TextUI>
              )}
            </View>
          )}

          {selectedObjects && !loadObjectItem && isAdmin && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Команды</Text>
              {object?.users ? (
                <View style={styles.itemsContainer}>
                  {object?.teams.map((team) => (
                    <TouchableOpacity
                      key={team.id}
                      style={[
                        styles.filterItem,
                        selectedTeams === String(team.id) &&
                          styles.filterItemSelected,
                      ]}
                      onPress={
                        selectedTeams === String(team.id)
                          ? () => setSelectedTeams(String(""))
                          : () => setSelectedTeams(String(team.id))
                      }
                    >
                      <TextUI
                        style={[
                          styles.filterItemText,
                          selectedTeams === String(team.id) &&
                            styles.filterItemTextSelected,
                        ]}
                        fontWeight="medium"
                      >
                        {team.name}
                      </TextUI>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <TextUI>В этом обьекте нет команды</TextUI>
              )}
            </View>
          )}

          {selectedObjects && !loadObjectItem && isAdmin && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Сотрудники</Text>
              {object?.users ? (
                <View style={styles.itemsContainer}>
                  {object?.users.map((user) => (
                    <TouchableOpacity
                      key={user.id}
                      style={[
                        styles.filterItem,
                        selectedUsers === String(user.id) &&
                          styles.filterItemSelected,
                      ]}
                      onPress={
                        selectedUsers === String(user.id)
                          ? () => setSelectedUsers(String(""))
                          : () => setSelectedUsers(String(user.id))
                      }
                    >
                      <TextUI
                        style={[
                          styles.filterItemText,
                          selectedUsers === String(user.id) &&
                            styles.filterItemTextSelected,
                        ]}
                        fontWeight="medium"
                      >
                        {user.name} {user.surname}
                      </TextUI>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                <TextUI>В этом обьекте нет сотрудников</TextUI>
              )}
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <ButtonUI onPress={handleClear} style={styles.btnClear}>
            <TextUI style={styles.btnClearText}>
              ✕ &nbsp; Очистить фильтры
            </TextUI>
          </ButtonUI>
          <ButtonUI onPress={handleApply}>Применить фильтр</ButtonUI>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    right: 10,
    bottom: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: COLORS.primary,
  },
  title: {
    fontSize: 20,
    color: COLORS.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: COLORS.primary,
    marginBottom: 12,
  },
  itemsContainer: {
    gap: 8,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORS.bgGray,
    backgroundColor: COLORS.bgGray,
  },
  filterItemSelected: {
    backgroundColor: COLORS.black,
    color: COLORS.white,
  },
  filterItemText: {
    fontSize: 16,
    color: COLORS.primary,
  },
  filterItemTextSelected: {
    backgroundColor: COLORS.black,
    color: COLORS.white,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 34,
    paddingTop: 16,
    borderTopColor: COLORS.bgGray,
  },
  btnClear: {
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  btnClearText: {
    color: COLORS.primary,
  },
});

export default FilterModal;
