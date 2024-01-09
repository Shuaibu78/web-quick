import styled from "styled-components";

export const InputWithIcon = styled.div<{ width?: string }>`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 2px 6px;
  width: ${({ width }) => width ?? "#48%"};
  background: #f4f6f9;
  border-radius: 0.75rem;
  height: 2.5rem;
  position: relative;
  input {
    border: none;
    background: transparent;
    width: 100%;
    outline: none;
    color: #8196b3;
    font-size: 1rem;
    display: flex;
    flex-direction: row-reverse;
    justify-content: space-around;
    column-gap: 2rem;
  }

  input[type='date']::-webkit-calendar-picker-indicator, input[type='time']::-webkit-calendar-picker-indicator {
    background: transparent;
    bottom: 0;
    color: transparent;
    cursor: pointer;
    height: auto;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: auto;
}

  img {
    height: 24px;
    max-height: 24px;
    margin: 0 5px;
  }
`;
