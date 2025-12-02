import Header from "@/components/Header/Header";
import TasksList from "@/components/Tasks/TasksList";
import Preloader from "@/components/ui/Preloader/Preloader";
import { COLORS } from "@/constants/colors";
import { authUser } from "@/store/slices/authSlice";
import { getTasksAll, getTasksUser } from "@/store/slices/tasksSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { checkRoleAdmin } from "@/utils/checkRoleAdmin";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";

const Tasks = () => {
  const dispatch = useAppDispatch();

  const { loading: loadingAuth } = useAppSelector((state) => state.auth);
  const { DATA: tasks, loading: loadingTask } = useAppSelector(
    (state) => state.tasks
  );

  useEffect(() => {
    const check = async () => {
      const result = await dispatch(authUser());

      if (authUser.fulfilled.match(result)) {
        const fetchUser = result.payload;

        checkRoleAdmin(Number(fetchUser.role))
          ? dispatch(getTasksAll())
          : dispatch(getTasksUser(fetchUser.id));
      }
    };

    check();
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Header />
      </View>
      <View style={styles.main}>
        {loadingAuth || loadingTask ? (
          <Preloader />
        ) : (
          <TasksList tasks={tasks} />
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
});

export default Tasks;
