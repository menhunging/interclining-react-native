import Header from "@/components/Header/Header";
import TasksList from "@/components/Tasks/TasksList";
import ButtonUI from "@/components/ui/Button/ButtonUI";
import Preloader from "@/components/ui/Preloader/Preloader";
import TextUI from "@/components/ui/Text/Text";
import { baseStyle } from "@/constants/baseStyle";
import { COLORS } from "@/constants/colors";
import { authUser } from "@/store/slices/authSlice";
import { getTasksAll, getTasksUser } from "@/store/slices/tasksSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { checkRoleAdmin } from "@/utils/checkRoleAdmin";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

const Tasks = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { scannedZoneId } = useLocalSearchParams<{ scannedZoneId?: string }>();

  const [initialized, setInitialized] = useState(false);

  const { DATA: tasks } = useAppSelector((state) => state.tasks);

  const { userInfo, isAuthenticated } = useAppSelector((state) => state.auth);

  const [currentStatus, setCurrentStatus] = useState<number>(1); // по умолчанию статус "В работе"
  const [currentFilters, setCurrentFilters] = useState({
    id_object: "",
    id_user: "",
    id_zones: "",
    id_teams: "",
  });

  const scannedZoneIdValue = Array.isArray(scannedZoneId)
    ? scannedZoneId[0]
    : scannedZoneId;

  const [searchText, setSearchText] = useState("");

  const handleSetCurrentFilters = (filters: {
    id_object: string;
    id_zones: string;
    id_user: string;
    id_teams: string;
  }) => {
    const isClearFilters =
      !filters.id_object &&
      !filters.id_zones &&
      !filters.id_user &&
      !filters.id_teams;

    setCurrentFilters(filters);

    if (isClearFilters) {
      setSearchText("");

      if (scannedZoneIdValue) {
        router.replace("/(tabs)/tasks");
      }
    }
  };

  const effectiveFilters = useMemo(
    () => ({
      ...currentFilters,
      id_zones: scannedZoneIdValue || currentFilters.id_zones,
    }),
    [currentFilters, scannedZoneIdValue],
  );

  // Фильтруем задачи по поисковому запросу
  const filteredTasks = tasks?.filter(
    (task) =>
      searchText === "" ||
      task.name_zone?.toLowerCase().includes(searchText.toLowerCase()),
  );

  const fetchTasks = async (
    status?: number,
    filters?: {
      id_object: string;
      id_zones: string;
      id_user: string;
      id_teams: string;
    },
  ) => {
    if (!userInfo.id || !userInfo.role) {
      return;
    }

    const statusToUse = status !== undefined ? status : currentStatus;
    if (checkRoleAdmin(Number(userInfo.role))) {
      await dispatch(getTasksAll({ status: statusToUse, filters: filters }));
    } else {
      await dispatch(
        getTasksUser({
          id_user: userInfo.id,
          status: statusToUse,
          filters: filters,
        }),
      );
    }
  };

  const handleStatusPress = (status: number) => {
    setCurrentStatus(status);
  };

  useEffect(() => {
    if (!isAuthenticated || !userInfo.id || !userInfo.role) {
      dispatch(authUser());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (userInfo.id && userInfo.role) {
      fetchTasks(currentStatus, effectiveFilters).then(() =>
        setInitialized(true),
      );
    }
  }, [currentStatus, effectiveFilters, userInfo.id, userInfo.role]);

  useEffect(() => {
    if (userInfo.id && userInfo.role) {
      fetchTasks(currentStatus, effectiveFilters);
    }
  }, [currentFilters, scannedZoneIdValue, userInfo.id, userInfo.role]);

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Header
          onStatusPress={handleStatusPress}
          activeStatus={currentStatus}
          currentFilters={effectiveFilters}
          setCurrentFilters={handleSetCurrentFilters}
          searchText={searchText}
          onSearchChange={setSearchText}
        />
      </View>
      <View style={styles.main}>
        {!initialized ? (
          <Preloader />
        ) : filteredTasks?.length > 0 ? (
          <TasksList
            tasks={filteredTasks}
            scannedZoneId={scannedZoneIdValue}
            onRefresh={() => {
              fetchTasks(currentStatus, effectiveFilters);
            }}
          />
        ) : (
          <View style={styles.emptyBlock}>
            <TextUI style={[baseStyle.emptyText, styles.empty]}>
              Здесь ничего нет
            </TextUI>
            <ButtonUI
              onPress={() => {
                fetchTasks(currentStatus, effectiveFilters);
              }}
              style={styles.btnReset}
            >
              Обновить
            </ButtonUI>
          </View>
        )}
      </View>
    </View>
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
    paddingHorizontal: 20,
    zIndex: 0,
  },
  emptyBlock: {
    justifyContent: "center",
    flex: 1,
  },
  empty: {
    padding: 20,
    fontSize: 18,
    textAlign: "center",
  },
  btnReset: {
    width: "50%",
    marginHorizontal: "auto",
  },
});

export default Tasks;
