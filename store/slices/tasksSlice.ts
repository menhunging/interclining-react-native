import api from "@/api/api";
import {
  initialStateTasks,
  ITask,
  ITaskFormData,
} from "@/types/typesMobile/tasks";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as FileSystem from "expo-file-system/legacy";

export const initialState: initialStateTasks = {
  loading: false,
  error: null,
  DATA: [],
  task: null,
};

export const getTasksAll = createAsyncThunk<
  ITask[],
  void,
  { rejectValue: string }
>("tasks/getTasks", async (_, thunkAPI) => {
  try {
    const response = await api.post<ITaskFormData>("get_planner_user_all/");

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
  string | string[],
  { rejectValue: string }
>("tasks/getTasksUser", async (id_user, thunkAPI) => {
  try {
    const response = await api.post<ITaskFormData>("get_planner_user/", {
      id_user: id_user,
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
  },
  { rejectValue: string }
>("tasks/finishTask", async (payload, thunkAPI) => {
  try {
    const response = await api.post<ITaskFormData>(
      "/edit_planner_user_time_current/",
      payload
    );

    const { success, message } = response.data;

    console.log(
      "/edit_planner_user_time_current/ response.data",
      response.data
    );

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
  boolean,
  {
    taskId: string | string[];
    photos: string[];
  },
  { rejectValue: string }
>("tasks/uploadTaskPhotos", async ({ taskId, photos }, thunkAPI) => {
  try {
    const formData = new FormData();

    // Добавляем taskId
    formData.append("task_id", taskId.toString());

    // Добавляем каждое фото
    for (let i = 0; i < photos.length; i++) {
      const photoUri = photos[i];

      // Получаем информацию о файле
      const fileInfo = await FileSystem.getInfoAsync(photoUri);
      if (!fileInfo.exists) {
        throw new Error(`Файл не найден: ${photoUri}`);
      }

      // Определяем тип файла (обычно image/jpeg или image/png)
      const fileType = photoUri.toLowerCase().endsWith(".png")
        ? "image/png"
        : "image/jpeg";

      // Создаем объект файла для FormData
      const file = {
        uri: photoUri,
        name: `photo_${i + 1}.${fileType.split("/")[1]}`,
        type: fileType,
      };

      formData.append("photos", file as any);
    }

    // Создаем новый axios instance для multipart/form-data
    const uploadApi = api.create({
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // TODO сделать отправку фото как будет бэк

    console.log("formData photo task", formData);

    // const response = await uploadApi.post("/upload_task_photos/", formData);

    // const { success, message } = response.data;

    // if (!success) {
    //   return thunkAPI.rejectWithValue(message || "Ошибка при загрузке фото");
    // }

    return true;
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
