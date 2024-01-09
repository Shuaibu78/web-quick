import styled from "styled-components";
interface IButtonProps {
  buttonColor?: string;
  valueColor?: string;
  size?: string;
  borderColor?: string;
  borderSize?: string;
  borderRadius?: string;
  fontSize?: string;
  width?: string;
  height?: string;
  margin?: string;
  border?: boolean;
  disabled?: boolean;
  display?: string;
}

export const Button = styled.button`
  appearance: none;
  outline: none;
  align-items: center;
  justify-content: center;
  display: ${(props: IButtonProps) => props.display ?? "unset"};
  font-size: ${(props: IButtonProps) => props.fontSize || ".75rem"};
  background-color: ${(props: IButtonProps) => props.buttonColor || "gray"};
  border-width: ${(props: IButtonProps) => props.borderSize || "1px"};
  border-color: ${(props: IButtonProps) => props.borderColor || "transparent"};
  color: ${(props: IButtonProps) => props.valueColor || "rgb(112, 76, 182)"};
  padding-block: ${(props: IButtonProps) =>
    props.size === "md" ? 1 * 0.5 : props.size === "lg" ? 1.5 * 0.5 : 0.75 * 0.5}rem;
  padding-inline: ${(props: IButtonProps) =>
    props.size === "md" ? 1 * 1 : props.size === "lg" ? 1.5 * 1 : 0.75 * 1}rem;
  border-radius: ${(props: IButtonProps) => props.borderRadius || "0px"};
  width: ${(props: IButtonProps) => props.width || "100%"};
  cursor: ${({ disabled }: IButtonProps) => (disabled ? "not-allowed" : "pointer")};
  transition: all 0.15s;
  border: ${(props: IButtonProps) => (props.border ? `1px solid ${props.borderColor}` : "unset")};
  height: ${(props: IButtonProps) => props.height || "3.125rem"};
  :hover {
    opacity: ${({ disabled }: IButtonProps) => (disabled ? "0.5" : "0.8")};
    transform: ${({ disabled }: IButtonProps) => (disabled ? "" : " scale(1.01)")};
  }
  :disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  margin: ${(props: IButtonProps) => props.margin || "0"};
  opacity: ${({ disabled }: IButtonProps) => (disabled ? "0.5" : "1")};
`;
