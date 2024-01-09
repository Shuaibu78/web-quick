import { gql } from "@apollo/client";

const inventoryCategorySchema = `
  inventoryCategoryId
  inventorycategoryName
  shopId
  updatedAt
  createdAt
`;

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
  isPublished
  isPackFixed
  fixedPackPrice
  shopId
  isLowProductAlertEnabled
  trackable
  isVariation
  inventoryType
  isActive
  batchNo
  barcode
  brand
  returnPolicy
  isOnlineDiscountEnabled
  InventoryCategory {
    inventoryCategoryId
    inventorycategoryName
    shopId
    updatedAt
    createdAt
  }
  quantity
  createdAt
  Images {
    imageId
    largeImageOnlineURL
    mediumImageOnlineURL
    smallImageOnlineURL
    localURL
  }
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
    measurementUnitPack
    measurementUnitPieces
  }
  NonTrackableItem {
    nonTrackableItemsId
    inventoryId
    costPrice
    sellingPrice
    fixedSellingPrice
    measurementUnit
  }
  Variations {
    variationId
    variationName
    inventoryId
    price
    cost
    shopId
  }
  VariationTypes {
    variationTypeId
    type
    inventoryId
    shopId
  }
  Supplies {
    supplyId
    shopId
    userId
    inventoryId
    inventoryName
    quantity
    variationId
    costPrice
    inventoryExpiryDate
    updatedAt
    createdAt
    dateCreated
    dateUpdated
  }
  InventoryQuantity {
    inventoryId
    variationId
    positiveSupply
    quantity
  }
  Shop {
    shopId
    shopName
    shopAddress
    shopPhone
    distance
    latitude
    longitude
    ShopURL {
      shopId
      shopTag
    }
    Images {
      largeImageOnlineURL
      mediumImageOnlineURL
      smallImageOnlineURL
    }
  }
`;

export const CREATE_INVENTORY_CATEGORY = gql`
  mutation createInventoryCategory($name: String!, $shopId: ID!) {
    createInventoryCategory(inventorycategoryName: $name, shopId: $shopId) {
      ${inventoryCategorySchema}
    }
  } 
`;

export const UPDATE_MEMBER_ADDRESS = gql`
  mutation updateMemberAddress($addressId: ID!, $country: String) {
    updateMemberAddress(addressId: $addressId, country: $country)
  }
`;

export const GET_ALL_SHOP_INVENTORY_CATEGORY = gql`
  query getAllShopInventoryCategory($shopId: ID!) {
    getAllShopInventoryCategory(shopId: $shopId){
      ${inventoryCategorySchema}
    }
  }
`;

export const GET_INVENTORY_CATEGORY = gql`
  query getInventoryCategory($inventoryCategoryId: ID!) {
    getInventoryCategory(inventoryCategoryId: $inventoryCategoryId) {
      inventorycategoryName
    }
  }
`;

export const DELETE_INVENTORY = gql`
  mutation deleteInventory($inventoryId: ID!, $shopId: ID!) {
    deleteInventory(inventoryId: $inventoryId, shopId: $shopId)
  }
`;

export const DELETE_MULTIPLE_INVENTORY = gql`
  mutation DeleteMultipleInventories($inventoryIds: [ID!]!, $shopId: ID!) {
    deleteMultipleInventories(inventoryIds: $inventoryIds, shopId: $shopId)
  }
