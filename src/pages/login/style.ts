import styled from "styled-components";
import LoginImage from "../../assets/login-bg.png";
import { isFigorr } from "../../utils/constants";
import { Colors } from "../../GlobalStyles/theme";

const { primaryColor } = Colors;

interface IToggleButtonProps {
  state?: string;
  spanColor?: string;
  marginBottom?: string;
  marginTop?: string;
  SubHeaderColor?: string;
  justifyContent?: string;
}
export const Container = styled.div`
  background: ${isFigorr ? primaryColor : "#f4f6f9"};
  min-height: 100vh;
  display: flex;
  flex-direction: ${isFigorr ? "row" : "column"};
  gap: ${isFigorr ? "20rem" : "unset"};
  justify-content: center;
  align-items: center;
  padding: 2.5rem;
  flex-shrink: 0;
  background: ${isFigorr ? primaryColor : `url(${LoginImage}), #f4f6f9`};
  background-position: bottom right;
  background-size: 35%;
  background-repeat: no-repeat;
`;
export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const TopContainer = styled.div`
  display: flex;
  align-items: flex-start;
  align-self: flex-start;
  flex-direction: column;
  margin-bottom: 2rem;

  @media screen and (max-width: 434px) {
    flex-direction: column;
  }
`;
export const ToggleButton = styled.button`
  color: ${(props: IToggleButtonProps) =>
    props.state === "active" ? "#607087" : "rgba(96, 112, 135, 0.3)"};
  font-weight: 600;
  border: none;
  background: transparent;
  padding: 1.25rem;
  font-size: 1.125rem;
  cursor: pointer;
  @media screen and (max-width: 434px) {
    padding: 0.625rem;
  }
`;

export const SubHeader = styled.p`
  display: flex;
  font-size: 1rem;
  text-align: flex-start;
  color: ${(props: IToggleButtonProps) => props.SubHeaderColor || "#8196b3"};
  margin-bottom: ${(props: IToggleButtonProps) => props.marginBottom || "0px"};
  margin-top: ${(props: IToggleButtonProps) => props.marginTop || "0px"};
  max-width: 20rem;
  width: 100%;
  gap: 0.5rem;
  align-items: center;
  justify-content: ${(props: IToggleButtonProps) => props.justifyContent || "unset"};
`;

interface IInputWrapper {
  width?: string;
  gap?: string;
  isFocused?: boolean;
  margin?: string;
}

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.625rem 0;
  gap: ${(props: IInputWrapper) => props.gap || "unset"};
  width: ${(props: IInputWrapper) => props.width || "100%"};
  margin: ${(props: IInputWrapper) => props.margin || "unset"};
  transform: all ease-in-out 0.5s;

  @media screen and (max-width: 434px) {
    margin: 0;
  }
`;

export const Bottom = styled.div`
  display: flex;
  justify-content: center;
  margin: 0.9375rem 0;
  p {
    padding-left: 0.625rem;
    color: #8196b3;
    margin: 0;
  }
`;

export const Span = styled.span`
  color: ${(props: IToggleButtonProps) => props.spanColor || "black"};
  cursor: pointer;
`;
export const ErrorMsg = styled.p`
  font-size: 0.875rem;
  color: red;
  margin-bottom: 0.3125rem;
  text-align: left;
  width: 100%;
`;
