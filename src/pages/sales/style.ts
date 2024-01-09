import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";
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
  headWidth?: string;
  overflowX?: string;
  isSelected?: boolean;
  borderRadius?: string;
}
interface TextAreaProps {
  color?: string;
  height?: string;
  margin?: string;
}
interface IResponsive {
  mdMargin?: string;
  height?: string;
}
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
}

interface TbodyProps {
  overflowY?: string;
  overflowX?: string;
  height?: string;
  maxHeight?: string;
  width?: string;
}

export const Table = styled.div`
  margin: ${(props: TableProps) => props.margin ?? "1.25rem auto 0"};
  max-width: ${(props: TableProps) => props.maxWidth ?? "unset"};
  overflow-x: ${(props: TableProps) => props.overflowX ?? "scroll"};
  min-height: 18.75rem;
  height: ${(props: TableProps) => props.maxHeight ?? "100%"};
  -ms-overflow-style: none;
  scrollbar-width: none;
  justify-content: space-between;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const Counter = styled.span<{ color?: string }>`
  text-align: center;
  font-size: 0.625rem !important;
  color: ${({ color }) => color ?? "unset"};
`;

export const ProductDiv = styled.div`
  overflow-y: scroll;
  height: 45.625rem;
  -ms-overflow-style: none;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }

  .no-product {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    padding-bottom: 3.125rem;
    justify-content: center;
    align-items: center;
  }
`;

export const StaffTHead = styled.div`
  display: flex;
  color: #60708796;
  font-size: ${(props: TableProps) => props.fontSize};
  width: ${(props: TableProps) => (props.headWidth ? props.headWidth : "100%")};
  justify-self: left;
  align-items: flex-start;
  justify-content: ${(props: TableProps) =>
    props.justifyContent ? props.justifyContent : "space-between"};
`;
export const THead = styled.div`
  display: flex;
  color: #60708796;
  min-width: ${(props: TableProps) => (props.minWidth ? props.minWidth : "55.625rem")};
  font-size: ${(props: TableProps) => props.fontSize};
  width: ${(props: TableProps) => (props.headWidth ? props.headWidth : "100%")};
  justify-self: left;
  align-items: flex-start;
  padding-right: 0.9375rem;
  justify-content: ${(props: TableProps) =>
    props.justifyContent ? props.justifyContent : "space-between"};
`;
export const Td = styled.div`
  display: flex;
  justify-content: flex-start;
  width: ${(props: TableProps) => props.width};
  min-width: ${(props: TableProps) => props.width};
  font-size: ${(props: TableProps) => props.fontSize || ".75rem"};

  span {
    color: ${(props: TableProps) => props.color || "currentColor"};
    width: 80%;
    text-align: left;
  }

  .overflow {
    white-space: wrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: ${(props: TableProps) => props.width};
    max-width: ${(props: TableProps) => props.width};
  }
`;
export const TBody = styled.div`
  margin-top: 0.625rem;
  overflow-y: ${(props: TbodyProps) => props.overflowY || "auto"};
  height: ${(props: TbodyProps) => props.height || "unset"};
  width: ${(props: TbodyProps) => props.width || "100%"};
  max-height: ${(props: TbodyProps) => props.maxHeight || "unset"};
  padding-right: 0.625rem;

  -ms-overflow-style: none;
  scrollbar-width: 0.3125rem;

  ::-webkit-scrollbar {
    background-color: #f6f8fb;
    width: 0.3125rem;
    height: 0.3125rem;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${Colors.primaryColor};
    border-radius: 4px;
  }
`;
export const TRow = styled.div`
  color: ${(props: TableProps) => (!props.isSelected ? "#607087" : "#fff")};
  display: flex;
  height: ${(props: TableProps) => (props.height ? props.height : "3.75rem")};
  border-radius: 0.5rem;
  align-items: center;
  min-width: ${(props: TableProps) => (props.minWidth ? props.minWidth : "55.625rem")};
  width: 100%;
  cursor: pointer;
  justify-content: space-between;
  margin-bottom: 0.625rem;
  justify-content: ${(props: TableProps) =>
    props.justifyContent ? props.justifyContent : "space-between"};
  background: ${(props: TableProps) => (props.isSelected ? Colors.primaryColor : props.background)};

  :hover {
    background: ${(props: TableProps) => (!props.isSelected ? "#dde2e9" : null)};
    border-radius: 16px;
  }
  && {
    background: ${(props: TableProps) => (props.activeBg && !props.isSelected ? "#dde2e9" : null)};
  }
