import { gql } from "@apollo/client";

export const GET_CUSTOMER = gql`
  query GetCustomer($shopId: ID!, $customerId: ID!) {
    getCustomer(shopId: $shopId, customerId: $customerId) {
      customer {
        customerName
        CustomerTransactions {
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
          dueDate
          receiptId
          smsReminderEnabled
          emailReminderEnabled
        }
        address
        phoneNumber
        email
        shopId
        customerId
        updatedAt
        createdAt
        creditLimit
      }
      customerTransactionInfo {
        creditTotal
        depositTotal
      }
    }
  }
`;

export const DELETE_CUSTOMER_TRANSACTION = gql`
  mutation DeleteCustomerTransaction($customerId: ID!, $customerTransactionId: ID!, $shopId: ID!) {
    deleteCustomerTransaction(
      customerId: $customerId
      customerTransactionId: $customerTransactionId
      shopId: $shopId
    )
  }
`;
