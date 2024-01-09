import React, { FunctionComponent, useEffect, useState } from "react";
import { ProductsViewProps } from "../../../../interfaces/order.interface";
import { useAppDispatch, useCurrentShop } from "../../../../app/hooks";
import { useLazyQuery, useQuery } from "@apollo/client";
import { TabHeader, TabHeaderProps, TabPanel } from "../../components.onlinePresence";
import { Box } from "../../style.onlinePresence";
import { toggleSnackbarOpen } from "../../../../app/slices/snacbar";
import { IInventory } from "../../../../interfaces/inventory.interface";
import { GET_ALL_SHOP_INVENTORY, SEARCH_INVENTORY } from "../../../../schema/inventory.schema";
import ProductViewList from "./productViewList";

export const ProductListView: FunctionComponent<ProductsViewProps> = ({
  activeTabIndex,
  handleSearch,
  productData,
  productTotal,
  setPage,
  page,
  refetch,
  setPerPage,
  perPage,
  setTotalPages,
  totalPages,
  setSearch,
}) => {
  const inventoryList = productData![activeTabIndex as number] || [];

  return (
    <Box mt="0.5rem" h="100%">
      <Box h="100%" pr="0.625rem" overflowY="scroll" position="relative">
        <Box h="100%">
          <ProductViewList
            inventoryList={inventoryList}
            productTotal={productTotal!}
            handleSearch={handleSearch}
            setPage={setPage}
            page={page}
            refetch={refetch}
            setPerPage={setPerPage}
            perPage={perPage}
            setTotalPages={setTotalPages}
            totalPages={totalPages}
            setSearch={setSearch}
          />
        </Box>
      </Box>
    </Box>
  );
};

const ProductsView = ({
  activeTabIndex,
  setActiveTabIndex,
}: {
  activeTabIndex: number;
  setActiveTabIndex: (val: number) => void;
}) => {
  const handleChangeTab = (val: number) => setActiveTabIndex(val);

  const [searchString, setSearchString] = useState("");

  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(8);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState<string>("");

  const currentShop = useCurrentShop();
  const dispatch = useAppDispatch();

  const { data: allProducts, refetch: refetchAll } = useQuery<{
    getAllShopInventory: {
      inventories: [IInventory];
      totalInventory: number;
      pagination: number;
      totalProductQuantity: number;
      totalInventoryValue: number;
    };
  }>(GET_ALL_SHOP_INVENTORY, {
    variables: {
      shopId: currentShop?.shopId,
      limit: isNaN(perPage) ? 8 : perPage,
      page: page < 1 ? 1 : page,
    },
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const { data: trackableProducts, refetch: refetchTrackable } = useQuery<{
    getAllShopInventory: {
      inventories: [IInventory];
      totalInventory: number;
      pagination: number;
      totalProductQuantity: number;
      totalInventoryValue: number;
    };
  }>(GET_ALL_SHOP_INVENTORY, {
    variables: {
      shopId: currentShop?.shopId,
      isProductTrackable: true,
      limit: isNaN(perPage) ? 8 : perPage,
      page: page < 1 ? 1 : page,
    },
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const { data: nonTrackableProducts, refetch: refetchNonTrackable } = useQuery<{
    getAllShopInventory: {
      inventories: [IInventory];
      pagination: number;
      totalInventory: number;
      totalProductQuantity: number;
      totalInventoryValue: number;
    };
  }>(GET_ALL_SHOP_INVENTORY, {
    variables: {
      shopId: currentShop?.shopId,
      isProductTrackable: false,
      limit: isNaN(perPage) ? 8 : perPage,
      page: page < 1 ? 1 : page,
    },
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const [searchInventory] = useLazyQuery<{ searchUserInventory: [IInventory] }>(SEARCH_INVENTORY, {
    variables: {
      searchString: search,
    },
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const [productData, setProductData] = useState([
    allProducts?.getAllShopInventory?.inventories || [],
    trackableProducts?.getAllShopInventory?.inventories || [],
    nonTrackableProducts?.getAllShopInventory?.inventories || [],
  ]);

  const refetch = () => {
    refetchAll();
    refetchTrackable();
    refetchNonTrackable();
    setProductData([
      allProducts?.getAllShopInventory?.inventories || [],
      trackableProducts?.getAllShopInventory?.inventories || [],
      nonTrackableProducts?.getAllShopInventory?.inventories || [],
    ]);
  };

  useEffect(() => {
    setProductData([
      allProducts?.getAllShopInventory?.inventories || [],
      trackableProducts?.getAllShopInventory?.inventories || [],
      nonTrackableProducts?.getAllShopInventory?.inventories || [],
    ]);
  }, [allProducts, trackableProducts, nonTrackableProducts]);

  useEffect(() => {
    if (search.length <= 0) {
      refetch();
    }

    if (search) {
      searchInventory({
        variables: {
          searchString: search,
        },
      }).then((res) => {
        if (res.data) {
          const updatedProductData = [...productData];
          updatedProductData[activeTabIndex as number] =
            res.data.searchUserInventory.length >= 1
              ? res.data.searchUserInventory
              : productData[activeTabIndex as number];
          setProductData(updatedProductData);
        }
      });
    }
  }, [search]);

  const headers: TabHeaderProps["tabHeaders"] = [
    {
      name: "All Products",
      //   notificationCount: pendingOrderItemsCount?.getOrdersCount || 0,
    },
    {
      name: "Trackable",
      //   notificationCount: processingOrderItemsCount?.getOrdersCount || 0,
    },
    {
      name: "non-Trackable",
    },
  ];

  return (
    <Box w="100%" p="0.625rem" h="100%" minH="600px">
      <TabHeader
        tabHeaders={headers}
        activeTabIndex={activeTabIndex}
        handleChange={handleChangeTab}
      />
      <TabPanel
        activeTabIndex={activeTabIndex}
        tabPanels={[1, 2, 3].map(() => ProductListView)}
        props={{
          activeTabIndex,
          handleSearch: setSearchString,
          productData: productData,
          productTotal: allProducts?.getAllShopInventory?.pagination || 0,
          setPage,
          page,
          refetch,
          setPerPage,
          perPage,
          setTotalPages,
          totalPages,
          setSearch,
        }}
      />
    </Box>
  );
};

export default ProductsView;
