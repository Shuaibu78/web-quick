import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";

interface iSubCardSelector {
  checked?: boolean;
  width?: string;
  height?: string;
}
const CustomRadio = styled.div<iSubCardSelector>`
  display: flex;
  align-items: center;
  cursor: pointer;
  height: ${({ height }) => height ?? "1.125rem"};
  width: ${({ width }) => width ?? "2rem"};
  border: ${({ checked }) => (checked ? "none" : `1px solid ${Colors.grey4}`)};
  margin: 0px 0;
  border-radius: 0.75rem;
  padding: 0.125rem 0.125rem;
  border: ${({ checked }) => (checked ? `1px solid ${Colors.black}` : "translateX(0px)")};

  span {
    display: inline-flex;
    height: 0.75rem;
    width: 0.75rem;
    border-radius: 50%;
    border: 1px solid #8196b3;
    align-items: center;
    justify-content: center;
    margin-right: 0.625rem;
    transform: ${({ checked }) => (checked ? "translateX(0.9375rem)" : "translateX(0px)")};
    background: ${({ checked }) => (checked ? Colors.black : Colors.grey)};
  }
`;

const CustomRadioInput = ({
  isChecked,
  onChange,
  value,
}: {
  isChecked: boolean;
  onChange: Function;
  value?: string;
}) => {
  return (
    <div>
      <CustomRadio id={value} checked={isChecked} onClick={() => onChange()}>
        <span></span>
      </CustomRadio>
    </div>
  );
};

export default CustomRadioInput;
