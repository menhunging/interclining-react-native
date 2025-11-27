import type { Appeal, AppealsForm } from "@/types/appeals/appeals";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/api";

interface AppealsState {
  loading: boolean;
  error: string | null;
  DATA: Appeal[] | null;
}

const initialState: AppealsState = {
  loading: false,
  error: null,
  DATA: null,
};

export const getAppeals = createAsyncThunk<
  AppealsForm["DATA"],
  void,
  { rejectValue: string }
>("appeals/getAppeals", async (_, thunkAPI) => {
  try {
    const response = await api.post<AppealsForm>("get_appeals/");

    const { DATA } = response.data;

    // if (!success) {
    //   return thunkAPI.rejectWithValue(
    //     message || "Ошибка при получении обращений"
    //   );
    // }

    return DATA;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Ошибка при получении обращений");
  }
});

export const addAppeal = createAsyncThunk<
  AppealsForm["DATA"],
  Appeal,
  { rejectValue: string }
>("appeals/addAppeal", async (payload, thunkAPI) => {
  try {
    const response = await api.post<AppealsForm>("add_appeal/", payload);

    const { success, DATA, message } = response.data;

    if (!success) {
      return thunkAPI.rejectWithValue(
        message || "Ошибка при добавлении обращения"
      );
    }

    return DATA;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Ошибка при добавлении обращения");
  }
});

const appealsSlice = createSlice({
  name: "appeals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getAppeals
      .addCase(getAppeals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppeals.fulfilled, (state, action) => {
        state.loading = false;
        state.DATA = action.payload;
      })
      .addCase(getAppeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка";
      })

      // addAppeal
      .addCase(addAppeal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAppeal.fulfilled, (state, action) => {
        state.loading = false;
        state.DATA = action.payload;
      })
      .addCase(addAppeal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка";
      });
  },
});

export default appealsSlice.reducer;
