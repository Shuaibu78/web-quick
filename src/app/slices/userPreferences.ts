import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUserPreferencesType {
  preferences: IPreferences[];
}

export interface IPreferences {
  userId: string;
  appSize: string;
  hideSalesNav: boolean;
  hideProductsNav: boolean;
}

const initialState: IUserPreferencesType = {
  preferences: [
    {
      userId: "",
      appSize: "14px",
      hideSalesNav: true,
      hideProductsNav: true,
    },
  ],
};

const userPreferences = createSlice({
  name: "userPreferences",
  initialState,
  reducers: {
    setUserPreference: (state, { payload }: PayloadAction<IPreferences>) => {
      const { userId, hideProductsNav, hideSalesNav, appSize } = payload;
      const userPreference = state.preferences.find((user) => user.userId === userId);

      if (!userPreference) {
        state.preferences.push({
          userId: userId,
          appSize: appSize,
          hideProductsNav: hideProductsNav,
          hideSalesNav: hideSalesNav,
        });
      }
    },
    setHideSalesNav: (state, { payload }: PayloadAction<IPreferences>) => {
      const { userId, hideSalesNav } = payload;
      const userPreference = state.preferences.find((user) => user.userId === userId);

      if (userPreference) {
        userPreference.hideSalesNav = hideSalesNav;
      }
    },
    updateAppSize: (state, { payload }: PayloadAction<IPreferences>) => {
      const { userId, appSize } = payload;
      const userPreference = state.preferences.find((user) => user.userId === userId);

      if (userPreference) {
        userPreference.appSize = appSize;
      }
    },
    setHideProductNav: (state, { payload }: PayloadAction<IPreferences>) => {
      const { userId, hideProductsNav } = payload;
      const userPreference = state.preferences.find((user) => user.userId === userId);

      if (userPreference) {
        userPreference.hideProductsNav = hideProductsNav;
      }
    },
  },
});

export const { setUserPreference, setHideProductNav, setHideSalesNav, updateAppSize } =
  userPreferences.actions;
const userPreferencesReducer = userPreferences.reducer;
export default userPreferencesReducer;
