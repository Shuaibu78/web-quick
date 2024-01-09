import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CustomDateContainer } from "./style";
import calender from "../../assets/calender.svg";
import { Flex } from "../../GlobalStyles/CustomizableGlobal.style";
interface ICustomDate {
  height?: string;
  width?: string;
  padding?: string;
  margin?: string;
  setStartDate?: Function;
  startDate?: Date;
  background?: string;
  border?: string;
  label?: string;
  dateFormat?: string;
  timeFormat?: string;
  timeInputLabel?: string;
  showTimeInput?: boolean;
  isClearable?: boolean;
  timeIntervals?: number;
  marginTop?: string;
  icon?: string;
}
const CustomDate: React.FC<ICustomDate> = ({
  height,
  width,
  startDate,
  setStartDate,
  background,
  border,
  label,
  margin,
  padding,
  dateFormat,
  showTimeInput,
  isClearable,
  timeIntervals,
  timeFormat,
  timeInputLabel,
  marginTop,
  icon,
}) => {
  const d = new Date();

  return (
    <CustomDateContainer
      margin={margin}
      padding={padding}
      background={background}
      marginTop={marginTop}
      border={border}
      height={height}
      width={width}
    >
      {label && <label>{label}</label>}
      <Flex width="100%">
        <img src={icon ?? calender} alt="" />
        <DatePicker
          dateFormat={dateFormat}
          timeFormat={timeFormat}
          timeInputLabel={timeInputLabel}
          showTimeInput={showTimeInput}
          isClearable={isClearable}
          selected={startDate}
          timeIntervals={timeIntervals}
          onChange={(date: Date) => setStartDate!(date)}
          placeholderText={`${d.getUTCMonth() + 1}/ ${d.getDate()}/${d.getFullYear()}`}
          wrapperClassName="date-picker"
          dropdownMode="select"
        />
      </Flex>
    </CustomDateContainer>
  );
};

export default CustomDate;
