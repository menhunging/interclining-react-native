import api from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ActiveTaskState {
  taskId: string | null;
  startTime: number | null; // timestamp когда таймер был запущен
  currentTime: number; // текущее время в секундах
  isRunning: boolean;
  loading: boolean;
}

const initialState: ActiveTaskState = {
  taskId: null,
  startTime: null,
  currentTime: 0,
  isRunning: false,
  loading: false,
};

// Ключ для AsyncStorage
const ACTIVE_TASK_KEY = "activeTask";

// Сохранить состояние в AsyncStorage
const saveToStorage = async (state: ActiveTaskState) => {
  try {
    await AsyncStorage.setItem(ACTIVE_TASK_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving active task to storage:", error);
  }
};

// Загрузить состояние из AsyncStorage
export const loadActiveTask = createAsyncThunk(
  "activeTask/load",
  async (_, thunkAPI) => {
    try {
      const saved = await AsyncStorage.getItem(ACTIVE_TASK_KEY);

      if (saved) {
        const parsed = JSON.parse(saved) as ActiveTaskState;
        // Если таймер был запущен, рассчитываем прошедшее время
        if (parsed.isRunning && parsed.startTime) {
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - parsed.startTime) / 1000);
          const totalTime = parsed.currentTime + elapsedSeconds;

          return {
            ...parsed,
            currentTime: totalTime,
            startTime: now,
          };
        }
        return parsed;
      }

      return initialState;
    } catch (error) {
      console.error("Error loading active task from storage:", error);
      return initialState;
    }
  }
);

// Запустить таймер для задачи
export const startTaskTimer = createAsyncThunk(
  "activeTask/start",
  async (
    { taskId, initialTime }: { taskId: string; initialTime: string },
    thunkAPI
  ) => {
    const state: ActiveTaskState = {
      taskId,
      startTime: Date.now(),
      currentTime: Number(initialTime),
      isRunning: true,
      loading: false,
    };

    await saveToStorage(state);

    await api.post("set_planner_active_status/", {
      id: taskId,
      time_start_fact: new Date().toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      }), // просто время , когда нажали на кнопку старт, записываем в базу в формате 21:00
    });

    // await api.post("set_planner_status/", {
    //   id: taskId,
    //   time_start_fact: new Date().toLocaleTimeString("ru-RU", {
    //     hour: "2-digit",
    //     minute: "2-digit",
    //   }), // просто время , когда нажали на кнопку старт, записываем в базу в формате 21:00
    // });

    return state;
  }
);

// Остановить таймер
export const stopTaskTimer = createAsyncThunk(
  "activeTask/stop",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as { activeTask: ActiveTaskState };
    const currentState = state.activeTask;

    const elapsedSeconds = currentState.startTime
      ? Math.floor((Date.now() - currentState.startTime) / 1000)
      : currentState.currentTime;

    const newState: ActiveTaskState = {
      ...currentState,
      isRunning: false,
      currentTime: elapsedSeconds,
      startTime: Date.now(),
    };

    await saveToStorage(newState);
    return newState;
  }
);

// Завершить задачу (очистить состояние)
export const completeTask = createAsyncThunk(
  "activeTask/complete",
  async (_, thunkAPI) => {
    await AsyncStorage.removeItem(ACTIVE_TASK_KEY);
    return initialState;
  }
);

// Пауза таймера (останавливает но сохраняет время)
export const pauseTaskTimer = createAsyncThunk<
  ActiveTaskState,
  {
    photos: string[];
    why_pause_description?: string | string[] | undefined;
    why_pause_name?: string | undefined;
    id?: string | string[] | undefined;
    currentTime?: number;
  },
  { rejectValue: string }
>("activeTask/pause", async (payload, thunkAPI) => {
  const state = thunkAPI.getState() as { activeTask: ActiveTaskState };
  const currentState = state.activeTask;

  // Используем переданное время или рассчитываем текущее прошедшее время
  const currentTimeValue =
    payload.currentTime ??
    (currentState.startTime
      ? currentState.currentTime +
        Math.floor((Date.now() - currentState.startTime) / 1000)
      : currentState.currentTime);

  const newState: ActiveTaskState = {
    ...currentState,
    isRunning: false,
    currentTime: currentTimeValue,
  };

  await saveToStorage(newState);

  await api.post("/pause_planner/", payload);

  return newState;
});

// Обновить время таймера (для UI)
export const updateTimer = createAsyncThunk(
  "activeTask/updateTimer",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as { activeTask: ActiveTaskState };
    const currentState = state.activeTask;

    if (currentState.isRunning && currentState.startTime) {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - currentState.startTime) / 1000);
      return elapsedSeconds;
    }

    return currentState.currentTime;
  }
);

const activeTaskSlice = createSlice({
  name: "activeTask",
  initialState,
  reducers: {
    // Синхронное обновление времени (для UI эффекта)
    updateTimerSync: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadActiveTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadActiveTask.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(loadActiveTask.rejected, (state) => {
        state.loading = false;
      })

      .addCase(startTaskTimer.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })

      .addCase(stopTaskTimer.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })

      .addCase(pauseTaskTimer.pending, (state, action) => {
        state.loading = true;
      })

      .addCase(pauseTaskTimer.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })

      .addCase(completeTask.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
      })

      .addCase(updateTimer.fulfilled, (state, action) => {
        state.currentTime = action.payload;
      });
  },
});

export const { updateTimerSync } = activeTaskSlice.actions;
export default activeTaskSlice.reducer;
