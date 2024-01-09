import styled from "styled-components";
import { Colors, FontSizes } from "./theme";

const { primaryColor, white, lightGrey } = Colors;
const { detailsFontSize } = FontSizes;

interface TextProps {
  fontSize?: string;
  color?: string;
  fontWeight?: string;
  margin?: string;
  padding?: string;
  noWrap?: boolean;
  width?: string;
  maxWidth?: string;
  textTransform?: "capitalize" | "upppercase" | "lowercase" | "match-auto" | "none";
  textOverflow?: "ellipsis" | "clip" | "inherit" | "initial" | "revert" | "unset";
}

export const Text = styled.p<TextProps>`
  font-size: ${({ fontSize }) => fontSize ?? "0.875rem"};
  color: ${({ color }) => color || "#444"};
  font-weight: ${({ fontWeight }) => fontWeight};
  margin: ${({ margin }) => margin ?? "0px"};
  padding: ${({ padding }) => padding ?? "0px"};
  width: ${({ width }) => width};
  ${({ textTransform }) => textTransform && "text-transform: " + textTransform};
  ${({ textOverflow }) => textOverflow && "text-overflow: " + textOverflow};

  ${({ noWrap }) =>
    noWrap &&
    `
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}
`;

interface SpanProps {
  fontSize?: string;
  color?: string;
  fontWeight?: string;
  margin?: string;
  noWrap?: boolean;
  width?: string;
  textAlign?: string;
  lineThrough?: boolean;
  lineThroughSize?: string;
  cursor?: string;
  opacity?: number;
  fontStyle?: string;
}

export const Span = styled.span<SpanProps>`
  font-size: ${({ fontSize }) => fontSize ?? "inherit"};
  font-style: ${({ fontStyle }) => fontStyle ?? "none"};
  color: ${({ color }) => `${color} !important` ?? "inherit"};
  font-weight: ${({ fontWeight }) => fontWeight};
  margin: ${({ margin }) => margin};
  width: ${({ width }) => width};
  text-align: ${({ textAlign }) => textAlign};
  cursor: ${({ cursor }) => cursor};
  opacity: ${({ opacity }) => opacity};

  ${({ noWrap }) =>
    noWrap &&
    `
    width: 90%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `}

  ${({ lineThrough, lineThroughSize }) =>
    lineThrough &&
    `text-decoration: line-through;
      text-decoration-thickness: ${lineThroughSize ?? "1px"}
  `};
`;

interface ButtonProps {
  backgroundColor?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  borderColor?: string;
  borderSize?: string;
  padding?: string;
  margin?: string;
  notFilled?: boolean;
  color?: string;
  disable?: boolean;
  bgHover?: string;
  actionBtn?: boolean;
  alignItems?: string;
  justifyContent?: string;
  hoverColor?: string;
  fontSize?: string;
}

export const Button = styled.button<ButtonProps>`
  text-decoration: none;
  font-style: normal;
  font-weight: normal;
  font-size: ${({ fontSize }) => fontSize ?? detailsFontSize};
  line-height: 1rem;
  color: ${({ color }) => color ?? white};
  background-color: ${({ backgroundColor, disable, notFilled }): string =>
    disable ? lightGrey : notFilled ? "transparent" : backgroundColor ?? primaryColor};
  border: ${({ borderSize }): string => borderSize ?? "1px"} solid
    ${({ backgroundColor, borderColor, disable }): string =>
      disable ? lightGrey : borderColor ?? backgroundColor ?? primaryColor};
  box-sizing: border-box;
  border-radius: ${({ borderRadius }) => borderRadius ?? "1.875rem"};
  padding: ${({ padding }) => padding ?? ".75rem 1.25rem"};
  width: ${({ width }) => width};
  height: ${({ height }) => height ?? "3.125rem"};
  display: flex;
  align-items: ${({ alignItems }) => alignItems ?? "center"};
  justify-content: ${({ justifyContent }) => justifyContent ?? "center"};
  text-align: center;
  margin: ${({ margin }) => margin ?? "unset"};
  cursor: ${({ disable }) => (disable ? "not-allowed" : "pointer")};
  transition: ease-in-out all 0.3s;

  ${({ notFilled, borderColor, bgHover, backgroundColor, disable, hoverColor }) =>
    disable
      ? ""
      : notFilled
      ? `&:hover {
    background-color: ${bgHover ?? borderColor ?? primaryColor};
    color: ${hoverColor ?? white};
  }`
      : `&:hover {
    background-color: ${bgHover ?? backgroundColor ?? primaryColor};
    border: 1px solid ${bgHover ?? backgroundColor ?? primaryColor};
  }`}
