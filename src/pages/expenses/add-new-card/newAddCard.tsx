import { useState } from "react";
import CustomDropdown from "../../../components/custom-dropdown/custom-dropdown";
import { InputField } from "../../../components/input-field/input";
import { InputWrapper } from "../../inventory/style";
import dropIcon from "../../../assets/dropIcon2.svg";
import { ModalBox } from "../../settings/style";
import cancel from "../../../assets/cancel.svg";
import { Box, Header } from "./style";
import { SubCardSelector } from "../../subscriptions/subscriptions.style";
import { Flex } from "../../onlinePresence/style.onlinePresence";
import { Button } from "../../../components/button/Button";
import { Colors } from "../../../GlobalStyles/theme";

const NewAddCard = ({ setOpenModal }: { setOpenModal: Function }) => {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [expenseName, setExpenseName] = useState<string>();
  const [type, setType] = useState<string>("income");
  const [mode, setMode] = useState<string>("income");
  const [paymentMethod, setPaymentMethod] = useState<number>(0);
  const categoryOptions = ["Rent", "Wahala", "Buying of Market", "Bribes"];

  const pyOpt = ["Cash", "POS", "Trasnfer"];
  return (
    <>
      <ModalBox>
        <Box>
          <Header>
            <h3>
              {mode === "edit" ? " Edit" : "Record New"} {type === "expense" ? "Expense" : "Income"}
            </h3>

            <div className="cancelCont" onClick={() => setOpenModal(false)}>
              <img src={cancel} alt="" />
            </div>
          </Header>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: "flex", gap: "1.5em" }}>
            <InputWrapper style={{ flexDirection: "row", gap: "1rem" }}>
              <InputField
                type="date"
                label="Date"
                placeholder="Income name"
                noFormat
                top="-0.9375rem"
                size="lg"
                backgroundColor="#F4F6F9"
                color="#353e49"
                borderColor="#8196B3"
                borderRadius="0.75rem"
                borderSize="1px"
                border
                style={{ flexDirection: "row-reverse" }}
                fontSize="1rem"
                labelMargin="-0.5rem 0"
                width="100%"
                value={new Date().getDate()}
                // onChange={(e) => setIncomeName(e.target.value)}
              />
              <InputField
                style={{ flexDirection: "row-reverse" }}
                type="time"
                label="Time"
                placeholder="Income name"
                noFormat
                top="-0.9375rem"
                size="lg"
                backgroundColor="#F4F6F9"
                color="#353e49"
                borderColor="#8196B3"
                borderRadius="0.75rem"
                borderSize="1px"
                border
                fontSize="1rem"
                labelMargin="-0.5rem 0"
                width="100%"
                value={new Date().getTime()}
                // onChange={(e) => setIncomeName(e.target.value)}
              />
            </InputWrapper>

            <InputWrapper>
              <CustomDropdown
                width="100%"
                height="50px"
                fontSize="14px"
                label="Category"
                borderRadius="0.75rem"
                containerColor="#F4F6F9"
                color="#8196B3"
                selected={selectedCategory}
                setValue={setSelectedCategory}
                options={categoryOptions}
                dropdownIcon={dropIcon}
                placeholder="Select Category"
                margin="10px 0px 0px"
                padding="0 10px"
              />
            </InputWrapper>

            <InputWrapper>
              <InputField
                type="text"
                label={type === "income" ? "Income Name" : "Expense Name"}
                placeholder={
                  type === "income" ? "How much is the income?" : "How much did it cost?"
                }
                top="-0.9375rem"
                size="lg"
                backgroundColor="#F4F6F9"
                color="#353e49"
                borderColor="#8196B3"
                borderRadius="0.75rem"
                borderSize="1px"
                border
                fontSize="1rem"
                labelMargin="-0.5rem 0"
                width="100%"
                value={expenseName as string}
                onChange={(e) => setExpenseName(e.target.value)}
              />
            </InputWrapper>

            <InputWrapper style={{ flexDirection: "column", margin: "0" }}>
              <p style={{ fontSize: "0.7rem", color: "#607087" }}>
                {type === "income" ? "Paid With" : "Deducted From"}
              </p>

              <Flex gap="0 5px">
                {pyOpt.map((opt, i) => (
                  <SubCardSelector
                    padding="0.62rem 1rem"
                    justify="center"
                    checkedBg="#DBF9E8"
                    height="2rem"
                    width="6.875rem"
                    checked={i === paymentMethod}
                    onClick={() => setPaymentMethod(i)}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        border: paymentMethod === i ? "1px solid #219653" : "1px solid #9EA8B7",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          backgroundColor: paymentMethod === i ? "#219653" : "transparent",
                          borderRadius: "50%",
                        }}
                      ></div>
                    </div>
                    <p>{opt}</p>
                  </SubCardSelector>
                ))}
              </Flex>
            </InputWrapper>

            <InputWrapper style={{ flexDirection: "column" }}>
              <p style={{ fontSize: "0.7rem", color: "#607087" }}>Remarks (Optional)</p>
              <textarea
                name="remarks"
                id="remarks"
                placeholder="Remarks (Optional)"
                rows={5}
                // value={remark}
                // onChange={(e) => setRemark(e.target.value)}
              />
            </InputWrapper>

            <Button
              label={mode === "edit" ? "Update" : "Save"}
              backgroundColor={Colors.primaryColor}
              size="lg"
              fontSize="1rem"
              borderRadius="0.75rem"
              width="100%"
              color="#fff"
              borderColor="transparent"
              borderSize="0px"
            />
          </form>
        </Box>
      </ModalBox>
    </>
  );
};

export default NewAddCard;
