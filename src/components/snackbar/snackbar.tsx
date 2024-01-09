/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleSnackbarClose } from "../../app/slices/snacbar";
import { FiX } from "react-icons/fi";
import { Colors } from "../../GlobalStyles/theme";

const Snackbar: FunctionComponent<{ timeout: any }> = ({
  timeout,
}): ReactElement<any, any> | null => {
  const dispatch = useAppDispatch();

  // select the UI states from the redux store
  const {
    toggleSnackbar: SHOW,
    snackbarMessage: MESSAGE,
    color,
  } = useAppSelector((state) => state.snackbar);

  // convert the timeout prop to pass into the styled component
  const TIME = (timeout - 500) / 1000 + "s";

  let TIMER: any;
  const handleTimeout = () => {
    TIMER = setTimeout(() => {
      dispatch(toggleSnackbarClose());
    }, timeout);
  };

  const handleClose = () => {
    clearTimeout(TIMER);
    dispatch(toggleSnackbarClose());
  };

  useEffect(() => {
    if (SHOW) {
      handleTimeout();
    }
    return () => {
      clearTimeout(TIMER);
    };
  }, [SHOW, TIMER]);

  return (
    <>
      {SHOW && (
        <Container color={color} time={TIME}>
          <p>{MESSAGE}</p>
          <Button onClick={handleClose}>
            <FiX />
          </Button>
        </Container>
      )}
    </>
  );
};

const fadein = keyframes`
    from {
      bottom: 0;
      opacity: 0;
    }
    to {
      bottom: 6.5rem;
      opacity: 1;
    }
`;

const fadeout = keyframes`
    from {
      bottom: 6.5rem;
      opacity: 1;
    }
    to {
      bottom: 0;
      opacity: 0;
    }
`;

export type SnackbarType = "SUCCESS" | "DANGER" | "DEFAULT" | "INFO" | "WARNING";

interface ContainerProps {
  color?: SnackbarType;
  time: any;
}

const getSnackBarColor = (color: ContainerProps["color"] = "DEFAULT") => {
  switch (color) {
    case "DANGER":
      return "#ff5050";
    case "INFO":
      return "#35343B";
    case "WARNING":
      return "#35343B";
    case "SUCCESS":
      return "#219653";
    case "DEFAULT":
    default:
      return Colors.primaryColor;
  }
};

const Container = styled.div<ContainerProps>`
  position: absolute;
  z-index: 99990000;
  bottom: 6.5rem;
  left: 50%;
  transform: translateX(-50%);
  height: auto;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  border: transparent;
  background-color: ${(props) => getSnackBarColor(props.color)};
  color: white;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  font-size: 1.1rem;

  display: flex;
  justify-content: center;
  align-items: center;

  animation: ${fadein} 0.5s, ${fadeout} 0.5s ${(props: { time: any }) => props.time};
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 0.875rem;
  padding: 0;
  margin-left: 1rem;
  height: 1.75rem;
  width: 1.75rem;
  text-align: center;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  color: white;
  cursor: pointer;
  font-size: 1.5rem;

  &:hover {
    opacity: 0.5;
  }
`;

export default Snackbar;
