/* eslint-disable no-tabs */
import { gql } from "@apollo/client";
import { inventorySchema } from "./inventory.schema";

export const totalsSchema = `
  totalSupplierAmount
  totalAmountPaid
  totalAmountRemaining
  totalSupplierCount
`;

export const supplyItemSchema = `
		supplyItemId
		supplyRecordId
		shopId
		inventoryId
		variationId
		purchasePrice
		quantity
    InventoryItem {
      ${inventorySchema}
    }
		createdAt
		updatedAt
		deletedAt
`;

export const supplyTransactionchema = `
    supplyTransactionId
    supplyRecordId
    supplierId
    shopId
    amount
    paymentMethod
    comment
    createdAt
    updatedAt
    deletedAt
`;

export const supplyRecordSchema = `
    supplyRecordId
    supplierId
    comment
    shopId
    paymentStatus
    totalAmount
    amountPaid
    isCollected
    SupplyItems {
			${supplyItemSchema}
		}
    SupplyTransactions {
      ${supplyTransactionchema}
    }
		createdAt
    updatedAt
    deletedAt
`;

export const supplierSchema = `
    supplierId
    firstName
    lastName
    shopId
    mobileNumber
    address
    email
    SupplyRecord {
        ${supplyRecordSchema}
    }
    createdAt
    updateAt
    deletedAt
`;

export const GET_ALL_SUPPLIERS = gql`
	query getSuppliers($shopId: String!, $limit: Int, $page: Int, $searchQuery: String) {
		getSuppliers(shopId: $shopId, limit: $limit, page: $page, searchQuery: $searchQuery) {
			totals{
			${totalsSchema}
			}
      suppliers {
        ${supplierSchema}
      }
		}
	}
`;

export const GET_SUPPLIER = gql`
    query getSupplier($supplierId: String!, $shopId: String!) {
        getSupplier(supplierId: $supplierId, shopId: $shopId) {
            ${supplierSchema}
        }
    }
`;

export const GET_SUPPLY_RECORD = gql`
	query getSupplyRecord($supplyRecordId: String!, $shopId: String!) {
			getSupplyRecord(supplyRecordId: $supplyRecordId, shopId: $shopId) {
					${supplyRecordSchema}
			}
	}
`;

export const GET_SUPPLY_RECORD_BY_SUPPLIER_ID = gql`
	query getSupplyRecordsBySupplierId($supplierId: String!, $shopId: String!, $isCollected: Boolean, $paymentStatus: String) {
			getSupplyRecordsBySupplierId(supplierId: $supplierId, shopId: $shopId, isCollected: $isCollected, paymentStatus: $paymentStatus) {
					${supplyRecordSchema}
			}
	}
`;

export const GET_ALL_SUPPLY_RECORD = gql`
	query getSupplyRecords($shopId: String!, $limit: Int, $page: Int) {
			getSupplyRecords(shopId: $shopId, limit: $limit, page: $page) {
					${supplyRecordSchema}
			}
	}
`;

export const GET_SUPPLY_RECORD_TRANSACTIONS = gql`
	query getSupplyRecordsTransactions($shopId: String!, $limit: Int, $page: Int) {
			getSupplyRecordsTransactions(shopId: $shopId, limit: $limit, page: $page) {
					${supplierSchema}
			}
	}
`;

export const CREATE_SUPPLIER = gql`
    mutation createSupplier(
			$firstName: String!,
      $lastName: String!,
      $shopId: String!,
      $mobileNumber: String!,
      $address: String,
      $email: String,
			) {
        createSupplier(
				firstName: $firstName, 
				lastName: $lastName, 
				shopId: $shopId, 
				mobileNumber: $mobileNumber, 
				address: $address, 
				email: $email, 
			) {
        ${supplierSchema}
      }
    }
`;

export const UPDATE_SUPPLIER = gql`
  mutation updateSupplier(
    $supplierId: String!
    $firstName: String!
    $lastName: String
    $shopId: String!
    $mobileNumber: String
    $address: String
    $email: String
  ) {
    updateSupplier(
      supplierId: $supplierId
      firstName: $firstName
      lastName: $lastName
      shopId: $shopId
      mobileNumber: $mobileNumber
      address: $address
      email: $email
    ) {
      successful
    }
  }
`;

export const CREATE_SUPPLY_RECORD = gql`
  mutation createSupplyRecord(
    $supplierId: String!
    $shopId: String!
    $comment: String
    $paymentStatus: SupplyPaymentStatus!
    $totalAmount: Float!
    $isCollected: Boolean!
    $amountPaid: Float!
    $SupplyItems: [SupplyItemInput]!
  ) {
    createSupplyRecord(
      supplierId: $supplierId
      shopId: $shopId
      comment: $comment
      isCollected: $isCollected
      amountPaid: $amountPaid
      paymentStatus: $paymentStatus
      totalAmount: $totalAmount
      SupplyItems: $SupplyItems
    ) {
      successful
    }
  }
`;

export const CREATE_SUPPLY_TRANSACTION = gql`
  mutation createSupplyTransaction(
    $selectedRecords: [SupplyRecordTransactionInput!]!
    $totalAmountPaid: Int!
    $transactionComment: String
  ) {
    createSupplyTransaction(
      selectedRecords: $selectedRecords
      totalAmountPaid: $totalAmountPaid
      transactionComment: $transactionComment
    ) {
      successful
    }
  }
`;

export const MARK_SUPPLY_RECORD_COLLECTED = gql`
  mutation markSupplyRecordCollected(
    $supplyRecordId: String!
    $shopId: String!
    $shouldRestock: Boolean
  ) {
    markSupplyRecordCollected(
      supplyRecordId: $supplyRecordId
      shopId: $shopId
      shouldRestock: $shouldRestock
    ) {
      successful
    }
  }
`;

export const DELETE_SUPPLY_RECORD = gql`
  mutation deleteSupplyRecord($supplyRecordIds: [String!]!, $shopId: String!) {
    deleteSupplyRecord(supplyRecordIds: $supplyRecordIds, shopId: $shopId) {
      successful
    }
  }
`;

export const DELETE_SUPPLIER = gql`
  mutation deleteSupplier($supplierIds: [String!]!, $shopId: String!) {
    deleteSupplier(supplierIds: $supplierIds, shopId: $shopId) {
      successful
    }
  }
`;
