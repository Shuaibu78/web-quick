import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import TopNav from "../../components/top-nav/top-nav";
import { Flex, Span, Text } from "../../GlobalStyles/CustomizableGlobal.style";
import SearchIcon from "../../assets/SearchIconBlack.svg";
import Cancel from "../../assets/cancel.svg";
import MinusIcon from "../../assets/removeIcon.svg";
import { Button } from "../../components/button/Button";
import { Colors } from "../../GlobalStyles/theme";
import { Dispatch, SetStateAction, useState } from "react";
import { ModalBox, ModalContainer } from "../settings/style";
import { CancelButton } from "../sales/style";
import { SearchContainer } from "../inventory/style";
import { InputWrapper } from "../login/style";
import SearchInput from "../../components/search-input/search-input";
import { IInventory } from "../../interfaces/inventory.interface";
import { SEARCH_INVENTORY } from "../../schema/inventory.schema";
import { useMutation, useQuery } from "@apollo/client";
import { useAppSelector } from "../../app/hooks";
import { getCurrentShop } from "../../app/slices/shops";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { useDispatch } from "react-redux";
import { Body } from "../expenses/style";
import {
  ADJUST_STOCK_MULTIPLE,
  AllProductHistoryAttr,
  GET_ALLSTOCK_ADJUSTMENT_HISTORY,
} from "../../schema/stockAdjustment.schema";
import { isLoading } from "../../app/slices/status";
import { SalesCard } from "../home/style";
import { getDates, resetDateHrs, setHours } from "../../helper/date";
import { IFilteredDate } from "../sales/sales";

type ContextType = {
  selectedProducts: IInventory & AdjustmentInputAttr[];
  setSelectedProducts: Dispatch<SetStateAction<IInventory & AdjustmentInputAttr[]>>;
  adjustmentHistoryList: AllProductHistoryAttr[];
};

export interface AdjustmentInputAttr {
  quantityAdj?: number;
  sellingPrice?: number;
  costPriceAdj?: string | number;
  expiryDate?: Date | undefined;
  comment?: string;
  reason?: string;
  inventoryId?: string;
  inventoryTypeAdj?: string;
  variationId?: string;
  isExpenditure?: boolean;
  previousCostPrice?: string;
  showExpiryDtae?: boolean;
}

