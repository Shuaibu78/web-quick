import React from "react";
import { Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import cancelIcon from "../../../assets/cancel.svg";
import { CancelButton } from "../style";
import { Colors } from "../../../GlobalStyles/theme";
import { CustomSearchDropdown, Customer, InputContainer, Nav } from "./style";
import User from "../../../assets/customer.svg";
import Add from "../../../assets/circular_add.svg";
import { ICustomer } from "../../../interfaces/inventory.interface";

interface IAddCustomer {
  setShowNewCredit: (value: boolean) => void;
  setShowAddCustomer: (value: boolean) => void;
  setSearchString: (value: string) => void;
  searchString: string;
  customerOption?: ICustomer[];
  setCustomerSelected: Function;
  setShowSelectCustomer: Function;
  page: number;
  setPage: Function;
  totalCustomers: number;
}

const SelectCustomer: React.FC<IAddCustomer> = ({
  customerOption,
  setCustomerSelected,
  setShowSelectCustomer,
  setShowNewCredit,
  setShowAddCustomer,
  totalCustomers,
  searchString,
  setSearchString,
  setPage,
  page,
}) => {
  const handleSelectCustomer = (customer: ICustomer) => {
    setCustomerSelected(customer);
    setShowSelectCustomer(false);
    setShowNewCredit(true);
  };

  const handleSearch = (term: string) => {
    setSearchString(term);
  };

  const totalPages = Math.ceil(totalCustomers / 10);

  const handleNextPage = () => {
    setPage((prev: number) => {
      if (prev < totalPages) {
        return prev + 1;
      }
      return prev;
    });
  };

  const handlePrevPage = () => {
    setPage((prev: number) => {
      if (prev <= totalPages && page > 0) {
        return prev - 1;
      }
      return prev;
    });
  };

  return (
    <Flex bg="white" borderRadius="1rem" direction="column" padding="1rem" width="25rem">
      <Flex alignItems="center" justifyContent="space-between" width="100%">
        <Span color={Colors.primaryColor} fontSize="1.4rem" fontWeight="600">
          Select Customer
        </Span>
        <CancelButton
          onClick={() => {
            setShowSelectCustomer(false);
            setPage(1);
          }}
        >
          <img src={cancelIcon} alt="" />
        </CancelButton>
      </Flex>

      <>
        <CustomSearchDropdown>
          <label>Search customer name... </label>
          <InputContainer>
            <input
              type="text"
              value={searchString}
              placeholder="Search or select customer"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </InputContainer>
        </CustomSearchDropdown>

        <Flex width="100%" alignItems="center" justifyContent="space-between" margin="1rem 0">
          <Span>{totalCustomers} Customers</Span>
          <Flex
            alignItems="center"
            gap="0.5rem"
            width="fit-content"
            cursor="pointer"
            onClick={() => setShowAddCustomer(true)}
          >
            <img src={Add} alt="" />
            <Span color={Colors.secondaryColor}>Add New Customer</Span>
          </Flex>
        </Flex>

        <Flex width="100%" maxHeight="20rem" overflowY="scroll" direction="column" gap="0.5rem">
          {customerOption && customerOption?.length < 1 && (
            <Flex width="100%" alignItems="center" justifyContent="center" minHeight="10rem">
              <Span color={Colors.blackLight} fontSize="1.1rem">
                No customers found
              </Span>
            </Flex>
          )}
          {customerOption?.map((customer) => {
            return (
              <Customer key={customer.customerId} onClick={() => handleSelectCustomer(customer)}>
                <img src={User} alt="" />
                <Span color={Colors.primaryColor}>{customer.customerName}</Span>
              </Customer>
            );
          })}
          <Flex
            alignItems="center"
            width="100%"
            justifyContent="space-between"
            margin="0.7rem 0 0 0"
          >
            <Nav disabled={page <= 1} onClick={handlePrevPage}>
              Prev
            </Nav>
            <Nav disabled={page >= totalPages} onClick={handleNextPage}>
              Next
            </Nav>
          </Flex>
        </Flex>
      </>
    </Flex>
  );
};

export default SelectCustomer;
