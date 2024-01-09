import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface IBatchSlice {
  payload: {
    isBatchProduct: boolean;
    batchId?: string;
    batchNumber?: string;
    expiryDate?: Date;
  };
}

const initialState: IBatchSlice["payload"] = {
  isBatchProduct: false,
  batchId: "",
  batchNumber: "",
  expiryDate: undefined,
};
const batchSlice = createSlice({
  name: "batch",
  initialState,
  reducers: {
    setBatchProduct(state, action: IBatchSlice) {
      state.isBatchProduct = action.payload.isBatchProduct;
      state.batchId = action.payload.batchId;
      state.batchNumber = action.payload.batchNumber;
      state.expiryDate = action.payload.expiryDate;
    },
  },
});

export const getBatchProduct = (state: RootState) => state.batch;
export default batchSlice.reducer;
export const { setBatchProduct } = batchSlice.actions;
