import React, { useEffect } from "react";
import TopNav from "../../components/top-nav/top-nav";
import { Table, THead, TBody, TRow, Td } from "../sales/style";
import { useLazyQuery } from "@apollo/client";
import { IShop } from "../../interfaces/shop.interface";
import { GET_ALL_SHOPS } from "../../schema/shops.schema";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { getCurrentUser } from "../../app/slices/userInfo";

const ShopPage = () => {
  const currentUser = useAppSelector(getCurrentUser);
  const isUserAvailable = Number(currentUser?.userId?.length) > 0;
  const dispatch = useAppDispatch();

  const [getUserShop, { data }] = useLazyQuery<{ getUsersShops: [IShop] }>(GET_ALL_SHOPS, {
    variables: {
      userId: currentUser?.userId
    },
    fetchPolicy: "network-only",
    onError(error) {
      if (isUserAvailable) {
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      }
    },
  });

  useEffect(() => {
    if (isUserAvailable === true) {
      getUserShop();
    }
  }, [isUserAvailable]);

  return (
    <>
      <div>
        <TopNav header="Shops" />
        <Table maxWidth="1188px">
          <THead fontSize="0.875rem" style={{ paddingLeft: "0.625rem" }}>
            <Td width="180px">
              <span>Shop Name</span>
            </Td>
            <Td width="9.375rem">
              <span>Approval status</span>
            </Td>
            <Td width="130px">
              <span>Phone</span>
            </Td>
            <Td width="350px">
              <span>Address</span>
            </Td>
            <Td width="6.25rem">
              <span>City</span>
            </Td>
            <Td width="6.25rem">
              <span>State</span>
            </Td>

            <Td width="140px">
              <span>Date Created</span>
            </Td>
          </THead>
          <TBody height="max-content">
            {data?.getUsersShops.map((val, i) => {
              return (
                <TRow
                  minWidth="1188px"
                  background={(i + 1) % 2 ? "#F6F8FB" : ""}
                  style={{ paddingLeft: "0.625rem" }}
                  key={i}
                >
                  <Td width="180px">
                    <span>{val.shopName}</span>
                  </Td>
                  <Td width="9.375rem">
                    <span>{val.shopApprovalStatus}</span>
                  </Td>
                  <Td width="130px">
                    <span>{val.shopPhone}</span>
                  </Td>
                  <Td width="350px">
                    <span>{val.shopAddress}</span>
                  </Td>
                  <Td width="6.25rem">
                    <span>{val.city}</span>
                  </Td>
                  <Td width="6.25rem">
                    <span>{val.state}</span>
                  </Td>

                  <Td width="140px">
                    <span>{val.createdAt && new Date(val.createdAt).toDateString()}</span>
                  </Td>
                </TRow>
              );
            })}
          </TBody>
        </Table>
      </div>
    </>
  );
};

export default ShopPage;
