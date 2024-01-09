import styled from "styled-components";

export const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.9375rem 0;
  gap: 2rem;
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;
export const ExpenseCard = styled.div`
  width: 22%;
  background: #ffffff;
  box-shadow: 0px 4px 1.875rem rgba(140, 157, 181, 0.06);
  border-radius: 1.25rem;
  padding: 1rem;
  height: 6.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 1.25rem 0px;

  h1 {
    font-size: 24px;
    color: #130f26;
  }
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;
export const ProductCard = styled.div`
  width: 22%;
  background: #130f26;
  box-shadow: 0px 4px 1.875rem rgba(140, 157, 181, 0.06);
  border-radius: 1.25rem;
  padding: 1rem;
  height: 6.25rem;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 1.25rem 0px;

  h1 {
    font-size: 2.0625rem;
  }
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;
export const ProductHeader = styled.div`
  display: flex;
  h3 {
    padding-left: 0.625rem;
  }
`;

export const ZigZag = styled.img`
  position: absolute;
  bottom: 1.5625rem;
  right: 1.25rem;
`;
export const CashCard = styled.div`
  width: 22%;
  background: #ffffff;
  box-shadow: 0px 4px 1.875rem rgba(140, 157, 181, 0.06);
  border-radius: 1.25rem;
  padding: 1rem;
  height: 6.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 1.25rem 0px;

  h1 {
    font-size: 24px;
    color: rgba(33, 150, 83);
  }
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;
export const Header = styled.div`
  display: flex;
  align-items: center;

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
export const BalanceCard = styled.div`
  width: 40%;
  background: #fff;
  color: white;
  box-shadow: 0px 0px 1.875rem rgba(140, 157, 181, 0.06);
  border-radius: 1.25rem;
  padding: 1rem;
  height: 6.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 1.25rem 0px;

  h1 {
    font-size: 2.0625rem;
  }
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;

interface IHeader {
  isCredit: boolean;
}
export const BalanceHeader = styled.div<IHeader>`
  display: flex;
  gap: 1rem;
  align-items: center;
  span {
    font-size: 0.8rem;
    font-weight: 700;
    color: ${({ isCredit }) => (isCredit ? "#F06F70" : "#47A571")};
  }
  p {
    font-size: 1.3rem;
    font-weight: 700;
    color: #130f26;
  }
`;
export const BalanceFooter = styled.div<IHeader>`
  h1 {
    color: ${({ isCredit }) => (isCredit ? "#F06F70" : "#47A571")};
  }
`;

export const InputWithIcon = styled.div<{ width?: string }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 6px;
  width: ${({ width }) => width ?? "#48%"};
  background: #f4f6f9;
  border-radius: 12px;
  height: 50px;
  position: relative;
  input {
    border: none;
    background: transparent;
    width: 100%;
    outline: none;
    color: #8196b3;
    font-size: 16px;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-around;
    column-gap: 2rem;
    padding: 1em;
  }

  input[type='date']::-webkit-calendar-picker-indicator, input[type='time']::-webkit-calendar-picker-indicator {
    background: transparent;
    bottom: 0;
    color: transparent;
    cursor: pointer;
    height: auto;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: auto;
  }

  img {
    height: 24px;
    max-height: 24px;
    margin: 0 5px;
  }
`;
