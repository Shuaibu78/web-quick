import { IShop } from "./../../interfaces/shop.interface";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface IIntial {
  list: any[];
  currentShop: IShop;
  syncTableUpdateCount: {
    [key: string]: number;
  };
}

const initialState: IIntial = {
  list: [],
  currentShop: {},
  syncTableUpdateCount: {},
};

const shopsSlice = createSlice({
  name: "shops",
  initialState,
  reducers: {
    setShops(state, { payload }) {
      if (payload) {
        state.list = [...payload];
      }
    },
    setCurrentShop(state, { payload }) {
      if (!payload) {
        state.currentShop = {};
        return;
      }

      state.currentShop.shopId = payload.shopId;
      state.currentShop.shopName = payload.shopName;
      state.currentShop.currencyCode = payload.currencyCode;
      state.currentShop.shopAddress = payload.shopAddress;
      state.currentShop.shopPhone = payload.shopPhone;
      state.currentShop.discountEnabled = payload.discountEnabled;
      state.currentShop.maximumDiscount = payload.maximumDiscount;
      state.currentShop.userId = payload.userId;
      state.currentShop.shopCategoryName = payload.shopCategoryName;
      state.currentShop.shopCategoryId = payload.shopCategoryId;
      state.currentShop.isPublished = payload.isPublished;
      state.currentShop.Images = payload.Images;
      state.currentShop.isExpiryDateEnabled = payload.isExpiryDateEnabled;
    },
    increaseSyncCount(state, { payload }) {
      const tableNames = payload;
      const syncTableUpdateCount = { ...state.syncTableUpdateCount };
      tableNames.forEach((tableName: string) => {
        syncTableUpdateCount[tableName] = (syncTableUpdateCount[tableName] ?? 0) + 1;
      });
      state.syncTableUpdateCount = syncTableUpdateCount;
    },
  },
});

export const getShops = (state: RootState) => state.shops.list;
export default shopsSlice.reducer;
export const { setShops, setCurrentShop, increaseSyncCount } = shopsSlice.actions;
export const getCurrentShop = (state: RootState) => state.shops.currentShop;
