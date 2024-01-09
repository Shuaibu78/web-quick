/* eslint-disable indent */
import { Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Badge, Box, DarkText, Flex, LightText } from "../style.onlinePresence";
import { Colors } from "../../../GlobalStyles/theme";
import { OrderDetailRow } from "../components.onlinePresence";
import { Button } from "../../../components/button/Button";
import { IOrder, IOrderItems, OrderDetailsProps } from "../../../interfaces/order.interface";
import {
  formatOrderNumber,
  getOrderSteps,
  getOrderTagNames,
  OrderStatusTabs,
} from "./utils.orders";
import { formatAmount, formatDate } from "../../../helper/format";
import { useEffect, useMemo, useState } from "react";
import UpdateOrderStep from "./components/updateOrderStatus";
import OrderPaymentView from "./components/orderPayment";
import { useLazyQuery } from "@apollo/client";
import { useAppSelector, useCurrentShop } from "../../../app/hooks";
import { useDispatch } from "react-redux";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { GET_ORDER } from "../../../schema/orders.schema";
import { getImageUrl } from "../../../helper/image.helper";
import Checkbox from "../../../components/checkbox/checkbox";
import _ from "lodash";
import { getDefaultPrinter, printInvoice } from "../../../helper/printing";
import { getCurrentUser } from "../../../app/slices/userInfo";

const { darkBlue, lightBlue, primaryColor } = Colors;

interface ISelectedItems {
  [key: string]: boolean;
}

