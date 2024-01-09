import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";

export const Container = styled.div<{ isOpen: boolean; bgColor?: string; margin?: string }>`
  border-radius: 0.75rem;
  background-color: ${({ bgColor }) => bgColor ?? Colors.white};
  margin-block: 0.3125rem;
  width: 100%;
  padding-bottom: 0.625rem;
  margin-top: ${({ margin }) => margin ?? "2rem 0 0 0"};

  transition: all 0.5s ease-in-out;
  height: ${({ isOpen }) => (isOpen ? "auto" : "4.5rem")};
`;

export const Header = styled.div`
  padding: 0.625rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

export const Content = styled.div<{ isOpen: boolean }>`
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
`;
