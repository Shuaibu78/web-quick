import { createSlice } from "@reduxjs/toolkit";

interface accountLockType {
  isLockModalActive: boolean;
  noPermisssionModalActive: boolean;
  isNoProductModalActive: boolean;
  isSwitchigShops: boolean;
  showSelectShop: boolean;
  preLockModal: boolean;
  lock: boolean;
}

const initialState: accountLockType = {
  isLockModalActive: false,
  noPermisssionModalActive: false,
  isNoProductModalActive: false,
  isSwitchigShops: false,
  showSelectShop: false,
  preLockModal: false,
  lock: false,
};

const accountLock = createSlice({
  name: "accountLock",
  initialState,
  reducers: {
    showLockModal: (state) => {
      state.isLockModalActive = true;
    },
    setShowSelectShop: (state) => {
      state.showSelectShop = true;
    },
    hideShowSelectShop: (state) => {
      state.showSelectShop = false;
    },
    lock: (state, { payload }) => {
      state.lock = payload.lock;
    },

    closeLockModal: (state) => {
      state.isLockModalActive = false;
    },
    showPreLockModal: (state) => {
      state.preLockModal = true;
    },

    closePreLockModal: (state) => {
      state.preLockModal = false;
    },

    setNoPermissionModal: (state, { payload }) => {
      state.noPermisssionModalActive = payload;
    },

    setIsNoProductModal: (state, { payload }) => {
      state.isNoProductModalActive = payload;
    },

    setIsSwitchingShops: (state, { payload }) => {
      state.isSwitchigShops = payload;
    },
  },
});

export const {
  lock,
  showLockModal,
  closeLockModal,
  setNoPermissionModal,
  setIsNoProductModal,
  setIsSwitchingShops,
  showPreLockModal,
  closePreLockModal,
  setShowSelectShop,
  hideShowSelectShop,
} = accountLock.actions;
const accountLockReducer = accountLock.reducer;
export default accountLockReducer;