`;

export const UPDATE_INVENTORY = gql`
  mutation updateInventory(
    $inventoryId: ID!
    $isPublished: Boolean
    $inventoryName: String!
    $inventoryDescription: String
    $inventoryCategoryId: ID
    $quantityInPacks: Float
    $quantityInPieces: Float
    $costPrice: Float
    $sellingPrice: Float
    $perPack: Int
    $shopId: ID!
    $barcode: String
    $isLowProductAlertEnabled: Boolean
    $variationsList: [VariationsInput]
    $discountEnable: Boolean
    $lowAlertQuantity: Int
    $inventoryExpiryDate: Date
    $files: [String]
    $isPack: Boolean
    $isPieces: Boolean
    $isVariation: Boolean
    $trackable: Boolean
    $piecesCostPrice: Float
    $packCostPrice: Float
    $fixedUnitPrice: Float
    $fixedPackPrice: Float
    $fixedSellingPrice: Boolean
    $isActive: Boolean
    $measurementUnitPack: String
    $measurementUnitPieces: String
    $measurementUnit: String
  ) {
    updateInventory(
      inventoryId: $inventoryId
      inventoryFields: {
        inventoryName: $inventoryName
        inventoryDescription: $inventoryDescription
        inventoryCategoryId: $inventoryCategoryId
        quantityInPieces: $quantityInPieces
        quantityInPacks: $quantityInPacks
        costPrice: $costPrice
        sellingPrice: $sellingPrice
        perPack: $perPack
        shopId: $shopId
        discountEnable: $discountEnable
        isLowProductAlertEnabled: $isLowProductAlertEnabled
        lowAlertQuantity: $lowAlertQuantity
        inventoryExpiryDate: $inventoryExpiryDate
        files: $files
        barcode: $barcode
        isVariation: $isVariation
        isPieces: $isPieces
        isPack: $isPack
        trackable: $trackable
        piecesCostPrice: $piecesCostPrice
        packCostPrice: $packCostPrice
        fixedUnitPrice: $fixedUnitPrice
        fixedPackPrice: $fixedPackPrice
        fixedSellingPrice: $fixedSellingPrice
        isPublished: $isPublished
        isActive: $isActive
        measurementUnitPack: $measurementUnitPack
        measurementUnitPieces: $measurementUnitPieces
        measurementUnit: $measurementUnit
      }
      variationsList: $variationsList
    ) {
      inventoryName
      inventoryId
      isPublished
    }
  }
`;

export const CREATE_INVENTORY = gql`
mutation createInventory(
  $inventoryName: String!, 
  $inventoryDescription: String,
  $inventoryCategoryId: ID,
  $quantityInPacks: Float,
  $quantityInPieces: Float,
  $costPrice: Float,
  $sellingPrice: Float,
  $perPack: Int,
  $shopId: ID!,
  $barcode: String,
  $isLowProductAlertEnabled: Boolean,
  $discountEnable: Boolean,
  $lowAlertQuantity: Int,
  $inventoryExpiryDate: Date,
  $files: [String],
  $variationTypesAndOptions: [VariationsTypeAndOptionsInput],
  $variationsList: [VariationsInput],
  $isPack: Boolean,
  $isPieces: Boolean,
  $isVariation: Boolean,
  $trackable:Boolean,
  $piecesCostPrice: Float,
  $packCostPrice: Float,
  $fixedUnitPrice: Float,
  $fixedPackPrice: Float,
  $fixedSellingPrice: Boolean,
  $isPublished: Boolean
  $returnPolicy: String
  $batchNo: String
  $brand: String
  $isOnlineDiscountEnabled: Boolean
  $measurementUnitPack: String
  $measurementUnitPieces: String
  $measurementUnit: String
) {
  createInventory(
    inventoryFields: {
      inventoryName: $inventoryName,
      inventoryDescription: $inventoryDescription,
      inventoryCategoryId: $inventoryCategoryId,
      quantityInPieces: $quantityInPieces,
      quantityInPacks: $quantityInPacks,
      costPrice: $costPrice,
      sellingPrice: $sellingPrice,
      perPack: $perPack,
      shopId: $shopId,
      discountEnable: $discountEnable,
      isLowProductAlertEnabled: $isLowProductAlertEnabled,
      lowAlertQuantity: $lowAlertQuantity,
      inventoryExpiryDate: $inventoryExpiryDate,
      files: $files,
      barcode: $barcode,
      isVariation:$isVariation,
      isPieces: $isPieces,
      isPack: $isPack,
      trackable: $trackable,
      piecesCostPrice: $piecesCostPrice,
      packCostPrice: $packCostPrice,
      fixedUnitPrice: $fixedUnitPrice,
      fixedPackPrice: $fixedPackPrice,
      fixedSellingPrice: $fixedSellingPrice,
      isPublished: $isPublished
      returnPolicy: $returnPolicy
      batchNo: $batchNo
      brand: $brand
      isOnlineDiscountEnabled: $isOnlineDiscountEnabled
      measurementUnitPack: $measurementUnitPack
      measurementUnitPieces:$measurementUnitPieces
      measurementUnit:$measurementUnit
    },
    variationTypesAndOptions: $variationTypesAndOptions,
    variationsList: $variationsList  ) {
      ${inventorySchema}
    }
  }
