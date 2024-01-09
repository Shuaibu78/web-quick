/* eslint-disable indent */
import { Box, DarkText, Flex, LightText } from "../../style.onlinePresence";
import { useAppSelector } from "../../../../app/hooks";
import { getCurrentShop } from "../../../../app/slices/shops";
import { toggleSnackbarOpen } from "../../../../app/slices/snacbar";
import { IOrder, IOrderItems } from "../../../../interfaces/order.interface";
import { useMutation, useQuery } from "@apollo/client";
import { Button } from "../../../../components/button/Button";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { ModalContainer } from "../../../settings/style";
import Cancel from "../../../../assets/cancel.svg";
import { Colors } from "./../../../../GlobalStyles/theme";
import { formatOrderNumber } from "../utils.orders";
import { formatAmount } from "../../../../helper/format";
import { RadioLabel } from "../../../sales/new-sales/styles";
import { InputField } from "../../../../components/input-field/input";
import { ToggleButton } from "../../../staffs/style";
import toggleOn from "../../../../assets/toggleOn.svg";
import toggleOff from "../../../../assets/toggleOff.svg";
import dropIcon from "../../../../assets/dropIcon2.svg";
import orangePlusIcon from "../../../../assets/orangePlus.svg";
import greenPlusIcon from "../../../../assets/greenPlus.svg";
import CustomConfirm from "../../../../components/confirmComponent/cofirmComponent";
import { DELETE_ORDER_ITEM, GET_ORDER, MAKE_ORDER_PAYMENT } from "../../../../schema/orders.schema";
import { getImageUrl } from "../../../../helper/image.helper";
import CustomDropdown from "../../../../components/custom-dropdown/custom-dropdown";
import { AddButton } from "../../../inventory/add/style";
import { ICustomer } from "../../../../interfaces/inventory.interface";
import { GET_ALL_CUSTOMERS } from "../../../../schema/customer.schema";
import NewCustomer from "../../../customers/new-customer";
import { rpcClient } from "../../../../helper/rpcClient";
import { getDefaultPrinter, printInvoice } from "../../../../helper/printing";
import { getCurrentUser } from "../../../../app/slices/userInfo";
import { isFigorr } from "../../../../utils/constants";
import { validateInputNum } from "../../../../utils/formatValues";

interface OrderPaymentViewProps {
  orderId: string;
  showOrderPaymentView: boolean;
  closeModal: () => void;
  triggerRefetch: () => void;
}

