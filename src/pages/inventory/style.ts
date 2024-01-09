import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";

interface IModalFlex {
  justify?: string;
  align?: string;
  direction?: string;
  gap?: string;
  border?: string;
}

interface BottonContainerProps {
  marginBottom?: string;
}

export const ButtonContainer = styled.div<BottonContainerProps>`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ marginBottom }) => marginBottom ?? "2rem"};
`;
interface IHr {
  margin?: string;
  opacity?: string;
}
export const Hr = styled.hr<IHr>`
  border: 0.7px solid #8196b3;
  width: 100%;
  margin: ${({ margin }) => margin ?? "0 0 1.875rem 0"};
  opacity: ${({ opacity }) => opacity ?? "1"};
`;

export const CategoryList = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 0.9375rem;
  color: #8196b3;

  div {
    width: 50%;
    display: flex;
    justify-content: flex-start;
  }
`;

export const CategoryListBtn = styled.div`
  width: 50%;
  display: flex;
  justify-content: flex-end !important;

  img {
    width: 1.875rem;
    padding: 0.5rem !important;
    cursor: pointer;
    background-color: transparent;
  }
`;

interface IInputWrapper {
  width?: string;
}

export const InputWrapper = styled.div`
  margin: 0.625rem 0;

  .taxWrapper {
    position: relative;

    span {
      position: absolute;
      top: 0.6875rem;
      right: 2em;
      color: #cbd4e0;
      font-size: 1.2em;
      font-weight: 600;
    }
  }

  width: ${(props: IInputWrapper) => props.width || "100%"};
  @media screen and (max-width: 434px) {
    margin: 0;
  }
`;

export const ModalFlex = styled.div<IModalFlex>`
  display: flex;
  justify-content: ${({ justify }) => justify || "flex-start"};
  align-items: ${({ align }) => align || "flex-start"};
  flex-direction: ${({ direction }) => direction || "row"};
  gap: ${({ gap }) => gap || "0px"};
  border: ${({ border }) => border || "none"};
  margin-bottom: 1.25rem;
  width: 100%;

  .categoryContainer {
    max-height: 18.75rem;
    overflow-y: scroll;
    width: 100%;
    padding-right: 1rem;
  }

  h4 {
    color: #8196b3;
    margin-bottom: 0.625rem;
  }

  label {
    font-weight: 400;
    font-size: 13px;
    line-height: 0.9375rem;
    color: #607087;
    cursor: pointer;
  }

  input {
    padding: 1rem 1.25rem;
    gap: 0.625rem;
    width: 355px;
    height: 52px;
    background: #f4f6f9;
    border-radius: 0.75rem;
    border: 0px;

    &:focus {
      outline: none;
    }
  }

  img {
    background-color: #e9eff6;
    padding: 0.625rem;
    border-radius: 6px;
  }
`;

export const CategoryModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  background-color: white;
  padding: 1.125rem 1.25rem;
  border-radius: 0.75rem;

  ul {
    list-style-type: none;
    padding-top: 1.5625rem;
    font-size: 0.875rem;
  }

  li {
    padding-bottom: 1.875rem;
    cursor: pointer;
  }
`;

export const ModalWrapper = styled.div`
  position: absolute;
  ${(props: { isUp: boolean; show: boolean }) => (!props.isUp ? "top: 2.5rem;" : "bottom: 0;")}
  right: 0;
  background: white;
  border-radius: 0.75rem;
  padding: 19px 13px;
  z-index: 100;
  min-width: 160px;
  box-shadow: 0px 4px 1.875rem 0px #8c9db514;
  display: ${(props: { isUp: boolean; show: boolean }) => (props.show ? "block" : "none")};
`;

export const ActionContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  background-color: white;
  ul {
    list-style-type: none;
    font-size: 0.875rem;
  }

  li {
    padding-bottom: 19px;
    cursor: pointer;
    width: 100%;
    color: #000;
    :last-of-type {
      padding-bottom: 0;
    }
  }
