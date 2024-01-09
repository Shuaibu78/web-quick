import styled from "styled-components";
import { Button, Text } from "../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../GlobalStyles/theme";

export const Container = styled.div`
  display: flex;
`;

interface BoxProps {
  /**
   * @w You should only pass either the size or the height and width.
   * The size property will take precendence over the height and width if both are provided.
   */
  w?: string;
  /**
   * @h You should only pass either the size or the height and width.
   * The size property will take precendence over the height and width if both are provided.
   */
  h?: string;
  /**
   * @size You should only pass either the size or the height and width.
   * The size property will take precendence over the height and width if both are provided.
   */
  size?: string;
  minW?: string;
  minH?: string;
  maxW?: string;
  maxH?: string;
  m?: string;
  my?: string;
  mx?: string;
  mt?: string;
  mb?: string;
  ml?: string;
  mr?: string;
  p?: string;
  py?: string;
  px?: string;
  pt?: string;
  pb?: string;
  pl?: string;
  pr?: string;
  centerContent?: boolean;
  display?: string;
  direction?: "row" | "column";
  flexGrow?: string;
  border?: string;
  borderTop?: string;
  borderRadius?: string;
  borderStyle?: string;
  borderColor?: string;
  borderWidth?: string;
  bgColor?: string;
  color?: string;
  justifyContent?:
    | "center"
    | "end"
    | "flex-end"
    | "flex-start"
    | "inherit"
    | "initial"
    | "left"
    | "normal"
    | "revert"
    | "right"
    | "space-around"
    | "space-between"
    | "space-evenly"
    | "start"
    | "stretch"
    | "unset";
  justifyItems?: string;
  justifySelf?: string;
  alignContent?: string;
  alignItems?: string;
  alignSelf?: string;
  fontSize?: string;
  fontFamily?: string;
  fontWeight?: string;
  boxShadow?: string;
  cursor?: string;
  zIndex?: string;
  overflow?: string;
  overflowY?: string;
  overflowX?: string;
  onClick?: any;
  position?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  hover?: BoxHoverProps;
}

type BoxHoverProps = BoxProps;

export const Box = styled.div<BoxProps>`
  ${({ size, h }) => (size || h) && "height: " + (size || h)};
  ${({ size, w }) => (size || w) && "width: " + (size || w)};
  ${({ display, centerContent }) =>
    (centerContent && "display: grid") || (display && "display: " + display)};
  ${({ direction }) => direction && "flex-direction: " + direction};
  ${({ centerContent }) => centerContent && "place-items: center"};
  ${({ minW }) => minW && "min-width: " + minW};
  ${({ maxW }) => maxW && "max-width: " + maxW};
  ${({ minH }) => minH && "min-height: " + minH};
  ${({ maxH }) => maxH && "max-height: " + maxH};
  ${({ m }) => m && "margin: " + m};
  ${({ p }) => p && "padding: " + p};
  ${({ mx }) => mx && "margin-inline: " + mx};
  ${({ my }) => my && "margin-block: " + my};
  ${({ px }) => px && "padding-inline: " + px};
  ${({ py }) => py && "padding-block: " + py};
  ${({ mt }) => mt && "margin-top: " + mt};
  ${({ mb }) => mb && "margin-bottom: " + mb};
  ${({ ml }) => ml && "margin-left: " + ml};
  ${({ mr }) => mr && "margin-right: " + mr};
  ${({ pt }) => pt && "padding-top: " + pt};
  ${({ pb }) => pb && "padding-bottom: " + pb};
  ${({ pl }) => pl && "padding-left: " + pl};
  ${({ pr }) => pr && "padding-right: " + pr};
  ${({ position }) => position && "position: " + position};
  ${({ border }) => border && "border: " + border};
  ${({ borderTop }) => borderTop && "border-top: " + borderTop};
  ${({ borderRadius }) => borderRadius && "border-radius: " + borderRadius};
  ${({ borderWidth }) => borderWidth && "border-width: " + borderWidth};
  ${({ borderStyle }) => borderStyle && "border-style: " + borderStyle};
  ${({ borderColor }) => borderColor && "border-style: " + borderColor};
  ${({ bgColor }) => bgColor && "background-color: " + bgColor};
  ${({ color }) => color && "color: " + color};
  ${({ justifyContent }) => justifyContent && "justify-content: " + justifyContent};
  ${({ justifyItems }) => justifyItems && "justify-items: " + justifyItems};
  ${({ justifySelf }) => justifySelf && "justify-self: " + justifySelf};
  ${({ alignContent }) => alignContent && "align-content: " + alignContent};
  ${({ alignItems }) => alignItems && "align-items: " + alignItems};
  ${({ alignSelf }) => alignSelf && "align-self: " + alignSelf};
  ${({ fontSize }) => fontSize && "font-size: " + fontSize};
  ${({ fontFamily }) => fontFamily && "font-family: " + fontFamily};
  ${({ fontWeight }) => fontWeight && "font-weight: " + fontWeight};
  ${({ boxShadow }) => boxShadow && "box-shadow: " + boxShadow};
  ${({ cursor }) => cursor && "cursor: " + cursor};
  ${({ zIndex }) => zIndex && "z-index: " + zIndex};
  ${({ overflow }) => overflow && "oveflow: " + overflow};
  ${({ overflowY }) => overflowY && "overflow-y: " + overflowY};
  ${({ overflowX }) => overflowX && "overflow-x: " + overflowX};
  ${({ flexGrow }) => flexGrow && "flex-grow: " + flexGrow};
  ${({ top }) => top && "top: " + top};
  ${({ bottom }) => bottom && "bottom: " + bottom};
  ${({ left }) => left && "left: " + left};
  ${({ right }) => right && "right: " + right};

  :hover {
    ${({ hover }) => hover?.bgColor && "background-color: " + hover?.bgColor};
  }
`;

