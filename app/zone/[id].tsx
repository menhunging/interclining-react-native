import { clearCurrentTask, getZoneByID } from "@/store/slices/zonesSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

export default function ZoneDeepLinkHandler() {
  const dispatch = useAppDispatch();
  const { currentTaskID, status } = useAppSelector((state) => state.zones);
  const { userInfo } = useAppSelector((state) => state.auth);

  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  useEffect(() => {
    if (!id || !userInfo?.id) return;

    dispatch(clearCurrentTask());

    dispatch(
      getZoneByID({
        id_user: userInfo.id,
        id_zone: id,
      }),
    );
  }, [id, userInfo?.id]);

  useEffect(() => {
    if (status === "succeeded" && currentTaskID) {
      router.replace(`/(tabs)/tasks/${currentTaskID}`);
    }
  }, [status, currentTaskID]);

  useEffect(() => {
    if (status === "failed") {
      router.replace(`/(tabs)/tasks`);
    }
  }, [status]);

  return null;
}
