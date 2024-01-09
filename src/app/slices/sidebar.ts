import { createSlice } from "@reduxjs/toolkit";
const sidebar = createSlice({
  name: "sidebar",
  initialState: false,
  reducers: {
    toggle: (state) => !state,
  },
});

export const { toggle } = sidebar.actions;
const sidebarReducer = sidebar.reducer;
export default sidebarReducer;
