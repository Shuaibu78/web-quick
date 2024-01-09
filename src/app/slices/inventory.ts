import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { IInventory } from "../../interfaces/inventory.interface";

const initialState: IInventory = {};
const singleInventorySlice = createSlice({
  name: "singleInventory",
  initialState,
  reducers: {
    setSingleInventory(state, { payload }) {
      state.inventoryId = payload.inventoryId;
      state.inventoryName = payload.inventoryName;
      state.inventoryDescription = payload.inventoryDescription;
      state.quantity = payload.quantity;
      state.fixedUnitPrice = payload.fixedUnitPrice;
      state.minUnitPrice = payload.minUnitPrice;
      state.maxUnitPrice = payload.maxUnitPrice;
      state.isUnitFixed = payload.isUnitFixed;
      state.costPrice = payload.costPrice;
      state.minPackPrice = payload.minPackPrice;
      state.maxPackPrice = payload.maxPackPrice;
      state.fixedPackPrice = payload.fixedPackPrice;
      state.isPackFixed = payload.isPackFixed;
      state.perPack = payload.perPack;
      state.inventoryCategoryId = payload.inventoryCategoryId;
      state.shopId = payload.shopId;
      state.isPublished = payload.isPublished;
      state.trackable = payload.trackable;
      state.InventoryCategory = payload.InventoryCategory;
      state.quantityInPacks = payload.quantityInPacks;
      state.quantityInPieces = payload.quantityInPieces;
      state.isVariation = payload.isVariation;
      state.Shop = payload.Shop;
      state.Variations = payload.Variations;
      state.Images = payload.Images;
      state.TrackableItem = payload.TrackableItem;
      state.NonTrackableItem = payload.NonTrackableItem;
      state.InventoryQuantity = payload.InventoryQuantity;
      state.inventoryType = payload.inventoryType;
      state.VariationType = payload.VariationType;
      state.barcode = payload.barcode;
      state.batchNo = payload.batchNo;
      state.brand = payload.brand;
      state.returnPolicy = payload.returnPolicy;
      state.Supplies = payload.Supplies;
    },
  },
});

export const getSingleInventory = (state: RootState) => state.singleInventory;
export default singleInventorySlice.reducer;
export const { setSingleInventory } = singleInventorySlice.actions;
