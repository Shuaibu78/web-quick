/* eslint-disable indent */
/* eslint-disable comma-dangle */
/* eslint-disable max-len */
import { FunctionComponent, useEffect, useState } from "react";
import Swap from "../../assets/Swap.svg";
import Graph from "../../assets/Graph.svg";
import ChevRight from "../../assets/chevRight.svg";
import Globe from "../../assets/globe.svg";
import ODocumentIcon from "../../assets/ODocument.svg";
import FigorrODocumentIcon from "../../assets/FigorrODocument.svg";
import TopNav from "../../components/top-nav/top-nav";
import { Container, Sales, OrderItem, SalesItem, TEmpty } from "./style";
import CalenderIcon from "../../assets/calender.svg";
import LineChart from "../../components/line-chart/line-chart";
import { useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { formatAmountIntl } from "../../helper/format";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { getDates, resetDateHrs, setHours } from "../../helper/date";
import { hasPermission, syncTotalTableCount } from "../../helper/comparisons";
import { Flex, Span, Text } from "../../GlobalStyles/CustomizableGlobal.style";
import { getUserPermissions } from "../../app/slices/roles";
import { Colors } from "../../GlobalStyles/theme";
import { Counter, CustomCont } from "../sales/style";
import { getImageUrl } from "../../helper/image.helper";
import { useNavigate } from "react-router";
import emptyImage from "../../assets/empty.svg";
import DateDropdown from "../../components/dateDropdown/dateDropdown";
import { isFigorr } from "../../utils/constants";
import { ModalContainer } from "../settings/style";
import SelectShop from "../login/selectShop";
import { FINANCIAL_OVERVIEW, SALES_OVERVIEW_INSIGHTS, ORDER_AND_OVERVIEW_INSIGHTS } from "../../schema/overview.schema";
import { FinancialOverview, SalesOverviewInsights, OrderAndOverviewInsights } from "../../interfaces/overview.interface";

interface IFilteredDate {
  from: Date;
  to: Date;
}

const Home: FunctionComponent = () => {
  const [selectedDate, setSelectedDate] = useState(0);
  const {
    shops: { currentShop },
    user: userInfo,
  } = useAppSelector((state) => state);
  const isMerchant = userInfo?.userId === currentShop?.userId;
  const userPermissions = useAppSelector(getUserPermissions);
  const shouldViewAllSales = hasPermission("VIEW_ALL_SALES", userPermissions);
  const shouldViewSales = hasPermission("VIEW_SALE", userPermissions);
  const shouldViewExpenses = hasPermission("VIEW_EXPENDITURE", userPermissions);
  const shouldViewInventory = hasPermission("VIEW_INVENTORY", userPermissions);
  const [selectedOption, setSelectedOption] = useState<number>(0);
  const [navBarHeight, setNavBarHeight] = useState<number>(0);
  const accountLock = useAppSelector((state) => state.accountLock);

  const syncTableUpdateCount = useAppSelector((state) =>
    syncTotalTableCount(state.shops.syncTableUpdateCount, [
      "Receipt",
      "Sales",
      "Expenditure",
      "Inventory",
      "TrackableItems",
      "NonTrackableItems",
      "Supplies",
      "InventoryQuantity",
    ])
  );
  const dateOptions = [
    "Today",
    "Yesterday",
    "This week",
    "Last week",
    "This month",
    "Last month",
    "This year",
    "All entries",
    "Date Range",
  ];

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { blackLight, grey, darkGreen, red, primaryColor, white, blue } = Colors;

  const today = new Date();
  const todayStart = new Date(today);
  const todayEnd = new Date(today);
  const initialDateRange = setHours(todayStart, todayEnd);
  const [filteredDate, setFilteredDate] = useState<
    | {
      from: Date;
      to: Date;
    }
    | undefined
  >(initialDateRange);
  const [dateRange, setDateRange] = useState<IFilteredDate>(filteredDate as IFilteredDate);

  const { data: financialOverviewData, refetch: refetchFinancialOverview } = useQuery<{
    getFinancialOverview: FinancialOverview;
  }>(FINANCIAL_OVERVIEW, {
    variables: {
      shopId: currentShop?.shopId,
      from: initialDateRange?.from.toString(),
      to: initialDateRange?.to.toString(),
    },
    skip: !currentShop?.shopId,
    onError(error) {
      if (currentShop?.shopId) {
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      }
    },
  });

  const { data: salesOverviewData, refetch: refetchSalesOverview } = useQuery<{
    getSalesOverviewInsights: SalesOverviewInsights;
  }>(SALES_OVERVIEW_INSIGHTS, {
    variables: {
      shopId: currentShop?.shopId,
      from: initialDateRange?.from.toString(),
      to: initialDateRange?.to.toString(),
    },
    skip: !currentShop?.shopId,
    onError(error) {
      if (currentShop?.shopId) {
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      }
    },
  });

  const { data: orderAndOverviewData, refetch: refetchOrderAndOverview } = useQuery<{
    getOrderAndOverviewInsights: OrderAndOverviewInsights;
  }>(ORDER_AND_OVERVIEW_INSIGHTS, {
    variables: {
      shopId: currentShop?.shopId,
      from: initialDateRange?.from.toString(),
      to: initialDateRange?.to.toString(),
    },
    skip: !currentShop?.shopId,
    onError(error) {
      if (currentShop?.shopId) {
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      }
    },
  });

  const getStartDate = (date: Date) => {
    const dateWithSeconds = setHours(date, date);
    setDateRange({ from: dateWithSeconds?.from, to: dateRange?.to });
  };

  const getEndDate = (date: Date) => {
    const dateWithSeconds = setHours(date, date);
    setDateRange({ to: dateWithSeconds.to, from: dateRange?.from });
  };

  const handleFilterByDate = (currentDate: number) => {
    setSelectedDate(currentDate);
    let filterData = getDates(dateOptions[currentDate]);
    if (currentDate === 8) filterData = { from: resetDateHrs(dateRange.from), to: dateRange.to };
    setFilteredDate(filterData);

    refetchOrderAndOverview({
      shopId: currentShop?.shopId,
      from: filterData?.from.toString(),
      to: filterData?.to.toString(),
    });

    refetchSalesOverview({
      shopId: currentShop?.shopId,
      from: filterData?.from.toString(),
      to: filterData?.to.toString(),
    });

    refetchFinancialOverview({
      shopId: currentShop?.shopId,
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

  useEffect(() => {
    handleDropDown(selectedOption);
  }, [syncTableUpdateCount]);

  const navigateRoute = (route: string) => {
    return isMerchant ? navigate(route) : null;
  };

  const overViewNavContent = () => {
    return (
      <Flex width="100%" justifyContent="space-between" direction="column" gap="0.5rem">
        <Flex width="100%" justifyContent="flex-start" alignItems="center" gap="2rem">
          {(isMerchant || shouldViewAllSales) && (
            <div style={{ display: "flex" }}>
              <DateDropdown
                width="7.5rem"
                height="1.875rem"
                padding="0.625rem 0"
                borderRadius=".5rem"
                color="#8196B3"
                icon={CalenderIcon}
                dateOptions={dateOptions}
                selectedDate={selectedDate}
                setSelectedDate={(val: number) => handleDropDown(val)}
                handleApply={() => handleFilterByDate(8)}
                dateRange={dateRange}
                getStartDate={getStartDate}
                getEndDate={getEndDate}
              />
            </div>
          )}
          <Text color={blackLight} fontWeight="600" fontSize="1rem">
            <em>
              Showing an overview of your business analytics for{" "}
              <b>
                "
                {selectedDate === 8
                  ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                  : dateOptions[selectedDate]}
                "
              </b>
            </em>
          </Text>
        </Flex>
      </Flex>
    );
  };

  const getOrderStepColor = (stepName: string) => {
    const steps = [
      { label: "PENDING", color: primaryColor },
      { label: "PROCESSING", color: blue },
      { label: "PROCESSED", color: blue },
      { label: "ON_DELIVERING", color: blue },
      { label: "CANCELLED", color: red },
      { label: "DELIVERED", color: darkGreen },
      { label: "COMPLETED", color: darkGreen },
    ];

    return steps.find((step) => step.label === stepName)?.color;
  };

  const canViewInventory = (returnValue: number | string | undefined) => {
    const canView = isMerchant || shouldViewInventory;
    return canView ? returnValue : "----";
  };

  return (
    <Container navBarHeight={navBarHeight}>
      <TopNav
        header="Overview"
        overViewNavContent={overViewNavContent}
        setNavBarHeight={setNavBarHeight}
      />
      <div className="wrapper">
        <Flex width={isFigorr ? "100%" : "66%"} gap="0.5em" height="100%" direction="column">
          <Flex width="100%" gap="0.5em" height="50%">
            <Flex width="50%" gap="0.5em" height="100%">
              <Sales>
                <div className="top">
                  <Text color={grey}>
                    {(isMerchant || shouldViewAllSales || shouldViewSales) === false
                      ? "---"
                      : salesOverviewData?.getSalesOverviewInsights && (
                        <Flex alignItems="center" gap="0.5rem">
                          <h3>
                            {formatAmountIntl(
                              undefined,
                              salesOverviewData?.getSalesOverviewInsights.totalSales || 0
                            )}
                          </h3>
                          <p>Sales</p>
                        </Flex>
                      )}
                  </Text>
                  <Flex
                    alignItems="center"
                    cursor="pointer"
                    gap="0.7rem"
                    onClick={() => navigate("/dashboard/sales")}
                  >
                    <Span cursor="pointer" color={grey}>
                      See all
                    </Span>
                    <img src={ChevRight} alt="see all" width="7px" />
                  </Flex>
                </div>
                <div className="bottom">
                  {salesOverviewData?.getSalesOverviewInsights?.allSalesReceipt.map((receipt, index) => {
                    return (
                      <SalesItem key={receipt.receiptId} delay={index * 0.05}>
                        <Flex gap="0.5em" alignItems="center">
                          <CustomCont
                            background={isFigorr ? "#24437D" : "white"}
                            margin="0"
                            countColor={Colors.secondaryColor}
                            imgHeight="1.25rem"
                          >
                            <img src={isFigorr ? FigorrODocumentIcon : ODocumentIcon} alt="" />
                            <div className="offset">
                              <Counter color={isFigorr ? "#24437D" : "white"}>
                                {Number(receipt.Sales.length)}
                              </Counter>
                            </div>
                          </CustomCont>
                          <Flex direction="column" justifyContent="space-between">
                            <Span
                              fontSize="16"
                              fontWeight="700"
                              color={isFigorr ? "#24437D" : "white"}
                            >
                              #{receipt.deviceId}
                              {receipt.receiptNumber.toString().padStart(4, "0")}
                            </Span>
                            <Span color={isFigorr ? "#24437D" : "white"}>
                              {canViewInventory(
                                formatAmountIntl(undefined, Number(receipt.totalAmount))
                              )}
                            </Span>
                          </Flex>
                        </Flex>
                        <Span color={isFigorr ? "#24437D" : "white"}>{receipt.paymentMethod}</Span>
                      </SalesItem>
                    );
                  })}
                </div>
              </Sales>
            </Flex>
            <Flex width="50%" gap="0.5em" height="100%" direction="column">
              <Flex
                height="40%"
                padding="1em"
                gap="0.5em"
                width="100%"
                borderRadius="1rem"
                bg={white}
                direction="column"
                justifyContent="space-between"
              >
                <Flex
                  width="100%"
                  alignItems="center"
                  justifyContent="space-between"
                  height="40%"
                  gap="0.5em"
                >
                  <Flex gap="0.5em" alignItems="center">
                    <img className="icon-wrapper" src={Swap} alt="swap icon" />
                    <Text color={grey}>Inflow & Expenses</Text>
                  </Flex>
                  <Flex
                    alignItems="center"
                    gap="0.7rem"
                    cursor="pointer"
                    onClick={() => navigateRoute("/dashboard/expenses")}
                  >
                    <Span cursor="pointer" color={grey}>
                      See all
                    </Span>
                    <img src={ChevRight} alt="see all" width="7px" />
                  </Flex>
                </Flex>
                <Flex width="100%" alignItems="center" justifyContent="space-between">
                  <Flex
                    width="100%"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    direction="column"
                  >
                    <Span color={grey}>Inflow</Span>
                    <Span color={darkGreen} fontWeight="700">
                      {canViewInventory(
                        financialOverviewData?.getFinancialOverview &&
                        formatAmountIntl(
                          undefined,
                          financialOverviewData?.getFinancialOverview.totalCashInFlow || 0
                        )
                      )}
                    </Span>
                  </Flex>
                  <Flex
                    width="100%"
                    alignItems="center"
                    justifyContent="space-between"
                    direction="column"
                  >
                    <Span color={grey}>Balance</Span>
                    <Span color={blackLight} fontWeight="700">
                      {canViewInventory(
                        financialOverviewData?.getFinancialOverview &&
                        formatAmountIntl(
                          undefined,
                          (financialOverviewData?.getFinancialOverview?.totalCashInFlow || 0) -
                          (financialOverviewData?.getFinancialOverview?.totalExpenditure || 0)
                        )
                      )}
                    </Span>
                  </Flex>
                  <Flex
                    width="100%"
                    justifyContent="space-between"
                    direction="column"
                    alignItems="flex-end"
                  >
                    <Span color={grey}>Expenses</Span>
                    <Span color={red} fontWeight="700">
                      {canViewInventory(
                        financialOverviewData?.getFinancialOverview &&
                        formatAmountIntl(
                          undefined,
                          financialOverviewData?.getFinancialOverview.totalExpenditure || 0
                        )
                      )}
                    </Span>
                  </Flex>
                </Flex>
              </Flex>
              <Flex
                height="60%"
                padding="1em"
                gap="2em"
                width="100%"
                borderRadius="1rem"
                direction="column"
                bg={white}
              >
                <Flex
                  width="100%"
                  alignItems="center"
                  justifyContent="space-between"
                  height="20%"
                  gap="0.5em"
                >
                  <Flex gap="0.5em" alignItems="center">
                    <img className="icon-wrapper" src={Graph} alt="graph icon" />
                    <Flex>
                      <Text color={grey} fontWeight="700" margin="0 .625rem 0 0">
                        {canViewInventory(
                          financialOverviewData?.getFinancialOverview?.totalInventory || 0
                        )}
                      </Text>
                      <Text color={grey}>Total Products</Text>
                    </Flex>
                  </Flex>
                  <Flex
                    alignItems="center"
                    gap="0.7rem"
                    cursor="pointer"
                    onClick={() => navigateRoute("/dashboard/product")}
                  >
                    <Span cursor="pointer" color={grey}>
                      See all
                    </Span>
                    <img src={ChevRight} alt="see all" width="7px" />
                  </Flex>
                </Flex>
                <Flex
                  width="100%"
                  alignItems="center"
                  justifyContent="space-between"
                  direction="column"
                  height="100%"
                >
                  <Flex width="100%" gap="0.8rem">
                    <Flex
                      width="100%"
                      alignItems="flex-start"
                      justifyContent="space-between"
                      direction="column"
                      gap="0.3rem"
                    >
                      <Span color={grey}>Total Quantity</Span>
                      <Span color={primaryColor} fontWeight="700">
                        {canViewInventory(orderAndOverviewData?.getOrderAndOverviewInsights?.totalAvailableQuantity || 0)}
                      </Span>
                    </Flex>
                    <Flex
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                      direction="column"
                    >
                      <Span color={grey}>Out of Stock</Span>
                      <Span color={red} fontWeight="700">
                        {canViewInventory(orderAndOverviewData?.getOrderAndOverviewInsights?.outOfStockCount || 0)}
                      </Span>
                    </Flex>
                    <Flex
                      width="100%"
                      justifyContent="space-between"
                      direction="column"
                      alignItems="flex-end"
                    >
                      <Span color={grey}>Online</Span>
                      <Span color={darkGreen} fontWeight="700">
                        {canViewInventory(orderAndOverviewData?.getOrderAndOverviewInsights?.onlineCount || 0)}
                      </Span>
                    </Flex>
                  </Flex>
                  <Flex width="100%" gap="0.8rem">
                    <Flex
                      width="100%"
                      alignItems="flex-start"
                      justifyContent="space-between"
                      direction="column"
                      gap="0.3rem"
                    >
                      <Span color={grey}>Returned</Span>
                      <Span color={red} fontWeight="700" opacity={0.3}>
                        {canViewInventory(orderAndOverviewData?.getOrderAndOverviewInsights?.returnedCount || 0)}
                      </Span>
                    </Flex>
                    <Flex
                      width="100%"
                      alignItems="center"
                      justifyContent="space-between"
                      direction="column"
                    >
                      <Span color={grey}>Damaged</Span>
                      <Span color={red} fontWeight="700" opacity={0.3}>
                        {canViewInventory(orderAndOverviewData?.getOrderAndOverviewInsights?.damagedCount || 0)}
                      </Span>
                    </Flex>
                    <Flex
                      width="100%"
                      justifyContent="space-between"
                      direction="column"
                      alignItems="flex-end"
                    >
                      <Span color={grey}>Lost</Span>
                      <Span color={red} fontWeight="700" opacity={0.3}>
                        {canViewInventory(orderAndOverviewData?.getOrderAndOverviewInsights?.lostCount || 0)}
                      </Span>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Flex width="100%" padding="1rem" height="50%" bg={white} borderRadius="1rem">
            {salesOverviewData?.getSalesOverviewInsights?.recentSales?.length! < 1 &&
              financialOverviewData?.getFinancialOverview?.allExpenditure?.length! < 1 ? (
              <TEmpty height="100%">
                <img src={emptyImage} alt="empty-img" />
                <h3>No Activities Today</h3>
                <p>Add some transactions to see your daily chart here.</p>
              </TEmpty>
            ) : (
              <LineChart
                recentSales={
                    (isMerchant || shouldViewInventory) === false ? [] : salesOverviewData?.getSalesOverviewInsights?.recentSales
                }
                expenditures={
                  (isMerchant || shouldViewExpenses) === false
                    ? []
                    : financialOverviewData?.getFinancialOverview?.allExpenditure
                }
              />
            )}
          </Flex>
        </Flex>
        {/* {isFigorr ? null : ( */}
        <Flex
          display={isFigorr ? "none" : "flex"}
          width="33%"
          gap="0.5em"
          height="100%"
          direction="column"
        >
          <Flex
            height="19%"
            padding="1em"
            gap="0.5em"
            width="100%"
            borderRadius="1rem"
            bg={Colors.secondaryColor}
            direction="column"
            justifyContent="space-between"
          >
            <Flex gap="0.5em" alignItems="center" justifyContent="space-between">
              <Flex alignItems="center" gap="0.5em">
                <img className="icon-wrapper" src={Globe} alt="graph icon" />
                <Flex gap="0.5em">
                  <Text color={white} fontWeight="700">
                    {financialOverviewData?.getFinancialOverview?.allOrderCount || 0}
                  </Text>
                  <Text color={white}>Online Orders</Text>
                </Flex>
              </Flex>
              <Span
                cursor="pointer"
                color={isFigorr ? "white" : grey}
                onClick={() => navigate("/dashboard/online-presence")}
              >
                See details
              </Span>
            </Flex>
            <Flex width="100%" alignItems="center" justifyContent="space-between">
              <Flex
                width="100%"
                alignItems="flex-start"
                justifyContent="space-between"
                direction="column"
                gap="0.5em"
              >
                <Span color={white}>Pending</Span>
                <Span color={white} fontWeight="700">
                  {financialOverviewData?.getFinancialOverview?.pendingCount || 0}
                </Span>
              </Flex>
              <Flex
                width="100%"
                alignItems="center"
                justifyContent="space-between"
                direction="column"
                gap="0.5em"
              >
                <Span color={white}>Processing</Span>
                <Span color={white} fontWeight="700">
                  {financialOverviewData?.getFinancialOverview?.processingCount || 0}
                </Span>
              </Flex>
              <Flex
                width="100%"
                justifyContent="space-between"
                direction="column"
                alignItems="flex-end"
                gap="0.5em"
              >
                <Span color={white}>Completed</Span>
                <Span color={white} fontWeight="700">
                  {financialOverviewData?.getFinancialOverview?.completedCount || 0}
                </Span>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            width="100%"
            gap="0.5em"
            height="80%"
            direction="column"
            bg={white}
            borderRadius="1rem"
            padding="1rem"
          >
            <Flex gap="0.5em" alignItems="center" justifyContent="space-between">
              <Text color={grey}>Recent Orders</Text>
              <Flex
                alignItems="center"
                gap="0.7rem"
                padding="0 1rem"
                cursor="pointer"
                onClick={() => navigate("/dashboard/online-presence")}
              >
                <Span cursor="pointer" color={grey}>
                  See all
                </Span>
                <img src={ChevRight} alt="see all" width="7px" />
              </Flex>
            </Flex>
            {orderAndOverviewData?.getOrderAndOverviewInsights?.records.length! < 1 ? (
              <TEmpty height="100%">
                <img src={emptyImage} alt="empty-img" />
                <h3>No Orders yet for Today</h3>
                <p>Your recent orders will appear here.</p>
              </TEmpty>
            ) : (
              <div
                id="orders"
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexFlow: "column",
                  gap: "0.5em",
                }}
              >
                  {orderAndOverviewData?.getOrderAndOverviewInsights?.records.map((order, index) => {
                  const stepName = order.Step?.stepName || "";
                  return (
                    <OrderItem
                      key={order.orderItemId}
                      delay={index * 0.05}
                      background={(index + 1) % 2 === 0 ? "#F6F8FB" : ""}
                    >
                      <Flex height="2.5rem">
                        <div className="order-image">
                          <img src={getImageUrl()} alt="" />
                        </div>
                        <Flex direction="column" justifyContent="space-between">
                          <Span
                            className="overFlow"
                            color={blackLight}
                            style={{ overflow: "hidden" }}
                          >
                            {order.inventoryName}
                          </Span>
                          <Span color={blackLight}>
                            Quantity:{" "}
                            <Span fontWeight="600" color={blackLight}>
                              {order.quantity}
                            </Span>
                          </Span>
                        </Flex>
                      </Flex>
                      <Flex direction="column" justifyContent="space-between">
                        <Span fontSize="0.8em" textAlign="end" color={getOrderStepColor(stepName)}>
                          {stepName.charAt(0).toUpperCase() + stepName.slice(1).toLowerCase()}
                        </Span>
                        <Span fontWeight="600" color={blackLight} textAlign="end">
                          {formatAmountIntl(undefined, order.amount || 0)}
                        </Span>
                      </Flex>
                    </OrderItem>
                  );
                })}
              </div>
            )}
          </Flex>
        </Flex>
        {/* )} */}
      </div>
      {accountLock.showSelectShop && (
        <ModalContainer>
          <SelectShop />
        </ModalContainer>
      )}
    </Container>
  );
};

export default Home;