`;

interface FlexProps {
  justifyContent?: string;
  alignItems?: string;
  alignSelf?: string;
  width?: string;
  minWidth?: string;
  direction?: string;
  margin?: string;
  flexFlow?: string;
  padding?: string;
  gap?: string;
  bg?: string;
  borderRadius?: string;
  boxShadow?: string;
  overflow?: string;
  zIndex?: number;
  height?: string;
  fontSize?: string;
  cursor?: string;
  opacity?: boolean;
  shadow?: boolean;
  minHeight?: string;
  maxHeight?: string;
  display?: string;
  border?: string;
  transition?: string;
  flexWrap?: string;
  hover?: boolean;
  columnGap?: string;
  color?: string;
  hideScrollbar?: boolean;
  overflowX?: string;
  overflowY?: string;
  maxWidth?: string;
  disabled?: boolean;
  position?: string;
  hoverBg?: string;
}

export const Flex = styled.div<FlexProps>`
  display: ${({ display }) => display ?? "flex"};
  justify-content: ${({ justifyContent }) => justifyContent ?? "unset"};
  align-items: ${({ alignItems }) => alignItems ?? "unset"};
  width: ${({ width }) => width || "100%"};
  min-width: ${({ minWidth }) => minWidth};
  position: ${({ position }) => position};
  max-width: ${({ maxWidth }) => maxWidth};
  height: ${({ height }) => height ?? "unset"};
  min-height: ${({ minHeight }) => minHeight ?? "unset"};
  max-height: ${({ maxHeight }) => maxHeight ?? "unset"};
  flex-direction: ${({ direction }) => direction ?? "row"};
  align-self: ${({ alignSelf }) => alignSelf ?? "unset"};
  margin: ${({ margin }) => margin};
  flex-flow: ${({ flexFlow }) => flexFlow};
  padding: ${({ padding }) => padding ?? "0px"};
  font-size: ${({ fontSize }) => fontSize ?? ".875rem"};
  gap: ${({ gap }) => gap ?? "0px"};
  column-gap: ${({ columnGap }) => columnGap};
  flex-wrap: ${({ flexWrap }) => flexWrap ?? "unset"};
  background-color: ${({ bg }) => bg};
  color: ${({ color }) => color};
  border-radius: ${({ borderRadius }) => borderRadius ?? "0px"};
  border: ${({ border }) => border ?? "unset"};
  box-shadow: ${({ boxShadow, shadow }) =>
    shadow ? "rgba(100, 100, 111, 0.2) 0px 7px 1.25rem 0px" : boxShadow ?? "none"};
  overflow: ${({ overflow }) => overflow};
  overflow-x: ${({ overflowX }) => overflowX};
  overflow-y: ${({ overflowY }) => overflowY};
  z-index: ${({ zIndex }) => zIndex ?? "unset"};
  cursor: ${({ cursor }) => cursor ?? "unset"};
  opacity: ${({ opacity, disabled }) => (disabled || opacity ? "0.5" : "unset")};
  transition: ${({ transition }) => transition ?? "unset"};
  pointer-events: ${(props: FlexProps) => (props.disabled ? "none" : "unset")};

  -ms-overflow-style: none;
  scrollbar-width: 0.3125rem;

  ::-webkit-scrollbar {
    background-color: transparent;
    width: 0.3125rem;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: ${Colors.primaryColor};
  }

  :hover {
    ${({ hover, hoverBg }) =>
      hover &&
      `
      opacity: 0.8;
      background-color: ${hoverBg};
  `}
  }
  ${({ hideScrollbar }) =>
    hideScrollbar &&
    `
     ::-webkit-scrollbar {
    display: none;
  }
  `}

  datalist option {
    padding: 5px;
    cursor: pointer;
  }
`;

interface CheckButtonProps {
  backgroundColor?: string;
  width?: string;
  height?: string;
  borderRadius?: string;
  borderColor?: string;
  borderSize?: string;
  padding?: string;
  margin?: string;
  color?: string;
  disabled?: boolean;
  alignItems?: string;
  justifyContents?: string;
  selected?: boolean;
  fontSize?: string;
  display?: string;
  minHeight?: string;
  border?: string;
  zIndex?: number;
  maxWidth?: string;
  minWidth?: string;
}

export const CheckButton = styled.button<CheckButtonProps>`
  text-decoration: none;
  font-size: ${({ fontSize }) => fontSize || "1rem"};
  color: ${({ color }) => color || "white"};
  background-color: ${({ backgroundColor }) => backgroundColor ?? primaryColor};
  box-sizing: border-box;
  border-radius: ${({ borderRadius }) => borderRadius || "0px"};
  padding: ${({ padding }) => padding || ".75rem 1.2rem"};
  width: ${({ width }) => width};
  height: ${({ height }) => height || "3.125rem"};
  display: ${({ display }) => display || "flex"};
  align-items: ${({ alignItems }) => alignItems ?? "center"};
  justify-content: ${({ justifyContents }) => justifyContents || "center"};
  margin: ${({ margin }) => margin || "unset"};
  border: ${({ border }) => border || "none"};
  cursor: pointer;

  #name {
    font-size: 0.9rem;
  }
`;
interface ICheckBox {
  checked: boolean;
  radius?: string;
  color?: string;
  margin?: string;
}

export const CheckBox = styled.label`
  padding: 0px !important;
  margin: 0px !important;
  border: 1.5px solid ${(props: ICheckBox) => (props.checked ? props.color : "#9EA8B7")};
  height: 1.2rem;
  width: 1.2rem;
  min-width: 1.2rem;
  min-height: 1.2rem;
  border-radius: ${(props: ICheckBox) => props.radius ?? "3px"};
  display: flex;
  align-items: center;
  margin: ${(props: ICheckBox) => props.margin || "0 1.2rem 0 0"};
  justify-content: center;
  cursor: pointer;

  span {
    padding: 0px !important;
    margin: 0px !important;
    display: block;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: ${(props: ICheckBox) => props.radius ?? "3px"};
    background: ${(props: ICheckBox) =>
      props.checked ? props.color ?? primaryColor : "transparent"};
  }
`;
