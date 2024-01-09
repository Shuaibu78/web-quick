/* eslint-disable indent */
import React, { Dispatch, FunctionComponent, SetStateAction, useEffect, useMemo, useState } from "react";
import arrowL from "../../../assets/ArrowL.svg";
import arrowR from "../../../assets/ArrowR.svg";
import emptyImage from "../../../assets/ThreeUser.svg";
import {
  CustomCont,
  Table,
  THead,
  TBody,
  TRow,
  Td,
  PerPage,
  CurrentPage,
  JumpTo,
} from "../../sales/style";
import { Flex } from "../../../components/receipt/style";
// import SearchInput from "../../../components/search-input/search-input";
import Checkbox from "../../../components/checkbox/checkbox";
import { PageControl } from "../../inventory/style";
import { ICustomer, ICustomerTransactions } from "../../../interfaces/inventory.interface";
import { sortList } from "../../../utils/helper.utils";
import { Button } from "../../../components/button/Button";
import { formatAmountIntl } from "../../../helper/format";
import { TEmpty } from "../../home/style";
import { useNavigate } from "react-router-dom";
import { Colors } from "../../../GlobalStyles/theme";
import { ButtonWithIcon } from "../../../components/top-nav/style";
import moment from "moment";
import { customerDeposits } from "../../../helper/customerTransactions.helper";
import CreditsModal from "./CreditsModal";

interface ItemsPageProps {
  setCustomer: Function;
  customer: ICustomer | undefined;
  setShowAddTransaction: Function;
  setShowCustomer: Function;
  setType: Function;
  totalCustomers?: number;
  customerList: ICustomer[];
  filteredCustomerList: ICustomer[];
  setIsEdit: Function;
  setShowAddCustomer: Function;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  perPage: number;
  setPerPage: Function;
  handleItemDelete: () => void;
  setSelectedCustomerIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCustomerIds: string[];
  setSelectedCreditIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedCreditIds: string[];
  searchVal: string;
  filterOption: string;
  containerHeight: number;
  setBaseTrxn: Dispatch<SetStateAction<{ trxn?: ICustomerTransactions, amountleft: number } | undefined>>
}

type DynamicObject = {
  [key: string]: boolean;
};

