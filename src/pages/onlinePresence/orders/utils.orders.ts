import { IOrder } from "./../../../interfaces/order.interface";
export const formatOrderNumber = (orderNumber: number) =>
  `#${String(orderNumber).padStart(8, "0")}`;

export const OrderStatusTabs = ["PENDING", "PROCESSING", "COMPLETED"] as const;

export const getOrderSteps = (step: typeof OrderStatusTabs[number]) => {
  switch (step) {
    case "PROCESSING":
      return ["PROCESSING", "PROCESSED"];
    case "COMPLETED":
      return ["COMPLETED", "DELIVERED", "ON_DELIVERING", "CANCELLED"];
    case "PENDING":
    default:
      return ["PENDING"];
  }
};

export const PaymentStatus = ["ALL", "PAID", "UNPAID"];

export const getOrderTagNames = (order: IOrder) => {
  const orderTags = order?.OrderTags ?? [];

  if (orderTags.length === 0) {
    return "";
  }

  if (orderTags.length === 1) {
    return orderTags[0].Tag?.tagName ?? "";
  }

  return orderTags.map((orderTag) => orderTag.Tag?.tagName ?? "").join(", ");
};
