import { gql } from "@apollo/client";

export const subscriptionsSchema = `
    userSubscriptionId
    userId
    packageName
    packageNumber
    gracePeriodExpiryDate
    expiryDate
    autorenewal
    recurrence
    createdAt
    updatedAt
    deletedAt
`;

export const subscriptionsAddonSchema = `
    userSubscriptionAddonId
    userSubscriptionId
    type
    typeId
    isActive
    createdAt
    updatedAt
    deletedAt
`;

export const GET_ALL_USER_SUBSCRIPTIONS = gql`
  query GetAllUserSubscriptions($userId: ID!) {
    getAllUserSubscriptions(userId: $userId) {
      ${subscriptionsSchema}
    }
  }
`;

export const GET_SINGLE_USER_SUBSCRIPTION = gql`
  query GetSingleUserSubscription($userSubscriptionId: ID) {
    getSingleUserSubscription(userSubscriptionId: $userSubscriptionId) {
      ${subscriptionsSchema}
    }
  }
`;

export const GET_ALL_USER_SUBSCRIPTION_ADDONS = gql`
  query GetAllUserSubscriptionAddons(
    $type: Type
    $isActive: Boolean
    $userSubscriptionId: String
  ) {
    getAllUserSubscriptionAddons(
      type: $type
      isActive: $isActive
      userSubscriptionId: $userSubscriptionId
    ) {
      ${subscriptionsAddonSchema}
    }
  }
`;

export const GET_SINGLE_USER_SUBSCRIPTION_ADDON = gql`
  query GetSingleUserSubscriptionAddon($userSubscriptionAddonId: ID) {
    getSingleUserSubscriptionAddon(userSubscriptionAddonId: $userSubscriptionAddonId) {
      ${subscriptionsAddonSchema}
    }
  }
`;

export const ACTIVATE_SUBSCRIBTION = gql`
  mutation VerifyAndActivateSubscription($referenceId: String!, $shopId: String!) {
    verifyAndActivateSubscription(referenceId: $referenceId, shopId: $shopId) {
      userSubscriptionId
      userId
      packageName
      packageNumber
      gracePeriodExpiryDate
      expiryDate
      autorenewal
      recurrence
      UserSubscriptionAddons {
        userSubscriptionAddonId
        userSubscriptionId
        type
        typeId
        isActive
        createdAt
        updatedAt
        deletedAt
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const ACTIVATE_GRACE_PERIOD = gql`
  mutation ActivateServerGracePeriod($shopId: String!) {
    activateServerGracePeriod(shopId: $shopId) {
      userSubscriptionId
      userId
      packageName
      packageNumber
      gracePeriodExpiryDate
      expiryDate
      autorenewal
      recurrence
      UserSubscriptionAddons {
        userSubscriptionAddonId
        userSubscriptionId
        type
        typeId
        isActive
        createdAt
        updatedAt
        deletedAt
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const INITIALIZE_SUBSCRIPTION = gql`
  query IntializeSubscription(
    $shopId: String!
    $packageNumber: Int!
    $recurrence: SubscriptionRecurrence!
  ) {
    intializeSubscription(shopId: $shopId, packageNumber: $packageNumber, recurrence: $recurrence) {
      authorization_url
      access_code
      reference
    }
  }
`;

export const GET_SUBSCRIBTION_PACKAGES = gql`
  query GetSubscriptionPackages {
    getSubscriptionPackages {
      packageName
      shopCount
      staffCount
      inventoryCount
      debtorCount
      receiptPrintingCount
      pricePerMonth
      pricePerYear
      pricePerMonthUSD
      pricePerYearUSD
      packageNumber
      percentageOff
      additionalFeatures
      featuresToDisplay
    }
  }
`;

export const GET_FEATURE_COUNT = gql`
  query GetFeatureCount($shopId: ID!) {
    getFeatureCount(shopId: $shopId) {
      inventoriesCount
      debtCount
    }
  }
`;
