export const DefualtManagerRoles = {
  roleName: "Manager",
  rolePermissions: [
    "VIEW_USER",
    "MANAGE_USER",
    "VIEW_SHOP",
    "MANAGE_SHOP",
    "VIEW_INVENTORY",
    "MANAGE_INVENTORY",
    "VIEW_ROLE",
    "MANAGE_ROLE",
    "VIEW_SUPPLY",
    "MANAGE_SUPPLY",
    "VIEW_SALE",
    "MANAGE_SALE",
    "VIEW_ALL_SALES",
    "MANAGE_ALL_SALES",
    "VIEW_PENDING_SALE",
    "MANAGE_PENDING_SALE",
    "VIEW_CASH_INFLOW",
    "MANAGE_CASH_INFLOW",
    "VIEW_EXPENDITURE",
    "MANAGE_EXPENDITURE",
    "VIEW_SUBSCRIPTION",
    "MANAGE_SUBSCRIPTION",
    "VIEW_DISCOUNT",
    "MANAGE_DISCOUNT",
    "VIEW_CUSTOMER",
    "MANAGE_CUSTOMER",
    "VIEW_SELL_ON_CREDIT",
    "MANAGE_SELL_ON_CREDIT",
    "VIEW_REPORT",
    "MANAGE_REPORT",
  ],
};

export const defaultCashierRoles = {
  roleName: "Cashier",
  rolePermissions: ["VIEW_SALE", "MANAGE_SALE", "VIEW_PENDING_SALE", "MANAGE_PENDING_SALE"],
};

export const defaultSalesRoles = {
  roleName: "SalesPerson",
  rolePermissions: ["VIEW_SALE", "MANAGE_SALE", "VIEW_PENDING_SALE", "MANAGE_PENDING_SALE"],
};
