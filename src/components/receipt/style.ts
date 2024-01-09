import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";

interface FlexProps {
  justifyContent?: string;
  alignItems?: string;
  flexDirection?: "column" | "row" | "column-reverse" | "row-reverse";
  padding?: string;
  margin?: string;
  height?: string;
  width?: string;
  backgroundColor?: string;
  borderRadius?: string;
  flexWrap?: string;
  boxShadow?: string;
  gap?: string;
  color?: string;
  disabled?: boolean;
  zIndex?: number;
  borderRight?: string;
  bgColor?: string;
  cursor?: string;
}
export const Container = styled.div`
  position: relative;
  min-width: 350px;

  .receiptItemsContainer {
    -ms-overflow-style: none;
    scrollbar-width: 0.3125rem;

    ::-webkit-scrollbar {
      background-color: #f6f8fb;
      width: 0.3125rem;
    }

    ::-webkit-scrollbar-thumb {
      background-color: ${Colors.primaryColor};
      border-radius: 4px;
    }
  }
`;
export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h2 {
    color: #607087;
    font-size: 1.25rem;
  }
`;

export const PreReceiptContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 350px;
  h3 {
    color: #607087;
    font-size: 1.125rem;
    margin: 0.625rem 0;
  }
  p {
    color: #8196b3;
    font-size: 0.875rem;
    padding: 4px 0;
    width: 50%;
    margin: 0 auto;
    text-align: center;
  }
`;
export const CashierCard = styled.div`
  display: flex;
  margin: 1.25rem 0 0.5rem;
  width: 50%;
  img {
    height: 68px;
    width: 68px;
    border-radius: 0.75rem;
    margin-right: 0.625rem;
  }
`;
export const CashierDetails = styled.div`
  display: flex;
  width: 100%;
  h4,
  p {
    color: #607087;
    font-size: 0.875rem;
  }
  p {
    margin: 0.3125rem 0 2px 0;
  }
  small {
    font-size: 0.75rem;
    color: #ffbe62;
  }
`;
export const SubDetails = styled.div`
  width: 100%;
`;

export const SubCard = styled.div`
  background: #f6f8fb;
  border-radius: 1.25rem;
  padding: 0.9375rem 28px;
`;

export const ListItem = styled.p`
  font-size: 0.875rem;
  color: ${(props: FlexProps) => props.color ?? "#8196b3"};
  margin: ${(props: FlexProps) => props.margin};
  z-index: 2;
  span {
    font-weight: 600;
    color: #607087;
    padding-left: 0.75rem;
  }
`;

export const Flex = styled.div`
  display: flex;
  width: ${(props: FlexProps) => props.width ?? "100%"};
  height: ${(props: FlexProps) => props.height};
  flex-direction: ${(props: FlexProps) => props.flexDirection};
  border-radius: ${(props: FlexProps) => props.borderRadius};
  background: ${(props: FlexProps) => props.backgroundColor};
  margin: ${(props: FlexProps) => props.margin};
  justify-content: ${(props: FlexProps) => props.justifyContent};
  padding: ${(props: FlexProps) => props.padding};
  align-items: ${(props: FlexProps) => props.alignItems};
  flex-wrap: ${(props: FlexProps) => props.flexWrap};
  box-shadow: ${(props: FlexProps) => props.boxShadow};
  gap: ${(props: FlexProps) => (props.gap ? props.gap : "unset")};
  pointer-events: ${(props: FlexProps) => (props.disabled ? "none" : "unset")};
  opacity: ${(props: FlexProps) => (props.disabled ? "0.6" : "unset")};
  z-index: ${(props: FlexProps) => props.zIndex ?? 1};
  border-right: ${(props: FlexProps) => props.borderRight ?? "0px"};
  background-color: ${(props: FlexProps) => props.bgColor ?? ""};
  cursor: ${(props: FlexProps) => props.cursor};

  h3 {
    font-size: 1rem;
    color: #607087;
  }

  div > h1 {
    font-size: 24px;
    color: #607087;
    font-weight: 600;
  }
`;

export const Input = styled.input`
  appearance: none;
  outline: none;
  font-size: 0.75rem;
  background-color: transparent;
  color: black;
  border-style: solid;
  padding-block: 1rem;
  padding-inline: 1rem;
  border-radius: 0.625rem;
  margin-bottom: 0.625rem;
  border: 1px solid black;
  width: 100%;
  height: 3.125rem;
  ::placeholder {
    color: #8196b3;
    opacity: 0.7;
  }

  &:hover {
    cursor: unset;
  }
`;

export const BorderTop = styled.div`
  padding: 0.625rem 0 0.3125rem 0;
  margin-top: 0.625rem;
  border-top: 1px solid #8196b3;
`;
export const FlexItem = styled.div`
  width: ${(props: FlexProps) => props.width};
  height: ${(props: FlexProps) => props.height};
`;
export const ItemsContainer = styled.div<{ margin?: string }>`
  min-height: 3.125rem;
  margin: ${(props) => props.margin ?? "0.625rem 0"};
  overflow-y: scroll;
  scrollbar-width: 0.3125rem;

  ::-webkit-scrollbar {
    background-color: #f6f8fb;
    width: 0.3125rem;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${Colors.primaryColor};
  }
`;
