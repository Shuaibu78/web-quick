import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IInventory } from "../../interfaces/sales.interface";

type Cart = IInventory & {
  stock: number;
  price: number;
  image: string;
  count: number;
  discount: number;
  sellInPieces?: boolean;
  isDiscount?: boolean;
  showDropdown: boolean;
  sellInVariant?: string;
  variationId?: string;
  variationName?: string;
  index?: number;
};

interface IIntial {
  tabs: {
    [key: string]: {
      name: string;
      items: Cart[];
      id: number;
    };
  };
  isQuickCheckout: boolean;
}

const initialTabState = {
  tabs: {
    tab1: {
      name: "Sales Tab",
      items: [],
      id: 1,
    },
  },
  isQuickCheckout: false,
};

const initialState: IIntial = initialTabState;

const salesSlice = createSlice({
  name: "shops",
  initialState,
  reducers: {
    setReduxTabs(state, { payload }) {
      state.tabs = payload;
    },
    clearTabs(state) {
      state.tabs = {
        tab1: {
          name: "Sales Tab",
          items: [],
          id: 1,
        },
      };
    },
    setIsQuickCheckout(state, { payload }) {
      state.isQuickCheckout = payload;
    },
  },
});

export const getShops = (state: RootState) => state.shops.list;
export default salesSlice.reducer;
export const { setReduxTabs, clearTabs, setIsQuickCheckout } = salesSlice.actions;
export const getReduxTab = (state: RootState) => state.sales.tabs;
