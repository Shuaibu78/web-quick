import React, { useEffect, useState } from "react";
import { CheckBox, CheckButton, Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import cancelIcon from "../../../assets/cancel.svg";
import { CancelButton } from "../style";
import { Colors } from "../../../GlobalStyles/theme";
import { formatAmountIntl } from "../../../helper/format";
import { InputWrapper } from "../../inventory/style";
import { InputField } from "../../../components/input-field/input";
import { IPaymentMethod } from "./checkout";
import { Button } from "../../../components/button/Button";

interface IMultiplePayment {
  getTotal: () => number;
  setShowMultiplePayment: (val: boolean) => void;
  paymentMethodOption: string[];
  setPaymentsArr: (val: IPaymentMethod[]) => void;
}

const MultiplePayment: React.FC<IMultiplePayment> = ({
  getTotal,
  setShowMultiplePayment,
  paymentMethodOption,
  setPaymentsArr,
}) => {
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
  const [isDone, setIsDone] = useState<boolean>(false);

  const getAvailablePaymentMethod = () => {
    return (
      paymentMethodOption.find(
        (method) => !paymentMethods.find(({ paymentMethod }) => paymentMethod === method)
      ) || paymentMethodOption[0]
    );
  };

  const handleAddField = () => {
    if (paymentMethods.length < paymentMethodOption.length - 1) {
      const methods = [...paymentMethods];
      methods.push({
        paymentMethod: getAvailablePaymentMethod(),
        amount: "",
      });

      setPaymentMethods(methods);
    }
  };

  const handleRemoveField = () => {
    if (paymentMethods.length > 1) {
      const methods = [...paymentMethods];
      methods.pop();

      setPaymentMethods(methods);
    }
  };

  useEffect(() => {
    const totalAmount = paymentMethods.reduce((sum, payment) => {
      return sum + Number(payment.amount);
    }, 0);

    setIsDone(totalAmount === getTotal());
  }, [paymentMethods]);

  const handleInputChange = (index: number, type: string, value: string | number) => {
    setPaymentMethods((prevMethods) => {
      const methods = [...prevMethods];
      methods[index] = { ...methods[index], [type]: value };
      return methods;
    });
  };

  const handleClose = () => {
    setShowMultiplePayment(false);
  };

  const handleDone = () => {
    setPaymentsArr(paymentMethods);
    setShowMultiplePayment(false);
  };

  useEffect(() => {
    handleAddField();
  }, []);

  return (
    <Flex
      bg="white"
      borderRadius="1rem"
      direction="column"
      padding="1rem"
      width="25rem"
      maxHeight="90vh"
      overflowY="hidden"
    >
      <Flex alignItems="flex-start" justifyContent="space-between" width="100%" direction="column">
        <Flex width="100%" justifyContent="space-between">
          <Span color={Colors.primaryColor} fontSize="1.4rem" fontWeight="600">
            Sale of {`(${formatAmountIntl(undefined, getTotal())})`}
          </Span>
          <CancelButton onClick={handleClose}>
            <img src={cancelIcon} alt="" />
          </CancelButton>
        </Flex>
        {!isDone ? <Span color={Colors.offRed}>Total amount should equal sales amount</Span> : null}
      </Flex>
      <Flex
        width="100%"
        maxHeight="100%"
        overflowY="scroll"
        direction="column"
        padding="0 0.5rem 0 0"
      >
        <>
          <Flex width="100%" direction="column" gap="1.5rem" margin="1rem 0 0 0">
            {paymentMethods.map(({ amount, paymentMethod }, index) => {
              return (
                <Flex
                  key={index}
                  direction="column"
                  width="100%"
                  padding="0 0 1.5rem 0"
                  style={{ borderBottom: "1px solid #f5f5f5" }}
                >
                  <Flex
                    width="100%"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    direction="column"
                  >
                    <Span color={Colors.grey} margin="0 0 1rem 0">
                      <i> Payment {index + 1}</i>
                    </Span>
                    <Span color={Colors.blackLight}>Amount Paid</Span>
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
                        noFormat
                        padding="0 0.7rem"
                        fontSize="16px"
                        width="100%"
                        onChange={(e) => handleInputChange(index, "amount", Number(e.target.value))}
                        value={amount}
                      />
                    </InputWrapper>
                  </Flex>
                  <Flex
                    alignItems="center"
                    justifyContent="flex-start"
                    margin="0.5rem 0 0 0"
                    gap="1rem"
                  >
                    {paymentMethodOption.slice(0, 3).map((method) => {
                      const isSelected = paymentMethod === method;
                      const disabled = Boolean(
                        paymentMethods.find((x) => x.paymentMethod === method)
                      );
                      return (
                        <CheckButton
                          disabled={disabled}
                          key={method}
                          height="2.5rem"
                          borderRadius="0.625rem"
                          padding="0 0.625rem"
                          width="30%"
                          fontSize="0.6rem"
                          alignItems="center"
                          justifyContents="flex-start"
                          border="none"
                          color={isSelected ? Colors.green : "#9EA8B7"}
                          backgroundColor={isSelected ? Colors.lightGreen : Colors.tabBg}
                          onClick={() => {
                            handleInputChange(index, "paymentMethod", method);
                          }}
                        >
                          <CheckBox
                            radius="50%"
                            margin="0 0.5rem 0 0 "
                            color={Colors.green}
                            htmlFor={method}
                            checked={isSelected}
                          >
                            <span></span>
                          </CheckBox>
                          <input type="checkbox" id={method} hidden />
                          <p id="name" style={{ fontSize: "0.9rem" }}>
                            {method}
                          </p>
                        </CheckButton>
                      );
                    })}
                  </Flex>
                </Flex>
              );
            })}
          </Flex>
          <Flex width="100%" alignItems="center" justifyContent="space-between">
            {paymentMethods.length < paymentMethodOption.length - 1 && !isDone && (
              <Span
                fontWeight="600"
                color={Colors.secondaryColor}
                margin="0 0 1rem 0"
                cursor="pointer"
                onClick={handleAddField}
              >
                Add Payment
              </Span>
            )}

            {paymentMethods.length > 1 && paymentMethods.length <= 3 && (
              <Span
                fontWeight="600"
                color={Colors.primaryColor}
                margin="0 0 1rem 0"
                cursor="pointer"
                onClick={handleRemoveField}
              >
                Remove Payment
              </Span>
            )}
          </Flex>
        </>
        <Button
          label="Done"
          disabled={!isDone}
          onClick={handleDone}
          backgroundColor={Colors.primaryColor}
          size="lg"
          fontSize="1rem"
          borderRadius="0.9rem"
          width="100%"
          color={"#fff"}
          margin="2rem 0 0 0"
          borderColor="transparent"
          borderSize="0px"
        />
      </Flex>
    </Flex>
  );
};

export default MultiplePayment;
