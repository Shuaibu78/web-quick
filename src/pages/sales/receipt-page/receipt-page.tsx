/* eslint-disable indent */
/* eslint-disable no-debugger */
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import {
  Table,
  THead,
  TBody,
  TRow,
  Td,
  TControls,
  ReceiptContainer,
  CustomCont,
  Left,
  Right,
  PerPage,
  CurrentPage,
  JumpTo,
  Counter,
  FilterContainer,
  FilterItemB,
  Filter,
} from "../style";

import TDocumentIcon from "../../../assets/TDocument.svg";
import RDocumentIcon from "../../../assets/RDocument.svg";
import arrowL from "../../../assets/ArrowL.svg";
import arrowR from "../../../assets/ArrowR.svg";
import Receipt from "../../../components/receipt/receipt";
import SearchInput from "../../../components/search-input/search-input";
import { IReceipt } from "../../../interfaces/receipt.interface";
import { sortList } from "../../../utils/helper.utils";
import { Flex as FlexDiv, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import { PageControl } from "../../inventory/style";
import { REFUND_SALE } from "../../../schema/sales.schema";
import { ISalesReceipt } from "../../../interfaces/sales.interface";
import { useMutation } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { isLoading } from "../../../app/slices/status";
import { getCurrentShop, increaseSyncCount } from "../../../app/slices/shops";
import { formatAmountIntl, formatDate } from "../../../helper/format";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { hasPermission } from "../../../helper/comparisons";
import { getUserPermissions } from "../../../app/slices/roles";
import {
  setPaymentFilter,
  setReceiptNumber,
  setUserFilterList,
  setUserIdFilterList,
} from "../../../app/slices/salesFilter";
import roundCancelIcon from "../../../assets/r-cancel.svg";
import { Flex } from "../../../components/receipt/style";
import FilterIcon from "../../../assets/FilterIcon.svg";
import dropIcon from "../../../assets/dropIcon2.svg";
import { Colors } from "../../../GlobalStyles/theme";

interface Receipts {
  allReceipts: IReceipt[] | undefined;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  perPage: number;
  totalPages: number;
  setPerPage: React.Dispatch<React.SetStateAction<number>>;
  setReceiptButtonState?: React.Dispatch<React.SetStateAction<boolean>>;
  setListButtonState?: React.Dispatch<React.SetStateAction<boolean>>;
  receiptButtonState?: boolean;
  listButtonState?: boolean;
  showFilterModal: boolean;
  setShowFilterModal: React.Dispatch<React.SetStateAction<boolean>>;
  navbarHeight?: number;
}

const ReceiptPage: FunctionComponent<Receipts> = ({
  allReceipts,
  page,
  setPage,
  perPage,
  setPerPage,
  totalPages,
  setShowFilterModal,
}) => {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [reasonSelected, setReasonSelected] = useState<string>("");
  const [paymentSelected, setPaymentSelected] = useState<number>(-1);
  const [currentReceipt, setCurrentReceipt] = useState<IReceipt | null>(null);
  // const [showSearch, setShowSearch] = useState(false);
  // const [search, setSearch] = useState<string>("");
  const paymentMethodOption = ["Cash", "Pos", "Transfer"];
  const currentShop = useAppSelector(getCurrentShop);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>();

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

  const {
    user: userInfo,
    salesFilter: {
      // productIdFilterList,
      // productFilterList,
      userIdFilterList,
      userFilterList,
      // selectedPayment,
      paymentFilter,
      // filterByDiscountSales,
      // filterByRefundSales,
    },
  } = useAppSelector((state) => state);
  const reduxSelector = useAppSelector((state) => state);
  const { receiptNumber } = useAppSelector((state) => state.salesFilter);
  const userPermissions = useAppSelector(getUserPermissions);
  const isMerchant = userInfo?.userId === reduxSelector?.shops?.currentShop?.userId;
  const shouldViewAllSales = hasPermission("VIEW_ALL_SALES", userPermissions);
  // const shouldViewSales = hasPermission("VIEW_SALE", userPermissions);

  const dispatch = useAppDispatch();

  const [refundSale, { error }] = useMutation<{ refundSale: ISalesReceipt }>(REFUND_SALE, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

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

  const toNegativeNumber = (num: number) => (num <= 0 ? num : num * -1);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleProcessRefund = (event: any) => {
    event.preventDefault();
    dispatch(isLoading(true));
    refundSale({
      variables: {
        shopId: currentShop?.shopId,
        paymentMethod: paymentMethodOption[paymentSelected],
        discount: toNegativeNumber(currentReceipt?.totalDiscount || 0),
        refundedReceiptId: currentReceipt?.receiptId,
        comment: reasonSelected,
        onCredit: !!currentReceipt?.creditAmount,
      },
    })
      .then((res) => {
        if (res.data) {
          setShowForm(false);
          dispatch(isLoading(false));
          dispatch(increaseSyncCount(["Sales", "Receipts"]));
          dispatch(toggleSnackbarOpen("Successful"));
        }
      })
      .catch(() => {
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      });
  };
  const handleShowReceipt = (val: IReceipt) => {
    setCurrentReceipt(val);
  };

  useEffect(() => {
    setCurrentReceipt(null);
  }, [allReceipts]);

  const removePaymentMethod = (method: string) => {
    const filterCopy: string[] = [...paymentFilter];
    const position = filterCopy.indexOf(method);
    filterCopy.splice(position, 1);
    dispatch(setPaymentFilter(filterCopy));
  };

  // const handleRemoveProductFilter = (idx: number) => {
  //   const copyIdProductList = [...productIdFilterList];
  //   copyIdProductList.splice(idx, 1);
  //   dispatch(setProductIdFilterList(copyIdProductList));
  //   const copyOld = [...productFilterList];
  //   copyOld.splice(idx, 1);
  //   dispatch(setProductFilterList(copyOld));
  // };

  const handleRemoveUserFilter = (idx: number) => {
    const copyOld = [...userIdFilterList];
    copyOld.splice(idx, 1);
    dispatch(setUserIdFilterList(copyOld));
    const copyOfUserFilterList = [...userFilterList];
    copyOfUserFilterList.splice(idx, 1);
    dispatch(setUserFilterList(copyOfUserFilterList));
  };

  const handleSearchReceipt = (searchString: string) => {
    dispatch(setReceiptNumber(searchString));
  };

  return (
    <ReceiptContainer style={{ height: "inherit", overflow: "hidden" }}>
      <Left ref={containerRef} style={{ position: "relative" }} height="100%">
        <TControls>
          <Flex justifyContent="space-between" style={{ columnGap: "2rem" }}>
            <Flex alignItems="center" width="60%">
              <SearchInput
                placeholder=" e.g: '0003'"
                width="100%"
                height="2.5rem"
                handleSearch={handleSearchReceipt}
                borderRadius=".75rem"
              />
            </Flex>
            <Flex
              alignItems="center"
              bgColor="#F4F6F9"
              padding=".625rem .5rem"
              width="28%"
              color="#607087"
              height="2.5rem"
              borderRadius=".75rem"
              style={{ cursor: "pointer" }}
              justifyContent="space-between"
              onClick={() => setShowFilterModal(true)}
            >
              <img src={FilterIcon} alt="filter icon" />
              <p style={{ fontSize: ".875rem", color: "#607087" }}>Filter by</p>
              <img src={dropIcon} alt="filter icon" />
            </Flex>
          </Flex>
        </TControls>
        <FilterContainer>
          <div id="filter-container">
            {userFilterList.map((val, i) => (
              <Filter key={i}>
                <span id="head">User</span>
                <FilterItemB key={i}>
                  <button onClick={() => handleRemoveUserFilter(i)}>
                    <img src={roundCancelIcon} alt="" />
                  </button>
                  <span>{val}</span>
                </FilterItemB>
              </Filter>
            ))}
            {paymentFilter.map((val, i) => (
              <Filter key={i}>
                <span id="head">Payment</span>
                <FilterItemB>
                  <button onClick={() => removePaymentMethod(val)}>
                    <img src={roundCancelIcon} alt="" />
                  </button>
                  <span>{val}</span>
                </FilterItemB>
              </Filter>
            ))}
          </div>
        </FilterContainer>
        <div>
          <Table width="500px" maxHeight="85%" style={{ height: "85%" }}>
            <THead fontSize="0.875rem" minWidth="100%">
              <Td width="8%">Count</Td>
              <Td width="22%">
                <span>Receipt/Date</span>
              </Td>
              <Td width="28%">
                <span>Discount/Credit</span>
              </Td>
              <Td width="30%">
                <span>Total</span>
              </Td>
            </THead>
            <TBody
              overflowY="scroll"
              width="100%"
              // minWidth="100%"
              maxHeight={`calc(${containerHeight}px - 9.375rem)`}
              style={{ overflowX: "hidden" }}
            >
              {allReceipts && allReceipts?.length > 0 ? (
                <>
                  {sortList(allReceipts).map((val, i) => {
                    return (
                      <TRow
                        maxWidth="85%"
                        minWidth="100%"
                        width="inherit"
                        style={{ margin: ".625rem 0px" }}
                        onClick={() => handleShowReceipt(val)}
                        key={i}
                        activeBg={val.receiptId === currentReceipt?.receiptId}
                      >
                        <Td width="8%">
                          <CustomCont
                            background={
                              val.CustomerTransaction
                                ? "rgba(252, 233, 233, 0.2)"
                                : "rgba(129, 150, 179, 0.2)"
                            }
                            margin="0 0 0 .625rem"
                            countColor={val.CustomerTransaction ? "#FF0000" : "#8196B3"}
                            imgHeight="1.25rem"
                          >
                            <img
                              src={val.CustomerTransaction ? RDocumentIcon : TDocumentIcon}
                              alt=""
                            />
                            <div className="offset">
                              <Counter style={{ color: "#fff" }}>
                                {Number(val.Sales.length)}
                              </Counter>
                            </div>
                          </CustomCont>
                        </Td>
                        <Td width="22%">
                          <FlexDiv direction="column">
                            <Span fontSize=".8rem" fontWeight="700">
                              #{val.deviceId}
                              {val.receiptNumber.toString().padStart(4, "0")}
                            </Span>
                            <Span fontSize=".75rem">{formatDate(new Date(val.createdAt))}</Span>
                          </FlexDiv>
                        </Td>
                        <Td width="25%">
                          {val.CustomerTransaction && (
                            <FlexDiv direction="column" width="90%">
                              <Span width="100%" fontSize=".75rem" fontWeight="700" color="#FF0000">
                                -{formatAmountIntl(undefined, val.creditAmount)}
                              </Span>
                              <Span width="100%" fontSize=".75rem">
                                On credit
                              </Span>
                            </FlexDiv>
                          )}
                          {val.totalDiscount > 0 && (
                            <FlexDiv direction="column" width="100%">
                              <Span
                                width="auto"
                                lineThrough={true}
                                fontSize=".75rem"
                                fontWeight="700"
                                color="#FF0000"
                              >
                                -{formatAmountIntl(undefined, val.totalDiscount)}
                              </Span>
                              <Span fontSize=".75rem">Discount</Span>
                            </FlexDiv>
                          )}
                        </Td>
                        <Td width="30%">
                          <FlexDiv direction="column" width="60%">
                            <Span
                              fontSize=".8rem"
                              fontWeight="700"
                              color={val.totalAmount < 0 ? "#FF0000" : "inherit"}
                            >
                              {formatAmountIntl(
                                undefined,
                                val?.version && val.version >= 2
                                  ? val?.totalAmount + val.totalDiscount
                                  : val?.totalAmount + val?.creditAmount
                              )}
                            </Span>
                            <Span fontSize=".75rem">{val.paymentMethod}</Span>
                          </FlexDiv>
                        </Td>
                      </TRow>
                    );
                  })}
                </>
              ) : (
                <>
                  <Flex
                    flexDirection="column"
                    justifyContent="center"
                    margin="6.25rem 0px 0 0"
                    alignItems="center"
                  >
                    <Span
                      margin="4px 0px"
                      color={Colors.blackLight}
                      fontSize="1.2rem"
                      fontWeight="500"
                    >
                      There are no receipts to display.
                    </Span>
                    {receiptNumber && (
                      <Span color={Colors.grey} fontSize=".8rem">
                        No receipt match your search "<b>{receiptNumber}</b>"
                      </Span>
                    )}
                  </Flex>
                </>
              )}
            </TBody>
          </Table>
          {(isMerchant || shouldViewAllSales) && (
            <PageControl>
              <PerPage>
                <p>Per page</p>
                <input
                  type="number"
                  placeholder="perPage"
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
                    <span>{page}</span> of {totalPages}
                  </p>
                </div>
                <button
                  onClick={handleNextPage}
                  style={{ opacity: `${page === totalPages ? "0.4" : "1"}` }}
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
          )}
        </div>
      </Left>
      <Right
        // overflow
        style={{
          border: currentReceipt ? "2px solid #607087" : "none",
          height: "inherit",
          overflowX: "hidden",
          overflowY: "hidden",
          boxShadow: currentReceipt ? "0px 4px 1.875rem rgba(96, 112, 135, 0.2)" : "none",
        }}
      >
        <Receipt
          setShowForm={setShowForm}
          receipt={currentReceipt}
          showForm={showForm}
          reasonSelected={reasonSelected}
          setReasonSelected={setReasonSelected}
          paymentMethodOption={paymentMethodOption}
          handleProcessRefund={handleProcessRefund}
          setPaymentSelected={setPaymentSelected}
          paymentSelected={paymentSelected}
        />
      </Right>
    </ReceiptContainer>
  );
};

export default ReceiptPage;
