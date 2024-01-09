import { gql } from "@apollo/client";
import { userSchema } from "./auth.schema";
import { customerTransactionSchema } from "./receipt.schema";

export const inventorySchema = `
  inventoryName
  inventoryId
  inventoryDescription
  inventoryCategoryId
  quantityInPacks
  quantityInPieces
  fixedUnitPrice
  isUnitFixed
  minUnitPrice
  maxUnitPrice
  costPrice
  minPackPrice
  maxPackPrice
  isPackFixed
  fixedPackPrice
  shopId
  isLowProductAlertEnabled
  trackable
  isVariation
  quantity
  createdAt
  inventoryType
  TrackableItem {
    trackableItemsId
    shopId
    inventoryId
    unitPiecesCostPrice
    unitPackCostPrice
    perPack
    unitPrice
    packPrice
    alertSent
    lowAlertQuantity
  }
  Images {
    largeImageOnlineURL
    mediumImageOnlineURL
    smallImageOnlineURL
    localURL
  }
`;

export const salesSchema = `
    salesId
    receiptId
    paymentMethod
    shopId
    userId
    inventoryId
    inventoryName
    quantity
    amount
    discount
    isRealDiscount
    inventoryType
    Inventory {
        ${inventorySchema}
    }
    displayedAmount
    taxAmount
    taxName
    taxId
    isTaxInclusive
    profit
    pack
    updatedAt
    createdAt
    dateCreated
    dateUpdated
`;

export const salesSchemas = `
    salesId
    receiptId
    paymentMethod
    shopId
    userId
    inventoryId
    inventoryName
    quantity
    amount
    discount
    isRealDiscount
    inventoryType
    profit
    pack
    displayedAmount
    taxAmount
    taxName
    taxId
    isTaxInclusive
    Inventory {
        ${inventorySchema}
    }
    updatedAt
    createdAt
    dateCreated
    dateUpdated
`;

export const salesReceipt = `
    receiptId
    deviceId
    shopId
    customerName
    customerId
    totalAmount
    totalDiscount
    paymentMethod
    receiptNumber
    comment
    isRefunded
    refundedReceiptId
    totalProfit
    onCredit
    amountPaid
    creditAmount
    customerId
    totalDisplayedAmount
    Sales {
        ${salesSchema}
    }
    User {
        ${userSchema}
    }
    Cashier {
        ${userSchema}
    }
    CustomerTransaction {
        customerTransactionId
        parentCustomerTransactionId
        customerId
        receiptId
        amount
        isCredit
        date
        comment
        shopId
        updatedAt
        createdAt
    }
    createdAt
    updatedAt
    deletedAt
    isTaxInclusive
    taxId
    taxName
    version
    totalTaxAmount
`;

export const receipt = `
    receiptId
    deviceId
    shopId
    customerName
    totalAmount
    totalDiscount
    paymentMethod
    receiptNumber
    comment
    isRefunded
    refundedReceiptId
    totalProfit
    onCredit
    amountPaid
    createdAt
    updatedAt
    deletedAt
`;

export const multiplePaymentMethod = `
   paymentMethod
   amount
`;

export const GET_ALL_SALES = gql`
    query getAllSales(
            $shopId: ID!,
            $limit: Int,
            $page: Int,
            $from: String,
            $receiptId: ID,
            $to: String,
            $paymentMethods: [String],
            $userIds: [String],
            $inventoryIds: [String],
            $isDiscountSales: Boolean,
        ) {
        getAllSales(shopId: $shopId, receiptId: $receiptId, limit: $limit, page: $page, from: $from, to: $to, paymentMethods: $paymentMethods, userIds: $userIds, inventoryIds: $inventoryIds, isDiscountSales: $isDiscountSales) {
            sales {
                ${salesSchemas}
            }
            totalSales
        }
    }
`;

export const GET_RECENT_SALES = gql`
    query getRecentSales($shopId: ID!, $from: String
            $to: String) {
        getRecentSales(shopId: $shopId, from: $from
            to: $to) {
            ${salesSchema}
        }
    }
`;

export const CREATE_SALES = gql`
    mutation makeSale(
        $shopId: ID!,
        $customerName: String,
        $totalAmount: Float!,
        $discount: Float,
        $comment: String,
        $onCredit: Boolean,
        $amountPaid: Float,
        $salesItems:  [SalesItem!]!,
        $paymentMethod: String,
        $creditAmount: Float,
        $cashierId: ID,
        $customerId: ID,
        $userId: ID,
        $totalTaxAmount: Float,
        $taxName: String,
        $taxId: String,
        $dueDate: String,
        $createdAt: String,
        $isTaxInclusive: Boolean,
        $multiplePaymentMethod: [MultiplePaymentMethod],
    ) {
        makeSale(
        shopId: $shopId, 
        customerName: $customerName, 
        totalAmount: $totalAmount, 
        discount: $discount,
        comment: $comment, 
        onCredit: $onCredit, 
        amountPaid: $amountPaid, 
        salesItems: $salesItems,
        paymentMethod: $paymentMethod,
        creditAmount: $creditAmount,
        cashierId: $cashierId,
        customerId: $customerId,
        userId: $userId,
        totalTaxAmount: $totalTaxAmount,
        taxName: $taxName,
        dueDate: $dueDate,
        taxId: $taxId,
        createdAt: $createdAt,
        isTaxInclusive: $isTaxInclusive,
        multiplePaymentMethod: $multiplePaymentMethod,
        ){
            ${salesReceipt}
        }
    }
`;

export const REFUND_SALE = gql`
    mutation refundSale(
        $shopId: ID!,
        $discount: Float,
        $paymentMethod: String,
        $refundedReceiptId: ID,
        $comment: String,
        $onCredit: Boolean,
    ) {
        refundSale(
        shopId: $shopId, 
        discount: $discount,
        paymentMethod: $paymentMethod,
        refundedReceiptId: $refundedReceiptId
        comment: $comment,
        onCredit: $onCredit,
        ){
            ${receipt}
        }
    }
`;

export const GET_TOTAL_SALES = gql`
  query getTotalSales(
    $shopId: ID!
    $from: String
    $to: String
    $paymentMethods: [String]
    $userIds: [String]
    $inventoryIds: [String]
    $isDiscountSales: Boolean
    $isRefundedSales: Boolean
  ) {
    getTotalSales(
      shopId: $shopId
      from: $from
      to: $to
      paymentMethods: $paymentMethods
      userIds: $userIds
      inventoryIds: $inventoryIds
      isDiscountSales: $isDiscountSales
      isRefundedSales: $isRefundedSales
    ) {
      totalSales
    }
  }
`;

export const GET_MULTIPLE_PAYMENT_METHOD = gql`
  query getMultiplePaymentInfo($shopId: String!, $receiptId: String!) {
    getMultiplePaymentInfo(shopId: $shopId, receiptId: $receiptId) {
      ${multiplePaymentMethod}
    }
  }
`;
