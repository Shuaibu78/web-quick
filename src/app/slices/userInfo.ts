import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface IIntial {
  userId?: string;
  businessName?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  email?: string;
  mobileNumber?: string;
}
const initialState: IIntial = {};
const userInfoSlice = createSlice({
  name: "userInfo",
  initialState,
  reducers: {
    setUserInfo(state, { payload }) {
      state.businessName = payload?.businessName;
      state.userId = payload?.userId;
      state.firstName = payload?.firstName;
      state.lastName = payload?.lastName;
      state.fullName = payload?.fullName;
      state.email = payload?.email;
      state.mobileNumber = payload?.mobileNumber;
    },
  },
});

export const getCurrentUser = (state: RootState) => state.user;
export default userInfoSlice.reducer;
export const { setUserInfo } = userInfoSlice.actions;
