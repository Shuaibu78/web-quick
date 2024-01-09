/* eslint-disable indent */
import { useEffect, useState } from "react";
import TopNav from "../../components/top-nav/top-nav";
import { BalanceCard, BalanceHeader, ButtonGroup, Body, ExpensesWrapper } from "./style";
import DebtIcon from "../../assets/debt-icon.svg";
import dropIcon from "../../assets/dropIcon2.svg";
import FilterIcon from "../../assets/FilterIcon.svg";
import Calendar from "../../assets/Calendar.svg";
import ProductList from "./product-list/product-list";
import AddNewCard from "./add-new-card/add-new-card";
import { ModalContainer } from "../settings/style";
import { useLazyQuery } from "@apollo/client";
import { GET_ALL_TRANSACTIONS } from "../../schema/expenses.schema";
import { getCurrentShop } from "../../app/slices/shops";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { IExpenditureCategory } from "../../interfaces/expenses.interface";
import { formatAmountIntl } from "../../helper/format";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import FilterCard from "./filterCard";
import { hasPermission, syncTotalTableCount } from "../../helper/comparisons";
import { Button } from "../../components/button/Button";
import NewCategory from "./new-category-card";
import { getUserPermissions } from "../../app/slices/roles";
import { Flex, Text } from "../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../GlobalStyles/theme";
import { getDates, resetDateHrs, setHours } from "../../helper/date";
import { IFilteredDate } from "../sales/sales";
import { UsersAttr } from "../../interfaces/user.interface";
import { TControls } from "../sales/style";
import SearchInput from "../../components/search-input/search-input";
import DateDropdown from "../../components/dateDropdown/dateDropdown";

export interface IInflowExpenditureRecords {
  amount: number;
  date: string;
  updatedAt: string;
  isExpenditure: number;
  name: string;
  category: string;
  userId: string;
  remark: string;
  paymentMethod: string;
  inflowOrExpenditureId: string;
}

export type ViewType = "INFLOW_EXPENDITURE" | "INFLOW" | "EXPENDITURE";
export const viewArray: ViewType[] = ["INFLOW_EXPENDITURE", "INFLOW", "EXPENDITURE"];
const { blackLight } = Colors;

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

