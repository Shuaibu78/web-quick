import { gql } from "@apollo/client";

export const GET_NOTIFICATION_PREFERENCE = gql`
  query GetAllNotificationPreference($shopId: String!) {
    getAllNotificationPreference(shopId: $shopId) {
      notificationPreferenceId
      userId
      shopId
      key
      push
      email
      createdAt
      updatedAt
      DeletedAt
    }
  }
`;

export const UPDATE_NOTIFICATION_PREFERENCE = gql`
  mutation UpdateNotificationPreference(
    $shopId: String!
    $key: NotificationType!
    $type: NotificationKey!
    $value: Boolean!
  ) {
    updateNotificationPreference(shopId: $shopId, key: $key, type: $type, value: $value) {
      successful
    }
  }
`;
