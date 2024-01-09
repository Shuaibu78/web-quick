import { Button } from "../../../components/button/Button";
import CustomDropdown from "../../../components/custom-dropdown/custom-dropdown";
import { InputField } from "../../../components/input-field/input";
import dropIcon from "../../../assets/dropIcon2.svg";
import { InputWrapper } from "../../login/style";
import { Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import { IProductInformation } from "./addInterface";
import React, { useState } from "react";
import CategoryIcon from "../../../assets/categoryIcon.svg";
import { BarCodeButton, ErrorMsg, MoreOptions } from "./style";
import { AiOutlinePlus } from "react-icons/ai";
import { Hr } from "../style";
import BarCode from "../../../assets/barcode.svg";
import Delete from "../../../assets/delete-icon.svg";

const ProductInformation: React.FC<IProductInformation> = ({
  type,
  errorMessage,
  productName,
  setProductName,
  selectedCategory,
  setSelectedCategory,
  categoryOption,
  setShowCreateCategory,
  serviceName,
  setServiceName,
  serviceCharge,
  setServiceCharge,
  validateInputNum,
  barcode,
  brand,
  setBrand,
  setBarcode,
  description,
  setDescription,
}) => {
  const [showBrand, setShowBrand] = useState<boolean>(false);
  const [showBarcode, setShowBarcode] = useState<boolean>(false);
  const [showDescription, setShowDescription] = useState<boolean>(false);

  return (
    <Flex width="100%" direction="column">
      {errorMessage.nameError && <ErrorMsg>{errorMessage.nameError}</ErrorMsg>}
      {type === "product" && (
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            marginTop: "10px",
          }}
        >
          <Flex width="100%" direction="column" gap="1rem" margin="0.6rem 0 0 0">
            <InputWrapper margin="0 0 1.5rem 0">
              <InputField
                label="Product Name"
                placeholder="Product Name"
                type="text"
                size="lg"
                backgroundColor="#F4F6F9"
                color="#353e49"
                borderColor={errorMessage.nameError ? "red" : "#8196B3"}
                borderRadius=".75rem"
                borderSize="1px"
                border
                height="3rem"
                fontSize="1rem"
                width="100%"
                name="nameError"
                errors={errorMessage}
                value={productName}
                onChange={(e) => setProductName && setProductName(e.target.value)}
              />
            </InputWrapper>
            <Flex width="100%" justifyContent="space-between" alignItems="center" gap="1rem">
              <InputWrapper width="85%">
                <CustomDropdown
                  width="100%"
                  height="3rem"
                  borderRadius=".75rem"
                  containerColor="#F4F6F9"
                  iconContainerColor="transparent"
                  fontSize="1rem"
                  dropdownIcon={dropIcon}
                  selected={selectedCategory}
                  setValue={(val) => setSelectedCategory && setSelectedCategory(val)}
                  options={categoryOption}
                  color="#8196B3"
                  placeholder=":-Select Category-:"
                  label="Product Category"
                  padding="1em"
                />
              </InputWrapper>
              <Button
                type="submit"
                backgroundColor="#130F26"
                size="sm"
                color="#fff"
                borderColor="transparent"
                borderRadius=".75rem"
                borderSize="1px"
                fontSize="1rem"
                height="3rem"
                width="15%"
                onClick={() => setShowCreateCategory && setShowCreateCategory(true)}
              >
                <img src={CategoryIcon} alt="add category" width="100%" />
              </Button>
            </Flex>
          </Flex>
          <Hr opacity="0.2" margin="1rem 0" />
          <Flex width="100%" direction="column" className="options" gap="2rem">
            <Span color="#9EA8B7" fontWeight="400" fontSize="1.1em" fontStyle="italic">
              More Options. Simply click on any to add
            </Span>
            {type === "product" && showBarcode && (
              <BarCodeButton>
                <Span id="label">Product Barcode</Span>
                <div
                  id="delete"
                  onClick={() => {
                    setShowBarcode(false);
                    setBarcode("");
                  }}
                >
                  <img src={Delete} alt="bar code" />
                </div>
                <img id="bar-code" src={BarCode} alt="bar code" />
                <Span>{barcode || "Product Barcode"}</Span>
              </BarCodeButton>
            )}
            {type === "product" && showBrand && (
              <InputWrapper>
                <InputField
                  sideButtonClick={() => {
                    setShowBrand(false);
                    setBrand("");
                  }}
                  isSideButton={showBrand}
                  label="Product Brand"
                  placeholder="Product Brand"
                  type="text"
                  size="lg"
                  backgroundColor="#F4F6F9"
                  color="#353e49"
                  borderColor={errorMessage.nameError ? "red" : "#8196B3"}
                  borderRadius=".75rem"
                  borderSize="1px"
                  border
                  height="3rem"
                  fontSize="1rem"
                  width="100%"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </InputWrapper>
            )}
            {type === "product" && showDescription && (
              <textarea
                placeholder="Product Description"
                style={{
                  backgroundColor: "#F4F6F9",
                  color: "#353e49",
                  borderRadius: ".75rem",
                  border: `1px solid ${errorMessage.nameError ? "red" : "#8196B3"}`,
                  fontSize: "1rem",
                  width: "100%",
                  height: "6rem",
                  padding: "0.4rem",
                }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            )}
          </Flex>
          <Flex
            width="100%"
            direction="column"
            gap="0.5em"
            justifyContent="flex-start"
            margin="0.5em 0 0 0"
          >
            <Flex width="100%" alignItems="center" justifyContent="flex-start" gap="1em">
              {!showBrand && (
                <MoreOptions minWidth="7em" onClick={() => setShowBrand(!showBrand)}>
                  <AiOutlinePlus /> Brand
                </MoreOptions>
              )}

              {!showBarcode && (
                <MoreOptions minWidth="11em" onClick={() => setShowBarcode(!showBarcode)}>
                  <AiOutlinePlus />
                  Product Barcode
                </MoreOptions>
              )}

              {!showDescription && (
                <MoreOptions minWidth="11em" onClick={() => setShowDescription(!showDescription)}>
                  <AiOutlinePlus />
                  Product Description
                </MoreOptions>
              )}
            </Flex>
          </Flex>
        </form>
      )}
      {type === "service" && (
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{ display: "flex", flexDirection: "column", gap: "2em", marginTop: "1.5em" }}
        >
          <InputWrapper>
            <InputField
              label="Service Name"
              placeholder="Service Name"
              type="text"
              color="#353e49"
              borderColor={errorMessage.nameError ? "red" : "#8196B3"}
              size="lg"
              borderRadius=".75rem"
              borderSize="1px"
              fontSize="1rem"
              width="100%"
              value={serviceName}
              onChange={(e) => setServiceName && setServiceName(e.target.value)}
            />
          </InputWrapper>
          <InputWrapper>
            <InputField
              label="Service Charge"
              placeholder="Service Charge"
              type="text"
              size="lg"
              color="#353e49"
              borderColor={errorMessage.nameError ? "red" : "#8196B3"}
              borderRadius=".75rem"
              borderSize="1px"
              fontSize="1rem"
              width="100%"
              value={serviceCharge}
              onChange={(e) =>
                validateInputNum && validateInputNum(setServiceCharge, e.target.value)
              }
            />
          </InputWrapper>
        </form>
      )}
    </Flex>
  );
};

export default ProductInformation;
