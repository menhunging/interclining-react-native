import {
  clearCurrentTask,
  getZoneByID,
  resetStatus,
} from "@/store/slices/zonesSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef } from "react";

export default function ZoneDeepLinkHandler() {
  const dispatch = useAppDispatch();
  const { currentTask, status } = useAppSelector((state) => state.zones);
  const { userInfo } = useAppSelector((state) => state.auth);

  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const navigationDoneRef = useRef(false);
  const requestStartedRef = useRef(false);
  const isNewRequestRef = useRef(false);

  useEffect(() => {
    if (!id || !userInfo?.id) return;

    // Сбрасываем флаги при новом id
    navigationDoneRef.current = false;
    requestStartedRef.current = false;
    isNewRequestRef.current = true;

    // Сначала сбрасываем статус, чтобы старые ошибки не влияли
    dispatch(resetStatus());
    // Потом очищаем данные
    dispatch(clearCurrentTask());

    // Отмечаем, что запрос начался
    requestStartedRef.current = true;

    console.log("id_user", userInfo.id);
    console.log("id_zone", id);

    dispatch(
      getZoneByID({
        id_user: userInfo.id,
        id_zone: id,
      }),
    );
  }, [id, userInfo?.id]);

  useEffect(() => {
    if (navigationDoneRef.current) return;

    if (isNewRequestRef.current) {
      // Для нового запроса сбрасываем флаг и игнорируем старые статусы
      isNewRequestRef.current = false;
      return;
    }

    if (status === "succeeded" && currentTask) {
      navigationDoneRef.current = true;
      const taskId = encodeURIComponent(String(currentTask.id));
      router.push(`/(tabs)/tasks/${taskId}`);
    } else if (status === "failed" && requestStartedRef.current) {
      // Перенаправляем на индекс только если это результат текущего запроса
      navigationDoneRef.current = true;
      router.push(`/(tabs)/tasks`);
    }
  }, [status, currentTask]);

  return null;
}
