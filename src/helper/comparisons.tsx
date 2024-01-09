import { UserPermissions } from "../app/slices/roles";
import { IShop } from "../interfaces/shop.interface";
import { UsersAttr } from "../interfaces/user.interface";

export const isDateEqual = (firstDate: Date, secondDate: Date) => {
  if (
    firstDate.getDate() === secondDate.getDate() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getFullYear() === secondDate.getFullYear()
  ) {
    return true;
  }
  return false;
};

export const hasPermission = (
  permission: string,
  userRolePermissions: string[] | UserPermissions
) => {
  if (Array.isArray(userRolePermissions)) {
    return userRolePermissions.includes(permission);
  }

  return userRolePermissions.isShopOwner || userRolePermissions.permissions.includes(permission);
};

export const hasAnyPermission = (
  permissions: string[],
  userRolePermissions: string[] | UserPermissions
) => {
  let permissionList = userRolePermissions as string[];

  if (!Array.isArray(userRolePermissions)) {
    if (userRolePermissions.isShopOwner) {
      return true;
    }

    permissionList = userRolePermissions.permissions;
  }

  for (let i = 0; i < permissionList.length; i++) {
    if (permissions.includes(permissionList[i])) {
      return true;
    }
  }

  return false;
};

export const hasMultiplePermissions = (
  permissions: string[],
  userRolePermissions: string[] | UserPermissions
) => {
  let permissionList = userRolePermissions as string[];

  if (!Array.isArray(userRolePermissions)) {
    if (userRolePermissions.isShopOwner) {
      return true;
    }

    permissionList = userRolePermissions.permissions;
  }

  for (let i = 0; i < permissionList.length; i++) {
    if (permissions.includes(permissionList[i])) {
      continue;
    }

    return false;
  }

  return true;
};

export const syncTotalTableCount = (
  syncTableUpdateCount: { [key: string]: number },
  tables: any[]
) => {
  return tables.reduce((prevCount: number, tableModel: any) => {
    return prevCount + (syncTableUpdateCount[tableModel] ?? 0);
  }, 0);
};

export const checkPermission = (permission: string, userPermissions: UserPermissions) => {
  const result = {
    isMerchant: false,
    manageInventory: false,
    viewInventory: false,
    manageSale: false,
    viewSale: false,
    viewAllSales: false,
    manageAllSales: false,
    viewCashInflow: false,
    manageCashInflow: false,
    viewExpenditure: false,
    manageExpenditure: false,
    manageUser: false,
    viewCustomer: false,
    manageCustomer: false,
  };

  if (userPermissions?.isShopOwner) {
    result.isMerchant = true;
    return result;
  }

  switch (permission) {
    case "MANAGE_INVENTORY":
      result.manageInventory = hasPermission(permission, userPermissions);
      break;
    case "VIEW_INVENTORY":
      result.viewInventory = hasPermission(permission, userPermissions);
      break;
    case "MANAGE_SALE":
      result.manageSale = hasPermission(permission, userPermissions);
      break;
    case "VIEW_SALE":
      result.viewSale = hasPermission(permission, userPermissions);
      break;
    case "VIEW_ALL_SALES":
      result.viewAllSales = hasPermission(permission, userPermissions);
      break;
    case "MANAGE_ALL_SALES":
      result.manageAllSales = hasPermission(permission, userPermissions);
      break;
    case "VIEW_CASH_INFLOW":
      result.viewCashInflow = hasPermission(permission, userPermissions);
      break;
    case "MANAGE_CASH_INFLOW":
      result.manageCashInflow = hasPermission(permission, userPermissions);
      break;
    case "VIEW_EXPENDITURE":
      result.viewExpenditure = hasPermission(permission, userPermissions);
      break;
    case "MANAGE_EXPENDITURE":
      result.manageExpenditure = hasPermission(permission, userPermissions);
      break;
    case "MANAGE_USER":
      result.manageUser = hasPermission(permission, userPermissions);
      break;
    case "VIEW_CUSTOMER":
      result.viewCustomer = hasPermission(permission, userPermissions);
      break;
    case "MANAGE_CUSTOMER":
      result.manageCustomer = hasPermission(permission, userPermissions);
      break;
    default:
      break;
  }

  return result;
};
