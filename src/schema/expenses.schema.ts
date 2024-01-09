import { gql } from "@apollo/client";

export const GET_ALL_TRANSACTIONS = gql`
  query GetAllTransactions(
    $shopId: ID!
    $limit: Int
    $view: String
    $includeSales: Boolean!
    $includeSupplies: Boolean!
    $page: Int
    $from: String
    $to: String
    $expenditureCategoryIds: [String]
    $userIds: String
    $searchTerm: String
  ) {
    getAllTransactions(
      shopId: $shopId
      limit: $limit
      view: $view
      includeSales: $includeSales
      includeSupplies: $includeSupplies
      page: $page
      from: $from
      to: $to
      expenditureCategoryIds: $expenditureCategoryIds
      userIds: $userIds
      searchTerm: $searchTerm
    ) {
      totalTransactionAmount {
        totalInflowAmount
        totalExpenditureAmount
      }
      transactions {
        amount
        date
        isExpenditure
        name
        category
        updatedAt
        remark
        userId
        paymentMethod
        inflowOrExpenditureId
      }
      total
    }
  }
`;

export const CREATE_EXPENDITURE = gql`
  mutation createExpenditure(
    $name: String!
    $amount: Int!
    $remark: String
    $date: String
    $shopId: ID!
    $expenditureCategoryId: String
    $paymentMethod: String
  ) {
    createExpenditure(
      expenditureName: $name
      amount: $amount
      remark: $remark
      date: $date
      expenditureCategoryId: $expenditureCategoryId
      shopId: $shopId
      paymentMethod: $paymentMethod
    ) {
      expenditureId
      expenditureName
      amount
      remark
      expenditureCategoryId
      shopId
      userId
      createdAt
      paymentMethod
    }
  }
`;

export const CREATE_CASH_INFLOW = gql`
  mutation createCashInFlow(
    $income: String!
    $amount: Int!
    $incomeSource: String
    $remark: String
    $date: String
    $paymentMethod: String
    $shopId: ID!
  ) {
    createCashInFlow(
      income: $income
      amount: $amount
      incomeSource: $incomeSource
      remark: $remark
      date: $date
      shopId: $shopId
      paymentMethod: $paymentMethod
    ) {
      cashInflowId
      income
      amount
      incomeSource
      remark
      shopId
      createdAt
      paymentMethod
    }
  }
`;

export const CREATE_EXPENDITURE_CATEGORY = gql`
  mutation createExpenditureCategory($name: String!, $shopId: ID!) {
    createExpenditureCategory(expenditureCategoryName: $name, shopId: $shopId) {
      expenditureCategoryId
      expenditureCategoryName
      shopId
      createdAt
    }
  }
`;
export const GET_ALL_EXPENDITURE_CATEGORY = gql`
  query getAllExpenditureCategory($shopId: ID!) {
    getAllExpenditureCategory(shopId: $shopId) {
      expenditureCategoryId
      expenditureCategoryName
      shopId
      createdAt
    }
  }
`;
export const GET_TOTAL_CASH_INFLOW = gql`
  query getTotalCashInFlow($shopId: ID!, $from: String, $to: String) {
    getTotalCashInFlow(shopId: $shopId, from: $from, to: $to) {
      totalCashInFlow
    }
  }
`;
export const GET_TOTAL_EXPENDITURE = gql`
  query getTotalExpenditure($shopId: ID!, $from: String, $to: String) {
    getTotalExpenditure(shopId: $shopId, from: $from, to: $to) {
      totalExpenditure
    }
  }
`;
export const GET_ALL_EXPENDITURE = gql`
  query getAllExpenditure($shopId: ID!, $limit: Int, $page: Int, $from: String, $to: String) {
    getAllExpenditure(shopId: $shopId, limit: $limit, page: $page, from: $from, to: $to) {
      totalExpenditures
      expenditures {
        expenditureId
        expenditureName
        amount
        createdAt
        ExpenditureCategory {
          expenditureCategoryId
          expenditureCategoryName
          shopId
          createdAt
        }
        remark
        userId
      }
    }
  }
`;
export const GET_ALL_CASH_INFLOW = gql`
  query getAllCashInFlow($shopId: ID!, $limit: Int, $page: Int, $from: String, $to: String) {
    getAllCashInFlow(shopId: $shopId, limit: $limit, page: $page, from: $from, to: $to) {
      totalCashInFlows
      cashInFlows {
        cashInflowId
        income
        amount
        createdAt
        remark
        incomeSource
        userId
      }
    }
  }
`;

export const UPDATE_EXPENDITURE = gql`
  mutation UpdateExpenditure(
    $expenditureId: ID!
    $expenditureName: String!
    $expenditureCategoryId: ID
    $amount: Int
    $remark: String
    $paymentMethod: String
    $shopId: ID
  ) {
    updateExpenditure(
      expenditureId: $expenditureId
      expenditureName: $expenditureName
      expenditureCategoryId: $expenditureCategoryId
      amount: $amount
      remark: $remark
      shopId: $shopId
      paymentMethod: $paymentMethod
    )
  }
`;
export const UPDATE_CASH_INFLOW = gql`
  mutation UpdateCashInFlow(
    $income: String!
    $cashInflowId: ID
    $amount: Int
    $incomeSource: String
    $remark: String
    $paymentMethod: String
  ) {
    updateCashInFlow(
      income: $income
      cashInflowId: $cashInflowId
      amount: $amount
      incomeSource: $incomeSource
      remark: $remark
      paymentMethod: $paymentMethod
    )
  }
`;
export const DELETE_EXPENDITURE = gql`
  mutation DeleteExpenditure($expenditureId: ID) {
    deleteExpenditure(expenditureId: $expenditureId)
  }
`;
export const DELETE_CASH_INFLOW = gql`
  mutation DeleteCashInFlow($cashInflowId: ID!) {
    deleteCashInFlow(cashInflowId: $cashInflowId)
  }
`;

export const UPDATE_EXPENDITURE_CATEGORY = gql`
  mutation updateExpenditureCategory(
    $expenditureCategoryName: String!
    $expenditureCategoryId: ID!
    $shopId: ID
  ) {
    updateExpenditureCategory(
      expenditureCategoryName: $expenditureCategoryName
      expenditureCategoryId: $expenditureCategoryId
      shopId: $shopId
    )
  }
`;

export const DELETE_EXPENDITURE_CATEGORY = gql`
  mutation deleteExpenditureCategory($expenditureCategoryId: ID!) {
    deleteExpenditureCategory(expenditureCategoryId: $expenditureCategoryId)
  }
`;
