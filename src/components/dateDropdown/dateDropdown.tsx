import { FC, MouseEventHandler, useState } from "react";
import { Flex } from "../../GlobalStyles/CustomizableGlobal.style";
import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import { Colors } from "../../GlobalStyles/theme";
import { Button } from "../button/Button";
import { Container, Icon, Selected } from "../custom-dropdown/style";
import { ClippedText } from "../../pages/onlinePresence/style.onlinePresence";
import { Options, Overlay } from "./dateDropdown.style";
import ChevRight from "../../assets/chevRight.svg";
import "./datePicker.css";
import { IFilteredDate } from "../../pages/sales/sales";

interface DateItemProps {
  item: string;
  selected: boolean;
  handleClick: (s: string) => void;
}

const DateItem: FC<DateItemProps> = ({ item, selected, handleClick }) => {
  return (
    <>
      <Flex
        cursor="pointer"
        alignItems="center"
        style={{
          flexBasis: "50%",
          marginBottom: ".5rem",
          columnGap: ".5rem",
        }}
        onClick={() => handleClick(item)}
      >
        <div
          style={{
            width: ".9rem",
            height: ".9rem",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: selected ? "1px solid black" : `1px solid ${Colors.grey}`,
          }}
        >
          <div
            style={{
              background: selected ? "black" : "unset",
              width: ".6rem",
              height: ".6rem",
              borderRadius: "50%",
            }}
          ></div>
        </div>
        <p style={{ fontSize: "0.6rem", color: selected ? Colors.blackLight : Colors.grey }}>
          {item}
        </p>
      </Flex>
    </>
  );
};

interface DateDropdownProps {
  handleApply: Function;
  borderRadius?: string;
  fontWeight?: string;
  padding?: string;
  color?: string;
  icon: string;
  height: string;
  width: string;
  getDebtDate?: (date: Date, key: string) => void;
  dateRange: Record<string, Date> | IFilteredDate;
  dateOptions: string[];
  selectedDate: number;
  setSelectedDate: Function;
  getStartDate: Function;
  getEndDate: Function;
}

