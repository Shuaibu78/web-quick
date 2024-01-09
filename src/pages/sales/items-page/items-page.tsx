/* eslint-disable no-debugger */
/* eslint-disable comma-dangle */
import React, { FunctionComponent, useEffect, useState } from "react";
import TShirt from "../../../assets/ProductImg.png";
import arrowL from "../../../assets/ArrowL.svg";
import arrowR from "../../../assets/ArrowR.svg";
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
  Filter,
  FilterItemB,
  FilterContainer,
} from "../style";
import { PageControl } from "../../inventory/style";
import { useLazyQuery, useQuery } from "@apollo/client";
import { IAllSales } from "../../../interfaces/sales.interface";
import { GET_ALL_SALES } from "../../../schema/sales.schema";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { ICustomer } from "../../../interfaces/inventory.interface";
import { GET_ALL_CUSTOMERS } from "../../../schema/customer.schema";
import roundCancelIcon from "../../../assets/r-cancel.svg";
import { formatAmountIntl, formatDate } from "../../../helper/format";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { hasPermission } from "../../../helper/comparisons";
import { getUserPermissions } from "../../../app/slices/roles";
import {
  setPaymentFilter,
  setProductFilterList,
  setProductIdFilterList,
  setUserFilterList,
  setUserIdFilterList,
} from "../../../app/slices/salesFilter";

interface IFilteredDate {
  from: Date;
  to: Date;
}

