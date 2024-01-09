import React, { FunctionComponent, useState } from "react";
import { Button } from "../../../components/button/Button";
import { InputField } from "../../../components/input-field/input";
import cancelIcon from "../../../assets/cancel.svg";
import { ModalBox } from "../../settings/style";
import { CustomText } from "../../staffs/style";
import { Flex } from "../../../components/receipt/style";
import { InputWithIcon } from "./style";
import clockIcon from "../../../assets/time.svg";
import calendarIcon from "../../../assets/Calendar.svg";
import { TextArea } from "../../sales/style";

interface IProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ReturnAmount: FunctionComponent<IProps> = ({ setShowModal }) => {
  const [deposit, setDeposit] = useState("");
  return (
    <ModalBox>
      <h3 style={{ marginBottom: "0.9375rem" }}>
        <button onClick={() => setShowModal(false)}>
          <img src={cancelIcon} alt="" />
        </button>
        <span>Return Amount</span>
      </h3>
      <CustomText fontSize="0.875rem" style={{ marginBottom: "0.625rem" }}>
        <span style={{ paddingRight: "0" }}>Adebayo</span> is taking?
      </CustomText>
      <InputField
        placeholder="How much is Adebayo taking?"
        type="text"
        onChange={(e) => {
          setDeposit(e.target.value);
        }}
        backgroundColor="#F4F6F9"
        size="lg"
        color="#607087"
        borderColor="transparent"
        borderRadius="0.75rem"
        borderSize="0px"
        fontSize="1rem"
        width="100%"
        value={deposit}
      />
      <Flex justifyContent="space-between">
        <InputWithIcon>
          <label htmlFor="date">
            <img src={calendarIcon} alt="" />
          </label>
          <input type="date" id="date" />
        </InputWithIcon>
        <InputWithIcon>
          <label htmlFor="time">
            <img src={clockIcon} alt="" />
          </label>
          <input type="text" id="time" placeholder="12:00 PM" />
        </InputWithIcon>
      </Flex>
      <TextArea placeholder="Remark (Optional)" style={{ marginTop: "0.9375rem" }} />
      <div style={{ marginBottom: "1.25rem" }}></div>
      <Button
        label="Save"
        onClick={() => setShowModal(false)}
        backgroundColor="#FFBE62"
        size="lg"
        color="#fff"
        borderColor="transparent"
        borderRadius="0.75rem"
        borderSize="0px"
        fontSize="1rem"
        width="100%"
      />
      <div style={{ marginBottom: "1.25rem" }}></div>
    </ModalBox>
  );
};

export default ReturnAmount;
