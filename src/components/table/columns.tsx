/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from "react-table";
import { format } from "date-fns";

export interface IColumn {
  item: string;
  image: string;
  price: string;
  qty: number;
  total: number;
  soldBy: string;
  date: string;
}

interface IValue {
  value: string;
}

export const COLUMNS: Column<IColumn>[] = [
  {
    Header: "Item",
    accessor: "item",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Qty",
    accessor: "qty",
  },
  {
    Header: "Total",
    accessor: "total",
  },
  {
    Header: "Sold By",
    accessor: "soldBy",
  },
  {
    Header: "Date",
    accessor: "date",
    Cell: ({ value }: IValue) => format(new Date(value), "MMM dd, yyyy") as any,
  },
];
