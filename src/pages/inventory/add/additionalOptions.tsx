import React, { useState } from "react";
import { Hr } from "../style";
import { TextArea } from "../../sales/style";
import { InputWrapper } from "../../login/style";
import { Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import { MoreOptions, SubText, TextAreaContainer } from "./style";
import { InputField } from "../../../components/input-field/input";
import { ToggleButton } from "../../staffs/style";
import toggleOn from "../../../assets/toggleOn.svg";
import toggleOff from "../../../assets/toggleOff.svg";
import { Colors } from "../../../GlobalStyles/theme";
import { IAdditionalOptions } from "./addInterface";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { validateInputNum } from "../../../utils/formatValues";
import { isFigorr } from "../../../utils/constants";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { checkPackageLimits } from "../../subscriptions/util/packageUtil";
import { IAdditionalFeatures } from "../../../interfaces/subscription.interface";

export enum WeightTypeEnum {
  LIGHT = "LIGHT",
  HEAVY = "HEAVY",
}

const AdditionalOptions: React.FC<IAdditionalOptions> = ({
  publish,
  handleOnlinePresence,
  type,
  lowAlertQuantity,
  errorMessage,
  setLowAlert,
  lowAlert,
  setIsFocused,
  setDescription,
  description,
  isFocused,
  spublish,
  fixedServiceCharge,
  setFixedServiceCharge,
  setLowAlertQuantity,
  setProductDiscount,
  productDiscount,
  setReturnPolicy,
  returnPolicy,
  sellTypeOption,
  sellType,
}) => {
  const [showProductDiscount, setShowProductDiscount] = useState<boolean>(false);
  const [showReturnPolicy, setShowReturnPolicy] = useState<boolean>(false);

  const { subscriptions } = useAppSelector((state) => state);
  const userSubscriptions = subscriptions?.subscriptions[0] || [];
  const subscriptionPackages = subscriptions?.subscriptionPackages || [];
  const featureCount = subscriptions?.featureCount || {};
  const dispatch = useAppDispatch();

  const checkPackageLimit = (check: IAdditionalFeatures["check"]) =>
    checkPackageLimits(
      userSubscriptions.packageNumber,
      subscriptionPackages,
      featureCount,
      dispatch,
      check
    );

  return (
    <Flex direction="column" width="100%" className="column-body">
      <Flex direction="column" width="100%" margin="1em 0 0 0" gap="0.5em">
        {type === "product" ? (
          <>
            {sellTypeOption[sellType] !== "Sell in Variation" && (
              <Flex width="100%" direction="column" gap="0.6em">
                <Flex width="100%" direction="column" gap="0.5em">
                  <ToggleButton
                    onClick={() => {
                      const isProgress = checkPackageLimit("LowProductAlert");
                      if (!isProgress) return;
                      setLowAlert(!lowAlert);
                    }}
                    height="1.25rem"
                  >
                    <img src={lowAlert ? toggleOn : toggleOff} alt="" />
                    <span style={{ marginLeft: "1rem" }}>Low Product Alert</span>
                  </ToggleButton>
                  <SubText>Get notified when product count is low</SubText>
                </Flex>
                {lowAlert && (
                  <InputField
                    placeholder="Low Product Alert Quantity"
                    type="text"
                    backgroundColor="#fff"
                    color="#353e49"
                    borderColor={errorMessage.nameError ? "red" : "#8196B3"}
                    size="lg"
                    borderRadius="0.75rem"
                    borderSize="1px"
                    fontSize="1rem"
                    width="100%"
                    value={lowAlertQuantity}
                    onChange={(e) => validateInputNum(setLowAlertQuantity, e.target.value)}
                  />
                )}
              </Flex>
            )}
            {type === "product" && <Hr opacity="0.2" margin="1em 0" />}
            {isFigorr ? null : (
              <Flex width="100%" direction="column" gap="0.5em">
                <ToggleButton onClick={handleOnlinePresence} height="1.25rem">
                  <img src={publish ? toggleOn : toggleOff} alt="" />
                  <span style={{ marginLeft: "1rem" }}>Show Product Online</span>
                </ToggleButton>
                <SubText>Allow customers to see this product online</SubText>
              </Flex>
            )}
            {publish && (
              <>
                {/* <Flex
                  width="100%"
                  alignItems="center"
                  justifyContent="space-between"
                  margin="1em 0 0 0"
                >
                  {Object.values(WeightTypeEnum).map((weight) => (
                    <CheckButton
                      key={weight}
                      height="3.125rem"
                      borderRadius="0.875rem"
                      padding="0 1.25rem"
                      width="40%"
                      fontSize="1rem"
                      alignItems="center"
                      justifyContents="flex-start"
                      border={weightType === weight ? "none" : "1px solid #9EA8B7"}
                      color={weightType === weight ? primaryColor : "#9EA8B7"}
                      backgroundColor={weightType === weight ? "#FFF6EA" : "transparent"}
                      onClick={() => setWeightType(weight as WeightTypeEnum)}
                    >
                      <CheckBox
                        radius="50%"
                        htmlFor="toggle-pack"
                        checked={weight === weightType}
                        onClick={() => setWeightType(weight as WeightTypeEnum)}
                      >
                        <span></span>
                      </CheckBox>
                      <input type="checkbox" id="toggle-pack" hidden />
                      <p id="name">{weight === "LIGHT" ? "Light" : "Heavy"}</p>
                    </CheckButton>
                  ))}
                </Flex> */}
                <InputWrapper style={{ margin: "1em 0" }}>
                  <label
                    className="label"
                    style={{
                      fontSize: "0.75rem",
                      margin: "0 0 0.3125rem 0px",
                      color: `${isFocused ? Colors.primaryColor : "#607087"}`,
                    }}
                  >
                    Description
                  </label>
                  <TextArea
                    placeholder="Description"
                    color="#353e49"
                    height="6.25rem"
                    value={description}
                    onChange={(e) => setDescription && setDescription(e.target.value)}
                    style={{ fontSize: "1rem" }}
                  />
                </InputWrapper>

                <Flex direction="column" width="100%" gap="1rem">
                  <Span color="#9EA8B7" fontWeight="400" fontSize="1.1em" fontStyle="italic">
                    Click to Add
                  </Span>
                  <Flex width="100%" direction="column" gap="1rem">
                    {type === "product" && showProductDiscount && (
                      <InputWrapper margin="1rem 0 0 0">
                        <InputField
                          isSideButton={showProductDiscount}
                          sideButtonClick={() => {
                            setShowProductDiscount(false);
                            setProductDiscount("");
                          }}
                          label="Product Discount"
                          placeholder="Product Discount"
                          type="text"
                          size="lg"
                          backgroundColor="#F4F6F9"
                          color="#353e49"
                          borderColor={errorMessage.nameError ? "red" : "#8196B3"}
                          borderRadius="0.75rem"
                          borderSize="1px"
                          border
                          height="3.125rem"
                          fontSize="1rem"
                          width="100%"
                          value={productDiscount}
                          onChange={(e) =>
                            setProductDiscount &&
                            validateInputNum(setProductDiscount, e.target.value)
                          }
                        />
                      </InputWrapper>
                    )}
                    {type === "product" && showReturnPolicy && (
                      <InputWrapper>
                        <label
                          style={{
                            fontSize: "0.75rem",
                            margin: "0 0 0.3125rem 0px",
                            color: `${isFocused ? Colors.primaryColor : "#607087"}`,
                          }}
                        >
                          Product Return Policy
                        </label>
                        <TextAreaContainer>
                          <TextArea
                            placeholder="Product Return Policy"
                            color="#353e49"
                            height="6.25rem"
                            value={returnPolicy}
                            onChange={(e) => setReturnPolicy(e.target.value)}
                            style={{ fontSize: "1rem" }}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                          />

                          <div className="minimize" onClick={() => setShowReturnPolicy(false)}>
                            <AiOutlineMinus />
                          </div>
                        </TextAreaContainer>
                      </InputWrapper>
                    )}
                  </Flex>
                </Flex>

                <Flex width="100%" direction="column" gap="0.5em" justifyContent="flex-start">
                  <Flex width="100%" alignItems="center" justifyContent="flex-start" gap="1em">
                    {!showProductDiscount && (
                      <MoreOptions
                        minWidth="11em"
                        onClick={() => setShowProductDiscount(!showProductDiscount)}
                      >
                        <AiOutlinePlus /> Online Discount
                      </MoreOptions>
                    )}

                    {!showReturnPolicy && (
                      <MoreOptions
                        minWidth="13em"
                        onClick={() => setShowReturnPolicy(!showReturnPolicy)}
                      >
                        <AiOutlinePlus /> Product Return Policy
                      </MoreOptions>
                    )}
                  </Flex>
                </Flex>
              </>
            )}
          </>
        ) : (
          <Flex direction="column" width="100%" gap="0.5em">
            <Flex direction="column" width="100%" gap="0.5em">
              <ToggleButton
                onClick={() => setFixedServiceCharge(!fixedServiceCharge)}
                height="1.25rem"
              >
                <img src={fixedServiceCharge ? toggleOn : toggleOff} alt="" />
                <span style={{ marginLeft: "1rem" }}>Fix service charge</span>
              </ToggleButton>
              <SubText>Enable this feature to set fixed charge on services</SubText>
            </Flex>
            <Hr opacity="0.2" margin="1em 0" />
            {isFigorr ? null : (
              <Flex direction="column" width="100%" gap="0.5em">
                <ToggleButton onClick={handleOnlinePresence} height="1.25rem">
                  <img src={spublish ? toggleOn : toggleOff} alt="" />
                  <span style={{ marginLeft: "1rem" }}>Show Service online</span>
                </ToggleButton>
                <SubText>Allow Customers to see this Service online</SubText>
              </Flex>
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default AdditionalOptions;
