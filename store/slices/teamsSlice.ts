import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
import type {
  Teams,
  TeamsResponse,
  TeamsState,
  TeamsFormData,
} from "@/types/teams/teams";

const initialState: TeamsState = {
  loading: false,
  error: null,
  DATA: [],
};

export const fetchTeams = createAsyncThunk<
  Teams[],
  void,
  { rejectValue: string }
>("teams/fetchTeams", async (_, thunkAPI) => {
  try {
    const response = await api.post<TeamsResponse>("get_teams_all/");

    const { success, DATA, message } = response.data;

    if (!success || typeof message === "string") {
      return thunkAPI.rejectWithValue(
        typeof message === "string"
          ? message
          : "Ошибка при получении пользователей"
      );
    }

    return DATA as Teams[];
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Ошибка при проверке токена"
    );
  }
});

export const addTeam = createAsyncThunk<
  boolean,
  TeamsFormData,
  { rejectValue: string }
>("teams/addTeam", async (payload, thunkAPI) => {
  try {
    const response = await api.post<TeamsResponse>("add_team/", payload);

    const { success, message } = response.data;

    if (!success || typeof message === "string") {
      return thunkAPI.rejectWithValue(
        typeof message === "string" ? message : "Ошибка при добавлении команды"
      );
    }

    return success;
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Ошибка при добавлении команды"
    );
  }
});

export const updateTeam = createAsyncThunk<
  boolean,
  TeamsFormData,
  { rejectValue: string }
>("teams/updateTeam", async (payload, thunkAPI) => {
  try {
    const response = await api.post<TeamsResponse>("edit_team/", payload);

    const { success, message } = response.data;

    if (!success || typeof message === "string") {
      return thunkAPI.rejectWithValue(
        typeof message === "string"
          ? message
          : "Ошибка при редактировании команды"
      );
    }

    return success;
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Ошибка при редактировании команды"
    );
  }
});

export const deleteTeam = createAsyncThunk<
  boolean,
  number | undefined,
  { rejectValue: string }
>("teams/deleteTeam", async (id, thunkAPI) => {
  try {
    const response = await api.post("delete_team/", { id: id });

    const { success, message } = response.data;

    if (!success || typeof message === "string") {
      return thunkAPI.rejectWithValue(
        typeof message === "string" ? message : "Ошибка при удалении команды"
      );
    }

    return success;
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Ошибка при удалении команды"
    );
  }
});

const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchTeams
      .addCase(fetchTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeams.fulfilled, (state, action) => {
        state.DATA = action.payload;
        state.loading = false;
      })
      .addCase(fetchTeams.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // addTeam
      .addCase(addTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTeam.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addTeam.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // updateTeam
      .addCase(updateTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeam.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      // deleteTeam
      .addCase(deleteTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeam.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export default teamsSlice.reducer;
