import styled from "styled-components";
import { Colors } from "../../../GlobalStyles/theme";

export const Container = styled.div`
  display: flex;
  height: 70vh;
  background: #fff;
  width: 70%;
  min-height: 400px;
  overflow: hidden;
  border-radius: 24px;
  @media screen and (max-width: 900px) {
    overflow-y: scroll;
    flex-direction: column;
    width: 95%;
  }
`;
export const Left = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  background: #f6f8fb;
  padding: 1.25rem 0.8rem 1.25rem 1.25rem;
  height: 100%;

  @media screen and (max-width: 900px) {
    width: 100%;
  }
`;

export const CartList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: calc(70vh - 19rem);
  max-height: calc(70vh - 19rem);
  padding-right: 0.5rem;
  overflow-y: scroll;
`;

export const Totals = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
  width: 100%;
  border-top: 1px solid #607087;
  padding-bottom: 0.625rem;
  padding-right: 0.625rem;
  max-height: 19rem;
  overflow-y: scroll;
`;

export const Right = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  background: white;
  padding: 1.25rem 1.25rem 1.25rem 0.8rem;
  height: 100%;

  @media screen and (max-width: 900px) {
    width: 100%;
  }
`;

export const RightContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: calc(70vh - 10rem);
  max-height: calc(70vh - 10rem);
  padding-right: 0.5rem;
  overflow-y: scroll;
`;
export const Label = styled.label`
  font-size: 13px;
  color: #607087;
  padding: 0.625rem 0;
  display: inline-block;
`;

export const CustomSearchDropdown = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 1rem;

  label {
    font-size: 0.875rem;
    color: #607087;
    margin-bottom: 0.3125rem;
  }
`;

export const LeftContainer = styled.div`
  position: relative;
  display: flex;
  /* max-height: calc(70vh - 70px); */
  padding: 0 0.5rem 0 0;
  flex-direction: column;
  width: 100%;

  .totals-container {
    position: absolute;
    /* bottom: 0.6rem; */
  }
`;

export const Tax = styled.div<{ selected: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.6rem;
  width: 100%;
  justify-content: flex-start;
  gap: 0.6rem;
  height: 3.6rem;
  background-color: ${({ selected }) => (selected ? Colors.lightGreen : Colors.tabBg)};
  border-radius: 0.6rem;
  cursor: pointer;

  #bar {
    height: 100%;
    width: 4px;
    border-radius: 1rem;
    background-color: ${({ selected }) => (selected ? Colors.green : Colors.primaryColor)};
  }
`;

export const Customer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.6rem;
  width: 100%;
  justify-content: flex-start;
  gap: 1rem;
  height: 3.6rem;
  background-color: ${Colors.tabBg};
  border-radius: 1rem;
  cursor: pointer;

  img {
    width: 35px;
  }
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid #607087;
  border-radius: 0.75rem;
  padding: 3px 0.625rem;
  position: relative;
  height: 2.5rem;

  .closeDiv {
    height: 100vh;
    width: 100vw;
    background: transparent;
    position: fixed;
    top: 0;
    left: 0;
  }

  .options {
    position: absolute;
    left: 0;
    right: 0;
  }

  input {
    position: absolute;
    top: 0.3125rem;
    bottom: 0.3125rem;
    left: 0.625rem;
    width: 90%;
    background-color: none;
    border: none;

    &:focus {
      outline: none;
    }

    &::placeholder {
      color: #8596b3;
      font-size: 1rem;
    }
  }
  .image-container {
    width: 20%;
    cursor: pointer;

    img {
      position: absolute;
      top: 0.75rem;
      bottom: 0;
      right: 6px;
      width: 1.25rem;
    }
  }
`;

export const Nav = styled.button<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.6rem;
  width: 5rem;
  height: 2.2rem;
  border: ${({ disabled }) =>
    disabled ? `1px solid${Colors.grey}` : `1px solid${Colors.primaryColor}`};
  color: ${({ disabled }) => (disabled ? Colors.grey : Colors.primaryColor)};
  border-radius: 5px;
  background: none;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
`;
