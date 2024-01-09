/* eslint-disable max-len */
import React, { FunctionComponent, useEffect, useState } from "react";
import { Box, Header } from "./style";
import cancel from "../../../assets/cancel.svg";
import { InputField } from "../../../components/input-field/input";
import CustomDropdown from "../../../components/custom-dropdown/custom-dropdown";
import { Button } from "../../../components/button/Button";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_CASH_INFLOW,
  CREATE_EXPENDITURE,
  GET_ALL_EXPENDITURE_CATEGORY,
  UPDATE_CASH_INFLOW,
  UPDATE_EXPENDITURE,
} from "../../../schema/expenses.schema";
import {
  ICashInflow,
  IExpenditure,
  IExpenditureCategory,
} from "../../../interfaces/expenses.interface";
import { isLoading } from "../../../app/slices/status";
import { ModalBox } from "../../settings/style";
import { InputWrapper } from "../../login/style";
import dropIcon from "../../../assets/dropIcon2.svg";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { validateInputNum } from "../../../utils/formatValues";
import { Colors } from "../../../GlobalStyles/theme";
import CustomDate from "../../../components/date-picker/customDatePicker";
import { CheckBox, CheckButton, Flex } from "../../../GlobalStyles/CustomizableGlobal.style";

interface IProps {
  type?: string;
  mode?: string;
  item?: any;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: Function;
}

const paymentOptions = ["CASH", "POS", "TRANSFER"];