export default function OrderDetails({
  orderId,
  activeTabIndex,
  updateCount,
  triggerRefetch,
  updateOrdersView,
}: OrderDetailsProps) {
  const [showUpdateOrderStep, setShowUpdateOrderStep] = useState(false);
  const [showOrderPaymentView, setShowOrderPaymentView] = useState(false);
  const [order, setOrder] = useState<IOrder>({});
  const [selectedItems, setSelectedItems] = useState<ISelectedItems>({});
  const [isUpdating, setIsUpdating] = useState(false);
  const dispatch = useDispatch();

  const closeUpdateStatusModal = () => setShowUpdateOrderStep(false);
  const closeOrderPaymentModal = () => setShowOrderPaymentView(false);
  const currentShop = useCurrentShop();
  const currentUser = useAppSelector(getCurrentUser);

  const activeTab = OrderStatusTabs[activeTabIndex];
  const isCurrentTab = (stepName: string) => {
    const steps = getOrderSteps(activeTab);
    return steps.includes(stepName);
  };

  const [fetchOrderSelectedOrder, { refetch, loading }] = useLazyQuery<{ getOrder: IOrder }>(
    GET_ORDER,
    {
      variables: {
        shopId: currentShop?.shopId || "",
        orderId: orderId || "",
      },
      onCompleted(result) {
        const item = result?.getOrder;
        setOrder(item);
        if (isUpdating) {
          const type = item?.OrderItems?.some((orderItem) =>
            isCurrentTab(orderItem?.Step?.stepName || "")
          )
            ? "UPDATE"
            : "DELETE";
          updateOrdersView(item, type);
          setIsUpdating(false);
        }
      },
      onError(error) {
        if (orderId) {
          dispatch(
            toggleSnackbarOpen({
              message: error?.message || error?.graphQLErrors[0]?.message,
              color: "DANGER",
            })
          );
        }
      },
    }
  );

  useEffect(() => {
    if (!orderId || !currentShop?.shopId) return;

    fetchOrderSelectedOrder();
  }, [orderId, currentShop?.shopId]);

  useEffect(() => {
    setIsUpdating(true);
    refetch();
  }, [updateCount]);

  const {
    orderNumber,
    totalAmount,
    deliveryOption,
    subTotal = 0,
    otherDetails,
    comment,
    createdAt,
    paymentStatus,
    OrderItems = [],
  } = order || {};

  const customerInfo = useMemo(() => JSON.parse(otherDetails || "{}"), [otherDetails]);

  const isPaid = paymentStatus === "PAID";
  const tagNames = getOrderTagNames(order);

  const handleItemClick = (key: string, val: boolean) => {
    selectedItems[key] = val;
    setSelectedItems({ ...selectedItems });
  };

  const handleSelectAllItems = (val: boolean) => {
    const newState: Record<string, boolean> = {};

    OrderItems?.forEach((item) => {
      if (!isCurrentTab(item?.Step?.stepName as string)) return;
      newState[String(item.orderItemId)] = val;
    });
    setSelectedItems(newState);
  };

  const anyItemSelected = () =>
    Boolean(Object.keys(_.omitBy(selectedItems, (item) => !item)).length);

  const handleOpenUpdateStatusModal = () => {
    if (!anyItemSelected()) {
      return dispatch(
        toggleSnackbarOpen({ message: "Please select at least 1 order item", color: "INFO" })
      );
    }
    setShowUpdateOrderStep(true);
  };

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

  useEffect(() => handleSelectAllItems(false), [order, activeTabIndex]);

  return orderId && order?.orderId ? (
    <Box h="max-content" borderRadius="1.25rem" p="1rem" px="1.875rem" bgColor="#F6F8FB">
      {/* CARD TITLE */}
      <Flex justifyContent="space-between" w="100%">
        <Text color={darkBlue} fontWeight="600">
          Order Details
        </Text>
        <Text color={lightBlue}>{orderNumber && formatOrderNumber(orderNumber)}</Text>
      </Flex>
      {tagNames && (
        <Flex w="100%" justifyContent="flex-end">
          <Text color={Colors.primaryColor} fontSize="0.625rem">
            Tag: {tagNames}
          </Text>
        </Flex>
      )}
      <Flex justifyContent="space-between" my=".5rem" w="100%">
        <Text color={darkBlue} fontWeight="600">
          Time of order
        </Text>
        <Text color={lightBlue}>{createdAt && formatDate(createdAt)}</Text>
      </Flex>

      <Flex my="0.625rem">
        <Flex w="100%" justifyContent="space-between">
          <Flex alignItems="center" justifyContent="center">
            <Checkbox
              isChecked={Object.values(selectedItems).every((val) => val === true)}
              onChange={(e) => handleSelectAllItems(e.target.checked)}
              color="#130F26"
              size="1.125rem"
            />
            <DarkText margin="0 0 0 0.625rem" fontWeight="500">
              Select all
            </DarkText>
          </Flex>
          <Badge variant={isPaid ? "success" : "danger"}>{paymentStatus}</Badge>
        </Flex>
      </Flex>

      <Box mx="1rem" borderTop="1px solid #130F26" h="12.5rem" overflowY="auto">
        {Number(OrderItems?.length) > 0
          ? OrderItems?.map(
              (
                {
                  inventoryName,
                  Step,
                  quantity,
                  amountPerItem,
                  amount,
                  orderItemId = "",
                }: IOrderItems,
                idx
              ) => {
                const isDisabled = !isCurrentTab(String(Step?.stepName));

                return (
                  <Flex
                    style={isDisabled ? { opacity: "0.3" } : {}}
                    key={idx}
                    mt="0.625rem"
                    justifyContent="space-between"
                  >
                    <Flex>
                      {/* column 1 */}
                      <Flex alignItems="center" justifyContent="center">
                        <Checkbox
                          isChecked={Boolean(selectedItems[orderItemId])}
                          onChange={(e) => {
                            if (isDisabled) return;
                            handleItemClick(orderItemId, e.target.checked);
                          }}
                          isDisabled={isDisabled}
                          color="#130F26"
                          size="1.125rem"
                        />
                      </Flex>

                      {/* column 2 */}
                      <Box borderRadius="0.75rem" mx="0.9375rem" h="3.125rem" w="3.125rem">
                        <img src={getImageUrl()} alt="inventory image" height="100%" width="100%" />
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
                        <LightText>{`${quantity} x ${formatAmount(amountPerItem || 0)}`}</LightText>
                      </Flex>
                    </Flex>

                    <Flex h="100%" alignItems="center">
                      <DarkText fontWeight="600">{formatAmount(amount)}</DarkText>
                    </Flex>
                  </Flex>
                );
              }
            )
          : null}{" "}
        {/* OrderItems list */}
      </Box>

      <Box>
        <Flex justifyContent="space-between" mt="6px" w="100%">
          <Text color={darkBlue} fontWeight="500">
            Delivery Method
          </Text>
          <Text color={lightBlue}>{deliveryOption}</Text>
        </Flex>
        <Flex justifyContent="space-between" mt="6px" w="100%">
          <Text color={darkBlue} fontWeight="500">
            Sub Total
          </Text>
          <Text color={lightBlue}>{formatAmount(subTotal || 0)}</Text>
        </Flex>
        <Flex justifyContent="space-between" mt="6px" w="100%">
          <Text color={darkBlue} fontWeight="600">
            Order Total
          </Text>
          <Text color={lightBlue}>{formatAmount(totalAmount || 0)}</Text>
        </Flex>
      </Box>

      {comment && (
        <Box mt="1.5625rem">
          <Text color="#607087" fontSize="1rem" fontWeight="600">
            Order Instructions
          </Text>
          <Box mt=".5rem">
            <OrderDetailRow label="Instruction:" value={comment} />
          </Box>
        </Box>
      )}

      {otherDetails && (
        <Box mt="1.5625rem">
          <Text color="#607087" fontSize="1rem" fontWeight="600">
            Customer Information
          </Text>
          <Box mt=".5rem">
            <OrderDetailRow label="Name:" value={customerInfo?.customerName} />
          </Box>
          <Box mt=".5rem">
            <OrderDetailRow label="Phone:" value={customerInfo?.shippingAddress?.mobileNumber} />
          </Box>
          <Box mt=".5rem">
            <OrderDetailRow
              label="State:"
              value={customerInfo?.shippingAddress?.State?.stateName}
            />
          </Box>
          <Box mt=".5rem">
            <OrderDetailRow label="LGA:" value={customerInfo?.shippingAddress?.City?.cityName} />
          </Box>
          <Box mt=".5rem">
            <OrderDetailRow label="Address:" value={customerInfo?.shippingAddress?.fullAddress} />
          </Box>
        </Box>
      )}

      <Flex mt="1.5625rem" w="100%" justifyContent="space-evenly">
        <Button
          label="Change Status"
          onClick={handleOpenUpdateStatusModal}
          backgroundColor={primaryColor}
          size="sm"
          fontSize="0.75rem"
          borderRadius="0.5rem"
          borderColor="transparent"
          color="#fff"
          height="2rem"
          borderSize="0px"
        />
        <Button
          label="Print Order Receipt"
          onClick={handlePrintOrder}
          backgroundColor={primaryColor}
          size="sm"
          fontSize="0.75rem"
          borderRadius="0.5rem"
          borderColor="transparent"
          color="#fff"
          height="2rem"
          borderSize="0px"
        />
        <Button
          label="Mark as paid"
          onClick={() => setShowOrderPaymentView(true)}
          backgroundColor="transparent"
          disabled={order.paymentStatus === "PAID"}
          size="sm"
          fontSize="0.75rem"
          borderRadius="0.5rem"
          borderColor="#FFA412"
          color="#FFA412"
          borderSize="2px"
          type="button"
          height="2rem"
          border
        />
      </Flex>
      {/** Update status modal */}
      <UpdateOrderStep
        orderItemIds={Object.keys(_.omitBy(selectedItems, (item) => !item))}
        showUpdateOrderStep={showUpdateOrderStep}
        closeModal={closeUpdateStatusModal}
        triggerRefetch={triggerRefetch}
      />
      {/** mark order as paid modal */}
      <OrderPaymentView
        orderId={orderId as string}
        showOrderPaymentView={showOrderPaymentView}
        closeModal={closeOrderPaymentModal}
        triggerRefetch={triggerRefetch}
      />
    </Box>
  ) : (
    <Box
      h="50svh"
      minH="18.75rem"
      borderRadius="1.25rem"
      p="1rem"
      px="1.875rem"
      bgColor="#F6F8FB"
      centerContent
    >
      <DarkText>{loading ? "Loading" : "Click Order to view details"}</DarkText>
    </Box>
  );
}
