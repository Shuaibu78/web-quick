import styled from "styled-components";
import { Colors } from "../../../GlobalStyles/theme";

interface IRadioProps {
  isActive?: boolean;
}

export const Label = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;

  input {
    width: 1rem;
    height: 1rem;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  height: 100%;
  max-height: 210px;
  min-height: 2.5rem;
  margin: 1.25rem 0 0.3125rem 0;
  border-bottom: 1px solid #8196b340;
  overflow-y: scroll;
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
export const Tab = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  row-gap: 0.5em;
`;
interface TRowProps {
  minWidth?: string;
  background?: string;
  height?: string;
  maxWidth?: string;
}
interface ITabItem {
  isActive?: boolean;
}
export const TabItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem;
  border: none;
  border-top-right-radius: 24% 160%;
  border-top-left-radius: 24% 160%;
  width: 12.5rem;
  min-width: 12.5rem;
  height: 2.5rem;
  cursor: pointer;
  color: #8196b3;
  background: ${(props: ITabItem) => (props.isActive ? "#e8eef4" : "white")};
  opacity: ${(props: ITabItem) => (props.isActive ? "1" : "0.5")};
  button {
    border: none;
    background: transparent;
    padding: 0 0.3125rem;
    display: flex;
    align-items: center;
    cursor: pointer;
  }
`;
export const TabButton = styled.div`
  display: flex;
`;
export const AddTab = styled.button`
  padding: 0 0.625rem;
  background: transparent;
  border: none;
  cursor: pointer;
`;
export const Container = styled.div<{ columnGap?: string }>`
  display: flex;
  justfy-content: flex-start;
  column-gap: ${({ columnGap }) => columnGap ?? "unset"};

  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;
export const Left = styled.div`
  width: 45%;
  @media screen and (max-width: 800px) {
    width: 100%;
  }
`;
export const Right = styled.div`
  width: 55%;
  padding: 0 1.25rem;
  @media screen and (max-width: 800px) {
    width: 100%;
    padding: 0 0.625rem 0.9375rem 0.625rem;
  }
`;
export const ScanButton = styled.button`
  width: 30%;
  min-width: 6.25rem;
  margin: 0 0.9375rem;
  border: none;
  background: ${Colors.lightSecondaryColor};
  border-radius: 0.75rem;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 0.75rem;
  padding: 1rem 0;
  img {
    height: 0.9375rem;
  }
  p {
    margin-top: 3px;
  }
`;
export const CategoryNav = styled.div`
  display: flex;
  justify-content: space-between;
  height: 3.125rem;
  margin-top: 0.9375rem;
  align-items: center;

  p {
    color: #607087;
  }
  button {
    background: ${Colors.secondaryColor};
    box-shadow: 0px 4px 1.875rem 0px #8c9db514;
    padding: 0.625rem 0.9375rem;
    margin: 0 0.9375rem;
    border: none;
    border-radius: 0.75rem;
    img {
      height: 0.875rem;
    }
    cursor: pointer;
    span {
      color: #8c9db5;
    }
  }
`;
export const CategoryContainer = styled.div`
  display: flex;
  width: 100%;
  overflow-x: scroll;
`;
export const CategoryButton = styled.button`
  border-radius: 0.75rem;
  border: none;
  padding: 13px 1.5625rem;
  margin: 0 0.3125rem;
  cursor: pointer;
  box-shadow: 0px 4px 1.25rem 0px #8c9db51f;
  background: #fff;
  color: #8196b3;
`;
export const Item = styled.div`
  color: #607087;
  display: flex;
  background: #f6f8fb;
  width: 98%;
  height: 4.375rem;
  padding: 0.625rem 55px 0.625rem 0.9375rem;
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  overflow: hidden;
  margin: 0.625rem 0;
  cursor: pointer;
  button {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 3.125rem;
    right: 0;
    top: 0;
    border: none;
    background: ${Colors.lightSecondaryColor};
    :hover {
      background: rgba(129, 150, 179, 0.1);
    }
  }

  .overflow {
    white-space: wrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 350px;
    max-width: 350px;
  }
`;
export const TextBold = styled.div`
  color: #130f26;
  font-size: ${(props: { fontSize?: string }) => (props.fontSize ? props.fontSize : "")};
  font-weight: 600;
  span {
    color: #9ea8b7;
    font-weight: 400;
  }
`;
export const ItemCard = styled.div`
  background: #f6f8fb;
  border-radius: 1rem;
  margin: 0.625rem auto;
  display: flex;
  overflow: hidden;
  width: 98%;
  position: relative;
`;
export const NameWrapper = styled.div`
  display: flex;
  align-items: flex-start;
  width: 100%;

  div {
    font-size: 0.875rem;
    color: #607087;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    text-transform: capitalize;
    font-weight: 500;
    width: 25rem;
    max-width: 25rem;
  }
`;
export const ItemsContainer = styled.div<{ navBarHeight?: number }>`
  height: ${({ navBarHeight }) => `calc(78vh - ${navBarHeight! + 30}px)` || "100%"};
  max-height: ${({ navBarHeight }) => `calc(78vh - ${navBarHeight! + 10}px)` || "100%"};
  overflow-y: scroll;

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
export const Counter = styled.div`
  display: flex;
  align-items: center;
  column-gap: 3px;
  margin: 0.625rem 0 0.3125rem 0;
  button {
    height: 1.5rem;
    border-radius: 0.5rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: ${Colors.primaryColor};
    width: 2rem;
    cursor: pointer;
    img {
      transform: scale(0.8);
    }
    :hover {
      opacity: 0.8;
      transform: scale(1.05);
    }
  }
  input {
    background: transparent;
    color: #8196b3;
    outline: none;
    border: 1px solid #8196b3;
    border-radius: 0.5rem;
    padding: 0.625rem;
    text-align: center;
    font-size: 0.875rem;
    width: 4.375rem;
    height: 24px;
  }
`;
export const RowDropButton = styled.div`
  border: none;
  display: flex;
  background: rgba(129, 150, 179, 0.2);
  width: 3.125rem;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  right: 0;
  bottom: 0;
  top: 0;
  img {
    width: 1.875rem;
    transition: 0.3s linear;
  }
`;
export const TransparentBtn = styled.button`
  background: transparent;
  padding: 0.25rem 0.5rem;
  padding-right: 0.3125rem;
  border: none;
  display: flex;
  align-items: center;
  width: ${(props: { width?: string }) => props.width};
  cursor: pointer;
`;
export const CustomSelect = styled.select`
  background: #f4f6f9;
  border: 1px solid #8196b3;
  border-radius: 0.5rem;
  padding: 0.3125rem;
  color: #607087;
  font-weight: 500;
`;
export const RadioLabel = styled.label`
  cursor: pointer;
  font-size: 0.875rem;
  line-height: 1rem;
  color: #607087;
  span {
    display: inline-flex;
    height: 1rem;
    width: 1rem;
    border-radius: 50%;
    border: 1px solid #8196b3;
    align-items: center;
    justify-content: center;
    margin-right: 0.625rem;
    span {
      padding: 0;
      margin: 0;
      height: 0.75rem;
      width: 0.75rem;
      border-radius: 50%;
      background: ${(props: IRadioProps) => (props.isActive ? "#130F26" : "")};
      border: none;
    }
  }
`;

export const BatchItem = styled.div`
  display: flex;
  width: calc(100% - 10px);
  flex-direction: column;
  background: #fff;
  border: 1px solid #8196b3;
  border-radius: 12px;
  padding: 0.5em;
  color: #607087;
  margin-top: 1em;
  cursor: pointer;

  .top-row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .img {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #f6f8fb;
      border-radius: 8px;
      width: 30px;
      height: 30px;

      img {
        width: 10px;
      }
    }
  }
  .bottom-row {
    margin-top: 0.5em;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
