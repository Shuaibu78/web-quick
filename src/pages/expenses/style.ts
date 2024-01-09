import styled from "styled-components";

interface TableProps {
  width?: string;
  fontSize?: string;
  background?: string;
  maxWidth?: string;
  minWidth?: string;
  imgHeight?: string;
}
interface SelectButtonProps {
  width?: string;
  height?: string;
  fontSize?: string;
  border?: string;
  background?: string;
  color?: string;
}
interface BalanceCardProps {
  width?: string;
  height?: string;
  backgroundColor?: string;
}

interface CashFlowButtonProps {
  background?: string;
}

export const CardContainer = styled.div`
  display: flex;
  height: auto;
  justify-content: space-between;
  padding: 0 0;
  gap: 1.25rem;
  margin: 0.625rem 0;
  @media screen and (max-width: 878px) {
    flex-direction: column;
  }
`;

export const Wrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
`;

export const Body = styled.div<{ navBarHeight: number; bgColor?: string; padding?: string }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${({ bgColor }) => bgColor ?? "#fff"};
  border-radius: 0.75rem;
  padding: ${({ padding }) => padding ?? "0.5rem"};
  height: ${({ navBarHeight }) => `calc(100vh - ${navBarHeight! + 10}px)` || "100%"};
  max-height: ${({ navBarHeight }) => `calc(100vh - ${navBarHeight! + 10}px)` || "100%"};
  // transition: height 0.3s ease-in-out;
`;

export const SelectButton = styled.button<SelectButtonProps>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${({ height }) => height ?? "2.5rem"};
  width: 100%;
  border-radius: 0.75rem;
  border: ${({ border }) => border ?? "unset"};
  background: ${({ background }) => background ?? "2.5rem"};
  font-size: ${({ fontSize }) => fontSize ?? "1rem"};
  color: ${({ color }) => color ?? "unset"};
  padding: 3px 0.625rem;
  cursor: pointer;

  img {
    width: 1.25rem;
  }
`;

export const DisplayWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 0.5rem;
  position: absolute;
  top: calc(100% + 0.3125rem);
  background: #f4f6f9;
  border-radius: 0.75rem;
  max-height: 12.5rem;
  padding: 1rem;
  overflow-y: scroll;
  z-index: 200;

  span {
    cursor: pointer;

    &:hover {
      color: #c4c4c4;
    }
  }
`;

export const UserObject = styled.p`
  background: #8196b3;
  border-radius: 1.25rem;
  padding: 0px 0.625rem;
  display: flex;
  height: 1.5625rem;
  position: relative;
  width: auto;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 1.5625rem;
  font-size: 0.75rem;

  span {
    height: 1.125rem;
    width: 1.125rem;
    border-radius: 50%;
    position: absolute;
    top: 3px;
    bottom: 0;
    right: 4px;
    color: white;
    background: white;
    display: flex;
    padding: 0px;
    margin: 0px;
    align-items: center;
    justify-content: center;
    color: white;
  }
  img {
    width: 0.625rem;
    cursor: pointer;
  }
`;
export const ExpenseCard = styled.div`
  width: 30%;
  background: #ffffff;
  border-radius: 1.25rem;
  padding: 0.625rem 1.25rem;
  max-height: 95px;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 4px 1.875rem rgba(35, 54, 79, 0.1);
  justify-content: space-between;
  h1 {
    padding-left: 0.5rem;
    font-size: 1.3rem;
    font-weight: 700;
    color: rgba(246, 81, 81);
  }
`;
export const CashCard = styled.div`
  width: 30%;
  background: #ffffff;
  border-radius: 1.25rem;
  padding: 0.625rem 1.25rem;
  max-height: 95px;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 4px 1.875rem rgba(35, 54, 79, 0.1);
  justify-content: space-between;

  h1 {
    padding-left: 0.5rem;
    font-weight: 700;
    font-size: 1.3rem;
    color: rgba(33, 150, 83);
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
`;
export const ExpensesWrapper = styled.div<{ height?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: ${({ height }) => height ?? "unset"};
`;

export const BalanceCard = styled.div<BalanceCardProps>`
  width: ${({ width }) => width || "40%"};
  background: ${({ backgroundColor }) => backgroundColor || "#ffbe62"};
  color: white;
  box-shadow: 0px 0px 1.875rem rgba(140, 157, 181, 0.06);
  border-radius: 0.75rem;
  padding: 0.625rem 1.25rem;
  height: 4.375rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;

  #exp-image {
    transform: rotate(180deg);
  }

  #total {
    font-size: 1.3rem;
    font-weight: 600;
    color: #fff;
  }
  #income {
    font-size: 1.3rem;
    font-weight: 600;
    color: #219653;
  }
  #expense {
    font-size: 1.3rem;
    font-weight: 500;
    color: #ff5050;
  }

  p {
    color: #9ea8b7;
  }
  @media screen and (max-width: 878px) {
    max-width: 100%;
  }
