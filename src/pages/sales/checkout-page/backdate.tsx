import React, { Dispatch, SetStateAction, useState } from "react";
import { Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import cancelIcon from "../../../assets/cancel.svg";
import { CancelButton } from "../style";
import { Colors } from "../../../GlobalStyles/theme";
import { InputWrapper } from "../../inventory/style";
import CustomDate from "../../../components/date-picker/customDatePicker";
import { Button } from "../../../components/button/Button";
import moment from "moment";
import CustomTime from "../../../components/time-picker/customTimePicker";

interface IBackdate {
  setShowBackdate?: (value: boolean) => void;
  setBackDate: Dispatch<SetStateAction<Date | undefined>>;
  backDate?: Date;
}

const BackDate: React.FC<IBackdate> = ({ setShowBackdate, setBackDate }) => {
  const currentTime = moment().format("HH:mm:ss");

  const [time, setTime] = useState(currentTime);
  const [date, setDate] = useState<Date>(new Date());

  const tempDate = moment(date);

  const handleSave = () => {
    const combinedDateTime = tempDate
      .set({
        hour: Number(time.split(":")[0]),
        minute: Number(time.split(":")[1]),
        second: Number(time.split(":")[2]),
      })
      .toISOString();

    setBackDate?.(new Date(combinedDateTime));
    setShowBackdate?.(false);
  };

  return (
    <Flex bg="white" borderRadius="1rem" direction="column" padding="1rem" width="25rem">
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        <Span color={Colors.primaryColor} fontSize="1.4rem" fontWeight="600">
          Backdate Sale
        </Span>
        <CancelButton
          onClick={() => {
            setShowBackdate?.(false);
          }}
        >
          <img src={cancelIcon} alt="" />
        </CancelButton>
      </Flex>

      <Flex
        borderRadius="0.6rem"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        direction="column"
        padding="0.5rem"
        margin="1rem 0"
      >
        <Flex width="100%" alignItems="center" justifyContent="space-between" gap="1rem">
          <Flex
            width="50%"
            alignItems="flex-start"
            justifyContent="space-between"
            direction="column"
          >
            <Span color={Colors.blackLight}>Date</Span>
            <InputWrapper style={{ margin: "0.7rem 0 0 0" }}>
              <CustomDate
                height="2.5rem"
                startDate={date}
                setStartDate={setDate}
                border="none"
                marginTop="0"
              />
            </InputWrapper>
          </Flex>
          <Flex
            width="50%"
            alignItems="flex-start"
            justifyContent="space-between"
            direction="column"
          >
            <Span color={Colors.blackLight}>Time</Span>
            <CustomTime {...{ time, setTime }} />
          </Flex>
        </Flex>

        <Button
          label="Save"
          onClick={handleSave}
          backgroundColor={Colors.primaryColor}
          size="lg"
          fontSize="1rem"
          borderRadius="0.9rem"
          width="100%"
          color="#fff"
          margin="2rem 0 0 0"
          borderColor="transparent"
          borderSize="0px"
        />
      </Flex>
    </Flex>
  );
};

export default BackDate;
