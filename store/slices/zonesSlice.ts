import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

import type { zone, zoneResponse, zoneState } from "@/types/zones/zones";

// зоны в самом обьекте, поэтому их нет как отдельных сущностей в state
export const initialState: zoneState = {
  loading: false,
  error: null,
};

export const addZone = createAsyncThunk<boolean, zone, { rejectValue: string }>(
  "zones/addZone",
  async (payload, thunkAPI) => {
    try {
      const response = await api.post<zoneResponse>("add_zone/", payload);

      const { success, message } = response.data;

      if (!success) {
        return thunkAPI.rejectWithValue(
          message || "Ошибка при добавлении зоны"
        );
      }

      return success;
    } catch (err: any) {
      const error = err as { response?: { data?: { message?: string } } };
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Ошибка при добавлении зоны"
      );
    }
  }
);

export const updateZone = createAsyncThunk<
  boolean,
  zone,
  { rejectValue: string }
>("zones/updateZone", async (payload, thunkAPI) => {
  try {
    const response = await api.post<zoneResponse>("edit_zone/", payload);

    const { success, message } = response.data;

    if (!success) {
      return thunkAPI.rejectWithValue(
        message || "Ошибка при получении объектов"
      );
    }

    return success;
  } catch (err: any) {
    const error = err as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Ошибка при получении всех обьектов"
    );
  }
});

export const deleteZone = createAsyncThunk<
  boolean,
  { id: string },
  { rejectValue: string }
>("zones/deleteZone", async (payload, thunkAPI) => {
  try {
    const response = await api.post<zoneResponse>("delete_zone/", payload);

    const { success, message } = response.data;

    if (!success) {
      return thunkAPI.rejectWithValue(message || "Ошибка при удалении зоны");
    }

    return success;
  } catch (err: any) {
    const error = err as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Ошибка при удалении зоны"
    );
  }
});

const zonesSlice = createSlice({
  name: "zones",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // addObject
      .addCase(addZone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addZone.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addZone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // updateZone
      .addCase(updateZone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateZone.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateZone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // deleteZone
      .addCase(deleteZone.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteZone.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteZone.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default zonesSlice.reducer;
