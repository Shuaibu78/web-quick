import { CancelButton } from "./../sales/style";
import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";

interface ButtonProps {
  isActive?: boolean;
}

export const Container = styled.div`
  display: flex;
  padding-top: 1.25rem;
  h2 {
    font-weight: 600;
    font-size: 1.125rem;
    padding: 3px 0;
    color: #607087;
  }
  @media screen and (max-width: 720px) {
    flex-direction: column;
  }
`;
export const LeftContainer = styled.div`
  max-width: 400px;
  width: 100%;
  background: #ffffff;
  padding: 1.25rem;
  box-shadow: 0px 4px 1.875rem rgba(140, 157, 181, 0.06);
  border-radius: 1.25rem;
  height: 70vh;
  min-height: 31.25rem;
`;
export const RightContainer = styled.div`
  max-width: 1000px;
  width: 100%;
  padding: 1.25rem 0 0 2.5rem;
`;
export const NavButton = styled.button`
  border: none;
  cursor: pointer;
  display: flex;
  background: ${(props: ButtonProps) => (props.isActive ? "#D7DEE8" : "#F4F6F9")};
  border-radius: 0.75rem;
  padding: 0.9375rem;
  width: 100%;
  height: 4.375rem;
  align-items: center;
  margin: 0.625rem 0;
  h3 {
    font-size: 1rem;
    color: #607087;
  }
  p {
    font-size: 0.75rem;
    color: #8196b3;
  }
`;
export const IconContainer = styled.div`
  width: 3.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const DropdownContainer = styled.div`
  width: 3.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;
export const Text = styled.div`
  text-align: left;
  width: 100%;
  padding-left: 0.625rem;
`;
export const Form = styled.form`
  width: 100%;
  padding: 0.625rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  label {
    font-weight: 400;
    font-size: 13px;
    color: #607087;
    padding: 0.5rem 0;
  }
`;
export const ImageSection = styled.div<{ currImage?: boolean }>`
  display: flex;
  flex-direction: column;
  margin: 7px 0;
  align-items: center;
  small {
    margin-top: 0.625rem;
  }
  label {
    width: 74px;
    height: 74px;
    background: #f4f6f9;
    border-radius: 1rem;
    border: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    img:nth-child(2) {
      padding-top: 0.625rem;
    }
    img {
      ${({ currImage }) =>
        currImage &&
        `
      width: 74px;
      height: 74px;
      border-radius: 1rem;
      `}
    }
  }
  #preview {
    height: 38px;
    width: auto;
  }
`;
export const SubPageContainer = styled.div`
  padding: 0;
  max-width: 400px;
  width: 100%;
`;
export const FormNotify = styled.small`
  font-weight: 400;
  font-size: 0.875rem;
  color: #607087;
  padding: 0.9375rem 0;
  opacity: 0.5;
`;
export const SmallHeader = styled.small`
  display: block;
  margin: 0.9375rem 0;
  font-weight: 400;
  font-size: 0.875rem;
  color: #607087;
`;
export const ModalContainer = styled.div<{ color?: string }>`
  position: fixed;
  top: 0px;
  left: 0;
  background: ${({ color }) => color ?? "rgba(0, 0, 0, 0.2)"};
  z-index: 20000;
  width: 100vw;
  height: 100vh;
  -webkit-backdrop-filter: blur(1px);
  backdrop-filter: blur(1px);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1.25rem;
`;

