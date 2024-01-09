import React, { FunctionComponent } from "react";
import styled, { keyframes } from "styled-components";
import { Colors } from "../../../GlobalStyles/theme";

const slideIn = keyframes`
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0%);
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0%);
  }
  to {
    transform: translateX(100%);
  }
  `;

interface ModBG {
  borderRadius?: string;
  height?: string;
  padding?: string;
  isVisible?: boolean;
}

const ModalBackground = styled.div`
  background-color: ${Colors.overlayColor};
  position: fixed;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  z-index: 9999999;
`;

const ModalContent = styled.div<ModBG>`
  background-color: #fff;
  position: fixed;
  top: 0px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 1.25rem 0px;
  right: 0;
  bottom: 0;
  z-index: 2;
  height: ${({ height }) => height ?? "auto"};
  padding: ${({ padding }) => padding ?? "1rem"};
  overflow-y: scroll;
  animation: ${({ isVisible }) => (isVisible ? slideIn : slideOut)} 0.3s backwards;
  border-radius: ${({ borderRadius }) => borderRadius ?? "unset"};
`;

interface IPopup {
  showProductModal: boolean;
  children?: any;
  borderRadius?: string;
  height?: string;
  padding?: string;
}

const ModalSidebar: FunctionComponent<IPopup> = ({
  children,
  showProductModal,
  borderRadius,
  height,
  padding,
}) => {
  return (
    <div>
      {showProductModal && (
        <ModalBackground>
          <ModalContent
            height={height}
            padding={padding}
            borderRadius={borderRadius}
            isVisible={showProductModal}
          >
            {children}
          </ModalContent>
        </ModalBackground>
      )}
    </div>
  );
};

export default ModalSidebar;
