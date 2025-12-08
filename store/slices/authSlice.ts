import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "./../../api/api";

import { STORAGE_KEYS } from "@/constants/constants";
import type { AuthMessage, AuthResponse, AuthState } from "@/types/auth/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const initialState: AuthState = {
  loading: false,
  error: null,
  isAuthenticated: false,
  userInfo: {
    id: "",
    login: "",
    role: "",
    email: "",
  },
};

export const loginUser = createAsyncThunk<
  AuthMessage, // возвращаемое значение при fulfilled
  { login: string; password: string }, // аргументы
  { rejectValue: string } // тип ошибки при rejected
>("auth/loginUser", async (payload, thunkAPI) => {
  try {
    const response = await api.post<AuthResponse>("auth/", payload);

    const { success, message } = response.data;

    if (!success || typeof message === "string") {
      return thunkAPI.rejectWithValue(
        typeof message === "string" ? message : "Ошибка авторизации"
      );
    }

    if (message.token) {
      AsyncStorage.setItem(STORAGE_KEYS.TOKEN, message.token);
    }

    return message;
  } catch (err: any) {
    const error = err as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Ошибка авторизации"
    );
  }
});

export const authUser = createAsyncThunk<
  AuthMessage,
  void,
  { rejectValue: string }
>("auth/authUser", async (_, thunkAPI) => {
  try {
    const response = await api.post<AuthResponse>("me/");
    const { success, message } = response.data;

    if (!success || typeof message === "string") {
      return thunkAPI.rejectWithValue(
        typeof message === "string" ? message : "Ошибка авторизации"
      );
    }

    return message;
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Ошибка при проверке токена"
    );
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
      state.isAuthenticated = false;
      state.error = null;
      state.userInfo = {
        id: "",
        login: "",
        role: "",
        email: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userInfo.id = action.payload.id;
        state.userInfo.login = action.payload.login;
        state.userInfo.email = action.payload.email;
        state.userInfo.role = action.payload.role;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.loading = false;
      })
      // authUser
      .addCase(authUser.pending, (state) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(authUser.fulfilled, (state, action) => {
        state.userInfo.id = action.payload.id;
        state.userInfo.login = action.payload.login;
        state.userInfo.email = action.payload.email;
        state.userInfo.role = action.payload.role;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(authUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.isAuthenticated = false;
        AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
