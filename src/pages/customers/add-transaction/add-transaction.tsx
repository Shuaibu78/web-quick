/* eslint-disable indent */
import React, { FunctionComponent, useEffect, useState } from "react";
import { Button } from "../../../components/button/Button";
import { InputField } from "../../../components/input-field/input";
import cancelIcon from "../../../assets/cancel.svg";
import { ModalBox } from "../../settings/style";
import { Flex } from "../../../components/receipt/style";
import { InputWithIcon } from "./style";
import { TextArea } from "../../sales/style";
import {
  ICustomer,
  ICustomerTransactions,
  ITransactionData,
} from "../../../interfaces/inventory.interface";
import {
  CREATE_CUSTOMER_TRANSACTION,
  UPDATE_CUSTOMER_TRANSACTION,
} from "../../../schema/customer.schema";
import { useMutation } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import { isLoading } from "../../../app/slices/status";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { InputWrapper } from "../../login/style";
import { validateInputNum } from "../../../utils/formatValues";
import CalendarIcon from "../../../assets/InputCalendar.svg";
import Profile from "../../../assets/solar-profile.svg";
import CheckCircle from "../../../assets/check-circle-rounded.svg";
import { Colors } from "../../../GlobalStyles/theme";
import Toggle from "../../../components/toggle";
import Checkbox from "../../../components/checkbox/checkbox";
import { formatAmountIntl } from "../../../helper/format";
import {
  dispatchIncreaseSyncCount,
  getCurrentDate,
  getDefaultDate,
} from "../../../utils/helper.utils";
import moment from "moment";
import { Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import {
  getSingleCustomerAmount,
  customerDeposits,
} from "../../../helper/customerTransactions.helper";

interface IProps {
  setShowModal: Function;
  type?: string;
  customer?: ICustomer;
  refetch: Function;
  baseTrxn?: { trxn?: ICustomerTransactions; amountleft: number };
  creditsIds?: string[];
  setSelectedCreditIds?: Function;
  isEdit?: boolean;
}

const LightBulb = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
      <path
        d="M9.99995 6.47852L10.0001 6.47852C10.9239 6.4788 11.8194 6.79707 12.5361 7.37985C13.2528 7.96262 13.747 8.77436 13.9357 9.67863C14.1244 10.5829 13.9961 11.5246 13.5723 12.3453C13.1485 13.1661 12.455 13.816 11.6085 14.1857L11.3086 14.3167V14.6439V16.3283H8.69198V14.6439V14.3163L8.39165 14.1855C7.54434 13.8164 6.85005 13.1667 6.42562 12.3457C6.0012 11.5247 5.87256 10.5826 6.06136 9.67791C6.25015 8.77319 6.74486 7.96114 7.46221 7.37843C8.17955 6.79571 9.07575 6.47791 9.99995 6.47852Z"
        fill="#FFF6EA"
        stroke="#E47D05"
      />
      <path
        d="M18.1378 10.5005H19.042H18.1378ZM15.8775 4.62351L16.7816 3.71936L15.8775 4.62351ZM10.0005 2.36313V1.45898V2.36313ZM4.12351 4.62351L3.21936 3.71936L4.12351 4.62351ZM1.86313 10.5005H0.958984H1.86313ZM8.19219 19.542H11.8088H8.19219ZM14.5212 10.5005C14.521 9.6855 14.3005 8.88573 13.8829 8.1858C13.4654 7.48588 12.8665 6.91185 12.1494 6.52444C11.4324 6.13703 10.624 5.95066 9.80973 5.98505C8.99546 6.01944 8.20564 6.27331 7.52383 6.7198C6.84202 7.16628 6.2936 7.78878 5.93658 8.52141C5.57956 9.25404 5.42724 10.0696 5.49573 10.8817C5.56421 11.6938 5.85096 12.4723 6.32563 13.1348C6.8003 13.7973 7.44524 14.3191 8.19219 14.6451V16.8295H11.8088V14.6451C12.6151 14.2931 13.3012 13.7134 13.783 12.9773C14.2648 12.2411 14.5214 11.3803 14.5212 10.5005Z"
        fill="#FFF6EA"
        stroke="#E47D05"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

type depositOptionProps = {
  label: string;
  isChecked: boolean;
  onClick: () => void;
};

const DepositMethodOption = ({ label, isChecked, onClick }: depositOptionProps) => {
  return (
    <Flex
      onClick={onClick}
      width="fit-content"
      backgroundColor={isChecked ? Colors.lightGreen : "#F6F8FB"}
      borderRadius="5px"
      alignItems="center"
      gap="0.5rem"
      padding="0.5rem 1rem"
      margin="1rem 0"
      style={{ border: `1px solid ${isChecked ? Colors.green : "#9EA8B7"}`, cursor: "pointer" }}
    >
      {isChecked ? (
        <img src={CheckCircle} alt="check" />
      ) : (
        <div
          style={{
            width: "0.85rem",
            height: "0.85rem",
            borderRadius: "50%",
            border: "1px solid #9EA8B7",
            background: "transparent",
          }}
        />
      )}
      <span
        style={{
          fontSize: "0.75rem",
          fontWeight: "500",
          color: isChecked ? Colors.green : "#9EA8B7",
        }}
      >
        {label}
      </span>
    </Flex>
  );
};

const AddTransaction: FunctionComponent<IProps> = ({
  setShowModal,
  type,
  customer,
  refetch,
  baseTrxn,
  isEdit,
  creditsIds,
  setSelectedCreditIds,
}) => {
  const [amount, setAmount] = useState(
    isEdit ? Math.abs(Number(baseTrxn?.trxn?.amount || "")) : ""
  );
  const [isCredit, setIsCredit] = useState<boolean>(false);
  const [comment, setComment] = useState(isEdit ? baseTrxn?.trxn?.comment : "");
  const [depositMethod, setDepositMethod] = useState<"cash" | "pos" | "transfer">("cash");
  const [showReminders, setShowReminder] = useState<boolean | undefined>(
    isEdit ? baseTrxn?.trxn?.emailReminderEnabled || baseTrxn?.trxn?.smsReminderEnabled : false
  );
  const [isEmailChecked, setEmailChecked] = useState<boolean>(
    isEdit ? baseTrxn?.trxn?.emailReminderEnabled || false : false
  );
  const [isSmsChecked, setSmsChecked] = useState<boolean>(
    isEdit ? baseTrxn?.trxn?.smsReminderEnabled || false : false
  );
  const [startDate, setStartDate] = useState<string>(
    isEdit ? moment(baseTrxn?.trxn?.createdAt || "").format("YYYY-MM-DD") : getCurrentDate()
  );

  const dueDateString = new Date(Number(baseTrxn?.trxn?.dueDate) || "");
  const [dueDate, setDueDate] = useState<string>(
    isEdit ? moment(dueDateString).format("YYYY-MM-DD") : getDefaultDate(startDate)
  );

  const toogleReminder = () => {
    setShowReminder(!showReminders);
    setEmailChecked(!isEmailChecked);
    setSmsChecked(!isSmsChecked);
  };

  useEffect(() => {
    if (!isEmailChecked && !isSmsChecked) {
      setShowReminder(false);
    }
  }, [isEmailChecked, isSmsChecked]);

  useEffect(() => {
    setIsCredit(type === "credit");
  }, [type]);

  const dispatch = useAppDispatch();
  const currentShop = useAppSelector(getCurrentShop);

  const [createCustomerTransaction] = useMutation<{ createCustomerTransaction: ICustomer }>(
    CREATE_CUSTOMER_TRANSACTION,
    {
      onQueryUpdated(observableQuery) {
        return observableQuery.refetch();
      },
      onCompleted() {
        refetch();
      },
    }
  );

  const [updateCustomerTransaction] = useMutation(UPDATE_CUSTOMER_TRANSACTION, {
    onCompleted() {
      dispatch(isLoading(false));
      dispatch(toggleSnackbarOpen({ message: "Successfully Added", color: "SUCCESS" }));
      setShowModal(false);
      refetch();
    },
    onError(error) {
      dispatch(isLoading(false));
      setShowModal(false);
      dispatch(toggleSnackbarOpen({ message: error.message, color: "DANGER" }));
    },
  });

  const totalCreditAmount = getSingleCustomerAmount(customer, "credit") as number;
  const totalDepositAmount = getSingleCustomerAmount(customer, "deposit") as number;
  const tableUpdated = ["Customer", "CustomerTransaction"];

  const handleSuccess = () => {
    dispatch(isLoading(false));
    dispatch(toggleSnackbarOpen({ message: "Successfull", color: "SUCCESS" }));
    dispatchIncreaseSyncCount(dispatch, tableUpdated);
    setShowModal(false);
  };

  const handleError = (error: any) => {
    dispatch(isLoading(false));
    dispatch(toggleSnackbarOpen({ message: error?.message || error?.toString(), color: "DANGER" }));
  };

  const updateTransaction = async (editingData: ITransactionData) => {
    try {
      const res = await updateCustomerTransaction({
        variables: editingData,
      });
      if (res.data) {
        handleSuccess();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const createTransaction = async (transactionDetails: ITransactionData) => {
    try {
      const res = await createCustomerTransaction({ variables: transactionDetails });
      if (res.data?.createCustomerTransaction) {
        handleSuccess();
      }

      return res.data?.createCustomerTransaction;
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = async (e: React.ChangeEvent<unknown>) => {
    e.preventDefault();
    const DdueDate = new Date(dueDate);

    const data = {
      shopId: currentShop.shopId,
      customerId: customer?.customerId,
      receiptId: null,
      amount: isCredit ? Number(-amount) : Number(amount),
      smsReminderEnabled: isSmsChecked,
      emailReminderEnabled: isEmailChecked,
      paymentMethod: depositMethod,
      dueDate: dueDate ? DdueDate.toISOString() : null,
      isCredit,
      comment,
    };

    if (isEdit) {
      const editingData = {
        ...data,
        customerTransactionId: baseTrxn?.trxn?.customerTransactionId,
      };

      await updateTransaction(
        type === "credit"
          ? editingData
          : {
            ...editingData,
            parentCustomerTransactionId: baseTrxn?.trxn?.parentCustomerTransactionId,
          }
      );
    } else {
      if (
        type === "credit" &&
        customer?.creditLimit &&
        Number(amount) + totalCreditAmount > Number(customer?.creditLimit)
      ) {
        dispatch(
          toggleSnackbarOpen({ message: "Amount is higher than Credit Limit", color: "DANGER" })
        );
      } else {
        setShowModal(false);
        dispatch(isLoading(true));
        let updatedAvailableAmount = Number(amount);

        if (creditsIds && creditsIds.length > 0 && type === "deposit") {
          for (let i = 0; i < creditsIds.length; i++) {
            const creditId = creditsIds[i];
            if (updatedAvailableAmount <= 0) {
              dispatch(
                toggleSnackbarOpen({
                  message: "Deposit is all used up",
                  color: "WARNING",
                })
              );
              dispatch(isLoading(false));
              break;
            }

            const currentCredit = customer?.CustomerTransactions.find(
              (trxn: ICustomerTransactions) => trxn.customerTransactionId === creditId
            );

            const amountLeft =
              Math.abs(Number(currentCredit?.amount)) -
              Number(customerDeposits(creditId, customer?.CustomerTransactions).total);

            const usableData = {
              ...data,
              amount: updatedAvailableAmount > amountLeft ? amountLeft : updatedAvailableAmount,
              parentCustomerTransactionId: creditId,
            };

            const res = await createTransaction(usableData);

            if (res) {
              updatedAvailableAmount -= amountLeft;
            }
          }

          if (updatedAvailableAmount > 0) {
            await createTransaction({ ...data, amount: updatedAvailableAmount });
          } else {
            setShowModal(false);
          }

          setSelectedCreditIds!([]);
          dispatch(isLoading(false));
          dispatchIncreaseSyncCount(dispatch, tableUpdated);
        } else {
          await createTransaction(
            type === "credit"
              ? data
              : {
                ...data,
                parentCustomerTransactionId:
                  baseTrxn?.trxn?.parentCustomerTransactionId ||
                  baseTrxn?.trxn?.customerTransactionId,
              }
          );
        }
      }
    }
  };

  const replaceNegativeWithZero = (number: number) => (number < 0 ? 0 : number);
  const balance = replaceNegativeWithZero(totalCreditAmount - totalDepositAmount);

  const totalCreditValue = customer?.CustomerTransactions.reduce((total, obj) => {
    if (creditsIds?.includes(obj.customerTransactionId)) {
      const amountLeft =
        Math.abs(Number(obj.amount)) -
        Number(customerDeposits(obj.customerTransactionId, customer?.CustomerTransactions).total);
      return total + amountLeft;
    }
    return total;
  }, 0);

  const creditAmount = formatAmountIntl(
    undefined,
    baseTrxn?.amountleft || (totalCreditAmount > totalDepositAmount ? balance : 0) || 0
  );

  const remainingCredit = Number(customer?.creditLimit) - totalCreditAmount;
  const formattedCreditLimit = formatAmountIntl(
    undefined,
    remainingCredit > 0 ? remainingCredit : 0
  );

  return (
    <ModalBox onSubmit={(e) => handleSubmit(e)} width="30%">
      <h3
        style={{
          marginBottom: "32px",
          justifyContent: "space-between",
          alignItems: "center",
          display: "flex",
        }}
      >
        <span
          style={{
            fontSize: "1.2rem",
            fontWeight: "600",
            color: "#607087",
            textTransform: "capitalize",
          }}
        >
          {isEdit
            ? `Edit ${type} Transaction`
            : type === "credit"
              ? "Give Credit"
              : "Collect Deposit"}
        </span>
        <button
          onClick={() => setShowModal(false)}
          style={{ background: "transparent", border: "1px solid black" }}
        >
          <img src={cancelIcon} alt="" />
        </button>
      </h3>
      <Flex alignItems="center" gap="2rem" margin="0 0 1.5rem 0">
        <img src={Profile} alt="profile" />
        <Flex flexDirection="column" alignItems="start">
          <span
            style={{
              fontSize: "1rem",
              fontWeight: "500",
              color: "#130F26",
            }}
          >
            {customer?.customerName}
          </span>
          {!isCredit && (
            <span style={{ color: "#607087", fontStyle: "italic" }}>
              Deadline{" "}
              <span style={{ color: "#F65151" }}>
                {moment(baseTrxn?.trxn?.date).format("DD MMM YYYY")}
              </span>
            </span>
          )}
        </Flex>
      </Flex>
      <Flex flexDirection="column" gap="1rem">
        <InputWrapper>
          <label style={{ fontSize: "0.875rem", fontWeight: "400", color: "#9EA8B7" }}>
            {type === "credit"
              ? "How much are you giving to customer?"
              : "How much is this customer depositing?"}
          </label>
          <InputField
            placeholder={`${type === "credit" ? "Credit" : "Deposit"} Amount (₦)`}
            type="text"
            onChange={(e) => {
              validateInputNum(setAmount, e.target.value);
              // setAvailableAmount(Number(e.target.value));
            }}
            backgroundColor="#F4F6F9"
            size="lg"
            color="#607087"
            borderColor="transparent"
            borderRadius="0.75rem"
            borderSize="0px"
            fontSize="1rem"
            width="100%"
            noFormat
            value={amount}
          />
        </InputWrapper>
        {isCredit &&
          customer?.creditLimit &&
          Number(amount) + totalCreditAmount > Number(customer?.creditLimit) ? (
          <Text color="#F65151" style={{ fontStyle: "italic" }}>
            <b>Warning:</b> amount is higher than customer credit Limit
          </Text>
        ) : null}
        {!isCredit && (
          <div
            style={{
              padding: "0.35rem",
              color: "#F65151",
              background: "#FCEBEB",
              borderRadius: "5px",
              width: "fit-content",
              fontSize: "0.75rem",
            }}
          >
            Customer Owes: <span style={{ fontWeight: "500" }}>{creditAmount}</span>
          </div>
        )}
        {isCredit && customer?.creditLimit ? (
          <div
            style={{
              padding: "0.35rem",
              color: "#F65151",
              background: "#FCEBEB",
              borderRadius: "5px",
              width: "fit-content",
              fontSize: "0.75rem",
            }}
          >
            Credit Limit Remaining:{" "}
            <span style={{ fontWeight: "500" }}>{formattedCreditLimit}</span>
          </div>
        ) : null}
        <Flex flexDirection="column">
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: "400",
              color: "#607087",
              textTransform: "capitalize",
            }}
          >
            {type} Payment Method
          </p>
          <Flex gap="1rem">
            <DepositMethodOption
              label="Cash"
              isChecked={depositMethod === "cash"}
              onClick={() => setDepositMethod("cash")}
            />
            <DepositMethodOption
              label="POS"
              isChecked={depositMethod === "pos"}
              onClick={() => setDepositMethod("pos")}
            />
            <DepositMethodOption
              label="Transfer"
              isChecked={depositMethod === "transfer"}
              onClick={() => setDepositMethod("transfer")}
            />
          </Flex>
        </Flex>
        <Flex justifyContent="space-between">
          <div style={{ width: "48%" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: "400", color: "#607087" }}>
              Date
            </label>
            <InputWithIcon width="100%">
              <img src={CalendarIcon} alt="calendar" />
              <input
                className="no-default-icon"
                type="date"
                id="date"
                name="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </InputWithIcon>
          </div>
          {type === "credit" && (
            <div style={{ width: "48%" }}>
              <label style={{ fontSize: "0.875rem", fontWeight: "400", color: "#607087" }}>
                Due Date
              </label>
              <InputWithIcon width="100%">
                <img src={CalendarIcon} alt="calendar" />
                <input
                  className="no-default-icon"
                  type="date"
                  id="due-date"
                  name="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </InputWithIcon>
            </div>
          )}
        </Flex>
        <div>
          <label style={{ fontSize: "0.875rem", fontWeight: "400", color: "#607087" }}>
            Comments
          </label>
          <TextArea
            placeholder="Add comments (Optional)"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
          />
        </div>
        {type === "credit" && (
          <>
            <Flex justifyContent="space-between" alignItems="center">
              <p style={{ color: "#130F26", fontWeight: "500", fontSize: "12px" }}>
                Set reminder on this credit
              </p>
              <Toggle onToggle={toogleReminder} value={showReminders} />
            </Flex>
            {showReminders && (
              <Flex
                flexDirection="column"
                gap="0.75rem"
                padding="0.75rem 0"
                margin="0.75rem 0 0 0"
                style={{ borderTop: "1px solid #9EA8B7" }}
              >
                <Flex gap="0.5em">
                  <Checkbox
                    isChecked={isEmailChecked}
                    onChange={() => setEmailChecked(!isEmailChecked)}
                    color={isEmailChecked ? "#fff" : "#130F26"}
                    size="20px"
                    checkedColor={Colors.secondaryColor}
                  />
                  <p style={{ color: "#130F26", fontSize: "14px", fontWeight: "500" }}>
                    Email{" "}
                    <span
                      style={{
                        color: "#9EA8B7",
                        fontSize: "10px",
                        fontStyle: "italic",
                        fontWeight: "400",
                      }}
                    >
                      (Reminder will be sent a day before the deadline)
                    </span>
                  </p>
                </Flex>
                <Flex gap="0.5em">
                  <Checkbox
                    isChecked={isSmsChecked}
                    onChange={() => setSmsChecked(!isSmsChecked)}
                    color={isSmsChecked ? "#fff" : "#130F26"}
                    size="20px"
                    checkedColor={Colors.secondaryColor}
                  />
                  <p style={{ color: "#130F26", fontSize: "14px", fontWeight: "500" }}>
                    SMS{" "}
                    <span
                      style={{
                        color: "#9EA8B7",
                        fontSize: "10px",
                        fontStyle: "italic",
                        fontWeight: "400",
                      }}
                    >
                      (Reminder will be sent a day before the deadline)
                    </span>
                  </p>
                </Flex>
                <Flex
                  gap="0.5em"
                  padding="0.5rem"
                  backgroundColor="#F6F8FB"
                  borderRadius="8px"
                  alignItems="center"
                >
                  <LightBulb />
                  <p style={{ color: "#130F26", fontSize: "10px", fontWeight: "600" }}>
                    DO YOU KNOW?:
                    <span style={{ color: "#607087", fontWeight: "400", margin: "0 0.5rem" }}>
                      You can edit the reminder message? Go to the settings on your debt book top
                      right corner.
                    </span>
                  </p>
                </Flex>
              </Flex>
            )}
          </>
        )}
        <Button
          label={isEdit ? "Update" : `${type === "credit" ? "Credit" : "Deposit"}`}
          onClick={(e) => {
            if (Number(amount) === 0) {
              dispatch(
                toggleSnackbarOpen({ message: "You have to input an amount", color: "WARNING" })
              );
              return;
            }
            handleSubmit(e);
          }}
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
      </Flex>
    </ModalBox>
  );
};

export default AddTransaction;
