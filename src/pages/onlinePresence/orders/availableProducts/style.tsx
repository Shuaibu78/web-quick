import styled from "styled-components";
import { Colors } from "../../../../GlobalStyles/theme";

interface TableProps {
  width?: string;
  fontSize?: string;
  background?: string;
  maxWidth?: string;
  minWidth?: string;
  imgHeight?: string;
  height?: string;
  margin?: string;
  countColor?: string;
  color?: string;
  activeBg?: boolean;
  justifyContent?: string;
  maxHeight?: string;
}

interface IResponsive {
  mdMargin?: string;
  height?: string;
}

interface TbodyProps {
  overflowY?: string;
  height?: string;
  maxHeight?: string;
  width?: string;
}

export const Td = styled.div`
  width: ${(props: TableProps) => props.width};
  min-width: ${(props: TableProps) => props.width};
  font-size: ${(props: TableProps) => props.fontSize || "0.75rem"};
  span {
    color: ${(props: TableProps) => props.color || "currentColor"};
    width: 100%;
    text-align: left;
  }
`;

export const TRow = styled.div`
  color: #607087;
  display: flex;
  height: 3.75rem;
  border-radius: 1rem;
  align-items: center;
  width: 100%;
  cursor: pointer;
  justify-content: space-between;
  margin-bottom: 0.625rem;

  background: ${(props: TableProps) => props.background};
  :hover {
    background: #dde2e9;
  }
  && {
    background: ${(props: TableProps) => (props.activeBg ? "#dde2e9" : null)};
  }
`;

export const THead = styled.div`
  display: flex;
  color: #60708796;
  width: ${(props: TableProps) => (props.minWidth ? props.minWidth : "55.625rem")};
  font-size: ${(props: TableProps) => props.fontSize};
  justify-content: ${(props: TableProps) =>
    props.justifyContent ? props.justifyContent : "space-between"};
`;

export const Table = styled.div`
  margin: 1.25rem auto 0;
  width: ${(props: TableProps) => props.width ?? "unset"};
  overflow-x: scroll;
  height: ${(props: TableProps) => props.maxHeight ?? "calc(100% - 12.5rem)"};
  -ms-overflow-style: none;
  scrollbar-width: none;
  justify-content: space-between;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const TBtnCont = styled.div`
  display: flex;
  align-items: center;
  height: ${(props: IResponsive) => props.height || "auto"};
  button {
    width: 45px;
    height: 45px;
    border: none;
    border-radius: 0.75rem;
    margin: 0 0.3125rem;
    cursor: pointer;
    h3 {
      width: 100%;
    }
    @media screen and (max-width: 516px) {
      width: 2.5rem;
      height: 2.5rem;
    }
  }
  button:nth-child(1) {
    background: #f4f6f9;
  }
  button:nth-child(2) {
    background: #ffbe62;
  }
  @media screen and (max-width: 800px) {
    margin: ${(props: IResponsive) => props.mdMargin};
  }
`;

export const CustomCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: ${(props: TableProps) => (props.height ? props.height : "2.5rem")};
  background: ${(props: TableProps) => props.background};
  border-radius: 0.625rem;
  margin: ${(props: TableProps) => props.margin ?? "0px"};
  position: relative;

  .offset {
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 50%;
    height: 1.125rem;
    width: 1.125rem;
    background: ${(props: TableProps) => props.countColor};
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      padding: none;
      margin: none;
      color: white;
      font-size: 0.75rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
  }
  img {
    height: ${(props: TableProps) => props.imgHeight};
  }
  .expense_img {
    display: flex;
    height: 32px;
    width: 32px;
    border-radius: 0.5rem;
    background-color: rgba(246, 81, 81, 0.1);
    padding: 1.25rem;
    align-items: center;
    justify-content: center;
    margin-right: 1.25rem;

    img {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
  .inflow_img {
    display: flex;
    height: 32px;
    width: 32px;
    border-radius: 0.5rem;
    background-color: rgba(33, 150, 83, 0.1);
    padding: 1.25rem;
    align-items: center;
    justify-content: center;
    margin-right: 1.25rem;

    img {
      width: 1.25rem;
      height: 1.25rem;
    }
  }
`;

export const TBody = styled.div`
  margin-top: 0.625rem;
  overflow-y: ${(props: TbodyProps) => props.overflowY || "auto"};
  overflow-x: hidden;
  height: ${(props: TbodyProps) => props.height || "100%"};
  width: ${(props: TbodyProps) => props.width || "100%"};
  padding-right: 0.625rem;

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
`;

export const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 3.75rem;
  height: 34px;
`;

export const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  :checked + span {
    background-color: #ffbe62;
  }
  :focus + span {
    box-shadow: 0 0 1px #ffbe62;
  }
  :checked + span:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
`;

export const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;

  :before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;
  }
`;
