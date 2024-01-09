/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable comma-dangle */
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import TopNav from "../../components/top-nav/top-nav";
import ItemsPage from "./items-page/items-page";
import ReceiptPage from "./receipt-page/receipt-page";
import dropIcon from "../../assets/dropIcon2.svg";
import { Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useLazyQuery, useQuery } from "@apollo/client";
import { IAllReceipt, IReceipt } from "../../interfaces/receipt.interface";
import { GET_ALL_SALES_OVERVIEW_COUNT, GET_ALL_SALES_RECEIPT } from "../../schema/receipt.schema";
import { formatAmountIntl } from "../../helper/format";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { getDates, resetDateHrs, setHours } from "../../helper/date";
import CustomDropdown from "../../components/custom-dropdown/custom-dropdown";
import { hasPermission, syncTotalTableCount } from "../../helper/comparisons";
import CustomDate from "../../components/date-picker/customDatePicker";
import { Button } from "../../components/button/Button";
import { getUserPermissions } from "../../app/slices/roles";
import {
  FilterModal,
  ListItem,
  FilterModalContainer,
  FilterDropdown,
  SelectionList,
  FilterItem,
  FilterByCont,
  ResultContainer,
  ProductFilterCard,
} from "./style";
import Checkbox from "../../components/checkbox/checkbox";
import { GET_ALL_SHOP_INVENTORY, GET_FILTERED_INVENTORY_OPTIONS } from "../../schema/inventory.schema";
import { IInventory } from "../../interfaces/inventory.interface";
import { UsersAttr } from "../../interfaces/user.interface";
import cancel from "../../assets/cancel.svg";
import roundCancelIcon from "../../assets/r-cancel.svg";
import { getInventoryPrice } from "../../utils/helper.utils";
import _ from "lodash";
import { GET_ALL_USER } from "../../schema/auth.schema";
import {
  setFilterByDiscountSales,
  setPaymentFilter,
  setFilterByRefundSales,
  setProductFilterList,
  setProductIdFilterList,
  setProductSearch,
  setReceiptNumber,
  setUserFilterList,
  setUserIdFilterList,
} from "../../app/slices/salesFilter";
import { Body, ExpensesWrapper } from "../expenses/style";
import { setIsNoProductModal } from "../../app/slices/accountLock";

export interface IFilteredDate {
  from: Date;
  to: Date;
}

