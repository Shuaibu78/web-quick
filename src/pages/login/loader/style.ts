import styled from "styled-components";
import { Colors } from "../../../GlobalStyles/theme";
import { isFigorr } from "../../../utils/constants";
const { primaryColor, secondaryColor } = Colors;
interface LoaderProps {
  width: string;
}
export const Container = styled.div`
  img {
    width: 100%;
  }
`;

export const Header = styled.h1`
  font-size: 32px;
  color: #607087;
  text-align: center;
  margin: 0.3125rem 0;
  a {
    color: ${isFigorr ? secondaryColor : primaryColor};
    text-decoration: none;
  }
  @media screen and (max-width: 434px) {
    font-size: 1.5625rem;
  }
`;
export const SubHeader = styled.p`
  /* font-size: ; */
  text-align: center;
  color: #607087;
`;
export const LoadCont = styled.div`
  height: 13px;
  background: #fcf7f0;
  border-radius: 6.25rem;
  overflow: hidden;
  width: 100%;
  margin: 0.9375rem auto;
`;
export const LoadGuage = styled.div`
  height: 100%;
  background: ${isFigorr ? secondaryColor : primaryColor};
  width: ${(props: LoaderProps) => props.width};
`;
export const LoadState = styled.p`
  font-size: 0.875rem;
  color: #8196b3;
  text-align: center;
`;
export const BHeader = styled.div`
  font-size: 1.375rem;
  color: #607087;
  text-align: center;
  margin: 0.3125rem 0;
  a {
    color: ${Colors.secondaryColor};
    text-decoration: none;
  }
  @media screen and (max-width: 434px) {
    font-size: 1.125rem;
  }
`;
export const BSubHeader = styled.p`
  width: 90%;
  color: #607087;
  text-align: center;
  margin: 0.3125rem auto;
  a {
    color: ${isFigorr ? secondaryColor : primaryColor};
    text-decoration: none;
  }
`;
