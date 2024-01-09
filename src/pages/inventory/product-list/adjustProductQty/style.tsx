import styled from "styled-components";
import { FontSizes } from "../../../../GlobalStyles/theme";

const { titleFont } = FontSizes;

export const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  width: 100%;

  img {
    background-color: #e9eff7;
    border-radius: 4px;
    display: flex;
    place-items: center;
    padding: 0.625rem;
    margin-right: 2rem;
    cursor: pointer;
  }

  p {
    margin: 0px;
    padding: 0px;
    font-size: ${titleFont};
    font-weight: 600;
  }
`;
interface IInput {
  width?: string;
  height?: string;
  margin?: string;
  noBorder?: boolean;
  readOnly?: boolean;
  padding?: string;
}
export const Input = styled.input<IInput>`
  border-radius: 0.75rem;
  border: 1px solid #8196b3;
  height: ${({ height }) => height ?? "2.1875rem"};
  padding: 0.3125rem 0.625rem;
  appearance: none;
  outline: none;
  background-color: transparent;
  font-size: 0.875rem;
  color: "#8196B3";
  width: ${({ width }) => width ?? "12.5rem"};
  margin: ${({ margin }) => margin};

  &:hover {
    cursor: ${({ readOnly }) => (readOnly ? "not-allowed" : "unset")};
  }
`;
