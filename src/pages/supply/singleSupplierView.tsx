/* eslint-disable indent */
import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { getCurrentShop, increaseSyncCount } from "../../app/slices/shops";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import TopNav from "../../components/top-nav/top-nav";
import { Left, Right } from "../sales/style";
import { Flex } from "../../components/receipt/style";
import {
  Contact,
  CustomerBalanceCard,
  CustomerCard,
  Icon,
  TIcon,
  TransparentBtn,
  UserImage,
} from "./style";
import expense from "../../assets/expense.svg";
import inflow from "../../assets/inflow.svg";
import preUserImage from "../../assets/preUser.png";
import { Button } from "../../components/button/Button";
import editIcon from "../../assets/EditIconDark.svg";
import deleteIcon from "../../assets/Delete.svg";
import locationIcon from "../../assets/Location.svg";
import messageIcon from "../../assets/Message.svg";
import callIcon from "../../assets/Call.svg";
import moment from "moment";
import { formatAmountIntl, formatNumber } from "../../helper/format";
import PopupCard from "../../components/popUp/PopupCard";
import { ButtonContainer, DeleteContainer } from "../inventory/style";
import { Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../GlobalStyles/theme";
import { isLoading } from "../../app/slices/status";
import { ModalContainer } from "../settings/style";
import Accordion from "./accordion";
import { Input } from "../../components/input-field/style";
import FilterIcon from "../../assets/FilterIcon.svg";
import SearchIcon from "../../assets/SearchIcon.svg";
import dropIcon from "../../assets/dropIcon2.svg";
import { SupplierAttr, SupplyRecordAttr } from "../../interfaces/supplies.interface";
import {
  DELETE_SUPPLIER,
  GET_SUPPLIER,
  GET_SUPPLY_RECORD_BY_SUPPLIER_ID,
  MARK_SUPPLY_RECORD_COLLECTED,
} from "../../schema/supplier.schema";
import { numberToWord } from "./supply.utils";
import {
  setEditSupplier,
  setPayBalanceModal,
  setShowModal,
} from "../../app/slices/showSupplyModal";
import AddNewSupplyModal from "./modal/addNewSupply";
import PaySupplyBalanceModal from "./modal/payBalanceModal";
import EditSupplier from "./editSupplier";
import { syncTotalTableCount } from "../../helper/comparisons";
import { TEmpty } from "../home/style";
import emptyImage from "../../assets/empty.svg";

const SingleSupplierView = () => {
  const currentShop = useAppSelector(getCurrentShop);
  const [deletePopup, setDeletePopup] = useState<boolean>(false);
  const [showEditSupplier, setShowEditSupplier] = useState(false);
  const [supplier, setSupplier] = useState<SupplierAttr>({});
  const [supplierId, setSupplierId] = useState<string>("");
  const [shouldAddSupplies, setShouldAddSupplies] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"suppliedProduct" | "supplierPaymentHistory">(
    "suppliedProduct"
  );
  const [openAccordion, setOpenAccordion] = useState<string>("");

  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  const editSupplier = useAppSelector((state) => state.modal.editSupplier);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const shouldEditSupplier = (editSupplier: boolean) => {
    dispatch(setEditSupplier(editSupplier));
  };

  const syncTableUpdateCount = useAppSelector((state) =>
    syncTotalTableCount(state.shops.syncTableUpdateCount, ["SupplierRecords", "Supplier"])
  );

  const [markSupplyRecordCollected, { loading, error }] = useMutation(MARK_SUPPLY_RECORD_COLLECTED);

  const { data, refetch } = useQuery<{
    getSupplyRecordsBySupplierId: SupplyRecordAttr[];
  }>(GET_SUPPLY_RECORD_BY_SUPPLIER_ID, {
    variables: {
      shopId: currentShop?.shopId as string,
      supplierId: id as string,
    },
    fetchPolicy: "cache-and-network",
    onError(err) {
      dispatch(toggleSnackbarOpen(err?.message || err?.graphQLErrors[0]?.message));
    },
  });

  useEffect(() => {
    refetch();
  }, [syncTableUpdateCount]);

  const { data: selectedSupplier, refetch: refetchSupplier } = useQuery<{
    getSupplier: SupplierAttr;
  }>(GET_SUPPLIER, {
    variables: {
      shopId: currentShop?.shopId as string,
      supplierId: id as string,
    },
    fetchPolicy: "cache-and-network",
    onError(err) {
      dispatch(toggleSnackbarOpen(err?.message || err?.graphQLErrors[0]?.message));
    },
  });

  const [deleteSupplier] = useMutation<{
    deleteSupplier: {
      successful: boolean;
    };
  }>(DELETE_SUPPLIER, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleDeleteSupplier = () => {
    dispatch(isLoading(true));
    deleteSupplier({
      variables: {
        supplierIds: [supplierId],
        shopId: currentShop.shopId,
      },
    })
      .then((res) => {
        if (res.data?.deleteSupplier.successful) {
          dispatch(isLoading(false));
          dispatch(toggleSnackbarOpen("Supplier Successfully Deleted"));
          dispatch(increaseSyncCount(["Supplier"]));
          setDeletePopup(false);
          navigate("/dashboard/suppliers");
        }
      })
      .catch((err) => {
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen(err?.message || err?.graphQLErrors[0]?.message));
      });
  };

  const refetchAll = () => {
    refetch();
    refetchSupplier();
  };

  const payBalanceModal = useAppSelector((state) => state.modal.payBalanceModal);
  const showModal = useAppSelector((state) => state.modal.showModal);

  const changePayBalanceModal = () => {
    dispatch(setPayBalanceModal(!payBalanceModal));
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const changeShowModal = (showModal: boolean) => {
    dispatch(setShowModal(showModal));
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const totalQuantity = data?.getSupplyRecordsBySupplierId?.reduce((total, record) => {
    const supplyItems = record?.SupplyItems;
    if (supplyItems) {
      const quantitySum = supplyItems.reduce((sum, supply) => {
        const quantity = Number(supply?.quantity);
        return sum + quantity;
      }, 0);
      return total + quantitySum;
    }
    return total;
  }, 0);

  const totalAmount = data?.getSupplyRecordsBySupplierId?.reduce((total, record) => {
    const amountSum = record?.totalAmount as number;
    return total + amountSum;
  }, 0);

  const amountPaid = data?.getSupplyRecordsBySupplierId?.reduce((total, record) => {
    const amountSum = record?.amountPaid as number;
    return total + amountSum;
  }, 0);

  const amountLeft = (totalAmount as number) - (amountPaid as number);

  const handleMarkSupplyRecordCollected = async ({
    supplyRecordId,
    shouldRestock,
  }: {
    supplyRecordId: string;
    shouldRestock: boolean;
  }) => {
    try {
      const response = await markSupplyRecordCollected({
        variables: {
          supplyRecordId,
          shopId: currentShop?.shopId as string,
          shouldRestock,
        },
      });

      const { successful } = response.data.markSupplyRecordCollected;
      // Handle the response
      if (successful) {
        dispatch(toggleSnackbarOpen("Supply record marked as collected successfully"));
        dispatch(increaseSyncCount(["Supplier", "SupplierRecords"]));
      } else {
        dispatch(toggleSnackbarOpen("Failed to mark supply record as collected"));
      }
    } catch (err) {
      dispatch(toggleSnackbarOpen("Error occurred while marking supply record as collected:"));
    }
  };

  const [paymentStatus, setPaymentStatus] = useState("UNPAID");
  const [isCollected, setIsCollected] = useState(false);

  const handleApplyFilters = () => {
    const filters = {
      paymentStatus,
      isCollected,
    };
    // applyFilters(filters);
  };

  const handleAccordionToggle = (accordionId: string) => {
    if (openAccordion === accordionId) {
      // If the clicked accordion is already open, close it
      setOpenAccordion("");
    } else {
      // Open the clicked accordion
      setOpenAccordion(accordionId);
    }
  };

  // Function to handle tab switch
  const handleTabClick = (tab: "suppliedProduct" | "supplierPaymentHistory") => {
    setActiveTab(tab);
  };

  return (
    <div style={{ backgroundColor: "#F4F6F9" }}>
      <TopNav header="Back to Suppliers" />
      <div style={{ minHeight: "1.25rem" }}></div>
      <Flex width="100%" justifyContent="space-between" alignItems="flex-start">
        <Left
          style={{
            backgroundColor: "white",
            borderRadius: "1.25rem",
            padding: "1.25rem 0.9375rem",
            marginInline: ".5rem",
            border: "2px solid #607087",
            boxShadow: "0px 4px 1.875rem rgba(96, 112, 135, 0.2)",
            height: "85vh",
            width: "40%",
            maxWidth: "40%",
          }}
        >
          <Flex flexDirection="column" width="100%">
            <Flex width="100%" alignItems="center" justifyContent="space-between" gap="3rem">
              <Span color="#607087" fontSize="1.125rem" fontWeight="600">
                Supplier Profile
              </Span>
              <Flex width="30%" justifyContent="flex-end" gap=".3rem">
                <TransparentBtn>
                  <img
                    src={editIcon}
                    alt=""
                    onClick={() => {
                      setShowEditSupplier(true);
                    }}
                  />
                </TransparentBtn>
                <TransparentBtn>
                  <img
                    src={deleteIcon}
                    alt=""
                    onClick={() => {
                      setSupplierId(selectedSupplier?.getSupplier?.supplierId as string);
                      setDeletePopup!(true);
                    }}
                  />
                </TransparentBtn>
              </Flex>
            </Flex>

            <CustomerCard>
              <UserImage src={preUserImage} height="5.625rem" alt="" />

              <Flex width="100%" flexDirection="column">
                <Flex width="100%" alignItems="center">
                  <Span fontWeight="500" fontSize="1rem" color="#607087" margin="0px .5rem .6rem">
                    {`${selectedSupplier?.getSupplier?.firstName} ${selectedSupplier?.getSupplier?.lastName}`}
                  </Span>
                </Flex>

                <Contact style={{ marginInline: ".5rem", marginBottom: ".3rem" }}>
                  <img src={callIcon} width="1.375rem" alt="" />
                  <Span fontSize="0.875rem" fontWeight="400" color="#9EA8B7">
                    {selectedSupplier?.getSupplier?.mobileNumber}
                  </Span>
                </Contact>

                <Contact style={{ marginInline: ".5rem", marginBottom: ".3rem" }}>
                  <img src={messageIcon} width="1.375rem" alt="" />
                  <Span fontSize="0.875rem" fontWeight="400" color="#9EA8B7">
                    {selectedSupplier?.getSupplier?.email}
                  </Span>
                </Contact>

                <Contact style={{ marginInline: ".5rem", marginBottom: ".3rem" }}>
                  <img src={locationIcon} width="1.375rem" alt="" />
                  <Span fontSize="0.875rem" fontWeight="400" color="#9EA8B7">
                    {selectedSupplier?.getSupplier?.address}
                  </Span>
                </Contact>
              </Flex>
            </CustomerCard>

            <CustomerBalanceCard style={{ background: "#F4F6F9", width: "100%" }} isCredit={true}>
              <Flex
                alignItems="flex-start"
                flexDirection="column"
                justifyContent="flex-start"
                width="100%"
              >
                <Span color="#9EA8B7" fontSize="0.875rem" fontWeight="400" margin="0 0 .3rem">
                  Total Supplies
                </Span>
                <Span color="#607087" fontSize="1.375rem" fontWeight="500">
                  {formatNumber(totalQuantity as number, 0)}
                </Span>
              </Flex>

              <Flex
                borderRadius="1rem"
                padding="7px 0.9375rem 7px 0.9375rem"
                backgroundColor="white"
                width="100%"
                alignItems="center"
                justifyContent="space-around"
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
                    <Span fontSize="0.875rem" fontWeight="400" color="#9EA8B7">
                      Total Paid
                    </Span>
                    <Span fontSize="1rem" className="deposit">
                      {formatAmountIntl(undefined, amountPaid ?? 0)}
                    </Span>
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
                    <Span fontSize="0.875rem" fontWeight="400" color="#9EA8B7">
                      Remaining
                    </Span>
                    <Span fontSize="1rem" className="credit">
                      {" "}
                      {formatAmountIntl(undefined, amountLeft ?? 0)}
                    </Span>
                  </Flex>
                </Flex>
              </Flex>
            </CustomerBalanceCard>

            <Flex width="100%" justifyContent="space-around" padding="0.9375rem 0">
              <Button
                label="Add Supplies"
                onClick={() => {
                  setEditSupplier(true);
                  changeShowModal(true);
                  setShouldAddSupplies(true);
                }}
                backgroundColor={Colors.primaryColor}
                size="md"
                color="#fff"
                borderColor="transparent"
                borderRadius="0.75rem"
                borderSize="0px"
                fontSize="1rem"
                width="35%"
              />

              <Button
                label={amountLeft !== 0 ? "Pay Balance" : "Fully Paid"}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (amountLeft !== 0) {
                    changePayBalanceModal();
                  }
                }}
                backgroundColor={amountLeft !== 0 ? "#219653" : "#DBF9E8"}
                style={{ cursor: amountLeft !== 0 ? "pointer" : "not-allowed" }}
                border={amountLeft !== 0}
                size="lg"
                color="#fff"
                borderColor="transparent"
                borderRadius="0.75rem"
                borderSize="0px"
                fontSize="1rem"
                width="35%"
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
            height: "85vh",
            width: "55%",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          <Flex width="100%" flexDirection="column" gap="0px 2rem">
            <Flex
              width="100%"
              alignItems="center"
              margin="0.3125rem 0 0.9375rem 0"
              justifyContent="space-between"
              gap="3rem"
            >
              <div style={{ display: "flex", columnGap: "1rem", alignItems: "center" }}>
                <Span color="#607087" fontSize="1.125rem" fontWeight="600">
                  History
                </Span>
              </div>
            </Flex>

            {data?.getSupplyRecordsBySupplierId?.length! > 0 ? (
              data?.getSupplyRecordsBySupplierId?.map((val) => {
                return (
                  <Accordion
                    title={
                      <Flex justifyContent="space-between" alignItems="center">
                        <TIcon isCredit={true}>
                          <img src={val.isCollected ? inflow : expense} alt="" />
                        </TIcon>
                        <Flex flexDirection="column" width="65%">
                          <span>
                            {numberToWord[val?.SupplyItems?.length!]} ({val?.SupplyItems?.length!})
                            items
                          </span>
                          <span style={{ color: "#9EA8B7" }}>
                            {moment(val.createdAt).format("MMMM Do YYYY, h:mm a")}
                          </span>
                        </Flex>
                        <Button
                          label={val?.isCollected ? "Cleared" : "Collect"}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            val?.isCollected
                              ? console.log("first")
                              : handleMarkSupplyRecordCollected({
                                  supplyRecordId: val?.supplyRecordId!,
                                  shouldRestock: true,
                                });
                          }}
                          backgroundColor="transparent"
                          size="sm"
                          color="#219653"
                          borderColor="#219653"
                          borderRadius="6px"
                          borderSize="2px"
                          fontSize="0.75rem"
                          height="1.5625rem"
                          width="15%"
                          border
                        />
                      </Flex>
                    }
                    key={val.supplyRecordId}
                    activeAccordionId={val.supplyRecordId}
                    openAccordion={openAccordion}
                    onAccordionToggle={() => handleAccordionToggle(val.supplyRecordId ?? "")}
                  >
                    <Flex
                      flexDirection="column"
                      padding="0 0 0 20px"
                      width="100%"
                      alignItems="flex-start"
                      justifyContent="flex-start"
                    >
                      {/* tab */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          marginBottom: "20px",
                        }}
                      >
                        {/* Supplied Product Tab */}
                        <div
                          style={{
                            padding: "10px 20px",
                            cursor: "pointer",
                            backgroundColor:
                              activeTab === "suppliedProduct" ? Colors.primaryColor : "#ccc",
                            color: activeTab === "suppliedProduct" ? "#fff" : "#000",
                            borderRadius: "10px 0px 0px 10px",
                          }}
                          onClick={() => handleTabClick("suppliedProduct")}
                        >
                          Supplied Product
                        </div>

                        {/* Payment History Tab */}
                        <div
                          style={{
                            padding: "10px 20px",
                            cursor: "pointer",
                            backgroundColor:
                              activeTab === "supplierPaymentHistory" ? Colors.primaryColor : "#ccc",
                            color: activeTab === "supplierPaymentHistory" ? "#fff" : "#000",
                            borderRadius: "0 10px 10px 0px",
                          }}
                          onClick={() => handleTabClick("supplierPaymentHistory")}
                        >
                          Payment History
                        </div>
                      </div>

                      {/* Content based on suppliedProduct */}
                      {activeTab === "suppliedProduct" && (
                        <Flex
                          flexDirection="column"
                          alignItems="flex-start"
                          justifyContent="flex-start"
                          height={
                            val?.SupplyItems && val?.SupplyItems?.length > 7 ? "250px" : "auto"
                          }
                          style={{
                            overflowY: "scroll",
                            marginBottom: "10px",
                          }}
                        >
                          {val?.SupplyItems?.map((item) => {
                            return (
                              <Flex
                                key={item?.supplyItemId}
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                gap="5px 0px"
                                margin="0px 0px 10px 0px"
                                style={{ borderBottom: "4px solid white", paddingBottom: "5px" }}
                              >
                                <Flex gap="0px 5px" justifyContent="flex-start" alignItems="center">
                                  <Span color="#262626" fontSize="13px">
                                    {item?.InventoryItem?.inventoryName}
                                  </Span>
                                  x
                                  <Span color="#262626" fontSize="13px">
                                    {item?.quantity}
                                  </Span>
                                </Flex>
                                <Flex flexDirection="column">
                                  <Span color="#9EA8B7" fontSize="12px">
                                    {formatAmountIntl(undefined, Number(item?.purchasePrice))}
                                  </Span>
                                </Flex>
                              </Flex>
                            );
                          })}
                        </Flex>
                      )}

                      {/* Content based on supplierPaymentHistory */}
                      {activeTab === "supplierPaymentHistory" && (
                        <Flex
                          flexDirection="column"
                          alignItems="flex-start"
                          justifyContent="flex-start"
                          height={
                            val?.SupplyTransactions && val?.SupplyTransactions?.length > 7
                              ? "250px"
                              : "auto"
                          }
                          style={{
                            overflowY: "scroll",
                            marginBottom: "10px",
                          }}
                        >
                          {val?.SupplyTransactions?.filter(
                            (item) => Number(item.amount) !== 0
                          )?.map((item) => {
                            const formattedDate =
                              item && item.createdAt
                                ? moment(item.createdAt).format("MMMM Do YYYY, h:mm a")
                                : new Date();
                            return (
                              <Flex
                                key={item?.supplyTransactionId}
                                flexDirection="column"
                                justifyContent="center"
                                alignItems="center"
                                gap="5px 0px"
                                margin="0px 0px 10px 0px"
                                style={{ borderBottom: "4px solid white", paddingBottom: "5px" }}
                              >
                                <Flex gap="0px 10px">
                                  <Span color="#219653" fontSize="12px">
                                    {formatAmountIntl(undefined, Number(item?.amount))}
                                  </Span>
                                  <Span color="#219653" fontSize="12px">
                                    {item?.paymentMethod}
                                  </Span>
                                </Flex>
                                <Flex flexDirection="column">
                                  <Span color="#9EA8B7" fontSize="12px">
                                    {formattedDate}
                                  </Span>
                                  <Span color="#607087" fontSize="12px">
                                    {item?.comment}
                                  </Span>
                                </Flex>
                              </Flex>
                            );
                          })}
                        </Flex>
                      )}

                      <Span color={Colors.offRed} fontSize="14px" fontWeight="400">
                        {formatAmountIntl(undefined, Math.abs(val.totalAmount!))}
                      </Span>
                      <Span fontSize="0.875rem" fontWeight="400">
                        {moment(val.createdAt).format("MMMM Do YYYY, h:mm a")}
                      </Span>
                      <div style={{ fontSize: "0.875rem", fontWeight: "400" }}>
                        <span style={{ fontWeight: "500" }}>Comment: </span> {val.comment}
                      </div>
                    </Flex>
                  </Accordion>
                );
              })
            ) : (
              <TEmpty>
                <img src={emptyImage} alt="empty-img" />
                <h3>No Records to Show Yet</h3>
                <p>Add Supplies to see them appear here.</p>
              </TEmpty>
            )}
          </Flex>
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
              <span style={{ color: "#FFA412" }}>
                {` ${selectedSupplier?.getSupplier?.firstName} ${selectedSupplier?.getSupplier?.lastName}`}
                ?
              </span>
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
                onClick={handleDeleteSupplier}
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

      {showEditSupplier && (
        <ModalContainer>
          <EditSupplier
            setShowModal={setShowEditSupplier}
            refetch={refetchAll}
            supplier={selectedSupplier?.getSupplier}
          />
        </ModalContainer>
      )}

      {showModal && (
        <AddNewSupplyModal
          setShowModal={changeShowModal}
          supplier={selectedSupplier?.getSupplier}
          setSupplier={setSupplier}
          setEditSupplier={shouldEditSupplier}
          editSupplier={editSupplier}
          refetchSupplier={refetchAll}
          shouldAddSupplies={shouldAddSupplies}
          setShouldAddSupplies={setShouldAddSupplies}
        />
      )}

      {payBalanceModal && (
        <PaySupplyBalanceModal
          setShowModal={changePayBalanceModal}
          selectedSupplier={selectedSupplier?.getSupplier!}
          refetchSupplier={refetchAll}
        />
      )}
    </div>
  );
};

export default SingleSupplierView;
