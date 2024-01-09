import styled from "styled-components";
interface IDropDownProps {
  width?: string;
  margin?: string;
  height?: string;
  background?: string;
  border?: string;
  marginTop?: string;
}

export const CustomTimeContainer = styled.div`
  position: relative;
  span {
    position: absolute;
    top: 9px;
    margin: 0 0.625rem;
    z-index: 1;
  }
  background: ${(props: IDropDownProps) => props.background || "#f4f6f9"};
  border: none;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  padding: 0.3125rem 1em;
  width: ${(props: IDropDownProps) => props.width};
  box-sizing: border-box;
  flex-direction: column;
  margin-top: ${(props: IDropDownProps) => props.marginTop ?? "1em"};

  label {
    position: absolute;
    top: -2.2em;
    left: 0;
    font-size: 0.75rem;
  }

  .time {
    border: none;
  }

  #clock-img {
    width: 18px;
  }

  input {
    padding: 1rem 0px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
    appearance: none;
    height: ${(props: IDropDownProps) => props.height ?? "2.5rem"};
    width: ${(props: IDropDownProps) => props.width};
    border-radius: 0.75rem;
    background: ${(props: IDropDownProps) => props.background || "#f4f6f9"};
    border: ${(props: IDropDownProps) => props.border || "1px solid #8196b3"};
    width: 100%;
    color: #9ea8b7;
    font-weight: 600;
    cursor: pointer;
    outline: none;

    :focus {
      outline: none;
    }

    ::-webkit-calendar-picker-indicator {
      /* display: none; */

      cursor: pointer;
    }
  }
`;
