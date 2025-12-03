import { useAppDispatch, useAppSelector } from "@/store/store";
import { loadActiveTask } from "@/store/slices/activeTaskSlice";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { taskId, isRunning, loading } = useAppSelector((state) => state.activeTask);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Загружаем состояние активной задачи из AsyncStorage при запуске
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      dispatch(loadActiveTask());
    }
  }, [dispatch]);

  useEffect(() => {
    // Если загрузка завершена и есть активная запущенная задача,
    // перенаправляем на нее
    if (!loading && taskId && isRunning && hasInitialized.current) {
      // Небольшая задержка, чтобы приложение успело инициализироваться
      setTimeout(() => {
        router.replace(`/tasks/${taskId}`);
      }, 100);
    }
  }, [loading, taskId, isRunning, router]);

  return <>{children}</>;
};

export default AppInitializer;