`;
export const TControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    color: #607087;
    font-size: 1.125rem;
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

export const ReceiptContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 0.5rem;

  @media screen and (max-width: 1024px) {
    flex-direction: column;
  }
`;
export const ItemContainer = styled.div`
  width: 50%;
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

  .tool-tip {
    position: absolute;
    bottom: -3em;
    z-index: 999900000;
  }

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
export const Left = styled.div<{ overflow?: boolean; height?: string }>`
  width: 50%;
  height: ${({ height }) => height ?? "85vh"};
  background-color: white;
  border-radius: 1.25rem;
  padding: 0.625rem;

  @media screen and (max-width: 1024px) {
    width: 100%;
    height: auto;
  }
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
export const Right = styled.div<{ overflow?: boolean }>`
  width: 50%;
  padding-left: 1.875rem;
  padding-right: 1.875rem;
  height: 85vh;
  position: relative;
  margin-bottom: 6rem;

  background-color: white;
  border-radius: 1.25rem;
  padding: 0.625rem;

  @media screen and (max-width: 1024px) {
    width: 100%;
    padding: 0;
    height: auto;
  }

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
export const RefundForm = styled.form<{ width?: string }>`
  background: #ffffff;
  box-shadow: 1.875rem 0.75rem 1.875rem rgba(140, 157, 181, 0.28);
  padding: 1.25rem;
  border-radius: 1.25rem;
  position: fixed;
  bottom: 1.25rem;
  right: 6.25rem;
  height: 400px;
  max-width: ${(props) => (props.width ? props.width : "31.25rem")};
  min-width: ${(props) => (props.width ? props.width : "31.25rem")};
  @media screen and (max-width: 1024px) {
    width: 100%;
    left: 2.5rem;
    max-width: calc(100% - 2rem);
    min-width: calc(100% - 2rem);
  }
`;
export const CustomRefundForm = styled.form`
  background: #ffffff;
  box-shadow: 0px -0.75rem 1.875rem rgba(140, 157, 181, 0.08);
  padding: 1.25rem;
  border-radius: 1.25rem;
  margin-top: 5%;
`;

export const CancelButton = styled.button<{ hover?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  min-height: 2.5rem;
  border: 1px solid #607087;
  border-radius: 0.625rem;
  cursor: pointer;
  background: transparent;
  align-self: flex-end;
  transition: all ease-in-out 0.3s;

  :hover {
    img {
      transition: all ease-in-out 0.3s;
      transform: rotate(30deg);
    }
  }
`;

export const FormHeading = styled.h3`
  font-size: 1.375rem;
  color: #607087;
  padding-left: 1.25rem;
`;
export const TextArea = styled.textarea`
  display: block;
  border-radius: 1rem;
  padding: 0.625rem;
  width: 100%;
  height: ${(props: TextAreaProps) => (props.height ? props.height : "9.375rem")};
  color: ${(props: TextAreaProps) => (props.color ? props.color : "#607087")};
  background: #f4f6f9;
  outline: none;
  resize: none;
  border: none;
  margin: ${(props: TextAreaProps) => (props.color ? props.margin : "0 0 1.25rem 0")};

  ::placeholder {
    color: #8196b3;
    opacity: 0.7;
  }

  :focus {
    transition: all ease-in-out 0.2s;
    border: 1px solid ${Colors.primaryColor};
  }
`;
export const Label = styled.label`
  font-weight: 400;
  font-size: 13px;
  color: #607087;
  display: block;
  margin: 0.625rem 0;
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
    background: ${Colors.primaryColor};
    cursor: pointer;
  }
  span {
    font-weight: bold;
  }
  @media screen and (max-width: 31.25rem) {
    width: 100%;
    margin: 3px 0;
    justify-content: center;
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
  input {
    width: 4.375rem;
    height: 2.5rem;
    color: #607087;
    border-radius: 0.75rem;
    background-color: #f4f6f9;
    font-size: 1rem;
    padding: 0 0.625rem;
    border: none;
    outline: none;
  }
  @media screen and (max-width: 31.25rem) {
    width: 100%;
    margin: 3px 0;
    justify-content: center;
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
    overflow: hidden;
    border-radius: 12px;
    input {
      border-radius: 0.75rem;
      background: transparent;
      width: 2rem;
      color: #8196b3;

      &:focus {
        outline: none;
        border: none;
      }
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
  @media screen and (max-width: 31.25rem) {
    width: 100%;
    margin: 3px 0;
    justify-content: center;
  }
`;

