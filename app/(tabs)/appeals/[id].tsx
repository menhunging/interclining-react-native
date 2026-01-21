import HeaderItem from "@/components/Header/HeaderItem";
import ButtonUI from "@/components/ui/Button/ButtonUI";
import Preloader from "@/components/ui/Preloader/Preloader";
import TextUI from "@/components/ui/Text/Text";
import { COLORS } from "@/constants/colors";
import { getAppealByID } from "@/store/slices/appealsSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { formatDateTime } from "@/utils/formatDateTime";
import { getFullPhotoUrl } from "@/utils/getFullPhotoUrl";
import { useLocalSearchParams, useRouter } from "expo-router";
import { JSX, useEffect } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";

const AppealScreen = () => {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const { loading, currentAppeal: appeal } = useAppSelector(
    (state) => state.appeals,
  );

  const { id } = useLocalSearchParams(); // получаем id из URL

  const statuses: Record<number, JSX.Element> = {
    1: (
      <>
        <View
          style={[styles.appealStatusCircle, styles.appealStatusTwo]}
        ></View>
        <TextUI fontWeight="medium" style={styles.appealStatus}>
          В работе
        </TextUI>
      </>
    ),
    2: (
      <>
        <View
          style={[styles.appealStatusCircle, styles.appealStatusSuccess]}
        ></View>
        <TextUI fontWeight="medium" style={styles.appealStatus}>
          Выполнено
        </TextUI>
      </>
    ),
  };

  useEffect(() => {
    if (id) {
      dispatch(getAppealByID(id as string));
      // dispatch(fetchUsers());
    }
  }, [id, dispatch]);

  if (!appeal || loading) {
    return <Preloader />;
  } else {
    return (
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <HeaderItem
            edit={false}
            name={"Обращение"}
            desc={appeal.name_zone}
            loading={loading}
          />
        </View>
        <ScrollView
          style={styles.main}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.appealContent}>
            <View>
              <TextUI fontWeight="medium" style={styles.appealStatusTitle}>
                Статус:
              </TextUI>
              <View style={styles.appealStatusRow}>
                {appeal.status !== null ? (
                  statuses[appeal.status]
                ) : (
                  <>
                    <View
                      style={[
                        styles.appealStatusCircle,
                        styles.appealStatusOne,
                      ]}
                    ></View>
                    <TextUI fontWeight="medium" style={styles.appealStatus}>
                      Не назначено
                    </TextUI>
                  </>
                )}
              </View>
            </View>

            <TextUI fontWeight="medium" style={styles.appealDate}>
              {formatDateTime("2025-11-01 15:13:41")}
            </TextUI>

            <View>
              <TextUI fontWeight="medium" style={styles.title}>
                Обьект:
              </TextUI>
              <TextUI fontWeight="semibold" style={styles.name}>
                {appeal.name_object}
              </TextUI>
            </View>

            <View>
              <TextUI fontWeight="medium" style={styles.title}>
                Зона:
              </TextUI>
              <TextUI fontWeight="semibold" style={styles.name}>
                {appeal.name_zone}
              </TextUI>
            </View>

            <View>
              <TextUI fontWeight="medium" style={styles.title}>
                Текст обращения:
              </TextUI>
              <TextUI fontWeight="semibold" style={styles.name}>
                {appeal.message}
              </TextUI>
            </View>
            <View>
              <TextUI fontWeight="medium" style={styles.title}>
                Фото:
              </TextUI>
              {appeal?.gallery?.map((item: { photo: string }, index) => (
                <Image
                  key={index}
                  source={{ uri: getFullPhotoUrl(item.photo) }}
                  style={styles.image}
                  resizeMode="cover"
                />
              ))}
            </View>
          </View>
        </ScrollView>
        <View style={styles.controls}>
          <ButtonUI
            onPress={() => {
              router.push(
                `/appeals/addTask?id=${id}&objID=${appeal.id_object}`,
              );
            }}
          >
            Создать задачу
          </ButtonUI>
        </View>
      </View>
    );
  }
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

  appealDate: {
    fontSize: 16,
  },

  appealContent: {
    gap: 22,
    fontSize: 16,
  },

  appealStatusTitle: {
    alignItems: "center",
    textAlign: "center",
    color: "#6F7583",
  },

  appealStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginTop: 8,
  },

  appealStatus: {
    alignItems: "center",
    textAlign: "center",
  },

  appealStatusCircle: {
    borderRadius: "50%",
    width: 12,
    height: 12,
  },

  appealStatusOne: {
    backgroundColor: "#777777",
  },

  appealStatusTwo: {
    backgroundColor: "#5C7FF3",
  },

  appealStatusSuccess: {
    backgroundColor: "#68F35C",
  },

  title: {
    color: COLORS.tabNotActiveColor,
    fontSize: 16,
    marginBottom: 4,
  },

  name: {
    color: COLORS.primary,
    fontSize: 18,
  },

  text: {
    color: COLORS.primary,
    fontSize: 16,
  },

  controls: {
    marginTop: "auto",
    padding: 20,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
});

export default AppealScreen;
