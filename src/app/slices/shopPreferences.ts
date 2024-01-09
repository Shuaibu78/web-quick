import { createSlice } from "@reduxjs/toolkit";

export interface IPreferences {
  shouldMakeSalesWithoutCashier: boolean;
}

const initialState = {
  shouldMakeSalesWithoutCashier: false,
};
const shopPreferences = createSlice({
  name: "shopPreferences",
  initialState,
  reducers: {
    toggleMustMakeSaleWithCashier: (state, { payload }) => {
      state.shouldMakeSalesWithoutCashier = payload;
    },
  },
});

export const { toggleMustMakeSaleWithCashier } = shopPreferences.actions;
const shopPreferencesReducer = shopPreferences.reducer;
export default shopPreferencesReducer;
