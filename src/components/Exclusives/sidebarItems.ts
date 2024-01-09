import BusinessesIcon from "../../assets/businesses.svg";
import AdjustmentsIcon from "../../assets/adjustments.svg";
import OrdersIcon from "../../assets/order.svg";
import PrinterIcon from "../../assets/printer-settings.svg";
import QrIcon from "../../assets/qr-code.svg";
import ReceiptIcon from "../../assets/receipt.svg";
import SuppliersIcon from "../../assets/suppliers.svg";
import TagIcon from "../../assets/tag.svg";
import StaffIcon from "../../assets/2User.svg";
import InflowExpIcon from "../../assets/inflowExp.svg";
import BReportIcon from "../../assets/business-report.svg";
import homeIcon from "../../assets/Home.svg";
import homeIconA from "../../assets/HomeA.svg";
import activityIcon from "../../assets/Activity.svg";
import activityIconA from "../../assets/ActivityA.svg";
import graphIcon from "../../assets/Graph.svg";
import graphIconA from "../../assets/GraphA.svg";
import walletIcon from "../../assets/Wallet.svg";
import walletIconA from "../../assets/WalletA.svg";
import orderIcon from "../../assets/Orders.svg";
import orderIconA from "../../assets/OrdersA.svg";
import userIcon from "../../assets/User.svg";
import userIconA from "../../assets/UserA.svg";
import { isFigorr } from "../../utils/constants";

export type SidebarDetailsType = {
  name: string;
  icon: string;
  path: string;
  activeIcon?: string;
  allowedRoles: string[];
};

export type ExclusiveItemsType = {
  id: number;
  name: string;
  icon?: string;
  path: string;
  activeIcon?: string;
  allowedRoles: string[];
};

export const settingsRoles = [
  "MANAGE_INVENTORY",
  "VIEW_INVENTORY",
  "MANAGE_SALE",
  "VIEW_SALE",
  "VIEW_ALL_SALES",
  "MANAGE_ALL_SALES",
  "VIEW_CASH_INFLOW",
  "MANAGE_CASH_INFLOW",
  "VIEW_EXPENDITURE",
  "MANAGE_EXPENDITURE",
  "MANAGE_USER",
  "VIEW_CUSTOMER",
  "MANAGE_CUSTOMER",
];

