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
    console.log("id_user", id_user);

    const response = await api.post<ITaskFormData>("get_planner_user/", {
      id_user: id_user,
    });

    const { success, DATA, message } = response.data;

    console.log("response.data", response.data);

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

// export const updateTask = createAsyncThunk<
//   boolean,
//   ObjectForm,
//   { rejectValue: string }
// >("object/updateObject", async (payload, thunkAPI) => {
//   try {
//     const response = await api.post("edit_object/", payload);

//     const { success, message } = response.data;

//     if (!success) {
//       return thunkAPI.rejectWithValue(
//         message || "Ошибка при обновлении обьекта"
//       );
//     }

//     return success;
//   } catch (err: any) {
//     return thunkAPI.rejectWithValue("Ошибка при обновлении обьекта");
//   }
// });

// export const deleteObject = createAsyncThunk<
//   boolean,
//   string,
//   { rejectValue: string }
// >("object/deleteObject", async (id, thunkAPI) => {
//   try {
//     const response = await api.post("delete_object/", { id: id });

//     const { success, message } = response.data;

//     if (!success) {
//       return thunkAPI.rejectWithValue(message || "Ошибка при удалении объекта");
//     }

//     return success;
//   } catch (err: any) {
//     const error = err as { response?: { data?: { message?: string } } };
//     return thunkAPI.rejectWithValue(
//       error.response?.data?.message || "Ошибка при удалении объекта"
//     );
//   }
// });

// export const updateManagerObject = createAsyncThunk<
//   boolean,
//   {
//     id_object: string;
//     id_user: number;
//   },
//   { rejectValue: string }
// >("object/updateManagerObject", async (payload, thunkAPI) => {
//   try {
//     const response = await api.post("add_edit_object_manager/", payload);

//     const { success, message } = response.data;

//     if (!response.data) {
//       return thunkAPI.rejectWithValue(
//         message || "Ошибка при обновлении менеджера"
//       );
//     }

//     return success;
//   } catch (err: any) {
//     const error = err as { response?: { data?: { message?: string } } };
//     return thunkAPI.rejectWithValue(
//       error.response?.data?.message || "Ошибка при обновлении менеджера"
//     );
//   }
// });

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // clearObject(state) {
    //   state.data = null;
    //   state.error = null;
    //   state.loading = false;
    // },
  },
  extraReducers: (builder) => {
    builder

      // getTaskById
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
      });

    // // updateObject
    // .addCase(updateObject.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(updateObject.fulfilled, (state) => {
    //   state.loading = false;
    // })
    // .addCase(updateObject.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload || "Ошибка";
    // })

    // // deleteObject
    // .addCase(deleteObject.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(deleteObject.fulfilled, (state) => {
    //   state.loading = false;
    // })
    // .addCase(deleteObject.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload as string;
    // })

    // // updateManagerObject
    // .addCase(updateManagerObject.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // })
    // .addCase(updateManagerObject.fulfilled, (state) => {
    //   state.loading = false;
    // })
    // .addCase(updateManagerObject.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload as string;
    // });
  },
});

export const {} = tasksSlice.actions;
export default tasksSlice.reducer;
