import { combineReducers, configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";

// import appealsReducer from "./slices/appealsSlice";
import authReducer, { logout } from "./slices/authSlice";
import objectReducer from "./slices/objectSlice";
import objectsReducer from "./slices/objectsSlice";
import tasksReducer from "./slices/tasksSlice";
// import plannerReducer from "./slices/plannerSlice";
// import teamsReducer from "./slices/teamsSlice";
// import usersReducer from "./slices/usersSlice";
// import zonesReducer from "./slices/zonesSlice";

const reducers = combineReducers({
  auth: authReducer,
  objects: objectsReducer,
  object: objectReducer,
  tasks: tasksReducer,
  // zones: zonesReducer,
  // users: usersReducer,
  // teams: teamsReducer,
  // planner: plannerReducer,
  // appeals: appealsReducer,
});

const rootReducer = (state: any, action: any) => {
  // если пришёл logout — сбрасываем весь store
  if (action.type === logout.type) {
    state = undefined;
  }
  return reducers(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
