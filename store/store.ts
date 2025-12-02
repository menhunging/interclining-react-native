import { configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";

// import appealsReducer from "./slices/appealsSlice";
import authReducer from "./slices/authSlice";
import objectReducer from "./slices/objectSlice";
import objectsReducer from "./slices/objectsSlice";
import tasksReducer from "./slices/tasksSlice";
// import plannerReducer from "./slices/plannerSlice";
// import teamsReducer from "./slices/teamsSlice";
// import usersReducer from "./slices/usersSlice";
// import zonesReducer from "./slices/zonesSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    objects: objectsReducer,
    object: objectReducer,
    tasks: tasksReducer,
    // zones: zonesReducer,
    // users: usersReducer,
    // teams: teamsReducer,
    // planner: plannerReducer,
    // appeals: appealsReducer,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