`;

export const Button = styled.button`
  border: none;
  height: 43px;
  background: #130f26;
  border-radius: 0.75rem;
  padding: 0.75rem 24px;
  cursor: pointer;
  color: #fff;
  margin-left: 3%;
  font-size: 1rem;
`;
export const PageControl = styled.div<{ bottom?: string; background?: string; height?: string }>`
  display: flex;
  background-color: transparent;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: ${({ bottom }) => bottom ?? 0};
  right: 0;
  left: 0;
  z-index: 3;
  height: ${({ height }) => height ?? "auto"};
  background: ${({ background }) => background};

  @media screen and (max-width: 31.25rem) {
    flex-direction: column;
  }
`;
export const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;
export const Container = styled.div<{ width?: string }>`
  display: flex;
  flex-direction: column;
  width: ${({ width }) => width || "49%"};
  max-width: 49%;
  background: #fff;
  justify-content: flex-start;
  margin-bottom: 2rem;
  box-shadow: 0px 4px 1.875rem rgba(140, 157, 181, 0.06);
  border-radius: 1.25rem;
`;
export const ProductRow = styled.div`
  display: flex;
  background: #fff;
  justify-content: space-between;
`;

export const DeleteContainer = styled.div`
  padding: 1rem;
  box-shadow: 4px 4px 1.875rem rgba(23, 46, 78, 0.1);
  border-radius: 1.125rem;
  background-color: white;
  width: 22.5rem;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .text {
    display: flex;
    width: 100%;
    justify-content: space-between;
    flex-direction: column;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
`;
export const BatchContainer = styled.div`
  padding: 1rem;
  box-shadow: 4px 4px 1.875rem rgba(23, 46, 78, 0.1);
  border-radius: 18px;
  background-color: white;
  width: 22.5rem;
  height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .text {
    display: flex;
    width: 100%;
    justify-content: space-between;
    flex-direction: column;
    margin-bottom: 1rem;
    font-size: 1.2rem;
  }
`;

export const BatchNav = styled.div`
  border-left: 1px solid #dadee4;
  border-right: 1px solid #dadee4;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3em;
  padding: 0.5em 3em;
  height: 35px;
  width: 60%;
`;

export const BatchDetailButton = styled.button`
  background: ${Colors.lightSecondaryColor};
  color: ${Colors.secondaryColor};
  display: flex;
  align-items: center;
  gap: 1em;
  border-radius: 2em;
  border: none;
  height: 35px;
  padding: 10px;
  cursor: pointer;
`;

export const BContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 0.5em;
  border-radius: 12px;
  margin-top: 0.5em;
  height: 100%;
`;

export const SearchContainer = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  height: 100%;

  #result-box {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 20px 25px -5px, rgba(0, 0, 0, 0.04) 0px 10px 10px -5px;
    overflow-y: auto;
  }

  .product {
    display: flex;
    padding: 0.3em 1em;
    align-items: center;
    justify-content: flex-start;
    width: 100%;
    height: 40px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      background-color: ${Colors.tabBg};
    }
  }
`;

export const SelectedList = styled.div`
  display: flex;
  flex-direction: column;
  height: 350px;
  max-height: 350px;
  overflow-y: scroll;
  padding-right: 3px;

  -ms-overflow-style: none;
  scrollbar-width: 5px;

  ::-webkit-scrollbar {
    background-color: transparent;
    width: 5px;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: ${Colors.primaryColor};
  }
`;

export const CountButton = styled.button<{ down?: boolean; fade?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  border-radius: 8px;
  background: ${Colors.tabBg};
  border: none;
  height: 49%;
  cursor: pointer;
  opacity: ${({ fade }) => (fade ? 0.5 : 1)};

  img {
    transform: ${({ down }) => (down ? "rotate(180deg)" : "unset")};
    z-index: 0;
  }
`;

export const TrfHeader = styled.div`
  display: block;
  font-size: 0.875rem;
  color: ${Colors.blackLight};
  font-weight: 600;

  .yellow {
    color: ${Colors.secondaryColor};
  }

  .black {
    color: ${Colors.black};
  }

  .red {
    color: ${Colors.red};
  }

  .small {
    font-weight: 400;
    font-size: 0.75rem;
  }
`;
