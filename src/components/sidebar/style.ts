import styled from "styled-components";
import LockImage from "../../assets/lock-bg.png";
import { isFigorr } from "../../utils/constants";
import { Colors } from "../../GlobalStyles/theme";

const { primaryColor, secondaryColor } = Colors;

interface SidebarProps {
  backgroundColor?: string;
  textColor?: string;
  show?: boolean;
  indicator?: string;
  access?: boolean;
  fontWeight?: number;
  isFigorr?: boolean;
}

export const SyncWrapper = styled.div`
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin-block: 0.3125rem 0;
  border-bottom: 1px solid #f0f3f8;

  p {
    font-size: 0.5rem;
    color: ${isFigorr ? secondaryColor : primaryColor};
    text-align: center;
    margin-bottom: 4px;
  }

  div {
    display: flex;
    align-items: center;
    text-align: center;
    cursor: pointer;
    font-size: 0.5rem;
    color: ${isFigorr ? secondaryColor : primaryColor};
  }
`;

export const SyncButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

export const LinkContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  min-height: 35%;
  max-height: 35%;
  height: 35%;
  padding-right: 0.3125rem;
  overflow-y: scroll;

  scrollbar-width: 3px;
  ::-webkit-scrollbar {
    background-color: transparent;
    width: 3px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${primaryColor};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-track {
    background-color: ${Colors.faintBlue};
  }

  #upgrade {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5em;
    width: 100%;
    height: 2.5rem;
    background-color: #f2c94c;
    background-image: -webkit-linear-gradient(
      -30deg,
      ${isFigorr ? "#0F8DE9" : "#f2c94c"} 0%,
      ${isFigorr ? "#7793D4" : "#f7917d"} 100%
    );
    background-image: linear-gradient(
      -30deg,
      ${isFigorr ? "#0F8DE9" : "#f2c94c"} 0%,
      ${isFigorr ? "#7793D4" : "#f7917d"} 100%
    );

    border-radius: 0.625rem;
    padding: 0.3125rem 0.625rem;
    border: none;
    font-size: 0.875rem;
    color: white;
    font-family: sans-serif;
    margin-top: 1rem;
    cursor: pointer;

    :hover {
      background-image: -webkit-linear-gradient(
        -80deg,
        ${isFigorr ? "#7793D4" : "#f7917d"} 0%,
        ${isFigorr ? "#0F8DE9" : "#f2c94c"} 100%
      );
      background-image: linear-gradient(
        -80deg,
        ${isFigorr ? "#7793D4" : "#f7917d"} 0%,
        ${isFigorr ? "#0F8DE9" : "#f2c94c"} 100%
      );
    }

    img {
      width: 1.25rem;
    }
  }
`;

export const Container = styled.div`
  width: 12.5rem;
  min-width: 12.5rem;
  padding: 0.625rem;
  // border-radius: 1rem;
  display: flex;
  flex-direction: column;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 1.25rem 0px;
  height: calc(100vh);
  min-height: (100vh);
  overflow-y: scroll;
  z-index: 99;
  background: #fff;
  -ms-overflow-style: none;
  scrollbar-width: none;
  position: relative;

  .logout {
    position: absolute;
    bottom: 3.5rem;
    width: 90%;
  }
  .end-shift {
    position: absolute;
    bottom: 1rem;
    width: 90%;
  }

  ::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width: 1024px) {
    position: fixed;
    transition: 0.3s linear;
    left: ${(props: SidebarProps) => (props.show ? "0px" : "-12.5rem")};
    overflow-y: scroll;
    border-radius: 0px;
    height: 100vh;
    min-height: calc(100vh - 3.125rem);
    :hover {
      padding: 0.625rem;
    }
  }
`;
export const Logo = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  cursor: pointer;
  height: auto;
  min-height: auto;
  padding-bottom: 0.3125rem;
  img {
    height: 2.4375rem;
    float: left;
  }
`;

export const LinkButton = styled.button`
  display: flex;
  position: relative;
  align-items: center;
  border: none;
  cursor: pointer;
  padding: 0 4px;
  height: 1.875rem;
  min-height: 1.875rem;
  width: calc(100% + 1.25rem);
  font-size: 0.8125rem;
  margin: 0.3125rem auto;
  gap: 0.625rem;
  border-radius: 0.5rem;
  font-weight: ${(props: SidebarProps) => props.fontWeight || "unset"};
  color: ${(props: SidebarProps) => props.textColor || "#607087"};
  background: ${(props: SidebarProps) => props.backgroundColor || "transparent"};
  opacity: ${({ access }) => (access ? 1 : 0.5)};

  :hover {
    background: ${(props: SidebarProps) => props.backgroundColor || "#130F2624"};
  }
  #icon {
    margin-left: 0.625rem;
    min-height: 0.9375rem;
    width: 0.9375rem;
  }

  span {
    font-size: 0.8125rem;
  }
  #lock {
    display: ${({ access }) => (access ? "none" : "flex")};
    position: absolute;
    right: 1.875rem;
  }
`;

export const ExclusivesButton = styled.button<SidebarProps>`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  border: none;
  cursor: pointer;
  height: 2.1875rem;
  margin: 0.5em 0 0.5rem 0.3rem;
  border-bottom: 1px solid #f0f3f8;
  min-height: 2.1875rem;
  width: calc(100% - 0.625rem);
  font-size: 0.6875rem;
  border-radius: 0.75rem;
  background-color: transparent;
  color: ${(props: SidebarProps) => props.textColor || "#607087"};
  opacity: ${({ access }) => (access ? 1 : 0.5)};

  .indicator {
    min-height: 0.4375rem;
    min-width: 0.4375rem;
    height: 0.4375rem;
    width: 0.4375rem;
    margin-left: 0.625rem;
    border-radius: 50%;
    background: ${({ indicator }) => indicator || "transparent"};
  }

  #chev {
    width: 0.3125rem;
  }
  #lock {
    position: absolute;
    right: 0.625rem;
    display: ${({ access }) => (access ? "none" : "flex")};
    width: 1rem;
  }
`;
export const LogoutBtn = styled.button`
  display: flex;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #f65151;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.8125rem;
  img {
    margin-bottom: 3px;
    margin-inline: auto;
  }
`;

export const AccountLockContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: url(${LockImage}), #f4f6f9;
  background-position: bottom right;
  background-size: 70%;
  background-repeat: no-repeat;
`;

export const LockSubContainer = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  border-radius: 1rem;
  background: white;
  display: flex;
  flex-direction: column;
`;

export const UpgradeContainer = styled.div`
  background-color: #f0f0f0;
  padding: 1.25rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;

  ul {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-direction: column;
    row-gap: 0.625rem;
  }

  li {
    line-height: 20px;
  }
`;

export const UpgradeTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.625rem;
`;

export const UpgradeMessage = styled.p`
  font-size: 1rem;
  color: #000;
  margin-block: 0.75rem;
`;

export const UpgradeButton = styled.button<{ backgroundColor?: string; hoverColor?: string }>`
  background-color: ${({ backgroundColor }) => backgroundColor ?? "#e47d05"};
  color: #fff;
  font-size: 1.125rem;
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ hoverColor }) => hoverColor ?? "#e47d05"};
  }
`;
