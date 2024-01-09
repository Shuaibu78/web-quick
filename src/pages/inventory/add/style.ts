import styled, { keyframes } from "styled-components";
import { Colors } from "../../../GlobalStyles/theme";
import { isFigorr } from "../../../utils/constants";
const { primaryColor, blackLight, blackishBlue, lightSecondaryColor, secondaryColor } = Colors;

interface IImageButton {
  active?: boolean;
}

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const slideDown = keyframes`
  0% {
    opacity: 0;
    height: 0;
    transform: translateY(-100%);
  }
  100% {
    opacity: 1;
    height: auto;
    transform: translateY(0);  
}`;

export const Container = styled.div<{ navBarHeight: number }>`
  display: flex;
  margin: 0.5rem 0;
  flex-direction: column;
  gap: 1rem;
  height: ${({ navBarHeight }) => `calc(100vh - ${navBarHeight! + 16}px)` || "100%"};
  background-color: white;
  border-radius: 1rem;
  padding: 0.5em;
  animation: ${fadeIn} 0.3s ease;

  .body {
    &:last-child {
      padding-right: 0px;
    }
  }

  @media screen and (max-width: 900px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const Column = styled.div<{ navBarHeight: number }>`
  height: 100%;
  width: calc(100% / 3);
  border-left: 1px solid #ddd;
  flex-direction: column;
  align-items: flex-start;
  gap: 3rem;
  padding: 0 0.5em;
  height: 100%;

  .column-body {
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: 0.3125rem;
    max-height: ${({ navBarHeight }) => `calc(100vh - ${navBarHeight! + 122}px)` || "100%"};
    padding-right: 4px;
    height: ${({ navBarHeight }) => `calc(100vh - ${navBarHeight! + 122}px)` || "100%"};

    ::-webkit-scrollbar {
      background-color: transparent;
      width: 3px;
    }

    ::-webkit-scrollbar-thumb {
      background-color: ${Colors.primaryColor};
      border-radius: 4px;
    }
  }

  .title {
    color: ${blackishBlue};
    font-weight: 600;
    font-size: 1.3em;
  }

  &:first-child {
    border-left: none;
  }
`;

export const MoreOptions = styled.button<{ minWidth: string }>`
  display: flex;
  gap: 0.5em;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  text-align: center;
  color: ${secondaryColor};
  font-style: italic;
  padding: 0.4em 1em;
  border-radius: 1rem;
  border: none;
  width: auto;
  background: ${lightSecondaryColor};
  min-width: ${({ minWidth }) => minWidth || "unset"};
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 1400px) {
    font-size: 0.625rem;
  }
`;
export const SubText = styled.p`
  font-size: 0.875rem;
  color: #8196b3;
  /* margin: 0.3125rem 0 0.625rem 0; */
`;

export const Center = styled.div`
  width: 33%;
  padding: 0 0.9375rem;
  @media screen and (max-width: 900px) {
    width: 100%;
  }
  h2 {
    font-weight: 600;
    font-size: 1.125rem;
    color: #607087;
    padding-bottom: 1.25rem;
  }
`;
export const ImageContainer = styled.div`
  display: flex;
  width: 100%;

  .upload-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 0.625rem;
  }

  .button-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    position: relative;

    button {
      display: flex;
      align-items: center;
      gap: 0.3em;
      padding: 0.3125rem 0.9375rem;
      border-radius: 6px;
      background-color: white;
      color: #ff5050;
      border: none;
      border-radius: 2em;
      box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
      cursor: pointer;
      position: absolute;
      right: 0.625rem;
      top: 0.625rem;

      img {
        width: 0.9375rem;
      }
    }
  }
`;

export const ImageButton = styled.label<IImageButton>`
  width: 100%;
  border-radius: 0.5rem;
  background: rgba(129, 150, 179, 0.12);
  /* background: ${({ active }) => (active ? "rgba(129, 150, 179, 0.12)" : "unset")}; */
  height: 9.375rem;
  border: ${({ active }) => (active ? "1px dashed #607087" : "none")};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
  object-fit: cover;
  cursor: pointer;

  p {
    font-weight: 400;
    color: #607087;
    font-size: 1rem;
    padding: 0.625rem 0;
  }
  #cloud {
    height: 1.5625rem;
    margin-right: 0.625rem;
  }

  #dummy {
    height: 3.125rem;
  }
`;
export const AddButton = styled.button`
  background: transparent;
  border: none;
  display: flex;
  align-items: center;
  color: ${Colors.primaryColor};
  font-size: 14px;
  padding: 0.9375rem 0;
  cursor: pointer;
  img {
    height: 0.875rem;
    margin-right: 0.625rem;
  }
`;
export const BulkInputContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin: 0.3125rem 0;
  input {
    width: 48%;
    padding: 0.75rem 0.9375rem;
    background: #f4f6f9;
    color: #8196b3;
    border-radius: 0.75rem;
    border: none;
    font-size: 1rem;
    outline: none;
  }
  :hover button {
    display: block;
  }
`;
export const DeleteButton = styled.button`
  display: none;
  position: absolute;
  background: transparent;
  border: none;
  height: 100%;
  align-items: center;
  right: 0;
  cursor: pointer;
  padding: 0 0.625rem;
  top: 6px;
`;

