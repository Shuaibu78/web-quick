import { gql } from "@apollo/client";

const customerSchema = `
    customerId
    customerName
    phoneNumber
    email
    address
    shopId
    createdAt
    updatedAt
    creditLimit
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
    }
`;
export const CREATE_CUSTOMER = gql`
    mutation createCustomer(
        $customerName: String!,
        $phoneNumber: String!,
        $address: String,
        $email: String,
        $shopId: ID!,
        $creditLimit: Int,
    ) {
        createCustomer(
        customerName:$customerName,
        phoneNumber:$phoneNumber,
        address:$address,
        email: $email,
        shopId: $shopId,
        creditLimit: $creditLimit,
        ) {
            ${customerSchema}
        }
    }
`;
export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer(
    $customerId: ID!
    $shopId: ID!
    $customerName: String
    $phoneNumber: String
    $address: String
    $email: String
    $creditLimit: Int
  ) {
    updateCustomer(
      customerId: $customerId
      shopId: $shopId
      customerName: $customerName
      phoneNumber: $phoneNumber
      address: $address
      email: $email
      creditLimit: $creditLimit
    )
  }
`;

export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($customerId: ID!, $shopId: ID!) {
    deleteCustomer(customerId: $customerId, shopId: $shopId)
  }
`;

export const DELETE_MULTIPLE_CUSTOMER = gql`
  mutation deleteMultipleCustomer($customerIdsToDelete: [ID!], $shopId: ID!) {
    deleteMultipleCustomer(customerIdsToDelete: $customerIdsToDelete, shopId: $shopId)
  }
`;

export const GET_ALL_CUSTOMERS = gql`
    query getAllCustomers(
    $shopId: ID!,
    $limit: Int,
    $searchString: String,
    $page: Int,
    $from: String,
    $to: String,
    ) {
    getAllCustomers(
        shopId: $shopId,
        limit: $limit,
        searchString: $searchString,
        page: $page,
        from: $from,
        to: $to,
    ) {
        totalCustomers
        customers {
            ${customerSchema}
        }
    }
    }
`;
export const GET_TOTAL_CREDITS = gql`
  query getTotalCredits($shopId: ID!, $from: String, $to: String) {
    getTotalCredits(shopId: $shopId, from: $from, to: $to)
  }
`;
export const GET_TOTAL_DEPOSITS = gql`
  query getTotalDeposits($shopId: ID!, $from: String, $to: String) {
    getTotalDeposits(shopId: $shopId, from: $from, to: $to)
  }
`;
export const CREATE_CUSTOMER_TRANSACTION = gql`
  mutation createCustomerTransaction(
    $customerId: ID!
    $receiptId: String
    $amount: Int!
    $isCredit: Boolean!
    $comment: String
    $shopId: ID!
    $parentCustomerTransactionId: String
    $dueDate: String
    $emailReminderEnabled: Boolean
    $smsReminderEnabled: Boolean
  ) {
    createCustomerTransaction(
      customerId: $customerId
      receiptId: $receiptId
      amount: $amount
      isCredit: $isCredit
      comment: $comment
      shopId: $shopId
      parentCustomerTransactionId: $parentCustomerTransactionId
      dueDate: $dueDate
      emailReminderEnabled: $emailReminderEnabled
      smsReminderEnabled: $smsReminderEnabled
    ) {
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
    }
  }
`;

export const UPDATE_CUSTOMER_TRANSACTION = gql`
  mutation UpdateCustomerTransaction(
      $customerTransactionId: ID!
      $customerId: ID!
      $shopId: ID!
      $amount: Int!
      $comment: String
      $dueDate: String
      $smsReminderEnabled: Boolean
      $emailReminderEnabled: Boolean
      $parentCustomerTransactionId: String
    ) {
    updateCustomerTransaction(
      customerTransactionId: $customerTransactionId
      customerId: $customerId
      shopId: $shopId
      amount: $amount
      comment: $comment
      dueDate: $dueDate
      smsReminderEnabled: $smsReminderEnabled
      emailReminderEnabled: $emailReminderEnabled
      parentCustomerTransactionId: $parentCustomerTransactionId
    ) {
      updatedAt
    }
  }
`;