const Sales: FunctionComponent = () => {
  const [selectedDate, setSelectedDate] = useState(0);
  const {
    user: userInfo,
    shops: { currentShop },
    salesFilter: {
      productIdFilterList,
      productFilterList,
      userIdFilterList,
      userFilterList,
      selectedPayment,
      receiptNumber,
      paymentFilter,
      filterByDiscountSales,
      filterByRefundSales,
      productSearch,
    },
  } = useAppSelector((state) => state);
  const userPermissions = useAppSelector(getUserPermissions);
  const isMerchant = userInfo?.userId === currentShop?.userId;
  const shouldViewAllSales = hasPermission("VIEW_ALL_SALES", userPermissions);
  const shouldViewSales = hasPermission("VIEW_SALE", userPermissions);
  const dateOptions =
    isMerchant || shouldViewAllSales
      ? [
        "Today",
        "Yesterday",
        "This week",
        "Last week",
        "This month",
        "Last month",
        "This year",
        "All Entries",
        "Date range",
      ]
      : ["Today"];

  const today = new Date();
  const todayStart = new Date(today);
  const todayEnd = new Date(today);
  const initialDateRange = setHours(todayStart, todayEnd);
  const [filteredDate, setFilteredDate] = useState<IFilteredDate>(initialDateRange);
  const [dateRange, setDateRange] = useState<IFilteredDate>(filteredDate as IFilteredDate);

  const [receiptButtonState, setReceiptButtonState] = useState<boolean>(true);
  const [listButtonState, setListButtonState] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [allReceipts, setAllReceipts] = useState<IReceipt[] | undefined>([]);
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAmounts, setTotalAmounts] = useState<{
    Pos: number;
    Cash: number;
    Transfer: number;
    totalProfit: number;
    totalDiscount: number;
    totalCredit: number;
    totalSales: number;
    totalRefundAmount: number;
    totalSurplus: number;
  }>({
    Pos: 0,
    Cash: 0,
    Transfer: 0,
    totalProfit: 0,
    totalDiscount: 0,
    totalCredit: 0,
    totalSales: 0,
    totalRefundAmount: 0,
    totalSurplus: 0,
  });

  const [navbarHeight, setNavBarHeight] = useState<number>(0);
  const dispatch = useAppDispatch();

  const syncTableUpdateCount = useAppSelector((state) =>
    syncTotalTableCount(state.shops.syncTableUpdateCount, [
      "Receipt",
      "Sales",
      "Inventory",
      "Supplies",
      "InventoryQuantity",
    ])
  );

  const [getFilteredInventories, { data: productList }] = useLazyQuery<{
    getFilteredInventory: {
      totalInventory: number;
    };
  }>(GET_FILTERED_INVENTORY_OPTIONS, {
    variables: {
      removeBatchProducts: true,
      shopId: currentShop?.shopId,
    },
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const [getInventories, { data: searchedData, refetch }] = useLazyQuery<{
    getAllShopInventory: [IInventory];
  }>(GET_ALL_SHOP_INVENTORY, {
    variables: {
      removeBatchProducts: true,
      shopId: currentShop?.shopId as string,
      limit: 10,
      searchString: productSearch,
    },
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  useEffect(() => {
    if (Number(productList?.getFilteredInventory?.totalInventory) < 1) {
      getFilteredInventories();
    }
    if (Number(productList?.getFilteredInventory?.totalInventory) <= 0) {
      dispatch(setIsNoProductModal(true));
    }
  }, [productList]);

  const [getAllSalesReceipt, { data, refetch: refetchAllSalesReceipt }] = useLazyQuery<{
    getAllSalesReceipt: IAllReceipt;
  }>(GET_ALL_SALES_RECEIPT, {
    variables: {
      shopId: currentShop?.shopId,
      page,
      limit: perPage,
      from: filteredDate?.from.toString(),
      to: filteredDate?.to.toString(),
      paymentMethods: paymentFilter,
      userIds: userIdFilterList,
      receiptNumberSearch: receiptNumber,
      isDiscountSales: filterByDiscountSales,
      isRefundedSales: filterByRefundSales,
    },
    fetchPolicy: "cache-and-network",
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const [getAllSalesOverviewCount, { data: overviewData, refetch: refetchAllSalesOverviewCount }] =
    useLazyQuery<{
      getAllSalesOverviewCount: IAllReceipt;
    }>(GET_ALL_SALES_OVERVIEW_COUNT, {
      variables: {
        shopId: currentShop?.shopId,
        page,
        limit: perPage,
        from: filteredDate?.from.toString(),
        to: filteredDate?.to.toString(),
        paymentMethods: paymentFilter,
        userIds: userIdFilterList,
        receiptNumberSearch: receiptNumber,
        isDiscountSales: filterByDiscountSales,
        isRefundedSales: filterByRefundSales,
      },
      fetchPolicy: "cache-and-network",
      onError(error) {
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      },
    });

  useEffect(() => {
    getAllSalesReceipt();
    getAllSalesOverviewCount();
  }, [syncTableUpdateCount]);

  useEffect(() => {
    if (data) {
      setAllReceipts(data?.getAllSalesReceipt?.receipts);
      setTotalPages(
        Math.ceil((data?.getAllSalesReceipt?.totalReceipt ?? 1) / (isNaN(perPage) ? 10 : perPage))
      );
    }

    if (overviewData) {
      setTotalAmounts({
        Pos: Number(overviewData?.getAllSalesOverviewCount?.totalPos || 0),
        Cash: Number(overviewData?.getAllSalesOverviewCount?.totalCash || 0),
        Transfer: Number(overviewData?.getAllSalesOverviewCount?.totalTransfer || 0),
        totalProfit: Number(overviewData?.getAllSalesOverviewCount?.totalProfit),
        totalDiscount: Number(overviewData?.getAllSalesOverviewCount?.totalDiscount || 0),
        totalCredit: Number(overviewData?.getAllSalesOverviewCount?.totalCredit),
        totalSales: Number(overviewData?.getAllSalesOverviewCount?.totalSales),
        totalRefundAmount: Number(overviewData?.getAllSalesOverviewCount?.totalRefundAmount),
        totalSurplus: Number(overviewData?.getAllSalesOverviewCount?.totalSurplus || 0),
      });
    }
  }, [data, page, syncTableUpdateCount, overviewData]);

  const handleFilterByDate = (currentDate: number) => {
    setSelectedDate(currentDate);
    let filterData = getDates(dateOptions[currentDate]);
    if (currentDate === 8) filterData = { from: resetDateHrs(dateRange.from), to: dateRange.to };
    setFilteredDate(filterData as IFilteredDate);

    refetchAllSalesReceipt({
      shopId: currentShop?.shopId,
      page,
      limit: perPage,
      from: filterData?.from.toString(),
      to: filterData?.to.toString(),
    });

    refetchAllSalesOverviewCount({
      shopId: currentShop?.shopId,
      page,
      limit: perPage,
      from: filterData?.from.toString(),
      to: filterData?.to.toString(),
    });
  };

  const handleDropDown = (val: number) => {
    if (val !== 8) {
      return handleFilterByDate(val);
    } else {
      setSelectedDate(8);
    }
  };

  const handleApplyFilter = () => {
    if (!data?.getAllSalesReceipt?.receipts?.length) {
      dispatch(toggleSnackbarOpen("No result for this filter"));
    }
    setShowFilterModal(false);
  };

  const [showProduct, setShowProduct] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const paymentMethodOption = ["Cash", "Pos", "Transfer"];

  const handleClearFilter = () => {
    dispatch(setPaymentFilter([]));
    dispatch(setProductFilterList([]));
    dispatch(setProductIdFilterList([]));
    dispatch(setUserFilterList([]));
    dispatch(setUserIdFilterList([]));
    dispatch(setReceiptNumber(""));
    dispatch(setFilterByDiscountSales(false));
    dispatch(setFilterByRefundSales(false));
    setShowFilterModal(false);
  };

  const { data: allUserData } = useQuery<{
    getAllUsers: UsersAttr[];
  }>(GET_ALL_USER, {
    variables: {
      shopId: currentShop?.shopId,
    },
    skip: !currentShop?.shopId,
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const addPaymentFilter = (index: number) => {
    const filterCopy: string[] = [...paymentFilter];
    const position = filterCopy.indexOf(paymentMethodOption[index]);
    if (position === -1) {
      filterCopy.push(paymentMethodOption[index]);
    }
    dispatch(setPaymentFilter(filterCopy));
  };

  const removePaymentMethod = (method: string) => {
    const filterCopy: string[] = [...paymentFilter];
    const position = filterCopy.indexOf(method);
    filterCopy.splice(position, 1);
    dispatch(setPaymentFilter(filterCopy));
  };

  const handleAddProductFilter = (inventory: IInventory) => {
    setShowProduct(false);
    let canAddName = false;
    const copyProductfilter = [...productIdFilterList];
    if (!copyProductfilter.includes(inventory.inventoryId ?? "")) {
      copyProductfilter.push(inventory.inventoryId ?? "");
      canAddName = true;
    }
    dispatch(setProductIdFilterList(copyProductfilter));

    const copyProductIdfilter = [...productFilterList];
    if (canAddName) {
      copyProductIdfilter.push(inventory.inventoryName ?? "");
    }
    dispatch(setProductFilterList(copyProductIdfilter));
  };

  const handleRemoveProductFilter = (idx: number) => {
    const copyIdProductList = [...productIdFilterList];
    copyIdProductList.splice(idx, 1);
    dispatch(setProductIdFilterList(copyIdProductList));
    const copyOld = [...productFilterList];
    copyOld.splice(idx, 1);
    dispatch(setProductFilterList(copyOld));
  };

  const handleAddUserFilter = (user: UsersAttr) => {
    setShowUser(false);
    let canAddName = false;
    const copyOld = [...userIdFilterList];
    if (!copyOld.includes(user?.userId as string)) {
      copyOld.push(user?.userId as string);
      canAddName = true;
    }
    dispatch(setUserIdFilterList(copyOld));
    const userfilterOld = [...userFilterList];
    if (canAddName) {
      userfilterOld.push(user?.fullName as string);
    }
    dispatch(setUserFilterList(userfilterOld));
  };

  const handleRemoveUserFilter = (idx: number) => {
    const copyOld = [...userIdFilterList];
    copyOld.splice(idx, 1);
    dispatch(setUserIdFilterList(copyOld));
    const copyOfUserFilterList = [...userFilterList];
    copyOfUserFilterList.splice(idx, 1);
    dispatch(setUserFilterList(copyOfUserFilterList));
  };

  useEffect(() => {
    if (showProduct) {
      getInventories({
        variables: {
          removeBatchProducts: true,
          shopId: currentShop?.shopId as string,
          limit: isNaN(perPage) ? 10 : perPage,
          page: page < 1 ? 1 : page,
          searchString: productSearch,
        },
      });
    }
  }, [showProduct, productSearch]);

  const ItemsPageComponent = useMemo(() => {
    return (
      <ItemsPage
        navbarHeight={navbarHeight}
        showFilterModal={showFilterModal}
        setShowFilterModal={setShowFilterModal}
        filteredDate={filteredDate}
        listButtonState={listButtonState}
        receiptButtonState={receiptButtonState}
        setListButtonState={setListButtonState}
        setReceiptButtonState={setReceiptButtonState}
      />
    );
  }, [filteredDate, showFilterModal, listButtonState, receiptButtonState]);

  const ReceiptPageComponent = useMemo(() => {
    return (
      <ReceiptPage
        navbarHeight={navbarHeight}
        allReceipts={allReceipts}
        showFilterModal={showFilterModal}
        setShowFilterModal={setShowFilterModal}
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        perPage={perPage}
        setPerPage={setPerPage}
        listButtonState={listButtonState}
        receiptButtonState={receiptButtonState}
        setListButtonState={setListButtonState}
        setReceiptButtonState={setReceiptButtonState}
      />
    );
  }, [filteredDate, allReceipts, listButtonState, receiptButtonState]);

  const getStartDate = (date: Date) => {
    const dateWithSeconds = setHours(date, date);
    setDateRange({ from: dateWithSeconds?.from, to: dateRange?.to });
  };

  const getEndDate = (date: Date) => {
    const dateWithSeconds = setHours(date, date);
    setDateRange({ to: dateWithSeconds.to, from: dateRange?.from });
  };

  return (
    <ExpensesWrapper>
      <div>
        <TopNav
          listButtonState={listButtonState}
          receiptButtonState={receiptButtonState}
          setListButtonState={setListButtonState}
          setReceiptButtonState={setReceiptButtonState}
          header="Sales"
          handleDropDown={handleDropDown}
          handleFilterByDate={handleFilterByDate}
          setShowFilterModal={setShowFilterModal}
          selectedDate={selectedDate}
          dateOptions={dateOptions}
          dateRange={dateRange}
          getStartDate={getStartDate}
          getEndDate={getEndDate}
          shouldViewSales={shouldViewSales}
          totalAmounts={totalAmounts}
          setNavBarHeight={setNavBarHeight}
        />
      </div>
      <Body padding="0" bgColor="transparent" navBarHeight={navbarHeight}>
        {receiptButtonState && <>{ReceiptPageComponent}</>}
        {listButtonState && <>{ItemsPageComponent}</>}

        {showFilterModal && (
          <FilterModalContainer>
            <FilterModal>
              <Flex padding="0 0 1.25rem 0" fontSize="1.2rem" alignItems="center">
                <button id="cancel-btn" onClick={() => setShowFilterModal(false)}>
                  <img src={cancel} alt="" />
                </button>
                <h3>Sales Filter</h3>
              </Flex>
              {!showProduct && !showUser && (
                <>
                  {!receiptButtonState && (
                    <>
                      <label>Filter by products</label>
                      <FilterDropdown onClick={() => setShowProduct(true)}>
                        <SelectionList>
                          {productFilterList.map((val, i) => (
                            <FilterItem key={i}>
                              <button onClick={() => handleRemoveProductFilter(i)}>
                                <img src={roundCancelIcon} alt="" />
                              </button>
                              <span>{val}</span>
                            </FilterItem>
                          ))}
                        </SelectionList>
                        <button id="dropdown" onClick={() => setShowProduct(true)}>
                          <img src={dropIcon} alt="" />
                        </button>
                      </FilterDropdown>
                    </>
                  )}
                  <label>Filter by users</label>
                  <FilterDropdown onClick={() => setShowUser(true)}>
                    <SelectionList>
                      {userFilterList.map((val, i) => (
                        <FilterItem key={i}>
                          <button onClick={() => handleRemoveUserFilter(i)}>
                            <img src={roundCancelIcon} alt="" />
                          </button>
                          <span>{val}</span>
                        </FilterItem>
                      ))}
                    </SelectionList>
                    <button id="dropdown" onClick={() => setShowUser(true)}>
                      <img src={dropIcon} alt="" />
                    </button>
                  </FilterDropdown>
                  <label>Filter by payment method</label>
                  <CustomDropdown
                    width="100%"
                    height="2.5rem"
                    fontSize=".875rem"
                    borderRadius=".75rem"
                    containerColor="#F4F6F9"
                    color="#8196B3"
                    selected={selectedPayment}
                    setValue={addPaymentFilter}
                    options={paymentMethodOption}
                    dropdownIcon={dropIcon}
                    placeholder="-:Select payment method:-"
                    margin="0"
                    padding=".625rem"
                  />
                  <SelectionList>
                    {paymentFilter.map((val, i) => (
                      <FilterItem key={i}>
                        <button onClick={() => removePaymentMethod(val)}>
                          <img src={roundCancelIcon} alt="" />
                        </button>
                        <span>{val}</span>
                      </FilterItem>
                    ))}
                  </SelectionList>
                  <label>Filter by date</label>
                  {(isMerchant || shouldViewAllSales) && (
                    <div
                      style={{
                        display: "flex",
                        marginBottom: "0.635rem",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <CustomDropdown
                        width="100%"
                        height="2.5rem"
                        margin="0 0 .625rem"
                        fontSize=".875rem"
                        borderRadius=".75rem"
                        containerColor="#FFF"
                        color="#8196B3"
                        selected={selectedDate}
                        setValue={(val) => handleDropDown(val)}
                        options={dateOptions}
                        dropdownIcon={dropIcon}
                        boxShadow="0px 4px 1.875rem rgba(140, 157, 181, 0.08)"
                      />

                      {selectedDate === 8 && (
                        <Flex
                          alignItems="center"
                          justifyContent="space-between"
                          direction="column"
                          gap="1rem"
                          margin="0 0 0 2rem"
                        >
                          <Flex
                            width="100%"
                            alignItems="center"
                            justifyContent="space-between"
                            gap=".3125rem"
                          >
                            <Span>From:- </Span>
                            <CustomDate
                              height="2.1875rem"
                              startDate={dateRange?.from}
                              setStartDate={getStartDate}
                            />
                          </Flex>
                          <Flex
                            width="100%"
                            alignItems="center"
                            justifyContent="space-between"
                            gap=".3125rem"
                          >
                            <Span>To:- </Span>
                            <CustomDate
                              height="2.1875rem"
                              startDate={dateRange?.to}
                              setStartDate={getEndDate}
                            />
                          </Flex>
                          <Button
                            label="Apply"
                            onClick={() => handleFilterByDate(8)}
                            backgroundColor="#FFBE62"
                            size="md"
                            height="2.1875rem"
                            fontSize="1rem"
                            borderRadius=".75rem"
                            width="100%"
                            color="#fff"
                            borderColor="transparent"
                            borderSize="0px"
                          />
                        </Flex>
                      )}
                    </div>
                  )}
                  <FilterByCont>
                    <ListItem>
                      <Checkbox
                        isChecked={filterByDiscountSales}
                        color="#130F26"
                        size=""
                        onChange={() => dispatch(setFilterByDiscountSales(!filterByDiscountSales))}
                      />
                      <p>Show only &quot;Discounted sales&quot;</p>
                    </ListItem>
                    {receiptButtonState && (
                      <ListItem>
                        <Checkbox
                          isChecked={filterByRefundSales}
                          color="#130F26"
                          size=""
                          onChange={() => dispatch(setFilterByRefundSales(!filterByRefundSales))}
                        />
                        <p>Show only &quot;Refunded sales&quot;</p>
                      </ListItem>
                    )}
                    {/* show oncredit sales */}
                  </FilterByCont>
                  <Button
                    label="Apply Filter"
                    onClick={handleApplyFilter}
                    backgroundColor="#FFBE62"
                    size="md"
                    color="#fff"
                    borderColor="transparent"
                    borderRadius=".75rem"
                    borderSize="0px"
                    fontSize=".875rem"
                    width="100%"
                    height="2.5rem"
                    margin="4px 0"
                  />
                  <Button
                    label="Clear all Selection"
                    onClick={handleClearFilter}
                    backgroundColor="#607087"
                    size="md"
                    color="#fff"
                    borderColor="transparent"
                    borderRadius=".75rem"
                    borderSize="0px"
                    fontSize=".875rem"
                    width="100%"
                    height="2.5rem"
                    margin="4px 0"
                  />
                </>
              )}
              {showProduct && !showUser && (
                <>
                  <input
                    placeholder="Search products"
                    style={{
                      borderRadius: ".75rem",
                      fontSize: ".875rem",
                      height: "2.5rem",
                      width: "100%",
                      background: "#f4f6f9",
                      paddingInline: "0.635rem",
                    }}
                    type="text"
                    name=""
                    onChange={_.debounce(
                      ({ target }: React.ChangeEvent<HTMLInputElement>) =>
                        setProductSearch(target.value),
                      500
                    )}
                  />
                  <button
                    style={{
                      marginTop: "1.25rem",
                      fontSize: "1rem",
                      color: "white",
                      padding: ".375rem 0.635rem",
                      borderRadius: ".375rem",
                      border: "none",
                      backgroundColor: "#ffbe62",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowProduct(false)}
                  >
                    back
                  </button>
                  <ResultContainer>
                    {searchedData?.getAllShopInventory.map((inventory, idx) => (
                      <ProductFilterCard
                        key={idx}
                        onClick={() => handleAddProductFilter(inventory)}
                      >
                        <p>{inventory.inventoryName}</p>
                        <span>{formatAmountIntl(undefined, getInventoryPrice(inventory))}</span>
                      </ProductFilterCard>
                    ))}
                  </ResultContainer>
                </>
              )}
              {!showProduct && showUser && (
                <>
                  <button
                    style={{
                      marginTop: "1.25rem",
                      fontSize: "1rem",
                      color: "white",
                      padding: ".375rem 0.635rem",
                      borderRadius: ".375rem",
                      border: "none",
                      backgroundColor: "#ffbe62",
                      cursor: "pointer",
                    }}
                    onClick={() => setShowUser(false)}
                  >
                    back
                  </button>
                  <ResultContainer>
                    {allUserData?.getAllUsers?.map((user, idx) => (
                      <ProductFilterCard key={idx} onClick={() => handleAddUserFilter(user)}>
                        <p>{user.fullName}</p>
                      </ProductFilterCard>
                    ))}
                  </ResultContainer>
                </>
              )}
            </FilterModal>
          </FilterModalContainer>
        )}
      </Body>
    </ExpensesWrapper>
  );
};

export default Sales;
