import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";
interface ICustomCheckProps {
  color?: string;
  size?: string;
  marginLeft?: number;
  checked?: boolean;
  checkedColor?: string;
  borderColor?: string;
}
export const CustomCheck = styled.div`
  position: relative;
  height: ${(props: ICustomCheckProps) => props.size || "1.125rem"};
  width: ${(props: ICustomCheckProps) => props.size || "1.125rem"};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: ${(props: ICustomCheckProps) => `1px solid ${props.borderColor || props.color || Colors.primaryColor}`};
  border-radius: 0.3125rem;
  box-sizing: border-box;
  background-color: ${(props: ICustomCheckProps) => props.checked && (props.checkedColor || Colors.black)};
  margin-left: ${(props: ICustomCheckProps) => `${props.marginLeft || 0}px`};
`;
export const Checked = styled.div`
  border-radius: 0.3125rem;
  background: ${(props: ICustomCheckProps) => props.color || Colors.primaryColor};
  position: absolute;
  height: ${(props: ICustomCheckProps) => `calc(${props.size || "1.125rem"} - 4px)`};
  width: ${(props: ICustomCheckProps) => `calc(${props.size || "1.125rem"} - 4px)`};
  top: 1px;
  left: 1px;
`;
export const NotChecked = styled.div`
  border-radius: 0.3125rem;
  position: absolute;
  top: 0;
  left: 0;
  height: 1.125rem;
  width: 1.125rem;
`;

interface RealCheckBoxProps {
  isDisbaled?: boolean;
  title?: string;
}

export const RealCheckbox = styled.input<RealCheckBoxProps>`
  border: none;
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 100;
  background: transparent;
  opacity: 0;
  cursor: ${({ isDisbaled }) => (isDisbaled ? "not-allowed" : "pointer")};
  ${({ title }) =>
    title &&
    `
      :hover::before {
        content: attr(title);
        display: block;
        position: absolute;
        background-color: #333;
        color: #fff;
        padding: 0.3125rem;
        border-radius: 0.3125rem;
        z-index: 1;
      }`}
`;
