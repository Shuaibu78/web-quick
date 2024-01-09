import styled from "styled-components";
import { Colors } from "../../../GlobalStyles/theme";
import { Flex } from "../../../GlobalStyles/CustomizableGlobal.style";

export const BankSettingsContainer = styled.div`
  .section-title {
    color: ${Colors.blackishBlue};
    fontStyle: italic;
    fontSize: 0.754rem;
  }
`;

export const Seperator = styled.hr`
  background: Colors.grey;
  width: 100%;
  margin: 0.75rem 0;
`;

interface IInputWrapper {
  width?: string;
  gap?: string;
  isFocused?: boolean;
  margin?: string;
}

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.625rem 0;
  gap: ${(props: IInputWrapper) => props.gap || "unset"};
  width: ${(props: IInputWrapper) => props.width || "100%"};
  margin: ${(props: IInputWrapper) => props.margin || "unset"};
  transform: all ease-in-out 0.5s;

  @media screen and (max-width: 434px) {
    margin: 0;
  }
`;

export const InfoBox = styled.div`
  border-radius: 5px;
  border: 1px solid ${Colors.blackishBlue};
  color: ${Colors.blackLight};
  font-size: 1.2rem;
  margin: 2rem 0;
  padding: 1rem;
  position: relative;
  background: rgba(158, 168, 183, 0.15);

  .mini-text {
    color: ${Colors.secondaryColor};
    font-style: italic;
    font-size: 0.854rem;
    margin-top: 0.75rem;
  }

  .label {
    padding: 0.4rem;
    width: fit-content;
    position: absolute;
    background: #fff;
    color: ${Colors.blackishBlue};
    margin: 0;
    text-align: center;
    top: -12%;
    font-size: 0.854rem;
  }
`;

export const WarningBox = styled(Flex)`
  padding: 1rem;
  border-radius: 8px;
  background: ${Colors.lightBg};
  margin: 1rem 0;

  svg {
    width: 65px;
  }

  .message {
    color: ${Colors.blackLight};
    font-size: 0.834rem;
  }
`;

export const BankSelect = styled.select`
  height: 3.125rem;
  padding: 0 1rem;
  border-radius: 0.75rem;
  border: 0;
  background: #F4F6F9;
  color: ${Colors.blackLight};
  text-transform: capitalize;
  font-size: 1rem;

  .select-placeholder {
    opacity: 0.5;
    display: none;
  }

  &:focus, &:focus-visible {
    outline: none;
  }
`;

export const BankOption = styled.option`
  textTransform: capitalize;
  font-size: 1rem;
  margin: 0.5rem;
`;
