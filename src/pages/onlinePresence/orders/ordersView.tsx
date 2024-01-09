import { FunctionComponent, useCallback, useEffect, useState } from "react";
import {
  Badge,
  Box,
  ClippedText,
  DarkText,
  FilterBtn,
  Flex,
  LightText,
} from "../style.onlinePresence";
import { TabHeader, TabHeaderProps, TabPanel } from "../components.onlinePresence";
import filterIcon from "../../../assets/Filter.svg";
import SearchInput from "../../../components/search-input/search-input";
import CustomDropdown from "../../../components/custom-dropdown/custom-dropdown";
import Calender from "../../../assets/Calendar.svg";
import dropIcon2 from "../../../assets/dropIcon2.svg";
import { useCurrentShop, useAppDispatch } from "../../../app/hooks";
import { useMutation, useQuery } from "@apollo/client";
import {
  IOrder,
  IOrderItems as IOrders,
  ITag,
  OrderItemTileProps,
  OrderListViewProps,
  OrdersViewProps,
  OrderViewTitleBarProps,
} from "../../../interfaces/order.interface";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { formatAmount, formatDate } from "../../../helper/format";
import {
  formatOrderNumber,
  getOrderTagNames,
  OrderStatusTabs,
  PaymentStatus,
} from "./utils.orders";
import { DateRangeFilters, getDates } from "../../../helper/date";
import { InView } from "react-intersection-observer";
import {
  COUNT_ORDERS,
  GET_ORDERS,
  GET_SHOP_TAGS,
  MERGE_ORDER,
} from "../../../schema/orders.schema";
import { getImageUrl } from "../../../helper/image.helper";
import _ from "lodash";
import { Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import { FilterContainer, Filter, FilterItemB } from "../../sales/style";
import RoundCancelIcon from "../../../assets/r-cancel.svg";
import OrderFilterModal from "./components/orderFilterModal";
import Checkbox from "../../../components/checkbox/checkbox";
import { Button } from "../../../components/button/Button";
import CustomConfirm from "../../../components/confirmComponent/cofirmComponent";

export const OrderTile: FunctionComponent<OrderItemTileProps> = ({
  order,
  selectedOrderItemId,
  handleChangeSelectedItemId,
}) => {
  const { orderId, orderNumber, paymentStatus, OrderItems = [], createdAt, totalAmount } = order;

  const inventoryNames = OrderItems.map((orderItem) => {
    return String(orderItem?.inventoryName);
  });
  const isPaid = paymentStatus === "PAID";

  const handleTileClick = () => {
    handleChangeSelectedItemId(orderId as string);
  };

  const tagNames = getOrderTagNames(order);

  const isActive = orderId === selectedOrderItemId;
  return (
    <Flex
      cursor="pointer"
      w="100%"
      h="max-content"
      justifyContent="space-between"
      mt="1rem"
      p=".5rem"
      onClick={handleTileClick}
      borderRadius="1rem"
      hover={{ bgColor: isActive ? "" : "#f4f6f9" }}
      bgColor={isActive ? "#DDE2E9" : "initial"}
    >
      <Flex>
        <Box borderRadius="0.75rem" h="65px" w="65px">
          <img src={getImageUrl()} alt="inventory image" height="100%" width="100%" />
        </Box>
        <Flex ml="0.9375rem" direction="column" gap="0.3125rem">
          <DarkText fontWeight="600">Order {formatOrderNumber(orderNumber as number)}</DarkText>

          <ClippedText
            width="100%"
            maxWidth="280px"
            textTransform="capitalize"
            textOverflow="ellipsis"
          >
            {inventoryNames.join(", ")}
          </ClippedText>
          <DarkText fontWeight="600" fontSize="0.75rem">
            {formatAmount(totalAmount)}
          </DarkText>
        </Flex>
      </Flex>
      <Flex direction="column" alignItems="end" justifyContent="space-between">
        <LightText fontSize="0.75rem">{formatDate(createdAt as Date)}</LightText>
        {tagNames && (
          <Text color={Colors.primaryColor} fontSize="0.625rem">
            Tag: {tagNames}
          </Text>
        )}
        <Badge fontSize="0.75rem" variant={isPaid ? "success" : "danger"}>
          {paymentStatus || "UNPAID"}
        </Badge>
      </Flex>
    </Flex>
  );
};

export const OrderViewTitleBar: FunctionComponent<OrderViewTitleBarProps> = ({
  title,
  handleDateChange,
  handleSearch,
  setShowFilterModal,
  selectedTagsList = [],
  selectedPaymentStatusIdx,
  handleRemoveFromTagsFilter,
  resetPaymentStatus,
}) => {
  const [selectedDateFilterIndex, setSelectedDateFilter] = useState(0);

  useEffect(() => {
    handleDateChange(DateRangeFilters[selectedDateFilterIndex]);
  }, [selectedDateFilterIndex]);

  return (
    <Flex w="100%" direction="column" pb=".5rem" h="max-content">
      <Flex w="100%" alignItems="center" justifyContent="space-around" gap="1rem">
        <DarkText fontWeight="600" fontSize="0.875rem">
          {title}
        </DarkText>

        <CustomDropdown
          width="130px"
          height="1.875rem"
          fontSize="0.75rem"
          borderRadius="0.75rem"
          containerColor="#fff"
          border="1px solid #F4F6F9"
          color="#8196B3"
          selected={selectedDateFilterIndex}
          setValue={setSelectedDateFilter}
          options={DateRangeFilters}
          dropdownIcon={dropIcon2}
          icon={Calender}
          margin="0 0.625rem"
        />

        <Flex gap=".5rem">
          <SearchInput
            placeholder="search"
            borderRadius="0.75rem"
            height="45px"
            width="120px"
            fontSize="0.875rem"
            handleSearch={handleSearch}
          />

          <FilterBtn onClick={() => setShowFilterModal((prev) => !prev)}>
            <img src={filterIcon} alt="filter icon" />
          </FilterBtn>
        </Flex>
      </Flex>
      <FilterContainer>
        <p>Filter Selection</p>
        <div id="filter-container">
          {selectedTagsList.map((val, i) => (
            <Filter key={i}>
              <span id="head">Tag</span>
              <FilterItemB key={i}>
                <button onClick={() => handleRemoveFromTagsFilter(val)}>
                  <img src={RoundCancelIcon} alt="" />
                </button>
                <span>{val?.tagName || ""}</span>
              </FilterItemB>
            </Filter>
          ))}
          {Number(selectedPaymentStatusIdx) > 0 && (
            <Filter>
              <span id="head">Payment</span>
              <FilterItemB>
                <button onClick={() => resetPaymentStatus()}>
                  <img src={RoundCancelIcon} alt="" />
                </button>
                <span>{PaymentStatus[selectedPaymentStatusIdx]}</span>
              </FilterItemB>
            </Filter>
          )}
        </div>
      </FilterContainer>
    </Flex>
  );
};

export const OrderListView: FunctionComponent<OrderListViewProps> = ({
  data = [],
  activeTabIndex,
  fetchNextPage,
  selectedOrderItemId,
  setSelectedOrderItemId,
  handleDateChange,
  handleSearch,
  setShowFilterModal,
  selectedTagsList,
  selectedPaymentStatusIdx,
  handleRemoveFromTagsFilter,
  resetPaymentStatus,
  mergeOrderSelectionList = {},
  handleAddToMergeOrderList,
  mergeOrder,
  cancelMergeOrderSelection,
}) => {
  const tabs = ["Pending Orders", "Processing Orders", "Completed Orders"];
  const mergeOrderSelectionCount = Object.keys(mergeOrderSelectionList).filter(
    (orderId) => mergeOrderSelectionList[orderId]
  ).length;

  return (
    <Box mt="1rem" h="80%">
      <OrderViewTitleBar
        title={tabs[activeTabIndex]}
        handleDateChange={handleDateChange}
        handleSearch={handleSearch}
        setShowFilterModal={setShowFilterModal}
        selectedTagsList={selectedTagsList}
        selectedPaymentStatusIdx={selectedPaymentStatusIdx}
        handleRemoveFromTagsFilter={handleRemoveFromTagsFilter}
        resetPaymentStatus={resetPaymentStatus}
      />
      {mergeOrderSelectionCount > 0 && (
        <Flex
          w="max-content"
          position="absolute"
          bottom="0"
          left="30%"
          p="0.625rem"
          borderRadius="0.3125rem"
          zIndex="1"
          gap="2rem"
          bgColor="#fff"
        >
          <Button
            onClick={() => cancelMergeOrderSelection()}
            label="Cancel"
            backgroundColor="transparent"
            size="sm"
            fontSize="0.75rem"
            borderRadius="0.5rem"
            borderColor="red"
            color="red"
            borderSize="2px"
            type="button"
            height="2rem"
            border
          />
          <Button
            onClick={async () => {
              if (!(await CustomConfirm("Are you sure you want to merge order?"))) return;
              mergeOrder();
            }}
            label="Merge order"
            backgroundColor={Colors.primaryColor}
            size="sm"
            fontSize="0.75rem"
            borderRadius="0.5rem"
            borderColor="transparent"
            color="#fff"
            height="2rem"
            borderSize="0px"
          />
        </Flex>
      )}
      <Box h="90%" pr="0.625rem" overflowY="scroll" position="relative">
        {data?.length !== 0 ? (
          data?.map((order: IOrders, idx: number) => (
            <Flex key={idx} alignItems="center">
              <Checkbox
                isChecked={mergeOrderSelectionList[String(order.orderId)] || false}
                onChange={({ target }) =>
                  handleAddToMergeOrderList(order.orderId as string, target.checked)
                }
                title="Click to merge order"
                color="#130F26"
                size="1.125rem"
              />
              <OrderTile
                order={order}
                key={idx}
                selectedOrderItemId={selectedOrderItemId}
                handleChangeSelectedItemId={setSelectedOrderItemId}
              />
            </Flex>
          ))
        ) : (
          <Box centerContent>
            <DarkText>No orders yet</DarkText>
          </Box>
        )}
        {(data?.length || 0) > 0 && (
          <InView
            onChange={(inView) => {
              if (inView) fetchNextPage();
            }}
          />
        )}
      </Box>
    </Box>
  );
};

export default function OrdersView({
  selectedOrderId,
  itemList,
  setItemList,
  setSelectedOrderItemId,
  updateCount,
  syncUpdateCount,
  activeTabIndex,
  setActiveTabIndex,
}: OrdersViewProps) {
  const handleChangeTab = (val: number) => setActiveTabIndex(val);

  const [page, setPage] = useState(1);
  const [searchString, setSearchString] = useState("");
  const [from, setFrom] = useState(new Date(0));
  const [to, setTo] = useState(new Date());
  const [mergeOrderSelectionList, setMergeOrderSelectionList] = useState<Record<string, boolean>>(
    {}
  );

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [displayAllTags, setDisplayAllTags] = useState(false);
  const [selectedPaymentStatusIdx, setSelectedPaymentStatusIdx] = useState(0);
  const [searchTagsQuery, setSearchTagsQuery] = useState("");
  const [selectedTagsList, setSelectedTagsList] = useState<ITag[]>([]);

  const LIMIT = 10;
  const stepName = OrderStatusTabs[activeTabIndex];
  const currentShop = useCurrentShop();
  const dispatch = useAppDispatch();

  const resetScroll = () => {
    setItemList([]);
    setPage(1);
  };

  useEffect(() => {
    resetScroll();
  }, [
    from,
    searchString,
    activeTabIndex,
    currentShop,
    syncUpdateCount,
    selectedPaymentStatusIdx,
    selectedTagsList,
  ]);

  const {
    data,
    refetch: refetchList,
    loading,
  } = useQuery<{ getOrders: { total: number; records: IOrder[] } }>(GET_ORDERS, {
    variables: {
      shopId: currentShop?.shopId,
      searchString,
      stepName,
      page,
      limit: LIMIT,
      from,
      to,
      paymentStatus: PaymentStatus[selectedPaymentStatusIdx],
      tagIds: selectedTagsList.map((tag) => tag?.tagId),
    },
    onCompleted(result) {
      const state: IOrder[] = result.getOrders.records || [];
      setItemList((prev: IOrder[]) => _.uniqBy([...prev, ...state], "orderId"));
    },
    fetchPolicy: "network-only",
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const hasMore = Number(data?.getOrders?.total) > Number(itemList?.length);
  const fetchNextPage = () => {
    if (!hasMore) return;

    setPage((p) => p + 1);
  };

  const handleDateChange = useCallback((selectedDate: string) => {
    const result = getDates(selectedDate);
    setFrom(result?.from || new Date());
    setTo(result?.to || new Date());
    refetchList();
  }, []);

  const handleAddToTagsFilter = (tag: ITag) => {
    setSelectedTagsList(_.uniqBy([...selectedTagsList, tag], "tagId"));
    setSearchTagsQuery("");
    setDisplayAllTags(false);
  };

  const handleRemoveFromTagsFilter = (clickedTag: ITag) => {
    const newList = selectedTagsList.filter((tag) => tag?.tagId !== clickedTag?.tagId);
    setSelectedTagsList(newList);
  };

  const handleClearFilter = () => {
    setSearchTagsQuery("");
    setSelectedTagsList([]);
    setSelectedPaymentStatusIdx(0);
  };

  const cancelMergeOrderSelection = () => setMergeOrderSelectionList({});

  const [mergeOrder] = useMutation(MERGE_ORDER, {
    variables: {
      shopId: currentShop?.shopId,
      orderIds: Object.keys(mergeOrderSelectionList).filter(
        (orderId) => mergeOrderSelectionList[orderId]
      ),
    },
    onCompleted() {
      cancelMergeOrderSelection();
      dispatch(
        toggleSnackbarOpen({
          message: "Orders merge successfully",
          color: "SUCCESS",
        })
      );
      setItemList([]);
      setPage(1);
      refetchList();
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

  const resetPaymentStatus = () => setSelectedPaymentStatusIdx(0);

  const handleAddToMergeOrderList = useCallback((orderId: string, isChecked: boolean) => {
    setMergeOrderSelectionList((prevList) => ({
      ...prevList,
      [orderId]: isChecked,
    }));
  }, []);

  const { data: pendingOrderItemsCount, refetch: refetchPendingCount } = useQuery<{
    getOrdersCount: number;
  }>(COUNT_ORDERS, {
    variables: {
      shopId: currentShop?.shopId,
      stepName: "PENDING",
      from,
      to,
    },
    fetchPolicy: "cache-and-network",
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const { data: processingOrderItemsCount, refetch: refetchProcessingCount } = useQuery<{
    getOrdersCount: number;
  }>(COUNT_ORDERS, {
    variables: {
      shopId: currentShop?.shopId,
      stepName: "PROCESSING",
      from,
      to,
    },
    fetchPolicy: "cache-and-network",
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const { data: shopTagsData } = useQuery<{ getShopTags: ITag[] }>(GET_SHOP_TAGS, {
    variables: {
      shopId: currentShop?.shopId,
      searchString: searchTagsQuery,
    },
  });

  useEffect(() => {
    refetchPendingCount();
    refetchProcessingCount();
  }, [updateCount]);

  const headers: TabHeaderProps["tabHeaders"] = [
    {
      name: "pending",
      notificationCount: pendingOrderItemsCount?.getOrdersCount || 0,
    },
    {
      name: "processing",
      notificationCount: processingOrderItemsCount?.getOrdersCount || 0,
    },
    {
      name: "completed",
    },
  ];

  return (
    <Box w="100%" p="0.625rem" h="620px" minH="600px">
      <TabHeader
        tabHeaders={headers}
        activeTabIndex={activeTabIndex}
        handleChange={handleChangeTab}
      />
      <TabPanel
        activeTabIndex={activeTabIndex}
        tabPanels={[1, 2, 3].map(() => OrderListView)}
        props={{
          activeTabIndex,
          loading,
          data: itemList,
          selectedOrderItemId: selectedOrderId,
          setSelectedOrderItemId,
          handleDateChange,
          fetchNextPage,
          handleSearch: setSearchString,
          setShowFilterModal,
          selectedTagsList,
          selectedPaymentStatusIdx,
          handleRemoveFromTagsFilter,
          resetPaymentStatus,
          handleAddToMergeOrderList,
          mergeOrderSelectionList,
          mergeOrder,
          cancelMergeOrderSelection,
        }}
      />
      {showFilterModal && (
        <OrderFilterModal
          showFilterModal={showFilterModal}
          setShowFilterModal={setShowFilterModal}
          displayAllTags={displayAllTags}
          setDisplayAllTags={setDisplayAllTags}
          selectedPaymentStatusIdx={selectedPaymentStatusIdx}
          setSelectedPaymentStatusIdx={setSelectedPaymentStatusIdx}
          selectedTagsList={selectedTagsList}
          setSearchTagsQuery={setSearchTagsQuery}
          AllShopTags={shopTagsData?.getShopTags || []}
          handleClearFilter={handleClearFilter}
          handleAddToTagsFilter={handleAddToTagsFilter}
          handleRemoveFromTagsFilter={handleRemoveFromTagsFilter}
        />
      )}
    </Box>
  );
}
