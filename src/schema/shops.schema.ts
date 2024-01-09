import { gql } from "@apollo/client";

const ImageSchema = `
  localURL
  smallImageOnlineURL
  mediumImageOnlineURL
  largeImageOnlineURL
`;

export const shopSchema = `
  shopId
  shopName
  shopAddress
  shopPhone
  isPublished
  city
  state
  userId
  shopApprovalStatus
  rejectionReason
  updatedAt
  createdAt
  shopCategoryId
  shopCategoryName
  checkoutMethod
  latitude
  longitude
  distance
  isDisabled
  discountEnabled
  maximumDiscount
  deviceLocked
  isExpiryDateEnabled
  currencyCode
  isSurplusEnabled
  Images {
    ${ImageSchema}
  }
`;

export const countrySchema = `
  name
  countryCode
  shortName
  countryId
`;

export const GET_ALL_SHOPS = gql`
  query getShops(
    $userId: ID!,
  ){
    getUsersShops(userId: $userId) {
      ${shopSchema}
    }
  }
`;

export const FETCH_ALL_SHOPS = gql`
  query FetchUserShops {
    fetchUserShops {
      ${shopSchema}
    }
  }
`;
export const CREATE_SHOP = gql`
  mutation CreateShop(
    $shopName: String!
    $shopAddress: String!
    $currencyCode: String
    $shopCategoryId: ID
    $shopCategoryName: String
    $shopPhone: String
  ) {
    createShop(
      shopName: $shopName
      shopAddress: $shopAddress
      currencyCode: $currencyCode
      shopCategoryId: $shopCategoryId
      shopCategoryName: $shopCategoryName
      shopPhone: $shopPhone
    ) {
      ${shopSchema}
    }
  }  
`;
export const GET_SHOP = gql`
  query getShop(
    $shopId: ID,
    $shopTag: String,
    $latitude: Float,
    $longitude: Float,
       
  ){
    getShop(
      shopId: $shopId,
      shopTag: $shopTag,
      latitude: $latitude,
      longitude: $longitude,
    ) {
      countries {
        ${countrySchema}
      }
      result {
        ${shopSchema}
      }
    }
  }
`;
export const UPDATE_SHOP = gql`
  mutation updateShop(
    $shopId: ID!
    $shopName: String
    $shopPhone: String
    $shopAddress: String
    $isPublished: Boolean
    $city: String
    $state: String
    $shopCategoryId: ID
    $shopCategoryName: String
    $checkoutMethod: CheckoutMethods
    $maximumDiscount: Float
    $currencyCode: String
    $discountEnabled: Boolean
    $isExpiryDateEnabled: Boolean
    $isSurplusEnabled: Boolean
  ) {
    updateShop(
      shopId: $shopId
      shopName: $shopName
      shopPhone: $shopPhone
      shopAddress: $shopAddress
      isPublished: $isPublished
      city: $city
      state: $state
      shopCategoryId: $shopCategoryId
      shopCategoryName: $shopCategoryName
      checkoutMethod: $checkoutMethod
      maximumDiscount: $maximumDiscount
      discountEnabled: $discountEnabled
      currencyCode: $currencyCode
      isExpiryDateEnabled: $isExpiryDateEnabled
      isSurplusEnabled: $isSurplusEnabled
    )
  }
`;

export const GET_SHOP_CATEGORIES = gql`
  query getShopCategories {
    getShopCategories {
      shopCategoryId
      shopCategoryName
      description
    }
  }
`;

export const GET_SHOP_INVENTORY_CATEGORIES = gql`
  query GetAllShopInventoryCategory($shopId: ID!) {
    getAllShopInventoryCategory(shopId: $shopId) {
      inventoryCategoryId
      parentId
      inventorycategoryName
      shopId
      updatedAt
      createdAt
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteInventoryCategory($inventoryCategoryId: ID) {
    deleteInventoryCategory(inventoryCategoryId: $inventoryCategoryId)
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateInventoryCategory(
    $inventoryCategoryId: ID
    $inventorycategoryName: String
    $shopId: ID
  ) {
    updateInventoryCategory(
      inventoryCategoryId: $inventoryCategoryId
      inventorycategoryName: $inventorycategoryName
      shopId: $shopId
    )
  }
`;

export const GENERATE_DEVICE_ID = gql`
  mutation GenerateDeviceId {
    generateDeviceId {
      deviceUUID
    }
  }
`;

export const DELETE_SHOP = gql`
  mutation DeleteShop($shopId: ID!) {
    deleteShop(shopId: $shopId)
  }
`;

export const SAVE_SERVER_CATEGORIES = gql`
  query SaveServerCategories {
    saveServerCategories {
      done
    }
  }
`;
