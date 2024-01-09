import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";
const { primaryColor } = Colors;

interface DropdownProps {
  width?: string;
  minWidth?: string;
  height?: string;
  containerColor?: string;
  iconContainerColor?: string;
  fontSize?: string;
  borderRadius?: string;
  noBorder?: boolean;
  color?: string;
  boxShadow?: string;
  margin?: string;
  padding?: string;
  overflowY?: string;
  bgColor?: string;
  border?: string;
  isFocused?: boolean;
  maxOptionsHeight?: string;
  iconSize?: string;
}
export const Container = styled.div`
  position: relative;
  font-size: ${(props: DropdownProps) => props.fontSize || "1rem"};
  width: ${(props: DropdownProps) => props.width || "15.625rem"};
  min-width: ${(props: DropdownProps) => props.minWidth || "none"};
  display: flex;
  height: ${(props: DropdownProps) => props.height || "1.875rem"};
  box-shadow: ${(props: DropdownProps) => props.boxShadow || "none"};
  margin: ${(props: DropdownProps) => props.margin || "0"};
  border: 1px solid ${(props: DropdownProps) => props.border || Colors.grey};
  border-radius: ${(props: DropdownProps) => props.borderRadius || "0.75rem"};
  background-color: ${(props: DropdownProps) => props.containerColor || "#F4F6F9"};
  /* margin-top: 1rem; */

  span {
    position: absolute;
    left: 0;
    top: -1.25rem;
    font-size: 0.75rem;
    z-index: 20;
    background-color: transparent;
    color: ${({ isFocused }) => (isFocused ? primaryColor : "#607087")};
    padding: 0 0.3125rem;
  }

  .closeDiv {
    height: 100vh;
    width: 100vw;
    background: transparent;
    position: fixed;
    top: 0;
    left: 0;
  }
`;
export const DropdownBtn = styled.button`
  background: ${(props: DropdownProps) => (props.bgColor ? props.bgColor : "none")};
  border: ${(props: DropdownProps) => (props.border ? "1px solid #607087" : "none")};
  border-radius: ${(props: DropdownProps) => props.borderRadius || "3px"};
  font-size: ${(props: DropdownProps) => props.fontSize || "1rem"};
  padding: ${(props: DropdownProps) => props.padding || "0"};
  width: ${(props: DropdownProps) => props.width || "100%"};
  min-width: ${(props: DropdownProps) => props.minWidth || "none"};
  display: flex;
  position: relative;
  cursor: pointer;
  align-items: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
export const IconContainer = styled.div`
  width: 1.875rem;
  height: 100%;
  background: ${(props: DropdownProps) => props.iconContainerColor};
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 0;
  img {
    width: ${(props: DropdownProps) => props.iconSize || "25px"};
  }
`;
export const Icon = styled.div`
  width: 1.875rem;
  height: 0.9375rem;
  min-width: 1.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 0.3125rem;
  img {
    height: 0.9375rem;
    width: 1.25rem;
  }
`;
export const Selected = styled.div`
  width: calc(100% - 2.5rem);
  display: flex;
  align-items: center;
  color: ${(props: DropdownProps) => props.color};
  padding-left: 0.3125rem;
`;
export const Options = styled.div`
  position: absolute;
  display: flex;
  width: ${(props: DropdownProps) => props.width ?? "100%"};
  flex-direction: column;
  top: ${(props: DropdownProps) => `calc(${props.height} + 2px)` || "37px"};
  border-radius: ${(props: DropdownProps) => props.borderRadius || "3px"};
  box-shadow: ${(props: DropdownProps) => props.boxShadow || "none"};
  background: #fff;
  overflow-y: ${(props: DropdownProps) => props.overflowY};
  box-shadow: 0 0 0.3125rem #eee;
  border: 1px solid #eee;
  z-index: 9999;
  max-height: ${(props: DropdownProps) => props.maxOptionsHeight ?? "12.5rem"};
  overflow-y: scroll;
  align-items: flex-start;
  box-shadow: 0px 1.25rem 1.25rem 0px rgba(19, 15, 38, 0.08);

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

  button {
    cursor: pointer;
    border: none;
    height: ${(props: DropdownProps) => props.height || "1.875rem"};
    color: ${(props: DropdownProps) => props.color};
    font-size: ${(props: DropdownProps) => props.fontSize || "0.875rem"};
    min-height: 1.875rem;
    max-height: 1.875rem;
    width: 100%;
    margin: 4px 0px 0px 0px;
    background: transparent;

    :hover {
      background: #f4f6f9;
    }
  }
`;