interface FlexProps {
  flexFlow?: string;
  gap?: string;
  shrink?: string;
  wrap?: string;
  cursor?: string;
}

export const Flex = styled(Box)<FlexProps>`
  display: flex;
  ${({ flexFlow }) => flexFlow && "flex-flow: " + flexFlow};
  ${({ gap }) => gap && "gap: " + gap};
  ${({ cursor }) => cursor && "cursor: " + cursor};
  ${({ shrink }) => shrink && "flex-shrink: " + shrink};
  ${({ wrap }) => wrap && "flex-wrap: " + wrap};
`;

type BadgeColorScheme = "success" | "danger" | "warning" | "default";

interface BadgeProps {
  variant?: BadgeColorScheme;
  fontSize?: string;
}

export const getBageColor = (scheme: BadgeColorScheme) => {
  switch (scheme) {
    case "danger":
      return { color: "#F65151", bg: "#FCE9E9" };
    case "warning":
      return { color: "#F6E05E", bg: "#FEFCBF" };
    case "success":
      return { color: "#219653", bg: "#DBF9E8" };
    default:
      return { color: "#1B202D", bg: "#EDF3F6" };
  }
};

export const Badge = styled(Box)<BadgeProps>`
  background-color: ${({ variant = "default" }) => getBageColor(variant).bg};
  color: ${({ variant = "default" }) => getBageColor(variant).color};
  ${({ fontSize }) => fontSize && "font-size: " + fontSize};
  border-radius: 0.3125rem;
  font-weight: 600;
  padding: 0.3125rem 0.625rem;
  height: fit-content;
  width: fit-content;
`;

export interface CircularBadgeProps {
  bgColor: string;
  color: string;
  activeColor?: string;
  activeBgColor?: string;
  isActive?: boolean;
  fontWeight?: string;
  fontSize?: string;
  size?: string;
}

export const CircularBadge = styled.span<CircularBadgeProps>`
  border-radius: 49%;
  display: grid;
  text-align: center;
  align-items: center;
  justify-content: center;
  padding: 2px;
  font-size: 0.7rem;
  font-weight: bold;
  height: ${({ size }) => size || "1.5625rem"};
  width: ${({ size }) => size || "1.5625rem"};
  background-color: ${({ bgColor, activeBgColor, isActive }) =>
    isActive ? activeBgColor : bgColor};
  color: ${({ color, activeColor, isActive }) => (isActive ? activeColor : color)};
`;

export const TabContainer = styled(Box)`
  .tab-pane-container {
    display: flex;
    background-color: #eceff4;
    border-radius: 0.625rem;
    align-items: center;
    font-weight: 600;
    text-align: center;
  }

  .tab-pane {
    display: flex;
    align-items: center;
    justify-content: space-around;
    color: #607087;
    border-radius: 0.625rem;
    padding-block: 0.625rem;
    flex-grow: 1;
    text-transform: capitalize;
    cursor: pointer;
  }

  .active-tab-pane {
    background-color: #130f26;
    color: #fff;
  }
`;

interface FilterBtnProps {}

export const FilterBtn = styled(Button)<FilterBtnProps>`
  width: 45px;
  height: 45px;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  background: ${Colors.primaryColor};
`;

export const DarkText = styled(Text)`
  color: #2b3c54;
`;

export const LightText = styled(Text)`
  color: #8196b3;
`;

export const ClippedText = styled(Text)<{ color?: string }>`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: ${({ color }) => color ?? "#8196b3"};
  ${({ maxWidth }) => maxWidth && "max-width: " + maxWidth};
`;
