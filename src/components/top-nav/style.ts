import styled, { keyframes } from "styled-components";
import { Colors } from "../../GlobalStyles/theme";
const { primaryColor } = Colors;

const pulsate = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`;

interface IShowBox {
  show: boolean;
}

export const Container = styled.div<{ direction?: string; navbarHeight?: number }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  right: 1.8rem;
  width: 100%;
  border-radius: 1rem;
  padding: 0.5rem;
  margin: 0px 0px 0.5rem 0;
  flex-direction: ${({ direction }) => direction};
  height: fit-content;
  transition: height 0.3s ease-in-out;

  h2 {
    color: #130f26;
    font-weight: bold;
    font-size: 1.125rem;
  }
  @media screen and (max-width: 1024px) {
    width: 100%;
  }
`;

export const ShopDropDown = styled.button`
  padding: 0.3125rem 0.625rem;
  color: ${Colors.secondaryColor};
  background-color: ${Colors.lightSecondaryColor};
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid ${Colors.secondaryColor};
  font-size: 0.875rem;
  width: 13.125rem;
  height: 2.5rem;
  min-height: 2.5rem;
  cursor: pointer;
  margin: 0 1rem;
`;
export const RightContainer = styled.div`
  display: flex;
  align-items: center;
`;
export const Icon = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  margin: 0 0.625rem;
`;
export const DropIcon = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  margin: 0 0.625rem;
  display: none;
  img {
    width: 1.25rem;
  }
  @media screen and (max-width: 800px) {
    display: block;
  }
`;
export const ButtonWithIcon = styled.button<{ bgColor?: string }>`
  border: none;
  cursor: pointer;
  background: ${({ bgColor }) => bgColor ?? primaryColor};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 0.75rem;
  height: 2.5rem;
  padding: 0 0.625rem;
  font-size: 0.875rem;
  img {
    height: 1.25rem;
  }
  span {
    padding-left: 0.625rem;
  }
`;
export const ToggleButton = styled.button`
  border: none;
  display: none;
  background: white;
  align-items: center;
  height: 100%;
  padding: 0 0.625rem;
  cursor: pointer;
  img {
    height: 1.25rem;
  }
  @media screen and (max-width: 1024px) {
    display: flex;
  }
`;
export const ActionBox = styled.div`
  display: flex;

  #add-button {
    animation: ${pulsate} 2s ease-in-out infinite;
  }
  @media screen and (max-width: 800px) {
    position: absolute;
    z-index: 99999;
    width: 100%;
    background: white;
    padding: 0.625rem 0;
    top: 3.75rem;
    left: 0;
    display: ${(props: IShowBox) => (props.show ? "flex" : "none")};
  }
`;
