import styled from "styled-components";
interface ITableProps {
  containerWidth?: string;
  justify?: string;
  align?: string;
  direction?: string;
}

export const TableTitle = styled.h4`
  color: #607087;
  font-weight: 600;
  font-size: 1.125rem;
`;

export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;

  @media only screen and (max-width: 760px),
    (min-device-width: 768px) and (max-device-width: 1024px) {
    thead tr {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }

    tr {
      border: 1px solid #ccc;
    }

    td {
      /* Behave  like a "row" */
      border: none;
      border-bottom: 1px solid #eee;
      position: relative;
      padding-left: 50%;
    }

    td:before {
      /* Now like a table header */
      position: absolute;
      /* Top/left values mimic padding */
      top: 6px;
      left: 6px;
      width: 45%;
      padding-right: 0.625rem;
      white-space: nowrap;
    }

    td:nth-of-type(1):before {
      content: "Item";
    }
    td:nth-of-type(2):before {
      content: "Price";
    }
    td:nth-of-type(3):before {
      content: "Qty";
    }
    td:nth-of-type(4):before {
      content: "Total";
    }
    td:nth-of-type(5):before {
      content: "Sold By";
    }
    td:nth-of-type(6):before {
      content: "Date";
    }
  }
`;

export const Td = styled.td`
  color: #607087;
  font-size: 1rem;
  padding: 0.5rem;
  text-align: left;

  @media only screen and (max-width: 760px),
    (min-device-width: 768px) and (max-device-width: 1024px) {
    height: auto;
  }
`;

export const Th = styled.th`
  font-size: 0.875rem;
  padding-inline: 0.5rem;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  text-align: left;
  color: #607087;
`;

export const Tr = styled.tr`
  height: 58px;

  @media only screen and (max-width: 760px),
    (min-device-width: 768px) and (max-device-width: 1024px) {
    height: auto;
    margin-bottom: 0.625rem;
  }

  &:nth-child(even) {
    background-color: #f6f8fb;
    border-radius: 0.625rem;
  }
  &:hover {
    background-color: #f8f9fd;
  }
`;

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media only screen and (max-width: 760px),
    (min-device-width: 768px) and (max-device-width: 1024px) {
    table,
    thead,
    tbody,
    th,
    td,
    tr {
      display: block;
    }
  }
`;

export const Box = styled.div`
  display: flex;
  flex-direction: ${(props: ITableProps) => props.direction || "row"};
  justify-content: ${(props: ITableProps) => props.justify || "center"};
  align-items: ${(props: ITableProps) => props.align || "center"};
  width: ${(props: ITableProps) => props.containerWidth || "100%"};
`;