export const exclusiveItems = isFigorr
  ? [
      // {
      //   id: 1,
      //   name: "Business Report",
      //   path: "#",
      //   icon: BReportIcon,
      //   allowedRoles: [],
      // },
      {
        id: 2,
        name: "Inflow/Expenses",
        path: "/expenses",
        icon: InflowExpIcon,
        allowedRoles: [
          "VIEW_CASH_INFLOW",
          "MANAGE_CASH_INFLOW",
          "VIEW_EXPENDITURE",
          "MANAGE_EXPENDITURE",
        ],
      },
      {
        id: 3,
        name: "My Staff",
        path: "/staffs",
        icon: StaffIcon,
        allowedRoles: ["VIEW_USER", "MANAGE_USER"],
      },
      {
        id: 4,
        name: "Printer",
        path: "/settings?route=printer",
        icon: PrinterIcon,
        allowedRoles: settingsRoles,
      },
      {
        id: 5,
        name: "My Businesses",
        path: "/manage-businesses",
        icon: BusinessesIcon,
        allowedRoles: ["VIEW_SHOP", "MANAGE_SHOP"],
      },
      {
        id: 20,
        name: "Adjust Stock",
        path: "/stock-adjustment",
        icon: BusinessesIcon,
        allowedRoles: ["VIEW_SHOP", "MANAGE_SHOP"],
      },
      // {
      //   id: 6,
      //   name: "Table QR Code",
      //   path: "#",
      //   icon: QrIcon,
      //   allowedRoles: [],
      // },
      // {
      //   id: 7,
      //   name: "Invoice",
      //   path: "/invoices",
      //   icon: ReceiptIcon,
      //   allowedRoles: [],
      // },
      // {
      //   id: 8,
      //   name: "Stock Adj.",
      //   path: "#",
      //   icon: AdjustmentsIcon,
      //   allowedRoles: [],
      // },
      // {
      //   id: 9,
      //   name: "Offline Order",
      //   path: "/online-presence",
      //   icon: OrdersIcon,
      //   allowedRoles: [],
      // },
      // {
      //   id: 10,
      //   name: "Manage Tags",
      //   path: "#",
      //   icon: TagIcon,
      //   allowedRoles: [],
      // },
      {
        id: 11,
        name: "Suppliers",
        path: "/suppliers",
        icon: SuppliersIcon,
        allowedRoles: [
          "MANAGE_INVENTORY",
          "VIEW_INVENTORY",
          "MANAGE_SALE",
          "VIEW_SALE",
          "VIEW_CASH_INFLOW",
          "MANAGE_CASH_INFLOW",
          "VIEW_EXPENDITURE",
          "MANAGE_EXPENDITURE",
          "MANAGE_USER",
          "VIEW_ALL_SALES",
          "MANAGE_ALL_SALES",
        ],
      },
    ]
  : [
      // {
      //   id: 1,
      //   name: "Business Report",
      //   path: "#",
      //   icon: BReportIcon,
      //   allowedRoles: [],
      // },
      {
        id: 2,
        name: "Inflow/Expenses",
        path: "/expenses",
        icon: InflowExpIcon,
        allowedRoles: [
          "VIEW_CASH_INFLOW",
          "MANAGE_CASH_INFLOW",
          "VIEW_EXPENDITURE",
          "MANAGE_EXPENDITURE",
        ],
      },
      {
        id: 3,
        name: "My Staff",
        path: "/staffs",
        icon: StaffIcon,
        allowedRoles: ["VIEW_USER", "MANAGE_USER"],
      },
      {
        id: 4,
        name: "Printer",
        path: "/settings?route=printer",
        icon: PrinterIcon,
        allowedRoles: settingsRoles,
      },
      {
        id: 5,
        name: "My Businesses",
        path: "/manage-businesses",
        icon: BusinessesIcon,
        allowedRoles: ["VIEW_SHOP", "MANAGE_SHOP", "VIEW_USER"],
      },
      {
        id: 20,
        name: "Adjust Stock",
        path: "/stock-adjustment",
        icon: BusinessesIcon,
        allowedRoles: ["VIEW_SHOP", "MANAGE_SHOP"],
      },
      // {
      //   id: 6,
      //   name: "Table QR Code",
      //   path: "#",
      //   icon: QrIcon,
      //   allowedRoles: [],
      // },
      // {
      //   id: 7,
      //   name: "Invoice",
      //   path: "/invoices",
      //   icon: ReceiptIcon,
      //   allowedRoles: [],
      // },
      // {
      //   id: 8,
      //   name: "Stock Adj.",
      //   path: "#",
      //   icon: AdjustmentsIcon,
      //   allowedRoles: [],
      // },
      // {
      //   id: 9,
      //   name: "online presence",
      //   path: "/online-presence",
      //   icon: OrdersIcon,
      //   allowedRoles: [],
      // },
      {
        id: 10,
        name: "Subscription",
        path: "/subscriptions",
        icon: TagIcon,
        allowedRoles: [],
      },
      {
        id: 11,
        name: "Suppliers",
        path: "/suppliers",
        icon: SuppliersIcon,
        allowedRoles: [
          "MANAGE_INVENTORY",
          "VIEW_INVENTORY",
          "MANAGE_SALE",
          "VIEW_SALE",
          "VIEW_CASH_INFLOW",
          "MANAGE_CASH_INFLOW",
          "VIEW_EXPENDITURE",
          "MANAGE_EXPENDITURE",
          "MANAGE_USER",
          "VIEW_ALL_SALES",
          "MANAGE_ALL_SALES",
        ],
      },
    ];

