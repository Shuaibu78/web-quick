import React, { useState } from "react";
import CustomDropdown from "../../components/custom-dropdown/custom-dropdown";
import TopNav from "../../components/top-nav/top-nav";
import dropIcon from "../../assets/dropicon.svg";
import { TBtnCont } from "../sales/style";
import searchIcon from "../../assets/search.svg";
import filterIcon from "../../assets/Filter.svg";
import Calender from "../../assets/Calendar.svg";
import dropIcon2 from "../../assets/dropIcon2.svg";
import { FilterModal, ListItem, MenuBar, Title } from "./style";
import Table from "./Table/table";
import { Flex } from "../../components/receipt/style";
import SearchInput from "../../components/search-input/search-input";
import cancel from "../../assets/cancel.svg";
import Checkbox from "../../components/checkbox/checkbox";

type DynamicObject = {
  [key: string]: boolean;
};

const ReportPage = () => {
  const salesOptions = ["Export as PDF", "Testing 1"];
  const categoryOptions = ["Select Category", "Testing 1"];
  const usersOptions = ["All Users", "Testing 1"];
  const dateOptions = ["All-Time", "Testing 1"];
  const [selectedSales, setSelectedSales] = useState(0);
  const [selectedStore, setSelectedStore] = useState(0);
  const [checkboxSelected, setCheckboxSelected] = useState<DynamicObject>({});
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showTable, setShowTable] = useState(true);

  return (
    <>
      <div>
        <TopNav header="Reports" />
      </div>
      <MenuBar>
        <Title>{showTable ? "All Generated Reports" : "Generate Reports"} </Title>
        <CustomDropdown
          width="160px"
          height="2.5rem"
          fontSize="0.875rem"
          borderRadius="0.75rem"
          containerColor="#F4F6F9"
          color="#8196B3"
          selected={selectedStore}
          setValue={setSelectedStore}
          options={categoryOptions}
          dropdownIcon={dropIcon2}
          margin="0.625rem"
          padding="0 0.625rem"
        />
        <CustomDropdown
          width="9.375rem"
          height="2.5rem"
          fontSize="0.875rem"
          borderRadius="0.75rem"
          containerColor="#F4F6F9"
          color="#8196B3"
          selected={selectedStore}
          setValue={setSelectedStore}
          options={usersOptions}
          dropdownIcon={dropIcon2}
          margin="0.625rem"
          padding="0 0.625rem"
        />
        <CustomDropdown
          width="9.375rem"
          height="2.5rem"
          fontSize="0.875rem"
          borderRadius="0.75rem"
          containerColor="#F4F6F9"
          color="#8196B3"
          selected={selectedStore}
          setValue={setSelectedStore}
          options={dateOptions}
          dropdownIcon={dropIcon2}
          icon={Calender}
          margin="0.625rem"
          padding="0 0.625rem"
        />
        <CustomDropdown
          width="160px"
          height="2.5rem"
          fontSize="0.875rem"
          borderRadius="0.75rem"
          containerColor="#130F26"
          color="#fff"
          selected={selectedSales}
          setValue={setSelectedSales}
          options={salesOptions}
          dropdownIcon={dropIcon}
          iconContainerColor="#34373A"
          margin="0.625rem"
          padding="0 0.625rem"
        />
        <div>
          <TBtnCont mdMargin="0.625rem 0">
            <button>
              <img src={searchIcon} alt="" />
            </button>
            <button onClick={() => setShowFilterModal(true)}>
              <img src={filterIcon} alt="" />
            </button>
          </TBtnCont>
        </div>
      </MenuBar>
      <Table showTable={showTable} />

      {showFilterModal && (
        <FilterModal>
          <Flex justifyContent="space-between" padding="0 0 1.25rem 0">
            <h3>Filter</h3>
            <button onClick={() => setShowFilterModal(false)}>
              <img src={cancel} alt="" />
            </button>
          </Flex>
          <SearchInput
            placeholder="Receipt No."
            borderRadius="0.75rem"
            height="45px"
            width="100%"
            fontSize="0.875rem"
            handleSearch={() => {}}
          />
          <h4>By Staff</h4>
          <ListItem>
            <Checkbox
              isChecked={!!checkboxSelected["0"]}
              onChange={(e) => {
                setCheckboxSelected((state: DynamicObject) => {
                  return { ...state, 0: e.target.checked };
                });
              }}
              color="#130F26"
              size=""
            />
            <p>All Staff</p>
          </ListItem>
          <ListItem>
            <Checkbox
              isChecked={!!checkboxSelected["1"]}
              onChange={(e) => {
                setCheckboxSelected((state: DynamicObject) => {
                  return { ...state, 1: e.target.checked };
                });
              }}
              color="#130F26"
              size=""
            />
            <p>
              Kunle Adebayo <span>Sales Person 1</span>
            </p>
          </ListItem>
          <ListItem>
            <Checkbox
              isChecked={!!checkboxSelected["2"]}
              onChange={(e) => {
                setCheckboxSelected((state: DynamicObject) => {
                  return { ...state, 2: e.target.checked };
                });
              }}
              color="#130F26"
              size=""
            />
            <p>
              Janet Jackson <span>Sales Person 2</span>
            </p>
          </ListItem>
          <ListItem>
            <Checkbox
              isChecked={!!checkboxSelected["3"]}
              onChange={(e) => {
                setCheckboxSelected((state: DynamicObject) => {
                  return { ...state, 3: e.target.checked };
                });
              }}
              color="#130F26"
              size=""
            />
            <p>
              Queen Latifah <span>Cashier</span>
            </p>
          </ListItem>
        </FilterModal>
      )}
    </>
  );
};

export default ReportPage;
