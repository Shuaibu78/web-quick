/* eslint-disable indent */
/* eslint-disable no-debugger */
/* eslint-disable no-trailing-spaces */
import React, { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from "react";
import TopNav from "../../components/top-nav/top-nav";
import { IInventory } from "../../interfaces/inventory.interface";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getCurrentShop, increaseSyncCount } from "../.././app/slices/shops";
import {
  DELETE_MULTIPLE_INVENTORY,
  GET_ALL_SHOP_INVENTORY,
  GET_FILTERED_INVENTORY_OPTIONS,
  UPDATE_INVENTORY,
} from "../../schema/inventory.schema";
import { syncTotalTableCount } from "../../helper/comparisons";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { Body, ExpensesWrapper } from "../expenses/style";
import { Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { SalesCard } from "../home/style";
import { formatAmountIntl } from "../../helper/format";
import ProductOnlineIcon from "../../assets/ProductOnline.svg";
import ProductOfflineIcon from "../../assets/ProductOffline.svg";
import OutofStockIcon from "../../assets/OutOfStockIcon.svg";
import EyeIconFigorr from "../../assets/EyeIconFigorr.svg";
import { setHideProductNav } from "../../app/slices/userPreferences";
import { isFigorr } from "../../utils/constants";
import { Colors } from "../../GlobalStyles/theme";
import EyeIcon from "../../assets/EyeIcon.svg";
import InfoIcon from "../../assets/info.svg";
import { BatchDetailButton, BatchNav } from "./style";
import BackArrow from "../../assets/back-arrow.svg";
import { Button } from "../../components/button/Button";
import { IBatch, IBatchProducts, IShopBatches } from "../../interfaces/batch.interface";
import {
  DELETE_MULTIPLE_BATCH,
  DELETE_BATCH_INVENTORY,
  GET_ALL_SHOP_BATCHES,
  GET_BATCH_INVENTORIES,
} from "../../schema/batch.schema";
import { Outlet, useLocation, useOutletContext } from "react-router-dom";
import ModalSidebar from "./product-list/modal";
import ProductDetails from "./productDetails/productDetails";
import { setSingleInventory } from "../../app/slices/inventory";
import CustomConfirm from "../../components/confirmComponent/cofirmComponent";
import { rpcClient } from "../../helper/rpcClient";

type TView = "list" | "history" | "batch" | "transfer";

interface IBatchCount {
  totalCount: number;
  totalQuantity: number;
  totalValue: number;
  totalInventories: number;
}

interface ProductPageContextAttr {
  handleRefetch: () => void;
  navBarHeight: number;
  refetchBatch: Function;
  refetchInv: Function;
  total: number;
  bInvPage: number;
  batchPage: number;
  batches: IBatch[];
  showBatch: boolean;
  bInvPerPage: number;
  navbarHeight: number;
  batchPerPage: number;
  setBatches: Function;
  refetchAll: Function;
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
  setBatchSearch: React.Dispatch<React.SetStateAction<string>>;
  setBatchInvSearch: React.Dispatch<React.SetStateAction<string>>;
  selectedProductIds: string[];
  setSelectedProductIds: Function;
  setAdjustModalPopup: Dispatch<SetStateAction<boolean>>;
  setShowProductModal: Dispatch<SetStateAction<boolean>>;
  setCurrentInventory: Dispatch<SetStateAction<IInventory | undefined>>;
  adjustModalPopup: boolean;
  currentInventory: IInventory;
  handleMakeProductOnline: (inventoryId: string, isPublished: boolean) => void;
  saveSelectedInventory: (inventory: IInventory) => void;
  handleDeleteInventory: Function;
  fetchingProducts: boolean;
  refetchFilteredData: Function;
  setSelectedOption: React.Dispatch<React.SetStateAction<number>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPerPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  handleTruncateProduct: Function;
  selectedOption: number;
  filterOptions: string[];
  perPage: number;
  totalPages: number;
  refetch: Function;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  inventoryList: IInventory[];
  search: string;
}

const Inventory: FunctionComponent = () => {
  const [view, setView] = useState<TView>("list");
  const [batchDetail, setBatchDetail] = useState<IBatch>();
  const [batchSearch, setBatchSearch] = useState("");
  const [bInvPage, setBInvPage] = useState<number>(1);
  const [batchPage, setBatchPage] = useState<number>(1);
  const [batchInvSearch, setBatchInvSearch] = useState("");
  const [showBatch, setShowBatch] = useState(false);
  const [batchPerPage, setBatchPerPage] = useState(10);
  const [batches, setBatches] = useState<IBatch[]>([]);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [bInvPerPage, setBInvPerPage] = useState(10);
  const [selectedBatchNo, setSelectedBatchNo] = useState("");
  const [selectedBatchId, setSelectedBatchId] = useState("");
  const [navbarHeight, setNavBarHeight] = useState<number>(0);
  const [totalBatches, setTotalBatches] = useState<number>(0);
  const [currentInventory, setCurrentInventory] = useState<IInventory | undefined>(undefined);
  const [batchCount, setBatchCount] = useState<IBatchCount>();
  const [adjustModalPopup, setAdjustModalPopup] = useState<boolean>(false);
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [totalInventory, setTotalInventory] = useState<number | string>("--");
  const [inventoryList, setInventoryList] = useState<IInventory[]>([]);
  const [totalProductQty, setTotalProductQty] = useState<number | string | undefined>("--");
  const [totalProductValue, setTotalProductValue] = useState<number | undefined>(0);
  const [batchProducts, setBatchProducts] = useState<IInventory[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [totalOnlineProducts, setTotalOnlineProducts] = useState<number | string | undefined>("--");
  const [totalOfflineProducts, setTotalOfflineProducts] = useState<number | string | undefined>(
    "--"
  );
  const [totalOutOfStockProducts, setTotalOutOfStockProducts] = useState<
    number | string | undefined
    >("--");
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [isSameSelectedOption, setIsSameSelectedOption] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const preferences = useAppSelector((state) => state.userPreferences.preferences);
  const { user: userInfo } = useAppSelector((state) => state);
  const currentUserId = useAppSelector((state) => state.user.userId);
  const userPreference = preferences.find((user) => user.userId === currentUserId);

  const dispatch = useAppDispatch();
  const currentShop = useAppSelector(getCurrentShop);

  const filterOptions = [
    "ALL_PRODUCTS",
    "OUT_OF_STOCK",
    "IN_STOCK",
    "LESS_THAN_10",
    "GREATER_THAN_10",
    "ZERO_COST_PRICE",
  ];

  const isSelectedOptionTheSame = selectedOption === isSameSelectedOption;

  const [getInventories, { data, refetch }] = useLazyQuery<{
    getAllShopInventory: [IInventory];
  }>(GET_ALL_SHOP_INVENTORY, {
    variables: {
      removeBatchProducts: true,
      shopId: currentShop?.shopId as string,
      limit: isNaN(perPage) ? 10 : perPage,
      page: page < 1 ? 1 : page,
      searchString: search,
      filter: filterOptions[selectedOption],
    },
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const [
    getFilteredInventories,
    { data: filteredData, refetch: refetchFilteredData, loading: fetchingProducts },
  ] = useLazyQuery<{
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
      filter: filterOptions[selectedOption],
    },
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const syncTableUpdateCount = useAppSelector((state) =>
    syncTotalTableCount(state.shops.syncTableUpdateCount, [
      "Inventory",
      "TrackableItems",
      "NonTrackableItems",
      "Supplies",
      "Receipt",
      "Sales",
      "Variations",
      "InventoryQuantity",
    ])
  );

  useEffect(() => {
    if (!isSelectedOptionTheSame) {
      getInventories();
      getFilteredInventories();

      setIsSameSelectedOption(selectedOption);
    }
  }, [selectedOption]);

  useEffect(() => {
    getInventories();
    getFilteredInventories();
  }, [syncTableUpdateCount]);

  useEffect(() => {
    if (data) {
      setInventoryList(data?.getAllShopInventory);
      let initialSelectedState: { [key: string]: boolean } = {};
      data.getAllShopInventory.forEach((val) => {
        initialSelectedState = { ...initialSelectedState, [val?.inventoryId!]: false };
      });
    }

    if (filteredData) {
      setTotalInventory(
        isNaN(filteredData?.getFilteredInventory?.totalInventory as number)
          ? "--"
          : filteredData?.getFilteredInventory?.totalInventory
      );
      setTotalOfflineProducts(
        isNaN(filteredData?.getFilteredInventory?.totalOfflineProducts)
          ? "--"
          : filteredData?.getFilteredInventory?.totalOfflineProducts
      );
      setTotalOnlineProducts(
        isNaN(filteredData?.getFilteredInventory?.totalOnlineProducts)
          ? "--"
          : filteredData?.getFilteredInventory?.totalOnlineProducts
      );
      setTotalOutOfStockProducts(
        isNaN(filteredData?.getFilteredInventory?.totalOutOfStockProducts)
          ? "--"
          : filteredData?.getFilteredInventory?.totalOutOfStockProducts
      );
    }
  }, [data, filteredData]);

  useEffect(() => {
    setTotalProductValue(filteredData?.getFilteredInventory?.totalInventoryValue || 0);
    setTotalProductQty(
      isNaN(filteredData?.getFilteredInventory?.totalProductQuantity!)
        ? "--"
        : filteredData?.getFilteredInventory?.totalProductQuantity
    );
  }, [data, filteredData, inventoryList, syncTableUpdateCount]);

  const handleRefetch = () => {
    refetch();
    getInventories();
  };

  const [updateInventory] = useMutation(UPDATE_INVENTORY, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const [getBatchInventories, { data: BInvData, refetch: BInvRefetch }] = useLazyQuery<{
    getBatchInventories: IBatchProducts;
  }>(GET_BATCH_INVENTORIES, {
    variables: {
      page: bInvPage,
      limit: bInvPerPage,
      search: batchInvSearch,
      batchNo: selectedBatchNo,
      shopId: currentShop?.shopId,
    },
    fetchPolicy: "no-cache",
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const [getAllShopBatch, { data: batchData, refetch: refetchBatch }] = useLazyQuery<{
    getAllShopBatches: IShopBatches;
  }>(GET_ALL_SHOP_BATCHES, {
    fetchPolicy: "cache-and-network",
    variables: {
      page: batchPage,
      search: batchSearch,
      limit: batchPerPage,
      shopId: currentShop?.shopId,
    },
    onCompleted({ getAllShopBatches }) {
      setBatches(getAllShopBatches.batches);
      setTotalBatches(
        Math.ceil(getAllShopBatches.totalBatches / (isNaN(batchPerPage) ? 10 : batchPerPage))
      );
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

  useEffect(() => {
    if (view === "batch") {
      getBatchInventories();
      getAllShopBatch();
    }
  }, [view === "batch"]);

  useEffect(() => {
    if (BInvData?.getBatchInventories) {
      const { batchInventories, ...rest } = BInvData.getBatchInventories;
      setBatchProducts(batchInventories);
      setBatchCount(rest);
    }
  }, [selectedBatchNo, batchInvSearch, bInvPerPage, bInvPage, BInvData]);

  const dispatchBatchDetails = () => {
    const batch = batches.find((product) => product.batchNumber === selectedBatchNo);

    if (batch) {
      setBatchDetail(batch);
      setShowDetails(true);
    }
  };

  const [deletedMultipleBatch] = useMutation<{ deleteBatch: Boolean }>(DELETE_MULTIPLE_BATCH, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
    onCompleted: ({ deleteBatch }) => {
      if (deleteBatch) {
        refetchBatch();
        dispatch(
          toggleSnackbarOpen({
            color: "SUCCESS",
            message: "Batch Successfully Deleted",
          })
        );
      }
    },
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error.message));
    },
  });

  const handleDeleteBatch = (ids: string[], batchNumber: string) => {
    if (ids.length < 1) return;

    deletedMultipleBatch({
      variables: {
        batchIds: ids,
        batchNumber,
        shopId: currentShop.shopId,
      },
    });
  };

  const [removeBatchInventory] = useMutation<{ deleteBatchInventory: Boolean }>(
    DELETE_BATCH_INVENTORY,
    {
      onQueryUpdated(observableQuery) {
        return observableQuery.refetch();
      },

      onCompleted: ({ deleteBatchInventory }) => {
        if (deleteBatchInventory) {
          BInvRefetch();
          refetchBatch();
          dispatch(
            toggleSnackbarOpen({
              color: "SUCCESS",
              message: "Product(s) removed from batch",
            })
          );
        }
      },
      onError: (error) => {
        dispatch(toggleSnackbarOpen(error.message));
      },
    }
  );

  const handleRemoveBInventory = (inventoryIds: string[]) => {
    if (inventoryIds.length < 1) return;

    removeBatchInventory({
      variables: {
        inventoryIds,
        shopId: currentShop?.shopId as string,
      },
    });
  };

  const [DeleteMultipleInventories] = useMutation<{ deleteInventory: IInventory }>(
    DELETE_MULTIPLE_INVENTORY,
    {
      onQueryUpdated(observableQuery) {
        return observableQuery.refetch();
      },
    }
  );

  const handleDeleteInventory = (id: string[] | string) => {
    DeleteMultipleInventories({
      variables: {
        inventoryIds: id,
        shopId: currentShop?.shopId as string,
      },
    }).then((res) => {
      if (res.data) {
        dispatch(
          increaseSyncCount([
            "Inventory",
            "TrackableItems",
            "NonTrackableItems",
            "Supplies",
            "Sales",
            "Variations",
            "InventoryQuantity",
          ])
        );
        refetchBatch();
        BInvRefetch();
        setSelectedProductIds([]);
      }
    });
  };

  const handleMakeProductOnline = async (inventoryId: string, status: boolean) => {
    if (!currentShop?.isPublished) {
      dispatch(
        toggleSnackbarOpen(
          "You can't change the status of this product because the shop is not published"
        )
      );
      return;
    }
    updateInventory({
      variables: {
        inventoryId: inventoryId,
        isPublished: status,
        inventoryName: currentInventory?.inventoryName,
        shopId: currentShop?.shopId as string,
      },
    })
      .then(() => {
        dispatch(toggleSnackbarOpen("Product status changed successfully."));
        dispatch(
          increaseSyncCount([
            "Inventory",
            "TrackableItems",
            "NonTrackableItems",
            "Supplies",
            "Sales",
            "Variations",
            "InventoryQuantity",
          ])
        );
        getInventories();
        handleRefetch();
      })
      .catch((error) => {
        dispatch(
          toggleSnackbarOpen({
            message: error.message || error.graphQLErrors[0].message,
            color: "DANGER",
          })
        );
      });
  };

  const saveSelectedInventory = (newValue: IInventory) => {
    dispatch(setSingleInventory(newValue));
  };

  const refetchAll = () => {
    BInvRefetch();
    refetchBatch();
  };

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("batches")) {
      setView("batch");
    } else if (location.pathname.includes("transfer")) {
      setView("transfer");
    } else {
      setView("list");
    }
  }, [location]);

  useEffect(() => {
    if (selectedOption >= 0 && selectedOption < filterOptions.length) {
      setPage(1);
    }
  }, [selectedOption]);

  const inventoryCards = () => {
    if (showBatch) {
      return (
        <Flex
          justifyContent="space-between"
          width="100%"
          maxHeight="4.375rem"
          bg="white"
          borderRadius=".75rem"
          margin="0.5em 0 0 0"
          alignItems="center"
          height="3.125rem"
        >
          <Flex alignItems="center" gap="2em">
            <Button
              borderRadius=".5rem"
              backgroundColor="#60708726"
              type="button"
              color="#607087"
              height="2.1875rem"
              width="fit-content"
              onClick={() => {
                setShowBatch(false);
                setSelectedBatchId("");
              }}
            >
              <img src={BackArrow} alt="back" />
            </Button>
            <Span color={Colors.blackishBlue} fontWeight="700" fontSize="1.2em">
              Batch {selectedBatchNo}
            </Span>
          </Flex>
          <BatchNav>
            <Span color={Colors.grey} fontSize="0.9em" fontWeight="600">
              Product count:{" "}
              <Span fontSize="1.2em" color={Colors.primaryColor}>
                {Number(batchCount?.totalCount).toLocaleString() || 0}
              </Span>
            </Span>
            <Span color={Colors.grey} fontSize="0.9em" fontWeight="600">
              Total Product Qty:{" "}
              <Span fontSize="1.2em" color={Colors.primaryColor}>
                {Number(batchCount?.totalQuantity).toLocaleString() || 0}
              </Span>
            </Span>
            <Span color={Colors.grey} fontSize="0.9em" fontWeight="600">
              Total Product Value:{" "}
              <Span fontSize="1.2em" color={Colors.primaryColor}>
                {formatAmountIntl(undefined, batchCount?.totalValue || 0)}
              </Span>
            </Span>
          </BatchNav>
          <BatchDetailButton onClick={dispatchBatchDetails}>
            <img src={isFigorr ? EyeIconFigorr : EyeIcon} alt="" />{" "}
            <Span color={Colors.secondaryColor}>View Batch Information</Span>
          </BatchDetailButton>
        </Flex>
      );
    }

    return (
      <>
        <Flex
          display={view === "transfer" ? "none" : "flex"}
          justifyContent="start"
          height={userPreference?.hideProductsNav ? "4.375rem" : "0"}
          overflow="hidden"
          margin=".81rem 0px 0 0"
          gap="2rem"
          width="100%"
          minHeight="0rem"
          maxHeight="4.375rem"
          transition="height 0.5s ease-in-out"
        >
          <SalesCard height="4.375rem" width="40%">
            <Flex width="25rem" justifyContent="space-between" direction="column">
              <Span fontSize="0.8125rem" fontWeight="normal">
                {view === "batch" ? "Batch" : "Product"} Count
              </Span>
              <Span fontSize="1.25rem" fontWeight="700">
                {view !== "batch"
                  ? isNaN(Number(totalInventory))
                    ? "--"
                    : Number(totalInventory).toLocaleString()
                  : Number(
                    view === "batch" ? batchData?.getAllShopBatches?.totalBatches : 0
                  ).toLocaleString()}
              </Span>
            </Flex>
            <Flex width="25rem" justifyContent="space-between" direction="column">
              <Span fontSize="0.8125rem" fontWeight="normal">
                Total {view === "batch" ? "Batch " : "Product"} Qty
              </Span>
              <Span fontSize="1.25rem" fontWeight="700">
                {view !== "batch"
                  ? isNaN(Number(totalProductQty))
                    ? "--"
                    : Number(totalProductQty).toLocaleString()
                  : Number(
                    view === "batch" ? batchData?.getAllShopBatches?.totalBatchProductsQty : 0
                  ).toLocaleString()}
              </Span>
            </Flex>
            <Flex width="25rem" justifyContent="space-between" direction="column">
              <Span fontSize="0.8125rem" fontWeight="normal">
                Total {view === "batch" ? "Batch" : "Products"} Value
              </Span>
              <Span fontSize="1.25rem" fontWeight="700">
                {formatAmountIntl(
                  undefined,
                  view !== "batch"
                    ? isNaN(Number(totalProductValue))
                      ? 0
                      : Number(totalProductValue)
                    : Number(
                      view === "batch" ? batchData?.getAllShopBatches?.totalBatchProductsValue : 0
                    )
                )}
              </Span>
            </Flex>
          </SalesCard>
          <SalesCard
            height="4.375rem"
            width={view === "batch" ? "calc(60% - 2.1875rem)" : isFigorr ? "15%" : "40%"}
            background={view === "batch" ? "transparent" : "#ECEFF4"}
            color="#9EA8B7"
            border={view === "batch" ? "1px solid #ECEFF4" : "unset"}
          >
            {view === "batch" ? (
              <>
                <Flex width="100%" justifyContent="space-between" gap="1em" alignItems="center">
                  <img src={InfoIcon} alt="info icon" />
                  <Span fontSize=".875rem" fontWeight="normal" color="#607087">
                    Use batches for products that are manufactured or produced the same time using
                    the same production process and specifications.{" "}
                    <Span cursor="pointer" color={Colors.secondaryColor}>
                      View More/Breakdown
                    </Span>
                  </Span>
                </Flex>
              </>
            ) : (
              <>
                <Flex
                  display={isFigorr ? "none" : "flex"}
                  width="25rem"
                  justifyContent="space-between"
                  direction="column"
                >
                  <Flex>
                    <img src={ProductOnlineIcon} alt="" />
                    <Span margin="0 0 0 .5rem" fontSize="0.8125rem" fontWeight="normal">
                      Products Online
                    </Span>
                  </Flex>
                  <Span fontSize="1.25rem" fontWeight="700">
                    {isNaN(Number(totalOnlineProducts)) ? "--" : Number(totalOnlineProducts)}
                  </Span>
                </Flex>
                <Flex
                  display={isFigorr ? "none" : "flex"}
                  width="25rem"
                  justifyContent="space-between"
                  direction="column"
                >
                  <Flex>
                    <img src={ProductOfflineIcon} alt="" />
                    <Span margin="0 0 0 .5rem" fontSize="0.8125rem" fontWeight="normal">
                      Products Offline
                    </Span>
                  </Flex>
                  <Span fontSize="1.25rem" fontWeight="700">
                    {isNaN(Number(totalOfflineProducts)) ? "--" : Number(totalOfflineProducts)}
                  </Span>
                </Flex>
                <Flex width="25rem" justifyContent="space-between" direction="column">
                  <Flex>
                    <img src={OutofStockIcon} alt="" />
                    <Span margin="0 0 0 .5rem" fontSize="0.8125rem" fontWeight="normal">
                      Out of Stock
                    </Span>
                  </Flex>
                  <Span color={"red"} fontSize="1.25rem" fontWeight="700">
                    {isNaN(Number(totalOutOfStockProducts))
                      ? "--"
                      : Number(totalOutOfStockProducts)}
                  </Span>
                </Flex>
              </>
            )}
          </SalesCard>
        </Flex>
        {view !== "transfer" && (
          <Flex
            width="fit-content"
            cursor="pointer"
            onClick={() => {
              dispatch(
                setHideProductNav({
                  userId: userInfo.userId as string,
                  hideProductsNav: !userPreference?.hideProductsNav,
                  appSize: userPreference?.appSize as string,
                  hideSalesNav: userPreference?.hideSalesNav as boolean,
                })
              );
            }}
            margin="10px 0px 0 0"
          >
            {!userPreference?.hideProductsNav ? (
              <img src={isFigorr ? EyeIconFigorr : EyeIcon} alt="" />
            ) : (
              <span style={{ height: "18px", width: "18px" }}>
                <svg
                  className="w-6 h-6"
                  fill="white"
                  stroke={Colors.secondaryColor}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </span>
            )}
            <p
              style={{
                color: Colors.secondaryColor,
                lineHeight: "16px",
                marginLeft: ".5rem",
                fontStyle: "italic",
              }}
            >
              Click to {userPreference?.hideProductsNav ? "hide" : "show"}{" "}
              {view === "batch" ? "batch" : "product"} details card.
            </p>
          </Flex>
        )}
      </>
    );
  };

  useEffect(() => {
    if (data) {
      setInventoryList(data?.getAllShopInventory);
      let initialSelectedState: { [key: string]: boolean } = {};
      data?.getAllShopInventory.forEach((val) => {
        initialSelectedState = { ...initialSelectedState, [val?.inventoryId!]: false };
      });
      (window as any).scrollTo(0, 0);
    }

    if (filteredData) {
      setTotalPages(
        Math.ceil(
          Number(filteredData?.getFilteredInventory?.pagination) / (isNaN(perPage) ? 10 : perPage)
        )
      );
    }
  }, [data, filteredData, perPage]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleTruncateProduct = async () => {
    if (!(await CustomConfirm("Are you sure you want to truncate product quantity?"))) {
      return;
    }

    try {
      await rpcClient
        .request("truncateInventory", {
          shopId: currentShop?.shopId,
        })
        .then(() => {
          dispatch(
            toggleSnackbarOpen({
              message: "All inventory quantities have been truncated successfully",
              color: "SUCCESS",
            })
          );
        });
      refetch();
    } catch (error) {
      dispatch(toggleSnackbarOpen(error));
    }
  };

  useEffect(() => {
    if (search) {
      getInventories({
        variables: {
          removeBatchProducts: true,
          shopId: currentShop?.shopId as string,
          limit: 10,
          searchString: search,
        },
      }).then((res) => {
        if (res.data) {
          setInventoryList(res.data.getAllShopInventory);
          let initialSelectedState: { [key: string]: boolean } = {};
          res.data.getAllShopInventory.forEach((val) => {
            initialSelectedState = { ...initialSelectedState, [val?.inventoryId!]: false };
          });
        }
      });
    }

    if (search.length < 1) {
      getInventories();
    }
  }, [search]);

  return (
    <ExpensesWrapper>
      <div style={{ height: "calc(100% - .3125rem)" }}>
        <div style={{ minHeight: navbarHeight, marginBottom: ".625rem" }}>
          <TopNav
            view={view}
            setNavBarHeight={setNavBarHeight}
            inventoryCards={inventoryCards}
            showBatch={showBatch}
            setShowBatch={setShowBatch}
            setSelectedBatchId={setSelectedBatchId}
          />
        </div>

        <Body navBarHeight={navbarHeight}>
          <Outlet
            context={{
              navbarHeight,
              handleRefetch,
              refetchInv: refetch,
              refetchFilteredData: refetchFilteredData,
              refetchBatch: refetchBatch,
              batches: batches,
              bInvPage: bInvPage,
              total: totalBatches,
              batchPage: batchPage,
              showBatch: showBatch,
              setBatches: setBatches,
              refetchAll: refetchAll,
              products: batchProducts,
              showDetails: showDetails,
              batchDetail: batchDetail,
              bInvPerPage: bInvPerPage,
              setBInvPage: setBInvPage,
              setBatchPage: setBatchPage,
              setShowBatch: setShowBatch,
              batchPerPage: batchPerPage,
              setBInvPerPage: setBInvPerPage,
              setShowDetails: setShowDetails,
              setBatchSearch: setBatchSearch,
              selectedBatchId: selectedBatchId,
              setBatchPerPage: setBatchPerPage,
              selectedBatchNo: selectedBatchNo,
              setBatchProducts: setBatchProducts,
              setBatchInvSearch: setBatchInvSearch,
              handleDeleteBatch: handleDeleteBatch,
              totalBatchInv: batchCount?.totalCount,
              setSelectedBatchNo: setSelectedBatchNo,
              setSelectedBatchId: setSelectedBatchId,
              handleRemoveBInventory: handleRemoveBInventory,
              batchInventoryCount: batchData?.getAllShopBatches.batchInventoryCount || [],
              selectedProductIds: selectedProductIds,
              setSelectedProductIds: setSelectedProductIds,
              setAdjustModalPopup: setAdjustModalPopup,
              setShowProductModal: setShowProductModal,
              setCurrentInventory: setCurrentInventory,
              adjustModalPopup: adjustModalPopup,
              currentInventory,
              handleMakeProductOnline,
              saveSelectedInventory,
              handleDeleteInventory,
              fetchingProducts,
              setSelectedOption,
              setPage,
              setPerPage,
              page,
              handleNextPage,
              handlePrevPage,
              handleTruncateProduct,
              selectedOption,
              filterOptions,
              perPage,
              totalPages,
              refetch,
              setSearch,
              inventoryList,
              search,
            }}
          />
        </Body>

        {showProductModal && (
          <ModalSidebar
            height={"100vh"}
            borderRadius="1.25rem 0 0 1.25rem"
            showProductModal={showProductModal}
          >
            <ProductDetails
              handleDeleteInventory={handleDeleteInventory}
              product={currentInventory as IInventory}
              closeProdDetails={setShowProductModal}
              handleMakeProductOnline={handleMakeProductOnline}
              setAdjustModalPopup={setAdjustModalPopup}
              saveSelectedInventory={saveSelectedInventory}
              setCurrentInventory={setCurrentInventory}
            />
          </ModalSidebar>
        )}
      </div>
    </ExpensesWrapper>
  );
};

export default Inventory;

export const useProdctPageContext = () => {
  return useOutletContext<ProductPageContextAttr>();
};
