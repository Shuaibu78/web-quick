import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Label } from "recharts";
import { IExpenditure } from "../../interfaces/expenses.interface";
import { ISales } from "../../interfaces/sales.interface";
import { LineChartContainer } from "./style";
import { Colors } from "../../GlobalStyles/theme";
import { isFigorr } from "../../utils/constants";

const LineChart = ({
  recentSales,
  expenditures,
}: {
  recentSales?: ISales[];
  expenditures?: IExpenditure[];
}) => {
  const formatSales = (list: ISales[]): any => {
    let listCopy: any = [...list];
    listCopy = listCopy.map((val: any, i: number) => {
      return {
        ...val,
        // amount: val.amount * val.quantity,
        date: new Date(val.createdAt).toDateString(),
      };
    });
    expenditures?.forEach((exp, i) => {
      if (listCopy[i]) {
        listCopy[i] = { ...listCopy[i], expenses: exp.amount };
      } else {
        listCopy[i] = {
          expenses: exp.amount,
          date: new Date(exp.createdAt ?? "1").toDateString(),
          amount: exp.amount,
        };
      }
    });
    return listCopy.slice(0, 10);
  };

  // const maxValue = Math.max(formatSales(recentSales!).map((item) => item.amount));
  // const yAxisDomain = [0, maxValue * 1.1];
  return (
    <LineChartContainer>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={recentSales && formatSales(recentSales)}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="amount"
            stroke={Colors.primaryColor}
            strokeWidth="2px"
            fillOpacity={1}
            fill="#00000000"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="red"
            strokeWidth="2px"
            fillOpacity={1}
            fill="#00000000"
          />
        </AreaChart>
      </ResponsiveContainer>
    </LineChartContainer>
  );
};

export default LineChart;
