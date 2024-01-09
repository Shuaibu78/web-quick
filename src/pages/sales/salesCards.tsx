/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable indent */
/* eslint-disable max-len */
/* eslint-disable comma-dangle */
import { Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { hasPermission } from "../../helper/comparisons";
import { FunctionComponent } from "react";
import { SalesCard } from "../home/style";
import { Colors } from "../../GlobalStyles/theme";
import { useAppSelector } from "../../app/hooks";
import { getUserPermissions } from "../../app/slices/roles";
import { formatAmountIntl } from "../../helper/format";
import OutofStockIcon from "../../assets/OutOfStockIcon.svg";
import DiscountIcon from "../../assets/DiscountIcon.svg";
import OnlineSalesIcon from "../../assets/OnlineSalesIcon.svg";
import CashIcon from "../../assets/CashIcon.svg";
import PosIcon from "../../assets/PosIcon.svg";
import TransferIcon from "../../assets/TransferIcon.svg";
import EyeIcons from "../../assets/EyeIcon.svg";
import EyeIconFigorr from "../../assets/EyeIconFigorr.svg";
import Calendar from "../../assets/Calendar2.svg";
import DateDropdown from "../../components/dateDropdown/dateDropdown";
import { isFigorr } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { setHideSalesNav } from "../../app/slices/userPreferences";

const { white, darkGreen } = Colors;

interface SalesCardsProps {
  handleDropDown: Function;
  handleFilterByDate: Function;
  setShowFilterModal: Function;
  selectedDate: number;
  dateOptions: any;
  dateRange: any;
  getStartDate: any;
  getEndDate: any;
  shouldViewSales: any;
  totalAmounts: any;
}

const SalesCards: FunctionComponent<SalesCardsProps> = ({
  handleDropDown,
  handleFilterByDate,
  selectedDate,
  dateOptions,
  dateRange,
  getStartDate,
  getEndDate,
  shouldViewSales,
  totalAmounts,
}) => {
  const {
    user: userInfo,
    shops: { currentShop },
  } = useAppSelector((state) => state);
  const userPermissions = useAppSelector(getUserPermissions);
  const isMerchant = userInfo?.userId === currentShop?.userId;
  const shouldViewAllSales = hasPermission("VIEW_ALL_SALES", userPermissions);
  const dispatch = useDispatch();
  const preferences = useAppSelector((state) => state.userPreferences.preferences);
  const currentUserId = useAppSelector((state) => state.user.userId);
  const userPreference = preferences.find((user) => user.userId === currentUserId);

  return (
    <>
      <Flex direction="column">
        {(isMerchant || shouldViewAllSales) && (
          <div
            style={{
              display: "flex",
              marginBottom: "0.3125rem",
              columnGap: "2rem",
              alignItems: "center",
              marginBlock: "0.625rem",
            }}
          >
            <DateDropdown
              width="7.5rem"
              height="1.875rem"
              padding="0.625rem 0"
              borderRadius=".5rem"
              icon={Calendar}
              dateOptions={dateOptions}
              selectedDate={selectedDate}
              setSelectedDate={(val: number) => handleDropDown(val)}
              handleApply={() => handleFilterByDate(8)}
              dateRange={dateRange}
              getStartDate={getStartDate}
              getEndDate={getEndDate}
            />
            <Span
              color="#607087"
              fontSize=".875rem"
              style={{
                fontStyle: "italic",
              }}
            >
              Showing an overview of your business analytics for{" "}
              <b>
                "
                {selectedDate === 8
                  ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`
                  : dateOptions[selectedDate]}
                "
              </b>
            </Span>
          </div>
        )}
        <Flex
          justifyContent="start"
          height={userPreference?.hideSalesNav ? "4.375rem" : "0rem"}
          minHeight="0rem"
          overflow="hidden"
          width="100%"
          maxHeight="4.375rem"
          style={{ marginTop: !shouldViewAllSales ? "0.625rem" : "opx" }}
          transition="height 0.5s ease-in-out"
        >
          <SalesCard height="4.375rem" width="35%">
            <Flex width="" justifyContent="start" direction="row">
              <Flex width="" justifyContent="space-between" direction="column">
                <Span>Total Sales Balance</Span>
                <Flex style={{ columnGap: "1rem" }} alignItems="center">
                  <Span fontSize=".9375rem" fontWeight="500">
                    {(isMerchant || shouldViewAllSales || shouldViewSales) === false
                      ? "----"
                      : formatAmountIntl(undefined, totalAmounts.totalSales || 0)}
                  </Span>
                  <Flex className="profit" bg={white} borderRadius=".375rem" alignItems="center">
                    <Span fontSize=".6875rem" color="#9EA8B7">
                      Profit:
                    </Span>{" "}
                    <Span fontSize=".6875rem" fontWeight="500" color={darkGreen}>
                      {(isMerchant || shouldViewAllSales || shouldViewSales) === false
                        ? "---"
                        : formatAmountIntl(undefined, totalAmounts.totalProfit || 0)}
                    </Span>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
            <Flex width="" justifyContent="space-between" direction="column">
              <Span fontSize=".8125rem" fontWeight="normal">
                Returned Sales
              </Span>
              <Span fontSize=".9375rem" fontWeight="500">
                {(isMerchant || shouldViewAllSales || shouldViewSales) === false
                  ? "---"
                  : formatAmountIntl(undefined, totalAmounts.totalRefundAmount || 0)}
              </Span>
            </Flex>
          </SalesCard>
          <SalesCard
            style={{ marginLeft: "1rem" }}
            background={Colors.secondaryColor}
            height="4.375rem"
            width="35%"
          >
            {isFigorr ? null : (
              <Flex width="" justifyContent="space-between" direction="column" margin="0 1rem 0 0">
                <Flex>
                  <img src={OnlineSalesIcon} alt="" />
                  <Span margin="0 0 0 .5rem" fontSize=".8125rem" fontWeight="normal" color="white">
                    Online Sales
                  </Span>
                </Flex>
                <Span fontSize=".9375rem" fontWeight="500" color="white">
                  {(isMerchant || shouldViewAllSales || shouldViewSales) === false
                    ? "----"
                    : formatAmountIntl(undefined, totalAmounts.online || 0)}
                </Span>
              </Flex>
            )}
            <Flex width="" justifyContent="space-between" direction="column">
              <Flex>
                <img src={CashIcon} alt="" />
                <Span margin="0 0 0 .5rem" fontSize=".8125rem" fontWeight="normal" color="white">
                  Cash
                </Span>
              </Flex>
              <Span fontSize=".9375rem" fontWeight="500" color="white">
                {(isMerchant || shouldViewAllSales || shouldViewSales) === false
                  ? "----"
                  : formatAmountIntl(undefined, totalAmounts.Cash || 0)}
              </Span>
            </Flex>
            <Flex width="" justifyContent="space-between" direction="column">
              <Flex>
                <img src={TransferIcon} alt="" />
                <Span margin="0 0 0 .5rem" fontSize=".8125rem" fontWeight="normal" color="white">
                  Transfer
                </Span>
              </Flex>
              <Span fontSize=".9375rem" fontWeight="500" color="white">
                {(isMerchant || shouldViewAllSales || shouldViewSales) === false
                  ? "----"
                  : formatAmountIntl(undefined, totalAmounts.Transfer || 0)}
              </Span>
            </Flex>
            <Flex width="" justifyContent="space-between" direction="column">
              <Flex>
                <img src={PosIcon} alt="" />
                <Span margin="0 0 0 .5rem" fontSize=".8125rem" fontWeight="normal" color="white">
                  POS
                </Span>
              </Flex>
              <Span fontSize=".9375rem" fontWeight="500" color="white">
                {(isMerchant || shouldViewAllSales || shouldViewSales) === false
                  ? "----"
                  : formatAmountIntl(undefined, totalAmounts.Pos || 0)}
              </Span>
            </Flex>
          </SalesCard>
          <SalesCard
            style={{ marginLeft: "1rem" }}
            height="4.375rem"
            width="25%"
            background="#ECEFF4"
            color="#9EA8B7"
          >
            <Flex width="25rem" justifyContent="space-between" direction="column">
              <Flex>
                <img src={DiscountIcon} alt="" />
                <Span margin="0 0 0 .5rem" fontSize=".8125rem" fontWeight="normal">
                  {Math.abs(totalAmounts?.totalSurplus) > totalAmounts.totalDiscount
                    ? "Surplus"
                    : "Discount"}
                </Span>
              </Flex>
              <Span color={"red"} fontSize=".9375rem" fontWeight="500">
                {(isMerchant || shouldViewAllSales || shouldViewSales) === false
                  ? "----"
                  : formatAmountIntl(
                      undefined,
                      Math.abs(
                        Math.abs(totalAmounts.totalSurplus || 0) -
                          Math.abs(totalAmounts.totalDiscount || 0)
                      )
                    )}
              </Span>
            </Flex>
            <Flex width="25rem" justifyContent="space-between" direction="column">
              <Flex>
                <img src={OutofStockIcon} alt="" />
                <Span margin="0 0 0 .5rem" fontSize=".8125rem" fontWeight="normal">
                  Credit Sale
                </Span>
              </Flex>
              <Span color={"red"} fontSize=".9375rem" fontWeight="500">
                {(isMerchant || shouldViewAllSales || shouldViewSales) === false
                  ? "----"
                  : formatAmountIntl(undefined, totalAmounts.totalCredit || 0)}
              </Span>
            </Flex>
          </SalesCard>
        </Flex>
      </Flex>

      <Flex
        width="fit-content"
        cursor="pointer"
        onClick={() => {
          dispatch(
            setHideSalesNav({
              userId: userInfo.userId as string,
              hideSalesNav: !userPreference?.hideSalesNav,
              hideProductsNav: userPreference?.hideProductsNav as boolean,
              appSize: userPreference?.appSize as string,
            })
          );
        }}
        margin=".3125rem 0px 0 0"
      >
        {!userPreference?.hideSalesNav ? (
          <img src={isFigorr ? EyeIconFigorr : EyeIcons} alt="" />
        ) : (
          <span style={{ height: "1.125rem", width: "1.125rem" }}>
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
            lineHeight: "1rem",
            marginLeft: ".5rem",
            fontStyle: "italic",
          }}
        >
          Click to {userPreference?.hideSalesNav ? "hide" : "show"} sales details card from
          displaying on the screen.
        </p>
      </Flex>
    </>
  );
};

export default SalesCards;
