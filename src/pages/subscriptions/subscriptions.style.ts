import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";

export const NoSubContainer = styled.div<{ minHeight?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: ${({ minHeight }) => minHeight ?? "31.25rem"};
  h3 {
    color: #607087;
    font-size: 1.125rem;
    margin: 0.625rem 0;
  }
  p {
    color: #8196b3;
    font-size: 0.875rem;
    padding: 0.25rem 0;
    width: 50%;
    margin: 0 auto;
    text-align: center;
  }
`;

interface iSubCardSelector {
  checked?: boolean;
  width?: string;
  height?: string;
  checkedBg?: string;
  inactiveBg?: string;
  justify?: string;
  padding?: string;
  margin?: string;
}
export const SubCardSelector = styled.div<iSubCardSelector>`
  display: flex;
  align-items: center;
  justify-content: ${({ justify }) => justify};
  cursor: pointer;
  height: ${({ height }) => height ?? "5rem"};
  width: ${({ width }) => width ?? "100%"};
  border: ${({ checked, inactiveBg }) =>
    checked ? "none" : inactiveBg ? "none" : `1px solid ${Colors.grey4}`};
  background-color: ${({ checked, checkedBg, inactiveBg }) =>
    checked ? checkedBg ?? "#ECEFF4" : inactiveBg ?? "transparent"};
  margin: ${({ margin }) => margin ?? "0.625rem 0"};
  border-radius: 0.75rem;
  padding: ${({ padding }) => padding ?? "0.625rem 0.625rem"};
`;
