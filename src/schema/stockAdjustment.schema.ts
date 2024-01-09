import { gql } from "@apollo/client";
import { ReasonAttr } from "../interfaces/stockAdjustment.interface";
const stockAdjustmentHistory = `
    stockAdjustmentHistoryId
    inventoryId
    shopId
    salesId
    supplyId
    adjustmentQuantity
    adjustmentType
    price
    reason
    notes
    userId
    totalCost
    unitCost
    inventoryType
    inventoryExpiryDate
    inventoryName
    previousCostPrice
    previousSellingPrice
    previousQuantity
    createdAt
    updatedAt
    deletedAt
`;

const AllStockAdjustmentResp = `
stockAdjustmentHistoryId
    inventoryId
    shopId
    salesId
    supplyId
    adjustmentQuantity
    adjustmentType
    price
    reason
    notes
    userId
    totalCost
    unitCost
    inventoryType
    inventoryExpiryDate
    dirty
    inventoryName
    previousCostPrice
    previousSellingPrice
    previousQuantity
    createdAt
    updatedAt
    deletedAt`;

export const GET_ALL_STOCK_ADJUSTMENT = gql`
query getAllStockAdjustmentHistory($shopId: ID!, $limit: Int, $page: Int) {
  getAllShopInventory(
    shopId: $shopId,
    limit: $limit,
    page: $page,
  ){
    ${stockAdjustmentHistory}
  }
}
`;

export const GET_ALLSTOCK_ADJUSTMENT_HISTORY = gql`
query GetAllStockAdjustmentHistory($shopId: ID!, $page: Int, $limit: Int, $from: String, $to: String) {
  getAllStockAdjustmentHistory(shopId: $shopId, page: $page, limit: $limit, from: $from, to: $to) {
    ${AllStockAdjustmentResp}
  }
}
`;

export const GET_STOCK_ADJUSTMENT_HISTORY = gql`
  query getStockAdjustmentHistory($stockAdjustmentHistoryId: ID!, $shopId: ID!) {
    getStockAdjustmentHistory(stockAdjustmentHistoryId: $stockAdjustmentHistoryId, shopId: $shopId) {
        ${stockAdjustmentHistory}
    }
  }
`;

export const GET_LAST_STOCK_ADJUSTMENT_HISTORY = gql`
  query getLastStockAdjustmentHistory($inventoryId: ID!, $shopId: ID!) {
    getLastStockAdjustmentHistory(inventoryId: $inventoryId, shopId: $shopId) {
        ${stockAdjustmentHistory}
    }
  }
`;

export const ADJUST_STOCK = gql`
    mutation adjustStock($inventoryId: ID!, $shopId: ID!, $quantity: Int!, $costPrice: Int, $sellingPrice: Int, $note: String, $isPack: Boolean!, $inventoryExpiryDate: Date, $reason: Reason, $variationId: ID
){
        adjustStock(inventoryId: $inventoryId, shopId: $shopId, quantity: $quantity, costPrice: $costPrice, sellingPrice: $sellingPrice, note: $note, isPack: $isPack, inventoryExpiryDate: $inventoryExpiryDate, reason: $reason, variationId: $variationId){
            ${stockAdjustmentHistory}
        }
    }
`;

export const ADJUST_STOCK_MULTIPLE = gql`
  mutation AdjustStockMultiple($products: [adjustStockQueryType!]) {
    adjustStockMultiple(products: $products) {
      stockAdjustmentHistoryId
      inventoryId
      shopId
      salesId
      supplyId
      adjustmentQuantity
      adjustmentType
      price
      reason
      notes
      userId
      totalCost
      unitCost
      inventoryType
      inventoryExpiryDate
      dirty
      inventoryName
      Inventory {
        inventoryName
        inventoryType
      }
      previousCostPrice
      previousSellingPrice
      previousQuantity
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export interface AllProductHistoryAttr {
  stockAdjustmentHistoryId: string;
  inventoryId: string;
  shopId: string;
  salesId: string;
  supplyId: string;
  adjustmentQuantity: string;
  adjustmentType: string;
  price: number;
  reason: ReasonAttr;
  notes: string;
  userId: string;
  totalCost: number;
  unitCost: number;
  inventoryType: string;
  inventoryExpiryDate: string;
  inventoryName: string;
  previousCostPrice: number;
  previousSellingPrice: number;
  previousQuantity: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}
