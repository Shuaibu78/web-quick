/* eslint-disable indent */
/* eslint-disable @typescript-eslint/no-shadow */
import moment from "moment";
import { IInventory } from "../interfaces/inventory.interface";
import { IReceipt } from "../interfaces/receipt.interface";
import { getInventoryPrice } from "../utils/helper.utils";
import { getItem } from "../utils/localStorage.utils";

export const formatter = new Intl.NumberFormat("en-GB", {
  notation: "compact",
  compactDisplay: "short",
});

export const formatAmountIntl = (val: IInventory | undefined = undefined, amount?: number) => {
  const defaultCode = "NGN";
  let currencyCode = getItem("currencyCode") || defaultCode;

  if (currencyCode === "undefined") {
    currencyCode = defaultCode;
  }

  const formatedAmount = Intl.NumberFormat(`en-${currencyCode.slice(0, 2)}`, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
  });

  const fraction = Intl.NumberFormat(`en-${currencyCode.slice(0, 2)}`, {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 0,
  });

  const number = val !== undefined ? getInventoryPrice(val!) % 1 : amount! % 1;
  if (number === 0) {
    return fraction.format(val !== undefined ? getInventoryPrice(val!) : Number(amount));
  } else {
    return formatedAmount.format(val !== undefined ? getInventoryPrice(val!) : Number(amount));
  }
};

export const formatNumber = (number: number, decimalPlaces = 2) => {
  const options = {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  };

  return number?.toLocaleString(undefined, options);
};

export const capitalizeFirstLetter = (value: string | undefined): string => {
  value = String(value);
  return `${value[0]?.toUpperCase()}${value?.substr(1)}`;
};

export const concatDateAndTime = (
  date: Date | String | undefined,
  time?: String | Date | undefined
) => {
  if (date === undefined || time === undefined) return new Date();
  return new Date(`${date} ${time}`);
};

export const formatAmount = (
  amount: number | undefined,
  removeWhiteSpace: boolean = false
): string => {
  const value = Number(amount);
  let formattedAmount = "0";

  if (!isNaN(value)) {
    formattedAmount = String(amount).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }
  return removeWhiteSpace ? `${"\u20A6"}${formattedAmount}` : `${"\u20A6"} ${formattedAmount}`;
};

export const toPositiveNumber = (num: number) => (num >= 0 ? num : num * -1);

export const toNegativeNumber = (num: number) => (num <= 0 ? num : num * -1);

export const formatInventoryName = (name: string | undefined): string => {
  if (!name) {
    return "";
  }

  const split = name.toLowerCase().split(" ");

  return split.map((name) => capitalizeFirstLetter(name)).join(" ");
};

export const formatPermissionName = (name: string): string => {
  return name.toUpperCase().split(" ").join("_");
};
export const formatPermissionList = (inputString: string): string => {
  // return list.toLowerCase().replaceAll(" ", "").replaceAll("_", " ").split(",").join(", ");

  const permissionsArray = inputString.split(",");
  const formattedPermissions = permissionsArray.map((permission) => {
    const words = permission.split("_");
    const capitalizedWords = words.map(
      (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    return capitalizedWords.join(" ");
  });
  return formattedPermissions.join(", ");
};

export const formatDate = (date: Date) => {
  const now = new Date(date!);
  const dateValue = now.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }); // format: Monday, March 28, 2022
  const time = now.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "numeric",
    minute: "numeric",
  }); // format: 10:30:15 AM
  return `${dateValue} ${time}`;
};

export const getStartOfDay = (date: Date | null) => {
  return date ? new Date(date.setHours(0, 0, 0, 0)) : new Date(0);
};

export const getEndOfDay = (date: Date | null) => {
  return date ? new Date(date.setHours(23, 59, 59, 999)) : new Date();
};

export const getStartOfDate = (date: Date | number, type: moment.unitOfTime.StartOf) => {
  const startDate = moment(date).startOf(type).valueOf();

  return new Date(startDate);
};

export const getEndOfDate = (date: Date | number, type: moment.unitOfTime.StartOf) => {
  const today = Date.now();
  const endDate = (date ? moment(date) : moment()).endOf(type).valueOf();

  return today < endDate ? new Date(today) : new Date(endDate);
};

export const startAndEndOfDay = (date?: Date | number) => {
  date = date || new Date();
  const startOfToday = getStartOfDate(date, "day");
  const endOfToday = getEndOfDate(date, "day");

  return { startOfToday, endOfToday };
};

export const startAndEndOfWeek = (date?: Date | number) => {
  date = date || new Date();
  const startOfWeek = getStartOfDate(date, "week");
  const endOfWeek = getEndOfDate(date, "week");

  return { startOfWeek, endOfWeek };
};

export const startAndEndOfMonth = (date?: Date | number) => {
  date = date || new Date();
  const startOfMonth = getStartOfDate(date, "month");
  const endOfMonth = getEndOfDate(date, "month");

  return { startOfMonth, endOfMonth };
};

export const startAndEndOfYear = (date?: Date | number) => {
  date = date || new Date();
  const startOfYear = getStartOfDate(date, "year");
  const endOfYear = getEndOfDate(date, "year");

  return { startOfYear, endOfYear };
};

export const padLeadingZeros = (number: number, size = 10) => {
  const value = String(number);
  return value.padStart(size, "0");
};

export const getReceiptNumber = (receipt: IReceipt) => {
  return `${receipt.deviceId ?? ""}${padLeadingZeros(receipt.receiptNumber || 0) || "No Receipt No"
    }`;
};

export const getErrorString = (err: any) => {
  if (err.message) {
    if (typeof err.message === "object") {
      err.toString();
    }

    return err.message;
  }

  if (err.data) {
    return err.data.message || JSON.stringify(err.data);
  }

  return err.toString();
};
