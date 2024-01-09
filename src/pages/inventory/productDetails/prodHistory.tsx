import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import DateDropdown from "../../../components/dateDropdown/dateDropdown";
import { Flex, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import { getDates, resetDateHrs, setHours } from "../../../helper/date";
import { IFilteredDate } from "../../sales/sales";
import CalenderIcon from "../../../assets/calender.svg";
import { Colors } from "../../../GlobalStyles/theme";
import { SalesCard } from "../../home/style";
import { formatAmount } from "../../../helper/format";
import dropIcon2 from "../../../assets/dropIcon2.svg";
import dropIconBlue from "../../../assets/dropIconBlue.svg";
import Filter from "../../../assets/FilterIcon.svg";
import FilterIconDark from "../../../assets/FilterIconDark.svg";
import CustomDropdown from "../../../components/custom-dropdown/custom-dropdown";
import { throwIfNoInternetConnection } from "../../../utils/checkInternet.utils";
import NoInternetComp from "./NoInternet";
import ProductHistoryRow from "./prodHistoryRow";
import { useQuery } from "@apollo/client";
import { GET_PRODUCT_HISTORY } from "../../../schema/inventory.schema";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { IProductHistory, IProductHistoryRecord } from "../../../interfaces/inventory.interface";
import { useDispatch } from "react-redux";
import { IInventory } from "../../../interfaces/sales.interface";

const ProductHistory = ({ product }: { product: IInventory }) => {
  const [selectedDate, setSelectedDate] = useState<number>(7);
  const [selectedFilter, setSelectedFilter] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const today = new Date();
  const dispatch = useDispatch();
  const initialDateRange = setHours(new Date(0), today);
  const [filteredDate, setFilteredDate] = useState<
    | {
        from: Date;
        to: Date;
      }
    | undefined
  >(initialDateRange);
  // const [selectedOption, setSelectedOption] = useState<number>(0);
  const [dateRange, setDateRange] = useState<IFilteredDate>(filteredDate as IFilteredDate);

  useLayoutEffect(() => {
    (async () => {
      try {
        await throwIfNoInternetConnection();
        setIsConnected(true);
      } catch (error) {
        setIsConnected(false);
      }
    })();
  }, []);

  const { data } = useQuery<{ getProductHistory: IProductHistory }>(GET_PRODUCT_HISTORY, {
    variables: {
      inventoryId: product.inventoryId,
      shopId: product.shopId,
      from: filteredDate?.from,
      to: filteredDate?.to,
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

  const handleFilterByDate = (currentDate: number) => {
    setSelectedDate(currentDate);
    let filterData = getDates(dateOptions[currentDate]);
    if (currentDate === 8) filterData = { from: resetDateHrs(dateRange.from), to: dateRange.to };
    setFilteredDate(filterData);
  };

  const handleDropDown = (val: number) => {
    if (val !== 8) {
      return handleFilterByDate(val);
    } else {
      setSelectedDate(8);
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

  const dopdownFilterOptions = ["All History", "Damaged", "Returned", "Lost", "Restocked", "Sold"];
  const [historyRecord, setHistoryRecord] = useState<IProductHistoryRecord[]>(
    data?.getProductHistory?.records!
  );

  useEffect(() => {
    switch (dopdownFilterOptions[selectedFilter]) {
      case "All History":
        setHistoryRecord(data?.getProductHistory?.records!);
        break;
      case "Damaged":
        setHistoryRecord(data?.getProductHistory?.records.filter((his) => his.type === "DAMAGE")!);
        break;
      case "Returned":
        setHistoryRecord(data?.getProductHistory?.records.filter((his) => his.type === "RETURN")!);
        break;
      case "Lost":
        setHistoryRecord(data?.getProductHistory?.records.filter((his) => his.type === "LOST")!);
        break;
      case "Sold":
        setHistoryRecord(
          data?.getProductHistory?.records.filter((his) => his.type === "MAKE_SALE")!
        );
        break;
      case "Restocked":
        setHistoryRecord(data?.getProductHistory?.records.filter((his) => his.type === "RESTOCK")!);
        break;
      default:
        setHistoryRecord(data?.getProductHistory?.records!);
        break;
    }
  }, [selectedFilter, data]);

  return (
    <>
      {isConnected ? (
        <>
          <Flex alignItems="center" justifyContent="space-between">
            <DateDropdown
              width="120px"
              height="1.875rem"
              padding="0.625rem 0"
              borderRadius="0.5rem"
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
            <Text color={Colors.blackLight} fontSize="1rem">
              {data?.getProductHistory.totalQuantitySold} Piece(s) Sold
            </Text>
          </Flex>

          <Flex width="100%" margin="1.25rem 0px">
            <SalesCard background={Colors.deepSkyBlue} width="100%" height="3.5rem">
              <Flex direction="column" alignItems="center" justifyContent="center">
                <Text color={Colors.greyBlue} fontSize="0.5rem">
                  Profit Made
                </Text>
                <Text color={Colors.darkGreen} fontSize=".8rem" fontWeight="500">
                  {formatAmount(data?.getProductHistory.totalProfit)}
                </Text>
              </Flex>
              <Flex direction="column" alignItems="center" justifyContent="center">
                <Text color={Colors.greyBlue} fontSize="0.5rem">
                  Total Sale
                </Text>
                <Text color={Colors.primaryColor} fontSize=".8rem" fontWeight="500">
                  {formatAmount(data?.getProductHistory.totalSales)}
                </Text>
              </Flex>
              <Flex direction="column" alignItems="center" justifyContent="center">
                <Text color={Colors.greyBlue} fontSize="0.5rem">
                  Damaged
                </Text>
                <Text color={Colors.red} fontSize=".8rem" fontWeight="500">
                  {formatAmount(data?.getProductHistory.totalDamage)}
                </Text>
              </Flex>
            </SalesCard>
          </Flex>

          <Flex alignItems="center" justifyContent="space-between">
            <Text fontWeight="500" color={Colors.black} fontSize="1rem">
              History
            </Text>
            <CustomDropdown
              width="10rem"
              color="#130F26"
              containerColor="white"
              border={Colors.grey}
              borderRadius="0.5rem"
              height="2.2rem"
              icon={FilterIconDark}
              dropdownIcon={dropIconBlue}
              options={dopdownFilterOptions}
              setValue={setSelectedFilter}
              fontSize="0.875rem"
              selected={selectedFilter}
              padding="0.625rem 0.3125rem"
            />
          </Flex>

          {historyRecord && historyRecord.length > 0 ? (
            <>
              {historyRecord?.map((record, index, array) => (
                <ProductHistoryRow
                  key={record?.productHistoryId}
                  record={record!}
                  isLastItem={index === array.length - 1}
                />
              ))}
            </>
          ) : (
            <>
              <Flex
                direction="column"
                justifyContent="center"
                margin="6.25rem 0px 0 0"
                alignItems="center"
              >
                <Text margin="4px 0px" color={Colors.blackLight} fontSize="1.2rem" fontWeight="500">
                  There are no records to display.
                </Text>
                {dopdownFilterOptions[selectedFilter] !== "All History" && (
                  <Text color={Colors.grey} fontSize=".8rem">
                    No record Match your filter "<b>{dopdownFilterOptions[selectedFilter]}</b>"
                  </Text>
                )}
              </Flex>
            </>
          )}
        </>
      ) : (
        <>
          <NoInternetComp />
        </>
      )}
    </>
  );
};

export default ProductHistory;
