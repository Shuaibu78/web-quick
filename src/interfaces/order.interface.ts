import { IInventory, InventoryType } from "./inventory.interface";
import { IShop } from "./shop.interface";
import { UsersAttr } from "./user.interface";

export interface IOrder {
  orderId?: string;
  shopId?: string;
  addressId?: string;
  ownerMemberId?: string;
  offlineMemberId?: string;
  paymentId?: string | null;
  receiptId?: string | null;
  createdByUserId?: string;
  orderNumber?: number;
  subTotal?: number;
  deliveryFee?: number;
  transactionFee?: number;
  OrderItems?: IOrderItems[];
  OrderTags?: IOrderTag[];
  paymentStatus?: "PENDING" | "FAIL" | "CANCEL" | "UNPAID" | "PAID";
  platform?: "E-COMMERCE" | "APP";
  deliveryOption?: "PICKUP" | "DOORSTEP" | "EMAIL";
  deviceId?: string;
  totalAmount?: number;
  paymentMethod?: "CASH" | "POS" | "TRANSFER" | "ONLINE" | null;
  otherDetails?: string;
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IOrderItems {
  orderItemId?: string;
  orderId?: string;
  inventoryId?: string;
  inventoryName?: string;
  inventoryType?: InventoryType;
  quantity?: number;
  amount?: number;
  shopId?: string;
  stepId?: string;
  Shop?: IShop;
  User?: UsersAttr;
  Order?: IOrder;
  Step?: IStep;
  inventoryCategoryId?: string;
  Inventory?: IInventory;
  amountPerItem?: number;
  quantityPerPack?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IStep {
  stepId?: string;
  shopId?: string;
  stepName?: string;
  arrangementOrder?: number;
  stepColor?: string;
  isDefaultStep?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface IOrderTag {
  orderTagId?: string;
  orderId?: string;
  shopId?: string;
  tagId?: string;
  Tag?: ITag;
  Order?: IOrder;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface ITag {
  tagId?: string;
  shopId?: string;
  tagName?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface OrderDetailsProps {
  orderId: string | null;
  activeTabIndex: number;
  updateCount: number;
  triggerRefetch: () => void;
  updateOrdersView: (value: IOrder, type: string) => void;
}

export interface UpdateOrderStatusProps {
  orderItemIds: string[];
  showUpdateOrderStep: boolean;
  closeModal: () => void;
  triggerRefetch: () => void;
}

export interface OrderItemTileProps {
  order: IOrder;
  selectedOrderItemId: string | null;
  // setSelectedOrderItem: (val: IOrderItems) => void;
  handleChangeSelectedItemId: (val: string) => void;
}

export interface OrderViewTitleBarProps {
  title: string;
  handleDateChange: (selectedDate: string) => void;
  handleSearch: (val: string) => void;
  setShowFilterModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTagsList: ITag[];
  selectedPaymentStatusIdx: number;
  handleRemoveFromTagsFilter: (clicked: ITag) => void;
  resetPaymentStatus: () => void;
}

export interface OrderListViewProps {
  activeTabIndex: number;
  loading: boolean;
  data?: IOrder[];
  fetchNextPage: any;
  selectedOrderItemId: string | null;
  setSelectedOrderItemId: (value: string | null) => void;
  handleDateChange: (value: string) => void;
  handleSearch: (value: string) => void;
  setShowFilterModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectedTagsList: ITag[];
  selectedPaymentStatusIdx: number;
  handleRemoveFromTagsFilter: (clicked: ITag) => void;
  resetPaymentStatus: () => void;
  mergeOrderSelectionList: { [key: string]: boolean };
  handleAddToMergeOrderList: (val: string, checked: boolean) => void;
  mergeOrder: any;
  cancelMergeOrderSelection: () => void;
}

export interface OrdersViewProps {
  selectedOrderId: string | null;
  itemList: IOrder[];
  setItemList: any;
  setSelectedOrderItemId: (val: string) => void;
  updateCount: number;
  syncUpdateCount: number;
  activeTabIndex: number;
  setActiveTabIndex: (val: number) => void;
}

export interface ProductsViewProps {
  activeTabIndex: number;
  handleSearch: (val: string) => void;
  productData: IInventory[][];
  productTotal: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  refetch: () => void;
  setPerPage: React.Dispatch<React.SetStateAction<number>>;
  perPage: number;
  setTotalPages: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  searchInventory: any;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}

export interface GetOrderItems {
  records: [IOrderItems];
  total: number;
}
