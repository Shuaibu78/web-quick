import styled, { keyframes } from "styled-components";

const animate = keyframes`
    0% {
        height: 4.375rem;
    }
    50% {
        height: 5.3125rem;
    }
    100% {
        height: 4.375rem;
    }
`;
export const Container = styled.div<{ noBg?: boolean }>`
  background: ${({ noBg }) => (noBg ? "" : "rgba(0, 0, 0, 0.2)")};
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999999999;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    height: 4.375rem;
    animation: ${animate} 2s linear infinite;
  }
`;
