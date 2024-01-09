import { useMemo, useState } from "react";
import { Flex } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import { TBody, THead, TRow, Table, Td } from "../../sales/style";
import ModalSidebar from "../product-list/modal";
import { TrfHeader } from "../style";
import PendingTrfDetail from "./pendingTrfDetail";
import { useQuery } from "@apollo/client";
import {
  GET_INVENTORY_TRANSFER,
  InventoryTransferAttr,
} from "../../../schema/productTransfer.schema";
import { useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import { formatDate } from "../../../helper/date";
import { PreReceiptContainer } from "../adjustment-product/style";
import documentIcon from "../../../assets/Document.svg";
import Loader from "../../../components/loader";

const PendingTransfer = () => {
  const [reviewTrf, setReviewTrf] = useState<boolean>(false);
  const [actionData, setActionData] = useState<InventoryTransferAttr[]>([]);
  const currentShop = useAppSelector(getCurrentShop);

  const {
    data: pendingFrom,
    refetch: refetchFrom,
    loading: fromLoading,
  } = useQuery(GET_INVENTORY_TRANSFER, {
    variables: {
      status: "PENDING",
      toShopId: null,
      fromShopId: currentShop.shopId,
      page: 1,
      limit: 50,
    },
    fetchPolicy: "no-cache",
  });
  const {
    data: pendingTo,
    refetch: refetchTo,
    loading: toLoading,
  } = useQuery(GET_INVENTORY_TRANSFER, {
    variables: {
      status: "PENDING",
      toShopId: currentShop.shopId,
      fromShopId: null,
      page: 1,
      limit: 50,
    },
    fetchPolicy: "no-cache",
  });

  const handleRefetchPending = () => {
    refetchFrom();
    refetchTo();
  };

  const isFetching = fromLoading || toLoading;

  const dataFrom = pendingFrom?.getInventoryTransfers || [];
  const dataTo = pendingTo?.getInventoryTransfers || [];
  const data: InventoryTransferAttr[][] = useMemo(
    () => dataFrom.concat(dataTo),
    [dataFrom, dataTo]
  );

  const showActionModal = (trf: InventoryTransferAttr[]) => {
    setActionData(trf);
    setReviewTrf(true);
  };

  return (
    <>
      <TrfHeader>
        <p className="black">Pending Transfers</p>
        <Flex gap="0 0.2rem" className="small">
          You have{" "}
          <p className="yellow" style={{ margin: "0 0.2rem" }}>
            {data?.length}
          </p>{" "}
          pending transfers waiting for you to respond
        </Flex>
      </TrfHeader>

      <div style={{ height: "95%" }}>
        <Table
          overflowX="hidden"
          margin="0"
          width="auto"
          maxWidth="100% !important"
          style={{ margin: "1.5rem 0" }}
        >
          {data?.length > 0 && (
            <THead
              fontSize="0.875rem"
              style={{ padding: "0.4rem 0.2rem" }}
              overflowX="hidden"
              width="100%"
            >
              <Td width="13%">Transfer Type</Td>
              <Td width="25%">
                <span>Origin Shop</span>
              </Td>
              <Td width="25%">
                <span>Destination Shop</span>
              </Td>
              <Td width="12%">
                <span>Total Products</span>
              </Td>
              <Td width="10%">
                <span>Quantity</span>
              </Td>
              <Td width="10%">
                <span>Date</span>
              </Td>
              <Td width="10%">
                <span>Action</span>
              </Td>
            </THead>
          )}
          <TBody style={{ overflow: "hidden", paddingRight: "0" }} width="100%" overflowX="hidden">
            {data && data?.length > 0 ? (
              <>
                {data?.map((trf, i) => (
                  <TRow
                    key={i}
                    onClick={() => showActionModal(trf)}
                    height="2rem"
                    maxWidth="100%"
                    overflowX="hidden"
                    width="100%"
                    style={{
                      padding: "0 0.2rem",
                      color: Colors.blackLight,
                      borderBottom: `1px solid ${Colors.borderGreyColor}`,
                    }}
                  >
                    <Td
                      width="13%"
                      style={{
                        color:
                          trf[0]?.fromShopId === currentShop?.shopId ? Colors.red : Colors.green,
                      }}
                    >
                      {trf[0]?.fromShopId === currentShop?.shopId ? "Outgoing" : "Incoming"}
                    </Td>
                    <Td width="25%">
                      <span>{trf[0]?.FromShop?.shopName}</span>
                    </Td>
                    <Td width="25%">
                      <span>{trf[0]?.ToShop?.shopName}</span>
                    </Td>
                    <Td width="12%">
                      <span>{trf.length}</span>
                    </Td>
                    <Td width="10%">
                      <span>{trf[0]?.quantity}</span>
                    </Td>
                    <Td width="10%">
                      <span>{formatDate(trf[0]?.createdAt)}</span>
                    </Td>
                    <Td width="10%">
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M6.254 0H13.747C17.608 0 20 2.393 20 6.256V13.756C20 17.608 17.608 20 13.747 20H6.244C2.392 20 2.18733e-06 17.608 0.00100219 13.753C0.00100219 13.331 0.344002 12.988 0.766002 12.988C1.189 12.988 1.531 13.331 1.531 13.753C1.531 16.787 3.202 18.467 6.254 18.467H13.747C16.79 18.467 18.47 16.796 18.47 13.753V6.253C18.47 3.21 16.8 1.53 13.747 1.53H6.253C3.21 1.53 1.53 3.21 1.53 6.253V8.566V8.584C1.53 9.002 1.192 9.34 0.774002 9.34H0.765002H0.763002C0.341002 9.34 -0.000997813 8.997 2.1874e-06 8.575V6.253C2.1874e-06 2.393 2.41 0 6.254 0ZM5.52026 8.80399C6.18126 8.80399 6.71826 9.34099 6.71826 9.99999C6.71826 10.66 6.18126 11.197 5.52026 11.197C4.86026 11.197 4.32226 10.66 4.32226 9.99999C4.32226 9.34099 4.86026 8.80399 5.52026 8.80399ZM9.99976 8.80399C10.6608 8.80399 11.1978 9.34099 11.1978 9.99999C11.1978 10.66 10.6608 11.197 9.99976 11.197C9.33976 11.197 8.80176 10.66 8.80176 9.99999C8.80176 9.34099 9.33976 8.80399 9.99976 8.80399ZM15.6772 10C15.6772 9.341 15.1402 8.804 14.4792 8.804C13.8192 8.804 13.2812 9.341 13.2812 10C13.2812 10.66 13.8192 11.197 14.4792 11.197C15.1402 11.197 15.6772 10.66 15.6772 10Z"
                            fill="#607087"
                          />
                        </svg>
                      </span>
                    </Td>
                  </TRow>
                ))}
              </>
            ) : isFetching ? (
              <>
                <Flex
                  direction="column"
                  width="100%"
                  padding="0 1rem"
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Loader noBg />
                </Flex>
              </>
            ) : (
              <>
                <PreReceiptContainer>
                  <img src={documentIcon} alt="" />
                  <h3>Couldn't get any info... create a mew transfer request</h3>
                  <p>Please check back later or check internet connection.</p>
                </PreReceiptContainer>
              </>
            )}
          </TBody>
        </Table>

        {reviewTrf && (
          <ModalSidebar
            height={"100vh"}
            borderRadius=".75rem"
            padding="0"
            showProductModal={reviewTrf}
          >
            <PendingTrfDetail
              refetch={handleRefetchPending}
              data={actionData}
              setShowModal={setReviewTrf}
            />
          </ModalSidebar>
        )}
      </div>
    </>
  );
};

export default PendingTransfer;
