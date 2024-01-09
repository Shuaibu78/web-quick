import { createSlice } from "@reduxjs/toolkit";

interface IsalesFilter {
  productIdFilterList: string[];
  productFilterList: string[];
  userIdFilterList: string[];
  userFilterList: string[];
  selectedPayment: number;
  paymentFilter: string[];
  filterByDiscountSales: boolean;
  filterByRefundSales: boolean;
  productSearch: string;
  receiptNumber: string;
}

const initialState: IsalesFilter = {
  productIdFilterList: [],
  productFilterList: [],
  userIdFilterList: [],
  userFilterList: [],
  selectedPayment: -1,
  receiptNumber: "",
  paymentFilter: [],
  filterByDiscountSales: false,
  filterByRefundSales: false,
  productSearch: "",
};

const salesFilterSlice = createSlice({
  name: "salesFilter",
  initialState,
  reducers: {
    setProductIdFilterList(state, { payload }) {
      state.productIdFilterList = [...payload];
    },
    setProductFilterList(state, { payload }) {
      state.productFilterList = [...payload];
    },
    setUserIdFilterList(state, { payload }) {
      state.userIdFilterList = [...payload];
    },
    setUserFilterList(state, { payload }) {
      state.userFilterList = [...payload];
    },
    setPaymentFilter(state, { payload }) {
      state.paymentFilter = [...payload];
    },
    setSelectedPayment(state, { payload }) {
      state.selectedPayment = payload;
    },
    setFilterByDiscountSales(state, { payload }) {
      state.filterByDiscountSales = payload;
    },
    setFilterByRefundSales(state, { payload }) {
      state.filterByRefundSales = payload;
    },
    setProductSearch(state, { payload }) {
      state.productSearch = payload;
    },
    setReceiptNumber(state, { payload }) {
      state.receiptNumber = payload;
    },
  },
});

export default salesFilterSlice.reducer;
export const {
  setProductIdFilterList,
  setProductFilterList,
  setUserIdFilterList,
  setUserFilterList,
  setPaymentFilter,
  setSelectedPayment,
  setFilterByDiscountSales,
  setFilterByRefundSales,
  setProductSearch,
  setReceiptNumber,
} = salesFilterSlice.actions;
