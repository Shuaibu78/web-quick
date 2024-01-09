import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";

const { overlayColor } = Colors;

interface PopupContainerProps {
  width?: string;
  unfit?: boolean;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
}

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 0.625rem;
  background-color: white;
  border-radius: 1rem;
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`;

export const FormContainer = styled.form<PopupContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin-top: 2rem;
`;

export const Container = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;
