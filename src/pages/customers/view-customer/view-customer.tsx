import React, { useEffect, useState } from "react";
import { Flex } from "../../../components/receipt/style";
import {
  Contact,
  Container,
  CustomerBalanceCard,
  CustomerCard,
  Icon,
  TIcon,
  TransparentBtn,
  UserImage,
} from "./style";
import cancel from "../../../assets/cancel.svg";
import expense from "../../../assets/expense.svg";
import inflow from "../../../assets/inflow.svg";
import preUserImage from "../../../assets/preUser.png";
import { Button } from "../../../components/button/Button";
import editIcon from "../../../assets/Edit.svg";
import deleteIcon from "../../../assets/Delete.svg";
import More from "../../../assets/MoreSquare.svg";
import locationIcon from "../../../assets/Location.svg";
import messageIcon from "../../../assets/Message.svg";
import callIcon from "../../../assets/Call.svg";
import searchIcon from "../../../assets/search.svg";
import filterIcon from "../../../assets/Filter.svg";
import moment from "moment";
import {
  ActionRow,
  CustomText,
  DropdownTRow,
  SubActionRow,
  SubRow,
  TableContainer,
  TRow,
} from "../../staffs/style";
import { Table, TBody, TBtnCont, TControls, Td, THead } from "../../sales/style";
import { ICustomer } from "../../../interfaces/inventory.interface";
import { formatAmountIntl } from "../../../helper/format";

