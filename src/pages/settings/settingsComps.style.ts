import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";

interface StyledNavLinkProps {
  active?: boolean;
  width?: string;
}

export const StyledNavLink = styled.div<StyledNavLinkProps>`
  color: ${(props) => (props.active ? Colors.secondaryColor : Colors.blackLight)};
  text-decoration: none;
  border-bottom: ${(props) => (props.active ? `2px solid ${Colors.secondaryColor}` : "none")};
  max-width: ${({ width }) => width ?? "7.5rem"};
  min-width: 6.875rem;
  text-align: center;
  font-size: 0.875rem;
  padding-block: 0.3rem;
  cursor: pointer;

  ${(props) =>
    props.active &&
    `/* styles for the active state */
    font-weight: 500;
    `}
`;

export const SettingsContainer = styled.div<{ navBarHeight?: number }>`
  border-radius: 1rem;
  width: 100%;
  height: ${({ navBarHeight }) => `calc(100vh - ${navBarHeight! + 10}px)` || "100%"};
  max-height: ${({ navBarHeight }) => `calc(100vh - ${navBarHeight! + 10}px)` || "100%"};
  background-color: ${Colors.white};
  padding-top: 1.25rem;
  overflow: hidden;
`;

export const SideBarLink = styled.div<StyledNavLinkProps>`
  color: ${(props) => (props.active ? Colors.secondaryColor : Colors.blackLight)};
  text-decoration: none;
  border-left: ${(props) => (props.active ? `2px solid ${Colors.secondaryColor}` : "none")};
  height: 2.25rem;
  width: 13.5rem;
  text-align: center;
  font-size: 0.875rem;
  align-items: center;
  display: flex;
  justify-content: flex-start;
  padding-left: 2.5rem;
  cursor: pointer;

  ${(props) =>
    props.active &&
    `/* styles for the active state */
    font-weight: 500;
    background: ${Colors.lightSecondaryColor}
    `}
`;

export const Divider = styled.hr`
  color: ${Colors.borderGreyColor};
  height: 100vh;
`;

export const SettingsBox = styled.div<{ overflow?: boolean; height?: string }>`
  display: block;
  width: 100%;
  height: fauto;
  max-height: ${({ height }) => height ?? "85vh"};
  padding-inline: 2rem;
  overflow-y: ${({ overflow }) => overflow && "scroll"};
  overflow-x: hidden;

  ${({ overflow }) =>
    overflow &&
    `
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
  `}
`;

export const BoxHeading = styled.h1<{ color?: string }>`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ color }) => color ?? Colors.blackishBlue};

  p {
    font-size: 0.75rem;
    font-weight: 400;
    color: ${Colors.grey};
    margin-top: 0.3125rem;
  }
`;

interface ShopTitleProps {
  color?: string;
  fontWeight?: string;
}

export const ShopTitleCont = styled.span<ShopTitleProps>`
  font-size: 0.875rem;
  margin-inline: 1rem;
  font-weight: ${({ fontWeight }) => fontWeight ?? "400"};
  color: ${({ color }) => color ?? Colors.blackishBlue};
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  p {
    font-size: 0.75rem;
    font-weight: 400;
    color: ${({ color }) => (color ? Colors.grey : Colors.blackishBlue)};
  }

  .button {
    color: ${Colors.primaryColor};
    cursor: pointer;
  }
`;

interface ButtonPlusIconProps {
  color?: string;
  bgColor?: string;
}

export const ButtonPlusIcon = styled.div<ButtonPlusIconProps>`
  cursor: pointer;
  width: 130px;
  height: 2.1875rem;
  background-color: ${({ bgColor }) => bgColor ?? Colors.white};
  color: ${({ color }) => color};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  font-size: 0.825rem;
  justify-content: center;
  column-gap: 0.8rem;
`;

export const FontSizeContainer = styled.div`
  margin: 1rem 0rem;

  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: ${Colors.borderGreyColor};
    padding: 1rem;
    margin: 0.5rem 0;
    border-radius: 0.75rem;
    width: 60%;
  }
`;

export const ChooseSize = styled.div`
  background: ${Colors.blackLight};
  height: 0.3rem;
  width: 60%;
  margin: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
  }
`;

export const SizeSpan = styled.span<{ active: boolean }>`
  width: 1rem;
  height: 1rem;
  background-color: ${({ active }) => (active ? Colors.primaryColor : Colors.emptyStarColor)};
  border-radius: 50%;
  cursor: pointer;
`;
