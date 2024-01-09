import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import TopNav from "../../components/top-nav/top-nav";
import Calendar from "../../assets/Calendar2.svg";
import ArrowUp from "../../assets/ArrowUp.svg";
import ArrowDown from "../../assets/ArrowDown2.svg";
import filterIcon from "../../assets/FilterIconGroup.svg";
import dropIcon from "../../assets/dropIcon2.svg";
import CustomerList from "./customer-list";
import { ButtonContainer, DeleteContainer } from "../inventory/style";
import { Flex } from "../../components/receipt/style";
import { ModalContainer } from "../settings/style";
import NewCustomer from "./new-customer";
import ViewCustomer from "./view-customer";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getCurrentShop, increaseSyncCount } from "../../app/slices/shops";
import { useMutation, useQuery } from "@apollo/client";
import {
  DELETE_CUSTOMER,
  DELETE_MULTIPLE_CUSTOMER,
  GET_ALL_CUSTOMERS,
  GET_TOTAL_CREDITS,
  GET_TOTAL_DEPOSITS,
} from "../../schema/customer.schema";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import AddTransaction from "./add-transaction";
import ModalSidebar from "../inventory/product-list/modal";
import { ICustomer, ICustomerTransactions } from "../../interfaces/inventory.interface";
import { isLoading } from "../../app/slices/status";
import PopupCard from "../../components/popUp/PopupCard";
import { Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../GlobalStyles/theme";
import { Button } from "../../components/button/Button";
import { syncTotalTableCount } from "../../helper/comparisons";
import CustomDropdown from "../../components/custom-dropdown/custom-dropdown";
import SearchInput from "../../components/search-input/search-input";
import { Body } from "../expenses/style";
import { formatAmountIntl } from "../../helper/format";
import { SalesCard } from "../home/style";
import { ButtonWithIcon } from "../../components/top-nav/style";
import BankSettings from "./bank-settings";
import { GET_FEATURE_COUNT } from "../../schema/subscription.schema";
import { setFeatureCount } from "../../app/slices/subscriptionslice";

const { blackLight, red, white } = Colors;

const Custormers: FunctionComponent = () => {
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [showCustomer, setShowCustomer] = useState(false);
  const currentShop = useAppSelector(getCurrentShop);
  const [customer, setCustomer] = useState<ICustomer | undefined>();
  const [showAddTransaction, setShowAddTransaction] = useState<boolean>(false);
  const [type, setType] = useState<string>("");
  const [perPage, setPerPage] = useState(50);
  const [deletePopup, setDeletePopup] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [isEdit, setIsEdit] = useState(false);
  const [customerList, setCustomerList] = useState<ICustomer[]>([]);
  const [filteredCustomerList, setFilteredCustomerList] = useState<ICustomer[]>([]);
  const [searchVal, setSearchVal] = useState<string>("");
  const [optionSelected, setOptionSelected] = useState(0);
  const syncTableUpdateCount = useAppSelector((state) =>
    syncTotalTableCount(state.shops.syncTableUpdateCount, ["CustomerTransaction", "Customer"])
  );
  const [selectedCustomerIds, setSelectedCustomerIds] = useState<string[]>([]);
  const [selectedCreditIds, setSelectedCreditIds] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const [navbarHeight, setNavBarHeight] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showBankDetails, setShowBankDetails] = useState<boolean>(false);
  const [baseTrxn, setBaseTrxn] = useState<{ trxn?: ICustomerTransactions, amountleft: number }>();

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && containerRef.current.offsetHeight) {
        setContainerHeight(containerRef.current.offsetHeight);
      }
    };
    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const { data, refetch } = useQuery<{
    getAllCustomers: {
      customers: [ICustomer];
      totalCustomers: number;
    };
  }>(GET_ALL_CUSTOMERS, {
    variables: {
      shopId: currentShop?.shopId,
      page,
      limit: isNaN(perPage) ? 50 : perPage,
    },
    onError(error) {
      dispatch(
        toggleSnackbarOpen({
          message: error?.message || error?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    },
  });

  const { data: totalCustomers, refetch: rTotalCustomers } = useQuery<{
    getAllCustomers: {
      totalCustomers: number;
    };
  }>(GET_ALL_CUSTOMERS, {
    variables: {
      shopId: currentShop?.shopId,
    },
    onError(error) {
      dispatch(
        toggleSnackbarOpen({
          message: error?.message || error?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    },
  });

  const { refetch: refetchFeatureCount } = useQuery<{
    getFeatureCount: { inventoriesCount: number; debtCount: number };
  }>(GET_FEATURE_COUNT, {
    variables: {
      shopId: currentShop?.shopId,
    },
    fetchPolicy: "cache-and-network",
    onCompleted(arrData) {
      dispatch(setFeatureCount(arrData?.getFeatureCount ?? {}));
    },
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const { data: totalCreditData, refetch: rCredits } = useQuery<{
    getTotalCredits: number;
  }>(GET_TOTAL_CREDITS, {
    variables: {
      shopId: currentShop?.shopId,
    },
    onError(error) {
      dispatch(
        toggleSnackbarOpen({
          message: error?.message || error?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    },
  });

  const { data: totalDepositData, refetch: rDeposits } = useQuery<{
    getTotalDeposits: number;
  }>(GET_TOTAL_DEPOSITS, {
    variables: {
      shopId: currentShop?.shopId,
    },
    onError(error) {
      dispatch(
        toggleSnackbarOpen({
          message: error?.message || error?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    },
  });

  useEffect(() => {
    if (data?.getAllCustomers) {
      setCustomerList(data.getAllCustomers.customers);
    }
  }, [data, page]);

  useEffect(() => {
    refetch();
    rCredits();
    rDeposits();
    rTotalCustomers();
  }, [data, syncTableUpdateCount, page]);

  const [deleteCustomer] = useMutation<{ customer: ICustomer }>(DELETE_CUSTOMER, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const [deleteMultipleCustomer] = useMutation<{ customer: ICustomer }>(DELETE_MULTIPLE_CUSTOMER, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleDeleteCustomer = () => {
    dispatch(isLoading(true));
    deleteCustomer({
      variables: {
        customerId: customer?.customerId,
        shopId: currentShop.shopId,
      },
    })
      .then((res) => {
        if (res.data) {
          dispatch(isLoading(false));
          dispatch(
            toggleSnackbarOpen({ message: "Customer Successfully Deleted", color: "SUCCESS" })
          );
          dispatch(increaseSyncCount(["Customer"]));
          setDeletePopup(false);
          refetch!();
          refetchFeatureCount();
        }
      })
      .catch((error) => {
        dispatch(isLoading(false));
        dispatch(
          toggleSnackbarOpen({
            message: error?.message || error?.graphQLErrors[0]?.message,
            color: "DANGER",
          })
        );
      });
  };

  const handleItemDelete = () => {
    dispatch(isLoading(true));
    deleteMultipleCustomer({
      variables: {
        customerIdsToDelete: selectedCustomerIds,
        shopId: currentShop.shopId,
      },
    })
      .then((res) => {
        if (res.data) {
          dispatch(isLoading(false));
          dispatch(
            toggleSnackbarOpen({ message: "Customers Successfully Deleted", color: "SUCCESS" })
          );
          dispatch(increaseSyncCount(["Customer"]));
          setDeletePopup(false);
          setSelectedCustomerIds([]);
          refetch();
        }
      })
      .catch((error) => {
        dispatch(isLoading(false));
        dispatch(
          toggleSnackbarOpen({
            message: error?.message || error?.graphQLErrors[0]?.message,
            color: "DANGER",
          })
        );
      });
  };

  useEffect(() => {
    // eslint-disable-next-line no-unused-expressions
    if (!searchVal) data?.getAllCustomers ? setCustomerList(data.getAllCustomers.customers) : null;

    const filteredCustomers = customerList.filter((Cstm) =>
      Cstm.customerName.toLocaleLowerCase().includes(searchVal?.toLocaleLowerCase())
    );
    setFilteredCustomerList(filteredCustomers);
  }, [searchVal, data]);

  const filterOptions = ["All Credits", "Cleared", "Uncleared"];

  useEffect(() => {
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

    if (filterOptions[optionSelected] === "All Credits") {
      // eslint-disable-next-line no-unused-expressions
      data?.getAllCustomers ? setFilteredCustomerList(data.getAllCustomers.customers) : null;
    } else {
      let filteredCustomers: ICustomer[] = [];
      if (filterOptions[optionSelected] === "Cleared") {
        filteredCustomers = customerList.filter((cstm) => {
          const depositAmount = getCustomerAmount(cstm.customerId, "deposit") || 0;
          const creditAmount = getCustomerAmount(cstm.customerId, "credit") || 0;
          const isCreditBoolean = creditAmount - depositAmount === 0;
          return isCreditBoolean;
        });
      } else {
        filteredCustomers = customerList.filter((cstm) => {
          const depositAmount = getCustomerAmount(cstm.customerId, "deposit") || 0;
          const creditAmount = getCustomerAmount(cstm.customerId, "credit") || 0;
          const isCreditBoolean = creditAmount - depositAmount > 0;
          return isCreditBoolean;
        });
      }
      setFilteredCustomerList(filteredCustomers);
    }
  }, [optionSelected, data]);

  const getDebtStatus = () => {
    const balance =
      (totalCreditData?.getTotalCredits ?? 0) - (totalDepositData?.getTotalDeposits ?? 0);

    return balance > 0 ? "You will receive" : balance < 0 ? "You Owe" : "";
  };

  const CustomerNavContent = () => {
    return (
      <div>
        <div
          style={{
            display: "flex",
            marginBottom: "5px",
            columnGap: "2rem",
            alignItems: "center",
            marginBlock: "10px",
          }}
        >
          <Span color="#607087" fontSize="14px">
            Showing an overview of all your credit and deposit transactions
          </Span>
        </div>
        <div style={{ display: "flex", marginTop: "1rem" }}>
          {/* <SalesCard height="70px" width="35%" style={{ padding: "5px 20px" }}>
            <Flex width="" justifyContent="start">
              <Flex width="" justifyContent="space-between" flexDirection="column">
                <Span color="#9EA8B7">Customers</Span>
                <Span fontSize="20px" fontWeight="500">
                  {data?.getAllCustomers.totalCustomers ?? 0}
                </Span>
              </Flex>
            </Flex>
            <Flex width="" justifyContent="space-between" flexDirection="column">
              <Span fontSize="13px" fontWeight="normal" color="#9EA8B7">
                Balance
              </Span>
              <Span
                fontSize="20px"
                fontWeight="500"
                color={getDebtStatus() === "You will receive" ? Colors.offRed : Colors.green}
              >
                {formatAmountIntl(
                  undefined,
                  Math.abs(
                    (totalCreditData?.getTotalCredits ?? 0) -
                      (totalDepositData?.getTotalDeposits ?? 0)
                  )
                )}
              </Span>

              {getDebtStatus && (
                <Span
                  color={getDebtStatus() === "You will receive" ? Colors.offRed : Colors.green}
                  fontSize="0.7em"
                >
                  {getDebtStatus()}
                </Span>
              )}
            </Flex>
          </SalesCard> */}

          <SalesCard width="100%" background="#19113D" style={{ flexDirection: "column", justifyContent: "center" }}>
            <Flex justifyContent="space-between" color="#fff" margin="1rem 0">
              <p style={{ color: "#fff", fontSize: "1.75rem" }}>
                {totalCustomers?.getAllCustomers.totalCustomers ?? 0} Records
              </p>
              {/* <CustomDropdown
                width="150px"
                color="#fff"
                containerColor="transparent"
                borderRadius="8px"
                height="3rem"
                options={filterOptions}
                setValue={() => ({})}
                fontSize="16px"
                selected={0}
                margin="0"
                padding="0.5rem"
              /> */}
            </Flex>
            <SalesCard background="#ECEFF4" height="70px" width="100%">
              <Flex width="" justifyContent="space-between" flexDirection="column">
                <Flex>
                  <Span fontSize="14px" color="#9EA8B7" fontWeight="normal">
                    Total Credit
                  </Span>
                </Flex>
                <Span fontSize="20px" color="red" fontWeight="500">
                  {formatAmountIntl(undefined, Math.abs(totalCreditData?.getTotalCredits ?? 0))}
                </Span>
              </Flex>
              <Flex width="" justifyContent="space-between" flexDirection="column">
                <Flex>
                  <Span fontSize="14px" color="#9EA8B7" fontWeight="normal">
                    Amount Paid
                  </Span>
                </Flex>
                <Span color="green" fontSize="20px" fontWeight="500">
                  {formatAmountIntl(undefined, totalDepositData?.getTotalDeposits ?? 0)}
                </Span>
              </Flex>

              <Flex width="" justifyContent="space-between" flexDirection="column">
                <Flex>
                  <Span fontSize="14px" color="#9EA8B7" fontWeight="normal">
                  Balance Remainig
                  </Span>
                </Flex>
                <Span color="#130F26" fontSize="20px" fontWeight="500">
                  {formatAmountIntl(
                    undefined,
                    Math.abs(
                      (totalCreditData?.getTotalCredits ?? 0) -
                        (totalDepositData?.getTotalDeposits ?? 0)
                    )
                  )}
                </Span>
              </Flex>
            </SalesCard>
          </SalesCard>
        </div>
      </div>
    );
  };

  return (
    <>
      <div style={{ minHeight: "6rem" }}>
        <TopNav
          header="Debt Book"
          setNavBarHeight={setNavBarHeight}
          setShowAddCustomer={setShowAddCustomer}
          customerNavContent={CustomerNavContent}
          setShowBankDetails={setShowBankDetails}
        />
      </div>

      <Body ref={containerRef} navBarHeight={navbarHeight}>
          {customerList.length > 0 ? (
            <Flex justifyContent="space-between">
              <Flex
                justifyContent="flex-start"
                alignItems="center"
                width="50%"
                style={{ columnGap: ".9rem" }}
              >
                <Flex>
                  <SearchInput
                    placeholder="Search customer name"
                    width="100%"
                    handleSearch={setSearchVal}
                    borderRadius="0.75rem"
                  />
                </Flex>
                <CustomDropdown
                  width="15.625rem"
                  height="39px"
                  color="#607087"
                  borderRadius="0.75rem"
                  containerColor="#F4F6F9"
                  dropdownIcon={dropIcon}
                  fontSize="0.875rem"
                  fontWeight="normal"
                  icon={filterIcon}
                  selected={optionSelected}
                  setValue={setOptionSelected}
                  options={filterOptions}
                  padding="0 4px"
                />
              </Flex>
              <ButtonWithIcon
                onClick={() => {
                  setShowAddCustomer && setShowAddCustomer(true);
                  setIsEdit && setIsEdit(false);
                  setCustomer && setCustomer(undefined);
                }}
                bgColor={Colors.secondaryColor}
              >
                <div
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    borderRadius: "50%",
                    backgroundColor: Colors.white,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p style={{ fontSize: "1.25rem", color: Colors.secondaryColor }}>+</p>
                </div>
                <span>Add New Customer</span>
              </ButtonWithIcon>
            </Flex>
          ) : null}

        <div style={{ maxHeight: "58vh", height: "58vh" }}>
          <CustomerList
            setShowCustomer={setShowCustomer}
            setShowAddTransaction={setShowAddTransaction}
            setCustomer={setCustomer}
            customer={customer}
            setType={setType}
            customerList={customerList}
            totalCustomers={data?.getAllCustomers.totalCustomers}
            setIsEdit={setIsEdit}
            setShowAddCustomer={setShowAddCustomer}
            setPage={setPage}
            page={page}
            perPage={perPage}
            setPerPage={setPerPage}
            setSelectedCustomerIds={setSelectedCustomerIds}
            selectedCustomerIds={selectedCustomerIds}
            setSelectedCreditIds={setSelectedCreditIds}
            selectedCreditIds={selectedCreditIds}
            handleItemDelete={handleItemDelete}
            filteredCustomerList={filteredCustomerList}
            searchVal={searchVal}
            filterOption={filterOptions[optionSelected]}
            containerHeight={containerHeight as number}
            setBaseTrxn={setBaseTrxn}
          />
        </div>

        {showAddTransaction && (
          <ModalContainer>
            <AddTransaction
              setShowModal={setShowAddTransaction}
              type={type}
              baseTrxn={baseTrxn}
              customer={customer}
              refetch={refetch}
              creditsIds={selectedCreditIds}
              setSelectedCreditIds={setSelectedCreditIds}
            />
          </ModalContainer>
        )}

        {showCustomer && (
          <ModalSidebar showProductModal={showCustomer}>
            <ViewCustomer
              customer={customer}
              setShowAddTransaction={setShowAddTransaction}
              setShowCustomer={setShowCustomer}
              setShowAddCustomer={setShowAddCustomer}
              setType={setType}
              setIsEdit={setIsEdit}
              setDeletePopup={setDeletePopup}
            />
          </ModalSidebar>
        )}

        {showAddCustomer && (
          <ModalContainer>
            <NewCustomer
              setShowModal={setShowAddCustomer}
              refetch={refetch}
              isEdit={isEdit}
              customer={customer}
            />
          </ModalContainer>
        )}
        {deletePopup && (
          <PopupCard close={() => setDeletePopup(false)}>
            <DeleteContainer>
              <Span
                className="text"
                fontSize="1rem"
                fontWeight="500"
                margin="2rem 0 0 0"
                textAlign="center"
                color={blackLight}
              >
                Do you want to delete
                <span style={{ color: Colors.secondaryColor }}>
                  {` ${customer?.customerName}`}?
                </span>
              </Span>
              <ButtonContainer marginBottom="0px">
                <Button
                  type="button"
                  size="lg"
                  label="Delete"
                  color={white}
                  backgroundColor={red}
                  borderSize="0px"
                  fontSize="0.875rem"
                  borderRadius="0.625rem"
                  width="44%"
                  onClick={() => handleDeleteCustomer()}
                />
                <Button
                  type="button"
                  size="lg"
                  label="Cancel"
                  color={white}
                  backgroundColor={blackLight}
                  borderSize="0px"
                  fontSize="0.875rem"
                  borderRadius="0.625rem"
                  width="44%"
                  onClick={() => setDeletePopup(false)}
                />
              </ButtonContainer>
            </DeleteContainer>
          </PopupCard>
        )}
        {showBankDetails &&
          <ModalContainer>
            <BankSettings setShowModal={setShowBankDetails} />
          </ModalContainer>}
      </Body>
    </>
  );
};

export default Custormers;
