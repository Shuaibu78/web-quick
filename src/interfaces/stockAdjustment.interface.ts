/* eslint-disable no-unused-vars */
import { IInventory } from "./inventory.interface";
import { IShop } from "./shop.interface";

export enum ADJUSTMENT_TYPE {
  addition = "ADDITION",
  subtraction = "SUBTRACTION",
  reset = "RESET",
}
export type ReasonAttr = "RESTOCK" | "RETURN" | "LOST" | "DAMAGE" | "RESET" | "";

export interface IStockAdjustmentHistory {
  stockAdjustmentHistoryId?: string;
  shopId?: string;
  inventoryId?: string;
  adjustmentQuantity?: number;
  adjustmentType?: ADJUSTMENT_TYPE;
  price?: number;
  reason?: ReasonAttr;
  notes?: string;
  inventoryType?: string;
  dirty?: boolean;
  inventoryName?: string;
  Inventory?: IInventory;
  Shops?: IShop;
  userId?: string;
  previousCostPrice?: number;
  previousSellingPrice?: number;
  previousQuantity?: number;
  inventoryExpiryDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
