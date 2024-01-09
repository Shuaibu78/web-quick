import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";

const { primaryColor, grey } = Colors;
interface IInputProps {
  buttonColor?: string;
  valueColor?: string;
  paddingSize?: string;
  borderColor?: string;
  borderSize?: string;
  borderRadius?: string;
  fontSize?: string;
  width?: string;
  border?: boolean;
  marginBottom?: string;
  readOnly?: boolean;
  placeholderColor?: string;
  focus?: boolean;
}
interface IContainerProps {
  marginBottom?: string;
  width?: string;
  height?: string;
  top?: string;
  isFocused: boolean;
  borderRadius?: string;
  labelMargin?: string;
}

export const Input = styled.input`
  appearance: none;
  outline: none;
  font-size: ${(props: IInputProps) => props.fontSize || "0.75rem"};
  background: ${(props: IInputProps) => `${props.buttonColor}!important` || "#F4F6F9"};
  height: ${({ height }) => height ?? "unset"};
  border-width: ${(props: IInputProps) => props.borderSize || "1px"};
  border-color: ${(props: IInputProps) => props.borderColor || "transparent"};
  color: ${(props: IInputProps) => props.valueColor || "rgb(112, 76, 182)"};
  border-style: none;
  transition: ease-in-out all 0.5s;
  padding: 1em;

  /* padding-block: ${(props: IInputProps) =>
    props.paddingSize === "md"
      ? 1 * 0.5
      : props.paddingSize === "lg"
      ? 1.7 * 0.5
      : 0.75 * 0.5}rem; */
  /* padding-inline: ${(props: IInputProps) =>
    props.paddingSize === "md" ? 1 * 1 : props.paddingSize === "lg" ? 1.7 * 1 : 0.75 * 1}rem; */
  border-radius: ${(props: IInputProps) => props.borderRadius || "0px"};
  width: ${(props: IInputProps) => props.width || "12.5rem"};
  ::placeholder {
    color: ${(props: IInputProps) => props.placeholderColor || "#8196b3"};
    opacity: 0.7;
  }

  :focus {
    border: 1px solid ${Colors.secondaryColor};
  }

  &:hover {
    cursor: ${(props: IInputProps) => (props.readOnly ? "not-allowed" : "unset")};
  }

  &[type="number"] {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
    position: relative;

    &::-webkit-inner-spin-button,
    &::-webkit-outer-spin-button {
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
  }
`;

export const InputContainer = styled.div<IContainerProps>`
  position: relative;
  display: flex;
  align-items: center;
  width: ${({ width }) => width ?? "100%"};
  height: ${({ height }) => height ?? "unset"};
  margin-bottom: ${({ marginBottom }) => marginBottom ?? "0"};
  transition: ease-in-out all 0.5s;
  margin-top: 0.2rem;

  /* margin-bottom: 1rem; */
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
    border-top-right-radius: ${({ borderRadius }) => borderRadius ?? "unset"};
    border-bottom-right-radius: ${({ borderRadius }) => borderRadius ?? "unset"};
  }

  .delete {
    position: absolute;
    height: 100%;
    width: 1.875rem;
    top: 0;
    right: 2.5rem;
    bottom: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    font-size: 0.7rem;
    color: ${({ isFocused }) => (isFocused ? Colors.secondaryColor : "#607087")};
    padding: 0;
    position: absolute;
    left: 0px;
    margin: ${(props: IContainerProps) => props.labelMargin || "unset"};
    top: ${(props: IContainerProps) => props.top || "-1.25rem"};
    background: transparent;
    transition: ease-in-out all 0.5s;
  }

  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    appearance: none;
    margin: 0;
  }
`;

export const ShowHide = styled.span`
  position: absolute;
  border-radius: 0.4rem;
  background: white;
  color: ${grey};
  font-size: 0.8rem;
  align-items: center;
  justify-content: center;
  padding: 3px 0.5rem;
  right: 0.9375rem;

  &:hover {
    cursor: pointer;
  }
`;

export const EyeIcon = styled.span`
  position: absolute;
  top: 20%;
  right: 6%;

  svg {
    width: 1.875rem;
    height: 1.875rem;
  }

  &:hover {
    cursor: pointer;
  }
`;
