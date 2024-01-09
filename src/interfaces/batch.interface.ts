import { IInventory } from "./inventory.interface";

export interface IBatch {
  batchId?: string;
  shopId?: string;
  batchNumber?: string;
  manufacturerNumber?: string;
  expiryDate?: Date;
  dateAdded?: Date;
  checked?: boolean;
  description?: string;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface IShopBatches {
  totalBatchProductsQty: number;
  batchInventoryCount: number[];
  totalBatchProductsValue: number;
  totalBatches: number;
  batches: IBatch[];
}

export interface IBatchProducts {
  totalCount: number;
  totalQuantity: number;
  totalValue: number;
  totalInventories: number;
  batchInventories: [IInventory];
}
