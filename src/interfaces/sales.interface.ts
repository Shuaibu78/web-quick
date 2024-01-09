import { ICustomerTransactions, IInventoryImage } from "./inventory.interface";

export interface TrackabeItem {
  unitPiecesCostPrice?: number;
  unitPackCostPrice?: number;
  perPack?: number;
  unitPrice?: number;
  packPrice?: number;
  alertSent?: boolean;
  inventoryName?: string;
  lowAlertQuantity?: number;
}

export interface IInventory {
  inventoryId?: string;
  inventoryName?: string;
  inventoryDescription?: string;
  quantity?: number;
  fixedUnitPrice?: number;
  minUnitPrice?: number;
  maxUnitPrice?: number;
  isUnitFixed?: number;
  costPrice?: number;
  minPackPrice?: number;
  maxPackPrice?: number;
  fixedPackPrice?: number;
  isPackFixed?: boolean;
  perPack?: number;
  inventoryCategoryId?: string;
  shopId?: string;
  isPublished?: boolean;
  trackable?: boolean;
  quantityInPacks?: number;
  quantityInPieces?: number;
  isVariation?: boolean;
  isLowProductAlertEnabled?: boolean;
  createdAt?: string;
  TrackableItem?: TrackabeItem;
  Images?: IInventoryImage[];
  inventoryType?: "PIECES" | "PACK" | "VARIATION" | "PIECES_AND_PACK" | "NON_TRACKABLE";
}

export interface ISales {
  salesId?: string;
  receiptId?: string;
  paymentMethod?: string;
  shopId?: string;
  userId?: string;
  inventoryId?: string;
  inventoryName?: string;
  quantity?: number;
  amount?: number;
  discount?: number;
  isRealDiscount?: boolean;
  inventoryType?: string;
  profit?: number;
  pack?: boolean;
  updatedAt?: string;
  createdAt?: string;
  dateCreated?: string;
  dateUpdated?: string;
  Inventory?: IInventory;
  displayedAmount?: number;
  taxAmount?: number;
  taxName?: string;
  taxId?: string;
  isTaxInclusive?: boolean;
}
export interface ISalesReceipt {
  receiptId?: string;
  deviceId?: string;
  shopId?: string;
  customerName?: string;
  customerId?: string;
  totalAmount?: number;
  totalDiscount?: number;
  paymentMethod?: string;
  receiptNumber?: string;
  cashierId?: string;
  comment?: string;
  isRefunded?: boolean;
  refundedReceiptId?: string;
  totalProfit?: number;
  onCredit?: boolean;
  userId?: string;
  amountPaid?: number;
  Sales?: ISales[];
  CustomerTransaction?: ICustomerTransactions;
  totalDisplayedAmount?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}
export interface IAllSales {
  totalSales: number;
  sales: ISales[];
}
