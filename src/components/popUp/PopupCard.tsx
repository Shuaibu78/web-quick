import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { PopupContainer, PopupWrapper, PopupOverlay } from "./style";

interface IPopup {
  close?: any;
  width?: string;
  height?: string;
  unfit?: boolean;
  maxWidth?: string;
  maxHeight?: string;
  children?: any;
}

const PopupCard: FunctionComponent<IPopup> = ({
  children,
  close,
  width,
  unfit,
  height,
  maxWidth,
  maxHeight,
}) => {
  const [closeCard, setCloseCard] = useState<boolean>(true);
  const handleClose = () => {
    if (close) {
      setCloseCard(false);
      close();
    }
  };

  return (
    <>
      {closeCard && (
        <PopupWrapper>
          <PopupOverlay onClick={handleClose} />
          <PopupContainer
            maxHeight={maxHeight}
            maxWidth={maxWidth}
            height={height}
            unfit={unfit}
            width={width}
          >
            {children}
          </PopupContainer>
        </PopupWrapper>
      )}
    </>
  );
};

export default PopupCard;
