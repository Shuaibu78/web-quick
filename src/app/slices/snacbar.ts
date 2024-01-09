import { createSlice } from "@reduxjs/toolkit";
import { SnackbarType } from "../../components/snackbar/snackbar";
import { RootState } from "../store";

interface snackbarType {
  toggleSnackbar: boolean;
  snackbarMessage: string | null;
  color?: SnackbarType;
}

const initialState: snackbarType = {
  toggleSnackbar: false,
  snackbarMessage: null,
  color: "DEFAULT",
};

const snackbarStatus = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    toggleSnackbarOpen: (state, { payload }) => {
      state.toggleSnackbar = true;

      let incomingMessage: string;
      let color: SnackbarType = "DEFAULT";
      if (typeof payload === "object") {
        incomingMessage = payload.message;
        color = payload.color;
      } else {
        incomingMessage = payload;
      }
      const message = incomingMessage.includes("https://")
        ? "Error! Check your network connection"
        : incomingMessage;
      state.snackbarMessage = message;
      state.color = color;
    },
    toggleSnackbarClose: (state) => {
      state.toggleSnackbar = false;
      state.snackbarMessage = null;
    },
  },
});

export const { toggleSnackbarOpen, toggleSnackbarClose } = snackbarStatus.actions;
export const currentSyncStatus = (state: RootState) => state.syncStatus;
export default snackbarStatus.reducer;
