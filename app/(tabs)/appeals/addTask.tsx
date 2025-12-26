import HeaderItem from "@/components/Header/HeaderItem";
import ButtonUI from "@/components/ui/Button/ButtonUI";
import IconDesc from "@/components/ui/Icons/IconDesc";
import Select from "@/components/ui/Select/Select";
import Tabs from "@/components/ui/Tabs/Tabs";
import TextUI from "@/components/ui/Text/Text";
import { COLORS } from "@/constants/colors";
import { TIME_OPTIONS } from "@/constants/constants";
import { getObjectById } from "@/store/slices/objectSlice";
import { addPlanner } from "@/store/slices/plannerSlice";
import { fetchUsers } from "@/store/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const AppealScreen = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();

  const { currentAppeal: appeal } = useAppSelector((state) => state.appeals);
  const { data: object } = useAppSelector((state) => state.object);

  const { id, objID } = useLocalSearchParams(); // получаем id из URL

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

  const handleDateChange = (event: DateTimePickerEvent, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleSave = () => {
    if (appeal && isFormValid()) {
      const payload = {
        id: null,

        name_object: "",

        name_zone: "",

        name_user: "",
        surname_user: "",

        status: 0,
        name_status: "",

        name_team: "",

        data_create: new Date().toISOString().split("T")[0], // Формат YYYY-MM-DD

        data_end: "",

        repeat_start: "",
        repeat_end: "",

        period: null,

        days: [],

        description: description,
        name: `Задача по обращению № ${id}`,
        id_object: String(appeal.id_object),
        id_zone: String(appeal.id_zone),
        id_user: String(selectedExecutor) || "",
        id_team: String(selectedTeam) || "",
        time_start: selectedStartTime,
        time_end: selectedEndTime,
        duration: selectedDuration,
        date: [selectedDate.toISOString().split("T")[0]],
        binding_appeal: Number(id),
      };

      dispatch(addPlanner(payload));
      router.dismissAll();
      router.replace(`/appeals/`);
    }
  };

  useEffect(() => {
    if (objID) {
      dispatch(getObjectById(objID));
      dispatch(fetchUsers());
    }
  }, [objID, dispatch]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.wrapper} edges={["top", "right", "left"]}>
        <View style={styles.container}>
          <View style={styles.headerWrapper}>
            <HeaderItem
              mode={"fullScreenModal"}
              name={"Создать задание"}
              desc={`Задача по обращению № ${id}`}
            />
          </View>

          <ScrollView
            style={styles.main}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.section}>
              <View style={styles.field}>
                <TextUI style={styles.fieldValue}>Название</TextUI>
                <TextUI style={styles.fieldContent} fontWeight="medium">
                  Задача по обращению № {id}
                </TextUI>
              </View>

              <View style={styles.field}>
                <TextUI style={styles.fieldValue}>Объект</TextUI>
                <TextUI style={styles.fieldContent}>
                  {appeal?.name_object}
                </TextUI>
              </View>

              <View style={styles.field}>
                <TextUI style={styles.fieldValue}>Зона</TextUI>
                <TextUI style={styles.fieldContent}>{appeal?.name_zone}</TextUI>
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
                  caption={selectedExecutor ? "Выбран" : "Выберите исполнителя"}
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
                <TextUI style={styles.taskCaptionText}>Дата выполнения</TextUI>
              </View>

              <View style={styles.dateBlock}>
                <TextUI
                  style={styles.dateBlockText}
                  onPress={() => setShowDatePicker(true)}
                >
                  {selectedDate.toLocaleDateString("ru-RU", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </TextUI>

                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "calendar"}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                    maximumDate={new Date(new Date().getFullYear(), 11, 31)}
                    themeVariant="light"
                    locale={Platform.OS === "ios" ? "ru_RU" : undefined}
                  />
                )}
              </View>

              <View style={styles.taskCaption}>
                <IconDesc />
                <TextUI style={styles.taskCaptionText}>Время выполнения</TextUI>
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
              Назначить
            </ButtonUI>
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    backgroundColor: COLORS.white,
    // iOS
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 }, // соответствует 0px 2px
    shadowOpacity: 0.1, // прозрачность (#0000001A ≈ 10%)
    shadowRadius: 8, // радиус размытия
    // Android
    elevation: 4, // подбирается экспериментально (≈ shadowRadius)
    paddingVertical: 20,
    paddingHorizontal: 20,
    zIndex: 5,
  },
  headerControls: {
    gap: 7,
    flexDirection: "row",
  },
  headerControlsInput: {
    backgroundColor: COLORS.bgGray,
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  btn: {
    marginTop: 50,
  },
  headerStatus: {
    flexDirection: "row",
    marginTop: 20,
  },
  headerStatusText: {
    fontSize: 14,
    fontFamily: "Manrope-SemiBold",
    color: COLORS.primary,
    backgroundColor: COLORS.bgGray,
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerWrapper: {
    position: "relative",
    zIndex: 10,
    elevation: 10,
    backgroundColor: COLORS.white,
  },
  main: {
    flex: 1,
    zIndex: 0,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingTop: 40,
    paddingBottom: 40,
  },

  wrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
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
  fieldContent: {
    fontSize: 16,
    color: COLORS.black,
    marginTop: 4,
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
  },

  dateBlockText: {
    backgroundColor: COLORS.bgGray,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: "row",
    alignSelf: "flex-start",
  },
});

export default AppealScreen;
