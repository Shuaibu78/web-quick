import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
  isEdit: false,
};
const isEditSlice = createSlice({
  name: "isEdit",
  initialState,
  reducers: {
    setIsEdit(state, { payload }) {
      state.isEdit = payload;
    },
  },
});

export const getIsEdit = (state: RootState) => state.isEdit;
export default isEditSlice.reducer;
export const { setIsEdit } = isEditSlice.actions;
