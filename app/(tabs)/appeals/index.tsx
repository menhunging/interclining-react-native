import AppealsList from "@/components/Appeals/AppealsList";
import HeaderAppeals from "@/components/Header/HeaderAppeals";
import ButtonUI from "@/components/ui/Button/ButtonUI";
import Preloader from "@/components/ui/Preloader/Preloader";
import TextUI from "@/components/ui/Text/Text";
import { baseStyle } from "@/constants/baseStyle";
import { COLORS } from "@/constants/colors";
import { getAppeals } from "@/store/slices/appealsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { checkRoleAdmin } from "@/utils/checkRoleAdmin";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

const Appeals = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { DATA: appeals } = useAppSelector((state) => state.appeals);
  const { userInfo } = useAppSelector((state) => state.auth);

  const isAdmin = checkRoleAdmin(Number(userInfo.role));

  const [initialized, setInitialized] = useState(false);

  const [currentStatus, setCurrentStatus] = useState<number>(3); // по умолчанию статус "Не назначено"
  const [currentFilters, setCurrentFilters] = useState({
    id_object: "",
    id_user: "",
    id_zones: "",
    id_teams: "",
  });

  const [searchText, setSearchText] = useState("");

  // Фильтруем обращения по поисковому запросу
  const filteredAppeals = appeals?.filter(
    (appeal) =>
      searchText === "" ||
      appeal.name_zone?.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleStatusPress = (status: number) => {
    setCurrentStatus(status);
  };

  const fetchAppeals = async (
    status?: number,
    filters?: {
      id_object: string;
      id_zones: string;
      id_user: string;
      id_teams: string;
    }
  ) => {
    await dispatch(getAppeals({ status, filters }));
  };

  useEffect(() => {
    if (!isAdmin) {
      router.replace("/(tabs)/tasks");
      return;
    }

    if (!initialized) {
      fetchAppeals(currentStatus, currentFilters).then(() =>
        setInitialized(true)
      );
    } else {
      fetchAppeals(currentStatus, currentFilters);
    }
  }, [currentStatus, currentFilters, dispatch, isAdmin, router]);

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <HeaderAppeals
          onStatusPress={handleStatusPress}
          activeStatus={currentStatus}
          currentFilters={currentFilters}
          setCurrentFilters={setCurrentFilters}
          searchText={searchText}
          onSearchChange={setSearchText}
        />
      </View>
      <View style={styles.main}>
        {!initialized ? (
          <Preloader />
        ) : filteredAppeals?.length > 0 ? (
          <AppealsList
            appeals={filteredAppeals}
            onRefresh={() => {
              fetchAppeals(currentStatus, currentFilters);
            }}
          />
        ) : (
          <View style={styles.emptyBlock}>
            <TextUI style={[baseStyle.emptyText, styles.empty]}>
              Здесь ничего нет
            </TextUI>
            <ButtonUI
              onPress={() => {
                fetchAppeals(currentStatus, currentFilters);
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
    zIndex: 0,
    paddingHorizontal: 20,
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

export default Appeals;
