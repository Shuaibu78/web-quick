import styled from "styled-components";

interface ButtonProps {
  isActive?: boolean;
  margin?: string;
  color?: string;
  height?: string;
}

export const Container = styled.div`
  background: #ffffff;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 6.25rem);
  overflow-y: scroll;
  padding: 1rem;

  img {
    width: 18.75rem;
    align-self: center;
    margin-bottom: 2rem;
  }
`;
export const ToggleButton = styled.button`
  margin: ${(props: ButtonProps) => props.margin};
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  height: 3.125rem;

  span:first-child {
    height: 1.125rem;
    width: 1.125rem;
    border-radius: 30%;
    background: ${(props: ButtonProps) => (props.isActive ? props.color : "transparent")};
    display: flex;
    justify-content: center;
    outline: none;
    cursor: pointer;
    align-items: center;
    border: 1px solid ${(props: ButtonProps) => (props.isActive ? "transparent" : props.color)};
  }

  .title {
    margin-left: 1rem;
    color: #607087;
    margin-right: 1rem;
  }

  span {
    font-size: 0.875rem;
    color: #8196b3;
  }
`;
