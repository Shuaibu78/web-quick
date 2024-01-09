import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";

const { blackLight, grey4, darkGreen, primaryColor } = Colors;

interface IProduct {
  status?: boolean;
}
interface IContainer {
  isSelected?: boolean;
}

export const Container = styled.div<IContainer>`
  color: ${blackLight};
  display: flex;
  height: 6.875rem;
  width: 100%;
  border-radius: 1rem;
  align-items: center;
  cursor: pointer;
  background: ${({ isSelected }) => (isSelected ? "#DDE2E9" : "#f6f8fb")};
  padding: 0.625rem;
  justify-content: space-between;
`;
export const Image = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15%;
  height: 6.25rem;
  margin-right: 0.625rem;

  img {
    height: calc(100% - 2.5rem);
  }
`;
export const Content = styled.div<IProduct>`
  display: flex;
  width: 85%;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.625rem;

  .up {
    display: flex;
    width: 100%;
    flex-direction: column;
    justify-content: space-between;
  }
  .down {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .lastValue {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    text-align: left;
    width: 100%;
  }

  .price {
    display: flex;
    flex-direction: column;
  }
  .name-container {
    display: flex;
    justify-content: space-between;
  }
  .product-name {
    margin: 0;
    padding: 0;
    font-size: 1.1rem;
    font-weight: 700;
  }
  .online-status {
    margin: 0;
    padding: 0;
    font-size: 0.9rem;
  }
  .status {
    margin: 0;
    padding: 0;
    font-size: 0.8rem;
    font-weight: 500;
    color: ${({ status }) => (status ? { darkGreen } : { grey4 })};
  }
  .stock {
    margin: 0;
    padding: 0;
    font-size: 0.8rem;
  }
  .stock-amount {
    margin: 0;
    padding: 0;
    color: ${primaryColor};
  }
  .price-title {
    margin: 0;
    padding: 0;
    font-size: 0.8rem;
  }
  .price-value {
    margin: 0;
    padding: 0;
    font-size: 1rem;
    font-weight: 700;
  }
`;
export const ProductRow = styled.div`
  display: flex;
  background: ${blackLight};
  justify-content: space-between;
`;
