import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";

interface ButtonProps {
  isActive?: boolean;
  margin?: string;
  color?: boolean;
  height?: string;
  cursor?: string;
}
interface TRowProps {
  minWidth?: string;
  background?: string;
  height?: string;
  maxWidth?: string;
}
interface ControlProps {
  margin?: string;
  width?: string;
  height?: string;
}
export const ControlContainer = styled.div<ControlProps>`
  display: flex;
  align-items: center;
  position: relative;
  justify-content: space-between;
  column-gap: 10px;
  border-radius: 15px;
  margin: ${({ margin }) => margin ?? "20px 0"};
  height: ${({ height }) => height ?? "1.8rem"};
  width: ${({ width }) => width ?? "100%"};
  h3 {
    color: #607087;
    font-size: 0.9rem;
    width: 25%;
  }
  @media screen and (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
    height: auto;
    h3 {
      width: 100%;
    }
  }
`;
export const Container = styled.div<{ navBarHeight: number }>`
  display: flex;
  width: 100%;
  height: ${({ navBarHeight }) => `calc(100vh - ${navBarHeight! + 10}px)` || "100%"};
  background: transparent;
`;
export const TabContainer = styled.div`
  display: flex;
  align-items: center;
  max-width: 34.6875rem;
  width: 100%;
  height: 2.5rem;
  gap: 0.3rem 0.9rem;
  padding: 0.2rem;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(129, 150, 179, 0.15);
  @media screen and (max-width: 1024px) {
    margin: 0.625rem 0;
  }
`;
export const TabButton = styled.button<ButtonProps>`
  background: ${(props: ButtonProps) => (props.isActive ? Colors.primaryColor : "transparent")};
  border: none;
  width: fit-content;
  min-height: 1.9rem;
  padding: 0 0.9rem;
  height: ${({ height }) => height ?? "80%"};
  color: ${(props: ButtonProps) => (props.isActive ? "#FFF" : "#607087")};
  font-size: 0.9rem;
  border-radius: 0.5rem;
  align-items: center;
  cursor: pointer;
  span {
    height: 1.3125rem;
    width: 1.3125rem;
    min-height: 1.3125rem;
    min-width: 1.3125rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 0.75rem;
    color: #130f26;
    font-weight: 600;
    background: #fff;
  }
  @media screen and (max-width: 31.25rem) {
    font-size: 0.875rem;
  }
`;
export const RightControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 75%;
  margin: 0.625rem 0;
  @media screen and (max-width: 1024px) {
    width: 100%;
  }
  @media screen and (max-width: 700px) {
    flex-direction: column;
  }
`;
export const StaffContainer = styled.div`
  display: flex;
  width: 100%;
`;
export const TableContainer = styled.div`
  padding: 1rem;
  width: calc(((100% / 3) * 2) - 1.25rem);
  min-width: calc(((100% / 3) * 2) - 1.25rem);
  margin-right: 1.25rem;
  background: #ffffff;
  box-shadow: 0px 4px 1.875rem rgba(140, 157, 181, 0.06);
  border-radius: 1.25rem;

  h3 {
    font-size: 1.125rem;
    color: #607087;
  }
  p {
    font-size: 0.875rem;
    color: #8196b3;
  }
  @media screen and (max-width: 700px) {
    width: 100%;
    min-width: 100%;
  }
`;
export const FormContainer = styled.div`
  width: calc(100% / 3);
  min-width: calc(100% / 3);
  padding: 0 1.25rem;
  background: #ffffff;
  box-shadow: 0px 4px 1.875rem rgba(140, 157, 181, 0.06);
  border-radius: 1.25rem;
  h3 {
    color: #607087;
    font-size: 1.125rem;
    padding: 0.9375rem 0;
  }
  @media screen and (max-width: 700px) {
    width: 100%;
    min-width: 100%;
  }
`;
export const NotFoundContainer = styled.div`
  width: 100%;
  height: 63vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 35.625rem;
`;
export const SmallHeader = styled.p`
  font-weight: 600;
  font-size: 0.875rem;
  color: #607087;
