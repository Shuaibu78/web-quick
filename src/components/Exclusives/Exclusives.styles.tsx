import styled, { keyframes } from "styled-components";
import { Colors } from "../../GlobalStyles/theme";

export const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(1.875rem);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeOut = keyframes`
  0% {
    opacity: 0;
    transform: translateY(-1.875rem);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const Wrapper = styled.div`
  display: flex;
  background-color: #fff;
  padding: 1rem;
  border-radius: 1rem;
  gap: 1rem;
  width: 800px;
  min-width: 800px;
  height: 600px;
  align-items: flex-start;
  flex-direction: column;
  overflow-y: hidden;
`;

export const ActiveContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 30%;
  min-height: 30%;
  border-bottom: 1px solid #f4f6f9;

  .active {
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    grid-gap: 0.625rem;
    height: 100%;
  }
`;
export const InactiveContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 70%;
  min-height: 70%;

  .inactive {
    width: 100%;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    grid-gap: 0.625rem;
    height: calc(100% - 95px);
    padding-bottom: 1rem;
    min-height: calc(100% - 95px);
    padding-right: 0.625rem;
    overflow-y: auto;

    scrollbar-width: 0.3125rem;
    ::-webkit-scrollbar {
      background-color: #f6f8fb;
      width: 0.3125rem;
    }

    ::-webkit-scrollbar-thumb {
      background-color: ${Colors.primaryColor};
    }
  }
`;

export const Feature = styled.div<{ active?: boolean }>`
  display: flex;
  padding: 0.7rem;
  height: 9.375rem;
  min-height: 9.375rem;
  width: 100%;
  gap: 1rem;
  border: ${({ active }) => (active ? "1px solid #9ea8b7" : "none")};
  border-radius: 1rem;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  background-color: #f4f6f9;
  animation: ${({ active }) => (active ? fadeIn : fadeOut)} 0.3s ease-in-out;
`;
