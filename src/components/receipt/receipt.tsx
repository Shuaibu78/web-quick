/* eslint-disable indent */
/* eslint-disable comma-dangle */
/* eslint-disable max-len */
import { useQuery } from "@apollo/client";
import React, { FunctionComponent, useEffect } from "react";
import documentIcon from "../../assets/Document.svg";
import UserAvatar from "../../assets/UserAvatar.svg";
import MakeRefund from "../../assets/MakeRefund.svg";
import FigorrMakeRefund from "../../assets/MakeRefundFigorr.svg";
import ReceiptIcon from "../../assets/ReceiptIcon.svg";
import FigorrReceiptIcon from "../../assets/ReceiptIconFigorr.svg";
import { IReceipt } from "../../interfaces/receipt.interface";
import { IAllSales } from "../../interfaces/sales.interface";
import { GET_ALL_SALES, GET_MULTIPLE_PAYMENT_METHOD } from "../../schema/sales.schema";
import { Button } from "../button/Button";
import {
  Header,
  PreReceiptContainer,
  CashierCard,
  CashierDetails,
  SubDetails,
  SubCard,
  Flex,
  ListItem,
  BorderTop,
  FlexItem,
  ItemsContainer,
  Container,
  Input,
} from "./style";
import { RefundForm, CancelButton, FormHeading, Label } from "../../pages/sales/style";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import cancelIcon from "../../assets/cancel.svg";
import dropIcon from "../../assets/dropIcon2.svg";
import { formatAmountIntl } from "../../helper/format";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { getDefaultPrinter, printReceipt } from "../../helper/printing";
import { IShop } from "../../interfaces/shop.interface";
import CustomDropdown from "../custom-dropdown/custom-dropdown";
import PopupCard from "../popUp/PopupCard";
import { isDateGreaterThan24HoursAgo } from "../../helper/date";
import { hasPermission } from "../../helper/comparisons";
import { getUserPermissions } from "../../app/slices/roles";
import { Colors } from "../../GlobalStyles/theme";
import { Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { isFigorr } from "../../utils/constants";
import { isPositive } from "../../utils/helper.utils";

interface ReceiptProps {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>;
  receipt: IReceipt | null;
  showForm: boolean;
  reasonSelected: string;
  setReasonSelected: React.Dispatch<React.SetStateAction<string>>;
  paymentMethodOption: string[];
  handleProcessRefund: (event: any) => void;
  setPaymentSelected: React.Dispatch<React.SetStateAction<number>>;
  paymentSelected: number;
}

const Receipt: FunctionComponent<ReceiptProps> = ({
  setShowForm,
  receipt,
  showForm,
  paymentMethodOption,
  // reasonSelected,
  setReasonSelected,
  handleProcessRefund,
  setPaymentSelected,
  paymentSelected,
}) => {
  const { shops } = useAppSelector((state) => state);
  const currentShop = shops.currentShop;
  const dispatch = useAppDispatch();

  const { user: userInfo } = useAppSelector((state) => state);
  const reduxSelector = useAppSelector((state) => state);
  const userPermissions = useAppSelector(getUserPermissions);
  const isMerchant = userInfo?.userId === reduxSelector?.shops?.currentShop?.userId;
  const shouldManageSales = hasPermission("MANAGE_SALE", userPermissions);
  const shouldManageAllSales = hasPermission("MANAGE_ALL_SALES", userPermissions);
  const preferences = useAppSelector((state) => state.userPreferences.preferences);
  const currentUserId = useAppSelector((state) => state.user.userId);
  const userPreference = preferences.find((user) => user.userId === currentUserId);

  const { data: salesData } = useQuery<{ getAllSales: IAllSales }>(GET_ALL_SALES, {
    variables: {
      shopId: currentShop?.shopId,
      receiptId: receipt?.receiptId,
    },
    skip: !currentShop?.shopId,
    fetchPolicy: "network-only",
    onError: (error) => {
      if (currentShop?.shopId) {
        dispatch(
          toggleSnackbarOpen({
            message: error?.message || error?.graphQLErrors[0]?.message,
            color: "DANGER",
          })
        );
      }
    },
  });

  const { data: paymentData } = useQuery<{
    getMultiplePaymentInfo: { paymentMethod: string; amount: number }[];
  }>(GET_MULTIPLE_PAYMENT_METHOD, {
    variables: {
      shopId: currentShop?.shopId,
      receiptId: receipt?.receiptId,
    },
    skip: !currentShop?.shopId || !receipt?.receiptId,
    fetchPolicy: "network-only",
    onError: (error) => {
      if (currentShop?.shopId) {
        dispatch(
          toggleSnackbarOpen({
            message: error?.message || error?.graphQLErrors[0]?.message,
            color: "DANGER",
          })
        );
      }
    },
  });

  useEffect(() => {
    if (receipt?.paymentMethod === "Cash" || receipt?.paymentMethod === "CREDIT") {
      setPaymentSelected(0);
    } else if (receipt?.paymentMethod === "Pos") {
      setPaymentSelected(1);
    } else {
      setPaymentSelected(2);
    }
  }, [receipt?.totalAmount, receipt?.receiptId]);

  const handlePrintReceipt = async (singleReceipt: IReceipt, shop: IShop, e: any) => {
    e.preventDefault();
    if ((await getDefaultPrinter()) === null) {
      dispatch(
        toggleSnackbarOpen({
          message: "Please set a default printer from settings page before making sales.",
          color: "INFO",
        })
      );
      return;
    }
    printReceipt(singleReceipt, shop);
  };

  const totalAmountWithoutTax =
    receipt?.version && receipt?.version >= 2
      ? (receipt?.totalTaxAmount as number) > 0 ||
        ((receipt?.totalDisplayedAmount as number) > 0 &&
          isPositive(receipt?.totalDiscount as number) === false)
        ? (receipt?.totalDisplayedAmount as number)
        : (receipt?.totalAmount as number) + (receipt?.totalDiscount as number)
      : (receipt?.totalAmount as number) + (receipt?.totalDiscount as number);

  return (
    <Container style={{ margin: "0.625rem 0.3125rem", height: "100%" }}>
      {receipt && (
        <Header>
          <h2>Receipt Details</h2>

          <FlexItem
            width="55%"
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {(isMerchant || shouldManageSales || shouldManageAllSales) &&
              !receipt?.isRefunded &&
              receipt?.refundedReceiptId === null &&
              isDateGreaterThan24HoursAgo(new Date(receipt?.createdAt).getMilliseconds()) ===
                false && (
                <Flex
                  onClick={() => {
                    setShowForm(true);
                  }}
                  style={{ columnGap: ".5rem", cursor: "pointer" }}
                >
                  <img src={isFigorr ? FigorrMakeRefund : MakeRefund} alt="" />
                  <Span color={Colors.secondaryColor}>Make Refund</Span>
                </Flex>
              )}
            <Flex
              onClick={(e) => {
                handlePrintReceipt(receipt!, currentShop, e);
              }}
              style={{ columnGap: ".5rem", cursor: "pointer" }}
            >
              <img src={isFigorr ? FigorrReceiptIcon : ReceiptIcon} alt="" />
              <Span color={Colors.secondaryColor}>Print Receipt</Span>
            </Flex>
          </FlexItem>
        </Header>
      )}
      {!receipt && (
        <PreReceiptContainer>
          <img src={documentIcon} alt="" />
          <h3>View Receipt Details</h3>
          <p>Click on a receipt on the left panel to view the details here.</p>
        </PreReceiptContainer>
      )}
      {receipt && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <SubCard style={{ margin: "0.625rem 0 0 0" }}>
            <Flex alignItems="center" justifyContent="space-between" padding="0px 0 0.3125rem 0">
              <h3>Sales Details</h3>
              <ListItem>
                Items <span>{salesData?.getAllSales?.totalSales || "0"}</span>
              </ListItem>
            </Flex>
            <Flex justifyContent="space-between" padding="0px 0 2px 0">
              <FlexItem width="50%" flexDirection="column" alignItems="flex-start">
                <ListItem margin="6px 0">
                  Payment Method {"  "} <span>{receipt.paymentMethod}</span>
                </ListItem>
                {paymentData
                  ? paymentData.getMultiplePaymentInfo.map(({ paymentMethod, amount }) => (
                      <Flex width="100%" alignItems="center" gap="1rem">
                        <Span fontSize="0.9rem" color={Colors.blackLight}>
                          {paymentMethod}:{" "}
                        </Span>{" "}
                        <Span fontSize="0.9rem" color={Colors.blackLight}>
                          {formatAmountIntl(undefined, amount)}
                        </Span>
                      </Flex>
                    ))
                  : null}
                {receipt?.CustomerTransaction && (
                  <ListItem margin="4px 0">
                    Customer {"  "} <span>{receipt.customerName}</span>
                  </ListItem>
                )}
              </FlexItem>
              <FlexItem>
                {receipt?.CustomerTransaction && (
                  <>
                    <ListItem margin="6px 0">
                      Sold on Credit {"  "}
                      <span>{receipt?.CustomerTransaction ? "Yes" : "No"}</span>
                    </ListItem>
                    <ListItem margin="0.625rem 0">
                      Total Sale {"  "}
                      <span>{formatAmountIntl(undefined, receipt.totalAmount)}</span>
                    </ListItem>
                  </>
                )}
              </FlexItem>
            </Flex>
            {receipt.comment && (
              <BorderTop>
                <ListItem>
                  Comment <span>{receipt.comment}</span>
                </ListItem>
              </BorderTop>
            )}
          </SubCard>
          <div
            className="receiptItemsContainer"
            style={{
              maxHeight: userPreference?.hideSalesNav ? "12.5rem" : "265px",
              minHeight: "12.5rem",
              overflowY: "scroll",
              overflowX: "hidden",
              padding: "0px 0.625rem",
              margin: "0.625rem 0px",
            }}
          >
            <ItemsContainer>
              <Flex backgroundColor="#F6F8FB" borderRadius="1rem" flexDirection="column">
                {salesData?.getAllSales?.sales.map((val, i) => (
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    margin="0px 0"
                    padding="0.3125rem"
                    height="1.875rem"
                    key={i}
                  >
                    <FlexItem width="100%" height="100%">
                      <Flex flexDirection="column" justifyContent="space-between" height="3.75rem">
                        <Flex justifyContent="space-between" padding="0 0.625rem">
                          <p>
                            {val.inventoryName} x &nbsp;
                            {val.pack
                              ? (
                                  Number(val?.quantity) / val?.Inventory?.TrackableItem?.perPack!
                                ).toFixed(0) || 1
                              : val.quantity}{" "}
                            {val?.inventoryType === "NON_TRACKABLE"
                              ? ""
                              : val?.inventoryType === "VARIATION"
                              ? "Variant"
                              : val.pack
                              ? "Pack"
                              : "items"}
                          </p>{" "}
                          <span>
                            {formatAmountIntl(
                              undefined,
                              Number(val?.amount) + Number(val?.discount)
                            )}
                          </span>
                        </Flex>
                      </Flex>
                    </FlexItem>
                  </Flex>
                ))}
              </Flex>
              <Flex
                justifyContent="flex-end"
                alignItems="center"
                padding="0.625rem 0 0  0px"
                margin="0.625rem 0"
                style={{ position: "relative", bottom: 0 }}
              >
                <FlexItem width="50%">
                  <Flex justifyContent="space-between">
                    <ListItem>Sub Total</ListItem>{" "}
                    <ListItem>
                      {receipt?.CustomerTransaction
                        ? formatAmountIntl(
                            undefined,
                            receipt?.version && receipt?.version < 2
                              ? totalAmountWithoutTax +
                                  (receipt?.creditAmount as number) -
                                  (receipt?.isTaxInclusive ? Number(receipt.totalTaxAmount) : 0)
                              : totalAmountWithoutTax
                          )
                        : formatAmountIntl(undefined, totalAmountWithoutTax)}
                    </ListItem>
                  </Flex>
                  {receipt.totalDiscount > 0 && isPositive(receipt.totalDiscount) !== false && (
                    <Flex justifyContent="space-between">
                      <ListItem>Discount</ListItem>{" "}
                      <ListItem>-{formatAmountIntl(undefined, receipt.totalDiscount)}</ListItem>
                    </Flex>
                  )}
                  {isPositive(receipt.totalDiscount) === false && (
                    <Flex justifyContent="space-between">
                      <ListItem>Surplus</ListItem>{" "}
                      <ListItem>{formatAmountIntl(undefined, receipt.totalDiscount * -1)}</ListItem>
                    </Flex>
                  )}

                  {(receipt?.totalTaxAmount as number) > 0 && (
                    <Flex justifyContent="space-between">
                      <ListItem>
                        Tax ({receipt?.isTaxInclusive ? "Inclusive" : "Exclusive"})
                      </ListItem>{" "}
                      <ListItem>
                        {formatAmountIntl(undefined, Number(receipt.totalTaxAmount))}
                      </ListItem>
                    </Flex>
                  )}
                  {receipt.CustomerTransaction ? (
                    <Flex justifyContent="space-between">
                      <p>Amount Paid</p>
                      <p>
                        {formatAmountIntl(
                          undefined,
                          receipt?.version && receipt?.version < 2
                            ? receipt.totalAmount
                            : receipt.totalAmount - receipt.creditAmount
                        )}
                      </p>
                    </Flex>
                  ) : (
                    <Flex justifyContent="space-between">
                      <p>Total</p>
                      <p>{formatAmountIntl(undefined, receipt.totalAmount)}</p>
                    </Flex>
                  )}
                  {receipt.CustomerTransaction && (
                    <Flex justifyContent="space-between">
                      <ListItem>Balance</ListItem>{" "}
                      <ListItem color="#FF0000">
                        ({formatAmountIntl(undefined, Number(receipt.creditAmount))})
                      </ListItem>
                    </Flex>
                  )}
                </FlexItem>
              </Flex>
            </ItemsContainer>
          </div>
          <Flex style={{ position: "absolute", bottom: "0" }} gap="1.875rem 0px">
            <CashierCard>
              <CashierDetails>
                <Flex justifyContent="flex-start" style={{ paddingInline: "1rem" }} width="100%">
                  <FlexItem width="100%">
                    <Flex alignItems="center">
                      <img src={UserAvatar} alt="product-image" />
                      <SubDetails>
                        <p style={{ color: "#9EA8B7" }}>Attended By</p>
                        <div>
                          <h4 style={{ color: "#607087" }}>{receipt.User?.fullName ?? "--"}</h4>
                          <p
                            style={{
                              color: Colors.primaryColor,
                              fontWeight: "500",
                              fontSize: "0.75rem",
                            }}
                          >
                            Sales Person
                          </p>
                        </div>
                      </SubDetails>
                    </Flex>
                  </FlexItem>
                </Flex>
              </CashierDetails>
            </CashierCard>
            {receipt.Cashier && (
              <CashierCard>
                <CashierDetails>
                  <Flex justifyContent="flex-start" style={{ paddingInline: "1rem" }} width="100%">
                    <FlexItem width="100%">
                      <Flex alignItems="center">
                        <img src={UserAvatar} alt="product-image" />
                        <SubDetails>
                          <p style={{ color: "#9EA8B7" }}>Cleared By</p>
                          <div>
                            <h4 style={{ color: "#607087" }}>{receipt.Cashier.fullName ?? "--"}</h4>
                            <p
                              style={{
                                color: Colors.primaryColor,
                                fontWeight: "500",
                                fontSize: "0.75rem",
                              }}
                            >
                              Cashier
                            </p>
                          </div>
                        </SubDetails>
                      </Flex>
                    </FlexItem>
                  </Flex>
                </CashierDetails>
              </CashierCard>
            )}
          </Flex>
        </div>
      )}
      {(!receipt?.isRefunded || receipt.refundedReceiptId) && showForm && (
        <PopupCard close={() => setShowForm(false)}>
          <RefundForm width="18.75rem">
            <Flex alignItems="center">
              <CancelButton onClick={() => setShowForm(false)}>
                <img src={cancelIcon} alt="" />
              </CancelButton>
              <FormHeading>Refund</FormHeading>
            </Flex>
            <div>
              <Flex
                padding="0.625rem 0"
                margin="0 0 1.875rem 0"
                width="100%"
                flexDirection="column"
              >
                <FlexItem width="100%">
                  <Label>Payment Method</Label>
                  <CustomDropdown
                    width="100%"
                    height="43px"
                    color="#607087"
                    borderRadius="0.75rem"
                    containerColor="#F4F6F9"
                    dropdownIcon={dropIcon}
                    fontSize="0.75rem"
                    selected={paymentSelected}
                    setValue={setPaymentSelected}
                    options={paymentMethodOption}
                    padding="0 0.625rem"
                    placeholder="Select Payment Method"
                  />
                </FlexItem>
                <FlexItem width="100%">
                  <Label>Reason for Refund</Label>
                  <Input
                    type="text"
                    placeholder="Enter your reason here"
                    onChange={(e: { target: { value: React.SetStateAction<string> } }) =>
                      setReasonSelected(e.target.value)
                    }
                    onKeyDown={(e: { key: string }) => {
                      if (e.key === "Enter") {
                        handleProcessRefund(e);
                      }
                    }}
                  />
                </FlexItem>
              </Flex>
              <Button
                label="Refund Customer"
                onClick={(event) => handleProcessRefund(event)}
                backgroundColor={Colors.primaryColor}
                size="lg"
                color="#fff"
                borderColor="transparent"
                borderRadius="0.75rem"
                borderSize="0px"
                fontSize="1rem"
                width="100%"
              />
            </div>
          </RefundForm>
        </PopupCard>
      )}
    </Container>
  );
};

export default Receipt;
