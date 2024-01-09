import React, { FunctionComponent, useState } from "react";
import { Header, Box } from "./style";
import cancel from "../../assets/cancel.svg";
import { InputField } from "../../components/input-field/input";
import CustomDropdown from "../../components/custom-dropdown/custom-dropdown";
import Calender from "../../assets/Calendar.svg";
import dropIcon2 from "../../assets/dropIcon2.svg";
import Time from "../../assets/time.svg";
import { Button } from "../../components/button/Button";
import { InputWrapper } from "../../pages/login/style";

interface IProps {
  options?: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ExpenseModal: FunctionComponent<IProps> = ({ options, setOpenModal }) => {
  const expenseOptions = ["Category", "Category 2"];
  const [selectedCategory, setSelectedCategory] = useState<number>(-1);
  const incomeOptions = ["What is the income name?"];
  const expenseO = ["Whats the expenses for?"];
  const [selectedIncome, setSelectedIncome] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState(0);
  const dateOptions = ["12/2/2022", "Testing 1"];
  const [selectedTime, setSelectedTime] = useState(0);
  const [remarks, setRemarks] = useState("");
  const timeOptions = ["02:15 pm", "Testing 1"];
  const [income, setIncome] = useState("");
  const [expense, setExpense] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [cashCategory, setCashCategory] = useState("");
  const [incomeSource, setIncomeSource] = useState("");

  return (
    <Box>
      <Header>
        <div className="cancelCont" onClick={() => setOpenModal(false)}>
          <img src={cancel} alt="" />
        </div>
        {options === "expense" && <h3>Record New Expense</h3>}
        {options === "income" && <h3>Record New Cash Inflow</h3>}
        {options === "addExpenseCategory" && <h3>Add New Expense Category</h3>}
        {options === "addCashCategory" && <h3>Add New Cash Inflow Category</h3>}
      </Header>
      <form onSubmit={(e) => e.preventDefault()}>
        {options === "expense" && (
          <CustomDropdown
            width="100%"
            color="#8196B3"
            containerColor="#F4F6F9"
            borderRadius="0.75rem"
            height="45px"
            dropdownIcon={dropIcon2}
            options={expenseO}
            setValue={setSelectedIncome}
            fontSize="0.875rem"
            selected={selectedIncome}
            margin="0 0 0.875rem 0"
            padding="0.625rem 1.25rem"
          />
        )}
        {options === "income" && (
          <CustomDropdown
            width="100%"
            color="#8196B3"
            containerColor="#F4F6F9"
            borderRadius="0.75rem"
            height="45px"
            dropdownIcon={dropIcon2}
            options={incomeOptions}
            setValue={setSelectedIncome}
            fontSize="0.875rem"
            selected={selectedIncome}
            margin="0 0 0.875rem 0"
            padding="0.625rem 1.25rem"
          />
        )}
        {options === "income" && (
          <InputField
            type="text"
            placeholder="How much is the income?"
            backgroundColor="#F4F6F9"
            borderRadius="0.75rem"
            size="lg"
            fontSize="0.875rem"
            color="#8196B3"
            width="100%"
            onChange={(e) => {
              setIncome(e.target.value);
            }}
            value={income}
          />
        )}
        {options === "expense" && (
          <InputField
            type="text"
            placeholder="How much did it cost?"
            backgroundColor="#F4F6F9"
            borderRadius="0.75rem"
            size="lg"
            fontSize="0.875rem"
            color="#8196B3"
            width="100%"
            value={expense}
            onChange={(e) => {
              setExpense(e.target.value);
            }}
          />
        )}
        {options === "addExpenseCategory" && (
          <InputField
            type="text"
            placeholder="Expense Category Name"
            backgroundColor="#F4F6F9"
            borderRadius="0.75rem"
            size="lg"
            fontSize="0.875rem"
            color="#8196B3"
            width="100%"
            value={expenseCategory}
            onChange={(e) => setExpenseCategory(e.target.value)}
          />
        )}
        {options === "addCashCategory" && (
          <InputField
            type="text"
            placeholder="Cash Inflow Category Name"
            backgroundColor="#F4F6F9"
            borderRadius="0.75rem"
            size="lg"
            fontSize="0.875rem"
            color="#8196B3"
            width="100%"
            value={cashCategory}
            onChange={(e) => setCashCategory(e.target.value)}
          />
        )}
        {options === "income" && (
          <InputField
            type="text"
            placeholder="Source of Income?"
            backgroundColor="#F4F6F9"
            borderRadius="0.75rem"
            size="lg"
            fontSize="0.875rem"
            color="#8196B3"
            width="100%"
            value={incomeSource}
            onChange={(e) => setIncomeSource(e.target.value)}
          />
        )}
        {options === "expense" && (
          <CustomDropdown
            width="100%"
            color="#8196B3"
            containerColor="#F4F6F9"
            borderRadius="0.75rem"
            height="45px"
            dropdownIcon={dropIcon2}
            options={expenseOptions}
            setValue={setSelectedCategory}
            fontSize="0.875rem"
            selected={selectedCategory}
            placeholder="Select Category"
            margin="0 0 0.875rem 0"
            padding="0.625rem 1.25rem"
          />
        )}
        {(options === "income" || options === "expense") && (
          <>
            <div>
              <CustomDropdown
                width="48%"
                height="2.5rem"
                fontSize="0.875rem"
                borderRadius="0.75rem"
                containerColor="#F4F6F9"
                color="#8196B3"
                selected={selectedDate}
                setValue={setSelectedDate}
                options={dateOptions}
                icon={Calender}
                margin="0px"
                padding="0.625rem 0.625rem"
              />
              <CustomDropdown
                width="48%"
                height="2.5rem"
                fontSize="0.875rem"
                borderRadius="0.75rem"
                containerColor="#F4F6F9"
                color="#8196B3"
                selected={selectedTime}
                setValue={setSelectedTime}
                options={timeOptions}
                icon={Time}
                margin="0px"
                padding="0.625rem 0.625rem"
              />
            </div>
            <textarea
              name="remarks"
              id="remarks"
              placeholder="Remarks (Optional)"
              rows={5}
              onChange={(e) => setRemarks(e.target.value)}
            />
          </>
        )}
        <Button
          label="Save"
          onClick={() => setOpenModal(false)}
          backgroundColor="#FFBE62"
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
  );
};

export default ExpenseModal;
