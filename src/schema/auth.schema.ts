import { gql } from "@apollo/client";
import { shopSchema } from "./shops.schema";

export const rolesSchema = `
  roleId
  shopId
  roleName
  rolePermissions
  defaultRole
`;

export const userShopAtrr = `
    userShopsId
    userId
    roleId
    shopId
    Roles {
      roleId
      shopId
      roleName
      rolePermissions
      defaultRole
    }
    updatedAt
    createdAt
    deletedAt
`;

export const userSchema = `
  userId
  businessName
  firstName
  lastName
  mobileNumber
  fullName
  email
`;

export const userSchemaV2 = `
  userId
  businessName
  firstName
  lastName
  mobileNumber
  fullName
  email
  UserShops {
    userShopsId
    userId
    roleId
    shopId
    Role {
      roleId
      shopId
      roleName
      rolePermissions
      defaultRole
    }
    updatedAt
    createdAt
    deletedAt
  }
`;

export const SIGNUP = gql`
  mutation signup(
    $firstName: String!
    $lastName: String!
    $email: String!
    $mobileNumber: String
    $companyName: String
    $password: String!
    $countryCode: String!
  ) {
    signup(
      firstName: $firstName
      lastName: $lastName
      email: $email
      mobileNumber: $mobileNumber
      companyName: $companyName
      password: $password
      countryCode: $countryCode
    ) {
      token
      success
      userId
    }
  }
`;

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!, $deviceTokenId: String) {
    login(mobileOrEmail: $email, password: $password, deviceTokenId: $deviceTokenId) {
      success
      userId
      token
      roles {
        ${rolesSchema}
      }
      shops {
        ${shopSchema}
      }
    }
  }
`;

export const GETUSER = gql`
  query getUser($userId: ID!) {
    getUser(userId: $userId) {
      ${userSchema}
    }
  }
`;
export const UPDATE_USER = gql`
  mutation UpdateUser(
    $userId: ID!
    $firstName: String
    $businessName: String
    $lastName: String
    $email: String
    $mobileNumber: String
  ) {
    updateUser(
      userId: $userId
      firstName: $firstName
      businessName: $businessName
      lastName: $lastName
      email: $email
      mobileNumber: $mobileNumber
    ) {
      userId
      businessName
      firstName
      lastName
      mobileNumber
      fullName
      email
    }
  }
`;

export const GET_ALL_USER = gql`
  query getAllUsers($shopId: ID) {
    getAllUsers(shopId: $shopId) {
      userId
      businessName
      firstName
      lastName
      fullName
      email
      mobileNumber
      merchantId
      isMerchant
      updatedAt
      createdAt
      Shops {
        shopId
        shopName
        shopAddress
        shopPhone
      }
      lastSeen
      lastAction
    }
  }
`;

export const CREATE_USER_PIN = gql`
  mutation CreateUserPin($pin: String!) {
    createUserPin(pin: $pin) {
      userId
      pin
      createdAt
      updatedAt
    }
  }
`;

export const COMFIRM_USER_PIN = gql`
  mutation confirmPin($pin: String!, $userId: String!) {
    confirmPin(pin: $pin, userId: $userId) {
      token
      success
      shops {
        ${shopSchema}
      }
    }
  }
`;

export const CAN_USER_SET_PIN = gql`
  query canSetUserPin {
    canSetUserPin
  }
`;

export const GET_USERS_WITH_PIN = gql`
  query GetAuthenticatedUsersWithPin {
    getAuthenticatedUsersWithPin {
      fullName
      userId
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($mobileOrEmail: String!) {
    resetPassword(mobileOrEmail: $mobileOrEmail) {
      success
    }
  }
`;

export const VERIFY_RESET_CODE = gql`
  mutation VerifyResetCode($passwordResetCode: String!) {
    verifyResetCode(passwordResetCode: $passwordResetCode) {
      success
      msg
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      success
      msg
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($userId: ID!) {
    deleteUser(userId: $userId)
  }
`;

export const SET_NEW_PASSWORD = gql`
  mutation SetNewPassword($newPassword: String!, $passwordResetCode: String) {
    setNewPassword(newPassword: $newPassword, passwordResetCode: $passwordResetCode) {
      success
      msg
    }
  }
`;

export const DELETE_USER_FROM_SHOP = gql`
  mutation RemoveUserFromShop($userId: String!, $shopId: String!) {
    removeUserFromShop(userId: $userId, shopId: $shopId)
  }
`;
