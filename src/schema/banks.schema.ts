import { gql } from "@apollo/client";

export const GET_BANKS = gql`
  query GetBanks {
    getBanks {
      bankCode
      bankName
    }
  }
`;

export const CREATE_BANK_DETAILS = gql`
  mutation CreateBankDetails($bankName: String!, $accountName: String!, $accountNumber: String!, $shopId: ID!) {
    createBankDetails(bankName: $bankName, accountName: $accountName, accountNumber: $accountNumber, shopId: $shopId) {
      accountName
      accountNumber
      bankName
    }
  }
`;

export const GET_BANK_DETAILS = gql`
  query GetAllBankDetails($shopId: ID!) {
    getAllBankDetails(shopId: $shopId) {
      accountName
      accountNumber
      bankDetailId
      bankName
      shopId
    }
  }
`;

export const DELETE_BANK_DETAILS = gql`
  mutation DeleteBankDetails($bankDetailId: String!, $shopId: ID!) {
    deleteBankDetails(bankDetailId: $bankDetailId, shopId: $shopId)
  }
`;

export const UPDATE_BANK_DETAILS = gql`
  mutation UpdateBankDetails($bankDetailId: String!, $shopId: ID!, $bankName: String, $accountName: String, $accountNumber: String) {
    updateBankDetails(bankDetailId: $bankDetailId, shopId: $shopId, bankName: $bankName, accountName: $accountName, accountNumber: $accountNumber) {
      accountName
      accountNumber
      bankDetailId
      bankName
    }
  }
`;