const AddNewCard: FunctionComponent<IProps> = ({ type, mode, setOpenModal, refetch, item }) => {
  const [incomeName, setIncomeName] = useState("");
  const [incomeSource, setIncomeSource] = useState("");
  const [incomeAmount, setIncomeAmount] = useState("");
  const [remark, setRemark] = useState("");
  const [expenseName, setExpenseName] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number>(-1);
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [dateAdded, setDateAdded] = useState<Date>(new Date());
  const [paymentMethod, setPaymentMethod] = useState<string>(paymentOptions[0]);

  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useAppDispatch();

  const { data, refetch: rCategory } = useQuery<{
    getAllExpenditureCategory: [IExpenditureCategory];
  }>(GET_ALL_EXPENDITURE_CATEGORY, {
    variables: {
      shopId: currentShop?.shopId,
    },
    skip: !currentShop?.shopId,
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  useEffect(() => {
    rCategory();
    if (data) {
      const categoryNames: string[] = [];
      data.getAllExpenditureCategory.forEach((val) => {
        val.expenditureCategoryName && categoryNames.push(val.expenditureCategoryName);
      });
      setCategoryOptions(categoryNames);
    }
  }, [data]);

  const [createExpenditure] = useMutation<{ createExpenditure: IExpenditure }>(CREATE_EXPENDITURE, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const [createCashInflow] = useMutation<{ createCashInFlow: ICashInflow }>(CREATE_CASH_INFLOW, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });
  const [updateCashInflow] = useMutation<{ UpdateCashInFlow: ICashInflow }>(UPDATE_CASH_INFLOW, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const [updateExpenditure] = useMutation<{ UpdateExpenditure: IExpenditure }>(UPDATE_EXPENDITURE, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleSubmit = () => {
    if (
      (type === "expense" && !parseFloat(expenseAmount)) ||
      (type === "income" && !parseFloat(incomeAmount))
    ) {
      dispatch(toggleSnackbarOpen("please fill the necessary fields"));
      return;
    }
    dispatch(isLoading(true));
    if (type === "expense") {
      createExpenditure({
        variables: {
          remark,
          shopId: currentShop?.shopId,
          date: dateAdded,
          expenditureCategoryId:
            selectedCategory >= 0
              ? data?.getAllExpenditureCategory[selectedCategory].expenditureCategoryId
              : null,
          name: expenseName,
          amount: parseFloat(expenseAmount),
          paymentMethod: paymentMethod,
        },
      })
        .then((res) => {
          if (res.data) {
            setOpenModal(false);
            dispatch(isLoading(false));
            dispatch(toggleSnackbarOpen("Successful"));
            refetch();
          }
        })
        .catch((error) => {
          dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
        });
    } else {
      createCashInflow({
        variables: {
          income: incomeName,
          amount: parseFloat(incomeAmount),
          date: dateAdded,
          incomeSource,
          remark,
          shopId: currentShop?.shopId,
          paymentMethod: paymentMethod,
        },
      })
        .then((res) => {
          if (res.data) {
            setOpenModal(false);
            dispatch(isLoading(false));
            dispatch(toggleSnackbarOpen("Successfully Created"));
            refetch();
          }
        })
        .catch((error) => {
          dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
        });
    }
  };

  const handleUpdate = () => {
    if (
      (type === "expense" && !item.expenditureId && !expenseName) ||
      (type === "income" && !parseFloat(incomeAmount))
    ) {
      dispatch(toggleSnackbarOpen("Please fill the necessary fields"));
      return;
    }

    dispatch(isLoading(true));
    if (type === "expense") {
      updateExpenditure({
        variables: {
          remark,
          shopId: currentShop?.shopId,
          expenditureCategoryId:
            data?.getAllExpenditureCategory[selectedCategory]?.expenditureCategoryId,
          expenditureId: item?.inflowOrExpenditureId,
          expenditureName: expenseName,
          amount: parseFloat(expenseAmount),
        },
      })
        .then((res) => {
          if (res.data) {
            setOpenModal(false);
            dispatch(isLoading(false));
            dispatch(toggleSnackbarOpen("Successfully Updated"));
            refetch();
          }
        })
        .catch((error) => {
          dispatch(isLoading(false));
          dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
        });
    } else {
      updateCashInflow({
        variables: {
          income: incomeName,
          amount: parseFloat(incomeAmount),
          cashInflowId: item.inflowOrExpenditureId,
          incomeSource,
          remark,
          shopId: currentShop?.shopId,
        },
      })
        .then((res) => {
          if (res.data) {
            setOpenModal(false);
            dispatch(isLoading(false));
            dispatch(toggleSnackbarOpen("Successfully Updated"));
            refetch();
          }
        })
        .catch((error) => {
          dispatch(isLoading(false));
          dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
        });
    }
  };

  useEffect(() => {
    setExpenseName(item?.name || "");
    setExpenseAmount(item?.amount || "");
    setRemark(item?.remark || "");
    setIncomeAmount(item?.amount || "");
    setIncomeName(item?.name || "");
    setIncomeSource(item?.incomeSource || "");
    setPaymentMethod(item?.paymentMethod || "CASH");
    const categoryIndex = categoryOptions.findIndex((category) => category === item?.category);
    setSelectedCategory(categoryIndex);
  }, [categoryOptions]);

  const textAreaStyles = {
    outline: "none",
    border: "none",
    backgroundColor: Colors.tabBg,
    padding: "0.75rem",
  };

  return (
    <ModalBox width="25rem">
      <Header>
        <h3>
          {mode === "edit" ? " Edit" : "Record New"}{" "}
          {type === "expense" ? "Expense" : "Cash Inflow"}
        </h3>

        <div className="cancelCont" onClick={() => setOpenModal(false)}>
          <img src={cancel} alt="" />
        </div>
      </Header>
      <Flex direction="column" gap="1.5rem">
        <Flex width="100%" alignItems="center" justifyContent="space-between" gap="2em">
          <CustomDate
            label="Date Added"
            height="2.5rem"
            startDate={dateAdded}
            background="#f4f6f9"
            border="none"
            width="100%"
            showTimeInput
            timeIntervals={15}
            timeFormat="HH:mm"
            dateFormat="MM/dd/yyyy h:mm"
            setStartDate={(d: Date) => setDateAdded(d)}
          />
        </Flex>
        {type === "income" && (
          <>
            <InputWrapper>
              <InputField
                type="text"
                label="Income name"
                placeholder="Income name"
                noFormat
                top="-0.9375rem"
                size="lg"
                backgroundColor="#F4F6F9"
                color="#353e49"
                borderColor="#8196B3"
                borderRadius="12px"
                borderSize="1px"
                border
                fontSize="16px"
                width="100%"
                value={incomeName}
                onChange={(e) => setIncomeName(e.target.value)}
              />
            </InputWrapper>
            <InputWrapper>
              <InputField
                type="text"
                label="Amount"
                placeholder="Amount"
                top="-0.9375rem"
                size="lg"
                backgroundColor="#F4F6F9"
                color="#353e49"
                borderColor="#8196B3"
                borderRadius="12px"
                borderSize="1px"
                border
                fontSize="16px"
                width="100%"
                value={incomeAmount}
                onChange={(e) => validateInputNum(setIncomeAmount, e.target.value)}
              />
            </InputWrapper>
          </>
        )}
        {type === "expense" && (
          <>
            <InputWrapper>
              <InputField
                type="text"
                label="What's the expense for?"
                placeholder="What's the expense for?"
                top="-0.9375rem"
                size="lg"
                backgroundColor="#F4F6F9"
                color="#353e49"
                borderColor="#8196B3"
                borderRadius="0.75rem"
                borderSize="1px"
                border
                fontSize="1rem"
                width="100%"
                value={expenseName}
                onChange={(e) => setExpenseName(e.target.value)}
              />
            </InputWrapper>
            <InputWrapper>
              <InputField
                type="text"
                label="Amount"
                placeholder="Amount"
                top="-0.9375rem"
                size="lg"
                backgroundColor="#F4F6F9"
                color="#353e49"
                borderColor="#8196B3"
                borderRadius="0.75rem"
                borderSize="1px"
                border
                fontSize="1rem"
                width="100%"
                value={expenseAmount}
                onChange={(e) => validateInputNum(setExpenseAmount, e.target.value)}
              />
            </InputWrapper>
          </>
        )}
        {type === "expense" && (
          <InputWrapper>
            <CustomDropdown
              width="100%"
              height="3.125rem"
              fontSize="0.875rem"
              label="Category"
              borderRadius="0.75rem"
              containerColor="#F4F6F9"
              color="#8196B3"
              selected={selectedCategory}
              setValue={setSelectedCategory}
              options={categoryOptions}
              dropdownIcon={dropIcon}
              placeholder="Select Category"
              margin="0.625rem 0px 0px"
              padding="0 0.625rem"
            />
          </InputWrapper>
        )}

        <Flex alignItems="center" justifyContent="flex-start" gap="1rem" width="100%">
          {paymentOptions.map((option, idx) => {
            return (
              <CheckButton
                key={idx}
                height="2.5rem"
                borderRadius="0.625rem"
                padding="0 0.625rem"
                width="fit-content"
                fontSize="0.6rem"
                alignItems="center"
                justifyContents="flex-start"
                border="none"
                color={paymentMethod === option ? Colors.green : "#9EA8B7"}
                backgroundColor={paymentMethod === option ? Colors.lightGreen : Colors.tabBg}
                onClick={() => {
                  setPaymentMethod(option);
                }}
              >
                <CheckBox
                  radius="50%"
                  margin="0 0.3rem 0 0"
                  color={Colors.green}
                  htmlFor={option}
                  checked={option === paymentMethod}
                  style={{ margin: "0 !important" }}
                >
                  <span></span>
                </CheckBox>
                <input type="checkbox" id={option} hidden />
                <p id="name" style={{ fontSize: "0.9rem" }}>
                  {option}
                </p>
              </CheckButton>
            );
          })}
        </Flex>
        <textarea
          name="remarks"
          id="remarks"
          placeholder="Remarks (Optional)"
          rows={5}
          style={textAreaStyles}
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
        />
        <Button
          label={mode === "edit" ? "Update" : "Save"}
          onClick={() => {
            mode === "edit" ? handleUpdate() : handleSubmit();
          }}
          backgroundColor={Colors.primaryColor}
          size="lg"
          fontSize="1rem"
          borderRadius="0.75rem"
          width="100%"
          color="#fff"
          borderColor="transparent"
          borderSize="0px"
        />
      </Flex>
    </ModalBox>
  );
};

export default AddNewCard;
