import React from "react";
import { CheckBox, CheckButton, Flex, Span, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import cancelIcon from "../../../assets/cancel.svg";
import { CancelButton } from "../style";
import { Colors } from "../../../GlobalStyles/theme";
import User from "../../../assets/customer2.svg";
import Idea from "../../../assets/idea.svg";
import Change from "../../../assets/change.svg";
import { InputWrapper } from "../../inventory/style";
import { InputField } from "../../../components/input-field/input";
import { validateInputNum } from "../../../utils/formatValues";
import CustomDate from "../../../components/date-picker/customDatePicker";
import { Button } from "../../../components/button/Button";
import { ICustomer } from "../../../interfaces/inventory.interface";
import { getSingleCustomerAmount } from "../../../helper/customerTransactions.helper";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { useAppDispatch } from "../../../app/hooks";

interface ICredit {
  setShowNewCredit: (value: boolean) => void;
  setShowSelectCustomer: (value: boolean) => void;
  customerSelected?: ICustomer;
  depositAmount: string;
  setDepositAmount: (value: string) => void;
  saveNewCredit: () => void;
  getTotal: () => number;
  setDueDate: (value: Date) => void;
  dueDate: Date;
  paymentMethodOption: string[];
  handleCreditPaymentMethod: (value: number) => void;
  creditPaymentIdx: number;
}

const Credit: React.FC<ICredit> = ({
  setShowNewCredit,
  setShowSelectCustomer,
  customerSelected,
  depositAmount,
  setDepositAmount,
  saveNewCredit,
  getTotal,
  dueDate,
  setDueDate,
  paymentMethodOption,
  handleCreditPaymentMethod,
  creditPaymentIdx,
}) => {
  const dispatch = useAppDispatch();
  const totalAmount = getSingleCustomerAmount(customerSelected, "credit");

  const addCredit = () => {
    if (
      customerSelected?.creditLimit &&
      (getTotal() - Number(depositAmount)) + Number(totalAmount) > Number(customerSelected?.creditLimit)
    ) {
      dispatch(
        toggleSnackbarOpen({ message: "Amount is higher than Credit Limit", color: "DANGER" })
      );
    } else {
      saveNewCredit();
    };
  };

  return (
    <Flex bg="white" borderRadius="1rem" direction="column" padding="1rem" width="25rem">
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        <Span color={Colors.primaryColor} fontSize="1.4rem" fontWeight="600">
          Sell On Credit
        </Span>
        <CancelButton
          onClick={() => {
            setShowNewCredit(false);
          }}
        >
          <img src={cancelIcon} alt="" />
        </CancelButton>
      </Flex>

      <Flex
        borderRadius="0.6rem"
        bg={Colors.primaryColor}
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        padding="0.5rem"
        margin="1rem 0"
      >
        <Flex alignItems="center" justifyContent="flex-start" gap="0.5rem">
          <img src={User} alt="" style={{ width: "40px" }} />
          <Flex
            alignItems="flex-start"
            justifyContent="space-between"
            gap="0.5rem"
            direction="column"
          >
            <Span color={Colors.white}>{customerSelected?.customerName}</Span>
            <Span color={Colors.white}>{customerSelected?.phoneNumber}</Span>
          </Flex>
        </Flex>
        <Span
          onClick={() => {
            setShowNewCredit(false);
            setShowSelectCustomer(true);
          }}
          cursor="pointer"
          color={Colors.secondaryColor}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <img src={Change} alt="" />
          Change customer
        </Span>
      </Flex>
      <Flex width="100%" alignItems="center" justifyContent="space-between" gap="1rem">
        <Flex width="50%" alignItems="flex-start" justifyContent="space-between" direction="column">
          <Span color={Colors.blackLight}>Total Amount</Span>
          <InputWrapper style={{ margin: "0.5rem 0 0 0 " }}>
            <InputField
              style={{ margin: "0" }}
              type="text"
              placeholder="Total Amount"
              backgroundColor="#F4F6F9"
              color="#353e49"
              borderColor="#8196B3"
              borderRadius="12px"
              borderSize="1px"
              border
              padding="0 0.7rem"
              fontSize="16px"
              width="100%"
              value={getTotal()}
            />
          </InputWrapper>
        </Flex>

        <Flex width="50%" alignItems="flex-start" justifyContent="space-between" direction="column">
          <Span color={Colors.blackLight}>Due Date</Span>
          <InputWrapper style={{ margin: "0.7rem 0 0 0" }}>
            <CustomDate
              height="2.5rem"
              startDate={dueDate}
              setStartDate={setDueDate}
              border="none"
              marginTop="0"
            />
          </InputWrapper>
        </Flex>
      </Flex>

      <Flex
        width="100%"
        alignItems="flex-start"
        justifyContent="space-between"
        direction="column"
        margin="1.5rem 0 0 0 "
      >
        <Span color={Colors.blackLight}>Deposit Amount(Optional)</Span>
        <InputWrapper style={{ margin: "0.5rem 0 0 0 " }}>
          <InputField
            style={{ margin: "0" }}
            type="text"
            placeholder="Deposit Amount"
            backgroundColor="#F4F6F9"
            color="#353e49"
            borderColor="#8196B3"
            borderRadius="12px"
            borderSize="1px"
            border
            padding="0 0.7rem"
            fontSize="16px"
            width="100%"
            value={depositAmount}
            onChange={(e) => validateInputNum(setDepositAmount, e.target.value)}
          />
        </InputWrapper>
      </Flex>
      {(getTotal() - Number(depositAmount)) + Number(totalAmount) > Number(customerSelected?.creditLimit) && (
        <Flex
          alignItems="center"
          gap="0.6rem"
          width="100%"
          borderRadius="0.7rem"
          padding="0.5rem"
          margin="0"
        >
          <Text color="#F65151" style={{ fontStyle: "italic", fontSize: "0.75rem" }}>
            <b>Warning:</b> amount is higher than customer credit Limit
          </Text>
        </Flex>
      )}
      <Flex alignItems="center" justifyContent="flex-start" margin="1rem 0 0 0" gap="1rem">
        {paymentMethodOption.slice(0, 3).map((entry, idx) => {
          return (
            <CheckButton
              key={entry}
              height="2.5rem"
              borderRadius="0.625rem"
              padding="0 0.625rem"
              width="30%"
              fontSize="0.6rem"
              disabled={Number(depositAmount) <= 0}
              alignItems="center"
              justifyContents="flex-start"
              border="none"
              color={paymentMethodOption[creditPaymentIdx] === entry ? Colors.green : "#9EA8B7"}
              backgroundColor={
                paymentMethodOption[creditPaymentIdx] === entry ? Colors.lightGreen : Colors.tabBg
              }
              onClick={() => {
                handleCreditPaymentMethod(idx);
              }}
            >
              <CheckBox
                radius="50%"
                margin="0 0.3rem 0 0 "
                color={Colors.green}
                htmlFor={entry}
                checked={entry === paymentMethodOption[creditPaymentIdx]}
              >
                <span></span>
              </CheckBox>
              <input type="checkbox" id={entry} hidden />
              <p id="name" style={{ fontSize: "0.9rem" }}>
                {entry}
              </p>
            </CheckButton>
          );
        })}
      </Flex>
      <Flex
        alignItems="center"
        gap="0.6rem"
        border={`1px solid ${Colors.blackLight}`}
        width="100%"
        borderRadius="0.7rem"
        padding="0.5rem"
        margin="1rem 0 0 0"
      >
        <img src={Idea} alt="" />
        <Span color={Colors.blackLight} fontSize="0.7rem">
          <Span color={Colors.primaryColor} fontWeight="600">
            NOTE:
          </Span>{" "}
          Only include a deposit amount if the consumer is making a deposit towards this credit
          transaction at the moment.
        </Span>
      </Flex>

      <Button
        label={"Save"}
        onClick={addCredit}
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
  );
};

export default Credit;
