import { Table, THead, TBody, TRow, Td } from "../../sales/style";
import emptyImage from "../../../assets/empty.svg";
import { useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import { ISales } from "../../../interfaces/sales.interface";
import { GET_RECENT_SALES } from "../../../schema/sales.schema";
import { formatAmountIntl } from "../../../helper/format";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { TEmpty } from "../style";
import { Link } from "react-router-dom";
import { hasPermission } from "../../../helper/comparisons";
import { getUserPermissions } from "../../../app/slices/roles";

const RecentSalesTable = ({
  filteredDate,
}: {
  filteredDate:
    | {
        from: Date;
        to: Date;
      }
    | undefined;
}) => {
  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useAppDispatch();
  const { roles } = useAppSelector((state) => state);
  const { user: userInfo } = useAppSelector((state) => state);
  const reduxSelector = useAppSelector((state) => state);
  const userPermissions = useAppSelector(getUserPermissions);
  const isMerchant = userInfo?.userId === reduxSelector?.shops?.currentShop?.userId;
  const shouldViewAllSales = hasPermission("VIEW_ALL_SALES", userPermissions);
  const shouldViewSales = hasPermission("VIEW_SALE", userPermissions);

  const { data } = useQuery<{ getRecentSales: ISales[] }>(GET_RECENT_SALES, {
    variables: {
      shopId: currentShop?.shopId,
      from: filteredDate?.from.toString(),
      to: filteredDate?.to.toString(),
    },
    skip: !currentShop?.shopId,
    fetchPolicy: "cache-and-network",
    onError(error) {
      if (currentShop?.shopId) {
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      }
    },
  });
  return (
    <div>
      <div>
        {data?.getRecentSales?.length! > 0 ? (
          <Table maxWidth="1188px">
            <THead fontSize="0.875rem">
              <Td width="0.625rem"></Td>
              <Td width="298px">
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
                <span>Discount</span>
              </Td>
              <Td width="9.375rem">
                <span>Date</span>
              </Td>
            </THead>
            <TBody>
              {data?.getRecentSales.map((val, i) => {
                return (
                  <TRow minWidth="1188px" background={(i + 1) % 2 ? "#F6F8FB" : ""} key={i}>
                    <Td width="0.625rem"></Td>
                    <Td width="298px">
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
                      <span>{val?.discount ?? 0}</span>
                    </Td>
                    <Td width="9.375rem">
                      <span>{new Date(val?.createdAt!).toDateString()}</span>
                    </Td>
                  </TRow>
                );
              })}
            </TBody>
          </Table>
        ) : (
          <Table maxWidth="1188px">
            <THead fontSize="0.875rem">
              <Td width="0.625rem"></Td>
              <Td width="298px">
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
            <TEmpty>
              <img src={emptyImage} alt="empty-img" />
              <h3>No Records to Show Yet</h3>
              <p>Start adding products and making sales to see your progress here.</p>
              {isMerchant ||
                shouldViewAllSales ||
                (shouldViewSales ? (
                  <></>
                ) : (
                  <Link to="/dashboard/product/add">Add Your First Product</Link>
                ))}
            </TEmpty>
          </Table>
        )}
      </div>
    </div>
  );
};

export default RecentSalesTable;