const CustomerList: FunctionComponent<ItemsPageProps> = ({
  setShowAddTransaction,
  setShowAddCustomer,
  setShowCustomer,
  totalCustomers,
  customerList,
  filteredCustomerList,
  setCustomer,
  setIsEdit,
  setType,
  setPage,
  page,
  perPage,
  setPerPage,
  selectedCustomerIds,
  setSelectedCustomerIds,
  selectedCreditIds,
  setSelectedCreditIds,
  handleItemDelete,
  searchVal,
  filterOption,
  containerHeight,
  setBaseTrxn,
  customer
}) => {
  const [selectedRow, setSelectedRow] = useState<DynamicObject>({});
  const [customerId, setCustomerId] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  // const [checkboxSelected, setCheckboxSelected] = useState<DynamicObject>({});
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const [allCreditsSelected, setAllCreditsSelected] = useState<boolean>(false);
  const [showCredits, setShowCredits] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (totalCustomers) {
      let initialSelectedState: { [key: string]: boolean } = {};
      customerList?.forEach((val) => {
        initialSelectedState = { ...initialSelectedState, [val.customerId]: false };
      });
      setSelectedRow(initialSelectedState);
      setTotalPages(Math.ceil(totalCustomers / (isNaN(perPage) ? 10 : perPage)));
    }
  }, [totalCustomers, perPage]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    setCustomer(customerList.find((entry) => entry.customerId === customerId));
  }, [customerId, customerList]);

  const displayCustomers = useMemo(() => {
    if (filteredCustomerList.length > 0 && searchVal !== "") {
      return filteredCustomerList;
    } else if (filteredCustomerList.length >= 0 && filterOption !== "All Credits") {
      return filteredCustomerList;
    } else {
      return customerList;
    }
  }, [filteredCustomerList, customerList, filterOption]);

  const getCustomerAmount = (id: string, transactionType: string) => {
    const tempCustomer = customerList.find((entry) => entry.customerId === id);
    if (!tempCustomer) {
      return null;
    }
    const { CustomerTransactions } = tempCustomer;
    return CustomerTransactions.reduce((total, transaction) => {
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

  function handleShowCredits(e: any, id: string) {
    e.stopPropagation();
    setShowCredits(true);
    setCustomerId(id);
  }

  const handleDeposit = (baseTrxn?: ICustomerTransactions) => {
    setShowAddTransaction(true);
    setType("deposit");
    if (baseTrxn) {
      const amount = `${baseTrxn?.amount}`.replace("-", "");
      const amountLeft = Number(amount) - Number(
        customerDeposits(
          baseTrxn?.parentCustomerTransactionId || baseTrxn?.customerTransactionId,
          customer?.CustomerTransactions
        ).total
      );
      setBaseTrxn!({ trxn: baseTrxn, amountleft: amountLeft });
    }
  };

  function handleCredit(e: any, id: string) {
    setCustomerId(id);
    e.stopPropagation();
    setShowAddTransaction(true);
    setType("credit");
  }

  const selectItem = (e: React.ChangeEvent<HTMLInputElement>, selectedCustomerId: string) => {
    e.stopPropagation();
    setShowCustomer(false);
    if (e.target.checked) {
      setSelectedCustomerIds([...selectedCustomerIds, selectedCustomerId]);
    } else {
      setSelectedCustomerIds(selectedCustomerIds.filter((id) => id !== selectedCustomerId));
    }
  };

  const selectCredits = (e: React.ChangeEvent<HTMLInputElement>, selectedCreditId: string) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedCreditIds([...selectedCreditIds, selectedCreditId]);
    } else {
      setSelectedCreditIds(selectedCreditIds.filter((id) => id !== selectedCreditId));
    }
  };

  const handleSelectAll = () => {
    if (selectedCustomerIds.length > 0 && selectedCustomerIds.length === customerList.length) {
      setSelectedCustomerIds([]);
      setAllSelected(false);
    } else {
      setSelectedCustomerIds(customerList.map((list) => list.customerId));
      setAllSelected(true);
    }
  };

  const handleSelectAllCredits = () => {
    if (
      selectedCreditIds.length > 0 &&
      selectedCreditIds.length === customer?.CustomerTransactions.length
    ) {
      setSelectedCreditIds([]);
      setAllCreditsSelected(false);
    } else {
      setSelectedCreditIds(
        customer?.CustomerTransactions.map((list) => {
          const amountLeft = Math.abs(Number(list.amount)) - Number(
            customerDeposits(
              list?.customerTransactionId,
              customer?.CustomerTransactions,
            ).total
          );
          if (list.isCredit && amountLeft > 0) {
            return list.customerTransactionId;
          } else {
            return "";
          }
        }).filter(id => id !== "") || []
      );
      setAllCreditsSelected(true);
    }
  };

  const navigateToCustomer = (id: string, e: any) => {
    const targetElement = e.target.closest("#checkbox");
    if (targetElement) {
      return;
    }
    navigate(`/dashboard/customers/single-customer/${id}`);
    setCustomerId(id);
    setShowCustomer(true);
  };

  return (
    <div>
      <Table style={{ position: "relative" }} height="70vh">
        {customerList.length > 0 ? (
          <>
            {selectedCustomerIds.length < 1 ? (
              <THead fontSize="0.875rem" style={{ padding: "0 0.5rem" }}>
                <Td width="4%">
                  <CustomCont imgHeight="100%" height="1.25rem">
                    <Checkbox
                      isChecked={allSelected}
                      onChange={handleSelectAll}
                      color="#130F26"
                      size="1.125rem"
                    />
                  </CustomCont>
                </Td>
                <Td width="20ch">
                  <span>Customer Name</span>
                </Td>
                <Td style={{ paddingLeft: "0.3125rem" }} width="20ch">
                  <span>Phone Number</span>
                </Td>
                <Td style={{ paddingLeft: "0.3125rem" }} width="15%">
                  <span>Total Credit Taken (₦)</span>
                </Td>
                <Td style={{ paddingLeft: "0.3125rem" }} width="12%">
                  <span>Amount Paid (₦)</span>
                </Td>
                <Td style={{ paddingLeft: "0.3125rem" }} width="15%">
                  <span>Balance Remainig (₦)</span>
                </Td>
                <Td style={{ paddingLeft: "0.625rem" }} width="12%">
                  <span>Date Created</span>
                </Td>
                <Td width="16%">Actions</Td>
              </THead>
            ) : (
              <THead fontSize="0.875rem" justifyContent="flex-start" style={{ columnGap: "1rem", padding: "0 0.5rem" }}>
                <Td width="4%">
                  <CustomCont imgHeight="100%" height="1.25rem">
                    <Checkbox
                      isChecked={allSelected}
                      onChange={handleSelectAll}
                      color={Colors.white}
                      size="1.125rem"
                      checkedColor={Colors.primaryColor}
                      borderColor={Colors.primaryColor}
                    />
                  </CustomCont>
                </Td>
                <Td width="10%">
                  <span style={{ cursor: "pointer" }} onClick={handleSelectAll}>
                    {selectedCustomerIds.length > 0 &&
                    selectedCustomerIds.length === customerList.length
                      ? "Unselect All"
                      : "Select All"}
                  </span>
                </Td>
                <Td width="40%">
                  <span
                    style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                    onClick={handleItemDelete}
                  >
                    <svg
                      fill="none"
                      stroke="red"
                      strokeWidth={1.5}
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      style={{ height: "1rem", width: "1rem", marginRight: "0.3125rem" }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                    <p style={{ color: "red" }} onClick={handleItemDelete}>
                      Delete Customers
                    </p>
                  </span>
                </Td>
              </THead>
            )}
          </>
        ) : null}
        <TBody height={`calc(${containerHeight}px - 9.375rem)`} width="100%" overflowY="scroll">
          {customerList.length < 1 ||
          (filteredCustomerList.length < 1 &&
            (searchVal !== "" || filterOption !== "All Credits")) ? (
            <TEmpty>
              {searchVal === "" && filterOption === "All Credits" && (
                <>
                  <img src={emptyImage} alt="empty-img" />
                  <h3>No Customer Owes You</h3>
                  <p>
                    Credit records will appear here when you make sales on
                    credit or give credit to customers
                  </p>
                  <ButtonWithIcon
                    onClick={() => {
                      setShowAddCustomer(true);
                      setIsEdit(false);
                      setCustomer(undefined);
                    }}
                    bgColor={Colors.secondaryColor}
                    style={{ margin: "10px 0" }}
                  >
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        backgroundColor: Colors.white,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <p style={{ fontSize: "20px", color: Colors.secondaryColor }}>+</p>
                    </div>
                    <span>Add New Customer</span>
                  </ButtonWithIcon>
                </>
              )}
              {searchVal !== "" && filterOption === "All Credits" && (
                <p style={{ fontSize: "1rem" }}>
                  Your Search <b>"{searchVal}"</b> does not match any customer name
                </p>
              )}
              {filterOption !== "All Credits" && (
                <p style={{ fontSize: "1rem" }}>
                  Your filter <b>"{filterOption}"</b> does not match any customer
                </p>
              )}
            </TEmpty>
          ) : (
            sortList(displayCustomers).map((val, i) => {
              const isDeposit =
                getCustomerAmount(val.customerId, "deposit")! >
                getCustomerAmount(val.customerId, "credit")!;

              const hasCredit =
                getCustomerAmount(val.customerId, "deposit")! <
                getCustomerAmount(val.customerId, "credit")!;
              return (
                <TRow
                  onClick={(e) => navigateToCustomer(val.customerId, e)}
                  key={i}
                  height="fit-content"
                  borderRadius="0"
                  style={{
                    border: "1px solid #F0F3F8",
                    margin: "1rem 0",
                    padding: "0.5rem",
                    borderRadius: "10px",
                    boxShadow: "1px 3px 7px -6px #130F26"
                  }}
                >
                  <Td id="checkbox" width="4%">
                    <CustomCont id="checkbox" imgHeight="100%">
                      <Checkbox
                        isChecked={selectedCustomerIds.includes(val?.customerId)}
                        onChange={(e) => {
                          e.stopPropagation();
                          selectItem(e, val?.customerId);
                        }}
                        checkedColor={Colors.primaryColor}
                        borderColor={Colors.primaryColor}
                        color={Colors.white}
                        size="1.125rem"
                      />
                    </CustomCont>
                  </Td>
                  <Td width="20ch">
                    <span>{val.customerName}</span>
                  </Td>
                  <Td style={{ paddingLeft: "5px" }} width="20ch">
                    <span>{val.phoneNumber || "N/A"}</span>
                  </Td>
                  <Td style={{ paddingLeft: "5px" }} width="15%" color="#FF5050">
                    <span>
                      {formatAmountIntl(undefined, getCustomerAmount(val.customerId, "credit")!)}
                    </span>
                  </Td>
                  <Td style={{ paddingLeft: "5px" }} width="12%" color="#219653">
                    <span>
                      {formatAmountIntl(undefined, getCustomerAmount(val.customerId, "deposit")!)}
                    </span>
                  </Td>
                  <Td style={{ paddingLeft: "5px" }} width="15%">
                    <span
                      style={{
                        color: isDeposit
                          ? "#219653"
                          : hasCredit
                          ? "#E47D05"
                          : Colors.primaryColor,
                      }}
                    >
                      {formatAmountIntl(
                        undefined,
                        Math.abs(
                          getCustomerAmount(val.customerId, "deposit")! -
                            getCustomerAmount(val.customerId, "credit")!
                        )
                      )}{" "}
                      {`${isDeposit ? "(You Owe)" : hasCredit ? "(Owing You)" : "(No Debt)"}`}
                    </span>
                  </Td>
                  <Td style={{ paddingLeft: "10px" }} width="12%">
                    <span>{val.createdAt && moment(val.createdAt).format("Do MMM YYYY. HH:MM a")}</span>
                  </Td>
                  <Td style={{ paddingLeft: "0.625rem" }} width="16%">
                    <Flex alignItems="center" gap="0.9375rem">
                      <Button
                        label="Give"
                        type="button"
                        onClick={(e) => handleCredit(e, val.customerId)}
                        backgroundColor="transparent"
                        size="sm"
                        color="#F55252"
                        borderColor="#F55252"
                        borderRadius="6px"
                        borderSize="2px"
                        fontSize="0.75rem"
                        height="1.5625rem"
                        width="fit-content"
                        border
                      />
                      <Button
                        label="Collect Deposit"
                        type="button"
                        onClick={(e) => handleShowCredits(e, val.customerId)}
                        backgroundColor="transparent"
                        size="sm"
                        color="#219653"
                        borderColor="#219653"
                        borderRadius="6px"
                        borderSize="2px"
                        fontSize="0.6rem"
                        height="1.5625rem"
                        width="10rem"
                        border
                      />
                    </Flex>
                  </Td>
                </TRow>
              );
            })
          )}
        </TBody>
      </Table>

      {customerList.length > 0 ? (
        <PageControl>
          <PerPage>
            <p>Per page</p>
            <input
              type="number"
              value={perPage}
              onChange={(e) => setPerPage(parseInt(e.target.value))}
            />
          </PerPage>
          <CurrentPage>
            <button style={{ opacity: `${page > 1 ? "1" : "0.4"}` }} onClick={handlePrevPage}>
              <img src={arrowL} alt="" />
            </button>
            <div>
              <p>
                <span>{page} </span>
                of {totalPages}
              </p>
            </div>
            <button
              onClick={handleNextPage}
              style={{
                opacity: `${page === totalPages ? "0.4" : "1"}`,
              }}
            >
              <img src={arrowR} alt="" />
            </button>
          </CurrentPage>
          <JumpTo>
            <p>Jump To</p>
            <div>
              <input
                type="number"
                min={1}
                style={{
                  paddingInline: "6px 0.625rem",
                  paddingBlock: "6px",
                  border: "1px solid black",
                }}
                onChange={(e) => setPage(Math.max(1, Number(e.target.value)))}
                placeholder="Page No."
              />
            </div>
          </JumpTo>
        </PageControl>
      ) : null}
      {showCredits &&
        <CreditsModal
          customer={customer}
          setShowCredits={setShowCredits}
          handleDeposit={handleDeposit}
          selectedCreditIds={selectedCreditIds}
          selectCredits={selectCredits}
          selectAll={handleSelectAllCredits}
        />
      }
      {/* {showFilterModal && (
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
      )} */}
    </div>
  );
};

export default CustomerList;
