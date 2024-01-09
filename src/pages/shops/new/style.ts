import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  form {
    margin: 1.25rem auto;
    width: 100%;
    max-width: 450px;
  }
  @media screen and (max-width: 900px) {
    flex-direction: column;
    width: 100%;
  }
  label {
    color: #607087;
    font-size: 0.875rem;
    display: inline-block;
    margin: 0.625rem 0;
  }
`;
export const ControlNav = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 5.625rem;
  @media screen and (max-width: 473px) {
    flex-direction: column;
    justify-content: start;
    align-items: start;
  }
  h2 {
    color: #607087;
    font-size: 1.125rem;
  }
`;
export const SubText = styled.p`
  font-size: 0.875rem;
  color: #8196b3;
  margin: 0.625rem 0 0.9375rem 0;
`;
