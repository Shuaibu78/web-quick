import { gql } from "@apollo/client";

export const taxSchema = `
    createdAt
    deletedAt
    includeOnEverySales
    isInclusive
    name
    shopId
    taxId
    updatedAt
    value
`;
export const GET_ALL_TAXES = gql`
    query getAllTaxes($shopId: ID!) {
        getAllTaxes(shopId: $shopId) {
            ${taxSchema}
        }
    }
`;
export const GET_SINGLE_TAX = gql`
    query getTax($taxId: ID!) {
        getTax(taxId: $taxId) {
            ${taxSchema}
        }
    }
`;
export const ADD_TAX = gql`
    mutation addTax($input: TaxInput!) {
        addTax(input: $input) {
            ${taxSchema}
        }
    }
`;
export const UPDATE_TAX = gql`
    mutation updateTax($taxId: ID!, $input: TaxInput!) {
        updateTax(taxId: $taxId, input: $input) {
            ${taxSchema}
        }
    }
`;
export const DELETE_TAX = gql`
    mutation deleteTax($taxId: ID!) {
        deleteTax(taxId: $taxId) {
            ${taxSchema}
        }
    }
`;
