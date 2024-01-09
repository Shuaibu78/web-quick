import { gql } from "@apollo/client";

export const GET_ORDER_ITEMS = gql`
  query getOrderItems(
    $shopId: String!
    $searchString: String
    $from: Date
    $to: Date
    $stepName: String
    $limit: Int
    $page: Int
  ) {
    getOrderItems(
      shopId: $shopId
      searchString: $searchString
      from: $from
      to: $to
      stepName: $stepName
      limit: $limit
      page: $page
    ) {
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
        Order {
          orderId
          shopId
          addressId
          ownerMemberId
          offlineMemberId
          paymentId
          receiptId
          createdByUserId
          orderNumber
          subTotal
          deliveryFee
          transactionFee
          paymentStatus
          platform
          deliveryOption
          deviceId
          totalAmount
          paymentMethod
          otherDetails
          comment
          createdAt
          updatedAt
          deletedAt
        }
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
        Inventory {
          Images {
            localURL
          }
        }
        inventoryCategoryId
        amountPerItem
        quantityPerPack
        isEditable
        createdAt
        updatedAt
        deletedAt
      }
      total
    }
  }
`;

export const COUNT_ORDERS = gql`
  query Query($shopId: String!, $stepName: String, $from: Date, $to: Date) {
    getOrdersCount(shopId: $shopId, stepName: $stepName, from: $from, to: $to) {
      count
      percentageOrders
    }
  }
`;

export const GET_SHOP_STEPS = gql`
  query GetShopSteps($shopId: String) {
    getShopSteps(shopId: $shopId) {
      stepId
      shopId
      stepName
      stepColor
      isDefaultStep
      createdAt
      updatedAt
      deletedAt
      arrangementOrder
    }
  }
`;

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderItemStep($shopId: String!, $orderItemIds: [String]!, $stepId: String!) {
    updateOrderItemStep(shopId: $shopId, orderItemIds: $orderItemIds, stepId: $stepId) {
      successful
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($shopId: String!, $orderId: String!) {
    getOrder(shopId: $shopId, orderId: $orderId) {
      OrderItems {
        orderItemId
        orderId
        inventoryId
        inventoryName
        inventoryType
        quantity
        amount
        shopId
        stepId
        Step {
          stepId
          stepName
        }
        inventoryCategoryId
        amountPerItem
        quantityPerPack
        isEditable
        createdAt
        updatedAt
        deletedAt
      }
      OrderTags {
        orderTagId
        shopId
        orderId
        tagId
        Tag {
          tagId
          tagName
        }
      }
      addressId
      comment
      shopId
      subTotal
      totalAmount
      transactionFee
      updatedAt
      receiptId
      platform
      paymentStatus
      paymentMethod
      paymentId
      ownerMemberId
      orderNumber
      otherDetails
      orderId
      offlineMemberId
      deviceId
      deliveryOption
      deliveryFee
      deletedAt
      createdByUserId
      createdAt
    }
  }
`;

export const GET_ORDERS = gql`
  query GetOrders(
    $shopId: String!
    $stepName: String
    $searchString: String
    $from: Date
    $to: Date
    $tagIds: [String]
    $paymentStatus: String
    $limit: Int
    $page: Int
  ) {
    getOrders(
      shopId: $shopId
      searchString: $searchString
      from: $from
      to: $to
      stepName: $stepName
      tagIds: $tagIds
      paymentStatus: $paymentStatus
      limit: $limit
      page: $page
    ) {
      total
      records {
        orderId
        shopId
        addressId
        ownerMemberId
        offlineMemberId
        paymentId
        receiptId
        createdByUserId
        orderNumber
        subTotal
        deliveryFee
        transactionFee
        paymentStatus
        platform
        deliveryOption
        deviceId
        totalAmount
        paymentMethod
        otherDetails
        OrderItems {
          orderItemId
          orderId
          inventoryId
          inventoryName
          inventoryType
          quantity
          amount
          shopId
          stepId
          Step {
            isDefaultStep
            arrangementOrder
            stepName
            stepId
          }
          inventoryCategoryId
          amountPerItem
          quantityPerPack
          isEditable
          createdAt
          updatedAt
          deletedAt
        }
        comment
        createdAt
        updatedAt
        deletedAt
        OrderTags {
          orderTagId
          shopId
          orderId
          tagId
          Tag {
            tagId
            tagName
          }
        }
      }
    }
  }
`;

export const DELETE_ORDER_ITEM = gql`
  mutation DeleteOrderItem($shopId: String!, $orderItemId: String!) {
    deleteOrderItem(shopId: $shopId, orderItemId: $orderItemId) {
      successful
    }
  }
`;

export const MAKE_ORDER_PAYMENT = gql`
  mutation MakeOfflineOrderPayment(
    $shopId: String!
    $customerId: String
    $customerName: String
    $depositAmount: Float
    $orderId: String!
    $paymentMethod: PaymentMethod!
    $discount: Int
    $comment: String
  ) {
    makeOfflineOrderPayment(
      shopId: $shopId
      orderId: $orderId
      customerId: $customerId
      customerName: $customerName
      depositAmount: $depositAmount
      paymentMethod: $paymentMethod
      discount: $discount
      comment: $comment
    ) {
      successful
    }
  }
`;

export const GET_ORDER_ITEM = gql`
  query GetOrderItem($shopId: String!, $orderItemId: String!) {
    getOrderItem(shopId: $shopId, orderItemId: $orderItemId) {
      Order {
        orderId
        shopId
        addressId
        ownerMemberId
        offlineMemberId
        paymentId
        receiptId
        createdByUserId
        orderNumber
        subTotal
        deliveryFee
        transactionFee
        paymentStatus
        platform
        deliveryOption
        deviceId
        totalAmount
        paymentMethod
        otherDetails
        comment
        createdAt
        updatedAt
        deletedAt
      }
      updatedAt
      stepId
      shopId
      quantityPerPack
      quantity
      orderItemId
      orderId
      isEditable
      inventoryType
      inventoryName
      inventoryId
      inventoryCategoryId
      deletedAt
      createdAt
      amountPerItem
      amount
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
`;

export const GET_SHOP_OFFLINE_ORDER_STATUS = gql`
  query GetShopOfflineOrderStatus($shopId: String!) {
    getShopOfflineOrderStatus(shopId: $shopId)
  }
`;

export const UPDATE_SHOP_OFFLINE_ORDER_STATUS = gql`
  mutation UpdateShopOfflineOrderStatus($shopId: String!, $status: Boolean!) {
    updateShopOfflineOrderStatus(shopId: $shopId, status: $status) {
      successful
    }
  }
`;

export const CREATE_OFFLINE_ORDER = gql`
  mutation CreateOfflineOrder($orderItems: [SelectedOrder]!, $shopId: String!) {
    createOfflineOrder(orderItems: $orderItems, shopId: $shopId) {
      successful
    }
  }
`;

export const GET_SHOP_TAGS = gql`
  query GetShopTags($shopId: String, $searchString: String) {
    getShopTags(shopId: $shopId, searchString: $searchString) {
      tagId
      tagName
    }
  }
`;

export const MERGE_ORDER = gql`
  mutation MergeOrder($shopId: String!, $orderIds: [String]!) {
    mergeOrder(shopId: $shopId, orderIds: $orderIds) {
      successful
    }
  }
`;
