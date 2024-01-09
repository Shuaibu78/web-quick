import { IOrderItems } from "./order.interface";
import { ISales } from "./sales.interface";

// Types for Financial Overview
interface ExpenditureCategory {
  expenditureCategoryId: string;
  parentId: string;
  expenditureCategoryName: string;
  shopId: string;
  updatedAt: string;
  createdAt: string;
}

interface Expenditure {
  expenditureId: string;
  expenditureName: string;
  amount: number;
  remark: string;
  expenditureCategoryId: string;
  ExpenditureCategory: ExpenditureCategory;
  shopId: string;
  userId: string;
  date: string;
  updatedAt: string;
  createdAt: string;
  dateCreated: string;
  dateUpdated: string;
}

interface FinancialOverview {
  totalExpenditure: number;
  totalCashInFlow: number;
  totalInventory: number;
  allExpenditure: Expenditure[];
  allOrderCount: number;
  pendingCount: number;
  processingCount: number;
  completedCount: number;
}

interface SalesReceipt {
  receiptId: string;
  deviceId: string;
  shopId: string;
  customerName: string;
  totalAmount: number;
  totalDiscount: number;
  paymentMethod: string;
  receiptNumber: string;
  cashierId: string;
  comment: string;
  isRefunded: boolean;
  refundedReceiptId: string;
  totalProfit: number;
  onCredit: boolean;
  userId: string;
  amountPaid: number;
  creditAmount: number;
  customerId: string;
  Sales: ISales[];
  totalTaxAmount: number;
  taxName: string;
  taxId: string;
  isTaxInclusive: boolean;
  totalDisplayedAmount: number;
  version: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface SalesOverviewInsights {
  totalSales: number;
  recentSales: ISales[];
  allSalesReceipt: SalesReceipt[];
}

interface OrderAndOverviewInsights {
  inventoriesCount: number;
  outOfStockCount: number;
  onlineCount: number;
  returnedCount: number;
  damagedCount: number;
  lostCount: number;
  totalAvailableQuantity: number;
  records: IOrderItems[];
}

// Export types
export type { FinancialOverview, SalesOverviewInsights, OrderAndOverviewInsights };