const StockAdjustment = () => {
  const [showSelectProduct, setShowSelectProduct] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<IInventory & AdjustmentInputAttr[]>([]);
  const [navbarHeight, setNavbarHeight] = useState<number>();
  const [selectedDate, setSelectedDate] = useState(0);
  const today = new Date();
  const todayStart = new Date(today);
  const todayEnd = new Date(today);
  const initialDateRange = setHours(todayStart, todayEnd);
  const [filteredDate, setFilteredDate] = useState<IFilteredDate>(initialDateRange);
  const [dateRange, setDateRange] = useState<IFilteredDate>(filteredDate as IFilteredDate);
  const currentShop = useAppSelector(getCurrentShop);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dateOptions = [
    "Today",
    "Yesterday",
    "This week",
    "Last week",
    "This month",
    "Last month",
    "This year",
    "All Entries",
    "Date range",
  ];
  const [adjustStockMukltiple] = useMutation(ADJUST_STOCK_MULTIPLE, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const { data, refetch: refetchAllAdjustmentHistory } = useQuery<{
    getAllStockAdjustmentHistory: AllProductHistoryAttr[];
  }>(GET_ALLSTOCK_ADJUSTMENT_HISTORY, {
    variables: {
      shopId: currentShop.shopId,
      from: filteredDate?.from.toString(),
      to: filteredDate?.to.toString(),
    },
    fetchPolicy: "network-only",
    onError: (error) => {
      dispatch(
        toggleSnackbarOpen({
          message: error?.message || error?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    },
  });

  const adjustmentHistoryList = data?.getAllStockAdjustmentHistory;
  const restockList = adjustmentHistoryList?.filter((hist) => hist.reason === "RESTOCK");
  const lostList = adjustmentHistoryList?.filter((hist) => hist.reason === "LOST");
  const damageList = adjustmentHistoryList?.filter((hist) => hist.reason === "DAMAGE");

  const modifySelectedProducts = () => {
    const modifiedProducts = selectedProducts.map((prod) => {
      const newProd = {
        costPrice: prod.costPriceAdj ?? prod.previousCostPrice,
        inventoryExpiryDate: prod.showExpiryDtae ? prod.expiryDate : null,
        inventoryId: (prod as IInventory).inventoryId,
        isPack: (prod as IInventory).inventoryType === "PACK" || prod.inventoryTypeAdj === "PACK",
        note: prod.comment,
        quantity: prod.quantityAdj ?? null,
        reason: prod.reason,
        sellingPrice: prod.sellingPrice ?? null,
        variationId: prod.variationId,
        shopId: currentShop.shopId,
        isExpenditure: prod.isExpenditure,
        inventoryType: prod.inventoryTypeAdj,
      };
      return newProd;
    });
    return modifiedProducts.filter((prd) => prd.reason !== null);
  };

  const handleAdjustMultipleStock = () => {
    if (modifySelectedProducts().length > 0) {
      dispatch(isLoading(true));
      adjustStockMukltiple({
        variables: {
          products: modifySelectedProducts(),
        },
      })
        .then(() => {
          dispatch(isLoading(false));
          setSelectedProducts([]);
          refetchAllAdjustmentHistory();
          navigate("/dashboard/stock-adjustment/history");
        })
        .catch((err) => {
          dispatch(isLoading(false));
          dispatch(
            toggleSnackbarOpen({
              message: err.message || err.graphQlErrors[0].message,
              color: "DANGER",
            })
          );
        });

      // modifySelectedProducts().forEach((adjustment) => {
      //   // if (adjustment.isExpenditure !== null && adjustment.reason !== "RESTOCK") {
      //   //   createExpenditure({
      //   //     variables: {
      //   //       remark: adjustment.reason,
      //   //       shopId: currentShop?.shopId,
      //   //       expenditureCategoryId: null,
      //   //       name: adjustment.reason,
      //   //       amount: parseFloat(adjustment.previousCostPrice!.replace(/[^\d.-]/g, "")),
      //   //     },
      //   //   });
      //   // }
      //   createStockAdjustment({
      //     variables: removeCostPrice(adjustment),
      //   })
      //     .then((res) => {
      //       if (res.data) {
      //         dispatch(isLoading(false));
      //         setSelectedProducts([]);
      //         refetchAllAdjustmentHistory();
      //         navigate("/dashboard/stock-adjustment/history");
      //       }
      //     })
      //     .catch((err) => {
      //       dispatch(isLoading(false));
      //       dispatch(
      //         toggleSnackbarOpen({
      //           message: err.message || err.graphQlErrors[0].message,
      //           color: "DANGER",
      //         })
      //       );
      //     });
      // });
    } else {
      dispatch(
        toggleSnackbarOpen({
          message: "Something Went Wrong",
          color: "DANGER",
        })
      );
    }
  };

  const ProductItem = ({ value }: { value: IInventory & AdjustmentInputAttr }) => {
    const existingProductIndex = selectedProducts?.findIndex(
      (i) => (i as IInventory).inventoryId === value.inventoryId
    );
    const handleRemoveProd = () => {
      if (existingProductIndex !== -1) {
        setSelectedProducts((prevSelectedProducts) =>
          prevSelectedProducts.filter(
            (prev) => (prev as IInventory).inventoryId !== value.inventoryId
          )
        );
      }
    };

    return (
      <>
        <Flex
          justifyContent="space-between"
          margin="0.4rem 0"
          padding="0.2rem 0"
          hover
          style={{ borderBottom: `1px solid ${Colors.borderGreyColor}` }}
        >
          <Flex gap="0 0.5rem" alignItems="center" color={Colors.blackLight}>
            <div onClick={handleRemoveProd} style={{ width: "1.5rem", cursor: "pointer" }}>
              <img src={MinusIcon} width="inherit" alt="removeIcon" />
            </div>
            <Flex direction="column">
              <Text>{value.inventoryName}</Text>
              <p className="small" style={{ fontWeight: "400" }}>
                {value.inventoryType}
              </p>
            </Flex>
          </Flex>
        </Flex>
      </>
    );
  };

  const AdjustStockCard = () => {
    if (location.pathname === "/dashboard/stock-adjustment/history") {
      return (
        <>
          <Flex gap="0.5rem" margin="0.5rem 0">
            <SalesCard width="15%" height="4.5rem" background={Colors.tabBg}>
              <Flex direction="column" justifyContent="space-between">
                <Text fontWeight="500" color={Colors.primaryColor} fontSize="1.279rem">
                  {adjustmentHistoryList?.length}
                </Text>
                <Text fontWeight="400" color={Colors.primaryColor} fontSize="0.8125rem">
                  Adjustment
                </Text>
              </Flex>
            </SalesCard>
            <SalesCard
              width="30%"
              height="4.5rem"
              background={Colors.white}
              border={`1px solid ${Colors.tabBg}`}
            >
              <div>
                <Text fontWeight="500" color={Colors.blackLight} fontSize="1rem">
                  {restockList?.length}
                </Text>
                <Text fontWeight="400" color={Colors.grey} fontSize="0.8125rem">
                  Restocked
                </Text>
              </div>
              <div>
                <Text fontWeight="500" color={Colors.red} fontSize="1rem">
                  {lostList?.length}
                </Text>
                <Text fontWeight="400" color={Colors.grey} fontSize="0.8125rem">
                  Lost
                </Text>
              </div>
              <div>
                <Text fontWeight="500" color={Colors.red} fontSize="1rem">
                  {damageList?.length}
                </Text>
                <Text fontWeight="400" color={Colors.grey} fontSize="0.8125rem">
                  Damaged
                </Text>
              </div>
            </SalesCard>
          </Flex>
        </>
      );
    }

    return (
      <>
        <Flex justifyContent="space-between" width="100%" margin="1rem 0 0 0">
          <Flex
            gap="0 .5rem"
            cursor="pointer"
            onClick={() => setShowSelectProduct(!showSelectProduct)}
          >
            <Flex height="2rem" width="2rem">
              <img src={SearchIcon} alt="" />
            </Flex>
            <Flex direction="column">
              <Text fontWeight="500" fontSize="0.875rem" color={Colors.secondaryColor}>
                Click to search products for adjustment{" "}
              </Text>
              <Text fontWeight="400" fontSize="0.8125rem" color={Colors.grey}>
                Then select adjustment reason and enter fields related to your adjustments only
              </Text>
            </Flex>
          </Flex>
          {selectedProducts.length > 0 && (
            <Flex width="fit-content" gap="0 1rem">
              <Button
                backgroundColor={Colors.blackLight}
                label="Clear Inputs"
                height="2.5rem"
                width="9.5rem"
                color={Colors.white}
                borderRadius="0.75rem"
                onClick={() => setSelectedProducts([])}
              />
              <Button
                backgroundColor={Colors.green}
                label="Make Adjustment"
                height="2.5rem"
                width="9.5rem"
                onClick={handleAdjustMultipleStock}
                color={Colors.white}
                borderRadius="0.75rem"
              />
            </Flex>
          )}
        </Flex>
      </>
    );
  };

  const { data: searchData } = useQuery<{
    searchUserInventory: [IInventory];
  }>(SEARCH_INVENTORY, {
    variables: {
      shopId: currentShop.shopId,
      searchString: searchTerm ?? "",
    },
    skip: !searchTerm,
    fetchPolicy: "no-cache",
  });

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  const handleAddProduct = (val: IInventory) => {
    const existingProductIndex = selectedProducts?.findIndex(
      (i) => (i as IInventory).inventoryId === val.inventoryId
    );
    if (existingProductIndex === -1 && val.inventoryType !== "NON_TRACKABLE") {
      setSelectedProducts([...selectedProducts, val]);
    } else {
      dispatch(toggleSnackbarOpen({ message: "This product cannot be added", color: "INFO" }));
    }
    setSearchTerm("");
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

    refetchAllAdjustmentHistory();
  };

  const handleDropDown = (val: number) => {
    if (val !== 8) {
      return handleFilterByDate(val);
    } else {
      setSelectedDate(8);
    }
  };

  return (
    <>
      <TopNav
        selectedDate={selectedDate}
        dateOptions={dateOptions}
        dateRange={dateRange}
        getStartDate={getStartDate}
        getEndDate={getEndDate}
        handleDropDown={handleDropDown}
        handleFilterByDate={handleFilterByDate}
        setNavBarHeight={setNavbarHeight}
        adjustCards={<AdjustStockCard />}
      />
      <Body
        bgColor={
          location.pathname === "/dashboard/stock-adjustment/history" ? "white" : "transparent"
        }
        navBarHeight={navbarHeight as number}
      >
        <Outlet
          context={{
            selectedProducts,
            setSelectedProducts,
            adjustmentHistoryList,
          }}
        />
      </Body>

      {showSelectProduct && (
        <ModalContainer>
          <ModalBox>
            <Flex alignItems="center" justifyContent="space-between">
              <h3>Add Products to Adjust</h3>
              <CancelButton
                style={{
                  width: "1.875rem",
                  height: "1.875rem",
                  display: "grid",
                  placeItems: "center",
                }}
                hover
                onClick={() => setShowSelectProduct(false)}
              >
                <img src={Cancel} alt="" />
              </CancelButton>
            </Flex>
            <div>
              <SearchContainer>
                <InputWrapper>
                  <SearchInput
                    placeholder="Search Product"
                    width="100%"
                    handleSearch={handleSearch}
                    borderRadius="0.625rem"
                  />
                </InputWrapper>
                {searchData?.searchUserInventory && (
                  <Flex
                    id="result-box"
                    style={{ position: "absolute", top: "3em", zIndex: 9000 }}
                    width="100%"
                    borderRadius="0 0 0.625rem 0.625rem"
                    direction="column"
                    gap="0.2em"
                    maxHeight="18.75rem"
                    bg="white"
                  >
                    {searchData?.searchUserInventory.map((val) => {
                      return (
                        <Span
                          className="product"
                          cursor="pointer"
                          color={Colors.blackLight}
                          fontSize="1em"
                          key={val.inventoryId}
                          onClick={() => handleAddProduct(val)}
                        >
                          {val.inventoryName}
                        </Span>
                      );
                    })}
                  </Flex>
                )}
              </SearchContainer>
              <Flex fontSize="0.8rem" justifyContent="space-between">
                <h3>Products Added</h3>
              </Flex>

              <Flex direction="column" minHeight="15rem">
                {selectedProducts.length > 0 &&
                  selectedProducts?.map((item) => (
                    <ProductItem key={(item as IInventory).inventoryId} value={item} />
                  ))}
              </Flex>
              <Flex justifyContent="flex-end" margin="10px 0">
                <Button
                  label="Continue"
                  backgroundColor={Colors.primaryColor}
                  height="2rem"
                  width="40%"
                  color="white"
                  borderRadius="0.5rem"
                  onClick={() => {
                    setShowSelectProduct(false);
                  }}
                />
              </Flex>
            </div>
          </ModalBox>
        </ModalContainer>
      )}
    </>
  );
};

export default StockAdjustment;

export function useAdjustStockContext() {
  return useOutletContext<ContextType>();
}
