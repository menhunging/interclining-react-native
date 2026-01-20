import { getZoneByID } from "@/store/slices/zonesSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useLocalSearchParams, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function ZoneDeepLinkHandler() {
  const dispatch = useAppDispatch();
  const { currentTaskID } = useAppSelector((state) => state.zones);
  const { userInfo } = useAppSelector((state) => state.auth);

  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    console.log("ZoneDeepLinkHandler - segments:", segments);
    console.log("ZoneDeepLinkHandler - id:", id);
    console.log("ZoneDeepLinkHandler - userInfo:", userInfo);

    if (!id) {
      console.log("ZoneDeepLinkHandler - no id, returning");
      return;
    }

    const id_user = userInfo.id;
    const id_zone = id;

    console.log("ZoneDeepLinkHandler - dispatching getZoneByID with:", {
      id_user,
      id_zone,
    });
    dispatch(getZoneByID({ id_user, id_zone }));
  }, [id, userInfo, segments]);

  useEffect(() => {
    if (currentTaskID) {
      router.replace(`/(tabs)/tasks/${currentTaskID}`);
    } else {
      router.replace(`/(tabs)/tasks/`); // если таска не найдена, то переход просто на главную тасок
    }
  }, [currentTaskID]);

  return null;
}
