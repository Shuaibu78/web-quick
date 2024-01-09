import { hasMultiplePermissions, hasPermission } from "./../../helper/comparisons";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface IRole {
  roleId?: string;
  roleName?: string;
  rolePermissions?: string;
  shopId?: string;
  defaultRole?: boolean;
  createdAt?: Date;
}

export interface UserPermissions {
  isShopOwner: boolean;
  permissions: string[];
}

interface IIntial {
  permissions: string[];
  isShopOwner: boolean;
  roleName?: string;
  roleId?: string;
}

const initialState: IIntial = {
  permissions: [],
  isShopOwner: false,
};

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {
    setRole(state, { payload }) {
      state.permissions = payload.rolePermissions?.split(",") || [];
      state.isShopOwner = payload.isShopOwner as boolean;
      state.roleId = payload.roleId;
    },
  },
});

export const userHasPermission = (permissions: string[]) => (state: RootState) =>
  state.roles.isShopOwner || hasMultiplePermissions(permissions, state.roles.permissions);

export const getUserPermissions = (state: RootState): UserPermissions => ({
  permissions: state.roles.permissions,
  isShopOwner: state.roles.isShopOwner,
});

export const { setRole } = roleSlice.actions;

export default roleSlice.reducer;
