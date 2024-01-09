/* eslint-disable no-debugger */
/* eslint-disable indent */
/* eslint-disable comma-dangle */
/* eslint-disable max-len */
import _ from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchInput from "../../../components/search-input/search-input";
import TopNav from "../../../components/top-nav/top-nav";
import BackArrow from "../../../assets/back-arrow.svg";
import Remove from "../../../assets/dash-remove.svg";
import {
  Container,
  Left,
  Right,
  ScanButton,
  CategoryNav,
  TextBold,
  ItemCard,
  Counter,
  TransparentBtn,
  ItemsContainer,
  RadioLabel,
  RowDropButton,
  NameWrapper,
} from "./styles";
import cancelIcon from "../../../assets/cancel.svg";
import BuyDark from "../../../assets/BuyDark.svg";
import cartFillIcon from "../../../assets/CartFill.svg";
import deleteIcon from "../../../assets/Delete.svg";
import minusIcon from "../../../assets/minus.svg";
import whitePlusIcon from "../../../assets/plus.svg";
import arrowDownGrey from "../../../assets/ArrowDownGrey.svg";
import arrowDownWhite from "../../../assets/ArrowDownWhite.svg";
import ReceiptIcon from "../../../assets/ReceiptIconBlack.svg";
import Checkbox from "../../../components/checkbox/checkbox";
import { Button } from "../../../components/button/Button";
import { ModalBox, ModalContainer } from "../../settings/style";
import { IInventory, IVariations } from "../../../interfaces/inventory.interface";
import {
  GET_ALL_SHOP_INVENTORY,
  GET_FILTERED_INVENTORY_OPTIONS,
  GET_INVENTORY,
  SEARCH_INVENTORY,
} from "../../../schema/inventory.schema";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getInventoryPrice } from "../../../utils/helper.utils";
import { InputField } from "../../../components/input-field/input";
import { getInventoryQuantity, getInventoryType } from "../../../helper/inventory.helper";
import { IShop } from "../../../interfaces/shop.interface";
import { GET_SHOP } from "../../../schema/shops.schema";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { formatAmountIntl } from "../../../helper/format";
import { setReduxTabs } from "../../../app/slices/sales";
import { CountryAttr } from "../../settings/sub-page/business";
import { CREATE_OFFLINE_ORDER, GET_SHOP_OFFLINE_ORDER_STATUS } from "../../../schema/orders.schema";
import PopupCard from "../../../components/popUp/PopupCard";
import CustomConfirm from "../../../components/confirmComponent/cofirmComponent";
import { useNavigate } from "react-router-dom";
import { getDefaultPrinter, printInvoice } from "../../../helper/printing";
import { IOrder } from "../../../interfaces/order.interface";
import { getCurrentUser } from "../../../app/slices/userInfo";
import { ISales, ISalesReceipt } from "../../../interfaces/sales.interface";
import { getBarcode } from "../../inventory/add/addUtils";
import { Body } from "../../expenses/style";
import { CheckBox, CheckButton, Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import { isFigorr } from "../../../utils/constants";
import { getImageUrl } from "../../../helper/image.helper";
import { ITax } from "../../../interfaces/tax.interface";
import { GET_ALL_TAXES } from "../../../schema/tax.schema";
import ProductsList from "./products";
import BatchList from "./batchList";
import {
  GET_ALL_SHOP_BATCHES,
  GET_BATCH_INVENTORIES,
  SEARCH_BATCH_INVENTORIES,
} from "../../../schema/batch.schema";
import { IBatch, IBatchProducts, IShopBatches } from "../../../interfaces/batch.interface";
import Checkout from "../checkout-page/checkout";
import Loader from "../../../components/loader";

export type Cart = IInventory & {
  stock: number;
  price: number;
  image: string;
  count: string | number;
  discount: number;
  sellInPieces?: boolean;
  isDiscount?: boolean;
  showDropdown: boolean;
  sellInVariant?: string;
  variationId?: string;
  variationName?: string;
  index?: number;
};

interface TabStruct {
  [key: string]: {
    name: string;
    items: Cart[];
    id: number;
  };
}

export interface IsearList {
  [key: string]: { search: string };
}

const NewSales = () => {
  const initialSearchState = {
    tab1: { search: "" },
  };

  const salesTypeArray = ["Sell from Product List", "Sell by Batch"];

  const [currentTab, setCurrentTab] = useState<string>("");
  const currentUser = useAppSelector(getCurrentUser);
  const {
    sales: { tabs: reduxTabs },
    shops: { currentShop },
  } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [showCheckout, setShowCheckout] = useState(false);
  const [searchTextList, setSearchTextList] = useState<IsearList>(initialSearchState);
  const [inventoryDataList, setInventoryDataList] = useState<IInventory[]>([]);
  const [batchInvDataList, setBatchInvDataList] = useState<IInventory[]>([]);
  const [currentEdit, setCurrentEdit] = useState<string>("");
  const [showEditTab, setShowEditTab] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [tNewTab, setTNewTab] = useState(false);
  const [modalItem, setModalItem] = useState<Cart>();
  const [showAddModal, setShowAddModal] = useState(false);
  const [isDiscount, setIsDiscount] = useState<boolean>(false);
  const [productIndex, setProductIndex] = useState<number>(1);
  const [isOfflineOrderActive, setIsOfflineOrderActive] = useState(false);
  const [currentVariantId, setCurrentVariantId] = useState<string | undefined>("");
  const [navbarHeight, setNavBarHeught] = useState<number>();
  const [appliedTaxes, setAppliedTaxes] = useState<ITax[]>([]);
  const [selectedBatchNo, setSelectedBatchNo] = useState("");
  const [batches, setBatches] = useState<IBatch[]>([]);
  const [batchCount, setBatchCount] = useState(1);
  const [salesType, setSalesType] = useState("Sell from Product List");

  const navigate = useNavigate();
  const isProductList = salesType === "Sell from Product List";

  const shopData = useQuery<{
    getShop: {
      countries: CountryAttr[];
      result: IShop;
    };
  }>(GET_SHOP, {
    variables: {
      shopId: currentShop?.shopId,
    },
    skip: !currentShop?.shopId,
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const { refetch: refetchOfflineOrderStatus } = useQuery<{
    getShopOfflineOrderStatus: boolean;
  }>(GET_SHOP_OFFLINE_ORDER_STATUS, {
    variables: {
      shopId: currentShop?.shopId,
    },
    skip: !currentShop?.shopId,
    onCompleted(result) {
      setIsOfflineOrderActive(result?.getShopOfflineOrderStatus);
    },
    onError(error) {
      if (currentShop?.shopId) {
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      }
    },
  });

  const { data, refetch, loading } = useQuery<{
    getAllShopInventory: [IInventory];
  }>(GET_ALL_SHOP_INVENTORY, {
    variables: {
      removeBatchProducts: true,
      shopId: currentShop?.shopId,
      limit: 10,
      page: page < 1 ? 1 : page,
    },
    skip: !currentShop?.shopId,
    fetchPolicy: "cache-and-network",

    onError(error) {
      if (currentShop?.shopId) {
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      }
    },
  });

  const [getInventories, { data: searchData }] = useLazyQuery<{
    getAllShopInventory: [IInventory];
  }>(GET_ALL_SHOP_INVENTORY, {
    variables: {
      removeBatchProducts: true,
      shopId: currentShop?.shopId as string,
      limit: 10,
      page: page < 1 ? 1 : page,
      searchString: selectedBatchNo ? "" : searchTextList[currentTab]?.search,
    },
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  if (loading) {
    <Loader />;
  }

  const { data: filteredData, refetch: refetchFilteredData } = useQuery<{
    getFilteredInventory: {
      totalInventory: number;
      pagination: number;
      totalProductQuantity: number;
      totalInventoryValue: number;
      totalOnlineProducts: number;
      totalOfflineProducts: number;
      totalOutOfStockProducts: number;
    };
  }>(GET_FILTERED_INVENTORY_OPTIONS, {
    variables: {
      removeBatchProducts: true,
      shopId: currentShop?.shopId,
      limit: 10,
      searchString: selectedBatchNo ? "" : searchTextList[currentTab]?.search,
    },
    skip: !currentShop?.shopId,
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  useEffect(() => {
    if (isProductList) {
      if (searchData) {
        setInventoryDataList(searchData?.getAllShopInventory || []);
      } else if (data) {
        setInventoryDataList(data?.getAllShopInventory || []);
      }

      const totalInventory = filteredData?.getFilteredInventory.totalInventory || 1;
      setTotalPages(Math.ceil(totalInventory / 10));
    }
  }, [data, searchData, tNewTab, isProductList, page, filteredData]);

  useEffect(() => {
    refetchFilteredData();
  }, [data, searchData, page, isProductList]);

  const { data: batchesData, refetch: refetchBatch } = useQuery<{
    getAllShopBatches: IShopBatches;
  }>(GET_ALL_SHOP_BATCHES, {
    fetchPolicy: "cache-and-network",
    variables: {
      page,
      limit: 10,
      shopId: currentShop?.shopId,
    },

    onError(error) {
      dispatch(
        toggleSnackbarOpen({
          message: error?.message || error?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    },
  });

  const { refetch: rBatchInv } = useQuery<{ getBatchInventories: IBatchProducts }>(
    GET_BATCH_INVENTORIES,
    {
      skip: !selectedBatchNo,
      variables: {
        page,
        limit: 10,
        batchNo: selectedBatchNo,
        shopId: currentShop?.shopId,
      },

      onCompleted({ getBatchInventories }) {
        setBatchInvDataList(getBatchInventories.batchInventories);
        setTotalPages(Math.ceil((getBatchInventories.totalCount ?? 1) / 10));
      },

      fetchPolicy: "cache-and-network",
      onError: (error) => {
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      },
    }
  );

  const { data: BatchInvSearchData } = useQuery<{
    searchBatchInventories: { batches: IBatch[]; count: number };
  }>(SEARCH_BATCH_INVENTORIES, {
    skip: !!(isProductList || selectedBatchNo),
    variables: {
      page,
      search: searchTextList[currentTab]?.search ?? "",
      shopId: currentShop?.shopId,
    },

    fetchPolicy: "cache-and-network",
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  useEffect(() => {
    if (!isProductList) {
      if (searchTextList[currentTab]?.search && BatchInvSearchData) {
        setBatches(BatchInvSearchData.searchBatchInventories.batches);
        setTotalPages(Math.ceil((BatchInvSearchData.searchBatchInventories.count ?? 1) / 10));
      } else if (batchesData) {
        setBatches(batchesData?.getAllShopBatches.batches);
        setBatchCount(batchesData?.getAllShopBatches.totalBatches);

        if (!isProductList && !selectedBatchNo) {
          setTotalPages(Math.ceil((batchesData?.getAllShopBatches.totalBatches ?? 1) / 10));
        }
      }
    }
  }, [isProductList, batchesData, selectedBatchNo, BatchInvSearchData]);

  useMemo(() => {
    refetchOfflineOrderStatus();
  }, [currentShop]);

  const getVariationQuantity = (variationId: string = "", datum: IInventory = {}) => {
    const inventoryQty = datum?.InventoryQuantity?.filter(
      (qty) => qty?.variationId === variationId
    ).reduce((prevValue, inventoryQuantity) => prevValue + inventoryQuantity.quantity!, 0);
    return inventoryQty ?? 0;
  };

  const handleVariationModal = (variant: IVariations) => {
    setModalItem((oldItem) => {
      let itemCopy: Cart = JSON.parse(JSON.stringify(oldItem));
      itemCopy = {
        ...itemCopy,
        count: 1,
        stock: getVariationQuantity(variant?.variationId!, modalItem),
        sellInVariant: variant?.variationId,
        price: Number(variant?.price),
        variationName: variant?.variationName,
      };
      return itemCopy;
    });
  };

  const handleAddToCart = (datum: IInventory, activeTab = currentTab) => {
    if (datum?.inventoryType !== "NON_TRACKABLE") {
      if (
        ((datum?.quantity as number) ||
          (datum?.quantityInPacks as number) ||
          (datum?.quantityInPieces as number)) <= 0
      ) {
        dispatch(toggleSnackbarOpen("Stock exhausted"));
        return;
      }
    }

    const tabObject = reduxTabs;
    const itemExist =
      !datum?.isVariation &&
      tabObject[activeTab]?.items.find((item) => item.inventoryId === datum.inventoryId);

    if (
      tabObject[activeTab]?.items.filter((item) => item.inventoryId === datum.inventoryId)[0]
        ?.count >= (datum?.quantity! || datum?.quantityInPacks!) &&
      datum?.inventoryType !== "PIECES_AND_PACK" &&
      datum?.inventoryType !== "NON_TRACKABLE"
    ) {
      dispatch(toggleSnackbarOpen("Stock exhausted"));
      return;
    } else if (
      datum?.inventoryType === "PIECES_AND_PACK" &&
      getInventoryQuantity(datum) === "Out of Stock"
    ) {
      dispatch(toggleSnackbarOpen("Stock exhausted"));
      return;
    }

    if (itemExist) {
      if (datum?.inventoryType === "NON_TRACKABLE") {
        const i = tabObject[activeTab].items.findIndex(
          (item) => item.inventoryId === datum.inventoryId
        );
        const newObject = _.cloneDeep(tabObject) as TabStruct;
        newObject[activeTab].items[i].count = (newObject[activeTab].items[i].count as number) + 1;

        dispatch(setReduxTabs(newObject));
      } else if (datum.inventoryType === "PIECES_AND_PACK") {
        setModalItem({
          ...datum,
          price: getInventoryPrice(datum),
          stock: datum.quantity ?? 0,
          image: getImageUrl(datum?.Images),
          count: 1,
          discount: 0,
          isDiscount: false,
          sellInPieces: datum.inventoryType === "PIECES_AND_PACK",
          showDropdown: false,
          index: productIndex,
        });
        setShowAddModal(true);
        return;
      }

      const i = tabObject[activeTab].items.findIndex(
        (item) => item.inventoryId === datum.inventoryId
      );

      const newObject = _.cloneDeep(tabObject) as TabStruct;
      newObject[activeTab].items[i].count = (newObject[activeTab].items[i].count as number) + 1;

      dispatch(setReduxTabs(newObject));
    } else {
      if (productIndex > 0) {
        setProductIndex(productIndex + 1);
      } else {
        setProductIndex(1);
      }

      if (!datum?.isVariation) {
        if (datum?.inventoryType === "NON_TRACKABLE") {
          const newObject = _.cloneDeep(tabObject) as TabStruct;

          newObject[activeTab].items = [
            {
              ...datum,
              price: getInventoryPrice(datum, undefined, !datum.quantityInPieces),
              stock: 1,
              image: getImageUrl(datum?.Images),
              count: 1,
              discount: 0,
              isDiscount: false,
              sellInPieces: true,
              showDropdown: false,
              index: productIndex,
            },
            ...newObject[activeTab].items,
          ];

          dispatch(setReduxTabs(newObject));
        } else if (datum?.inventoryType === "PIECES_AND_PACK") {
          setModalItem({
            ...datum,
            price: getInventoryPrice(datum),
            stock: datum.quantity ?? 0,
            image: getImageUrl(datum?.Images),
            count: 1,
            discount: 0,
            isDiscount: false,
            sellInPieces: datum.inventoryType === "PIECES_AND_PACK",
            showDropdown: false,
            index: productIndex,
          });
          setShowAddModal(true);
        } else if (datum.inventoryType === "PIECES" || datum.inventoryType === "PACK") {
          if (tabObject[activeTab] && tabObject[activeTab].items) {
            const newObject = _.cloneDeep(tabObject) as TabStruct;
            newObject[activeTab].items = [
              {
                ...datum,
                price: getInventoryPrice(datum, undefined, !datum.quantityInPieces),
                stock: datum.quantity ?? 0,
                image: getImageUrl(datum?.Images),
                count: 1,
                discount: 0,
                isDiscount: false,
                sellInPieces: datum.inventoryType !== "PACK",
                showDropdown: false,
                index: productIndex,
                inventoryName:
                  datum.inventoryType !== "PACK"
                    ? datum?.inventoryName
                    : `${datum?.inventoryName} (pack)`,
              },
              ...newObject[activeTab].items,
            ];

            dispatch(setReduxTabs(newObject));
          }
        }
      } else {
        if (datum?.Variations) {
          const variationQty = getVariationQuantity(datum?.Variations[0]?.variationId!, datum);
          setModalItem({
            ...datum,
            price: getInventoryPrice(datum),
            stock: datum?.Variations ? variationQty : 0,
            image: getImageUrl(datum?.Images),
            count: 1,
            discount: 0,
            isDiscount: false,
            sellInPieces: true,
            sellInVariant: datum?.Variations[0].variationId,
            variationName: datum?.Variations[0].variationName,
            showDropdown: false,
            index: productIndex,
          });
        }
        setShowAddModal(true);
      }
    }
  };

  const addToCartFromModal = (variationName = "", tabObject = reduxTabs) => {
    const itemExist = modalItem?.sellInVariant
      ? tabObject[currentTab].items.filter(
        (item) => item.sellInVariant === modalItem?.sellInVariant
      )
      : tabObject[currentTab].items.filter((item) => item.inventoryId === modalItem?.inventoryId);

    if (itemExist.length) {
      if (modalItem?.sellInVariant) {
        const i = tabObject[currentTab].items.findIndex(
          (item) => item.sellInVariant === modalItem?.sellInVariant
        );
        const newObject = _.cloneDeep(tabObject) as TabStruct;
        const totalCount =
          (newObject[currentTab].items[i].count as number) + (modalItem?.count as number)!;
        newObject[currentTab].items[i].count =
          totalCount > modalItem?.stock! ? modalItem?.count! : totalCount;
        dispatch(setReduxTabs(newObject));
      } else {
        if (modalItem) {
          const i = tabObject[currentTab].items.findIndex(
            (item) =>
              item.sellInPieces === modalItem?.sellInPieces &&
              item.inventoryId === modalItem?.inventoryId
          );
          const newObject = _.cloneDeep(tabObject) as TabStruct;
          if (i > -1) {
            const totalCount =
              (newObject[currentTab].items[i].count as number) + (modalItem?.count as number)!;
            newObject[currentTab].items[i].count =
              totalCount > modalItem?.stock! ? modalItem?.count! : totalCount;
          } else {
            newObject[currentTab].items = [modalItem, ...newObject[currentTab].items];
          }
          dispatch(setReduxTabs(newObject));
        }
      }
    } else {
      if (modalItem) {
        const newList: TabStruct = _.cloneDeep(tabObject);
        const inventoryName = variationName
          ? `${modalItem?.inventoryName} (${variationName})`
          : modalItem?.inventoryName;
        newList[currentTab].items = [
          {
            ...modalItem,
            inventoryName,
          },
          ...tabObject[currentTab].items,
        ];
        dispatch(setReduxTabs(newList));
      }
    }
    setShowAddModal(false);
  };

  const handleSellInPiecesModal = () => {
    setModalItem((oldItem) => {
      let itemCopy: Cart = JSON.parse(JSON.stringify(oldItem));
      itemCopy = {
        ...itemCopy,
        sellInPieces: !itemCopy.sellInPieces,
        count: 1,
        price: getInventoryPrice(itemCopy, undefined, itemCopy.sellInPieces),
      };
      return itemCopy;
    });
  };

  const qtyInStock = (val: IInventory) => {
    const inventoryType = getInventoryType(val);
    if (inventoryType === "VARIATION") return `${val?.quantity} Items`;
    if (!val.trackable) return "";

    if (val?.TrackableItem) {
      if (inventoryType === "PACK") {
        return `${val?.quantityInPacks} Pack`;
      }
      if (inventoryType === "PIECES_AND_PACK") {
        return `${val?.quantityInPieces} Items | ${val?.quantityInPacks} Pack`;
      }
    }
    return `${val?.quantityInPieces} Items`;
  };

  const handleShowDropdown = (i: number) => {
    const newObject = _.cloneDeep(reduxTabs) as TabStruct;
    newObject[currentTab].items[i].showDropdown = !newObject[currentTab].items[i].showDropdown;
    dispatch(setReduxTabs(newObject));
  };

  const removeItem = (i: number, e: any) => {
    e.stopPropagation();
    const newObject = _.cloneDeep(reduxTabs) as TabStruct;
    newObject[currentTab].items.splice(i, 1);
    dispatch(setReduxTabs(newObject));
  };

  const handleCount = (i: number, val: string, stock: number) => {
    if (typeof stock === "number" && !Number.isInteger(stock)) {
      const newCount = val.trim();

      if (stock - parseFloat(newCount) < 0) {
        dispatch(toggleSnackbarOpen("You cannot add more than the current stock quantity"));
        return;
      }

      const newObject = _.cloneDeep(reduxTabs) as TabStruct;
      newObject[currentTab].items[i].count = newCount;
      dispatch(setReduxTabs(newObject));
    } else {
      const newCount = parseFloat(val.trim());

      if (isNaN(newCount) || !Number.isFinite(newCount)) {
        dispatch(toggleSnackbarOpen("Invalid input. Please enter a valid number."));
        return;
      }

      if (newCount < 0) {
        dispatch(toggleSnackbarOpen("Count cannot be negative."));
        return;
      }

      if (stock - newCount < 0) {
        dispatch(toggleSnackbarOpen("You cannot add more than the current stock quantity."));
        return;
      }

      const newObject = _.cloneDeep(reduxTabs) as TabStruct;
      newObject[currentTab].items[i].count = newCount;
      dispatch(setReduxTabs(newObject));
    }
  };

  const incCount = (i: number, stock: number, by: number) => {
    if (stock - reduxTabs[currentTab].items[i].count <= 0 && stock > by) {
      dispatch(toggleSnackbarOpen("You cannot add more than current stock quantity"));
      return;
    }
    const newObject = _.cloneDeep(reduxTabs) as TabStruct;
    newObject[currentTab].items[i].count = (newObject[currentTab].items[i].count as number) + by;
    dispatch(setReduxTabs(newObject));
  };

  const decCount = (i: number, by: number) => {
    if (reduxTabs[currentTab].items[i].count > by) {
      const newObject = _.cloneDeep(reduxTabs) as TabStruct;
      newObject[currentTab].items[i].count = (newObject[currentTab].items[i].count as number) - by;
      dispatch(setReduxTabs(newObject));
    }
  };

  const incCountM = (stock: number) => {
    if (modalItem) {
      if (stock - (modalItem.count as number) <= 0 && stock > 1) return;
      setModalItem((oldItem) => {
        let itemCopy: Cart = JSON.parse(JSON.stringify(oldItem));
        itemCopy = { ...itemCopy, count: (itemCopy.count as number) + 1 };
        return itemCopy;
      });
    }
  };

  const decCountM = () => {
    if (modalItem) {
      setModalItem((oldItem) => {
        let itemCopy: Cart = JSON.parse(JSON.stringify(oldItem));
        if ((itemCopy.count as number) > 1) {
          itemCopy = { ...itemCopy, count: (itemCopy.count as number) - 1 };
        }
        return itemCopy;
      });
    }
  };

  const handleCountM = (val: string, stock: number) => {
    const newCount = !val ? 0 : Number(val) ? Number(val) : 0;
    if (stock - newCount < 0) return;
    if (newCount === 0 || newCount) {
      setModalItem((oldItem) => {
        let itemCopy: Cart = JSON.parse(JSON.stringify(oldItem));
        itemCopy = { ...itemCopy, count: newCount };
        return itemCopy;
      });
    }
  };

  const handleProductDiscount = (price: number, discount: number, i: number, quantity: number) => {
    const {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      data,
    } = shopData;
    if (data) {
      const { maximumDiscount, currencyCode } = data?.getShop?.result;
      if (discount / Number(price * quantity) > Number(maximumDiscount) / 100) {
        dispatch(
          toggleSnackbarOpen(
            `The discount is greater than the maximum discount ${currencyCode} ${((maximumDiscount ?? 0) / 100) * price * quantity
            }`
          )
        );
      } else {
        const newObject = _.cloneDeep(reduxTabs) as TabStruct;
        newObject[currentTab].items[i].discount = discount;
        dispatch(setReduxTabs(newObject));
      }
    }
  };

  const handleDiscountToggle = (idx: number) => {
    const {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      data,
    } = shopData;
    if (data) {
      const { discountEnabled } = data?.getShop?.result;
      if (!discountEnabled) {
        dispatch(toggleSnackbarOpen("Please enable discount from business settings!"));
      } else {
        const newObject = _.cloneDeep(reduxTabs) as TabStruct;
        newObject[currentTab].items[idx].isDiscount = !newObject[currentTab].items[idx].isDiscount;
        dispatch(setReduxTabs(newObject));
      }
    }
  };

  const getTotalCartPrice = (): number => {
    return reduxTabs[currentTab]?.items.reduce((prev, curr) => {
      return prev + curr.count * curr.price - (curr.isDiscount ? curr.discount : 0);
    }, 0);
  };

  const handleClearCart = (tabId: string = "") => {
    const newObject = _.cloneDeep(reduxTabs) as TabStruct;
    if (tabId) {
      newObject[tabId].items = [];
      dispatch(setReduxTabs(newObject));
    }
  };

  const handleAddTab = (tablist: TabStruct) => {
    const newTabObject = _.cloneDeep(tablist) as TabStruct;
    const lastTab = Math.max(...Object.values(newTabObject).map((val) => val.id));
    const newTabId = lastTab + 1;

    newTabObject[`tab${newTabId}`] = {
      name: "Sales Tab",
      items: [],
      id: newTabId,
    };

    setCurrentTab(`tab${newTabId}`);
    dispatch(setReduxTabs(newTabObject));
    setTNewTab(!tNewTab);
    refetch();
    refetchFilteredData();
  };

  const handleRemoveTab = (tabId: string, tabObj: TabStruct) => {
    const newObject = _.cloneDeep(tabObj) as TabStruct;

    if (Object.keys(newObject).length === 1) {
      handleClearCart(tabId);
      return;
    }

    if (Object.keys(newObject).length > 1) {
      const newTabObject = _.omit(newObject, tabId);

      setCurrentTab(Object.keys(newTabObject)[Object.keys(newTabObject).length - 1]);
      dispatch(setReduxTabs(newTabObject));
    }
  };

  const handleUpdateTabName = (val: string) => {
    const newTabObject = _.cloneDeep(reduxTabs) as TabStruct;
    newTabObject[currentEdit].name = val;
    dispatch(setReduxTabs(newTabObject));
  };

  const handleSearch = (search: string) => {
    setSearchTextList((prev) => {
      const copyOfPrev = JSON.parse(JSON.stringify(prev));
      copyOfPrev[currentTab] = { search: search };
      return copyOfPrev;
    });
    isProductList && getInventories();
  };

  const [getInventoryByBarcode] = useLazyQuery<{
    searchUserInventory: [IInventory];
  }>(SEARCH_INVENTORY);

  const searchItemByBarcode = useCallback(
    (keys: string) => {
      getInventories({
        variables: {
          removeBatchProducts: true,
          shopId: currentShop?.shopId as string,
          limit: 10,
          barcode: keys,
        },
      }).then((res) => {
        if (res.data?.getAllShopInventory[0]?.inventoryId) {
          handleAddToCart(res.data?.getAllShopInventory[0] as IInventory);
        } else {
          dispatch(toggleSnackbarOpen(`No product was found with this barcode: ${keys}`));
        }
      });
    },
    [currentTab, reduxTabs]
  );

  useEffect(() => {
    const barcodeListener = getBarcode(searchItemByBarcode);
    document.body.addEventListener("keydown", barcodeListener, true);
    return () => document.body.removeEventListener("keydown", barcodeListener, true);
  }, [searchItemByBarcode]);

  useEffect(() => {
    if (!currentTab) {
      const tabsList = Object.keys(reduxTabs);
      setCurrentTab(tabsList[tabsList.length - 1] ?? "tab1");
    }
  }, [currentShop]);

  const handleNextPage = () => {
    const invCount = filteredData?.getFilteredInventory.totalInventory;
    const isBatchList = salesType === "Sell by Batch" && !selectedBatchNo;

    if (page < Math.ceil((isBatchList ? batchCount : invCount || 1) / 10)) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const getCartCopy = (cart: Cart[]) => {
    if (cart) {
      return [...cart];
    }
    return [];
  };

  const handleNavigateToOrderPage = async () => {
    if (!(await CustomConfirm("Do you want to go to the order page?", { accept: "Proceed" }))) {
      return;
    }

    navigate("/dashboard/online-presence");
  };

  const [createOrder] = useMutation(CREATE_OFFLINE_ORDER, {
    onCompleted() {
      dispatch(toggleSnackbarOpen("Order created successfully"));
      handleClearCart(currentTab);
      handleRemoveTab(currentTab, reduxTabs);
      refetch();
      refetchFilteredData();
      handleNavigateToOrderPage();
    },
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const generateSalesItem = () => {
    const salesItems: any[] = [];
    reduxTabs[currentTab].items?.forEach((item) => {
      salesItems.push({
        inventoryId: item.inventoryId,
        inventoryName: item.inventoryName,
        inventoryType: item.sellInPieces ? "PIECES" : "PACK",
        quantity: Number(item.count),
        discount: item.discount,
        variationId: item.sellInVariant,
        amountLeft: (item.price - item.discount) * item.count,
        amount: item.price,
        pack: !item?.sellInPieces,
      });
    });

    const result: ISalesReceipt = {
      shopId: currentShop?.shopId as string,
      totalAmount: getTotalCartPrice(),
      Sales: salesItems as ISales[],
    };
    return result;
  };

  const handlePrintOrder = async () => {
    const cartItems = generateSalesItem();
    try {
      if ((await getDefaultPrinter()) === null) {
        dispatch(
          toggleSnackbarOpen("Please set a default printer from settings page before making sales.")
        );
        return;
      }
      await printInvoice({} as IOrder, currentUser, currentShop, cartItems);

      dispatch(
        toggleSnackbarOpen({
          message: "Pending checkout printed succesfully",
          color: "SUCCESS",
        })
      );
    } catch (err) {
      dispatch(
        toggleSnackbarOpen({
          message: "Failed to print",
          color: "DANGER",
        })
      );
    }
  };

  const handleCreateOrder = () => {
    const items = reduxTabs[currentTab]?.items;

    const orderItems = items.map((item) => {
      const { sellInVariant: variationId, inventoryId, price, sellInPieces, count } = item;
      let inventoryType = item?.inventoryType;

      if (inventoryType === "PIECES_AND_PACK") {
        inventoryType = sellInPieces ? "PIECES" : "PACK";
      }

      return {
        inventoryId,
        variationId,
        amount: price,
        inventoryType,
        quantity: count,
      };
    });

    createOrder({
      variables: {
        orderItems,
        shopId: currentShop?.shopId,
      },
    });
  };

  const [getSingleInventory] = useLazyQuery<{
    getInventory: IInventory;
  }>(GET_INVENTORY);

  const checkInventory = async () => {
    const filteredItems = reduxTabs[currentTab]?.items?.filter(
      (value) => value?.inventoryType !== "VARIATION" && value?.inventoryType !== "NON_TRACKABLE"
    );

    if (filteredItems.length === 0) {
      return true;
    }

    const inventoryPromises = filteredItems.map((item) =>
      getSingleInventory({
        variables: {
          inventoryId: item.inventoryId,
          shopId: item.shopId,
        },
      })
    );

    const inventoryList = await Promise.all(inventoryPromises);

    const canCheckOut = filteredItems?.every((item, index) => {
      const inventory = inventoryList[index]?.data?.getInventory;
      const quantity: number = !item?.sellInPieces
        ? Number(inventory?.quantityInPacks)
        : item?.inventoryType !== "PIECES_AND_PACK"
          ? Number(inventory?.quantityInPieces)
          : Number(inventory?.quantity) +
          Number(inventory?.quantityInPacks) * Number(item?.TrackableItem?.perPack);
      return inventory && item.count <= quantity;
    });

    return canCheckOut;
  };

  // Call checkInventory() inside an async function
  const handleCheckout = async (isOfflineOrder: boolean = false) => {
    const canCheckOut = await checkInventory();

    if (canCheckOut) {
      // Proceed with checkout
      if (!isFigorr && isOfflineOrderActive && isOfflineOrder) {
        // Create Order
        return handleCreateOrder();
      }
      // Proceed with checkout
      getCartCopy(reduxTabs[currentTab]?.items).forEach((item) => {
        setShowCheckout(true);
      });
    } else {
      // Display out of stock message
      dispatch(toggleSnackbarOpen("Some product quantity exceeds available quantity"));
    }
  };

  const { data: TaxData } = useQuery<{ getAllTaxes: [ITax] }>(GET_ALL_TAXES, {
    fetchPolicy: "network-only",
    variables: {
      shopId: currentShop.shopId,
    },
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  useEffect(() => {
    if (TaxData?.getAllTaxes) {
      const taxes = TaxData.getAllTaxes.filter((tax) => tax.includeOnEverySales);
      setAppliedTaxes(taxes);
    }
  }, [TaxData]);

  const refetchAllInv = () => {
    refetchFilteredData();
    refetch();
  };

  return (
    <div>
      <TopNav
        header="Back to Sales"
        reduxTabs={reduxTabs}
        refetch={refetch}
        setCurrentTab={setCurrentTab}
        setTNewTab={setTNewTab}
        setCurrentEdit={setCurrentEdit}
        setShowEditTab={setShowEditTab}
        handleRemoveTab={handleRemoveTab}
        handleAddTab={handleAddTab}
        currentTab={currentTab}
        tNewTab={tNewTab}
        setNavBarHeight={setNavBarHeught}
      />
      <Body padding="0" bgColor="transparent" navBarHeight={navbarHeight as number}>
        <Container columnGap="0.5em">
          <Left
            style={{
              backgroundColor: "white",
              borderRadius: "1.25rem",
              padding: "0.625rem .9375rem",
              width: "50%",
              height: `calc(100vh - ${navbarHeight! + 20}px)`,
            }}
          >
            <Flex width="100%" direction="column">
              <Flex alignItems="center" width="100%" height="2.5rem" justifyContent="space-between">
                <SearchInput
                  placeholder="Search or Scan Product"
                  borderRadius="0.75rem"
                  fontSize="0.875rem"
                  height="100%"
                  width="40%"
                  handleSearch={handleSearch}
                />
                <ScanButton
                  style={{
                    margin: "0px",
                    height: "100%",
                    width: "25%",
                    color: Colors.secondaryColor,
                  }}
                >
                  <p>Scan Bar Code</p>
                </ScanButton>
                <CategoryNav>
                  <Flex alignItems="center">
                    <Button
                      style={{ paddingInline: "0px", backgroundColor: Colors.primaryColor }}
                      size="sm"
                      width="2.5rem"
                      height="2.5rem"
                      disabled={page === 1}
                      backgroundColor={Colors.primaryColor}
                      onClick={handlePrevPage}
                    >
                      <img
                        style={{ transform: "rotate(180deg)" }}
                        src={arrowDownWhite}
                        alt="filter icon"
                      />
                    </Button>
                    <span>
                      {page} of {totalPages}
                    </span>
                    <Button
                      style={{
                        paddingInline: "0px",
                        marginRight: 0,
                        backgroundColor: Colors.primaryColor,
                      }}
                      size="sm"
                      width="2.5rem"
                      height="2.5rem"
                      disabled={page >= totalPages}
                      backgroundColor={Colors.primaryColor}
                      onClick={handleNextPage}
                    >
                      <img src={arrowDownWhite} alt="filter icon" />
                    </Button>
                  </Flex>
                </CategoryNav>
              </Flex>
              <Flex
                width="100%"
                alignItems="center"
                justifyContent="flex-start"
                gap="1em"
                margin="0.5em 0 0.5em 0"
              >
                {selectedBatchNo ? (
                  <Flex alignItems="center" justifyContent="space-between" width="100%">
                    <Flex
                      alignItems="center"
                      justifyContent="flex-start"
                      width="fit-content"
                      gap="1em"
                    >
                      <Button
                        borderRadius="0.5rem"
                        border={true}
                        borderSize="1px"
                        borderColor="#9EA8B7"
                        backgroundColor="transparent"
                        type="button"
                        color={Colors.blackLight}
                        height="1.875rem"
                        width="2.5rem"
                        size="sm"
                        onClick={() => setSelectedBatchNo("")}
                      >
                        <img src={BackArrow} alt="back" />
                      </Button>
                      <Span color={Colors.blackLight}>Go Back</Span>
                    </Flex>
                    <Span color={Colors.blackLight}>
                      <em>Showing: </em>
                      <Span color={Colors.primaryColor} fontSize="1.2em" fontWeight="700">
                        {selectedBatchNo}
                      </Span>{" "}
                    </Span>
                  </Flex>
                ) : (
                  salesTypeArray.map((type) => (
                    <CheckButton
                      key={type}
                      height="2.5rem"
                      borderRadius="0.625rem"
                      padding="0 0.625rem"
                      width="fit-content"
                      fontSize="0.6rem"
                      alignItems="center"
                      justifyContents="flex-start"
                      border="none"
                      color={salesType === type ? Colors.green : "#9EA8B7"}
                      backgroundColor={salesType === type ? Colors.lightGreen : Colors.tabBg}
                      onClick={() => {
                        setSalesType(type);
                        setSelectedBatchNo("");
                        type === "Sell by Batch" ? refetchBatch() : refetchAllInv();
                        setPage(1);
                      }}
                    >
                      <CheckBox
                        radius="50%"
                        color={Colors.green}
                        htmlFor={type}
                        checked={type === salesType}
                        onClick={() => setSalesType(type)}
                      >
                        <span></span>
                      </CheckBox>
                      <input type="checkbox" id={type} hidden />
                      <p id="name">{type}</p>
                    </CheckButton>
                  ))
                )}
              </Flex>
            </Flex>
            {isProductList || selectedBatchNo ? (
              <ProductsList
                {...{
                  searchTextList,
                  currentTab,
                  searchData,
                  selectedBatchNo,
                  page,
                  handlePrevPage,
                  totalPages,
                  handleNextPage,
                  navbarHeight,
                  inventoryDataList,
                  batchInvDataList,
                  handleAddToCart,
                  qtyInStock,
                }}
              />
            ) : (
              <BatchList
                {...{
                  batches,
                  setSelectedBatchNo,
                  navbarHeight,
                  searchTextList,
                  currentTab,
                  setPage,
                }}
              />
            )}
          </Left>
          <Right
            style={{
              backgroundColor: "white",
              borderRadius: "1.25rem",
              padding: "0.625rem .9375rem",
              position: "relative",
              border:
                reduxTabs[currentTab]?.items.length === 0
                  ? "none"
                  : `1px solid ${Colors.secondaryColor}`,
              boxShadow:
                reduxTabs[currentTab]?.items.length === 0
                  ? "none"
                  : "0px 4px 1.875rem rgba(96, 112, 135, 0.2)",
              height: `calc(100vh - ${navbarHeight! + 20}px)`,
              width: "50%",
            }}
          >
            <Flex justifyContent="space-between" height="1.875rem">
              <TextBold style={{ display: "flex", alignItems: "center" }} fontSize="1.05rem">
                <img src={BuyDark} alt="" style={{ height: "22px", paddingRight: "10px" }} />
                <p>
                  Cart <span>({reduxTabs[currentTab]?.items.length} Items)</span>
                </p>
              </TextBold>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: `${reduxTabs[currentTab]?.items.length > 0 ? "fit-content" : "15%"}`,
                }}
              >
                {reduxTabs[currentTab]?.items.length > 0 && (
                  <>
                    <Flex
                      onClick={() => handlePrintOrder()}
                      style={{ width: "fit-content", cursor: "pointer" }}
                    >
                      <img src={ReceiptIcon} alt="" />
                    </Flex>
                    <TransparentBtn
                      style={{ marginLeft: "0.625rem", width: "auto" }}
                      onClick={() => handleClearCart(currentTab)}
                    >
                      <img src={deleteIcon} alt="delete" style={{ height: "19px" }} />
                      <span style={{ fontSize: "1rem", color: "#F65151", paddingLeft: "0.625rem" }}>
                        Clear Cart
                      </span>
                    </TransparentBtn>
                  </>
                )}
              </div>
            </Flex>
            {reduxTabs[currentTab]?.items.length === 0 ? (
              <Flex
                maxHeight="24rem"
                alignItems="center"
                justifyContent="center"
                direction="column"
              >
                <img src={cartFillIcon} alt="cart" />
                <h3 style={{ color: "#8196B3", padding: "0.9375rem 0" }}>Your Cart is Empty</h3>
                <p style={{ color: "#8196B3", fontSize: "0.875rem" }}>
                  Add products to Cart to proceed to checkout.
                </p>
              </Flex>
            ) : (
              <Flex direction="column" justifyContent="space-between">
                <ItemsContainer navBarHeight={navbarHeight as number}>
                  {getCartCopy(reduxTabs[currentTab]?.items).map((item, i) => {
                    return (
                      <ItemCard key={i}>
                        <Flex
                          direction="column"
                          width="100%"
                          style={{ maxWidth: "calc(100% - 1.875rem)", overflowX: "hidden" }}
                          gap="10px"
                          padding="0.75rem 0px 0.75rem 0.75rem"
                        >
                          <Flex alignItems="center" width="100%">
                            <TransparentBtn onClick={(e) => removeItem(i, e)}>
                              <img src={Remove} alt="delete" />
                            </TransparentBtn>
                            <Flex width="calc(100% - 3.875rem)" direction="column">
                              <NameWrapper>
                                <div title={item.inventoryName}>{item.inventoryName}</div>
                              </NameWrapper>
                              <Flex
                                justifyContent="space-between"
                                alignItems="center"
                                style={{ cursor: "pointer" }}
                                padding="0"
                                width="100%"
                                onClick={() => handleShowDropdown(i)}
                                position="relative"
                              >
                                <Span color="#607087" fontWeight="400">
                                  {item.batchNo ?? "Product List"}
                                </Span>
                                <TextBold
                                  fontSize="1rem"
                                  style={{
                                    color: Colors.primaryColor,
                                    fontWeight: "600",
                                  }}
                                >
                                  {item?.inventoryType === "NON_TRACKABLE" ? (
                                    ""
                                  ) : (
                                    <span
                                      style={{
                                        fontSize: "1em",
                                        color: Colors.primaryColor,
                                        fontWeight: "600",
                                      }}
                                    >
                                      {!item.sellInVariant &&
                                          item.inventoryType === "PIECES_AND_PACK"
                                        ? item.sellInPieces
                                          ? "Pieces x "
                                          : "Pack x "
                                        : "Quantity: "}
                                    </span>
                                  )}
                                  {item.count}
                                </TextBold>
                                <TextBold
                                  fontSize="1rem"
                                  style={{
                                    color: Colors.primaryColor,
                                    fontWeight: "600",
                                  }}
                                >
                                  {formatAmountIntl(
                                    undefined,
                                    (isDiscount ? item.price - item.discount : item.price) *
                                    (item.count as number)
                                  )}
                                </TextBold>
                              </Flex>
                            </Flex>
                          </Flex>

                          {item.showDropdown && (
                            <div>
                              <div>
                                {item?.inventoryType === "NON_TRACKABLE" ? (
                                  <></>
                                ) : (
                                  <Counter>
                                    <button onClick={() => decCount(i, 1)}>
                                      <img src={minusIcon} alt="minus" />
                                    </button>
                                    <input
                                      type="text"
                                      value={item.count}
                                      onChange={(e) =>
                                        handleCount(
                                          i,
                                          e.target.value,
                                          item.sellInPieces
                                            ? item.quantityInPieces ?? 0
                                            : item.quantityInPacks ?? 0
                                        )
                                      }
                                    />
                                    <button
                                      onClick={() => {
                                        incCount(
                                          i,
                                          item.isVariation
                                            ? item.stock
                                            : item.sellInPieces
                                              ? item.quantityInPieces ?? 0
                                              : item.quantityInPacks ?? 0,
                                          1
                                        );
                                      }}
                                    >
                                      <img src={whitePlusIcon} alt="plus" />
                                    </button>
                                  </Counter>
                                )}
                                <Flex padding="5px 0" justifyContent="space-between">
                                  <Flex
                                    alignItems="center"
                                    height="1.875rem"
                                    onClick={() => handleDiscountToggle(i)}
                                  >
                                    <Checkbox
                                      isChecked={item.isDiscount}
                                      onChange={() => handleDiscountToggle(i)}
                                      size="15px"
                                    />
                                    <TextBold
                                      fontSize="0.875rem"
                                      style={{ paddingLeft: "10px", cursor: "pointer" }}
                                    >
                                      Discount for this item
                                    </TextBold>
                                  </Flex>
                                  {item?.isDiscount && (
                                    <Flex justifyContent="end" margin="0 0.5em 0 0">
                                      <input
                                        type="text"
                                        placeholder="0"
                                        value={item.discount}
                                        onChange={(e) =>
                                          handleProductDiscount(
                                            item.price,
                                            Number(e.target.value),
                                            i,
                                            (item.count as number) ?? 0
                                          )
                                        }
                                        style={{
                                          background: "#f4f6f9",
                                          border: "1px solid #8196B3",
                                          borderRadius: "0.5rem",
                                          padding: "5px",
                                          color: "#607087",
                                          fontWeight: "500",
                                          margin: "0 4px",
                                          width: "7.5rem",
                                          outline: "none",
                                        }}
                                      />
                                      <TextBold style={{ marginLeft: "10px", paddingTop: "5px" }}>
                                        <span>
                                          {formatAmountIntl(
                                            undefined,
                                            item.price * (item.count as number) - item.discount
                                          )}
                                        </span>
                                      </TextBold>
                                    </Flex>
                                  )}
                                </Flex>
                              </div>
                            </div>
                          )}
                        </Flex>
                        <RowDropButton onClick={() => handleShowDropdown(i)}>
                          <img
                            src={arrowDownGrey}
                            alt=""
                            style={{
                              transform: `${item.showDropdown ? "rotate(180deg)" : "rotate(0deg)"}`,
                              transition: ".3s linear",
                            }}
                          />
                        </RowDropButton>
                      </ItemCard>
                    );
                  })}
                </ItemsContainer>
                <Flex
                  justifyContent="space-between"
                  position="absolute"
                  direction="column"
                  style={{ bottom: "1em" }}
                  width="calc(100% - 2em)"
                  bg="white"
                >
                  <Flex direction="column" width="100%" height="25px">
                    {appliedTaxes.length > 0 && (
                      <Flex alignItems="center" margin="0.5em 0" color={Colors.blackLight}>
                        <Span fontWeight="600" margin="0 0.5em 0 0">
                          Applied Taxes:
                        </Span>
                        {appliedTaxes.map((tax, i) => (
                          <Span key={i} margin="0 0.5em 0 0">
                            {`${tax.name}: ${tax.value}`}%
                          </Span>
                        ))}
                      </Flex>
                    )}
                  </Flex>
                  <Flex width="100%" direction="column">
                    <Flex
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                      height="1.875rem"
                    >
                      <TextBold fontSize="22px" style={{ color: "#9EA8B7", fontWeight: "400" }}>
                        Total{" "}
                      </TextBold>
                      <span
                        style={{
                          fontWeight: "700",
                          paddingLeft: "15px",
                          fontSize: "22px",
                          color: Colors.primaryColor,
                        }}
                      >
                        {formatAmountIntl(undefined, getTotalCartPrice() ?? 0)}
                      </span>
                    </Flex>
                    <Flex justifyContent="space-between" width="100%" height="2.5rem">
                      <Button
                        label="Place Order"
                        onClick={() => handleCheckout(true)}
                        backgroundColor={Colors.secondaryColor}
                        size="lg"
                        color="#fff"
                        borderColor="transparent"
                        borderRadius="0.5rem"
                        borderSize="0px"
                        height="2.5rem"
                        fontSize="1rem"
                        width="48%"
                        display={!isFigorr && isOfflineOrderActive ? "flex" : "none"}
                      />
                      <Button
                        label="Instant Checkout"
                        onClick={() => handleCheckout()}
                        backgroundColor={Colors.primaryColor}
                        size="lg"
                        color="#fff"
                        height="2.5rem"
                        borderColor="transparent"
                        borderRadius="0.5rem"
                        borderSize="0px"
                        fontSize="1rem"
                        width={!isFigorr && isOfflineOrderActive ? "48%" : "100%"}
                      />
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            )}
          </Right>
        </Container>
      </Body>
      ;
      {showCheckout && (
        <ModalContainer>
          <Checkout
            handleClose={setShowCheckout}
            cart={reduxTabs[currentTab].items}
            clearCart={handleClearCart}
            currentTab={currentTab}
            handleCloseTab={handleRemoveTab}
            refetchInventory={() => {
              refetch();
              refetchFilteredData();
              rBatchInv();
            }}
          />
        </ModalContainer>
      )}
      {showEditTab && (
        <PopupCard close={() => setShowEditTab(false)}>
          <ModalBox>
            <h3 style={{ marginBottom: "2rem" }}>
              <button onClick={() => setShowEditTab(false)}>
                <img src={cancelIcon} alt="" />
              </button>
              <span>Change tab name</span>
            </h3>
            <label>TabName</label>
            <InputField
              autoFocus
              placeholder="Enter Tab Name"
              type="text"
              backgroundColor="#F4F6F9"
              size="lg"
              color="#607087"
              borderColor="transparent"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="1rem"
              width="100%"
              value={reduxTabs[currentEdit].name}
              onFocus={(e) => e.target.select()}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setShowEditTab(false);
                }
              }}
              onChange={(e) => handleUpdateTabName(e.target.value)}
            />
            <div style={{ marginBottom: "1.25rem" }}></div>
            <Button
              label="Update tab name"
              onClick={() => setShowEditTab(false)}
              backgroundColor={Colors.primaryColor}
              size="lg"
              color="#fff"
              borderColor="transparent"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="1rem"
              width="100%"
            />
            <div style={{ marginBottom: "1.25rem" }}></div>
          </ModalBox>
        </PopupCard>
      )}
      {showAddModal &&
        (modalItem && modalItem?.inventoryType !== "VARIATION" ? (
          <PopupCard close={() => setShowAddModal(false)}>
            <ModalBox>
              <h3
                style={{
                  marginBottom: "0.75rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{modalItem?.inventoryName}</span>
                <button onClick={() => setShowAddModal(false)}>
                  <img src={cancelIcon} alt="" />
                </button>
              </h3>
              <label>
                <p style={{ opacity: ".6", display: "inline-block" }}>Sold in: </p> {"  "}
                <p style={{ color: "#607087", display: "inline-block" }}>Pieces &amp; Pack</p>
              </label>
              <Flex justifyContent="space-around">
                <RadioLabel
                  htmlFor={"sell-in-pieces"}
                  onClick={handleSellInPiecesModal}
                  isActive={modalItem?.sellInPieces}
                  style={{ marginRight: "1.125rem" }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: modalItem?.sellInPieces ? "#ECEFF4" : "transparent",
                      padding: "0.625rem 13px",
                      borderRadius: "1rem",
                      border: "2px solid #ECEFF4",
                      width: "11rem",
                    }}
                  >
                    <span>
                      <span></span>
                    </span>
                    <div>
                      <p style={{ fontSize: "1rem" }}>
                        Pieces ({modalItem?.TrackableItem?.unitPrice})
                      </p>
                      <p style={{ display: "block" }}>
                        {modalItem?.quantityInPacks! * modalItem?.TrackableItem?.perPack! +
                          modalItem?.quantityInPieces!}{" "}
                        Available
                      </p>
                    </div>
                  </div>
                </RadioLabel>
                <input type="radio" name={"sell-in-pieces"} id={"sell-in-pieces"} hidden />
                <RadioLabel
                  htmlFor={"sell-in-pieces"}
                  onClick={handleSellInPiecesModal}
                  isActive={!modalItem?.sellInPieces}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background: !modalItem?.sellInPieces ? Colors.tabBg : "transparent",
                      padding: "0.625rem 13px",
                      borderRadius: "1rem",
                      border: `2px solid ${Colors.tabBg}`,
                      width: "11rem",
                    }}
                  >
                    <span>
                      <span></span>
                    </span>
                    <div>
                      <p style={{ fontSize: "1rem" }}>
                        Pack ({modalItem?.TrackableItem?.packPrice})
                      </p>
                      <p style={{ display: "block" }}>
                        {modalItem?.quantityInPacks} Packs ({modalItem?.TrackableItem?.perPack} per
                        Pack)
                      </p>
                    </div>
                  </div>
                </RadioLabel>
                <input type="radio" name={"sell-in-pack"} id={"sell-in-pack"} hidden />
              </Flex>
              <label>Quantity</label>
              <Counter>
                <button
                  style={{
                    padding: "7px, 0.625rem, 7px, 0.625rem",
                    width: "2.125rem",
                    height: "2.125rem",
                  }}
                  onClick={() => decCountM()}
                >
                  <img src={minusIcon} alt="minus" />
                </button>
                <input
                  type="text"
                  style={{
                    background: "#F4F6F9",
                    padding: "0.625rem, 0.6875rem, 0.625rem, 0.6875rem",
                    outline: "none",
                    border: "none",
                    width: "4.8125rem",
                    height: "2.125rem",
                    marginInline: "0.625rem",
                  }}
                  value={modalItem?.count}
                  onChange={(e) =>
                    handleCountM(
                      e.target.value,
                      modalItem?.sellInPieces
                        ? modalItem?.quantityInPacks! * modalItem?.TrackableItem?.perPack! +
                        modalItem?.quantityInPieces! ?? 0
                        : modalItem?.quantityInPacks ?? 0
                    )
                  }
                />
                {/* TODO: multiply perpack with quantityInPacks and add with quantityInPieces (perPack * quantityInPacks) + quantityInPieces */}
                <button
                  style={{
                    padding: "7px, 0.625rem, 7px, 0.625rem",
                    width: "2.125rem",
                    height: "2.125rem",
                  }}
                  onClick={() =>
                    incCountM(
                      modalItem?.sellInPieces
                        ? modalItem?.quantityInPacks! * modalItem?.TrackableItem?.perPack! +
                        modalItem?.quantityInPieces! ?? 0
                        : modalItem?.quantityInPacks ?? 0
                    )
                  }
                >
                  <img src={whitePlusIcon} alt="plus" />
                </button>
              </Counter>
              <label>Total</label>
              <h3 style={{ margin: "0" }}>
                {formatAmountIntl(
                  undefined,
                  (modalItem?.price ?? 0) * ((modalItem?.count as number) ?? 0)
                )}
              </h3>
              <div
                style={{
                  marginBottom: ".9375rem",
                  marginTop: "1.25rem",
                  borderBottom: `.1px solid ${Colors.grey}`,
                  height: ".0001px",
                }}
              ></div>

              <Button
                label="Add to cart"
                onClick={() => {
                  addToCartFromModal();
                }}
                disabled={(modalItem?.count as number)! < 1}
                backgroundColor={Colors.secondaryColor}
                size="lg"
                color="#fff"
                borderColor="transparent"
                borderRadius="0.75rem"
                borderSize="0px"
                fontSize="1rem"
                width="100%"
              />
              <div style={{ marginBottom: "1.25rem" }}></div>
            </ModalBox>
          </PopupCard>
        ) : (
          <PopupCard close={() => setShowAddModal(false)}>
            <ModalBox>
              <h3
                style={{
                  marginBottom: "0.75rem",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{modalItem?.inventoryName}</span>
                <button onClick={() => setShowAddModal(false)}>
                  <img src={cancelIcon} alt="" />
                </button>
              </h3>
              <label>
                <Span opacity={0.6}>Sold in:</Span>{" "}
                <Span color={Colors.blackLight}>Variations</Span>
              </label>
              <Flex direction="column">
                {modalItem?.Variations?.map((variant) => (
                  <Flex
                    style={{
                      display: "flex",
                      alignItems: "center",
                      background:
                        modalItem?.sellInVariant === variant?.variationId
                          ? Colors.tabBg
                          : "transparent",
                      padding: "0.625rem 13px",
                      borderRadius: "1rem",
                      border: `2px solid ${Colors.tabBg}`,
                      marginBlock: "0.5rem",
                      cursor: "pointer",
                      paddingInlineEnd: "1.25rem",
                    }}
                    justifyContent="space-between"
                    key={variant?.variationId}
                    disabled={getVariationQuantity(variant?.variationId!, modalItem) < 1}
                    onClick={() => {
                      handleVariationModal(variant);
                      setCurrentVariantId(variant?.variationId);
                    }}
                  >
                    <RadioLabel
                      isActive={modalItem?.sellInVariant === variant?.variationId}
                      style={{ marginRight: "1.125rem" }}
                    >
                      <span>
                        <span></span>
                      </span>
                      {variant?.variationName} {"  "} (
                      {getVariationQuantity(variant?.variationId!, modalItem)})
                    </RadioLabel>
                    <Span color={Colors.blackLight} fontSize="13px" margin="0.625rem 0">
                      {formatAmountIntl(undefined, variant?.price!)}
                    </Span>
                    <input type="radio" name={"sell-in-pieces"} id={"sell-in-pieces"} hidden />
                  </Flex>
                ))}
              </Flex>
              <div style={{ marginBottom: "1.25rem" }}></div>
              <label>Quantity</label>
              <Counter>
                <button
                  style={{
                    padding: "7px, 0.625rem, 7px, 0.625rem",
                    width: "2.125rem",
                    height: "2.125rem",
                  }}
                  onClick={decCountM}
                >
                  <img src={minusIcon} alt="minus" />
                </button>
                <input
                  style={{
                    background: "#F4F6F9",
                    padding: "0.625rem, 0.6875rem, 0.625rem, 0.6875rem",
                    outline: "none",
                    border: "none",
                    width: "4.8125rem",
                    height: "2.125rem",
                    marginInline: "0.625rem",
                  }}
                  type="text"
                  value={modalItem?.count}
                  onChange={(e) => handleCountM(e.target.value, modalItem?.stock!)}
                />
                {/* TODO: multiply perpack with quantityInPacks and add with quantityInPieces (perPack * quantityInPacks) + quantityInPieces */}
                <button
                  style={{
                    padding: "7px, 0.625rem, 7px, 0.625rem",
                    width: "2.125rem",
                    height: "2.125rem",
                  }}
                  disabled={modalItem?.count! === getVariationQuantity(currentVariantId, modalItem)}
                  onClick={() => incCountM(modalItem?.stock ?? 0)}
                >
                  <img src={whitePlusIcon} alt="plus" />
                </button>
              </Counter>
              <label>Total</label>
              <h3 style={{ margin: "0" }}>
                {formatAmountIntl(
                  undefined,
                  (modalItem?.price ?? 0) * ((modalItem?.count as number) ?? 0)
                )}
              </h3>
              <div
                style={{
                  marginBottom: ".9375rem",
                  marginTop: "1.25rem",
                  borderBottom: `.1px solid ${Colors.grey}`,
                  height: ".0001px",
                }}
              ></div>

              <Button
                label="Add to cart"
                onClick={() => {
                  addToCartFromModal(modalItem?.variationName);
                }}
                backgroundColor={Colors.primaryColor}
                disabled={(modalItem?.count as number)! < 1}
                size="lg"
                color="#fff"
                borderColor="transparent"
                borderRadius="0.75rem"
                borderSize="0px"
                fontSize="1rem"
                width="100%"
              />
              <div style={{ marginBottom: "1.25rem" }}></div>
            </ModalBox>
          </PopupCard>
        ))}
    </div>
  );
};

export default NewSales;
