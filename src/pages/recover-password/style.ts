import styled from "styled-components";
import ResetImage from "../../assets/resetPwd-bg.png";
import { isFigorr } from "../../utils/constants";
import { Colors } from "../../GlobalStyles/theme";

const { primaryColor } = Colors;

export const Container = styled.div`
  background: #f4f6f9;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-direction: ${isFigorr ? "row" : "column"};
  gap: ${isFigorr ? "29.2em" : "unset"};
  align-items: center;
  padding: 1.875rem;
  background: ${isFigorr ? primaryColor : `url(${ResetImage}), #f4f6f9`};
  background-position: bottom left;
  background-size: 30%;
  background-repeat: no-repeat;
  @media screen and (max-width: 434px) {
    padding: inherit 1.875rem;
  }
`;
export const Back = styled.div`
  display: flex;
  background: #f4f6f9;
  height: 2.1875rem;
  justify-content: center;
  align-items: center;
  padding: 0.3125rem 0.625rem;
  border: 1px solid #607087;
  border-radius: 0.5em;
  align-self: start;
  margin-bottom: 1rem;
  cursor: pointer;

  &:hover {
    opacity: 0.5;
  }
`;