interface IContainerProps {
  readOnly?: boolean;
}
export const NewOptionContainer = styled.div<IContainerProps>`
  width: 50%;
  position: relative;
  margin: 0.625rem 0;

  .variation-option {
    display: flex;
    position: relative;

    #minus-icon {
      position: absolute;
      top: 40%;
      right: 1em;
      cursor: pointer;
    }
  }

  input {
    width: 100%;
    padding: 0.75rem 0.9375rem;
    background: #f4f6f9;
    color: #8196b3;
    border-radius: 0.75rem;
    border: none;
    font-size: 1rem;
    outline: none;

    &:hover {
      cursor: ${({ readOnly }) => (readOnly ? "not-allowed" : "unset")};
    }
  }
  button {
    background: transparent;
    border: none;
    cursor: pointer;
    position: absolute;
    right: 0;
    padding: 0 0.625rem;
    height: 100%;
  }
  p {
    font-weight: 400;
    font-size: 13px;
    line-height: 0.9375rem;
    color: #607087;
  }
`;
export const VariationNameInput = styled.input`
  width: 100%;
  margin: 0.3125rem 0;
  padding: 0.75rem 0.9375rem;
  background: #f4f6f9;
  color: #8196b3;
  border-radius: 0.75rem;
  border: none;
  font-size: 1rem;
  outline: none;
`;
export const SaveButton = styled.button`
  background: ${primaryColor};
  border-radius: 0.75rem;
  padding: 0.625rem 1.125rem;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  border: none;
`;
export const BarCodeContainer = styled.div`
  background: #607087;
  border-radius: 0.75rem;
  height: 3.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  p {
    font-size: 0.875rem;
    color: #fff;
  }
`;
export const VariationList = styled.div`
  margin: 0.9375rem 0;
  h3 {
    font-size: 1rem;
    padding: 0.3125rem 0;
    color: ${Colors.secondaryColor};
    width: 100%;
    border-bottom: 1px solid #8196b3;
  }
`;
export const Variation = styled.div`
  width: 100%;
`;
export const VariationHeading = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 2.5rem;
  align-items: center;
  button {
    background: transparent;
    cursor: pointer;
    border: none;
    padding: 0.625rem;
  }
  h4 {
    font-size: 0.875rem;
    color: #8196b3;
    font-weight: 500;
  }
  h2 {
    padding: 0;
    display: flex;
  }
`;
export const VariationOption = styled.div`
  background: #e0e6ed;
  border-radius: 6.25rem;
  padding: 0.3125rem 0.5rem;
  margin: 4px;
  display: flex;
  align-items: center;
  color: rgba(96, 112, 135, 0.7);
  font-weight: 400;
  font-size: 0.75rem;
  button {
    background: transparent;
    cursor: pointer;
    border: none;
    margin-left: 0.3125rem;
    display: flex;
    align-items: center;
  }
`;
export const VariationListHeading = styled.p`
  color: #8196b3;
  font-size: 0.875rem;
  padding-top: 0.9375rem;
  font-weight: 500;
`;
export const PlaceholderImg = styled.img`
  height: 70% !important;
  width: auto;
`;
export const ErrorMsg = styled.p`
  color: red;
  font-size: 0.875rem;
  padding-top: 0.625rem;
`;

export const TabButton = styled.button<{ active: boolean }>`
  color: ${({ active }) => (active ? Colors.secondaryColor : blackLight)};
  border: none;
  border-bottom: ${({ active }) =>
    active ? `3px solid ${Colors.secondaryColor}` : "3px solid transparent"};
  margin-right: 2rem;
  font-weight: 500;
  background-color: transparent;
  padding: 4px 0.625rem;
  font-size: 1.2em;
  cursor: pointer;
  transition: ease-in-out all 0.3s;

  &:hover {
    padding: 4px 0.625rem;
    border-bottom: ${({ active }) =>
      !active && `3px solid ${isFigorr ? "rgba(0, 165, 49, 0.3)" : "rgba(255, 190, 98, 0.3)"}`};
  }
`;

export const BarCodeButton = styled.button`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  color: ${blackishBlue};
  border: none;
  border-radius: 0.75rem;
  font-weight: 500;
  background-color: #f4f6f9;
  padding: 4px 0.625rem;
  font-size: 1.2em;
  height: 2rem;
  width: 100%;
  cursor: pointer;
  transition: ease-in-out all 0.3s;

  #bar-code {
    width: 40%;
  }

  #label {
    position: absolute;
    left: 0.3125rem;
    top: -1.125rem;
    font-size: 0.75rem;
    color: #607087;
  }

  #delete {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.875rem;
    position: absolute;
    height: 100%;
    top: 0;
    right: 1.875rem;
    bottom: 0;
  }
`;

export const TextAreaContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: transparent;
  padding: 0;
  position: relative;

  .minimize {
    position: absolute;
    height: 100%;
    width: 1.875rem;
    background: #ff5050;
    top: 0;
    right: 0;
    bottom: 0;
    cursor: pointer;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top-right-radius: 1rem;
    border-bottom-right-radius: 1rem;
  }
`;
