import styled from "styled-components";
interface TableProps {
  width?: string;
  fontSize?: string;
  background?: string;
  maxWidth?: string;
  minWidth?: string;
  imgHeight?: string;
}
export const Table = styled.div`
  margin: 1.25rem auto 0;
  max-width: ${(props: TableProps) => props.maxWidth};
  overflow-x: scroll;
`;
export const THead = styled.div`
  display: flex;
  color: #60708796;
  font-size: ${(props: TableProps) => props.fontSize};
`;
export const Td = styled.div`
  width: ${(props: TableProps) => props.width};
  min-width: ${(props: TableProps) => props.width};
  span {
    width: 100%;
  }
`;
export const TBody = styled.div`
  margin-top: 0.625rem;
`;
export const TRow = styled.div`
  color: #607087;
  display: flex;
  height: 3.75rem;
  border-radius: 1rem;
  align-items: center;
  min-width: ${(props: TableProps) => (props.minWidth ? props.minWidth : "55.625rem")};
  width: 100%;
  cursor: pointer;
  background: ${(props: TableProps) => props.background};
  :hover {
    background: #dde2e9;
  }
`;
export const TControls = styled.div`
  display: flex;
  justify-content: space-between;
  h3 {
    color: #607087;
    font-size: 1.125rem;
  }
`;
export const TBtnCont = styled.div`
  display: flex;
  align-items: center;
  button {
    width: 45px;
    height: 45px;
    border: none;
    border-radius: 0.75rem;
    margin: 0 0.3125rem;
    cursor: pointer;
  }
  button:nth-child(1) {
    background: #f4f6f9;
  }
  button:nth-child(2) {
    background: #ffbe62;
  }
`;

export const CustomCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: ${(props: TableProps) => props.background};
  border-radius: 0.625rem;
  margin: 0 auto;
  img {
    height: ${(props: TableProps) => props.imgHeight};
  }
`;
export const Left = styled.div`
  width: 50%;
  height: 70vh;
`;
export const Right = styled.div`
  width: 50%;
  padding-left: 1.875rem;
  padding-right: 6.25rem;
  height: 70vh;
  position: relative;
`;
export const CurrentPage = styled.div`
  display: flex;
  align-items: center;
  p {
    font-size: 0.875rem;
  }
  button {
    padding: 0.625rem 0.9375rem;
    margin: 0.625rem;
    box-shadow: 0px 4px 1.875rem rgba(140, 157, 181, 0.08);
    border-radius: 0.75rem;
    border: none;
    background: #ffbe62;
    cursor: pointer;
  }
  span {
    font-weight: bold;
  }
`;
export const PerPage = styled.div`
  display: flex;
  align-items: center;
  p {
    font-size: 0.875rem;
    color: #8196b3;
    margin-right: 0.625rem;
  }
`;
export const JumpTo = styled.div`
  display: flex;
  align-items: center;
  p {
    color: #8196b3;
    font-size: 0.875rem;
    margin-right: 0.625rem;
  }
  div {
    display: flex;
    background: #f4f6f9;
    border-radius: 0.75rem;
    overflow: hidden;
    input {
      border: none;
      background: transparent;
      width: 4.375rem;
      color: #8196b3;
      padding: 0 0.625rem;
    }
    button {
      background: #8196b3;
      padding: 0.625rem 0.9375rem;
      border: none;
      box-shadow: 0px 4px 1.875rem rgba(140, 157, 181, 0.08);
      border-radius: 0.75rem;
      cursor: pointer;
    }
  }
`;
export const FilterModal = styled.div`
  position: absolute;
  top: 2rem;
  right: 1.25rem;
  height: 80vh;
  width: 18.75rem;
  background: #fff;
  box-shadow: 0px 4px 1.875rem rgba(140, 157, 181, 0.06);
  border-radius: 1.25rem;
  padding: 1.25rem;
  h3 {
    color: #607087;
  }
  h4 {
    font-size: 0.875rem;
    color: #607087;
    padding: 0.625rem 0 0.3125rem 0;
  }
  button {
    cursor: pointer;
    background: transparent;
    border: none;
  }
`;

export const MenuBar = styled.div`
  margin-top: 1.875rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: 800px) {
    flex-direction: column;
  }
`;
export const Title = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #607087;
`;

export const TableContainer = styled.div`
  margin-top: 1.25rem;
  width: calc(100% - 1.25rem);
  min-width: calc(100% - 1.25rem);
  margin-right: 1.25rem;
  background: #ffffff;
  box-shadow: 0px 4px 1.875rem rgba(140, 157, 181, 0.06);
  border-radius: 1.25rem;
  padding: 1.25rem;
  h3 {
    font-size: 1.125rem;
    color: #607087;
  }
  p {
    font-size: 0.875rem;
    color: #8196b3;
  }
  img {
    margin: 0.875rem 0;
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

  h3 {
    color: rgba(96, 112, 135, 1);
  }
  p {
    color: rgba(129, 150, 179, 1);
  }
`;

export const ListItem = styled.div`
  display: flex;
  margin: 13px 0;
  p {
    padding-left: 0.625rem;
    font-size: 0.875rem;
    span {
      padding-left: 0.625rem;
      color: #607087;
      opacity: 0.6;
    }
  }
`;
