import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { RootState } from "../store";
const status = createSlice({
  name: "status",
  initialState: {
    loading: false,
    error: false,
    success: false,
  },
  reducers: {
    isLoading: (state, { payload }) => {
      state.loading = payload;
    },
    isError: (state, { payload }) => {
      state.error = payload;
      if (payload) {
        toast.error("An error occured", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    },
    isSuccess: (state, { payload }) => {
      state.success = payload;
      if (payload) {
        toast.success("Success", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    },
  },
});

export const { isLoading, isSuccess, isError } = status.actions;
export const getLoading = (state: RootState) => state.status.loading;
export const getError = (state: RootState) => state.status.error;
export const getSuccess = (state: RootState) => state.status.success;
const statusReducer = status.reducer;
export default statusReducer;
