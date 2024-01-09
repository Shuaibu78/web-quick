import styled from "styled-components";
import { BoxShadows, Colors } from "../../GlobalStyles/theme";
const { white } = Colors;
const { cardBoxShadow } = BoxShadows;

export const Container = styled.div<{ isInitial?: boolean; width?: string }>`
  border-radius: 1rem;
  width: ${({ width }) => width || "100%"};
  height: 100%;
  background: ${white};
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  z-index: 99;
  justify-content: ${({ isInitial }) => (isInitial ? "center" : "space-between")};

  .no-product {
    display: flex;
    flex-direction: column;
    padding-bottom: 3.125rem;
    height: 100%;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
`;

export const Header = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;

  .title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #607087;
  }

  .actions {
    display: flex;
    gap: 2rem;
    align-items: center;
    justify-content: space-between;
    position: relative;

    .deleteContainer {
      position: absolute;
      left: -6.875rem;
      bottom: -10rem;
      padding: 1rem;
      right: 3.125rem;
      box-shadow: ${cardBoxShadow};
      border-radius: 1.125rem 0px 1.125rem 1.125rem;
      background-color: white;
      width: 16.875rem;
      height: 9.375rem;

      .text {
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        margin-bottom: 2rem;
      }
    }

    .action-bottons {
      background: none;
      height: 2.1875rem;
      width: 2.1875rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      border-radius: 0.625rem;
      cursor: pointer;
      transition: ease-in-out all 0.3s;
      &:hover {
        background: rgba(129, 150, 179, 0.15);
      }
    }
  }
`;

export const Image = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30%;
  height: 100%;
  margin-right: 0.625rem;
  align-self: left;
`;

export const ProductWrapper = styled.div`
  display: flex;
  height: 2rem;
  justify-content: space-between;
  margin-bottom: 1rem;
`;
export const Left = styled.div`
  display: flex;
  width: 50%;
  gap: 1rem;
  align-items: center;
  justify-content: flex-start;

  .details {
    display: flex;
    flex-direction: column;
  }

  .name {
    margin: 0;
    padding: 0;
    color: #607087;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.3125rem;
  }

  .category {
    margin: 0;
    padding: 0;
    font-size: 1rem;
    color: #607087;
  }

  span {
    font-size: 0.8rem;
    color: #ffbe62;
  }
`;

interface IRight {
  status: boolean | undefined;
}
export const Right = styled.div<IRight>`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  .status {
    display: flex;
    background: ${({ status }) => (status ? "#e8f6ee" : "#F6F8FB")};
    height: 2.5rem;
    justify-content: space-between;
    align-items: center;
    border-radius: 0.75rem;
    padding: 0.3125rem 0.625rem;
    align-self: flex-end;
  }

  .eye {
    margin-right: 0.625rem;
  }
  p {
    color: ${({ status }) => (status ? "#15bb5c" : "#9EA8B7")};
  }
`;

interface BottonContainerProps {
  marginBottom?: string;
}

export const ButtonContainer = styled.div<BottonContainerProps>`
  display: flex;
  width: 100%;
  gap: 1em;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ marginBottom }) => marginBottom ?? "2rem"};
`;
export const VariationContainer = styled.div`
  border: 1px solid #60708722;
  width: 100%;
`;
export const VariationHeader = styled.div`
  border-bottom: 1px solid #60708722;
  width: 100%;
  display: flex;
  align-items: center;
  height: 2.5rem;
  color: #607087;
  p {
    width: calc(100% / 3);
    min-width: calc(100% / 3);
    font-weight: 500;
    text-align: center;
  }
`;
export const VariationValue = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  height: 2.5rem;
  color: #607087;
  text-align: center;
  p {
    width: calc(100% / 3);
    min-width: calc(100% / 3);
  }
`;