interface FilterModalProps {
  top?: string;
  right?: string;
  height?: string;
}
export const FilterModalContainer = styled.div`
  background: rgba(0, 0, 0, 0.4);
  height: 100vh;
  width: 100vw;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
  display: flex;
  justify-content: end;
`;
export const FilterModal = styled.div`
  height: 100%;
  max-height: 100%;
  overflow-y: scroll;
  z-index: 9999999;
  width: 350px;
  background: #fff;
  box-shadow: "4px 4px 1.875rem rgba(23, 46, 78, 0.1)";
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
  #cancel-btn {
    cursor: pointer;
    background: transparent;
    border: none;
    margin-right: 0.625rem;
    background: #e9eff6;
    border-radius: 0.5rem;
    height: 36px;
    width: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  label {
    font-size: 0.75rem;
    color: #607087;
    display: flex;
    padding: 0.625rem 0 0.5rem 0;
  }
`;
export const ListItem = styled.p`
  font-size: 0.875rem;
  display: flex;
  padding: 3px 0;
  color: #8196b3;
  margin: ${(props: FlexProps) => props.margin};
  p {
    padding-left: 0.625rem;
  }
  span {
    font-weight: 600;
    color: #607087;
    padding-left: 0.75rem;
  }
`;

// View Reciept
export const MenuBar = styled.div`
  margin-top: 1.875rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled.h3`
  font-size: 1.125rem;
  width: 400px;
  font-weight: 600;
  color: #607087;
  display: flex;

  .subTitle {
    margin-left: 10%;
    display: flex;
    align-items: center;
    img {
      margin-right: 0.625rem;
    }
  }
`;

export const CashierCard = styled.div`
  display: flex;
  margin: 1.875rem 0;
  background: #ffffff;
  box-shadow: 0px -0.75rem 1.875rem rgba(140, 157, 181, 0.08);
  padding: 1.25rem;
  border-radius: 1.25rem;
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
  width: 50%;
`;

export const SubCard = styled.div`
  background: #f6f8fb;
  border-radius: 1.25rem;
  padding: 0.9375rem 28px;
`;

export const BorderTop = styled.div`
  padding: 0.625rem 0 0.3125rem 0;
  margin-top: 0.625rem;
  border-top: 1px solid #8196b3;
`;

export const ItemsContainer = styled.div`
  margin: 1.875rem 0;
  background: #ffffff;
  box-shadow: 0px -0.75rem 1.875rem rgba(140, 157, 181, 0.08);
  padding: 1.25rem;
  border-radius: 1.25rem;
  position: relative;
`;
export const SelectionList = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 0.625rem 0;
  column-gap: 0.3125rem;
  row-gap: 0.3125rem;
  width: 100%;
`;
export const FilterItem = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 7px;
  background: #130f26;
  border-radius: 99px;
  font-size: 0.75rem;
  color: white;
  button {
    height: 19px;
    width: 19px;
    cursor: pointer;
    background: transparent;
    border: none;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 2px;
    img {
      height: 19px;
      width: 19px;
    }
  }
`;
export const FilterItemB = styled.div`
  display: inline-flex;
  align-items: center;
  padding: 4px 7px;
  background: #f6f8fb;
  border-radius: 99px;
  font-size: 0.75rem;
  color: #130f26;
  margin-top: 3px;
  button {
    height: 19px;
    width: 19px;
    cursor: pointer;
    background: transparent;
    border: none;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-right: 2px;
    img {
      height: 19px;
      width: 19px;
    }
  }
`;
export const FilterByCont = styled.div`
  padding: 0.625rem 0;
  margin: 0.3125rem 0;
  border-top: 1px solid #8196b388;
  border-bottom: 1px solid #8196b388;
`;
export const FilterDropdown = styled.div`
  display: flex;
  border: 1px solid #8196b3;
  border-radius: 0.75rem;
  padding: 0.3125rem;
  #dropdown {
    width: 1.5625rem;
    background: transparent;
    height: 100%;
    padding-top: 3px;
    border: none;
    cursor: pointer;
  }
`;
export const ResultContainer = styled.div`
  padding: 0.9375rem 0;
`;

interface ProductFilterCardProps {
  isActive?: boolean;
}

export const ProductFilterCard = styled.div<ProductFilterCardProps>`
  padding: 0.625rem;
  cursor: pointer;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #60708722;
  margin: 2px 0;
  ${({ isActive }) => isActive && "background: #e0e0e0;"}
  p {
    font-weight: 500;
    color: #607087;
  }
  span {
    font-weight: 400;
    color: #607087;
    font-size: 0.75rem;
  }
  :hover {
    background: ${({ isActive }) => (isActive ? "#e0e0e0" : "#eee")};
  }
`;
export const FilterContainer = styled.div`
  p {
    font-weight: 400;
    color: #607087;
    font-size: 0.75rem;
    padding: 0.625rem 0;
  }
  #filter-container {
    display: flex;
    flex-wrap: wrap;
  }
`;
export const Filter = styled.div`
  margin-right: 0.625rem;
  display: flex;
  flex-direction: column;
  #head {
    background: #130f26;
    font-size: 0.625rem;
    padding: 1px;
    color: #9ea8b7;
    width: fit-content;
  }
  p {
    font-size: 0.75rem;
  }
`;
