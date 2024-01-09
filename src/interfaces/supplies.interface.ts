import { IInventory } from "./inventory.interface";

export interface SupplierAttr {
  supplierId?: string;
  firstName?: string;
  lastName?: string;
  shopId?: string;
  mobileNumber?: string;
  address?: string;
  SupplyRecord?: SupplyRecordAttr[];
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface SupplyRecordAttr {
  supplyRecordId?: string;
  supplierId?: string;
  comment?: string;
  shopId?: string;
  paymentStatus?: "UNPAID" | "PAID" | "PARTLY_PAID";
  totalAmount?: number;
  amountPaid?: number;
  isCollected?: boolean;
  SupplyItems?: SupplyItemAttr[];
  SupplyTransactions?: SupplyTransactionAttr[];
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface SupplyRecordInput {
  supplyRecordId?: string;
  supplierId?: string;
  comment?: string;
  shopId?: string;
  paymentStatus?: "UNPAID" | "PAID" | "PARTLY_PAID";
  totalAmount?: number;
  amountPaid?: number;
}

export interface SupplyItemAttr {
  supplyItemId?: string;
  supplyRecordId?: string;
  inventoryName?: string;
  inventoryId?: string;
  variationId?: string;
  shopId?: string;
  inventoryType?: "PIECES" | "VARIATION" | "PACK";
  quantity?: number;
  InventoryItem?: IInventory;
  purchasePrice?: number;
  SupplyRecord?: SupplyRecordAttr;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface SupplyTransactionAttr {
  supplyTransactionId?: string;
  supplyRecordId?: string;
  supplierId?: string;
  shopId?: string;
  amount?: string;
  comment?: string;
  paymentMethod?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface SupplierRequest {
  totals: {
    totalSupplierAmount: number;
    totalAmountPaid: number;
    totalAmountRemaining: number;
    totalSupplierCount: number;
  };
  suppliers: SupplierAttr[];
}
