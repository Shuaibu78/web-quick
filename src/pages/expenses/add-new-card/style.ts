import styled from "styled-components";

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5.3125rem);
`;

export const Box = styled.div`
  form {
    margin-top: 1.875rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    div {
      display: flex;
      justify-content: space-between;
    }
    textarea {
      border: none;
      border-radius: 0.625rem;
      background-color: #f4f6f9;
      width: 100%;
      margin-top: 0.625rem;
      outline: none;
      padding: 0.9375rem;
      font-size: 1rem;
      color: #8196b3;
      height: 5.625rem;
      overflow: auto;
      resize: none;
    }
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  .cancelCont {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    height: 1.875rem;
    width: 1.875rem;
    background-color: rgba(233, 239, 246, 1);
    cursor: pointer;
  }

  h3 {
    font-weight: 600;
    font-size: 1rem;
    color: rgba(96, 112, 135, 1);
  }
`;
