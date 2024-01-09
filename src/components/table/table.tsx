import React, { FunctionComponent } from "react";
import { useTable, usePagination, useSortBy } from "react-table";
import DatePickerComponent from "../date-picker/date-picker";
import SearchInput from "../search-input/search-input";
import { Table as MainTable, Td, Th, Tr, Container, Box, TableTitle } from "./style";

interface ITableProps {
  containerWidth?: string;
  justify?: string;
  align?: string;
  direction?: string;
  data: any[];
  columns: any[];
}

const Table: FunctionComponent<ITableProps> = ({
  containerWidth,
  justify,
  align,
  direction,
  data,
  columns,
}) => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    usePagination
  );
  return (
    <Container>
      <Box justify="space-between">
        <Box containerWidth="20%" justify="space-between">
          <TableTitle>Recent Sales</TableTitle>
          <DatePickerComponent />
        </Box>
        <Box justify="flex-end" containerWidth="80%">
          <SearchInput
            placeholder="Search"
            borderRadius="0.5rem"
            height="44px"
            width="30%"
            fontSize="0.875rem"
            handleSearch={function (search: string): void {
              throw new Error("Function not implemented.");
            }}
          />
        </Box>
      </Box>
      <MainTable {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.getHeaderGroupProps().key}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps()} key={column.id}>
                  {column.render("Header")}
                </Th>
              ))}
            </Tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <Td {...cell.getCellProps()} key={cell.column.id}>
                    {cell.render("Cell")}
                  </Td>
                ))}
              </Tr>
            );
          })}
        </tbody>
      </MainTable>
    </Container>
  );
};

export default Table;
