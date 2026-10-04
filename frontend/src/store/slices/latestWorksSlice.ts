import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { LatestWorksState, LatestWorkProps } from './types';
import {
  getLatestWorks,
  getLatestWork,
  createLatestWork,
  updateLatestWork,
  deleteLatestWork,
} from '../thunks/latestWorks';

const initialState: LatestWorksState = {
  latestWorks: [],
  currentLatestWork: null,
  latestWorkNotFound: false,
};

const latestWorksSlice = createSlice({
  name: 'latestWorks',
  initialState,
  reducers: {
    clearLatestWorks: (state: LatestWorksState) => {
      state.latestWorks = [];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      getLatestWorks.fulfilled,
      (
        state: LatestWorksState,
        action: PayloadAction<Array<LatestWorkProps>>,
      ) => {
        const existingIds = new Set(state.latestWorks.map((w) => w.id));
        state.latestWorks = [
          ...state.latestWorks,
          ...action.payload.filter((w) => !existingIds.has(w.id)),
        ];
      },
    );
    builder.addCase(
      getLatestWork.fulfilled,
      (state: LatestWorksState, action: PayloadAction<LatestWorkProps>) => {
        state.currentLatestWork = action.payload;
        state.latestWorkNotFound = false;
      },
    );
    builder.addCase(getLatestWork.pending, (state: LatestWorksState) => {
      state.currentLatestWork = null;
      state.latestWorkNotFound = false;
    });
    builder.addCase(getLatestWork.rejected, (state: LatestWorksState) => {
      state.currentLatestWork = null;
      state.latestWorkNotFound = true;
    });
    builder.addCase(
      createLatestWork.fulfilled,
      (state: LatestWorksState, action: PayloadAction<LatestWorkProps>) => {
        state.latestWorks = [action.payload, ...state.latestWorks];
      },
    );
    builder.addCase(
      updateLatestWork.fulfilled,
      (state: LatestWorksState, action: PayloadAction<LatestWorkProps>) => {
        const updatedWork = action.payload;
        state.currentLatestWork = updatedWork;
        const index = state.latestWorks.findIndex(
          (w) => w.id === updatedWork.id,
        );
        if (index !== -1) {
          state.latestWorks[index] = updatedWork;
        }
      },
    );
    builder.addCase(
      deleteLatestWork.fulfilled,
      (state: LatestWorksState, action: PayloadAction<number>) => {
        state.latestWorks = state.latestWorks.filter(
          (w) => w.id !== action.payload,
        );
      },
    );
  },
});

export const { clearLatestWorks } = latestWorksSlice.actions;
export default latestWorksSlice.reducer;
