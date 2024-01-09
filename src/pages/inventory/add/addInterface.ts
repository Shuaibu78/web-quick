import { MouseEventHandler } from "react";
import { BulkOption, IVariationList, ProductVariation } from "./add";
import { IInventoryImage } from "../../../interfaces/inventory.interface";

export interface IProductInformation {
  type?: string;
  errorMessage?: any;
  productName: string | number;
  setProductName?: Function;
  selectedCategory: number;
  setSelectedCategory?: Function;
  categoryOption: string[];
  setShowCreateCategory?: Function;
  handleOnlinePresence?: Function;
  serviceName: string | number;
  setServiceName?: Function;
  serviceCharge: string | number;
  setServiceCharge?: Function;
  validateInputNum?: Function;
  barcode?: string;
  batchNo: string;
  brand: string;
  setBatchNo: Function;
  setBrand: Function;
  setBarcode: Function;
  description: string;
  setDescription: Function;
}

export interface IQuantities {
  type: string;
  trackQuantity: boolean;
  sellType: number;
  setSellType: Function;
  sellTypeOption: string[];
  newVariationName: string;
  setNewVariationName: Function;
  newVariationOption: string[];
  updateVariationOption: Function;
  addNewOptionField: any;
  productVariation: ProductVariation;
  saveNewVariation: MouseEventHandler<HTMLButtonElement>;
  variationList: IVariationList;
  variationTypeList: string[];
  deleteVariationOption: Function;
  deleteVariation: Function;
  editVariation: Function;
  setPiecesCostPrice: Function;
  piecesCostPrice: string;
  sellInPP: boolean;
  errorMessage: any;
  showProductVariation: boolean;
  changeVariationQuantity: Function;
  changeVariationPrice: Function;
  changeVariationCost: Function;
  perPack: string;
  setPerPack: Function;
  setFixedPackPrice: Function;
  fixedPackPrice: string;
  setPackCostPrice: Function;
  packCostPrice: string;
  setQuantityInPieces: Function;
  quantityInPieces: string;
  setFixedUnitPrice: Function;
  validateInputNum: Function;
  fixedUnitPrice: string;
  fixedSellingPrice: boolean;
  setFixedSellingPrice: Function;
  setSellingPrice: Function;
  sellingPrice: string;
  setCostPrice: Function;
  costPrice: string;
  setQuantityInPacks: Function;
  quantityInPacks: string;
  handleAddBulkPrice: MouseEventHandler<HTMLButtonElement>;
  handleBulkOptionDelete: Function;
  updateBulkOption: Function;
  bulkOptions: BulkOption[];
  bulkSales: boolean;
  removeVariationOption: Function;
  measurementUnit?: { label: string; value: string };
  setMeasurementUnit: Function;
}

export interface ImageSearchAttr {
  productImageSearch: [
    {
      _id: string;
      title: string;
      link: string;
      height: number;
      width: number;
      byteSize: number;
      thumbnailLink: string;
      thumbnailHeight: number;
      thumbnailWidth: number;
      productId: string;
    }
  ];
}

export interface IImageUpload {
  type: string;
  handleImageUpload: Function;
  images: (File | IInventoryImage)[] | [];
  handleImageDelete: Function;
  getImageUrl: Function;
  getServiceImageUrl: Function;
  serviceImages: File[] | [];
  handleServiceImageUpload: Function;
  productImageSearchData?: ImageSearchAttr;
  productName?: string;
}

export interface IAdditionalOptions {
  publish: boolean;
  handleOnlinePresence: MouseEventHandler<HTMLButtonElement>;
  type: string | number;
  lowAlertQuantity: string;
  errorMessage: any;
  setLowAlert: Function;
  lowAlert: boolean;
  setIsFocused: Function;
  setDescription: Function;
  description: string;
  isFocused: boolean;
  setWeightType: Function;
  weightType: string | null;
  spublish: boolean;
  fixedServiceCharge: boolean;
  setFixedServiceCharge: Function;
  setLowAlertQuantity: Function;
  setProductDiscount: Function;
  productDiscount: string;
  setReturnPolicy: Function;
  returnPolicy: string;
  sellTypeOption: string[];
  sellType: number;
}
