export const piecesMeasurementUnit = [
  { value: "centimeter", label: "Centimeter" },
  { value: "dozen", label: "Dozen" },
  { value: "feet", label: "Feet" },
  { value: "grams", label: "Grams" },
  { value: "kilogram", label: "Kilogram" },
  { value: "liter", label: "Litre" },
  { value: "pair", label: "Pair" },
  { value: "yard", label: "Yard" },
  { value: "carton", label: "Carton" },
  { value: "bundles", label: "Bundles" },
  { value: "box", label: "Box" },
  { value: "bowl", label: "Bowl" },
  { value: "bottle", label: "Bottle" },
  { value: "bag", label: "Bag" },
];

export const packMeasurementUnit = [
  { value: "dozen", label: "Dozen" },
  { value: "kilogram", label: "Kilogram" },
  { value: "yard", label: "Yard" },
  { value: "carton", label: "Carton" },
  { value: "bundles", label: "Bundles" },
  { value: "box", label: "Box" },
  { value: "bag", label: "Bag" },
];

export const allowDecimalMeasurementUnitList = ["grams", "yard", "centimeter", "kilogram", "litre"];

export const validateMeasurementUnit = (value: string, measurementUnit: string) => {
  const val = parseFloat(value as string);
  if (
    typeof val === "number" &&
    !Number.isInteger(val) &&
    !allowDecimalMeasurementUnitList.includes(measurementUnit)
  ) {
    return false;
  }
  return true;
};
