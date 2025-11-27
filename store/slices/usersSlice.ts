import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import type {
  Users,
  UsersState,
  UsersResponse,
  UserFormData,
} from "@/types/users/users";

const initialState: UsersState = {
  loading: false,
  error: null,
  DATA: [],
};

export const fetchUsers = createAsyncThunk<
  Users[],
  void,
  { rejectValue: string }
>("users/fetchUsers", async (_, thunkAPI) => {
  try {
    const response = await api.post<UsersResponse>("get_users_all/");

    const { success, DATA, message } = response.data;

    if (!success || typeof message === "string") {
      return thunkAPI.rejectWithValue(
        typeof message === "string"
          ? message
          : "Ошибка при получении пользователей"
      );
    }

    return DATA as Users[];
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Ошибка при проверке токена"
    );
  }
});

export const addUser = createAsyncThunk<
  boolean,
  UserFormData,
  { rejectValue: string }
>("users/addUser", async (payload, thunkAPI) => {
  try {
    const response = await api.post<UsersResponse>("add_user/", payload);

    console.log("payload", payload);

    const { success, message } = response.data;

    if (!success || typeof message === "string") {
      return thunkAPI.rejectWithValue(
        typeof message === "string"
          ? message
          : "Ошибка при добавлении пользователя"
      );
    }

    return success;
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Ошибка при добавлении пользователя"
    );
  }
});

export const updateUser = createAsyncThunk<
  boolean,
  UserFormData,
  { rejectValue: string }
>("users/updateUser", async (payload, thunkAPI) => {
  try {
    const response = await api.post<UsersResponse>("edit_user/", payload);

    const { success, message } = response.data;

    if (!success || typeof message === "string") {
      return thunkAPI.rejectWithValue(
        typeof message === "string"
          ? message
          : "Ошибка при редактировании пользователя"
      );
    }

    return success;
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Ошибка при редактировании пользователя"
    );
  }
});

export const deleteUser = createAsyncThunk<
  boolean,
  { id: number | undefined; active: string },
  { rejectValue: string }
>("users/deleteUser", async (payload, thunkAPI) => {
  try {
    // TODO. не работает сейчас удаление из зоны, ждем доработку бэка
    const response = await api.post("deactivate_user/", payload);

    const { success, message } = response.data;

    console.log(response.data);

    if (!success || typeof message === "string") {
      return thunkAPI.rejectWithValue(
        typeof message === "string"
          ? message
          : "Ошибка при удалении пользователя"
      );
    }

    return response.data;
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Ошибка при удалении пользователя"
    );
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.DATA = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // addUser
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // deleteUser
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default usersSlice.reducer;
