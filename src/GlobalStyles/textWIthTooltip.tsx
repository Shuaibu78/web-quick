import { ReactNode } from "react";
import styled from "styled-components";
import { Colors } from "./theme";

interface IToolTip {
  text: string | ReactNode;
  tooltip: string;
  width?: string;
}

const StyledText = styled.span<{ width?: string }>`
  cursor: pointer;
  position: relative;
  color: ${Colors.blackLight};
  width: ${({ width }) => width ?? "auto"};
`;

const StyledTooltip = styled.div`
  position: absolute;
  top: 1.2rem;
  left: 0;
  visibility: hidden;
  background-color: #000;
  color: #fff;
  padding: 5px;
  border-radius: 5px;

  ${StyledText}:hover & {
    visibility: visible;
  }
`;

const TextWithTooltip = ({ text, tooltip, width }: IToolTip) => {
  return (
    <StyledText width={width}>
      {text}
      <StyledTooltip>{tooltip}</StyledTooltip>
    </StyledText>
  );
};

export default TextWithTooltip;
