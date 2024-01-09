import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SessionAttr {
  token: string;
  userId: string;
}

const Sessionlice = createSlice({
  name: "session",
  initialState: {
    session: {} as SessionAttr,
  },
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
    },
  },
});

export const getSessions = (state: RootState) => state.session;
export const { setSession } = Sessionlice.actions;
export default Sessionlice.reducer;
