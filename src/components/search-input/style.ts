import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";

const { primaryColor } = Colors;
interface SearchProps {
  borderRadius?: string;
  height?: string;
  width?: string;
  fontSize?: string;
  background?: string;
  border?: string;
}
export const Container = styled.div`
  width: ${(props: SearchProps) => props.width || "12.5rem"};
  height: ${(props: SearchProps) => props.height || "2.5rem"};
  border-radius: ${(props: SearchProps) => props.borderRadius || "3px"};
  display: flex;
  align-items: center;
  background: ${(props: SearchProps) => props.background || Colors.white};
  border: ${(props: SearchProps) => props.border || `1px solid ${Colors.grey}`};
  overflow: hidden;
  input {
    border: none;
    outline: none;
    background: transparent;
    height: 100%;
    width: 100%;
    color: #607087;
    font-size: ${(props: SearchProps) => props.fontSize || "13px"};
    border-radius: inherit;
    caret-color: ${primaryColor};

    ::placeholder {
      color: ${Colors.lightBlue};
    }

    :focus {
      outline: none;
      border: none;
    }
  }

  &:focus-within {
    border: 1px solid ${primaryColor};
  }
  button {
    border: none;
    background: transparent;
    width: 45px;
    min-width: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  @media screen and (max-width: 1059px) {
    width: 100%;
    margin-bottom: 2%;
    max-width: 370px;
  }
`;
export const SearchButton = styled.button`
  img {
    height: calc(${(props: SearchProps) => props.height || "2.5rem"} / 2.3);
  }
`;
export const CancelButton = styled.button`
  img {
    height: calc(${(props: SearchProps) => props.height || "2.5rem"} / 3);
  }
`;
