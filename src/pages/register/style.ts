import styled from "styled-components";
import RegisterImage from "../../assets/register-bg.png";
import { Colors } from "../../GlobalStyles/theme";
import { isFigorr } from "../../utils/constants";

const { primaryColor } = Colors;

interface IToggleButtonProps {
  state?: string;
  spanColor?: string;
  marginBottom?: string;
  marginTop?: string;
  SubHeaderColor?: string;
}
interface IContainer {
  bg?: string;
  position?: string;
}

export const Container = styled.div<IContainer>`
  background: ${isFigorr ? primaryColor : " #f4f6f9"};
  min-height: 100vh;
  display: flex;
  gap: ${isFigorr ? "20rem" : "unset"};
  flex-direction: ${isFigorr ? "row" : "column"};
  justify-content: center;
  align-items: center;
  padding: 1.875rem;
  background: ${({ bg }) =>
    isFigorr ? "none" : bg ? `url(${bg}), #f4f6f9` : `url(${RegisterImage}), #f4f6f9`};
  background-position: ${({ position }) => position || "bottm left"};
  background-color: ${isFigorr ? primaryColor : "unset"};
  background-size: 36%;
  background-repeat: no-repeat;

  @media screen and (max-width: 434px) {
    padding: inherit 1.875rem;
  }
`;
export const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const TopContainer = styled.div`
  display: flex;
  width: 100%;

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
  font-size: 1rem;
  text-align: center;
  color: ${(props: IToggleButtonProps) => props.SubHeaderColor || "#8196b3"};
  margin-bottom: ${(props: IToggleButtonProps) => props.marginBottom || "0px"};
  margin-top: ${(props: IToggleButtonProps) => props.marginTop || "0px"};
  width: 100%;
`;
export const InputWrapper = styled.div`
  margin: 0.625rem 0;
  width: 100%;
`;
export const Bottom = styled.div`
  display: flex;
  justify-content: center;
  margin: 0.625rem 0;
  p {
    padding-left: 0.625rem;
    color: #8196b3;
    margin: 0;
  }
`;