`;
export const ToggleButton = styled.button`
  margin: ${(props: ButtonProps) => props.margin};
  background: transparent;
  border: none;
  cursor: ${(props: ButtonProps) => props.cursor ?? "pointer"};
  display: flex;
  align-items: center;
  height: ${(props: ButtonProps) => props.height ?? "3.125rem"};

  span:first-child {
    height: 1rem;
    width: 1rem;
    border-radius: 50%;
    background: ${(props: ButtonProps) => (props.isActive ? "#130F26" : "transparent")};
    display: flex;
    justify-content: center;
    outline: none;
    cursor: pointer;
    align-items: center;
    border: 1px solid ${(props: ButtonProps) => (props.isActive ? "transparent" : "#8196B3")};
  }

  .title {
    margin-left: 1rem;
    color: #607087;
    margin-right: 1rem;
  }
  .description {
    display: flex;
    font-size: 0.75rem;
    margin: 0;
    padding: 0.5rem 0;
    width: 100%;
    align-self: flex-start;
    text-justify: left;
    color: #8196b3;
  }
  span {
    font-size: 0.875rem;
    color: #8196b3;
    margin-left: 1rem;
  }
`;
export const ToggleCont = styled.button`
  display: flex;
  align-items: center;
  height: 1.875rem;
  background: transparent;
  border: none;
  outline: none;
  span {
    font-size: 0.875rem;
    color: #8196b3;
    margin-left: 1rem;
  }
`;
export const Roles = styled.div<{ navBarHeight: number }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-height: ${({ navBarHeight }) => `calc(100vh - ${navBarHeight! + 330}px)`};
  overflow-y: scroll;
  padding-left: 0.625rem;

  -ms-overflow-style: none;
  scrollbar-width: 0.3125rem;

  ::-webkit-scrollbar {
    background-color: #f6f8fb;
    width: 0.3125rem;
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${Colors.primaryColor};
    border-radius: 4px;
  }
`;
export const RoleNav = styled.div`
  display: flex;
  justify-content: space-between;
  width: 95%;
`;
export const RoleHeader = styled.div`
  background: #f4f6f9;
  display: grid;
  padding: 0.625rem 1.25rem;
  margin-bottom: 0.9375rem;
  width: 100%;
  border-radius: 1rem;
  grid-template-columns: 2fr 1fr 1fr;

  span {
    font-weight: 600;
    color: #607087;
    font-size: 0.875rem;
  }
`;
export const RoleRow = styled.div`
  display: grid;
  align-items: center;
  padding: 0 1.25rem;
  grid-template-columns: 2fr 1fr 1fr;
`;
export const RoleList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1.25rem 0;
  width: 100%;

  button {
    margin: 0.625rem 0;
  }
`;
export const DropdownTRow = styled.div`
  color: #607087;
  display: flex;
  align-items: center;
  width: 100%;
  min-width: ${(props: TRowProps) => props.minWidth};
  background: ${(props: TRowProps) => props.background};
  border-radius: 1rem;
  min-height: 45px;
  overflow: hidden;
  font-size: 0.875rem;
  margin: 0.3125rem 0;
`;
export const SubRow = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  width: 100%;
`;
export const TRow = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  position: relative;
  max-height: 2.8125rem;
  min-height: 2.8125rem;
`;
export const RowDropButton = styled.button`
  border: none;
  display: flex;
  background: rgba(129, 150, 179, 0.2);
  width: 3.125rem;
  min-height: 3.125rem;
  align-items: start;
  justify-content: center;
  align-items: center;
  height: ${(props: TRowProps) => props.height};
  cursor: pointer;
  img {
    width: 1.875rem;
    margin-top: 0.625rem;
    transition: 0.3s linear;
  }
`;

interface ActionRowProps {
  isOpen?: boolean;
}

export const ActionRow = styled.div<ActionRowProps>`
  width: 100%;
  padding: 0 0.9375rem 0 3.75rem;
  height: ${({ isOpen }) => (isOpen ? "calc(100% - 2.8125rem)" : 0)};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
`;

export const SubActionRow = styled.div`
  width: 100%;
  border-top: 1px solid #8196b3;
  display: flex;
  height: 100%;
`;
export const Left = styled.div`
  width: 100%;
  height: 100%;
`;
export const Right = styled.div`
  width: 6.25rem;
  height: 100%;
  display: flex;
  align-items: end;
  justify-content: center;
  button {
    height: 1.875rem;
    width: 1.875rem;
    display: flex;
    align-items: center;
    margin: 0 0.3125rem;
    cursor: pointer;
    justify-content: center;
    background: transparent;
    border: none;
  }
`;
export const CustomText = styled.p`
  color: #9ea8b7;
  text-transform: capitalize;
  font-size: ${(props: { fontSize?: string }) => (props.fontSize ? props.fontSize : "")};
  span {
    font-weight: 600;
    padding-right: 0.9375rem;
  }
`;
export const Label = styled.label`
  color: #607087;
  margin: 1.25rem 0 0.9375rem 0;
  font-size: 0.8125rem;
`;