const ViewCustomer = ({
  customer,
  setShowAddTransaction,
  setShowAddCustomer,
  setShowCustomer,
  setType,
  setIsEdit,
  setDeletePopup,
}: {
  customer?: ICustomer;
  setShowAddTransaction: Function;
  setShowCustomer: Function;
  setShowAddCustomer: Function;
  setType: Function;
  setIsEdit: Function;
  setDeletePopup?: Function;
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const getCustomerAmount = (transactionType?: string) => {
    return customer?.CustomerTransactions.reduce((total, transaction) => {
      const isCredit = transaction.isCredit;
      const amount = Math.abs(transaction.amount!);
      if (transactionType === "credit" && isCredit) {
        return total + amount;
      } else if (transactionType === "deposit" && !isCredit) {
        return total + amount;
      } else {
        return total;
      }
    }, 0);
  };

  const isCredit = () => {
    return getCustomerAmount("credit")! > getCustomerAmount("deposit")!;
  };

  useEffect(() => {
    getCustomerAmount();
  }, [customer]);

  const handleDropdownClick = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <Container>
      <Flex alignItems="center" justifyContent="flex-start" gap={"3rem"}>
        <img
          src={cancel}
          alt=""
          style={{ width: "1.25rem", cursor: "pointer" }}
          onClick={() => setShowCustomer(false)}
        />
        <h3 style={{ color: "#607087" }}>View Customer</h3>
      </Flex>
      <CustomerCard>
        <UserImage src={preUserImage} alt="" />
        <div style={{ width: "100%" }}>
          <Flex width="100%" alignItems="center">
            <p style={{ width: "70%", fontWeight: "500", color: "#607087" }}>
              {customer?.customerName}
            </p>
            <Flex width="30%" justifyContent="flex-end" gap="2rem">
              <TransparentBtn>
                <img
                  src={editIcon}
                  alt=""
                  onClick={() => {
                    setShowAddCustomer(true);
                    setShowCustomer(false);
                    setIsEdit(true);
                  }}
                />
              </TransparentBtn>
              <TransparentBtn>
                <img
                  src={deleteIcon}
                  alt=""
                  onClick={() => {
                    setDeletePopup!(true);
                    setShowCustomer(false);
                  }}
                />
              </TransparentBtn>
            </Flex>
          </Flex>
          <Contact>
            <img src={callIcon} alt="" />
            <span>{customer?.phoneNumber}</span>
          </Contact>
          <Contact>
            <img src={messageIcon} alt="" />
            <span>{customer?.email}</span>
          </Contact>
          <Contact>
            <img src={locationIcon} alt="" />
            <span>{customer?.address}</span>
          </Contact>
        </div>
      </CustomerCard>

      <CustomerBalanceCard isCredit={isCredit()}>
        <Flex alignItems="center" justifyContent="flex-start" gap="1rem" width="100%">
          <h3>Account Balance: </h3>
          <p className="total">
            {formatAmountIntl(
              undefined,
              Math.abs(getCustomerAmount("deposit")! - getCustomerAmount("credit")!)
            )}
          </p>
          <span>({isCredit() ? "Money you will receive" : "Money you owe"})</span>
        </Flex>
        <Flex width="100%" alignItems="center" justifyContent="space-between" gap="1rem">
          <Flex alignItems="flex-start" flexDirection="column" gap="1rem">
            <Flex alignItems="center" justifyContent="flex-start">
              <Icon isCredit={false}>
                <img src={inflow} alt="" />
              </Icon>
              <h4>Deposit</h4>
            </Flex>

            <p className="deposit">
              {formatAmountIntl(undefined, Math.abs(getCustomerAmount("deposit")!))}
            </p>
          </Flex>
          <Flex alignItems="flex-start" flexDirection="column" gap="1rem">
            <Flex alignItems="center" justifyContent="flex-start">
              <Icon isCredit={true}>
                <img src={expense} alt="" />
              </Icon>
              <h4>Credit</h4>
            </Flex>
            <p className="credit">
              {" "}
              {formatAmountIntl(undefined, Math.abs(getCustomerAmount("credit")!))}
            </p>
          </Flex>
        </Flex>
      </CustomerBalanceCard>
      <Flex justifyContent="space-between" padding="0.9375rem 0">
        <Button
          label="Add Deposit"
          onClick={() => {
            setShowAddTransaction(true);
            setType("deposit");
            setShowCustomer(false);
          }}
          backgroundColor="#219653"
          size="lg"
          color="#fff"
          borderColor="transparent"
          borderRadius="0.75rem"
          borderSize="0px"
          fontSize="1rem"
          width="45%"
        />
        <Button
          label="Add Credit"
          onClick={() => {
            setShowAddTransaction(true);
            setType("credit");
            setShowCustomer(false);
          }}
          backgroundColor="#F65151"
          size="lg"
          color="#fff"
          borderColor="transparent"
          borderRadius="0.75rem"
          borderSize="0px"
          fontSize="1rem"
          width="45%"
        />
      </Flex>
      {customer?.CustomerTransactions.length! > 0 && (
        <TableContainer style={{ width: "100%" }}>
          <TControls>
            <h3>History</h3>
            <TBtnCont>
              <button>
                <img src={searchIcon} alt="" />
              </button>
              <button>
                <img src={filterIcon} alt="" />
              </button>
            </TBtnCont>
          </TControls>
          <Table maxWidth="550px">
            <THead fontSize="0.875rem" minWidth="550px" style={{ maxWidth: "550px" }}>
              <Td width="10%"></Td>
              <Td width="30%">
                <span>Date</span>
              </Td>
              <Td width="15%">
                <span>Type</span>
              </Td>
              <Td width="15%">
                <span>Amount</span>
              </Td>
              <Td width="10%">
                <span>Comment</span>
              </Td>
              <Td width="20%">
                <span>Receipt No.</span>
              </Td>
            </THead>
            <TBody style={{ width: "550px" }}>
              {customer?.CustomerTransactions.map((val, index) => {
                return (
                  <DropdownTRow
                    minWidth="550px"
                    background={"#F6F8FB"}
                    key={val.customerTransactionId}
                  >
                    <SubRow style={{ minWidth: "550px" }}>
                      <TRow style={{ minHeight: "45px" }}>
                        <Td
                          width="10%"
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <TIcon isCredit={val.isCredit}>
                            <img src={val.isCredit ? expense : inflow} alt="" />
                          </TIcon>
                        </Td>
                        <Td width="30%">
                          <span>{moment(val.createdAt).format("MMMM Do YYYY, h:mm a")}</span>
                        </Td>
                        <Td width="15%">
                          <span>{val.isCredit ? "Credit" : "Deposit"}</span>
                        </Td>
                        <Td width="15%">
                          <span>{formatAmountIntl(undefined, Math.abs(val.amount!))}</span>
                        </Td>
                        <Td width="10%">
                          <img
                            src={More}
                            alt=""
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              handleDropdownClick(index);
                            }}
                          />
                        </Td>
                        <Td width="20%" style={{ color: "#FFBE62" }}>
                          <TransparentBtn>Receipt</TransparentBtn>
                        </Td>
                      </TRow>

                      <ActionRow isOpen={activeIndex === index}>
                        <SubActionRow>
                          <Flex justifyContent="space-between" margin="0.9375rem 0">
                            <CustomText>
                              <span>Comment: </span> {val.comment}
                            </CustomText>
                          </Flex>
                        </SubActionRow>
                      </ActionRow>
                    </SubRow>
                  </DropdownTRow>
                );
              })}
            </TBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};
export default ViewCustomer;