interface ItemsPageProps {
  showFilterModal: boolean;
  setShowFilterModal: React.Dispatch<React.SetStateAction<boolean>>;
  setReceiptButtonState?: React.Dispatch<React.SetStateAction<boolean>>;
  setListButtonState?: React.Dispatch<React.SetStateAction<boolean>>;
  receiptButtonState?: boolean;
  listButtonState?: boolean;
  filteredDate?: IFilteredDate;
  navbarHeight?: number;
}
// type DynamicObject = {
//   [key: string]: boolean;
// };
const ItemsPage: FunctionComponent<ItemsPageProps> = ({ filteredDate }) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const dispatch = useAppDispatch();
  // const [showProduct, setShowProduct] = useState(false);
  // const [showUser, setShowUser] = useState(false);
  // const paymentMethodOption = ["Cash", "Pos", "Transfer"];
  const [dateRange, setDateRange] = useState<IFilteredDate>(filteredDate as IFilteredDate);
  const {
    user: userInfo,
    shops: { currentShop },
    salesFilter: {
      productIdFilterList,
      productFilterList,
      userIdFilterList,
      userFilterList,
      paymentFilter,
      filterByDiscountSales,
      // productSearch,
    },
  } = useAppSelector((state) => state);

  const isMerchant = userInfo?.userId === currentShop?.userId;
  const userPermissions = useAppSelector(getUserPermissions);
  const shouldViewAllSales = hasPermission("VIEW_ALL_SALES", userPermissions);

  useEffect(() => {
    setDateRange(filteredDate as IFilteredDate);
  }, [filteredDate]);

  const shopId = currentShop?.shopId;
  const [getSalesRequest, { data }] = useLazyQuery<{ getAllSales: IAllSales }>(GET_ALL_SALES, {
    variables: {
      shopId,
      limit: isNaN(perPage) ? 10 : perPage,
      page,
      paymentMethods: paymentFilter,
      userIds: userIdFilterList,
      inventoryIds: productIdFilterList,
      from: dateRange?.from.toString(),
      to: dateRange?.to.toString(),
      isDiscountSales: filterByDiscountSales,
    },
    fetchPolicy: "cache-and-network",
    onError(error) {
      if (currentShop?.shopId) {
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      }
    },
  });

  const handleNextPage = () => {
    if (page < Math.ceil((data?.getAllSales?.totalSales || 1) / (isNaN(perPage) ? 10 : perPage))) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useQuery<{
    getAllCustomers: {
      customers: [ICustomer];
    };
  }>(GET_ALL_CUSTOMERS, {
    variables: {
      shopId: currentShop?.shopId,
    },
    skip: !currentShop?.shopId,
  });

  // const { data: allUserData } = useQuery<{
  //   getAllUsers: UsersAttr[];
  // }>(GET_ALL_USER, {
  //   variables: {
  //     shopId: currentShop?.shopId,
  //   },
  //   skip: !currentShop?.shopId,
  //   onError(error) {
  //     dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
  //   },
  // });

  const removePaymentMethod = (method: string) => {
    const filterCopy: string[] = [...paymentFilter];
    const position = filterCopy.indexOf(method);
    filterCopy.splice(position, 1);
    dispatch(setPaymentFilter(filterCopy));
  };

  const handleRemoveProductFilter = (idx: number) => {
    const copyIdProductList = [...productIdFilterList];
    copyIdProductList.splice(idx, 1);
    dispatch(setProductIdFilterList(copyIdProductList));
    const copyOld = [...productFilterList];
    copyOld.splice(idx, 1);
    dispatch(setProductFilterList(copyOld));
  };

  const handleRemoveUserFilter = (idx: number) => {
    const copyOld = [...userIdFilterList];
    copyOld.splice(idx, 1);
    dispatch(setUserIdFilterList(copyOld));
    const copyOfUserFilterList = [...userFilterList];
    copyOfUserFilterList.splice(idx, 1);
    dispatch(setUserFilterList(copyOfUserFilterList));
  };

  useEffect(() => {
    getSalesRequest();
  }, [filteredDate]);

  // useEffect(() => {
  //   if (showProduct) {
  //     searchInventory();
  //   }
  // }, [showProduct, productSearch]);

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "white",
        height: "inherit",
        overflow: "hidden",
      }}
    >
      <FilterContainer>
        {/* <p>Filter Selection</p> */}
        <div id="filter-container">
          {productFilterList.map((val, i) => (
            <Filter key={i}>
              <span id="head">Product</span>
              <FilterItemB key={i}>
                <button onClick={() => handleRemoveProductFilter(i)}>
                  <img src={roundCancelIcon} alt="" />
                </button>
                <span>{val}</span>
              </FilterItemB>
            </Filter>
          ))}
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

      <Table height="100%" maxWidth="100%">
        <THead fontSize="0.875rem">
          <Td width="3.75rem"></Td>
          <Td width="248px">
            <span>Item</span>
          </Td>
          <Td width="9.375rem">
            <span>Unit Price (₦)</span>
          </Td>
          <Td width="6.25rem">
            <span>Qty</span>
          </Td>
          <Td width="130px">
            <span>Total (₦)</span>
          </Td>
          <Td width="9.375rem">
            <span>Payment Method</span>
          </Td>
          <Td width="6.25rem">
            <span>Discount</span>
          </Td>
          <Td width="9.375rem">
            <span>Date</span>
          </Td>
        </THead>
        <TBody
          overflowY="scroll"
          // maxHeight={showSalesCard ? "50vh" : "60vh"}
          height="90%"
          style={{ marginBottom: "0rem" }}
        >
          {data?.getAllSales?.sales &&
            data.getAllSales.sales.map((val, i) => {
              return (
                <TRow background={(i + 1) % 2 ? "#F6F8FB" : ""} key={i}>
                  <Td width="3.75rem">
                    <CustomCont imgHeight="100%" margin="0 0 0 0.625rem">
                      <img src={TShirt} alt="" />
                    </CustomCont>
                  </Td>
                  <Td width="248px">
                    <span>{val.inventoryName}</span>
                  </Td>
                  <Td width="9.375rem">
                    <span>
                      {formatAmountIntl(undefined, Number(val?.amount) / Number(val?.quantity))}
                    </span>
                  </Td>
                  <Td width="6.25rem">
                    <span>{val.quantity}</span>
                  </Td>
                  <Td width="130px">
                    <span>{formatAmountIntl(undefined, val.amount)}</span>
                  </Td>
                  <Td width="9.375rem">
                    <span>{val.paymentMethod}</span>
                  </Td>
                  <Td width="6.25rem">
                    <span>{val?.discount}</span>
                  </Td>
                  <Td width="9.375rem">
                    <span>{formatDate(new Date(val?.createdAt!))}</span>
                  </Td>
                </TRow>
              );
            })}
        </TBody>
      </Table>

      {(isMerchant || shouldViewAllSales) && (
        <PageControl style={{ background: "#fff" }}>
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
                of {Math.ceil((data?.getAllSales?.totalSales || 1) / perPage)}
              </p>
            </div>
            <button
              onClick={handleNextPage}
              style={{
                opacity: `${
                  page === Math.ceil((data?.getAllSales?.totalSales || 1) / perPage) ? "0.4" : "1"
                }`,
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
                max={Math.ceil((data?.getAllSales?.totalSales || 1) / perPage)}
                style={{
                  paddingInline: "6px 0.625rem",
                  paddingBlock: "6px",
                  border: "1px solid black",
                }}
                onChange={(e) =>
                  setPage(
                    Math.min(
                      Math.ceil((data?.getAllSales?.totalSales || 1) / perPage),
                      Number(e.target.value)
                    )
                  )
                }
                placeholder="Page No."
              />
            </div>
          </JumpTo>
        </PageControl>
      )}
    </div>
  );
};

export default ItemsPage;