export const sidebarDetails: SidebarDetailsType[] = isFigorr
  ? [
      {
        name: "Overview",
        icon: homeIcon,
        path: "",
        activeIcon: homeIconA,
        allowedRoles: [
          "MANAGE_INVENTORY",
          "VIEW_INVENTORY",
          "MANAGE_SALE",
          "VIEW_SALE",
          "VIEW_CASH_INFLOW",
          "MANAGE_CASH_INFLOW",
          "VIEW_EXPENDITURE",
          "MANAGE_EXPENDITURE",
          "MANAGE_USER",
          "VIEW_ALL_SALES",
          "MANAGE_ALL_SALES",
        ],
      },
      {
        // "MANAGE_SUPPLY"
        name: "Products",
        icon: graphIcon,
        path: "/product",
        activeIcon: graphIconA,
        allowedRoles: ["MANAGE_INVENTORY", "VIEW_INVENTORY"],
      },
      {
        name: "Sales",
        icon: activityIcon,
        path: "/sales",
        activeIcon: activityIconA,
        allowedRoles: ["MANAGE_SALE", "VIEW_SALE", "VIEW_ALL_SALES", "MANAGE_ALL_SALES"],
      },
      // {
      //   name: "Wallet",
      //   icon: walletIcon,
      //   path: "#",
      //   activeIcon: walletIconA,
      //   allowedRoles: [],
      // },

      // {
      //   name: "Orders",
      //   icon: orderIcon,
      //   path: "/online-presence",
      //   activeIcon: orderIconA,
      //   allowedRoles: [
      //     // TODO: use apt permissions for onlinePresence
      //     "VIEW_ALL_SALES",
      //     "MANAGE_ALL_SALES",
      //     "VIEW_SALE",
      //     "MANAGE_SALE",
      //   ],
      // },
      {
        name: "Debt Book",
        icon: userIcon,
        path: "/customers",
        activeIcon: userIconA,
        allowedRoles: ["VIEW_CUSTOMER", "MANAGE_CUSTOMER"],
      },

      // {
      //   name: "Shops",
      //   icon: shopIcon,
      //   path: "/shops",
      //   activeIcon: shopIconA,
      //   allowedRoles: ["MANAGE_USER"],
      // },
    ]
  : [
      {
        name: "Overview",
        icon: homeIcon,
        path: "",
        activeIcon: homeIconA,
        allowedRoles: [
          "MANAGE_INVENTORY",
          "VIEW_INVENTORY",
          "MANAGE_SALE",
          "VIEW_SALE",
          "VIEW_CASH_INFLOW",
          "MANAGE_CASH_INFLOW",
          "VIEW_EXPENDITURE",
          "MANAGE_EXPENDITURE",
          "MANAGE_USER",
          "VIEW_ALL_SALES",
          "MANAGE_ALL_SALES",
        ],
      },
      {
        // "MANAGE_SUPPLY"
        name: "Products",
        icon: graphIcon,
        path: "/product",
        activeIcon: graphIconA,
        allowedRoles: ["MANAGE_INVENTORY", "VIEW_INVENTORY"],
      },
      {
        name: "Sales",
        icon: activityIcon,
        path: "/sales",
        activeIcon: activityIconA,
        allowedRoles: ["MANAGE_SALE", "VIEW_SALE", "VIEW_ALL_SALES", "MANAGE_ALL_SALES"],
      },
      // {
      //   name: "Wallet",
      //   icon: walletIcon,
      //   path: "#",
      //   activeIcon: walletIconA,
      //   allowedRoles: [],
      // },

      {
        name: "Offline Orders",
        icon: orderIcon,
        path: "/online-presence",
        activeIcon: orderIconA,
        allowedRoles: [
          // TODO: use apt permissions for onlinePresence
          "VIEW_ALL_SALES",
          "MANAGE_ALL_SALES",
          "VIEW_SALE",
          "MANAGE_SALE",
        ],
      },
      {
        name: "Debt Book",
        icon: userIcon,
        path: "/customers",
        activeIcon: userIconA,
        allowedRoles: ["VIEW_CUSTOMER", "MANAGE_CUSTOMER"],
      },

      // {
      //   name: "Shops",
      //   icon: shopIcon,
      //   path: "/shops",
      //   activeIcon: shopIconA,
      //   allowedRoles: ["MANAGE_USER"],
      // },
    ];
