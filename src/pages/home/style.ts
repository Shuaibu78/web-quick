import styled, { keyframes } from "styled-components";
import { Colors } from "../../GlobalStyles/theme";

const fadeInAnimation = keyframes`
  0% { opacity: 0; transform: translateY(1.25rem); }
  100% { opacity: 1; transform: translateY(0); }
`;

interface ISalesCard {
  height?: string;
  width?: string;
  background?: string;
  color?: string;
  backgroundImage?: string;
  backgroundPosition?: string;
  backgroundSize?: string;
  border?: string;
  direction?: string;
}

interface HomeContainerProps {
  navBarHeight?: number;
}

export const OrderItem = styled.div<{ delay: number; background: string }>`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  height: 45px;
  opacity: 0;
  animation: ${fadeInAnimation} 0.5s ease-in-out forwards;
  animation-delay: ${({ delay }) => delay || 0}s;
  background: ${({ background }) => background || "unset"};

  .overFlow {
    white-space: wrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 230px;
    max-width: 230px;
  }
`;

export const SalesItem = styled.div<{ delay: number }>`
  display: flex;
  width: 100%;
  align-items: flex-end;
  justify-content: space-between;
  margin: 0 0 0.5rem 0;
  opacity: 0;
  animation: ${fadeInAnimation} 0.5s ease-in-out forwards;
  animation-delay: ${({ delay }) => delay || 0}s;
`;

export const Container = styled.div<HomeContainerProps>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;

  .wrapper {
    display: flex;
    width: 100%;
    gap: 0.5em;
    height: ${({ navBarHeight }) => `calc(100vh - ${navBarHeight! + 10}px)` || "100%"};
    background: transparent;
  }

  #orders-wrapper {
    padding: 1rem 0.3125rem 1rem 1rem;
  }

  #orders {
    overflow-y: scroll;
    padding-right: 0.3125rem;
    scrollbar-width: 0.3125rem;

    ::-webkit-scrollbar {
      background-color: transparent;
      width: 3px;
    }

    ::-webkit-scrollbar-thumb {
      background-color: ${Colors.primaryColor};
      border-radius: 1rem;
    }
  }

  .icon-wrapper {
    height: 1.875rem;
    width: 1.875rem;
    background-color: #eceff4;
    border-radius: 0.5rem;
    padding: 0.5em;
  }

  .order-image {
    width: 2.5rem;
    height: 2.5rem;
    overflow: hidden;
    border-radius: 6px;
    margin-right: 1em;
  }
  .order-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Sales = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: flex-start;
  flex-direction: column;

  .top {
    display: flex;
    border-radius: 1rem 1rem 0 0;
    align-items: center;
    width: 100%;
    height: 15%;
    min-height: 2.5rem;
    justify-content: space-between;
    padding: 0.5em 1rem;
    background: #fff;
  }
  .bottom {
    border-radius: 0 0 0.75rem 0.75rem;
    height: 85%;
    overflow-y: scroll;
    background-color: ${Colors.skyBlue};
    padding: 1rem;
    scrollbar-width: 0.3125rem;

    ::-webkit-scrollbar {
      background-color: transparent;
      width: 3px;
    }

    ::-webkit-scrollbar-thumb {
      background-color: #fff;
      border-radius: 1rem;
    }
  }
`;

export const SalesCard = styled.div<ISalesCard>`
  width: ${({ width }) => width ?? "fit-content"};
  background: ${({ background }) => background ?? Colors.tabBg};
  color: ${({ color }) => (color || Colors.primaryColor) ?? "white"};
  border: ${({ border }) => border ?? "unset"};
  border-radius: 0.625rem;
  padding: 0.625rem 1.25rem;
  height: ${({ height }) => height ?? "170px"};
  border: ${({ border }) => border ?? "unset"};
  display: flex;
  flex-direction: ${({ direction }) => direction ?? "row"};
  justify-content: space-between;
  position: relative;

  .profit {
    width: fit-content;
    height: 27%;
    padding: 0.625rem 0.625rem;
    border-radius: 4px;
  }
  h1 {
    font-size: 24px;
  }

  h3 {
    font-size: 1.125rem;
    color: #fff;
    width: fit-content;
  }
  .home {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  @media screen and (max-width: 800px) {
    width: 100%;
  }

  ${({ backgroundImage, backgroundPosition, backgroundSize }) =>
    backgroundImage &&
    `
  background-image: url(${backgroundImage});
  background-position: ${backgroundPosition ?? "bottom -1.875rem right -1.5625rem"};
  background-size: ${backgroundSize ?? "5.625rem"};
  background-repeat: no-repeat;
  `}
`;

export const ZigZag = styled.img`
  position: absolute;
  bottom: 0.625rem;
  right: 1.25rem;
`;
export const TEmpty = styled.div<{ height?: string }>`
  width: 100%;
  height: ${({ height }) => height ?? "400px"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  img {
    margin-bottom: 1.25rem;
  }
  h3 {
    font-size: 1.125rem;
    color: #607087;
  }
  p {
    font-size: 0.875rem;
    width: 330px;
    max-width: 330px;
    min-width: 330px;
    color: #8196b3;
    text-align: center;
  }
  a {
    display: inline-flex;
    color: #fff;
    background: #607087;
    margin-top: 1.5625rem;
    font-weight: 500;
    font-size: 0.875rem;
    text-decoration: none;
    padding: 0.75rem 1.875rem;
    border-radius: 0.75rem;
    :hover {
      opacity: 0.8;
    }
  }
`;
