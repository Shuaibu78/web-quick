import { gql } from "@apollo/client";

export const FINANCIAL_OVERVIEW = gql`
  query GetFinancialOverview($shopId: ID!, $from: String, $to: String) {
    getFinancialOverview(shopId: $shopId, from: $from, to: $to) {
      totalExpenditure
      totalCashInFlow
      totalInventory
      allExpenditure {
        expenditureId
        expenditureName
        amount
        remark
        expenditureCategoryId
        ExpenditureCategory {
          expenditureCategoryId
          parentId
          expenditureCategoryName
          shopId
          updatedAt
          createdAt
        }
        shopId
        userId
        date
        updatedAt
        createdAt
        dateCreated
        dateUpdated
      }
      allOrderCount
      pendingCount
      processingCount
      completedCount
    }
  }
`;

export const SALES_OVERVIEW_INSIGHTS = gql`
  query GetSalesOverviewInsights($shopId: ID!, $from: String, $to: String) {
    getSalesOverviewInsights(shopId: $shopId, from: $from, to: $to) {
      totalSales
      recentSales {
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
        displayedAmount
        taxAmount
        taxName
        taxId
        isTaxInclusive
        pack
        batchId
        batchNumber
        updatedAt
        createdAt
        dateCreated
        dateUpdated
      }
      allSalesReceipt {
        receiptId
        deviceId
        shopId
        customerName
        totalAmount
        totalDiscount
        paymentMethod
        receiptNumber
        cashierId
        comment
        isRefunded
        refundedReceiptId
        totalProfit
        onCredit
        userId
        amountPaid
        creditAmount
        customerId
        Sales {
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
          displayedAmount
          taxAmount
          taxName
          taxId
          isTaxInclusive
          pack
          batchId
          batchNumber
          updatedAt
          createdAt
          dateCreated
          dateUpdated
        }
        totalTaxAmount
        taxName
        taxId
        isTaxInclusive
        totalDisplayedAmount
        version
        createdAt
        updatedAt
        deletedAt
      }
    }
  }
`;

export const ORDER_AND_OVERVIEW_INSIGHTS = gql`
  query GetOrderAndOverviewInsights($shopId: ID!, $from: String, $to: String) {
    getOrderAndOverviewInsights(shopId: $shopId, from: $from, to: $to) {
      inventoriesCount
      outOfStockCount
      onlineCount
      returnedCount
      damagedCount
      lostCount
      totalAvailableQuantity
      records {
        orderItemId
        orderId
        inventoryId
        inventoryName
        inventoryType
        quantity
        amount
        shopId
        stepId
        inventoryCategoryId
        amountPerItem
        quantityPerPack
        isEditable
        createdAt
        updatedAt
        deletedAt
        Step {
          stepId
          shopId
          stepName
          arrangementOrder
          stepColor
          isDefaultStep
          createdAt
          updatedAt
          deletedAt
        }
      }
    }
  }
`;
