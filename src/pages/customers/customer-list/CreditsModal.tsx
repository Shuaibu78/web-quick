import React, { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from "react";
import { ModalBox, ModalContainer } from "../../settings/style";
import { Flex, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import { formatAmountIntl } from "../../../helper/format";
import { TIcon } from "../view-customer/style";
import moment from "moment";
import { Colors } from "../../../GlobalStyles/theme";
import { ICustomer, ICustomerTransactions } from "../../../interfaces/inventory.interface";
import expense from "../../../assets/expense.svg";
import inflow from "../../../assets/inflow.svg";
import { customerDeposits } from "../../../helper/customerTransactions.helper";
import cancelIcon from "../../../assets/cancel.svg";
import { CustomCont } from "../../sales/style";
import Checkbox from "../../../components/checkbox/checkbox";
import { Button } from "../../../components/button/Button";

interface Props {
  customer: ICustomer | undefined;
  setShowCredits: Dispatch<SetStateAction<boolean>>;
  handleDeposit: (trxn?: ICustomerTransactions) => void;
  selectedCreditIds: string[];
  selectCredits: (e: React.ChangeEvent<HTMLInputElement>, id: string) => void;
  selectAll: () => void;
}

const CreditsModal: FunctionComponent<Props> = ({
  customer,
  setShowCredits,
  handleDeposit,
  selectedCreditIds,
  selectCredits,
  selectAll
}) => {
  const [showSelectMultiple, setShowSelectMultiple] = useState<boolean>(false);
  const creditTransactions =
    customer?.CustomerTransactions.map((trxn) => {
      const { isCredit, createdAt, customerTransactionId } = trxn;
      const amount = `${trxn?.amount}`.replace("-", "");
      const amountLeft = Number(amount) - Number(
        customerDeposits(
          trxn?.customerTransactionId,
          customer?.CustomerTransactions,
        ).total
      );
      return (isCredit && (amountLeft > 0)) ? trxn : null;
    }).filter(id => id !== null) || [];

  useEffect(() => {
    if (selectedCreditIds.length === 0) {
      setShowSelectMultiple(false);
    }
  }, [selectedCreditIds]);

  return (
    <ModalContainer>
      <ModalBox width="30%">
        <Flex
          style={{
            marginBottom: "32px",
            justifyContent: "space-between",
            alignItems: "center",
            display: "flex",
          }}
        >
          <Flex direction="column">
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#607087",
                textTransform: "capitalize",
              }}
            >
              Deposit for {customer?.customerName}
            </span>
            <span
              style={{
                fontSize: "1.2rem",
                color: Colors.grey,
                textTransform: "capitalize",
              }}
            >
              Select Credit or store deposit
            </span>
          </Flex>
          <button
            onClick={() => setShowCredits(false)}
            style={{
              background: "transparent",
              border: "1px solid black",
              padding: "0.75rem",
              borderRadius: "10px",
              cursor: "pointer"
            }}
          >
            <img src={cancelIcon} alt="" />
          </button>
        </Flex>
        <Flex alignItems="center" justifyContent="space-between">
          {showSelectMultiple
            ? <Text
              color={Colors.secondaryColor}
              onClick={selectAll}
              style={{
                cursor: "pointer"
              }}
            >
              {selectedCreditIds.length > 0 ? "Unselect all" : "Select all"}
            </Text> : null
          }
          {creditTransactions && creditTransactions.length > 0
            ? <Text
              color={showSelectMultiple ? Colors.red : Colors.secondaryColor}
              onClick={() => setShowSelectMultiple(!showSelectMultiple)}
              style={{
                cursor: "pointer"
              }}
            >
              {showSelectMultiple ? "Cancel Selection" : "Select Multiple"}
            </Text> : null
          }
        </Flex>
        <Flex alignItems="center" direction="column" gap="1.5rem" margin="1.5rem 0">
          {customer?.CustomerTransactions.map((trxn) => {
            const { isCredit, createdAt, customerTransactionId } = trxn;
            const amount = `${trxn?.amount}`.replace("-", "");
            const amountLeft = Number(amount) - Number(
              customerDeposits(
                trxn?.customerTransactionId,
                customer?.CustomerTransactions,
              ).total
            );
            return (
              <>
                {(isCredit && (amountLeft > 0))
                  ? <Flex
                      alignItems="center"
                      justifyContent="space-between"
                      cursor="pointer"
                      bg="#f4f6f9"
                      padding="0.75rem"
                      borderRadius="10px"
                      onClick={() => {
                        if (!showSelectMultiple) {
                          handleDeposit(trxn);
                        }
                      }}
                    >
                      <Flex justifyContent="flex-start" alignItems="center">
                        {showSelectMultiple
                          ? <CustomCont imgHeight="100%" height="1.25rem">
                              <Checkbox
                                isChecked={selectedCreditIds.includes(customerTransactionId)}
                                onChange={(e) => {
                                  e.stopPropagation();
                                  selectAll();
                                  selectCredits(e, customerTransactionId);
                                }}
                                color={Colors.white}
                                checkedColor={Colors.primaryColor}
                                borderColor={Colors.primaryColor}
                                size="1.125rem"
                              />
                            </CustomCont>
                          : <TIcon isCredit={isCredit}>
                              <img src={expense} alt="" />
                            </TIcon>
                        }
                        <Flex margin="0 1rem" direction="column">
                          <Flex alignItems="center" justifyContent="space-between">
                            <span style={{ color: "#F65151", fontWeight: "600" }}>{formatAmountIntl(undefined, Number(amount))}</span>
                            <span style={{ color: Colors.blackLight, fontWeight: "600", fontSize: "0.75rem" }}>Amount Left: {formatAmountIntl(undefined, Number(amountLeft))}</span>
                          </Flex>
                          <span style={{ color: "#9EA8B7" }}>
                            {moment(createdAt).format("MMMM Do YYYY, h:mm a")}
                          </span>
                        </Flex>
                      </Flex>
                    </Flex> : null
                }
              </>
            );
          })}
          {(creditTransactions && creditTransactions.length <= 0) && <Text fontSize="1.2rem" color={Colors.grey}>No Uncleared Credits</Text>}
          {showSelectMultiple &&
            <Button
              label={"Make Deposit"}
              onClick={handleDeposit}
              backgroundColor={Colors.primaryColor}
              type="submit"
              size="lg"
              color="#fff"
              borderColor="transparent"
              borderRadius="0.75rem"
              borderSize="0px"
              fontSize="1rem"
              width="100%"
            />
          }
        </Flex>
      </ModalBox>
    </ModalContainer>
  );
};

export default CreditsModal;
