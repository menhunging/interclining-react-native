import type { Planner, PlannerForm } from "@/types/planner/planner";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/api";

interface PlannerState {
  loading: boolean;
  error: string | null;
  DATA: Planner[] | null;
}

const initialState: PlannerState = {
  loading: false,
  error: null,
  DATA: null,
};

export const getPlanner = createAsyncThunk<
  PlannerForm["DATA"],
  void,
  { rejectValue: string }
>("planner/getPlanner", async (_, thunkAPI) => {
  try {
    const response = await api.post<PlannerForm>("get_planners/");

    const { success, DATA, message } = response.data;

    if (!success) {
      return thunkAPI.rejectWithValue(message || "Ошибка при получении задач");
    }

    return DATA;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Ошибка при получении задач");
  }
});

export const addPlanner = createAsyncThunk<
  PlannerForm["DATA"],
  Planner,
  { rejectValue: string }
>("planner/addPlanner", async (payload, thunkAPI) => {
  try {
    const response = await api.post<PlannerForm>("add_planner/", payload);

    const { success, DATA, message } = response.data;

    if (!success) {
      return thunkAPI.rejectWithValue(
        message || "Ошибка при добавлении задачи"
      );
    }

    return DATA;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Ошибка при добавлении задачи");
  }
});

export const updatePlanner = createAsyncThunk<
  PlannerForm["DATA"],
  Planner,
  { rejectValue: string }
>("planner/updatePlanner", async (payload, thunkAPI) => {
  try {
    const response = await api.post<PlannerForm>("edit_planner/", payload);

    const { success, DATA, message } = response.data;

    if (!success) {
      return thunkAPI.rejectWithValue(
        message || "Ошибка при редактировании задачи"
      );
    }

    return DATA;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Ошибка при редактировании задачи");
  }
});

export const changeStatus = createAsyncThunk<
  { success: boolean; payload: { id: string } },
  { id: string },
  { rejectValue: string }
>("planner/changeStatus", async (payload, thunkAPI) => {
  try {
    const response = await api.post<PlannerForm>(
      "status_change_planner/",
      payload
    );

    const { success, message } = response.data;

    if (!success) {
      return thunkAPI.rejectWithValue(
        message || "Ошибка при добавлении задачи"
      );
    }

    return {
      success,
      payload,
    };
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Ошибка при добавлении задачи");
  }
});

const plannerSlice = createSlice({
  name: "planner",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // addPlanner
      .addCase(addPlanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPlanner.fulfilled, (state, action) => {
        state.loading = false;
        state.DATA = action.payload;
      })
      .addCase(addPlanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка";
      })

      // updatePlanner
      .addCase(updatePlanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlanner.fulfilled, (state, action) => {
        state.loading = false;
        state.DATA = action.payload;
      })
      .addCase(updatePlanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка";
      })

      // getPlanner
      .addCase(getPlanner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlanner.fulfilled, (state, action) => {
        state.loading = false;
        state.DATA = action.payload;
      })
      .addCase(getPlanner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка";
      })

      // changeStatus
      .addCase(changeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeStatus.fulfilled, (state, action) => {
        state.loading = false;

        let { payload } = action.payload;

        if (state.DATA) {
          const found = state.DATA.find(
            (item) => item.id === Number(payload.id)
          );
          if (found) {
            found.status = found.status === 0 ? 1 : 0;
            found.name_status = found.status === 0 ? "Активно" : "Остановлено";
          }
        }

        // state.DATA;
      })
      .addCase(changeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка";
      });
  },
});

// export const {} = plannerSlice.actions;
export default plannerSlice.reducer;
