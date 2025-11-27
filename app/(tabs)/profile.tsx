import { logout } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/store";
import { router } from "expo-router";
import { useEffect } from "react";

const Profile = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(logout());
    router.replace("/");
  }, [dispatch]);

  return null; // экран пустой, сразу редирект
};

export default Profile;
