import { Colors } from "../../../../GlobalStyles/theme";
import { ModalBox, ModalContainer } from "../../../settings/style";
import cancelIcon from "../../../../assets/cancel.svg";
import { Flex, Text } from "../../../../GlobalStyles/CustomizableGlobal.style";
import { FunctionComponent, useState } from "react";
import { AddCircleFilled } from "..";
import { Button } from "../../../../components/button/Button";
import { GreenTick } from "../../icons";

interface IProps {
  setShowCheckout: Function;
}

type TPaymentType = "full-payment" | "part-payment" | "unpaid";

const Checkout: FunctionComponent<IProps> = ({ setShowCheckout }) => {
  const [paymentType, setPaymentType] = useState<TPaymentType>();
  const [showDepositAmount, setShowDepositAmount] = useState<boolean>();
  const [showDiscount, setShowDiscount] = useState<boolean>();
  const [showShippingFee, setShowShippingFee] = useState<boolean>();
  const [showNotes, setShowNotes] = useState<boolean>();

  const paymentSelectedColor = (type: TPaymentType) => {
    if (type === paymentType) {
      return {
        color: Colors.green,
        bg: Colors.lightGreen,
        isSelected: true
      };
    }
    return {
      color: Colors.grey,
      bg: Colors.lightBg,
      isSelected: false
    };
  };

  const close = () => {
    setShowCheckout(false);
  };

  const handleSaveToDraft = () => {};

  const handleSave = () => {};

  return (
    <ModalContainer>
      <ModalBox width="40%">
        <h3
          style={{
            marginBottom: "10px",
            justifyContent: "space-between",
            alignItems: "center",
            display: "flex",
            color: Colors.primaryColor,
          }}
        >
          <span>Payment and Checkout Options</span>
          <button
            onClick={close}
            style={{ background: "transparent", border: "1px solid black" }}
          >
            <img src={cancelIcon} alt="" />
          </button>
        </h3>
        <Flex direction="column" gap="1rem">
          <Flex gap="1rem" alignItems="center">
            <Flex
              onClick={() => setPaymentType("full-payment")}
              bg={paymentSelectedColor("full-payment").bg}
              color={paymentSelectedColor("full-payment").color}
              gap="0.5rem"
              padding="0.5rem"
              borderRadius="5px"
              border={`1px solid ${paymentSelectedColor("full-payment").color}`}
              cursor="pointer"
              alignItems="center"
            >
              {paymentSelectedColor("full-payment").isSelected ? <GreenTick /> : <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: `1px solid ${Colors.grey}` }} />}
              Paid Fully
            </Flex>
            <Flex
              onClick={() => setPaymentType("unpaid")}
              bg={paymentSelectedColor("unpaid").bg}
              color={paymentSelectedColor("unpaid").color}
              gap="0.5rem"
              padding="0.5rem"
              borderRadius="5px"
              border={`1px solid ${paymentSelectedColor("unpaid").color}`}
              cursor="pointer"
              alignItems="center"
            >
              {paymentSelectedColor("unpaid").isSelected ? <GreenTick /> : <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: `1px solid ${Colors.grey}` }} />}
              Unpaid
            </Flex>
            <Flex
              onClick={() => setPaymentType("part-payment")}
              bg={paymentSelectedColor("part-payment").bg}
              color={paymentSelectedColor("part-payment").color}
              gap="0.5rem"
              padding="0.5rem"
              borderRadius="5px"
              border={`1px solid ${paymentSelectedColor("part-payment").color}`}
              cursor="pointer"
              alignItems="center"
            >
              {paymentSelectedColor("part-payment").isSelected ? <GreenTick /> : <div style={{ width: "14px", height: "14px", borderRadius: "50%", border: `1px solid ${Colors.grey}` }} />}
              Partly Paid
            </Flex>
          </Flex>
          <Text color={Colors.grey} fontSize="1rem" style={{ fontStyle: "italic" }}>Additional Checkout Options</Text>
          <Flex gap="1rem" alignItems="center">
            <Flex
              gap="0.75rem"
              padding="0.75rem"
              border={`2px dashed ${Colors.blackLight}`}
              bg="#F6F8FB"
              borderRadius="10px"
              alignItems="center"
              cursor="pointer"
              width="50%"
              onClick={() => setShowDiscount(true)}
            >
              <AddCircleFilled />
              <Text fontSize="1rem" color={Colors.blackishBlue} style={{ fontStyle: "italic" }}>Discount</Text>
            </Flex>
            <Flex
              gap="0.75rem"
              padding="0.75rem"
              border={`2px dashed ${Colors.blackLight}`}
              bg="#F6F8FB"
              borderRadius="10px"
              alignItems="center"
              cursor="pointer"
              width="50%"
              onClick={() => setShowShippingFee(true)}
            >
              <AddCircleFilled />
              <Text fontSize="1rem" color={Colors.blackishBlue} style={{ fontStyle: "italic" }}>Shipping Fee</Text>
            </Flex>
          </Flex>
          <Flex
            gap="0.75rem"
            padding="0.75rem"
            border={`2px dashed ${Colors.blackLight}`}
            bg="#F6F8FB"
            borderRadius="10px"
            alignItems="center"
            cursor="pointer"
            onClick={() => setShowNotes(true)}
          >
            <AddCircleFilled />
            <Text fontSize="1rem" color={Colors.blackishBlue} style={{ fontStyle: "italic" }}>Add Notes</Text>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center">
            <Text fontSize="1rem" color={Colors.blackishBlue} fontWeight="500">Invoice Total</Text>
            <Text fontSize="1rem" color={Colors.blackishBlue} fontWeight="500">₦15,000</Text>
          </Flex>
          <Flex gap="1rem" alignItems="center">
            <Button
              label={"Save as Draft"}
              onClick={handleSaveToDraft}
              backgroundColor={Colors.secondaryColor}
              size="lg"
              color="#fff"
              borderColor="transparent"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="1rem"
              width="50%"
              margin="1rem 0 0 0 "
            />
            <Button
              label={"Save & Send"}
              onClick={handleSave}
              backgroundColor={Colors.primaryColor}
              size="lg"
              color="#fff"
              borderColor="transparent"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="1rem"
              width="50%"
              margin="1rem 0 0 0 "
            />
          </Flex>
        </Flex>
      </ModalBox>
    </ModalContainer>
  );
};

export default Checkout;
