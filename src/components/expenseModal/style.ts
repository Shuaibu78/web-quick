import styled from "styled-components";

export const ModalContainer = styled.div`
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  -webkit-backdrop-filter: blur(1px);
  backdrop-filter: blur(1px);
  padding: 50vh 0;
`;

export const Box = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 1.25rem;
  min-width: 350px;
  width: 20%;
  min-height: 470px;
  padding: 1.25rem 1.25rem;
  form {
    width: 90%;
    display: flex;
    flex-direction: column;

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
      margin-bottom: 1.875rem;
      outline: none;
      padding: 0.625rem;
      font-size: 1rem;
      color: #8196b3;
      height: 5.625rem;
      overflow: auto;
      resize: none;
    }
  }
`;
export const ModalBox = styled.div`
  background: #fff;
  border-radius: 1.25rem;
  min-width: 350px;
  width: 30%;
  min-height: 9.375rem;
  padding: 1.25rem 1.875rem;
  h3 {
    color: #607087;
    font-size: 1.125rem;
    margin: 1.25rem 0;
    button {
      height: 2.5rem;
      width: 2.5rem;
      display: inline-flex;
      align-items: center;
      margin-right: 0.625rem;
      justify-content: center;
      background: #e9eff7;
      border-radius: 0.625rem;
      border: none;
      cursor: pointer;
    }
  }
  label {
    color: #607087;
    font-size: 13px;
    display: inline-block;
    margin: 0.625rem 0;
  }
`;

export const Header = styled.div`
  width: 90%;
  margin-bottom: 1.25rem;
  .cancelCont {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    height: 1.875rem;
    width: 1.875rem;
    background-color: rgba(233, 239, 246, 1);
    cursor: pointer;
    margin-right: 1.25rem;
  }

  h3 {
    position: absolute;
    left: 5.625rem;
    font-weight: 600;
    font-size: 1rem;
    color: rgba(96, 112, 135, 1);
  }
`;
