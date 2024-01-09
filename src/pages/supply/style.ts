import styled from "styled-components";
import { FaSearch } from "react-icons/fa";
import { Colors } from "../../GlobalStyles/theme";

export const EmptyStateTitle = styled.h5`
  color: #607087;
  font-weight: 600;
  font-size: 1.125rem;
  line-height: 21px;
`;

export const EmptyStateContent = styled.p`
  color: #9ea8b7;
  font-weight: 400;
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-align: center;
  margin-top: 0.625rem;
  width: 316px;
`;

export const SalesCardContainer = styled.div`
  display: flex;
  background-color: #fff;
  margin-top: 0.5em;
`;

export const RadioWrapper = styled.label<{ checked?: boolean }>`
  display: flex;
  align-items: center;
  width: auto;
  background-color: ${({ checked }) => (checked ? "#DBF9E8" : "#F4F6F9")};
  padding: 0.625rem;
  border-radius: 0.75rem;
  gap: 0px 0.3125rem;
  cursor: pointer;
`;

export const RadioInput = styled.input<{ checked?: boolean }>`
  position: relative;
  &:before {
    content: " ";
    display: inline-block;
    position: relative;
    top: -1px;
    left: -1px;
    margin: 0 0.3125rem 0 0;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    border: 2px solid ${({ checked }) => (checked ? "#219653" : "#9EA8B7")};
    background-color: #f4f6f9;
  }

  &:checked:after {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    top: 2.3125rem;
    left: 2.3125rem;
    position: absolute;
    background-color: #219653;
    content: "";
    display: inline-block;
    visibility: visible;
    border: 2px solid #219653;
  }
`;

export const CustomRadio = styled.span<{ checked?: boolean }>`
  position: relative;
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 1px solid ${({ checked }) => (checked ? "#219653" : "#F4F6F9")};
  border-radius: 50%;
  margin-right: 0.3125rem;

  &:before {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 0.625rem;
    height: 0.625rem;
    border-radius: 50%;
    background-color: ${({ checked }) => (checked ? "#219653" : "#F4F6F9")};
  }
`;

const { primaryGrey } = Colors;

interface ITransactionCardProps {
  isCredit?: boolean;
}
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
`;

export const TransactionCard = styled.div`
  width: 48%;
  background: #fff;
  box-shadow: 0px 4px 1.875rem 0px #8c9db50f;
  border-radius: 1.25rem;
  padding: 0.9375rem;
  height: 130px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  h2 {
    font-weight: 500;
    color: ${(props: ITransactionCardProps) => (props.isCredit ? "#F65151" : "#219653")};
  }
  h3 {
    color: #607087;
  }
`;
export const CustomerCard = styled.div`
  display: flex;
  padding: 0.9375rem 0;
`;

interface IBalanceCard {
  isCredit: boolean;
}
export const CustomerBalanceCard = styled.div<IBalanceCard>`
  display: flex;
  padding: 1rem;
  flex-direction: column;
  border-radius: 1rem;
  gap: 2rem;

  span {
    color: ${primaryGrey};
    font-size: 0.8rem;
    font-weight: 500;
    color: ${({ isCredit }) => (isCredit ? "#f65151" : "#219653")};
  }
  h4,
  h3 {
    color: ${primaryGrey};
    font-size: 1.1rem;
  }
  .total {
    font-size: 1.5rem;
    color: ${({ isCredit }) => (isCredit ? "#f65151" : "#219653")};
    font-weight: 700;
  }
  .credit {
    font-size: 1.2rem;
    color: #f65151;
    font-weight: 700;
  }
  .deposit {
    font-size: 1.2rem;
    color: #219653;
    font-weight: 700;
  }
`;
export const UserImage = styled.img<{ height?: string }>`
  margin-right: 0.9375rem;
  height: ${({ height }) => height ?? "6.25rem"};
`;
export const Contact = styled.p`
  color: #8196b3;
  img {
    padding-right: 0.625rem;
  }
`;
export const Icon = styled.div`
  padding: 0.3125rem 0.625rem;
  margin-right: 1.125rem;
  border-radius: 0.5rem;
  background: ${(props: ITransactionCardProps) => (props.isCredit ? "#F6515122" : "#21965322")};
`;
export const TIcon = styled.div`
  height: 1.875rem;
  width: 1.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.5rem;
  background: ${(props: ITransactionCardProps) => (props.isCredit ? "#F6515122" : "#21965322")};
`;
export const TransparentBtn = styled.div`
  background: transparent;
  padding: 4px 0.5rem;
  border: none;
  display: flex;
  align-items: center;
  width: ${(props: { width?: string }) => props.width};
  cursor: pointer;
`;

export const SearchInputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 330px;
  height: 44px;
  border-radius: 1.25rem;
  background-color: #f4f6f9;
  padding: 0.3125rem 0.625rem;
`;

export const SearchIcon = styled(FaSearch)`
  margin-right: 0.3125rem;
  color: #888;
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background-color: transparent;
  font-size: 0.875rem;
  color: #333;

  ::placeholder {
    color: #888;
  }
`;
