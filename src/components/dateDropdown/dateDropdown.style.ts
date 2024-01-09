import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";

interface OptionsProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  boxShadow?: string;
  overflowY?: string;
  bgColor?: string;
  border?: string;
  isFocused?: boolean;
  maxOptionsHeight?: string;
}

export const Options = styled.div`
  position: absolute;
  display: flex;
  width: ${(props: OptionsProps) => props.width ?? "100%"};
  flex-direction: column;
  top: ${(props: OptionsProps) => `calc(${props.height} + 2px)` || "37px"};
  border-radius: ${(props: OptionsProps) => props.borderRadius || "0.75rem"};
  box-shadow: ${(props: OptionsProps) => props.boxShadow ?? "unset"};
  background: ${(props: OptionsProps) => props.bgColor};
  overflow-y: ${(props: OptionsProps) => props.overflowY};
  z-index: 9999;
  max-height: ${(props: OptionsProps) => props.maxOptionsHeight ?? "12.5rem"};
  overflow-y: scroll;
  overflow-x: hidden;
  align-items: flex-start;
  padding-inline: 0.625rem;

  -ms-overflow-style: none;
  scrollbar-width: 0.3125rem;

  ::-webkit-scrollbar {
    background-color: #f6f8fb;
    width: 0.3125rem;
    display: none;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${Colors.primaryColor};
    border-radius: 4px;
  }
`;

export const Overlay = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 99;
`;
