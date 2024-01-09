import styled from "styled-components";

export const Container = styled.div`
  background: rgba(0, 0, 0, 0.2);
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalContainer = styled.div`
  padding: 45px 1.25rem;
  border-radius: 0.9375rem;
  width: 98%;
  max-width: 400px;
  background: #fff;
  display: flex;
  align-items: center;
  flex-direction: column;
  img {
    height: 2rem;
  }
  p {
    color: #555;
    font-size: 1.375rem;
    font-weight: 600;
    margin: 0.625rem 0;
  }
  button {
    border: none;
    background: #130f26;
    margin: 0.625rem 0;
    color: #fff;
    outline: none;
    font-weight: 500;
    font-size: 1rem;
    padding: 0.625rem 1.25rem;
    border-radius: 0.5rem;
    cursor: pointer;
  }
`;
