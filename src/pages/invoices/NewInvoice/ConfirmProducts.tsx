import { FunctionComponent, useState } from "react";
import { IInventory } from "../../../interfaces/inventory.interface";
import { ModalBox } from "../../settings/style";
import { Colors } from "../../../GlobalStyles/theme";
import { Flex, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import { InputWrapper } from "../../login/style";
import { InputField } from "../../../components/input-field/input";
import cancelIcon from "../../../assets/cancel.svg";
import { getImageUrl } from "../../../helper/image.helper";
import { Button } from "../../../components/button/Button";
import { AddCircle, AddCircleFilled } from ".";

const Minus = ({ disabled }: {disabled?: boolean}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M11.6008 8.60039H4.40078C4.24165 8.60039 4.08904 8.53718 3.97652 8.42465C3.864 8.31213 3.80078 8.15952 3.80078 8.00039C3.80078 7.84126 3.864 7.68865 3.97652 7.57613C4.08904 7.4636 4.24165 7.40039 4.40078 7.40039H11.6008C11.7599 7.40039 11.9125 7.4636 12.025 7.57613C12.1376 7.68865 12.2008 7.84126 12.2008 8.00039C12.2008 8.15952 12.1376 8.31213 12.025 8.42465C11.9125 8.53718 11.7599 8.60039 11.6008 8.60039Z" fill={disabled ? "#FFEBD3" : "#E47D05"}/>
    </svg>
  );
};

const Add = ({ disabled }: {disabled?: boolean}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M13.625 8C13.625 8.17902 13.5539 8.35071 13.4273 8.4773C13.3007 8.60388 13.129 8.675 12.95 8.675H8.675V12.95C8.675 13.129 8.60388 13.3007 8.4773 13.4273C8.35071 13.5539 8.17902 13.625 8 13.625C7.82098 13.625 7.64929 13.5539 7.5227 13.4273C7.39612 13.3007 7.325 13.129 7.325 12.95V8.675H3.05C2.87098 8.675 2.69929 8.60388 2.5727 8.4773C2.44612 8.35071 2.375 8.17902 2.375 8C2.375 7.82098 2.44612 7.64929 2.5727 7.5227C2.69929 7.39612 2.87098 7.325 3.05 7.325H7.325V3.05C7.325 2.87098 7.39612 2.69929 7.5227 2.5727C7.64929 2.44612 7.82098 2.375 8 2.375C8.17902 2.375 8.35071 2.44612 8.4773 2.5727C8.60388 2.69929 8.675 2.87098 8.675 3.05V7.325H12.95C13.129 7.325 13.3007 7.39612 13.4273 7.5227C13.5539 7.64929 13.625 7.82098 13.625 8Z" fill={disabled ? "#FFEBD3" : "#E47D05"} />
    </svg>
  );
};

interface IConfirmProdProps {
  inventory: IInventory | undefined;
  setShowConfirmProduct: Function;
  setConfirmProduct: Function;
  addToList: Function;
}