export default function OrderPaymentView({
  orderId,
  showOrderPaymentView,
  closeModal,
  triggerRefetch,
}: OrderPaymentViewProps) {
  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<IOrder>({});
  const [discount, setDiscount] = useState(0);
  const [comment, setComment] = useState("");
  const [showExtraInputs, setShowExtraInputs] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [selectedCustomerIdx, setSelectedCustomerIdx] = useState(-1);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Cash");
  const [customerList, setCustomerList] = useState<ICustomer[]>([]);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const sellOnCredit = selectedPaymentMethod === "Credit";
  const totalAmount = (Number(order?.totalAmount) || 0) - discount - depositAmount;
  const currentUser = useAppSelector(getCurrentUser);

  const resetComponentStates = () => {
    setSelectedPaymentMethod("Cash");
    setDiscount(0);
    setComment("");
    setSelectedCustomerIdx(-1);
    setDepositAmount(0);
    setShowExtraInputs(false);
  };

  const PAYMENT_METHODS = ["Cash", "Pos", "Transfer", "Credit"];

  const toggleShowExtraInputs = () => setShowExtraInputs((prev) => !prev);

  const handleDiscountChange = (val: number) => {
    if (val <= (Number(currentShop?.maximumDiscount) / 100) * Number(order?.totalAmount)) {
      setDiscount(Number(val));
    } else {
      dispatch(
        toggleSnackbarOpen({
          message: `The discount is greater than the maximum discount ${
            currentShop?.currencyCode
          } ${(Number(currentShop?.maximumDiscount) / 100) * Number(order?.totalAmount)}`,
          color: "INFO",
        })
      );
    }
  };

  const { refetch: refetchOrder } = useQuery<{ getOrder: IOrder }>(GET_ORDER, {
    variables: {
      shopId: currentShop?.shopId,
      orderId: orderId || "",
    },
    onCompleted(result) {
      setOrder(result.getOrder);
    },
    fetchPolicy: "network-only",
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const { refetch: refetchCustomers } = useQuery<{
    getAllCustomers: {
      customers: [ICustomer];
    };
  }>(GET_ALL_CUSTOMERS, {
    variables: {
      shopId: currentShop?.shopId,
      limit: 100,
    },
    onCompleted(data) {
      setCustomerList(data?.getAllCustomers?.customers);
    },
    onError(error) {
      if (currentShop?.shopId) {
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      }
    },
  });

  const updateViews = () => {
    refetchOrder();
    triggerRefetch();
  };

  const [deleteOrderItem] = useMutation(DELETE_ORDER_ITEM, {
    onCompleted() {
      updateViews();
    },
  });

  const [makePayment] = useMutation(MAKE_ORDER_PAYMENT, {
    onCompleted() {
      updateViews();
      setIsLoading(false);
      dispatch(toggleSnackbarOpen("Payment successful"));
      closeModal();
    },
    onError(error) {
      setIsLoading(false);
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const handleDeleteOrderItem = async (orderItemId: string) => {
    if (!(await CustomConfirm("Are you sure you want to delete this item from order?"))) return;

    deleteOrderItem({
      variables: {
        shopId: currentShop?.shopId,
        orderItemId,
      },
    });
  };

  const [autoPrinterOrder, setAutoPrinterOrder] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await rpcClient.request("getDefaultPrinter", {});
        if (result) {
          setAutoPrinterOrder(JSON.parse(result?.value)?.autoPrintOnOrder ?? false);
        }
      } catch (error) {
        console.log(error);
        dispatch(toggleSnackbarOpen(error));
      }
    })();
  }, []);

  const handlePrintOrder = async () => {
    if ((await getDefaultPrinter()) === null) {
      dispatch(
        toggleSnackbarOpen("Please set a default printer from settings page before making sales.")
      );
      return;
    }
    try {
      await printInvoice(order, currentUser, currentShop);

      dispatch(
        toggleSnackbarOpen({
          message: "Order printed succesfully",
          color: "SUCCESS",
        })
      );
    } catch (err) {
      dispatch(
        toggleSnackbarOpen({
          message: "Failed to print",
          color: "DANGER",
        })
      );
    }
  };

  const handleOrderPayment = () => {
    const customer = customerList[selectedCustomerIdx];
    if (sellOnCredit && !customer) {
      dispatch(toggleSnackbarOpen("Please select a customer before selling on credit."));
      return;
    }

    setIsLoading(true);
    makePayment({
      variables: {
        shopId: currentShop?.shopId,
        orderId: orderId,
        customerId: customer?.customerId,
        customerName: customer?.customerName,
        depositAmount,
        paymentMethod: selectedPaymentMethod,
        discount,
        comment,
      },
    }).then((res) => {
      if (res?.data) {
        autoPrinterOrder && handlePrintOrder();
      }
    });
  };

  useEffect(() => {
    return () => resetComponentStates();
  }, [closeModal]);

  return showOrderPaymentView ? (
    <ModalContainer>
      <Box
        h="max-content"
        minW="31.25rem"
        w="max-content"
        p="1rem"
        bgColor="#fff"
        borderRadius="0.75rem"
      >
        <Box w="100%" display="flex" justifyContent="space-between" p="0.625rem auto">
          <DarkText fontSize="1.2rem">Make Payment</DarkText>
          <img src={Cancel} alt="close modal" onClick={closeModal} style={{ cursor: "pointer" }} />
        </Box>
        <Box mt="1rem">
          <Box w="100%">
            <Flex gap=".5rem" direction="column" mt="0.625rem">
              <Flex justifyContent="space-between">
                <LightText>
                  Total order: {formatOrderNumber(order?.orderNumber as number)}
                </LightText>

                <DarkText>Delete All</DarkText>
              </Flex>
              <Flex justifyContent="space-between" mb="0.625rem">
                <LightText>Total order: {order?.OrderItems?.length || 0}</LightText>

                <DarkText>Total unpaid: {formatAmount(order?.totalAmount)}</DarkText>
              </Flex>
            </Flex>
            <Box mx="1rem" maxH="12.5rem" overflowY="auto">
              {Number(order?.OrderItems?.length) > 0
                ? order?.OrderItems?.map((orderItem: IOrderItems, idx) => {
                    const { inventoryName, quantity, amountPerItem, amount, orderItemId } =
                      orderItem;
                    return (
                      <Box key={idx} mt="0.625rem">
                        <Flex justifyContent="space-between">
                          <Flex>
                            {/* column 1 */}
                            <Flex
                              onClick={() => handleDeleteOrderItem(orderItemId as string)}
                              cursor="pointer"
                              alignItems="center"
                              justifyContent="center"
                              size="1.25rem"
                              bgColor="red"
                              color="white"
                              borderRadius="
                            50%"
                              alignSelf="center"
                            >
                              <img
                                src={Cancel}
                                alt="close modal"
                                height="0.75rem"
                                width="0.75rem"
                              />
                            </Flex>

                            {/* column 2 */}
                            <Box borderRadius="0.75rem" mx="0.9375rem" h="3.125rem" w="3.125rem">
                              <img
                                src={getImageUrl()}
                                alt="inventory image"
                                height="100%"
                                width="100%"
                              />
                            </Box>

                            {/* column 3 */}
                            <Flex direction="column" gap="0.3125rem" justifyContent="center">
                              {/* // TODO: break line if inventoryName longer */}
                              <DarkText
                                fontWeight="600"
                                textTransform="capitalize"
                                textOverflow="ellipsis"
                              >
                                {inventoryName}
                              </DarkText>
                              <LightText>{`${quantity} x ${formatAmount(
                                amountPerItem || 0
                              )}`}</LightText>
                            </Flex>
                          </Flex>

                          <Flex h="100%" alignItems="center">
                            <DarkText fontWeight="600">{formatAmount(amount)}</DarkText>
                          </Flex>
                        </Flex>
                      </Box>
                    );
                  })
                : null}{" "}
              {/* OrderItems list */}
            </Box>

            <Box mt="1rem">
              <DarkText>Select payment option</DarkText>
              <Flex my=".5rem">
                {PAYMENT_METHODS.map((method, idx) => {
                  return (
                    <Flex key={idx}>
                      <RadioLabel
                        htmlFor={`${method}`}
                        onClick={() => setSelectedPaymentMethod(method)}
                        isActive={selectedPaymentMethod === method}
                        style={{ marginRight: "1.125rem" }}
                      >
                        <span>
                          <span></span>
                        </span>
                        {String(method)}
                      </RadioLabel>
                      <input type="radio" name={`${method}`} id={`${method}`} hidden />
                    </Flex>
                  );
                })}
              </Flex>
            </Box>

            <Flex w="100%" gap=".5rem" mt="1rem">
              <Box>
                <DarkText margin="auto auto 0.625rem">Discount (Naira)</DarkText>
                <InputField
                  type="text"
                  backgroundColor="#F4F6F9"
                  borderRadius="0.75rem"
                  size="lg"
                  fontSize="0.875rem"
                  color="#8196B3"
                  value={discount}
                  onChange={(e) => handleDiscountChange(Number(e.target.value))}
                />
              </Box>

              {sellOnCredit && (
                <Box m="1.5rem auto .5rem">
                  <CustomDropdown
                    width="100%"
                    height="2.5rem"
                    color="#607087"
                    borderRadius="0.75rem"
                    containerColor="#F4F6F9"
                    dropdownIcon={dropIcon}
                    fontSize="1rem"
                    selected={selectedCustomerIdx}
                    setValue={setSelectedCustomerIdx}
                    options={customerList?.map((customer) => customer?.customerName)}
                    padding="0 0.625rem"
                    margin="0 0 0.625rem 0"
                    placeholder="Select Customer"
                    label="Select Customer"
                  />
                  <AddButton
                    onClick={() => setShowAddCustomer(true)}
                    style={{ paddingTop: "0.3125rem" }}
                  >
                    <img src={isFigorr ? greenPlusIcon : orangePlusIcon} alt="" />
                    <span>Add New Customer</span>
                  </AddButton>
                  <InputField
                    placeholder="Deposit Amount"
                    type="text"
                    label="Deposit amount (Naira)"
                    backgroundColor="#F4F6F9"
                    size="lg"
                    color="#8196B3"
                    borderColor="transparent"
                    borderRadius="0.75rem"
                    borderSize="0"
                    fontSize="1rem"
                    width="100%"
                    value={depositAmount}
                    onChange={(e) => validateInputNum(setDepositAmount, e.target.value)}
                  />
                </Box>
              )}
            </Flex>

            <Box my=".5rem" maxH="12.5rem">
              <ToggleButton onClick={() => toggleShowExtraInputs()}>
                <img src={showExtraInputs ? toggleOn : toggleOff} alt="" />
                <span style={{ marginLeft: "1rem" }}>Add details to receipt</span>
              </ToggleButton>
              {showExtraInputs && (
                <textarea
                  name="comment"
                  style={{ width: "80%", height: "3.125rem" }}
                  id="comment"
                  placeholder="Type comment here"
                  value={comment}
                  rows={3}
                  onChange={(e) => setComment(e.target.value)}
                />
              )}
            </Box>
          </Box>
        </Box>

        <Flex mt="1.5625rem" w="100%" justifyContent="center">
          <Button
            label={
              isLoading
                ? "Loading..."
                : `Make payment ${formatAmount(sellOnCredit ? depositAmount : totalAmount || 0)}`
            }
            disabled={isLoading || order?.paymentStatus === "PAID"}
            onClick={() => handleOrderPayment()}
            backgroundColor={Colors.primaryColor}
            size="sm"
            fontSize="0.875rem"
            borderRadius="9px"
            width="60%"
            color="#fff"
            borderColor="transparent"
            borderSize="0px"
          />
        </Flex>
      </Box>
      {showAddCustomer && (
        <ModalContainer>
          <NewCustomer setShowModal={setShowAddCustomer} refetch={refetchCustomers} />
        </ModalContainer>
      )}
    </ModalContainer>
  ) : null;
}
