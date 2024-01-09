import React from "react";
import { useAppDispatch } from "../../app/hooks";
import { isError } from "../../app/slices/status";
import errorIcon from "../../assets/warning.svg";
import { Container, ModalContainer } from "./style";

const Error = () => {
  const dispatch = useAppDispatch();
  const handleClose = () => {
    dispatch(isError(false));
  };
  return (
    <Container>
      <ModalContainer>
        <img src={errorIcon} alt="error icon" />
        <p>An error occured</p>
        <button onClick={handleClose}>Close</button>
      </ModalContainer>
    </Container>
  );
};

export default Error;
