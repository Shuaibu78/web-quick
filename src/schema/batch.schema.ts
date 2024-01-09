import { gql } from "@apollo/client";
import { inventorySchema } from "./inventory.schema";

const batchSchema = `
      batchId
      shopId
      batchNumber
      manufacturerNumber
      expiryDate
      dateAdded
      description
      updatedAt
      createdAt
`;

export const CREATE_BATCH = gql`
  mutation CreateBatch(
    $shopId: ID!
    $batchNumber: String!
    $description: String
    $dateAdded: Date
    $manufacturerNumber: String
    $expiryDate: Date
  ) {
    createBatch(
      shopId: $shopId
      batchNumber: $batchNumber
      description: $description
      dateAdded: $dateAdded
      manufacturerNumber: $manufacturerNumber
      expiryDate: $expiryDate
    ) {
      ${batchSchema}
    }
  }
`;

export const UPDATE_BATCH = gql`
  mutation UpdateBatch(
    $shopId: ID!
    $batchId: ID!
    $batchNumber: String!
    $description: String
    $dateAdded: Date
    $manufacturerNumber: String
    $expiryDate: Date
  ) {
    updateBatch(
      shopId: $shopId
      batchId: $batchId
      batchNumber: $batchNumber
      description: $description
      dateAdded: $dateAdded
      manufacturerNumber: $manufacturerNumber
      expiryDate: $expiryDate
    ) {
      ${batchSchema}
    }
  }
`;

export const DELETE_MULTIPLE_BATCH = gql`
  mutation DeleteBatch($shopId: ID!, $batchIds: [String!]!) {
    deleteBatch(shopId: $shopId, batchIds: $batchIds)
  }
`;

export const DELETE_INVENTORY = gql`
  mutation deleteInventory($inventoryId: ID!, $shopId: ID!) {
    deleteInventory(inventoryId: $inventoryId, shopId: $shopId)
  }
`;

export const DELETE_BATCH_INVENTORY = gql`
  mutation deleteBatchInventory($inventoryIds: [String!]!, $shopId: ID!) {
    deleteBatchInventory(inventoryIds: $inventoryIds, shopId: $shopId)
  }
`;

export const ADJUST_BATCH_QUANTITY = gql`
  mutation adjustBatchQuantity(
    $shopId: String!
    $batchId: String!
    $userId: String!
    $batchInventories: [BatchInventoriesInput!]!
  ) {
    adjustBatchQuantity(
      shopId: $shopId
      batchId: $batchId
      userId: $userId
      batchInventories: $batchInventories
    )
  }
`;

export const GET_ALL_SHOP_BATCHES = gql`
  query getAllShopBatches($shopId: ID!, $search:String, $page: Int, $limit: Int) {
    getAllShopBatches(shopId: $shopId, search: $search,  page: $page, limit: $limit) {
      totalBatchProductsQty
      batchInventoryCount
      totalBatchProductsValue
      totalBatches
      batches {
        ${batchSchema}
      }
    }
  }
`;

export const SEARCH_BATCH_INVENTORIES = gql`
  query searchBatchInventories($shopId: ID!, $search:String!, $page: Int) {
    searchBatchInventories(shopId: $shopId, search: $search,  page: $page) {
      count
      batches {
        ${batchSchema}
      }
    }
  }
`;

export const GET_BATCH_INVENTORY_COUNT = gql`
  query getBatchInventoryCount($shopId: ID!, $batchNumber: String) {
    getBatchInventoryCount(shopId: $shopId, batchNumber: $batchNumber) {
      batchCount
    }
  }
`;

export const GET_BATCH_INVENTORIES = gql`
  query GetBatchInventories($shopId: ID!, $batchNo: ID!, $search:String, $page: Int, $limit: Int) {
  getBatchInventories(shopId: $shopId, batchNo: $batchNo, search: $search, page: $page, limit: $limit) {
    totalCount
    totalQuantity
    totalValue
    totalInventories
    batchInventories {
      ${inventorySchema}
    }
  }
}
`;
