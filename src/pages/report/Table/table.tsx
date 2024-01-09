import React, { FunctionComponent, useState } from "react";
import dropIcon from "../../../assets/dropIcon2.svg";
import TShirt from "../../../assets/TShirt.png";
import CustomDropdown from "../../../components/custom-dropdown/custom-dropdown";
import arrowL from "../../../assets/ArrowL.svg";
import arrowR from "../../../assets/ArrowR.svg";
import {
  // eslint-disable-next-line comma-dangle
  NotFoundContainer,
} from "../style";
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
import userCircleIcon from "../../../assets/userCircle.svg";
import { PageControl } from "../../inventory/style";
import { useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import { IAllSales } from "../../../interfaces/sales.interface";
import { GET_ALL_SALES } from "../../../schema/sales.schema";
import { formatAmountIntl } from "../../../helper/format";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";

interface ItemsPageProps {
  showTable: boolean;
}

const ReportTable: FunctionComponent<ItemsPageProps> = ({ showTable }) => {
  const perPageOptions: number[] = [10, 20, 30];
  const [perPageSelected, setPerPageSelected] = useState<number>(0);
  const currentShop = useAppSelector(getCurrentShop);
  const [jumpTo, setJumpTo] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const dispatch = useAppDispatch();

  const { data } = useQuery<{ getAllSales: IAllSales }>(GET_ALL_SALES, {
    variables: {
      shopId: currentShop?.shopId,
      limit: isNaN(perPage) ? 10 : perPage,
      page,
    },
    fetchPolicy: "cache-and-network",
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });
  const handleNextPage = () => {
    if (page < Math.ceil((data?.getAllSales?.totalSales || 1) / perPage)) {
      setPage(page + 1);
    }
  };
  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };
  const handleJumpTo = () => {
    if (!Number(jumpTo)) return;
    const pageNum = Math.ceil(
      (data?.getAllSales?.totalSales || 1) / (isNaN(perPage) ? 10 : perPage)
    );
    if (Number(jumpTo) > pageNum) return;
    setPage(Number(jumpTo));
  };
  return (
    <div>
      {showTable ? (
        <div>
          <Table maxWidth="1188px">
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
              <Td width="12.5rem">
                <span>Sold By</span>
              </Td>
              <Td width="9.375rem">
                <span>Date</span>
              </Td>
            </THead>
            <TBody>
              {data?.getAllSales.sales.map((val, i) => {
                return (
                  <TRow minWidth="1188px" background={(i + 1) % 2 ? "#F6F8FB" : ""} key={i}>
                    <Td width="3.75rem">
                      <CustomCont imgHeight="100%">
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
                    <Td width="12.5rem">
                      <span>Cashier</span>
                    </Td>
                    <Td width="9.375rem">
                      <span>{new Date(val?.createdAt!).toDateString()}</span>
                    </Td>
                  </TRow>
                );
              })}
            </TBody>
          </Table>
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
        </div>
      ) : (
        <NotFoundContainer>
          <img src={userCircleIcon} alt="" />
          <h3>Generate Reports On The Go</h3>
          <p>FIlter and generate reports for your store instanly, export to PDF, Excel or Print</p>
        </NotFoundContainer>
      )}
    </div>
  );
};

export default ReportTable;