export const ModalBox = styled.div<{
  width?: string;
  padding?: string;
  textMargin?: string;
  position?: boolean;
  minHeight?: string;
}>`
  background: #fff;
  border-radius: 1.25rem;
  min-width: 350px;
  width: 30%;
  min-height: ${({ minHeight }) => minHeight ?? "9.375rem"};
  max-height: 90vh;
  overflow-y: scroll;
  padding: ${({ padding }) => padding ?? "1.25rem 1.875rem"};
  width: ${({ width }) => width ?? "auto"};
  max-height: 90vh;
  overflow-y: scroll;
  ${({ position }) =>
    position &&
    `
  position: relative;
  `}
  h3 {
    color: #607087;
    font-size: 1.125rem;
    margin: ${({ textMargin }) => textMargin ?? "1.25rem 0"};
    button {
      height: 2.5rem;
      width: 2.5rem;
      display: inline-flex;
      align-items: center;
      margin-right: 0.625rem;
      justify-content: center;
      background: #e9eff7;
      border-radius: 0.625rem;
      border: none;
      cursor: pointer;
    }
  }

  label {
    color: #607087;
    font-size: 13px;
    display: inline-block;
    margin: 0.625rem 0;
  }

  .close-button {
    border: 1px solid ${Colors.grey};
    padding: "0.3125rem 0.625rem";
    borderradius: "0.5rem";
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  p {
    color: #8196b3;
  }
  a {
    text-decoration: none;
    color: #ffbe62;
  }
`;
export const UserCard = styled.button`
  display: flex;
  padding: 0.625rem;
  margin: 0.9375rem 0;
  border-radius: 1rem;
  box-shadow: 0px 4px 1.875rem rgba(140, 157, 181, 0.08);
  background: white;
  border: none;
  cursor: pointer;
  transition: 0.3 linear;
  text-align: left;
  width: 100%;
  :hover {
    transform: scale(1.02);
  }
  p {
    font-size: 1rem;
    color: #4f4f4f;
  }
  small {
    font-size: 0.75rem;
  }
`;

export const ModalConfirmationContent = styled.div`
  background-color: white;
  padding: 1.25rem;
  border-radius: 0.3125rem;
  box-shadow: 0 0 0.625rem rgba(0, 0, 0, 0.5);
`;

export const ButtonConfirmationContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1.25rem;
`;

export const ButtonConfirmation = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 0.3125rem;
  padding: 0.625rem 1.25rem;
  cursor: pointer;
  margin-left: 0.625rem;
`;

export const PrinterSettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 2rem;
`;

export const PrinterListContainer = styled.div`
  margin-bottom: 2rem;
`;

export const PrinterList = styled.ul`
  list-style: none;
  padding: 0;
`;

interface PrinterItemProps {
  isSelected: boolean;
}

export const PrinterItem = styled.li<PrinterItemProps>`
  padding: 1rem;
  border: 2px solid ${(props) => (props.isSelected ? "#ffbe62" : "#ddd")};
  background-color: ${(props) => (props.isSelected ? "#fff" : "inherit")};
  cursor: pointer;
  margin-bottom: 0.625rem;
  border-radius: 0.25rem;

  &:hover {
    background-color: #f0f8ff;
  }
`;

export const PrinterName = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`;

export const PrinterDescription = styled.p`
  margin: 0;
  font-size: 0.875rem;
`;

export const PrintTestButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: #ffbe62;
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background-color: #ffbe62;
  }
`;

export const PrinterSelectContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
`;

export const PrinterSelectWrapper = styled.div`
  margin-right: 2rem;
`;

export const PrinterSelect = styled.select`
  padding-block: 1rem;
  padding-inline: 0.5rem;
  border-radius: 0.3125rem;
  cursor: pointer;
  margin-bottom: 0.625rem;
`;

export const PrinterOption = styled.option``;

export const SwitchLabel = styled.label`
  position: relative;
  display: inline-block;
  width: 3.75rem;
  height: 34px;
`;

export const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  :checked + span {
    background-color: #ffbe62;
  }
  :focus + span {
    box-shadow: 0 0 1px #ffbe62;
  }
  :checked + span:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
`;

export const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 34px;

  :before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;
  }
`;

export const TaxListing = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.25rem 0;
  row-gap: 0.9375rem;
`;
export const TaxCard = styled.div`
  cursor: pointer;
  border-radius: 0.5rem;
  background: #fff;
  border: 1px solid #23364f1a;
  padding: 0.625rem 0.9375rem;
  display: flex;
  flex-direction: column;
  row-gap: 0.9375rem;
  div {
    display: flex;
    justify-content: space-between;
    p {
      color: #607087;
      font-size: 1rem;
    }
  }
  :hover {
    box-shadow: 0.125rem 0.125rem 0.625rem 0px #23364f1a;
  }
  p {
    color: #feb032;
    font-size: 0.875rem;
  }
`;

export const CancelModalButton = styled.button`
  height: 2.5rem;
  width: 2.5rem;
  display: inline-flex;
  align-items: center;
  margin-right: 0.625rem;
  justify-content: center;
  background: transparent;
  border-radius: 0.625rem;
  border: 1px solid #9ea8b7;
  cursor: pointer;
`;
