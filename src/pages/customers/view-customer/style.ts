import styled from "styled-components";
import { Colors } from "../../../GlobalStyles/theme";
const { primaryGrey } = Colors;

interface ITransactionCardProps {
  isCredit?: boolean;
}
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 600px;
  padding: 0 1rem;
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
export const CustomerCard = styled.div<{ width?: string }>`
  display: flex;
  padding: 0.9375rem 0;
  width: ${({ width }) => width};
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
export const UserImage = styled.img`
  margin-right: 0.9375rem;
  height: 6.25rem;
  width: 6.25rem;
  border-radius: 50%
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
