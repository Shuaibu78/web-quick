import { userSchema } from "./auth.schema";
import { gql } from "@apollo/client";
import { salesSchema } from "./sales.schema";

export const customerTransactionSchema = `
  customerTransactionId
  customerId
  receiptId
  amount
  isCredit
  date
  comment
  shopId
  updatedAt
  createdAt
`;

export const receiptSchema = `
    receiptId
    deviceId
    shopId
    customerName
    totalAmount
    totalDiscount
    paymentMethod
    receiptNumber
    cashierId
    Cashier {
      ${userSchema}
    }
    User {
      ${userSchema}
    }
    totalDisplayedAmount
    comment
    isRefunded
    refundedReceiptId
    totalProfit
    onCredit
    userId
    customerId
    creditAmount
    totalTaxAmount
    taxName
    taxId
    isTaxInclusive
    Sales {
      ${salesSchema}
    }
    CustomerTransaction {
      ${customerTransactionSchema}
    }
    version
    amountPaid
    createdAt
    updatedAt
    deletedAt
`;

export const GET_ALL_SALES_RECEIPT = gql`
query getAllSalesReceipts(
  $shopId: ID!,
  $limit: Int,
  $page: Int,
  $from: String,
  $to: String,
  $paymentMethods: [String],
  $userIds: [String],
  $onCredit: Boolean,
  $isRefundedSales: Boolean,
  $isDiscountSales: Boolean,
  $receiptNumberSearch: String,
) {
    getAllSalesReceipt(shopId: $shopId, limit: $limit, page: $page, from: $from, to: $to, paymentMethods: $paymentMethods, userIds: $userIds, onCredit: $onCredit, isRefundedSales: $isRefundedSales, receiptNumberSearch: $receiptNumberSearch, isDiscountSales: $isDiscountSales) {
      totalReceipt,
      receipts {
        ${receiptSchema}
      }
    }
}
`;

export const GET_SALES_RECEIPT = gql`
  query GetSalesReceipt($receiptId: ID!) {
    getSalesReceipt(receiptId: $receiptId) {
      ${receiptSchema}
    }
  }
`;

export const GET_ALL_SALES_OVERVIEW_COUNT = gql`
  query getAllSalesOverviewCount(
    $shopId: ID!
    $limit: Int
    $page: Int
    $from: String
    $to: String
    $paymentMethods: [String]
    $userIds: [String]
    $onCredit: Boolean
    $isRefundedSales: Boolean
    $isDiscountSales: Boolean
    $receiptNumberSearch: String
  ) {
    getAllSalesOverviewCount(
      shopId: $shopId
      limit: $limit
      page: $page
      from: $from
      to: $to
      paymentMethods: $paymentMethods
      userIds: $userIds
      onCredit: $onCredit
      isRefundedSales: $isRefundedSales
      receiptNumberSearch: $receiptNumberSearch
      isDiscountSales: $isDiscountSales
    ) {
      totalPos
      totalCash
      totalSales
      totalTransfer
      totalProfit
      totalDiscount
      totalSurplus
      totalCredit
      totalRefundAmount
    }
  }
`;
