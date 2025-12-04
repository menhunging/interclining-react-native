import { loadActiveTask } from "@/store/slices/activeTaskSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useRef } from "react";

const AppInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { taskId, isRunning, loading } = useAppSelector(
    (state) => state.activeTask
  );
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      dispatch(loadActiveTask()); // загружаем состояние активной задачи из AsyncStorage при запуске
    }
  }, [dispatch]);

  useEffect(() => {
    // Если загрузка завершена и есть активная запущенная задача, перенаправляем на нее
    if (!loading && taskId && isRunning && hasInitialized.current) {
      // Небольшая задержка, чтобы приложение успело инициализироваться
      setTimeout(() => {
        // Проверяем текущий путь, чтобы избежать повторной навигации
        const currentPath = pathname;
        const targetPath = `/tasks/${taskId}`;
        if (currentPath !== targetPath) {
          router.replace(`/tasks/${taskId}`);
        }
      }, 100);
    }
  }, [loading, taskId, isRunning, router]);

  return <>{children}</>;
};

export default AppInitializer;
