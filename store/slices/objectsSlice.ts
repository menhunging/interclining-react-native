import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

import type {
  ObjectItem,
  ObjectsResponse,
  ObjectsState,
  ObjectForm,
  ObjectFormResponse,
} from "@/types/objects/objects";

export const initialState: ObjectsState = {
  loading: false,
  error: null,
  DATA: [],
};

export const getObjects = createAsyncThunk<
  ObjectItem[],
  void,
  { rejectValue: string }
>("objects/getObjects", async (_, thunkAPI) => {
  try {
    const response = await api.post<ObjectsResponse>("get_objects/");

    const { success, DATA, message } = response.data;

    if (!success) {
      return thunkAPI.rejectWithValue(
        message || "Ошибка при получении объектов"
      );
    }

    return DATA;
  } catch (err: any) {
    const error = err as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Ошибка при получении всех обьектов"
    );
  }
});

export const addObject = createAsyncThunk<
  boolean,
  ObjectForm,
  { rejectValue: string }
>("objects/addObject", async (payload, thunkAPI) => {
  try {
    const response = await api.post<ObjectFormResponse>("add_object/", payload);

    const { success, message } = response.data;

    console.log("response.data", response.data);

    if (!success) {
      return thunkAPI.rejectWithValue(
        message || "Ошибка при добавлении обьекта"
      );
    }

    return success;
  } catch (err: any) {
    const error = err as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Ошибка при добавлении обьекта"
    );
  }
});

const objectsSlice = createSlice({
  name: "objects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // getObjects
      .addCase(getObjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getObjects.fulfilled, (state, action) => {
        state.loading = false;
        state.DATA = action.payload;
      })
      .addCase(getObjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // addObject
      .addCase(addObject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addObject.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addObject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default objectsSlice.reducer;
