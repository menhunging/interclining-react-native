import api from "@/api/api";
import {
  initialStateTasks,
  ITask,
  ITaskFormData,
} from "@/types/typesMobile/tasks";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const initialState: initialStateTasks = {
  loading: false,
  error: null,
  DATA: [],
  task: null,
  taskPhotosUpload: [],
};

export const getTasksAll = createAsyncThunk<
  ITask[],
  { status?: number },
  { rejectValue: string }
>("tasks/getTasksAll", async ({ status = 1 }, thunkAPI) => {
  try {
    const response = await api.post<ITaskFormData>("get_planner_user_all/", {
      status: status,
    });

    const { success, DATA, message } = response.data;

    if (!success) {
      return thunkAPI.rejectWithValue(
        message || "Ошибка при получении заданий"
      );
    }

    return DATA;
  } catch (err: any) {
    const error = err as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Ошибка при получении всех заданий"
    );
  }
});

export const getTasksUser = createAsyncThunk<
  ITask[],
  { id_user: string | string[]; status?: number },
  { rejectValue: string }
>("tasks/getTasksUser", async ({ id_user, status = 1 }, thunkAPI) => {
  try {
    const response = await api.post<ITaskFormData>("get_planner_user/", {
      id_user: id_user,
      status: status,
    });

    const { success, DATA, message } = response.data;

    if (!success) {
      return thunkAPI.rejectWithValue(
        message || "Ошибка при получении объекта"
      );
    }

    return DATA;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Ошибка при получении объекта");
  }
});

export const getTaskById = createAsyncThunk<
  ITask,
  string | string[],
  { rejectValue: string }
>("tasks/getTaskById", async (id, thunkAPI) => {
  try {
    const response = await api.post("get_planner_user_id/", { id });

    const { success, DATA, message } = response.data;

    if (!success) {
      return thunkAPI.rejectWithValue(
        message || "Ошибка при получении объекта"
      );
    }

    return DATA;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Ошибка при получении объекта");
  }
});

export const finishTask = createAsyncThunk<
  boolean,
  {
    id: string | string[];
    time: string | string[];
    photos: string[];
  },
  { rejectValue: string }
>("tasks/finishTask", async (payload, thunkAPI) => {
  try {
    const response = await api.post<ITaskFormData>(
      // "/edit_planner_user_time_current/", - это старый запрос на изменение только таймера
      "/success_planner/",
      {
        ...payload,
        id_user_success: payload.id,
      }
    );

    const { success, message } = response.data;

    if (!success) {
      return thunkAPI.rejectWithValue(
        message || "Ошибка при получении объекта"
      );
    }

    return success;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Ошибка при получении объекта");
  }
});

export const uploadTaskPhotos = createAsyncThunk<
  string[],
  {
    photos: Array<{ uri: string; name: string; type: string }>;
  },
  { rejectValue: string }
>("tasks/uploadTaskPhotos", async ({ photos }, thunkAPI) => {
  try {
    const formData = new FormData();

    photos.forEach((file) => {
      formData.append("files[]", file as any);
    });

    const response = await api.post("/add_photos/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const { success, DATA, message } = response.data;

    if (!success) {
      return thunkAPI.rejectWithValue(message || "Ошибка при загрузке фото");
    }

    return DATA;
  } catch (err: any) {
    console.error("Ошибка загрузки фото:", err);
    return thunkAPI.rejectWithValue("Ошибка при загрузке фото");
  }
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.task = action.payload;
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка";
      })

      // getTasksAll
      .addCase(getTasksAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasksAll.fulfilled, (state, action) => {
        state.loading = false;
        state.DATA = action.payload;
      })
      .addCase(getTasksAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // getTasksUser
      .addCase(getTasksUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTasksUser.fulfilled, (state, action) => {
        state.loading = false;
        state.DATA = action.payload;
      })
      .addCase(getTasksUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // finishTask
      .addCase(finishTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(finishTask.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(finishTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // uploadTaskPhotos
      .addCase(uploadTaskPhotos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadTaskPhotos.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(uploadTaskPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {} = tasksSlice.actions;
export default tasksSlice.reducer;
