import { Dispatch, SetStateAction } from "react";
import { IBatch } from "../../interfaces/batch.interface";
import { IInventory } from "../../interfaces/inventory.interface";

export interface IDetailsProps {
  currentInventory?: IInventory;
  showProductModal: boolean;
  adjustModalPopup: boolean;
  handleDeleteInventory: Function;
  saveSelectedInventory: (inventory: IInventory) => void;
  setAdjustModalPopup: Dispatch<SetStateAction<boolean>>;
  handleMakeProductOnline: (inventoryId: string, status: boolean) => Promise<void>;
  setShowProductModal: Dispatch<SetStateAction<boolean>>;
  setCurrentInventory: Dispatch<SetStateAction<IInventory | undefined>>;
}

export interface ItemsPageProps extends IDetailsProps {
  handleRefetch: () => void;
  navbarHeight: number;
  refetchBatch: Function;
  refetchInv: Function;
  selectedProductIds: string[];
  setSelectedProductIds: Function;
}

export interface IBatchProps {
  total: number;
  bInvPage: number;
  batchPage: number;
  batches: IBatch[];
  showBatch: boolean;
  bInvPerPage: number;
  navbarHeight: number;
  batchPerPage: number;
  setBatches: Function;
  refetchAll: () => void;
  showDetails: boolean;
  batchDetail?: IBatch;
  totalBatchInv: number;
  setBInvPage: Function;
  products: IInventory[];
  setBatchPage: Function;
  setShowBatch: Function;
  selectedBatchNo: string;
  selectedBatchId: string;
  setBInvPerPage: Function;
  setShowDetails: Function;
  setBatchPerPage: Function;
  setBatchProducts: Function;
  handleDeleteBatch: Function;
  setSelectedBatchId: Function;
  setSelectedBatchNo: Function;
  batchInventoryCount: number[];
  handleRemoveBInventory: Function;
  adjustModalPopup: boolean;
  setAdjustModalPopup: Dispatch<SetStateAction<boolean>>;
  setBatchSearch: React.Dispatch<React.SetStateAction<string>>;
  setBatchInvSearch: React.Dispatch<React.SetStateAction<string>>;
  setShowProductModal: Dispatch<SetStateAction<boolean>>;
  setCurrentInventory: Dispatch<SetStateAction<IInventory | undefined>>;
}

export interface IBatchListProps {
  total: number;
  batchPage: number;
  batches: IBatch[];
  setIsEdit: Function;
  navbarHeight: number;
  batchPerPage: number;
  setBatches: Function;
  refetchAll: Function;
  setShowBatch: Function;
  setBatchPage: Function;
  setShowImport: Function;
  setBatchPerPage: Function;
  handleDeleteBatch: Function;
  setSelectedBatch: Function;
  setSelectedBatchId: Function;
  setSelectedBatchNo: Function;
  batchInventoryCount: number[];
}

export interface ISingleBatchProps {
  bInvPage: number;
  bInvPerPage: number;
  batchNumber?: string;
  navbarHeight: number;
  refetchAll: Function;
  setBInvPage: Function;
  totalBatchInv: number;
  products: IInventory[];
  setBInvPerPage: Function;
  adjustModalPopup: boolean;
  setBatchProducts: Function;
  handleRemoveInventory: Function;
  setShowProductModal: Dispatch<SetStateAction<boolean>>;
  setAdjustModalPopup: Dispatch<SetStateAction<boolean>>;
  setCurrentInventory: Dispatch<SetStateAction<IInventory | undefined>>;
}
