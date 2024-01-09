import { IShop } from "./shop.interface";

export interface IInventoryCategory {
  inventoryCategoryId?: string;
  inventorycategoryName?: string;
  shopId?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface ISupplies {
  supplyId: string;
  shopId: string;
  userId: string;
  variationId: string;
  inventoryId: string;
  inventoryName: string;
  inventoryExpiryDate: Date;
  quantity: number;
  costPrice: number;
  updatedAt: Date;
  createdAt: Date;
  dateCreated: Date;
  dateUpdated: Date;
}

export interface IVariations {
  variationId?: string;
  variationName?: string;
  inventoryId?: string;
  price?: number;
  cost?: number;
  shopId?: string;
}

export type InventoryType = "PIECES" | "PACK" | "VARIATION" | "PIECES_AND_PACK" | "NON_TRACKABLE";

export interface VariationTypeAttr {
  variationTypeId?: string;
  type?: string;
  inventoryId?: string;
  shopId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IInventoryImage {
  imageId?: string;
  shopId?: string;
  userId?: string;
  inventoryId?: string;
  localURL?: string;
  smallImageOnlineURL?: string;
  mediumImageOnlineURL?: string;
  largeImageOnlineURL?: string;
  imageApprovalStatus?: string;
  rejectionReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IInventory {
  inventoryId?: string;
  inventoryName?: string;
  inventoryDescription?: string;
  inventoryType?: "PIECES" | "PACK" | "VARIATION" | "PIECES_AND_PACK" | "NON_TRACKABLE";
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
  InventoryCategory?: IInventoryCategory;
  shopId?: string;
  isPublished?: boolean;
  trackable?: boolean;
  quantityInPacks?: number;
  quantityInPieces?: number;
  isVariation?: boolean;
  isLowProductAlertEnabled?: boolean;
  createdAt?: string;
  Shop?: IShop;
  Variations?: IVariations[];
  batchNo?: string;
  brand?: string;
  checked?: boolean;
  returnPolicy?: string;
  isOnlineDiscountEnabled?: boolean;
  Images?: IInventoryImage[];
  InventoryQuantity?: [
    {
      inventoryId?: string;
      variationId?: string;
      positiveSupply?: number;
      quantity?: number;
    }
  ];
  barcode?: string;
  VariationType?: VariationTypeAttr[];
  TrackableItem?: TrackabeItem;
  NonTrackableItem?: NonTrackableItem;
  Supplies?: ISupplies[];
  isActive?: boolean;
}

export interface TrackabeItem {
  unitPiecesCostPrice?: number;
  unitPackCostPrice?: number;
  perPack?: number;
  unitPrice?: number;
  packPrice?: number;
  alertSent?: boolean;
  inventoryName?: string;
  lowAlertQuantity?: number;
  measurementUnitPieces?: string;
  measurementUnitPack?: string;
}

interface NonTrackableItem {
  nonTrackableItemsId?: string;
  inventoryId?: string;
  costPrice?: number;
  sellingPrice?: number;
  fixedSellingPrice?: boolean;
  measurementUnit?: string;
}

export interface ISupply {
  supplyId?: string;
  shopId?: string;
  userId?: string;
  inventoryId?: string;
  inventoryName?: string;
  quantityInPieces?: number;
  quantityInPacks?: number;
  quantity?: number;
  inventoryExpiryDate?: string;
  costPrice?: number;
  updatedAt?: string;
  createdAt?: string;
}
export interface ITrackableItem {
  trackableItemsId?: string;
  shopId?: string;
  inventoryId?: string;
  unitPiecesCostPrice?: number;
  unitPackCostPrice?: number;
  perPack?: number;
  unitPrice?: number;
  packPrice?: number;
  alertSent?: boolean;
  lowAlertQuantity?: boolean;
  createdAt?: string;
  updatedAt?: string;
  inventoryName?: string;
  unitSellingPrice?: number;
  packSellingPrice?: number;
  maximumDiscountPieces?: number;
  maximumDiscountPack?: number;
  isPercent?: boolean;
}
export interface INonTrackableItem {
  nonTrackableItemsId?: string;
  shopId?: string;
  inventoryId?: string;
  costPrice?: number;
  sellingPrice?: number;
  fixedSellingPrice?: number;
  createdAt?: string;
  updatedAt?: string;
  maximumDiscount?: number;
  isPercent?: boolean;
}

export interface ICustomerTransactions {
  customerTransactionId: string;
  parentCustomerTransactionId: string;
  customerId?: string;
  receiptId?: string;
  amount?: number;
  isCredit?: boolean;
  date?: string;
  comment?: string;
  shopId?: string;
  updatedAt?: string;
  createdAt?: string;
  dueDate?: string;
  emailReminderEnabled?: boolean;
  smsReminderEnabled?: boolean;
}
export interface ICustomer {
  customerId: string;
  customerName: string;
  address: string;
  phoneNumber: string;
  email: string;
  shopId: string;
  updatedAt: string;
  createdAt: string;
  creditLimit: string;
  CustomerTransactions: [ICustomerTransactions];
}
export interface IInventoryHistory {
  stockAdjustmentHistoryId?: string;
  inventoryId?: string;
  shopId?: string;
  salesId?: string;
  supplyId?: string;
  adjustmentQuantity?: number;
  adjustmentType?: string;
  price?: number;
  reason?: string;
  notes?: string;
  userId?: string;
  totalCost?: number;
  unitCost?: number;
  inventoryType?: string;
  inventoryExpiryDate?: string;
  inventoryName?: string;
  Inventory?: IInventory;
  previousCostPrice?: number;
  previousSellingPrice?: number;
  previousQuantity?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface IGetOverViewCount {
  inventoriesCount?: number;
  outOfStockCount?: number;
  onlineCount?: number;
  returnedCount?: number;
  damagedCount?: number;
  lostCount?: number;
  totalAvailableQuantity?: number;
}

export interface IProductHistoryRecord {
  productHistoryId: string;
  shopId: string;
  userId: string;
  userEmail: string;
  inventoryId: string;
  variationId: string;
  inventoryName: string;
  inventoryType: string;
  value: string;
  isValueIncreased: boolean;
  newValue: number;
  type: string;
  comment: string;
  amount: number;
  profit: number;
  User: {
    userId: string;
    businessName: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    mobileNumber: number;
    merchantId: string;
    isMerchant: string;
    updatedAt: string;
    createdAt: string;
    lastSeen: string;
    lastAction: string;
  };
  isQuantityChange: boolean;
  displayType: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface IProductHistory {
  records: [IProductHistoryRecord];
  totalSales: number;
  totalProfit: number;
  totalLoss: number;
  totalDamage: number;
  currentQuantity: number;
  totalQuantitySold: number;
}

export interface ITransactionData {
  customerTransactionId?: string;
  parentCustomerTransactionId?: string;
  shopId?: string;
  customerId?: string;
  receiptId: string | null;
  amount: number;
  smsReminderEnabled: boolean;
  emailReminderEnabled: boolean;
  paymentMethod: "cash" | "pos" | "transfer";
  dueDate: string | null;
  isCredit: boolean;
  comment?: string;
  updatedAmount?: number;
}
