import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  background: #f4f6f9;
  width: 100%;

  &::-webkit-scrollbar {
    display: none;
  }
`;
export const LeftContainer = styled.div`
  width: 100%;
  padding: 0px 0.625rem;
  height: 100vh;
  max-height: 100vh;
  overflow-y: scroll;
  position: relative;
`;