`;

export const CREATE_INVENTORY_FROM_CSV = gql`
mutation CreateProductFromCsv(
$inventoryData: [InventoryInput]
$productPackageLimit: Int!
$shopId: ID!
) {
  createProductFromCsv(
    inventoryFields: $inventoryData
    productPackageLimit: $productPackageLimit
    shopId: $shopId
  ) {
      ${inventorySchema}
    }
  }
`;

export const GET_ALL_SHOP_INVENTORY = gql`
  query getAllShopInventory($shopId: ID!, $limit: Int, $page: Int, $removeBatchProducts: Boolean, $filter: String, $isProductTrackable: Boolean, $searchString: String, $barcode: String) {
    getAllShopInventory(
      shopId: $shopId,
      limit: $limit,
      page: $page,
      filter: $filter,
      removeBatchProducts: $removeBatchProducts,
      isProductTrackable: $isProductTrackable,
      barcode: $barcode,
      searchString: $searchString,
    ){
        ${inventorySchema}
    }
  }
`;

export const GET_FILTERED_INVENTORY_OPTIONS = gql`
  query getFilteredInventory(
    $shopId: ID!
    $from: String
    $to: String
    $filter: String
    $searchString: String
    $removeBatchProducts: Boolean
    $isProductTrackable: Boolean
  ) {
    getFilteredInventory(
      shopId: $shopId
      from: $from
      to: $to
      filter: $filter
      searchString: $searchString
      removeBatchProducts: $removeBatchProducts
      isProductTrackable: $isProductTrackable
    ) {
      totalInventory
      pagination
      totalProductQuantity
      totalInventoryValue
      totalOnlineProducts
      totalOfflineProducts
      totalOutOfStockProducts
    }
  }
`;

export const GET_INVENTORY = gql`
  query getInventory($inventoryId: ID!, $shopId: ID!){
    getInventory(
      inventoryId: $inventoryId,
      shopId: $shopId,
    ){
      ${inventorySchema}
    }
  }
`;

export const SEARCH_INVENTORY = gql`
  query searchUserInventory($shopId: String!, $searchString: String, $barcode: String) {
    searchUserInventory(shopId: $shopId, searchString: $searchString, barcode: $barcode) {
      ${inventorySchema}
    }
  }
`;

export const STOCK_ADJUSTMENT_HISTORY = gql`
  query getAllStockAdjustmentHistory(
    $shopId: ID!,
    $limit: Int,
    $page: Int,
    $from: Float,
    $to: Float,
  ) {
    getAllStockAdjustmentHistory (
      shopId: $shopId,
      limit: $limit,
      page: $page,
      from: $from,
      to: $to,
    ){
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
        ${inventorySchema}
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

export const GET_OVERVIEW_COUNT = gql`
  query GetOverviewCount($shopId: ID!) {
    getOverviewCount(shopId: $shopId) {
      inventoriesCount
      outOfStockCount
      onlineCount
      returnedCount
      damagedCount
      lostCount
      totalAvailableQuantity
    }
  }
`;

export const GET_PRODUCT_HISTORY = gql`
  query GetProductHistory(
    $inventoryId: ID!
    $shopId: ID!
    $from: String
    $to: String
    $limit: Int
    $page: Int
  ) {
    getProductHistory(
      inventoryId: $inventoryId
      shopId: $shopId
      from: $from
      to: $to
      limit: $limit
      page: $page
    ) {
      records {
        productHistoryId
        shopId
        userId
        userEmail
        inventoryId
        variationId
        inventoryName
        inventoryType
        value
        isValueIncreased
        newValue
        type
        comment
        amount
        profit
        User {
          userId
          businessName
          firstName
          lastName
          fullName
          email
          mobileNumber
          merchantId
          isMerchant
          updatedAt
          createdAt
          lastSeen
          lastAction
        }
        isQuantityChange
        displayType
        createdAt
        updatedAt
        deletedAt
        dateCreated
        dateUpdated
      }
      totalQuantitySold
      currentQuantity
      totalSales
      totalProfit
      totalLoss
      totalDamage
    }
  }
`;