const Expenses = () => {
  const [type, setType] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [showCatModal, setShowCatModal] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<number>(7);
  const [navBarHeight, setNavBarHeight] = useState<number>(0);
  const [includeSales, setIncludeSales] = useState<boolean>(true);
  const [includeSupplies, setIncludeSupplies] = useState<boolean>(false);
  const [view, setView] = useState<number>(0);
  const [selectedUsers, setSelectedUsers] = useState<UsersAttr[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<IExpenditureCategory[]>([]);
  const [transactions, setTransactions] = useState<IInflowExpenditureRecords[] | undefined>([]);

  const currentShop = useAppSelector(getCurrentShop);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const dispatch = useAppDispatch();

  const userPermissions = useAppSelector(getUserPermissions);

  const shouldManageExpense = hasPermission("MANAGE_EXPENDITURE", userPermissions);
  const shouldManageCashInFlow = hasPermission("MANAGE_CASH_INFLOW", userPermissions);
  const shouldViewExpense = hasPermission("VIEW_EXPENDITURE", userPermissions);
  const shouldViewCashInFlow = hasPermission("VIEW_CASH_INFLOW", userPermissions);

  const today = new Date();
  const todayStart = new Date(today);
  const todayEnd = new Date(today);
  const initialDateRange = setHours(todayStart, todayEnd);
  const [filteredDate, setFilteredDate] = useState<IFilteredDate | undefined>(initialDateRange);
  const [dateRange, setDateRange] = useState<IFilteredDate>(filteredDate as IFilteredDate);
  const [searchString, setSearchString] = useState<string>("");

  const syncTableUpdateCount = useAppSelector((state) =>
    syncTotalTableCount(state.shops.syncTableUpdateCount, ["Expenditure", "CashInFlow"])
  );

  const getDate = () => {
    const to = selectedDate === 7 ? null : selectedDate === 8 ? dateRange.to : filteredDate?.to;
    const from =
      selectedDate === 7 ? null : selectedDate === 8 ? dateRange.from : filteredDate?.from;

    return { to, from };
  };

  const [getAllTransactions, { data, refetch }] = useLazyQuery<{
    getAllTransactions: {
      totalTransactionAmount: { totalInflowAmount: number; totalExpenditureAmount: number };
      transactions: IInflowExpenditureRecords[];
      total: number;
    };
  }>(GET_ALL_TRANSACTIONS, {
    variables: {
      page,
      includeSales,
      includeSupplies,
      view: "INFLOW_EXPENDITURE",
      shopId: currentShop?.shopId,
      limit: Math.ceil(perPage ?? 10),
      searchTerm: searchString,
    },
    onCompleted({ getAllTransactions: txnData }) {
      setTransactions(txnData?.transactions);
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
    getAllTransactions();
  }, [selectedCategories, selectedUsers, view, page, syncTableUpdateCount, searchString]);

  const refetchAll = () => {
    refetch();
  };

  const applyFilter = () => {
    setPage(1);
    getAllTransactions({
      variables: {
        shopId: currentShop?.shopId,
        view: viewArray[view],
        includeSales,
        includeSupplies,
        from: getDate().from,
        to: getDate().to,
        userIds: selectedUsers[0]?.userId,
        expenditureCategoryIds: selectedCategories?.map(
          (category) => category.expenditureCategoryId
        ),
        searchTerm: "",
      },
    });
  };

  const clearFilter = () => {
    setFilteredDate(getDates(dateOptions[7]));
    const filterData = getDates(dateOptions[7]);
    setSelectedCategories([]);

    getAllTransactions({
      variables: {
        page: 1,
        includeSales: false,
        includeSupplies: false,
        view: "INFLOW_EXPENDITURE",
        shopId: currentShop?.shopId,
        limit: Math.ceil(perPage ?? 10),
        from: filterData?.from,
        to: filterData?.to,
      },
    });
  };

  const handleSetDate = (val: number) => {
    setSelectedDate(val);
    if (val !== 8) {
      const filterDate = getDates(dateOptions[val]);
      setFilteredDate(filterDate);
    }
  };

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
    setFilteredDate(filterData as IFilteredDate);

    getAllTransactions({
      variables: {
        shopId: currentShop?.shopId,
        view: viewArray[view],
        includeSales,
        includeSupplies,
        from: filterData?.from,
        to: filterData?.to,
        searchTerm: "",
      },
    });
  };

  const handleDropDown = (val: number) => {
    if (val !== 8) {
      return handleFilterByDate(val);
    } else {
      setSelectedDate(8);
    }
  };

  const navContent = () => {
    return (
      <Flex width="100%" justifyContent="space-between" direction="column" gap="0.5rem">
        <Flex width="100%" justifyContent="flex-start" alignItems="center" gap="2rem">
          {shouldManageCashInFlow && (
            <DateDropdown
              width="7.5rem"
              height="1.875rem"
              padding="0.625rem 0"
              borderRadius=".5rem"
              icon={Calendar}
              dateOptions={dateOptions as string[]}
              selectedDate={selectedDate}
              setSelectedDate={(val: number) => handleDropDown(val)}
              handleApply={() => handleFilterByDate(8)}
              dateRange={dateRange}
              getStartDate={getStartDate}
              getEndDate={getEndDate}
            />
          )}
          <Text color={blackLight} fontWeight="600" fontSize="1rem">
            <em>Showing Your Inflow & Expenses for "{dateOptions[selectedDate]}"</em>
          </Text>
        </Flex>
        <Flex gap="1rem" alignItems="center" justifyContent="flex-start">
          <BalanceCard width="30%" backgroundColor={Colors.primaryColor}>
            <BalanceHeader>
              <p>Total Balance</p>
            </BalanceHeader>
            <h1 id="total">
              {data?.getAllTransactions &&
                data?.getAllTransactions?.totalTransactionAmount &&
                formatAmountIntl(
                  undefined,
                  (data?.getAllTransactions?.totalTransactionAmount?.totalInflowAmount || 0) -
                    (data?.getAllTransactions?.totalTransactionAmount?.totalExpenditureAmount || 0)
                )}
            </h1>
          </BalanceCard>
          <BalanceCard backgroundColor="#ECEFF4" width="40%">
            <Flex alignItems="center" justifyContent="space-between">
              <Flex direction="column" justifyContent="space-between">
                <Flex justifyContent="flex-start" alignItems="center" gap="0.5rem">
                  <img src={DebtIcon} alt="" id="exp-image" />
                  <p>Income</p>
                </Flex>
                <h1 id="income">
                  {data?.getAllTransactions &&
                    data?.getAllTransactions?.totalTransactionAmount &&
                    formatAmountIntl(
                      undefined,
                      data?.getAllTransactions?.totalTransactionAmount?.totalInflowAmount || 0
                    )}
                </h1>
              </Flex>

              <Flex direction="column" justifyContent="space-between">
                <Flex justifyContent="flex-start" alignItems="center" gap="0.5rem">
                  <img src={DebtIcon} alt="" />
                  <p>Expenses</p>
                </Flex>
                <h1 id="expense">
                  {data?.getAllTransactions &&
                    data?.getAllTransactions?.totalTransactionAmount &&
                    formatAmountIntl(
                      undefined,
                      data?.getAllTransactions?.totalTransactionAmount?.totalExpenditureAmount || 0
                    )}
                </h1>
              </Flex>
            </Flex>
          </BalanceCard>
        </Flex>
      </Flex>
    );
  };

  const handleSearch = (searchTerm: string) => {
    setSearchString(searchTerm);
  };

  return (
    <ExpensesWrapper>
      <TopNav
        header="Inflow & Expenses"
        option="Add a new Expense"
        navContent={navContent}
        setNavBarHeight={setNavBarHeight}
        setShowCatModal={setShowCatModal}
        shouldManageExpense={shouldManageExpense}
      />

      <Body navBarHeight={navBarHeight}>
        <TControls>
          <Flex justifyContent="space-between" style={{ columnGap: "2rem" }} width="45%">
            <Flex alignItems="center" width="60%">
              <SearchInput
                placeholder="Search Transactions"
                width="100%"
                height="2.5rem"
                handleSearch={handleSearch}
                borderRadius=".75rem"
              />
            </Flex>
            <Flex
              alignItems="center"
              bg="#F4F6F9"
              padding=".625rem .5rem"
              width="40%"
              color="#607087"
              height="2.5rem"
              borderRadius=".75rem"
              style={{ cursor: "pointer" }}
              justifyContent="space-between"
              onClick={() => setShowFilterModal(true)}
            >
              <img src={FilterIcon} alt="filter icon" />
              <p style={{ fontSize: ".875rem", color: "#607087" }}>Filter by</p>
              <img src={dropIcon} alt="filter icon" />
            </Flex>
          </Flex>
          <ButtonGroup style={{ justifyContent: "flex-end" }}>
            <div className="buttons">
              {shouldManageCashInFlow && (
                <Button
                  label="New Inflow"
                  type="button"
                  backgroundColor="#219653"
                  size="lg"
                  color="#fff"
                  borderColor="transparent"
                  borderRadius="0.75rem"
                  borderSize="1px"
                  fontSize="1rem"
                  width="9.375rem"
                  height="2.5rem"
                  onClick={() => {
                    setType("income");
                    setOpenModal(true);
                  }}
                />
              )}
              {shouldManageExpense && (
                <Button
                  label="New Expense"
                  type="button"
                  backgroundColor="#FF5050"
                  size="lg"
                  color="#fff"
                  borderColor="transparent"
                  borderRadius="0.75rem"
                  borderSize="1px"
                  fontSize="1rem"
                  width="9.375rem"
                  height="2.5rem"
                  onClick={() => {
                    setType("expense");
                    setOpenModal(true);
                  }}
                />
              )}
            </div>
          </ButtonGroup>
        </TControls>
        <ProductList
          data={
            shouldViewExpense ||
            shouldViewCashInFlow ||
            shouldManageCashInFlow ||
            shouldManageExpense
              ? transactions
              : ([] as any)
          }
          page={page}
          setPage={setPage}
          perPage={perPage}
          setPerPage={setPerPage}
          refetch={refetchAll}
          navBarHeight={navBarHeight}
          totalExpenses={data?.getAllTransactions?.total ?? 0}
        />
      </Body>
      {openModal && (
        <ModalContainer>
          <AddNewCard type={type} setOpenModal={setOpenModal} refetch={refetchAll} />
        </ModalContainer>
      )}
      {showFilterModal && (
        <ModalContainer>
          <FilterCard
            {...{
              dateRange,
              filteredDate,
              setFilteredDate,
              selectedCategories,
              dateOptions,
              setSelectedDate,
              setShowFilterModal,
              setDateRange,
              selectedDate,
              selectedUsers,
              setSelectedUsers,
              setSelectedCategories,
              includeSales,
              setIncludeSales,
              getAllTransactions,
              view,
              setView,
              viewArray,
              handleSetDate,
              applyFilter,
              clearFilter,
            }}
          />
        </ModalContainer>
      )}
      {showCatModal && (
        <ModalContainer>
          <NewCategory setShowCatModal={setShowCatModal} />
        </ModalContainer>
      )}
    </ExpensesWrapper>
  );
};

export default Expenses;
