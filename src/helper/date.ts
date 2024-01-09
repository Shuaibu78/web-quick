import moment from "moment";
import { IInventory } from "../interfaces/inventory.interface";

export const convertToLocalDate = (date: Date | string) => {
  if (!date) {
    return null;
  }

  return moment(date).format("D MMMM, YYYY");
};

export const formatDate = (dateString: string) => {
  const date = moment.utc(dateString).local();
  return date.format("DD MMM YYYY");
};

export const formatTime = (dateString: string) => {
  const date = moment.utc(dateString).local();
  return date.format("hh:mm a");
};

export const convertToLocalDateTime = (
  date: Date | string | undefined,
  format = "D MMMM, YYYY - h:m A"
) => {
  if (!date) {
    return null;
  }

  return moment(date).format(format);
};

export const setHours = (from: Date, to: Date) => {
  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);
  return { from, to };
};

export const getDates = (selectedDate: string) => {
  const today = new Date();

  const todayStart = new Date(today);
  const todayEnd = new Date(today);

  if (selectedDate === "Today") {
    return setHours(todayStart, todayEnd);
  } else if (selectedDate === "Yesterday") {
    const yesterday = new Date(today);
    const yesterdayStart = new Date(yesterday.setDate(today.getDate() - 1));
    const yesterdayEnd = new Date(yesterday.setDate(today.getDate() - 1));
    return setHours(yesterdayStart, yesterdayEnd);
  } else if (selectedDate === "This week") {
    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
    const lastDayOfWeek = new Date(today.setDate(today.getDate() + 7 - today.getDay()));
    return setHours(firstDayOfWeek, lastDayOfWeek);
  } else if (selectedDate === "Last week") {
    const firstDayOfLastWeek = new Date(today.setDate(today.getDate() - today.getDay() - 6));
    const lastDayOfLastWeek = new Date(today.setDate(today.getDate() - today.getDay() + 7));
    return setHours(firstDayOfLastWeek, lastDayOfLastWeek);
  } else if (selectedDate === "This month") {
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return setHours(firstDayOfMonth, lastDayOfMonth);
  } else if (selectedDate === "Last month") {
    const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastDayOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    return setHours(firstDayOfLastMonth, lastDayOfLastMonth);
  } else if (selectedDate === "This year") {
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const lastDayOfYear = new Date(today.getFullYear(), 11, 31);
    return setHours(firstDayOfYear, lastDayOfYear);
  } else if (selectedDate === "All entries") {
    const firstDayOfYear = new Date(0);
    const lastDayOfYear = new Date();
    return setHours(firstDayOfYear, lastDayOfYear);
  }
};

export const DateRangeFilters = [
  "Today",
  "Yesterday",
  "This week",
  "Last week",
  "This month",
  "Last month",
  "This year",
  "All entries",
];

export const compareDates = (d1: string, d2: string) => {
  const date1 = new Date(d1).getTime();
  const date2 = new Date(d2).getTime();

  if (date1 < date2) {
    return -1;
  } else if (date1 > date2) {
    return 1;
  } else {
    return 0;
  }
};

export const isDateGreaterThan24HoursAgo = (date: number) => {
  const twentyFourHoursInMs = 24 * 60 * 60 * 1000; // calculate the number of milliseconds in 24 hours
  const currentDate = new Date().getMilliseconds; // get the current date
  const dateDifferenceInMs = Number(currentDate) - date;
  return dateDifferenceInMs >= twentyFourHoursInMs;
};

export const resetDateHrs = (date: Date) => {
  const d = new Date(date);
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  return (d.toDateString() +
    " " +
    d.toTimeString().substring(0, 8) +
    " GMT+0100 (West Africa Standard Time)") as any;
};

export function quicksort<T>(
  array: T[],
  compareFn: (a: T, b: T) => number,
  left = 0,
  right = array.length - 1
) {
  if (left >= right) {
    return;
  }
  const pivotIndex = Math.floor((left + right) / 2);
  const pivot = array[pivotIndex];
  let i = left;
  let j = right;
  while (i <= j) {
    while (compareFn(array[i], pivot) < 0) {
      i++;
    }
    while (compareFn(array[j], pivot) > 0) {
      j--;
    }
    if (i <= j) {
      [array[i], array[j]] = [array[j], array[i]];
      i++;
      j--;
    }
  }
  quicksort(array, compareFn, left, j);
  quicksort(array, compareFn, i, right);
}
