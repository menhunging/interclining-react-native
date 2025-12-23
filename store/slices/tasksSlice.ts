import api from "@/api/api";
import {
  initialStateTasks,
  ITask,
  ITaskFormData,
} from "@/types/typesMobile/tasks";
import { formatDate } from "@/utils/formatDate";
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
  {
    status?: number;
    filters?: {
      id_object?: string;
      id_zones?: string;
      id_user?: string;
      id_teams?: string;
    };
  },
  { rejectValue: string }
>("tasks/getTasksAll", async ({ status = 1, filters }, thunkAPI) => {
  try {
    let dateNow: string | null = null;
    let date_from = "";
    let date_to = "";

    if (status == 5) {
      status = 1;
      date_from = formatDate(Date.now() + 1 * 24 * 60 * 60 * 1000); // Прибавляем один день
      date_to = formatDate(Date.now() + 7 * 24 * 60 * 60 * 1000); // Прибавляем одну неделю
    } else {
      dateNow = status !== 4 ? formatDate(Date.now()) : null; // выводим все статусы только сегодня, кроме "Пропуск"
    }

    const response = await api.post<ITaskFormData>("get_planner_user_all/", {
      filter: {
        date_from: date_from ? date_from : undefined,
        date_to: date_to ? date_to : undefined,
        date: dateNow ? dateNow : undefined,
        status: status,
        ...(filters?.id_object && { id_object: filters.id_object }),
        ...(filters?.id_zones && { id_zone: filters.id_zones }),
        ...(filters?.id_teams && { id_team: filters.id_teams }),
        ...(filters?.id_user && { id_user: filters.id_user }),
        // ...(filters?.id_object && { id_object: String(filters.id_object) }),
        // ...(filters?.id_zones && { id_zone: String(filters.id_zones) }),
        // ...(filters?.id_teams && { id_team: String(filters.id_teams) }),
        // ...(filters?.id_user && { id_user: String(filters.id_user) }),
      },
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
  {
    id_user: string | string[];
    status?: number;
    filters?: {
      id_object?: string;
      id_zones?: string;
      id_user?: string;
      id_teams?: string;
    };
  },
  { rejectValue: string }
>("tasks/getTasksUser", async ({ id_user, status = 1, filters }, thunkAPI) => {
  try {
    let dateNow: string | null = null;
    let date_from = "";
    let date_to = "";

    if (status == 5) {
      status = 1;
      date_from = formatDate(Date.now() + 1 * 24 * 60 * 60 * 1000); // Прибавляем один день
      date_to = formatDate(Date.now() + 7 * 24 * 60 * 60 * 1000); // Прибавляем одну неделю
    } else {
      dateNow = status !== 4 ? formatDate(Date.now()) : null; // выводим все статусы только сегодня, кроме "Пропуск"
    }

    const response = await api.post<ITaskFormData>("get_planner_user/", {
      id_user: id_user,
      filter: {
        date_from: date_from ? date_from : undefined,
        date_to: date_to ? date_to : undefined,
        date: dateNow ? dateNow : undefined,
        status: status,
        ...(filters?.id_object && { id_object: filters.id_object }),
        ...(filters?.id_zones && { id_zone: filters.id_zones }),
        ...(filters?.id_teams && { id_team: filters.id_teams }),
        ...(filters?.id_user && { id_user: filters.id_user }),
      },
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
    photos: string | string[];
  },
  { rejectValue: string }
>("tasks/finishTask", async (payload, thunkAPI) => {
  try {
    const response = await api.post<ITaskFormData>(
      // "/edit_planner_user_time_current/",
      "/success_planner/",
      payload
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

    // TODO сделать отправку фото как будет бэк

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

export const editTaskByID = createAsyncThunk<
  boolean,
  {
    id: string;
    description: string;
    id_user: string;
    id_team: string;
    time_start: string;
    time_end: string;
    duration: string;
    date_start: string;
  },
  { rejectValue: string }
>("tasks/editTaskByID", async (payload, thunkAPI) => {
  try {
    const response = await api.post("/edit_planner_user/", payload);

    const { success, message } = response.data;

    if (!success) {
      return thunkAPI.rejectWithValue(message || "Ошибка при обновлении таски");
    }

    return success;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Ошибка при обновлении таски");
  }
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    clearCurrentTask: (state) => {
      state.task = null;
    },
  },
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

      // getTasks
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
        state.task = null;
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
      .addCase(uploadTaskPhotos.fulfilled, (state, action) => {
        state.loading = false;
        // Полностью заменяем массив
        state.taskPhotosUpload.splice(
          0,
          state.taskPhotosUpload.length,
          ...action.payload
        );
      })
      .addCase(uploadTaskPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // editTaskByID
      .addCase(editTaskByID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editTaskByID.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(editTaskByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentTask } = tasksSlice.actions;
export default tasksSlice.reducer;
