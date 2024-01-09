import { isFigorr } from "../utils/constants";
import { figorrColors, timartColors } from "./colors";

export const Colors = isFigorr ? figorrColors : timartColors;

export const FontSizes = {
  titleFont: "21.4rem4px",
  bigFont: "1.375rem",
  detailsFontSize: "0.875rem",
  descriptionFontSize: ".75rem",
  primaryFontSize: "1rem",
  secondaryFontSize: "1.125rem",
  headingFont: "1.75rem",
};

export const FontFamily = {
  primaryFont: "Roboto",
  secondaryFont: "Helvetica",
};

export const BoxShadows = {
  primaryBoxShadow: "4px 4px 1.875rem rgba(35, 54, 79, 0.1)",
  SmallerBoxShadow: "4px 4px 1.25rem rgba(24, 88, 177, 0.2)",
  cardBoxShadow: "4px 4px 1.875rem rgba(23, 46, 78, 0.1)",
};
