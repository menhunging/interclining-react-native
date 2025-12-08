import HeaderItem from "@/components/Header/HeaderItem";
import ButtonUI from "@/components/ui/Button/ButtonUI";
import IconDesc from "@/components/ui/Icons/IconDesc";
import Select from "@/components/ui/Select/Select";
import Tabs from "@/components/ui/Tabs/Tabs";
import TextUI from "@/components/ui/Text/Text";
import { COLORS } from "@/constants/colors";
import { TIME_OPTIONS } from "@/constants/constants";
import { getObjectById } from "@/store/slices/objectSlice";
import { editTaskByID } from "@/store/slices/tasksSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const TaskEditScreen: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { data: object } = useAppSelector((state) => state.object);
  const { task } = useAppSelector((state) => state.tasks);

  const [description, setDescription] = useState("");
  const [selectedExecutor, setSelectedExecutor] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedStartTime, setSelectedStartTime] = useState("");
  const [selectedEndTime, setSelectedEndTime] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [activeTab, setActiveTab] = useState<"Исполнитель" | "Команда">(
    "Исполнитель"
  );

  const executors =
    object?.users?.map((user) => ({
      label: `${user.name} ${user.surname}`,
      value: user.id?.toString() || "",
    })) || [];

  const teams =
    object?.teams?.map((team) => ({
      label: team.name,
      value: team.id?.toString() || "",
    })) || [];

  const endTimeOptions = selectedStartTime
    ? TIME_OPTIONS.filter((option) => option.value >= selectedStartTime)
    : TIME_OPTIONS;

  const durationOptions = [
    { label: "20 мин", value: "20" },
    { label: "30 мин", value: "30" },
    { label: "40 мин", value: "40" },
    { label: "50 мин", value: "50" },
    { label: "60 мин", value: "60" },
    { label: "80 мин", value: "80" },
  ];

  const isFormValid = () => {
    const hasExecutorOrTeam =
      (selectedExecutor && !selectedTeam) ||
      (!selectedExecutor && selectedTeam);
    const hasTimeFields =
      selectedStartTime && selectedEndTime && selectedDuration;
    const hasDescription = description.trim().length > 0;
    const hasDate = selectedDate !== null;

    return hasExecutorOrTeam && hasTimeFields && hasDescription && hasDate;
  };

  const handleSave = () => {
    if (task && isFormValid()) {
      const payload = {
        id: task.id,
        description,
        id_user: selectedExecutor,
        id_team: selectedTeam,
        time_start: selectedStartTime,
        time_end: selectedEndTime,
        duration: selectedDuration,
        date_start: selectedDate.toISOString().split("T")[0], // Формат YYYY-MM-DD
      };

      dispatch(editTaskByID(payload));
      router.dismissAll();
      router.replace(`/tasks/`);
    }
  };

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  useEffect(() => {
    if (task) {
      setDescription(task.description);
      setSelectedExecutor(task.id_user?.toString() || "");
      setSelectedTeam(task.id_team?.toString() || "");
      setSelectedStartTime(task.time_start?.slice(0, -3) || "");
      setSelectedEndTime(task.time_end?.slice(0, -3) || "");
      setSelectedDuration(task.duration?.toString() || "");
      setSelectedDate(task.date_start ? new Date(task.date_start) : new Date());
    }
  }, [task]);

  useEffect(() => {
    if (!object) {
      dispatch(getObjectById(String(task?.id_object)));
    }
  }, [object, dispatch]);

  useEffect(() => {
    if (activeTab === "Исполнитель") {
      setSelectedTeam("");
    } else if (activeTab === "Команда") {
      setSelectedExecutor("");
    }
  }, [activeTab]);

  useEffect(() => {
    if (
      selectedStartTime &&
      selectedEndTime &&
      selectedStartTime >= selectedEndTime
    ) {
      if (selectedEndTime <= selectedStartTime) {
        setSelectedEndTime("");
      }
    }
  }, [selectedStartTime, selectedEndTime]);

  if (task) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.wrapper} edges={["top", "right", "left"]}>
          <View style={styles.container}>
            <View style={styles.headerWrapper}>
              <HeaderItem
                edit={true}
                mode={"fullScreenModal"}
                name={"Задача"}
                desc={"Редактирование задачи"}
              />
            </View>

            <ScrollView
              style={styles.main}
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.section}>
                <View style={styles.taskCaption}>
                  <IconDesc />
                  <TextUI style={styles.taskCaptionText}>
                    Информация об объекте
                  </TextUI>
                </View>

                <View style={styles.field}>
                  <TextUI style={styles.fieldValue}>{task.name_object}</TextUI>
                </View>

                <View style={styles.field}>
                  <TextUI style={styles.fieldValue}>{task.name_zone}</TextUI>
                </View>

                <Tabs
                  options={["Исполнитель", "Команда"]}
                  active={activeTab}
                  onChange={(value) => {
                    setActiveTab(value as "Исполнитель" | "Команда");
                  }}
                />

                {activeTab === "Исполнитель" && (
                  <Select
                    style={styles.field}
                    caption={
                      selectedExecutor ? "Выбран" : "Выберите исполнителя"
                    }
                    options={executors}
                    selectedValue={selectedExecutor}
                    onValueChange={setSelectedExecutor}
                    placeholder="Не назначен"
                  />
                )}

                {activeTab === "Команда" && (
                  <Select
                    style={styles.field}
                    caption={
                      selectedTeam ? "Команда выбрана" : "Выберите команду"
                    }
                    options={teams}
                    selectedValue={selectedTeam}
                    onValueChange={setSelectedTeam}
                    placeholder="Не назначен"
                  />
                )}
              </View>

              <View style={styles.section}>
                <View style={styles.taskCaption}>
                  <IconDesc />
                  <TextUI style={styles.taskCaptionText}>Описание</TextUI>
                </View>
                <TextInput
                  style={styles.textInput}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Введите описание задачи"
                  multiline
                />
              </View>

              <View style={styles.section}>
                <View style={styles.taskCaption}>
                  <IconDesc />
                  <TextUI style={styles.taskCaptionText}>
                    Дата выполнения
                  </TextUI>
                </View>

                <View style={styles.dateBlock}>
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                    locale="ru-RU"
                    textColor="#1C1C1C"
                  />
                </View>

                <View style={styles.taskCaption}>
                  <IconDesc />
                  <TextUI style={styles.taskCaptionText}>
                    Время выполнения
                  </TextUI>
                </View>

                <Select
                  style={styles.field}
                  caption={"Начало"}
                  options={TIME_OPTIONS}
                  selectedValue={selectedStartTime}
                  onValueChange={setSelectedStartTime}
                  placeholder="Выберите время"
                />

                <Select
                  style={styles.field}
                  caption={"Окончание"}
                  options={endTimeOptions}
                  selectedValue={selectedEndTime}
                  onValueChange={setSelectedEndTime}
                  placeholder="Выберите время"
                />

                <Select
                  style={styles.field}
                  caption={"Длительность"}
                  options={durationOptions}
                  selectedValue={selectedDuration}
                  onValueChange={setSelectedDuration}
                  placeholder="Выберите длительность"
                />
              </View>

              <ButtonUI
                style={styles.saveButton}
                onPress={handleSave}
                disabled={!isFormValid()}
              >
                Сохранить
              </ButtonUI>
            </ScrollView>
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  headerWrapper: {
    position: "relative",
    zIndex: 10,
    backgroundColor: COLORS.white,
  },
  main: {
    flex: 1,
    zIndex: 0,
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    marginBottom: 24,
  },
  field: {
    backgroundColor: COLORS.bgGray,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  fieldLabel: {
    fontSize: 14,
    color: COLORS.tabNotActiveColor,
  },
  fieldValue: {
    fontSize: 16,
    color: COLORS.black,
    opacity: 0.7,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.bgGray,
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    fontSize: 16,
    fontFamily: "Manrope-Regular",
  },

  saveButton: {},

  taskCaption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },

  taskCaptionText: {
    color: COLORS.green,
  },

  dateField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: COLORS.bgGray,
    borderRadius: 8,
    overflow: "hidden",
  },

  selectedText: {
    fontSize: 16,
    color: COLORS.primary,
  },

  arrow: {
    marginLeft: 8,
  },

  arrowText: {
    fontSize: 12,
    color: COLORS.tabNotActiveColor,
  },

  dateBlock: {
    marginBottom: 16,
    color: COLORS.primary,
  },
});

export default TaskEditScreen;
