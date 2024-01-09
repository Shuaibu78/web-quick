import React, { FunctionComponent, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateContainer } from "./style";

const DatePickerComponent = () => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  return (
    <DateContainer>
      <DatePicker
        selected={startDate}
        onChange={(date: Date) => setStartDate(date)}
        placeholderText="This Week"
        wrapperClassName="date-picker"
        dropdownMode="select"
      />
    </DateContainer>
  );
};

export default DatePickerComponent;
