export type PackageData = {
  packageName: string;
  shopCount: number;
  staffCount: number;
  inventoryCount: number;
  debtorCount: number;
  receiptPrintingCount: number;
  pricePerMonth: number;
  pricePerYear: number;
  pricePerMonthUSD: number;
  pricePerYearUSD: number;
  percentageOff: number;
  packageNumber: number;
  additionalFeatures: string[];
  featuresToDisplay: string[];
};

export type ISubscriptionInitial = {
  autorenewal: boolean;
  createdAt: Date;
  deletedAt: Date;
  expiryDate: string;
  gracePeriodExpiryDate: string;
  packageName: string;
  packageNumber: number;
  recurrence: string;
  updatedAt: string;
  userId: string;
  userSubscriptionId: string;
};

export type IAdditionalFeatures = {
  check:
    | "LowProductAlert"
    | "ExpiryDateNotification"
    | "WeeklyAndMonthlyReport"
    | "Invoice"
    | "PendingCheckout"
    | "AdditionalShopSecurityUsingOTP"
    | "DesktopAppUsage"
    | "Supplies"
    | "ProductTransfer"
    | "AdvanceReport"
    | "KitchenOrder"
    | "inventory"
    | "debt";
  featureCount: {
    inventoriesCount: number;
    debtCount: number;
  };
};
