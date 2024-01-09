import { gql } from "@apollo/client";
import { userSchema, userSchemaV2 } from "./auth.schema";
import { shopSchema } from "./shops.schema";

export const roleSchema = `
    roleId
    shopId
    roleName
    rolePermissions
    defaultRole
    updatedAt
    createdAt
`;

export const CREATE_ROLE = gql`
    mutation createRole($roleName: String!, $rolePermissions: String!, $shopId: ID!, $defaultRole: Boolean) {
        createRole(roleName: $roleName, rolePermissions: $rolePermissions, shopId: $shopId, defaultRole: $defaultRole) {
            ${roleSchema}
        }
    }
`;
export const UPDATE_USER = gql`
    mutation updateUser($userId: ID!, $businessName: String, $firstName: String, $lastName: String, $email: String, $mobileNumber: String, $roleId: String) {
        updateUser(userId: $userId, businessName: $businessName, firstName: $firstName, lastName: $lastName, email: $email, roleId: $roleId, mobileNumber: $mobileNumber) {
            ${userSchema}
        }
    }
`;
export const GET_ALL_ROLES = gql`
  query getAllRoles($shopId: ID!) {
    getAllRoles(shopId: $shopId) {
      roleId
      shopId
      roleName
      rolePermissions
      defaultRole
      updatedAt
      createdAt
    }
  }
`;
export const GET_ALL_PERMISSIONS = gql`
  query getAllPermissions {
    getAllPermissions {
      name
      view
      manage
    }
  }
`;
export const GET_ALL_USERS = gql`
    query getAllUsers($limit: Int, $page: Int, $shopId: ID, $isStaff: Boolean) {
        getAllUsers(limit: $limit, page: $page, shopId: $shopId, isStaff: $isStaff) {
            ${userSchemaV2}
        }
    }
`;
export const GET_ROLE = gql`
    query GetRole($roleId: ID!) {
        getRole(roleId: $roleId) {
            ${roleSchema}
        }
    }
`;

export const CREATE_USER_INVITE = gql`
mutation createUserInvite($shopId: ID!, $roleId: ID, $mobileOrEmail: String! ) {
    createUserInvite(shopId: $shopId, roleId: $roleId, mobileOrEmail: $mobileOrEmail) {
      Role {
        ${roleSchema}
      }
      createdAt
      userId
      updatedAt
      status
      shopId
      roleId
      mobileNumber
      inviteId
      email
      deletedAt
    }
  }
`;

export const GET_USER_INVITES = gql`
  query GetPendingInvites($shopId: ID) {
    getPendingInvites(shopId: $shopId) {
      inviteId
      shopId
      userId
      roleId
      email
      mobileNumber
      status
      createdAt
      updatedAt
      deletedAt
      Role {
        ${roleSchema}
      }
      Shop {
        ${shopSchema}
      }
    }
  }
`;

export const CANCEL_INVITE_REQUEST = gql`
  mutation changeUserInviteStatus($status: UserInviteStatus!, $inviteId: ID!) {
    changeUserInviteStatus(status: $status, inviteId: $inviteId)
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($userId: ID!) {
    deleteUser(userId: $userId)
  }
`;

export const DELETE_ROLE = gql`
  mutation deleteRole($roleId: ID!) {
    deleteRole(roleId: $roleId)
  }
`;
export const UPDATE_ROLE = gql`
  mutation updateRole($roleId: ID!, $roleName: String, $rolePermissions: String) {
    updateRole(roleId: $roleId, roleName: $roleName, rolePermissions: $rolePermissions)
  }
`;
