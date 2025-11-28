import { STORAGE_KEYS } from "@/constants/constants";
import { authUser, logout } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

const useCheckAuth = () => {
  const dispatch = useAppDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);

        if (!token) {
          return;
        }

        const result = await dispatch(authUser());

        if (authUser.rejected.match(result)) {
          dispatch(logout());
        }
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return isCheckingAuth;
};

export default useCheckAuth;
