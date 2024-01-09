import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface syncStatusType {
  status: boolean;
}

const initialState: syncStatusType = {
  status: false,
};

const syncStatus = createSlice({
  name: "status",
  initialState,
  reducers: {
    getSyncStatus: (state, { payload }) => {
      state.status = payload;
    },
  },
});

export const { getSyncStatus } = syncStatus.actions;
export const currentSyncStatus = (state: RootState) => state.syncStatus;
export default syncStatus.reducer;
