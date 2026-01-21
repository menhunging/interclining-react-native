import type { Appeal, AppealsForm } from "@/types/appeals/appeals";

import api from "@/api/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface AppealsState {
  loading: boolean;
  error: string | null;
  DATA: Appeal[];
  currentAppeal: Appeal | null;
}

const initialState: AppealsState = {
  loading: false,
  error: null,
  DATA: [],
  currentAppeal: null,
};

export const getAppeals = createAsyncThunk<
  AppealsForm["DATA"],
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
>("appeals/getAppeals", async ({ status = 10, filters }, thunkAPI) => {
  try {
    // let dateNow: string | null = null;
    // let date_from = "";
    // let date_to = "";

    // if (status == 5) {
    //   status = 1;
    //   date_from = formatDate(Date.now() + 1 * 24 * 60 * 60 * 1000); // Прибавляем один день
    //   date_to = formatDate(Date.now() + 7 * 24 * 60 * 60 * 1000); // Прибавляем одну неделю
    // } else {
    //   dateNow = status !== 4 ? formatDate(Date.now()) : null; // выводим все статусы только сегодня, кроме "Пропуск"
    // }

    const response = await api.post<AppealsForm>("get_appeals/", {
      filter: {
        // date_from: date_from ? date_from : undefined,
        // date_to: date_to ? date_to : undefined,
        // date: dateNow ? dateNow : undefined,
        status: status,
        ...(filters?.id_object && { id_object: filters.id_object }),
        ...(filters?.id_zones && { id_zone: filters.id_zones }),
        ...(filters?.id_teams && { id_team: filters.id_teams }),
        ...(filters?.id_user && { id_user: filters.id_user }),
      },
    });

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

export const getAppealByID = createAsyncThunk<
  Appeal,
  string,
  { rejectValue: string }
>("appeals/getAppealByID", async (id, thunkAPI) => {
  try {
    const response = await api.post<{ DATA: Appeal[] }>("get_appeal/", {
      id,
    });

    const { DATA } = response.data;

    return DATA[0]; // с бэка почему то приходит массив.
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
        message || "Ошибка при добавлении обращения",
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
      })

      // getAppealByID
      .addCase(getAppealByID.pending, (state) => {
        state.loading = true;
        ``;
        state.error = null;
      })
      .addCase(getAppealByID.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAppeal = action.payload;
      })
      .addCase(getAppealByID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Ошибка";
      });
  },
});

export default appealsSlice.reducer;
