import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";

const { overlayColor } = Colors;

interface PopupContainerProps {
  width?: string;
  unfit?: boolean;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
}

export const PopupContainer = styled.div<PopupContainerProps>`
  border-radius: 0.5rem;
  margin: 0 auto;
  position: absolute;
  height: ${({ height }) => height};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  width: 100%;
`;

export const PopupWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PopupOverlay = styled.div`
  width: 100%;
  height: 100%;
  background: ${overlayColor};
`;
