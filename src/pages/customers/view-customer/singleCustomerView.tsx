import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import TopNav from "../../../components/top-nav/top-nav";
import { ICustomer, ICustomerTransactions } from "../../../interfaces/inventory.interface";
import { DELETE_CUSTOMER } from "../../../schema/customer.schema";
import { Left, Right } from "../../sales/style";
import { Flex } from "../../../components/receipt/style";
import {
  Contact,
  Container,
  CustomerBalanceCard,
  CustomerCard,
  Icon,
  TransparentBtn,
  UserImage,
} from "./style";
import expense from "../../../assets/expense.svg";
import inflow from "../../../assets/inflow.svg";
import preUserImage from "../../../assets/preUser.png";
import { Button } from "../../../components/button/Button";
import editIcon from "../../../assets/EditIconDark.svg";
import deleteIcon from "../../../assets/Delete.svg";
import locationIcon from "../../../assets/Location.svg";
import messageIcon from "../../../assets/Message.svg";
import callIcon from "../../../assets/Call.svg";
import { formatAmountIntl } from "../../../helper/format";
import PopupCard from "../../../components/popUp/PopupCard";
import { ButtonContainer, DeleteContainer } from "../../inventory/style";
import { Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import { isLoading } from "../../../app/slices/status";
import { ModalContainer } from "../../settings/style";
import NewCustomer from "../new-customer";
import AddTransaction from "../add-transaction";
import { DELETE_CUSTOMER_TRANSACTION, GET_CUSTOMER } from "../../../schema/getCustomer.schema";
import ConfirmAction from "../../../components/modal/confirmAction";
import { syncTotalTableCount, hasPermission } from "../../../helper/comparisons";
import { getUserPermissions } from "../../../app/slices/roles";
import EmptyDebt from "../../../assets/emptyDebt.svg";
import { IAllReceipt } from "../../../interfaces/receipt.interface";
import { GET_ALL_SALES_RECEIPT } from "../../../schema/receipt.schema";
import CustomerTransaction from "./CustomerTransaction";
import { dispatchIncreaseSyncCount } from "../../../utils/helper.utils";

interface IcustomerTransactionInfo {
  creditTotal: string;
  depositTotal: string;
}

const SingleCustomerView = () => {
  const currentShop = useAppSelector(getCurrentShop);
  const [customer, setCustomer] = useState<ICustomer>();
  const [customerTrxnInfo, setCustomerTrxnInfo] = useState<IcustomerTransactionInfo>();
  const [deletePopup, setDeletePopup] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [type, setType] = useState<string>("");
  const [showAddTransaction, setShowAddTransaction] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const syncTableUpdateCount = useAppSelector((state) =>
    syncTotalTableCount(state.shops.syncTableUpdateCount, ["CustomerTransaction", "Customer"])
  );
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [currentTrx, setCurrentTrx] = useState<any>();
  const [baseTrxn, setBaseTrxn] = useState<{ trxn: ICustomerTransactions; amountleft: number }>();
  const userPermissions = useAppSelector(getUserPermissions);
  const canDeleteTrx = hasPermission("MANAGE_CUSTOMER", userPermissions);

  const { data, refetch } = useQuery(GET_CUSTOMER, {
    variables: {
      shopId: currentShop?.shopId,
      customerId: id,
    },
    onCompleted(result) {
      setCustomer(result?.getCustomer?.customer);
      setCustomerTrxnInfo(result.getCustomer.customerTransactionInfo);
    },
  });

  const { data: receiptsData } = useQuery<{
    getAllSalesReceipt: IAllReceipt;
  }>(GET_ALL_SALES_RECEIPT, {
    variables: {
      shopId: currentShop?.shopId,
    },
    fetchPolicy: "cache-and-network",
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  useEffect(() => {
    const refetchCustomerData = async () => {
      try {
        const { data: responseData } = await refetch();

        if (responseData.getCustomer) {
          setCustomer(responseData.getCustomer.customer);
          setCustomerTrxnInfo(responseData.getCustomer.customerTransactionInfo);
        }
      } catch (error: any) {
        dispatch(
          toggleSnackbarOpen({ message: error?.message || error?.toString(), color: "DANGER" })
        );
      }
    };

    refetchCustomerData();
  }, [data, syncTableUpdateCount]);

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

  const balance = Math.abs(getCustomerAmount("deposit")! - getCustomerAmount("credit")!);

  useEffect(() => {
    getCustomerAmount();
  }, [customer]);

  const [deleteCustomer] = useMutation<{ customer: ICustomer }>(DELETE_CUSTOMER, {
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
          dispatchIncreaseSyncCount(dispatch, ["Customer", "CustomerTransaction"]);
          setDeletePopup(false);
          navigate("/dashboard/customers");
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

  const [deletCustomerTransaction] = useMutation(DELETE_CUSTOMER_TRANSACTION, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleDeleteTrx = () => {
    dispatch(isLoading(true));
    deletCustomerTransaction({
      variables: {
        customerId: currentTrx.customerId as string,
        customerTransactionId: currentTrx.customerTransactionId as string,
        shopId: currentTrx.shopId as string,
      },
    })
      .then(() => {
        dispatch(isLoading(false));
        refetch();
      })
      .catch((err) => {
        dispatch(isLoading(false));
        console.log(err);
      });
  };

  const allCreditIds =
    customer?.CustomerTransactions.map((trxn) => {
      if (trxn.isCredit) {
        return trxn.customerTransactionId;
      } else {
        return "";
      }
    }).filter((trxnId) => trxnId !== "") || [];

  // const customerTrnx = customer?.CustomerTransactions.sort((a, b) => new Date(a?.createdAt || "").getTime() - new Date(b?.createdAt || "").getTime());

  return (
    <div style={{ height: "calc(100vh - 0.3125rem)" }}>
      <TopNav header="Back to Debt Book" />
      <div style={{ minHeight: "0.3125rem" }}></div>
      <Flex style={{ height: "calc(90vh - 0.9375rem)" }} justifyContent="space-around">
        <Left
          style={{
            backgroundColor: "white",
            borderRadius: "1.25rem",
            padding: "1.25rem 0.9375rem",
            marginInline: ".5rem",
            border: "2px solid #607087",
            boxShadow: "0px 4px 1.875rem rgba(96, 112, 135, 0.2)",
            width: "45%",
            height: "88vh",
          }}
        >
          <Flex flexDirection="column">
            <Flex width="100%" alignItems="center" justifyContent="space-between">
              <h3 style={{ color: "#130F26" }}>Customer Profile</h3>
              <Flex width="30%" justifyContent="flex-end" gap=".3rem">
                <TransparentBtn>
                  <img
                    src={editIcon}
                    alt=""
                    onClick={() => {
                      setShowAddCustomer(true);
                      //   setShowCustomer(false);
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
                    }}
                  />
                </TransparentBtn>
              </Flex>
            </Flex>
            <CustomerCard width="100%">
              <UserImage src={preUserImage} alt="" />
              <div style={{ width: "100%" }}>
                <Flex width="100%" alignItems="center">
                  <p
                    style={{
                      width: "70%",
                      fontWeight: "500",
                      color: "#607087",
                      marginBottom: ".5rem",
                    }}
                  >
                    {customer?.customerName}
                  </p>
                </Flex>
                <Flex flexDirection="column">
                  <Contact style={{ marginBottom: ".3rem" }}>
                    <img src={callIcon} alt="" />
                    <span>{customer?.phoneNumber || "N/A"}</span>
                  </Contact>
                  <Contact style={{ marginBottom: ".3rem" }}>
                    <img src={messageIcon} alt="" />
                    <span>{customer?.email || "N/A"}</span>
                  </Contact>
                  <Contact style={{ marginBottom: ".3rem" }}>
                    <img src={locationIcon} alt="" />
                    <span>{customer?.address || "N/A"}</span>
                  </Contact>
                </Flex>
              </div>
            </CustomerCard>

            <CustomerBalanceCard
              style={{ background: "#19113D", width: "100%" }}
              isCredit={isCredit()}
            >
              <Flex
                alignItems="flex-start"
                flexDirection="column"
                justifyContent="flex-start"
                width="100%"
              >
                <p style={{ color: "#fff", fontSize: "0.89rem" }}>
                  Balance{" "}
                  {`${!isCredit ? "(You Owe)" : balance !== 0 ? "(Owing You)" : "(No Debt)"}`}
                </p>
                <h2 style={{ color: "#fff", fontSize: "1.5625rem" }}>
                  {formatAmountIntl(undefined, balance)}
                </h2>
              </Flex>
              <Flex
                borderRadius="1rem"
                padding="7px 0.9375rem 7px 0.9375rem"
                bgColor="white"
                width="100%"
                alignItems="center"
                justifyContent="space-between"
                gap="3rem"
              >
                <Flex
                  width="fit-content"
                  padding="0.3125rem"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Icon isCredit={false}>
                    <img src={inflow} alt="" />
                  </Icon>
                  <Flex flexDirection="column">
                    <h4>Deposit</h4>
                    <p className="deposit">
                      {formatAmountIntl(undefined, Math.abs(getCustomerAmount("deposit")!))}
                    </p>
                  </Flex>
                </Flex>
                <Flex
                  width="fit-content"
                  padding="0.3125rem"
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Icon isCredit={true}>
                    <img src={expense} alt="" />
                  </Icon>
                  <Flex flexDirection="column">
                    <h4>Credit</h4>
                    <p className="credit">
                      {" "}
                      {formatAmountIntl(undefined, Math.abs(getCustomerAmount("credit")!))}
                    </p>
                  </Flex>
                </Flex>
              </Flex>
            </CustomerBalanceCard>
            <Flex width="100%" justifyContent="space-around" padding="0.9375rem 0" gap="1rem">
              <Button
                label="Collect Deposit"
                onClick={() => {
                  setShowAddTransaction(true);
                  setBaseTrxn(undefined);
                  setType("deposit");
                }}
                backgroundColor="#219653"
                size="md"
                color="#fff"
                borderColor="transparent"
                borderRadius="0.75rem"
                borderSize="0px"
                fontSize="1rem"
                width="50%"
              />
              <Button
                label="Give Customer Credit"
                onClick={() => {
                  setShowAddTransaction(true);
                  setType("credit");
                }}
                backgroundColor="#F65151"
                size="lg"
                color="#fff"
                borderColor="transparent"
                borderRadius="0.75rem"
                borderSize="0px"
                fontSize="1rem"
                width={"50%"}
              />
            </Flex>
          </Flex>
        </Left>
        <Right
          style={{
            backgroundColor: "white",
            borderRadius: "1.25rem",
            padding: "0.625rem 0.9375rem",
            marginInline: ".5rem",
            overflowY: "scroll",
            overflowX: "hidden",
            height: "88vh",
            width: "45%",
          }}
          overflow
        >
          <Container style={{ height: "100%", width: "100%" }}>
            <Flex
              width="90%"
              alignItems="center"
              margin="0.3125rem 0 0.9375rem 0"
              justifyContent="space-between"
              gap={"3rem"}
            >
              <div style={{ display: "flex", columnGap: "1rem", alignItems: "center" }}>
                <h3 style={{ color: "#130F26" }}>History</h3>
              </div>
            </Flex>

            {customer?.CustomerTransactions.map((val, i) => {
              if (val.isCredit || !val.parentCustomerTransactionId) {
                return (
                  <CustomerTransaction
                    key={val.customerTransactionId}
                    val={val}
                    setShowAddTransaction={setShowAddTransaction}
                    customer={customer}
                    setBaseTrxn={setBaseTrxn}
                    setType={setType}
                    setCurrentTrx={setCurrentTrx}
                    setShowDeleteModal={setShowDeleteModal}
                    canDeleteTrx={canDeleteTrx}
                    allreceipts={receiptsData?.getAllSalesReceipt.receipts}
                    refetch={refetch}
                  />
                );
              } else {
                return <></>;
              }
            })}

            {!customer?.CustomerTransactions?.length ? (
              <Flex
                flexDirection="column"
                style={{ textAlign: "center" }}
                alignItems="center"
                justifyContent="center"
                height="100%"
              >
                <img src={EmptyDebt} />
                <h3 style={{ fontSize: "15px", fontWeight: "500", color: "#130F26" }}>
                  This Customer Has no Credit
                </h3>
                <p style={{ fontSize: "11px", color: "#9EA8B7", width: "50%" }}>
                  This customer credit records will appear here when you make sales on credit or
                  give credit directly
                </p>
              </Flex>
            ) : null}
          </Container>
        </Right>
      </Flex>

      {/* Modals */}
      {deletePopup && (
        <PopupCard close={() => setDeletePopup(false)}>
          <DeleteContainer>
            <Span
              className="text"
              fontSize="1rem"
              fontWeight="500"
              margin="2rem 0 0 0"
              textAlign="center"
              color={Colors.blackLight}
            >
              Do you want to delete
              <span style={{ color: "#FFA412" }}>{` ${customer?.customerName}`}?</span>
            </Span>
            <ButtonContainer marginBottom="0px">
              <Button
                type="button"
                size="lg"
                label="Delete"
                color={Colors.white}
                backgroundColor={Colors.red}
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
                color={Colors.white}
                backgroundColor={Colors.blackLight}
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

      {showAddTransaction && (
        <ModalContainer>
          <AddTransaction
            setShowModal={setShowAddTransaction}
            baseTrxn={baseTrxn}
            type={type}
            customer={customer}
            refetch={refetch}
          />
        </ModalContainer>
      )}

      {showDeleteModal && (
        <ConfirmAction
          actionText="Are you sure you want to delete thid transaction"
          action="Delete Transactions"
          doAction={handleDeleteTrx}
          setConfirmSignout={setShowDeleteModal}
        />
      )}
    </div>
  );
};

export default SingleCustomerView;
