import { FunctionComponent, useState } from "react";
import { ModalBox } from "../../settings/style";
import { InputWithIcon } from "../../customers/add-transaction/style";
import CalendarGrey from "../../../assets/invoice-calendar-grey.svg";
import CalendarRed from "../../../assets/invoice-calendar-red.svg";
import { Colors } from "../../../GlobalStyles/theme";
import cancelIcon from "../../../assets/cancel.svg";
import { Flex, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Button } from "../../../components/button/Button";
import { GreenTick, PlainTick, WhiteTick } from "../icons";

interface IProps {
  label: string;
  type: "due-date" | "invoice-date";
  handleChange: (type: "due-date" | "invoice-date", date: string) => void;
  close: () => void;
};

const SelectInvoiceDate: FunctionComponent<IProps> = ({ label, type, close, handleChange }) => {
  const [date, setDate] = useState<string>();
  const [allowReminder, setAllowReminder] = useState<boolean>(false);
  const handleSubmit = () => {
    handleChange(type, date || "");
    close();
  };

  return (
    <ModalBox width="35%">
      <h3
        style={{
          marginBottom: "10px",
          justifyContent: "space-between",
          alignItems: "center",
          display: "flex",
          color: Colors.primaryColor,
        }}
      >
        <span>{label}</span>
        <button
          onClick={close}
          style={{ background: "transparent", border: "1px solid black" }}
        >
          <img src={cancelIcon} alt="" />
        </button>
      </h3>
      <div>
        <InputWithIcon width="100%" style={{ height: "3.5rem", position: "relative" }}>
          <label htmlFor="date" style={{ display: "flex", alignItems: "center", margin: "0 0.5rem" }}>
            <img src={type === "due-date" ? CalendarRed : CalendarGrey} />
          </label>
          <input type="date" id="date" name="date" onChange={(e) => setDate(e.target.value)} />
        </InputWithIcon>

        {type === "due-date" &&
          <Flex alignItems="center" gap="0.75rem">
            <Flex
              onClick={() => setAllowReminder(!allowReminder)}
              width="20px"
              height="20px"
              cursor="pointer"
              borderRadius="5px"
              alignItems="center"
              justifyContent="center"
              border={`1px solid ${allowReminder ? Colors.secondaryColor : Colors.grey}`}
              bg={allowReminder ? Colors.secondaryColor : "transparent"}
            >
              <PlainTick />
            </Flex>
            <div style={{ margin: "1rem 0" }}>
              <Flex fontSize="0.654rem">
                <label style={{ color: Colors.blackishBlue, fontWeight: "500", margin: "0" }}>Set Customer Reminder</label>
              </Flex>
              <Text color={Colors.blackLight} fontSize="0.652rem" margin="0">
                Timart will send a reminder one day before and on the due date.
              </Text>
            </div>
          </Flex>
        }
      </div>

      <Button
        label={"Done"}
        onClick={() => handleSubmit()}
        backgroundColor={Colors.primaryColor}
        size="lg"
        color="#fff"
        borderColor="transparent"
        borderRadius="0.75rem"
        borderSize="0px"
        fontSize="1rem"
        width="100%"
        margin="2rem 0 0 0 "
      />
    </ModalBox>
  );
};

export default SelectInvoiceDate;