const DateDropdown: FC<DateDropdownProps> = ({
  handleApply,
  borderRadius,
  fontWeight,
  padding,
  color,
  icon,
  height,
  width,
  dateRange,
  getEndDate,
  getStartDate,
  dateOptions,
  selectedDate,
  setSelectedDate,
}) => {
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [dateChanged, setDateChanged] = useState<Record<string, boolean>>({
    startDate: false,
    endDate: false,
  });
  const [activeCal, setActiveCal] = useState("start");
  const d = new Date();

  const handleApplyFilter = () => {
    selectedDate === 8 && handleApply(8);
    setShowDropdown(!showDropdown);
  };

  const handleItemSelect = (filter: number) => {
    setSelectedDate(filter);
  };

  const handleChange = (date: Date, key: string) => {
    setDateChanged((prevData) => ({
      ...prevData,
      [key]: true,
    }));
  };

  const renderDatePickerHeader = ({
    date,
    decreaseMonth,
    increaseMonth,
  }: {
    date: Date;
    decreaseMonth: MouseEventHandler<HTMLDivElement>;
    increaseMonth: MouseEventHandler<HTMLDivElement>;
  }) => {
    return (
      <Flex
        style={{
          margin: 10,
          justifyContent: "space-between",
        }}
      >
        <div style={{ cursor: "pointer" }} onClick={decreaseMonth}>
          <img style={{ transform: "rotate(180deg)" }} src={ChevRight} alt="see all" width="7px" />
        </div>
        <Flex style={{ columnGap: ".4rem" }}>
          <p>{date.toLocaleString("default", { month: "long" })}</p>
          <p>{date.getFullYear()}</p>
        </Flex>
        <div style={{ cursor: "pointer" }} onClick={increaseMonth}>
          <img src={ChevRight} alt="see all" width="7px" />
        </div>
      </Flex>
    );
  };

  return (
    <Container padding="0 0" borderRadius={borderRadius} width={width} height={height}>
      <div
        style={{
          width: width,
          display: "flex",
          position: "relative",
          cursor: "pointer",
          alignItems: "center",
          fontWeight: fontWeight ?? "normal",
          whiteSpace: "nowrap",
          padding: padding,
          borderRadius: borderRadius,
        }}
        onClick={(e) => {
          e.preventDefault();
          setShowDropdown(!showDropdown);
        }}
      >
        {icon && (
          <Icon>
            <img src={icon} alt="" />
          </Icon>
        )}
        <Selected color={color}>
          <ClippedText style={{ fontSize: ".875rem" }} maxWidth={width} color={Colors.blackLight}>
            {dateOptions[selectedDate]}
          </ClippedText>
        </Selected>
      </div>
      {showDropdown && (
        <>
          <Overlay
            onClick={(e) => {
              e.preventDefault();
              setShowDropdown(false);
            }}
          />
          <Options
            style={{ minWidth: "15rem" }}
            boxShadow="0px 4px 1.875rem rgba(96, 112, 135, 0.2)"
            onClick={(e) => {
              e.preventDefault();
            }}
            maxOptionsHeight="fit-content"
            bgColor={Colors.white}
            width="fit-content"
            height={height}
          >
            <Flex
              direction="column"
              bg={Colors.white}
              boxShadow="2px red"
              height="fit-content"
              width={"100%"}
            >
              <Flex
                direction="column"
                height="fit-content"
                width="fit-content"
                padding=".3125rem .9375rem"
              >
                <h3 style={{ fontSize: ".8rem" }}>Date Filter</h3>
                <Flex style={{ flexWrap: "wrap", marginTop: "0.625rem" }}>
                  {dateOptions.map((item, i) => (
                    <DateItem
                      key={i}
                      item={item}
                      // item={dateOptions[i]}
                      selected={selectedDate === i}
                      handleClick={() => handleItemSelect(i)}
                    />
                  ))}
                </Flex>
              </Flex>
              {selectedDate === 8 ? (
                <div>
                  <Flex padding="0 0 .3125rem 0">
                    <Flex
                      onClick={() => setActiveCal("start")}
                      justifyContent="center"
                      cursor="pointer"
                      style={{
                        borderBottom:
                          activeCal === "start" ? `2px solid ${Colors.primaryColor}` : "unset",
                        color: activeCal === "start" ? Colors.primaryColor : Colors.grey,
                        flexBasis: "50%",
                        // marginBottom: "1rem",
                        columnGap: ".5rem",
                      }}
                    >
                      {dateChanged.startDate ? dateRange.from.toLocaleDateString() : "Start date"}
                    </Flex>
                    <Flex
                      onClick={() => setActiveCal("end")}
                      justifyContent="center"
                      cursor="pointer"
                      style={{
                        borderBottom:
                          activeCal === "end" ? `2px solid ${Colors.primaryColor}` : "unset",
                        color: activeCal === "end" ? Colors.primaryColor : Colors.grey,
                        flexBasis: "50%",
                        // marginBottom: "1rem",
                        columnGap: ".5rem",
                      }}
                    >
                      {dateChanged.endDate ? dateRange.to.toLocaleDateString() : "To date"}
                    </Flex>
                  </Flex>
                  <div>
                    {activeCal === "start" && (
                      <DatePicker
                        selected={dateRange.from}
                        onChange={(date: Date) => {
                          handleChange(date, "startDate");
                          getStartDate(date);
                        }}
                        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) =>
                          renderDatePickerHeader({ date, decreaseMonth, increaseMonth })
                        }
                        placeholderText={`${
                          d.getUTCMonth() + 1
                        }/ ${d.getDate()}/${d.getFullYear()}`}
                        customInput={<p style={{}}>kdawd</p>}
                        open
                        inline
                      />
                    )}
                    {activeCal === "end" && (
                      <DatePicker
                        selected={dateRange.to}
                        onChange={(date: Date) => {
                          handleChange(date, "endDate");
                          getEndDate(date);
                        }}
                        renderCustomHeader={({ date, decreaseMonth, increaseMonth }) =>
                          renderDatePickerHeader({ date, decreaseMonth, increaseMonth })
                        }
                        placeholderText={`${
                          d.getUTCMonth() + 1
                        }/ ${d.getDate()}/${d.getFullYear()}`}
                        customInput={<p style={{ display: "none", marginTop: "-4rem" }}></p>}
                        open
                        inline
                      />
                    )}
                  </div>
                </div>
              ) : null}
            </Flex>
            <Button
              onClick={handleApplyFilter}
              margin="1.25rem auto"
              color={Colors.white}
              width="90%"
              height="2rem"
              borderRadius=".375rem"
              backgroundColor={Colors.primaryColor}
              label="Apply Filter"
            />
          </Options>
        </>
      )}
    </Container>
  );
};

export default DateDropdown;
