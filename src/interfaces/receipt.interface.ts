import { ISales } from "./sales.interface";
import { UsersAttr } from "./user.interface";
export interface IReceipt {
  receiptId: string;
  deviceId: string;
  shopId: string;
  customerName: string;
  totalAmount: number;
  totalDiscount: number;
  paymentMethod: string;
  receiptNumber: number;
  cashierId: string;
  comment: string;
  isRefunded: boolean;
  refundedReceiptId: string;
  totalProfit: number;
  onCredit: boolean;
  userId: string;
  amountPaid: number;
  creditAmount: number;
  isTaxInclusive?: boolean;
  taxId?: string;
  taxName?: string;
  totalTaxAmount?: number;
  Sales: ISales[];
  User?: UsersAttr;
  CustomerTransaction?: {
    customerTransactionId?: string;
    customerId?: string;
    shopId?: string;
    receiptId?: string;
    amount?: number;
    isCredit?: boolean;
    date?: Date;
    comment?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
  };
  totalDisplayedAmount?: number;
  version?: number;
  Cashier?: UsersAttr;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
export interface IAllReceipt {
  totalReceipt: number;
  totalPos: number;
  totalCash: number;
  totalTransfer: number;
  totalProfit: number;
  totalDiscount: number;
  totalSurplus: number;
  totalCredit: number;
  totalSales: number;
  totalRefundAmount: number;
  receipts: IReceipt[];
}
