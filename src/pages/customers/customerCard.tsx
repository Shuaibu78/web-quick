import TransferIcon from "../../assets/DiscountIcon.svg";
import PeopleOwe from "../../assets/PeopleOwe.svg";
import { SalesCard } from "../home/style";
import { Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { Flex } from "../../components/receipt/style";
import React, { useEffect } from "react";
import { formatAmountIntl } from "../../helper/format";
import { GET_ALL_CUSTOMERS } from "../../schema/customer.schema";
import { useLazyQuery } from "@apollo/client";
import { useAppSelector } from "../../app/hooks";
import { getCurrentShop } from "../../app/slices/shops";
import { ICustomer } from "../../interfaces/inventory.interface";
import { useDispatch } from "react-redux";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import FilterIcon from "../../assets/FilterIcon.svg";
import dropIcon from "../../assets/dropIcon2.svg";
import CustomDropdown from "../../components/custom-dropdown/custom-dropdown";
import Calendar from "../../assets/Calendar2.svg";
import ArrowUp from "../../assets/ArrowUp.svg";
import ArrowDown from "../../assets/ArrowDown2.svg";
import DateDropdown from "../../components/dateDropdown/dateDropdown";

interface CustomerCardProps {
  totalCreditData: any;
  totalDepositData: any;
  handleDebtFilterDropDown: (n: number) => void;
  debtDateFilter: (string | number)[];
  selectedDebtDate: number;
  dateRange: any;
  setDateRange: Function;
  handleApplyFilter: Function;
  getStartDate: Function;
  getEndDate: Function;
}

const CustomerCards = (props: CustomerCardProps) => {
  const currentShop = useAppSelector(getCurrentShop);
  const {
    totalCreditData,
    totalDepositData,
    selectedDebtDate,
    debtDateFilter,
    handleDebtFilterDropDown,
    getStartDate,
    getEndDate,
    dateRange,
    handleApplyFilter,
  } = props;
  const dispatch = useDispatch();

  const [getAllCustomers, { data }] = useLazyQuery<{
    getAllCustomers: {
      customers: [ICustomer];
      totalCustomers: number;
    };
  }>(GET_ALL_CUSTOMERS, {
    variables: {
      shopId: currentShop?.shopId,
      page: 1,
      limit: 10,
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
    getAllCustomers();
  }, []);

  const totalCredit = totalCreditData?.getTotalCredits! ?? 0;
  const totalDebt = totalDepositData?.getTotalDeposits! ?? 0;

  return (
    <div>
      <div
        style={{
          display: "flex",
          marginBottom: "5px",
          columnGap: "2rem",
          alignItems: "center",
          marginBlock: "10px",
        }}
      >
        {/* <CustomDropdown
          width="200px"
          height="40px"
          bgColor="#F4F6F9"
          fontSize="14px"
          borderRadius="12px"
          containerColor="#F4F6F9"
          color="#8196B3"
          selected={selectedDebtDate}
          setValue={(val) => handleDebtFilterDropDown(val)}
          options={debtDateFilter}
          dropdownIcon={dropIcon}
          icon={Calendar}
          boxShadow="0px 4px 30px rgba(140, 157, 181, 0.08)"
        /> */}
        <DateDropdown
          width="120px"
          height="30px"
          padding="10px 0"
          borderRadius="8px"
          icon={Calendar}
          dateOptions={debtDateFilter as string[]}
          selectedDate={selectedDebtDate}
          setSelectedDate={(val: number) => handleDebtFilterDropDown(val)}
          handleApply={() => handleApplyFilter(8)}
          dateRange={dateRange}
          getEndDate={getEndDate}
          getStartDate={getStartDate}
        />
        <Span color="#607087" fontSize="14px">
          Showing an overview of your business analytics for{" "}
          <b>
            "
            {selectedDebtDate === 8
              ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
              : debtDateFilter[selectedDebtDate]}
            "
          </b>
        </Span>
      </div>
      <div style={{ display: "flex", marginTop: "1rem", justifyContent: "center" }}>
        <SalesCard direction="column" height="fit" width="100%" background="#19113D">
          <Flex width="" justifyContent="start">
            <Flex width="" justifyContent="space-between" alignItems="center" gap="1rem">
              <Span color="#fff" fontSize="1.5rem">Customers</Span>
              <Span fontSize="25px" fontWeight="500" color="#fff">
                {data?.getAllCustomers.totalCustomers ?? 0}
              </Span>
            </Flex>
          </Flex>
          <SalesCard style={{ margin: "1rem 0" }} border="1px solid #fff" background="#fff" height="70px" width="100%">
            <Flex width="" justifyContent="space-between" alignItems="center" flexDirection="column">
              <Flex>
                {/* <img src={ArrowUp} alt="" /> */}
                <Span fontSize="16px" color="#9EA8B7" fontWeight="normal">
                  Total Credit
                </Span>
              </Flex>
              <Span fontSize="22px" color="red" fontWeight="500">
                {formatAmountIntl(undefined, totalCredit)}
              </Span>
            </Flex>
            <Flex width="" justifyContent="space-between" alignItems="center" flexDirection="column">
              <Flex>
                {/* <img src={ArrowDown} alt="" /> */}
                <Span fontSize="16px" color="#9EA8B7" fontWeight="normal">
                  Amount Paid
                </Span>
              </Flex>
              <Span color="green" fontSize="22px" fontWeight="500">
                {formatAmountIntl(undefined, totalDepositData?.getTotalDeposits ?? 0)}
              </Span>
            </Flex>
            <Flex width="" justifyContent="space-between" alignItems="center" flexDirection="column">
              <Span fontSize="16px" fontWeight="normal" color="#607087">
                Balance Remainig
              </Span>
              <Span fontSize="22px" fontWeight="500" color="#607087">
                {formatAmountIntl(
                  undefined,
                  Math.abs(
                    totalCredit -
                    (totalDepositData?.getTotalDeposits ?? 0)
                  )
                )}
              </Span>
            </Flex>
          </SalesCard>
        </SalesCard>
      </div>
    </div>
  );
};

export default CustomerCards;
