import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/api";
import type { ObjectForm, ObjectItem } from "@/types/objects/objects";

interface ObjectState {
  loading: boolean;
  error: string | null;
  data: ObjectItem | null;
}

const initialState: ObjectState = {
  loading: false,
  error: null,
  data: null,
};

export const getObjectById = createAsyncThunk<
  ObjectItem,
  string,
  { rejectValue: string }
>("object/getById", async (id, thunkAPI) => {
  try {
    const response = await api.post("get_object/", { id });

    const { success, DATA, message } = response.data;

    if (!success) {
      return thunkAPI.rejectWithValue(
        message || "Ошибка при получении объекта"
      );
    }

    return DATA[0]; // с бэка так приходит, важно.
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Ошибка при получении объекта");
  }
});

export const updateObject = createAsyncThunk<
  boolean,
  ObjectForm,
  { rejectValue: string }
>("object/updateObject", async (payload, thunkAPI) => {
  try {
    const response = await api.post("edit_object/", payload);

    const { success, message } = response.data;

    if (!success) {
      return thunkAPI.rejectWithValue(
        message || "Ошибка при обновлении обьекта"
      );
    }

    return success;
  } catch (err: any) {
    return thunkAPI.rejectWithValue("Ошибка при обновлении обьекта");
  }
});

export const deleteObject = createAsyncThunk<
  boolean,
  string,
  { rejectValue: string }
>("object/deleteObject", async (id, thunkAPI) => {
  try {
    const response = await api.post("delete_object/", { id: id });

    const { success, message } = response.data;

    if (!success) {
      return thunkAPI.rejectWithValue(message || "Ошибка при удалении объекта");
    }

    return success;
  } catch (err: any) {
    const error = err as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Ошибка при удалении объекта"
    );
  }
});

export const updateManagerObject = createAsyncThunk<
  boolean,
  {
    id_object: string;
    id_user: number;
  },
  { rejectValue: string }
>("object/updateManagerObject", async (payload, thunkAPI) => {
  try {
    const response = await api.post("add_edit_object_manager/", payload);

    const { success, message } = response.data;

    if (!response.data) {
      return thunkAPI.rejectWithValue(
        message || "Ошибка при обновлении менеджера"
      );
    }

    return success;
  } catch (err: any) {
    const error = err as { response?: { data?: { message?: string } } };
    return thunkAPI.rejectWithValue(
      error.response?.data?.message || "Ошибка при обновлении менеджера"
    );
  }
});

const objectSlice = createSlice({
  name: "object",
  initialState,
  reducers: {
    clearObject(state) {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder

      // getObjectById
      .addCase(getObjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getObjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getObjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка";
      })

      // updateObject
      .addCase(updateObject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateObject.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateObject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка";
      })

      // deleteObject
      .addCase(deleteObject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteObject.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteObject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // updateManagerObject
      .addCase(updateManagerObject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateManagerObject.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateManagerObject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearObject } = objectSlice.actions;
export default objectSlice.reducer;
