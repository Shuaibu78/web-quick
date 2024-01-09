import React, { Dispatch, FunctionComponent, SetStateAction, useState } from "react";
import { ICustomer, ICustomerTransactions } from "../../../interfaces/inventory.interface";
import { useMutation, useQuery } from "@apollo/client";
import { IAllReceipt, IReceipt } from "../../../interfaces/receipt.interface";
import { GET_SALES_RECEIPT } from "../../../schema/receipt.schema";
import Accordion from "./accordion";
import { Flex } from "../../../components/receipt/style";
import { TIcon } from "./style";
import moment from "moment";
import expense from "../../../assets/expense.svg";
import DeleteIcon from "../../../assets/delete-icon.svg";
import inflow from "../../../assets/inflow.svg";
import { Button } from "../../../components/button/Button";
import { formatAmountIntl } from "../../../helper/format";
import { Colors } from "../../../GlobalStyles/theme";
import { getImageUrl } from "../../../helper/image.helper";
import { Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import EditIcon from "../../../assets/EditIconDark.svg";
import { ModalContainer } from "../../settings/style";
import AddTransaction from "../add-transaction";
import PopupCard from "../../../components/popUp/PopupCard";
import { ButtonContainer, DeleteContainer } from "../../inventory/style";
import { InputWithIcon } from "../style";
import cancelIcon from "../../../assets/cancel.svg";
import CalendarIcon from "../../../assets/InputCalendar.svg";
import { UPDATE_CUSTOMER_TRANSACTION } from "../../../schema/customer.schema";
import { useDispatch } from "react-redux";
import { isLoading } from "../../../app/slices/status";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";

interface Props {
  val: ICustomerTransactions;
  setShowAddTransaction: Dispatch<SetStateAction<boolean>>;
  customer: ICustomer;
  setBaseTrxn: Dispatch<SetStateAction<any>>;
  setType: Dispatch<SetStateAction<any>>;
  setShowDeleteModal: Dispatch<SetStateAction<any>>;
  setCurrentTrx: Dispatch<SetStateAction<any>>;
  canDeleteTrx: boolean;
  allreceipts?: IReceipt[] | undefined;
  refetch: Function;
}

const CustomerTransaction: FunctionComponent<Props> = ({
  val,
  setShowAddTransaction,
  customer,
  setBaseTrxn,
  setType,
  setCurrentTrx,
  setShowDeleteModal,
  canDeleteTrx,
  allreceipts,
  refetch
}) => {
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [newDueDate, setNewDueDate] = useState<string>(moment(val.dueDate).format("YYYY-MM-DD"));
  const [updatePopup, setUpdatePopup] = useState<boolean>(false);
  const dispatch = useDispatch();
  const currentShop = useAppSelector(getCurrentShop);

  const customerDeposits = (transactions: [ICustomerTransactions], prntCustTrxnId: string) => {
    let deposits;
    let totalDeposits = 0;
    if (prntCustTrxnId) {
      deposits = transactions.filter(
        (trxn) => !trxn.isCredit && trxn.parentCustomerTransactionId === prntCustTrxnId
      );
      totalDeposits = deposits?.reduce((accumulator, currentItem) => {
        return accumulator + (currentItem?.amount || 0);
      }, 0);
      return { deposits, total: totalDeposits };
    }
    return { deposits: [], total: totalDeposits };
  };

  const amount = `${val.amount}`.replace("-", "");
  const amountLeft = Math.abs(Number(val.amount)) - Number(
    customerDeposits(
      customer.CustomerTransactions,
      val.parentCustomerTransactionId || val.customerTransactionId
    ).total
  );
  const isCleared = amountLeft === 0;
  const dueDateString = new Date(Number(val.dueDate) || "");

  const { data: recieptData } = useQuery<{getSalesReceipt: IReceipt}>(GET_SALES_RECEIPT, {
    variables: {
      receiptId: val.receiptId
    },
  });

  const filteredReceipt = allreceipts?.find((receipt) => receipt.receiptId === val.receiptId);

  const [updateCustomerTransaction] = useMutation(UPDATE_CUSTOMER_TRANSACTION);

  const handleUpdateTransaction = async () => {
    const date = new Date(newDueDate);
    try {
      dispatch(isLoading(true));
      const customerTransaction = await updateCustomerTransaction({
        variables: {
          customerId: customer?.customerId,
          shopId: currentShop.shopId,
          dueDate: date.toISOString(),
          amount: val.amount,
          customerTransactionId: val.customerTransactionId,
          parentCustomerTransactionId: val.parentCustomerTransactionId
        }
      });

      if (customerTransaction?.data?.updateCustomerTransaction) {
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen({ message: "Successfully Added", color: "SUCCESS" }));
        setUpdatePopup(false);
        refetch();
      }
    } catch (error: any) {
      dispatch(isLoading(false));
      const errorMessage = error?.message || "An error occurred while updating the customer transaction.";
      dispatch(toggleSnackbarOpen({ message: errorMessage, color: "DANGER" }));
    }
  };

  return (
    <>
      <Accordion
        width="100%"
        key={val.customerTransactionId}
        title={
          <Flex alignItems="center" justifyContent="space-between">
            <Flex justifyContent="flex-start" alignItems="center">
              <TIcon isCredit={val.isCredit}>
                <img src={val.isCredit ? expense : inflow} alt="" />
              </TIcon>
              <Flex margin="0 1rem" flexDirection="column" width="65%">
                <span style={{ color: val.isCredit ? "#F65151" : "#219653", fontWeight: "600" }}>{formatAmountIntl(undefined, Number(amount))}</span>
                <span style={{ color: "#9EA8B7" }}>
                  {moment(val.createdAt).format("MMMM Do YYYY, h:mm a")}
                </span>
              </Flex>
            </Flex>
            {val.isCredit &&
              <Button
                label={isCleared ? "Cleared" : "Collect"}
                type="button"
                onClick={() => {
                  setShowAddTransaction(true);
                  setBaseTrxn({
                    trxn: val,
                    amountleft: amountLeft
                  });
                  setType("deposit");
                }}
                disabled={!val.isCredit || isCleared}
                backgroundColor="transparent"
                size="sm"
                color={isCleared ? Colors.grey : "#219653"}
                borderColor={isCleared ? Colors.grey : "#219653"}
                borderRadius="6px"
                borderSize="2px"
                fontSize="0.75rem"
                height="1.5625rem"
                width="15%"
                border
              />
            }
          </Flex>
        }
      >
        <Flex flexDirection="column" margin="0 1.25rem 1.25rem 1.25rem" gap="1rem">
          {filteredReceipt?.Sales.map((sale) => {
            const { inventoryName, Inventory, quantity } = sale;
            return (
              <Flex gap="1rem">
                <img style={{ width: "2.5rem" }} src={getImageUrl(Inventory?.Images)} alt="" />
                <Flex alignItems="center" justifyContent="space-between" width="80%">
                  <Flex flexDirection="column">
                    <Text color={Colors.blackishBlue}>{inventoryName}</Text>
                    <Text color={Colors.blackishBlue}><b>Quantity:</b> {quantity}</Text>
                  </Flex>
                  <Text color={Colors.secondaryColor}>
                    {formatAmountIntl(undefined, sale.amount)}
                  </Text>
                </Flex>
              </Flex>
            );
          })}
          {filteredReceipt &&
            <span style={{ color: Colors.secondaryColor }}>
              <b>Total: </b>
              <i>
                {
                  formatAmountIntl(
                    undefined,
                    filteredReceipt?.totalAmount
                  )
                }
              </i>
            </span>
          }
        </Flex>
        <Flex flexDirection="column" margin="0 1.25rem 1.25rem 1.25rem" gap="1rem">
          {val.isCredit &&
            <span style={{ color: val.isCredit ? "#F65151" : "#219653" }}>
              <i>
                {
                  formatAmountIntl(
                    undefined,
                    amountLeft
                  )
                }
                {" "}left
              </i>
            </span>
          }
          {
            customerDeposits(
              customer.CustomerTransactions, val.customerTransactionId
            ).deposits.map((trxn) => {
              const dAmount = `${trxn.amount}`.replace("-", "");
              return (
                <Flex justifyContent="flex-start" alignItems="center">
                  <TIcon isCredit={trxn.isCredit}>
                    <img src={inflow} alt="" />
                  </TIcon>
                  <Flex margin="0 1rem" flexDirection="column" width="65%">
                    <span style={{ color: "#219653", fontWeight: "600" }}>
                      {formatAmountIntl(undefined, Number(dAmount))}
                    </span>
                    <span style={{ color: "#9EA8B7" }}>
                      {moment(trxn.createdAt).format("MMMM Do YYYY, h:mm a")}
                    </span>
                  </Flex>
                </Flex>
              );
            })
          }
        </Flex>
        <Flex flexDirection="column" margin="0 1.25rem" width="65%" gap="0.5rem">
          <span>{moment(val.createdAt).format("MMMM Do YYYY, h:mm a")}</span>
          {val.isCredit &&
            <span>
              <b>Due Date:</b> {moment(dueDateString).format("MMMM Do YYYY, h:mm a")}
            </span>
          }
          <div style={{}}>
            <span>Comment: </span> {val.comment}
          </div>
            {canDeleteTrx && (
              <Flex alignItems="center" justifyContent="space-between">
                {!val.receiptId &&
                  <Flex
                    alignItems="center"
                    justifyContent="center"
                    margin="0.75rem 0"
                    width="fit-content"
                    style={{ fontSize: "1rem", cursor: "pointer" }}
                    onClick={() => {
                      setShowEditModal(true);
                      setCurrentTrx(val);
                    }}
                  >
                    <img src={EditIcon} alt="" />
                    <p style={{ color: Colors.blackLight, margin: "0 0.5rem" }}>Edit Transaction</p>
                  </Flex>
                }
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  margin="0.75rem 0"
                  width="fit-content"
                  style={{ fontSize: "1rem", cursor: "pointer" }}
                  onClick={() => {
                    setShowDeleteModal(true);
                    setCurrentTrx(val);
                  }}
                >
                  <img src={DeleteIcon} alt="" />
                  <p style={{ color: Colors.red, margin: "0 0.5rem" }}>Delete Transaction</p>
                </Flex>
              </Flex>
            )}
            {(val.isCredit && !isCleared)
              ? <Button
                  label={"Extend Deadline"}
                  type="button"
                  onClick={() => {
                    setBaseTrxn({
                      trxn: val,
                      amountleft: Number(amount) -
                      Number(
                        customerDeposits(
                          customer.CustomerTransactions,
                          val.parentCustomerTransactionId
                        ).total
                      )
                    });
                    setUpdatePopup(true);
                  }}
                  disabled={isCleared}
                  backgroundColor="#219653"
                  size="sm"
                  color={"#fff"}
                  borderColor={"#219653"}
                  borderRadius="6px"
                  borderSize="2px"
                  fontSize="0.75rem"
                  height="1.7625rem"
                  width="10.75rem"
                  margin="1rem 0"
                  border
                /> : null
            }
        </Flex>
      </Accordion>

      {showEditModal && (
        <ModalContainer>
          <AddTransaction
            setShowModal={setShowEditModal}
            baseTrxn={{ trxn: val, amountleft: amountLeft }}
            type={val.isCredit ? "credit" : "deposit"}
            customer={customer}
            refetch={refetch}
            isEdit
          />
        </ModalContainer>
      )}

      {updatePopup && (
        <PopupCard close={() => setUpdatePopup(false)} width="50vw">
          <Flex
            flexDirection="column"
            width="25.75rem"
            height="fit-content"
            backgroundColor="#fff"
            padding="1rem"
            borderRadius="10px"
          >
            <Flex justifyContent="flex-end">
              <button
                onClick={() => setUpdatePopup(false)}
                style={{ background: "transparent", border: "none", cursor: "pointer" }}
              >
                <img src={cancelIcon} alt="" />
              </button>
            </Flex>
            <p style={{ fontSize: "0.875rem", fontWeight: "400", color: "#607087", margin: "1rem 0" }}>
              Extend Due Date
            </p>

            <div style={{ width: "100%", margin: "0 0 1rem 0" }}>
              <InputWithIcon width="100%">
                <img src={CalendarIcon} />
                <input className="no-default-icon" type="date" id="due-date" name="date" value={newDueDate} onChange={(e) => setNewDueDate(e.target.value)} />
              </InputWithIcon>
            </div>
            <ButtonContainer>
              <Button
                type="button"
                size="lg"
                label="Extend Due Date"
                color={Colors.white}
                backgroundColor={Colors.primaryColor}
                borderSize="0px"
                fontSize="0.875rem"
                borderRadius="0.625rem"
                width="100%"
                onClick={() => handleUpdateTransaction()}
              />
            </ButtonContainer>
          </Flex>
        </PopupCard>
      )}
    </>
  );
};

export default CustomerTransaction;
