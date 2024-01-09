import { createSlice } from "@reduxjs/toolkit";

const modalSlice = createSlice({
  name: "modal",
  initialState: {
    payBalanceModal: false,
    showModal: false,
    editSupplier: false,
  },
  reducers: {
    setPayBalanceModal: (state, action) => {
      state.payBalanceModal = action.payload;
    },
    setShowModal: (state, action) => {
      state.showModal = action.payload;
    },
    setEditSupplier: (state, action) => {
      state.editSupplier = action.payload;
    },
  },
});

export const { setPayBalanceModal, setShowModal, setEditSupplier } = modalSlice.actions;
export default modalSlice.reducer;