`;

export const BalanceHeader = styled.div`
  p {
    color: #fff;
    font-weight: 500;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: space-between;

  .buttons {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

export const ZigZag = styled.img`
  position: absolute;
  bottom: 1.5625rem;
  right: 1.25rem;
`;
export const TBtnCont = styled.div`
  display: flex;
  align-items: center;
  button {
    width: 45px;
    height: 45px;
    border: none;
    border-radius: 0.75rem;
    margin: 0 0.3125rem;
    cursor: pointer;
    background: #ffbe62;
  }
`;

export const MenuBar = styled.div`
  margin-top: 0.625rem;
  margin-bottom: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
    border-radius: none;
  }
  .right-div {
  }
  @media screen and (max-width: 816px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
export const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #607087;
`;

export const FilterModal = styled.div`
  position: absolute;
  top: 2rem;
  right: 1.25rem;
  height: 80vh;
  width: 18.75rem;
  background: #fff;
  box-shadow: 0px 4px 1.875rem rgba(140, 157, 181, 0.06);
  border-radius: 1.25rem;
  padding: 1.25rem;
  h3 {
    color: #607087;
  }
  h4 {
    font-size: 0.875rem;
    color: #607087;
    padding: 0.625rem 0 0.3125rem 0;
  }
  button {
    cursor: pointer;
    background: transparent;
    border: none;
  }
`;
export const ListItem = styled.div`
  display: flex;
  margin: 13px 0;
  p {
    padding-left: 0.625rem;
    font-size: 0.875rem;
    span {
      padding-left: 0.625rem;
      color: #607087;
      opacity: 0.6;
    }
  }
`;

export const Table = styled.div`
  margin-top: 1.25rem;
  max-width: ${(props: TableProps) => props.maxWidth};
  overflow-x: scroll;
`;
export const THead = styled.div`
  display: flex;
  color: #60708796;
  font-size: ${(props: TableProps) => props.fontSize};
`;
export const Td = styled.div`
  width: ${(props: TableProps) => props.width};
  min-width: ${(props: TableProps) => props.width};
  span {
    width: 100%;
  }
`;
export const TBody = styled.div`
  margin-top: 0.625rem;
`;
export const TRow = styled.div`
  color: #607087;
  display: flex;
  height: 2.1875rem;
  border-radius: 1rem;
  align-items: center;
  min-width: ${(props: TableProps) => (props.minWidth ? props.minWidth : "55.625rem")};
  width: 100%;
  cursor: pointer;
  background: ${(props: TableProps) => props.background};
  :hover {
    background: #dde2e9;
  }
`;
export const TControls = styled.div`
  display: flex;
  justify-content: space-between;
  h3 {
    color: #607087;
    font-size: 1.125rem;
  }
`;

export const CustomCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: ${(props: TableProps) => props.background};
  border-radius: 0.625rem;
  margin: 0 auto;
  img {
    height: ${(props: TableProps) => props.imgHeight};
  }
`;
export const CurrentPage = styled.div`
  display: flex;
  align-items: center;
  p {
    font-size: 0.875rem;
  }
  button {
    padding: 0.625rem 0.9375rem;
    margin: 0.625rem;
    box-shadow: 0px 4px 1.875rem rgba(140, 157, 181, 0.08);
    border-radius: 0.75rem;
    border: none;
    background: #ffbe62;
    cursor: pointer;
  }
  span {
    font-weight: bold;
  }
`;
export const PerPage = styled.div`
  display: flex;
  align-items: center;
  p {
    font-size: 0.875rem;
    color: #8196b3;
    margin-right: 0.625rem;
  }
`;
export const JumpTo = styled.div`
  display: flex;
  align-items: center;
  p {
    color: #8196b3;
    font-size: 0.875rem;
    margin-right: 0.625rem;
  }
  div {
    display: flex;
    background: #f4f6f9;
    border-radius: 0.75rem;
    overflow: hidden;
    input {
      border: none;
      background: transparent;
      width: 4.375rem;
      color: #8196b3;
      padding: 0 0.625rem;
    }
    button {
      background: #8196b3;
      padding: 0.625rem 0.9375rem;
      border: none;
      box-shadow: 0px 4px 1.875rem rgba(140, 157, 181, 0.08);
      border-radius: 0.75rem;
      cursor: pointer;
    }
  }
`;
export const NotFoundContainer = styled.div`
  width: 100%;
  height: 63vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 35.625rem;

  h3 {
    color: rgba(96, 112, 135, 1);
  }
  p {
    color: rgba(129, 150, 179, 1);
  }
`;
export const Summary = styled.div`
  height: 42px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3125rem 1.25rem;
  width: 100%;
  background-color: rgba(248, 250, 252, 1);
  color: rgba(96, 112, 135, 1);
  border-radius: 1rem;
  margin-bottom: 1.25rem;

  h3 {
    font-size: 0.875rem;
    font-weight: 500;
  }
  div {
    display: flex;
  }
  p {
    font-size: 0.875rem;
    font-weight: 400;
  }
  .expense {
    color: rgba(246, 81, 81, 1);
    font-size: 0.875rem;
    font-weight: 500;
    margin-right: 1.25rem;
  }
  .inflow {
    color: rgba(33, 150, 83, 1);
    font-size: 0.875rem;
    font-weight: 500;
    margin-right: 1.25rem;
  }
  .balance {
    color: rgba(255, 190, 98, 1);
    font-size: 0.875rem;
    font-weight: 500;
    margin-right: 1.25rem;
  }
  @media screen and (max-width: 900px) {
    flex-direction: column;
    height: 20%;
    align-items: flex-start;
  }
`;
