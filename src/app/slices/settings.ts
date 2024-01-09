import { createSlice } from "@reduxjs/toolkit";

interface TopNavType {
  topNavProp:
    | "Business Settings"
    | "Profile Settings"
    | "Security Settings"
    | "Notifications"
    | "Privacy and Policy"
    | "Tax";
  businessSettingsProp:
    | "Business Details"
    | "Checkout Options"
    | "Product Categories"
    | "Income Categories"
    | "Expense Categories"
    | "Shop Tables/Tags"
    | "Table Scanner"
    | "Tax Settings"
    | "Printer Settings"
    | "Theme Settings";
}

const initialState: TopNavType = {
  topNavProp: "Business Settings",
  businessSettingsProp: "Business Details",
};

const settingsPageProps = createSlice({
  name: "settingsPageProps",
  initialState,
  reducers: {
    setTopNavProp: (state, { payload }) => {
      state.topNavProp = payload;
    },
    setBusinessSettingsProp: (state, { payload }) => {
      state.businessSettingsProp = payload;
    },
  },
});

export const { setTopNavProp, setBusinessSettingsProp } = settingsPageProps.actions;
const settingsPagePropsReducer = settingsPageProps.reducer;
export default settingsPagePropsReducer;
