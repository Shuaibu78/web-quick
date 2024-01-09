import { gql } from "@apollo/client";
import { IInventory, IVariations } from "../interfaces/inventory.interface";

export const CREATE_PRODUCT_TRANSFER = gql`
  mutation CreateInventoryTransfer(
    $fromShopId: String!
    $toShopId: String!
    $inventoryIdsAndQuantities: [InventoryIdsAndQuantity]!
  ) {
    createInventoryTransfer(
      fromShopId: $fromShopId
      toShopId: $toShopId
      inventoryIdsAndQuantities: $inventoryIdsAndQuantities
    ) {
      inventoryTransferId
      groupId
      toInventoryId
      fromInventoryId
      fromShopId
      toShopId
      FromShop {
        shopName
      }
      ToShop {
        shopName
      }
      FromInventory {
        inventoryId
        inventoryCategoryId
        inventoryName
        inventoryDescription
        quantity
        quantityInPieces
        quantityInPacks
        fixedUnitPrice
        minUnitPrice
        maxUnitPrice
        isUnitFixed
        costPrice
        inventoryType
        packCostPrice
        minPackPrice
        maxPackPrice
        fixedPackPrice
        isPackFixed
        isPack
        perPack
        shopId
        isPublished
        trackable
        isVariation
        isHotel
        isRestaurant
        isActive
        updatedAt
        createdAt
        returnPolicy
        isOnlineDiscountEnabled
        barcode
        brand
        batchNo
      }
      ToInventory {
        inventoryId
        inventoryCategoryId
        inventoryName
        inventoryDescription
        quantity
        quantityInPieces
        quantityInPacks
        fixedUnitPrice
        minUnitPrice
        maxUnitPrice
        isUnitFixed
        costPrice
        inventoryType
        packCostPrice
        minPackPrice
        maxPackPrice
        fixedPackPrice
        isPackFixed
        isPack
        perPack
        shopId
        isPublished
        trackable
        isVariation
        isHotel
        isRestaurant
        isActive
        updatedAt
        createdAt
        returnPolicy
        isOnlineDiscountEnabled
        barcode
        brand
        batchNo
      }
      FromVariation {
        variationId
        variationName
        inventoryId
        shopId
        price
        cost
        tempQuantity
        variationQuantity
        alertQuantity
        alertSent
        quantityLeft
        quantity
        createdAt
        updatedAt
        deletedAt
      }
      ToVariation {
        variationId
        variationName
        inventoryId
        shopId
        price
        cost
        tempQuantity
        variationQuantity
        alertQuantity
        alertSent
        quantityLeft
        quantity
        createdAt
        updatedAt
        deletedAt
      }
      status
      quantity
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const PREVIEW_PRODUCR_TRF = gql`
  query PreviewInventoryTransfers(
    $fromShopId: String!
    $toShopId: String!
    $inventoryIdsAndQuantities: [InventoryIdsAndQuantity]!
  ) {
    previewInventoryTransfers(
      fromShopId: $fromShopId
      toShopId: $toShopId
      inventoryIdsAndQuantities: $inventoryIdsAndQuantities
    ) {
      fromShop {
        shopName
        inventories
      }
      toShop {
        shopName
        inventories
      }
    }
  }
`;

export interface IProductTrfPreview {
  fromShop: {
    shopName: string;
    inventories: IInventory[];
  };
  toShop: {
    shopName: string;
    inventories: IInventory[];
  };
}

export interface ProductReviewAttr {
  previewInventoryTransfers: IProductTrfPreview;
}

export interface ProductTransferAttr {
  inventoryTransferId: string;
  groupId: string;
  toInventoryId: string;
  fromInventoryId: string;
  fromShopId: string;
  toShopId: string;
  FromShop: {
    shopName: string;
  };
  ToShop: {
    shopName: string;
  };
  FromInventory: IInventory;
  ToInventory: IInventory;
  FromVariation: IVariations;
  ToVariation: IVariations;
  status: string;
  quantity: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export const GET_INVENTORY_TRANSFER = gql`
  query GetInventoryTransfers(
    $status: TransferStatus!
    $toShopId: String
    $fromShopId: String
    $page: Int
    $limit: Int
  ) {
    getInventoryTransfers(
      status: $status
      toShopId: $toShopId
      fromShopId: $fromShopId
      page: $page
      limit: $limit
    ) {
      inventoryTransferId
      groupId
      toInventoryId
      fromInventoryId
      fromShopId
      toShopId
      FromShop {
        shopId
        shopName
        shopPhone
        city
        state
        userId
      }
      ToShop {
        shopId
        shopName
        shopPhone
        city
        state
        userId
      }
      FromInventory {
        inventoryId
        inventoryName
        inventoryDescription
        quantity
        quantityInPieces
        quantityInPacks
        inventoryCategoryId
      }
      ToInventory {
        inventoryId
        inventoryName
        inventoryDescription
        quantity
        quantityInPieces
        quantityInPacks
        inventoryCategoryId
      }
      FromVariation {
        variationId
        variationName
        inventoryId
        price
        cost
        shopId
        variationQuantity
        createdAt
        updatedAt
        deletedAt
      }
      ToVariation {
        variationId
        variationName
        inventoryId
        price
        cost
        shopId
        variationQuantity
        createdAt
        updatedAt
        deletedAt
      }
      status
      quantity
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export interface InventoryTransferAttr {
  inventoryTransferId: string;
  groupId: number;
  toInventoryId: string;
  fromInventoryId: string;
  fromShopId: string;
  toShopId: string;
  FromShop: {
    shopId: string;
    shopName: string;
    shopPhone: string;
    city: string;
    state: string;
    userId: string;
  };
  ToShop: {
    shopId: string;
    shopName: string;
    shopPhone: string;
    city: string;
    state: string;
    userId: string;
  };
  FromInventory: {
    inventoryId: string;
    inventoryName: string;
    inventoryDescription: string;
    quantity: number;
    quantityInPieces: number;
    quantityInPacks: number;
    inventoryCategoryId: string;
  };
  ToInventory: {
    inventoryId: string;
    inventoryName: string;
    inventoryDescription: string;
    quantity: number;
    quantityInPieces: number;
    quantityInPacks: number;
    inventoryCategoryId: string;
  };
  FromVariation: string;
  ToVariation: string;
  status: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export const UPDATE_INV_TRANSFER = gql`
  mutation UpdateInventoryTransfer($inventoryTransferIds: [ID!]!, $status: TransferStatus!) {
    updateInventoryTransfer(inventoryTransferIds: $inventoryTransferIds, status: $status)
  }
`;
