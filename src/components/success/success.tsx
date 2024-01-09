import React from "react";
import { useAppDispatch } from "../../app/hooks";
import { isSuccess } from "../../app/slices/status";
import successIcon from "../../assets/ok.svg";
import { Container, ModalContainer } from "./style";

const Error = () => {
  const dispatch = useAppDispatch();
  const handleClose = () => {
    dispatch(isSuccess(false));
  };
  return (
    <Container>
      <ModalContainer>
        <img src={successIcon} alt="error icon" />
        <p>Success</p>
        <button onClick={handleClose}>Close</button>
      </ModalContainer>
    </Container>
  );
};

export default Error;
