import { ReactNode } from "react";
import { IInventory } from "./inventory.interface";

export interface TabStruct {
  [key: string]: {
    name: string;
    items: Cart[];
    id: number;
  };
}

export interface TopNavProps {
  header?: string;
  option?: string;
  overViewNavContent?: Function;
  setView?: Function;
  view?: string;
  setReceiptButtonState?: React.Dispatch<React.SetStateAction<boolean>>;
  setListButtonState?: React.Dispatch<React.SetStateAction<boolean>>;
  receiptButtonState?: boolean;
  listButtonState?: boolean;
  setShowCatModal?: Function;
  shouldManageExpense?: boolean;
  navContent?: Function;
  handleDropDown?: any;
  handleFilterByDate?: any;
  setShowFilterModal?: any;
  selectedDate?: any;
  dateOptions?: string[];
  dateRange?: any;
  getStartDate?: any;
  getEndDate?: any;
  shouldViewSales?: any;
  totalAmounts?: any;
  reduxTabs?: TabStruct;
  refetch?: any;
  setCurrentTab?: any;
  setTNewTab?: any;
  setCurrentEdit?: any;
  setShowEditTab?: any;
  handleRemoveTab?: any;
  handleAddTab?: any;
  currentTab?: any;
  tNewTab?: any;
  setShowAddCustomer?: Function;
  setIsEditCustomer?: any;
  setCustomer?: any;
  topNavList?: string[];
  navList?: string;
  setNavBarHeight?: Function;
  staffNavContent?: Function;
  activeTab?: string;
  setActiveTab?: Function;
  setSellType?: Function;
  type?: string;
  customerNavContent?: Function;
  supplyNavContent?: Function;
  inventoryCards?: Function;
  showBatch?: boolean;
  setShowBatch?: Function;
  setSelectedBatchId?: Function;
  setShowBankDetails?: Function;
  adjustCards?: ReactNode;
  setShowAddInvoice?: Function;
}

export type Cart = IInventory & {
  stock: number;
  price: number;
  image: string;
  count: number;
  discount: number;
  sellInPieces?: boolean;
  isDiscount?: boolean;
  showDropdown: boolean;
  sellInVariant?: string;
  variationId?: string;
  variationName?: string;
  index?: number;
};