const ConfirmProduct: FunctionComponent<IConfirmProdProps> = ({
  inventory,
  setConfirmProduct,
  setShowConfirmProduct,
  addToList
}) => {
  const { inventoryName, fixedPackPrice, fixedUnitPrice, Images, inventoryType } = inventory || {};

  const [unitPrice, setUnitPrice] = useState<string>();
  const [discount, setDiscount] = useState<string>();
  const [quantity, setQuantity] = useState<number>(1);
  const [discription, setDiscription] = useState<string>();

  const [showDiscount, setShowDiscount] = useState<boolean>();
  const [showDiscription, setShowDiscription] = useState<boolean>();

  const handleAddToList = () => {
    addToList({
      ...inventory,
      unitPrice,
      discount,
      quantity,
      discription,
    });
    setShowConfirmProduct(false);
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
        <span>Confirm Product</span>
        <button
          onClick={() => {
            setShowConfirmProduct(false);
            setConfirmProduct(undefined);
          }}
          style={{ background: "transparent", border: "1px solid black" }}
        >
          <img src={cancelIcon} alt="" />
        </button>
      </h3>
      <Flex direction="column" gap="1rem">
        <Flex
          hover
          cursor="pointer"
          justifyContent="space-between"
          alignItems="flex-end"
          margin="0.354rem 0"
          padding="0.5rem"
          borderRadius="0.5rem"
        >
          <Flex gap="0.5rem" alignItems="center">
            <Flex
              alignItems="center"
              justifyContent="center"
              width="40px"
              height="40px"
              margin="0 0.5rem"
              borderRadius="0.5rem"
            >
              <img style={{ width: "100%", height: "100%" }} src={getImageUrl(Images)} />
            </Flex>
            <Flex gap="0.5rem" direction="column">
              <Text color={Colors.primaryGrey} fontSize="0.85rem">{inventoryName}</Text>
              <Text color={Colors.grey} fontSize="0.75rem" textTransform="capitalize">{inventoryType?.toLocaleLowerCase().replace("_", " ") || "N/A"}</Text>
            </Flex>
          </Flex>
        </Flex>
        {!showDiscription
          ? <Flex
              gap="0.75rem"
              padding="1rem"
              border={`2px dashed ${Colors.blackLight}`}
              bg="#F6F8FB"
              borderRadius="10px"
              alignItems="center"
              cursor="pointer"
              onClick={() => setShowDiscription(true)}
            >
              <AddCircleFilled />
              <Text fontSize="1rem" color={Colors.blackishBlue} style={{ fontStyle: "italic" }}>Add Short Description</Text>
            </Flex>
          : <InputWrapper margin="1rem 0">
              <InputField
                label="Short Description"
                placeholder="Add short Description"
                type="text"
                backgroundColor="#F4F6F9"
                size="lg"
                color="#607087"
                borderColor="transparent"
                borderRadius="0.75rem"
                borderSize="0px"
                fontSize="1rem"
                width="100%"
                value={discription || ""}
                onChange={(e) => setDiscription(e.target.value)}
              />
            </InputWrapper>
          }
        <Flex gap="1rem">
          <InputWrapper margin="1rem 0">
            <InputField
              label="Unit Price"
              placeholder="Unit Price"
              type="text"
              backgroundColor="#F4F6F9"
              size="lg"
              color="#607087"
              borderColor="transparent"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="1rem"
              width="100%"
              value={unitPrice || ""}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
          </InputWrapper>
          {showDiscount
            ? <InputWrapper margin="1rem 0">
                <InputField
                  label="Discount (Optional)"
                  placeholder="%0"
                  type="text"
                  backgroundColor="#F4F6F9"
                  size="lg"
                  color="#607087"
                  borderColor="transparent"
                  borderRadius="0.75rem"
                  borderSize="0px"
                  fontSize="1rem"
                  width="100%"
                  value={discount || ""}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </InputWrapper>
            : <Flex gap="0.75rem" margin="1rem 0" alignItems="center" cursor="pointer" width="100%" onClick={() => setShowDiscount(true)}>
                <AddCircle />
                <Text fontSize="0.75rem" color={Colors.secondaryColor} style={{ fontStyle: "italic" }}>Add Discount</Text>
              </Flex>
          }
        </Flex>
        <Flex width="50%" alignItems="center" justifyContent="space-between" padding="0 0 0.75rem 0" style={{ borderBottom: `2px solid ${Colors.grey}` }}>
          <Flex
            role="button"
            width="2.5rem"
            height="2.5rem"
            borderRadius="3px"
            bg={Colors.lightBg}
            alignItems="center"
            justifyContent="center"
            cursor={quantity > 1 ? "pointer" : "not-allowed"}
            onClick={() => {
              if (quantity > 1) {
                setQuantity(quantity - 1);
              }
            }}
          >
            <Minus disabled={quantity === 1} />
          </Flex>
          <input
            style={{
              border: "0",
              fontSize: "1.5rem",
              width: "5ch",
              textAlign: "center",
              color: Colors.blackLight
            }}
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
          <Flex
            role="button"
            width="2.5rem"
            height="2.5rem"
            borderRadius="3px"
            bg={Colors.lightBg}
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Add />
          </Flex>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          <Text color={Colors.blackishBlue} fontSize="1.2rem" fontWeight="500">Items Total</Text>
          <Text color={Colors.blackishBlue} fontSize="1.2rem" fontWeight="500">{ /* quantity * fixedUnitPrice */ }₦15,000</Text>
        </Flex>
        <Button
          label={"Add To List"}
          onClick={handleAddToList}
          backgroundColor={Colors.primaryColor}
          size="lg"
          color="#fff"
          borderColor="transparent"
          borderRadius="0.75rem"
          borderSize="0px"
          fontSize="1rem"
          width="100%"
          margin="1rem 0 0 0 "
        />
      </Flex>
    </ModalBox>
  );
};

export default ConfirmProduct;
