/* eslint-disable comma-dangle */
export const formatName = (name?: string) => {
  if (!name) {
    return "";
  }

  const words = name.toLowerCase().split(" ");
  for (let i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  return words.join(" ");
};

export const formatPrice = (
  amount: number,
  noCurrency: boolean = false,
  currency?: string
): string | null => {
  if (!amount) {
    return "0";
  }
  if (amount === 0) {
    return null;
  }
  const formattedAmount = amount?.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  if (noCurrency) {
    return formattedAmount;
  } else {
    return `${currency ?? "₦ "}${formattedAmount}`;
  }
};

export const validateInputNum = (setNumVal: Function, val: string | number) => {
  const newVal = val.toString().replace(/[^0-9]/g, "");

  if (newVal === "") {
    setNumVal("");
    return;
  }
  if (!isNaN(parseInt(newVal))) {
    setNumVal(Number(newVal));
  }
};

export const convertToNumber = (number: string) => {
  const cleanString = number.replace(/[,\s]/g, "");

  const result = parseFloat(cleanString);

  if (!isNaN(result)) {
    return result;
  } else {
    return cleanString;
  }
};
