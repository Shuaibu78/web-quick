import TopNav from "../../components/top-nav/top-nav";
import { useMutation, useQuery } from "@apollo/client";
import { Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import { SalesCard } from "../home/style";
import { SalesCardContainer } from "./style";
import { formatAmountIntl, formatNumber } from "../../helper/format";
import { useEffect, useState } from "react";
import AddNewSupplyModal from "./modal/addNewSupply";
import SupplierList from "./supplierList";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { isLoading } from "../../app/slices/status";
import { getCurrentShop, increaseSyncCount } from "../../app/slices/shops";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { DELETE_SUPPLIER, GET_ALL_SUPPLIERS } from "../../schema/supplier.schema";
import { SupplierAttr, SupplierRequest } from "../../interfaces/supplies.interface";
import PaySupplyBalanceModal from "./modal/payBalanceModal";
import {
  setPayBalanceModal,
  setShowModal,
  setEditSupplier,
} from "../../app/slices/showSupplyModal";
import { syncTotalTableCount } from "../../helper/comparisons";

const Suppliers = () => {
  const [supplierList, setSupplierList] = useState<SupplierAttr[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierAttr>({});
  const [selectedSupplierIds, setSelectedSupplierIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [supplier, setSupplier] = useState<SupplierAttr>({});
  const [shouldAddSupplies, setShouldAddSupplies] = useState<boolean>(false);
  const [searchSupplier, setSearchSupplier] = useState<string>("");

  const dispatch = useAppDispatch();
  const payBalanceModal = useAppSelector((state) => state.modal.payBalanceModal);
  const showModal = useAppSelector((state) => state.modal.showModal);
  const editSupplier = useAppSelector((state) => state.modal.editSupplier);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const shouldEditSupplier = (editSupplier: boolean) => {
    dispatch(setEditSupplier(editSupplier));
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const changePayBalanceModal = (payBalanceModal: boolean) => {
    dispatch(setPayBalanceModal(payBalanceModal));
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const changeShowModal = (showModal: boolean) => {
    dispatch(setShowModal(showModal));
  };

  const currentShop = useAppSelector(getCurrentShop);
  const syncTableUpdateCount = useAppSelector((state) =>
    syncTotalTableCount(state.shops.syncTableUpdateCount, ["Supplier"])
  );

  const { data: supplierData, refetch: refetchSupplier } = useQuery<{
    getSuppliers: SupplierRequest;
  }>(GET_ALL_SUPPLIERS, {
    variables: {
      shopId: currentShop?.shopId!,
      limit: perPage,
      page,
      searchQuery: searchSupplier,
    },
    onCompleted: (data) => {
      setSupplierList(data?.getSuppliers?.suppliers);
    },
  });

  useEffect(() => {
    refetchSupplier();
    (window as any).scrollTo(0, 0);
  }, [perPage, syncTableUpdateCount]);

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
        supplierIds: selectedSupplierIds,
        shopId: currentShop.shopId,
      },
    })
      .then((res) => {
        if (res.data?.deleteSupplier.successful) {
          dispatch(isLoading(false));
          dispatch(toggleSnackbarOpen("Supplier Successfully Deleted"));
          dispatch(increaseSyncCount(["Supplier"]));
          setSelectedSupplierIds([]);
        }
      })
      .catch((err) => {
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen(err?.message || err?.graphQLErrors[0]?.message));
      });
  };

  const handleModalNew = () => {
    changeShowModal(true);
    shouldEditSupplier(false);
    setShouldAddSupplies(false);
  };

  const supplyNavContent = () => {
    return (
      <SalesCardContainer>
        <SalesCard height="75px" width="32%">
          <Flex width="100%" justifyContent="start" direction="row">
            <Flex width="50%" justifyContent="space-between" direction="column">
              <Span fontSize="0.875rem" fontWeight="400">
                Suppliers
              </Span>
              <Flex alignItems="center">
                <Span fontSize="1.25rem" fontWeight="500" margin="0.5rem 0 0 0">
                  {formatNumber(
                    supplierData?.getSuppliers?.totals.totalSupplierCount as number,
                    0
                  ) || 0}
                </Span>
              </Flex>
            </Flex>
            <Flex width="50%" justifyContent="center" direction="column" alignItems="center">
              <Span fontSize="0.875rem" fontWeight="400">
                Supplies Worth
              </Span>{" "}
              <Flex alignItems="center">
                <Span fontSize="1.25rem" fontWeight="500" margin="0.5rem 0 0 0">
                  {formatAmountIntl(
                    undefined,
                    Number(supplierData?.getSuppliers?.totals?.totalSupplierAmount || 0)
                  )}
                </Span>
              </Flex>
            </Flex>
          </Flex>
        </SalesCard>

        <SalesCard
          style={{ marginLeft: "1rem", backgroundColor: "#ECEFF4" }}
          height="75px"
          width="35%"
        >
          <Flex width="100%" justifyContent="start" direction="row">
            <Flex width="50%" justifyContent="space-between" direction="column">
              <Flex alignItems="center">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.6875 1.25H5L3.125 8.4375H5.625L4.375 13.75L12.5 5H8.75L9.6875 1.25Z"
                    stroke="#607087"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M6.5625 3.4375L5.9375 5.9375" stroke="#607087" strokeLinecap="round" />
                </svg>
                <Span margin="0 0 0 0.5rem" fontSize="13px" fontWeight="500" color="#9EA8B7">
                  Amount Paid
                </Span>
              </Flex>
              <Span fontSize="1.25rem" fontWeight="500" color="#219653" margin="0.5rem 0 0 0">
                {formatAmountIntl(
                  undefined,
                  Number(supplierData?.getSuppliers?.totals?.totalAmountPaid || 0)
                )}
              </Span>
            </Flex>
            <Flex width="50%" justifyContent="space-between" direction="column" alignItems="end">
              <Flex alignItems="center" width="80%" justifyContent="start">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.75 5H6.25"
                    stroke="#607087"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.75 6.5625C13.75 6.51438 13.75 6.22938 13.7487 6.20938C13.7262 5.89625 13.4581 5.64687 13.1206 5.62625C13.0994 5.625 13.0737 5.625 13.0212 5.625H11.395C10.2788 5.625 9.375 6.46438 9.375 7.5C9.375 8.53562 10.2794 9.375 11.3937 9.375H13.0206C13.0731 9.375 13.0988 9.375 13.1206 9.37375C13.4581 9.35313 13.7269 9.10375 13.7487 8.79062C13.75 8.77062 13.75 8.48562 13.75 8.4375"
                    stroke="#607087"
                    strokeLinecap="round"
                  />
                  <path
                    d="M11.25 8.125C11.5952 8.125 11.875 7.84518 11.875 7.5C11.875 7.15482 11.5952 6.875 11.25 6.875C10.9048 6.875 10.625 7.15482 10.625 7.5C10.625 7.84518 10.9048 8.125 11.25 8.125Z"
                    fill="#607087"
                  />
                  <path
                    d="M8.125 2.5C10.4819 2.5 11.6606 2.5 12.3925 3.2325C12.8981 3.7375 13.055 4.455 13.1031 5.625M6.25 12.5H8.125C10.4819 12.5 11.6606 12.5 12.3925 11.7675C12.8981 11.2625 13.055 10.545 13.1031 9.375M5.625 2.5C3.67875 2.50625 2.64687 2.5675 1.9825 3.2325C1.25 3.96437 1.25 5.14313 1.25 7.5C1.25 9.85687 1.25 11.0356 1.9825 11.7675C2.39062 12.1762 2.9375 12.3569 3.75 12.4363"
                    stroke="#607087"
                    strokeLinecap="round"
                  />
                </svg>
                <Span margin="0 0 0 0.5rem" fontSize="13px" fontWeight="500" color="#9EA8B7">
                  Remaining Balance
                </Span>
              </Flex>
              <Span
                fontSize="1.25rem"
                fontWeight="500"
                color="#FF5050"
                margin="0.5rem 0 0 0"
                style={{ width: "80%" }}
              >
                {formatAmountIntl(
                  undefined,
                  Number(supplierData?.getSuppliers?.totals?.totalAmountRemaining || 0)
                )}
              </Span>
            </Flex>
          </Flex>
        </SalesCard>
      </SalesCardContainer>
    );
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopNav header="My Suppliers" supplyNavContent={supplyNavContent} />

      <SupplierList
        setShowModal={changeShowModal}
        setPayBalanceModal={changePayBalanceModal}
        setEditSupplier={shouldEditSupplier}
        setSupplier={setSupplier}
        supplierList={supplierList}
        setPage={setPage}
        page={page}
        setSelectedSupplierIds={setSelectedSupplierIds}
        selectedSupplierIds={selectedSupplierIds}
        handleItemDelete={handleDeleteSupplier}
        setSelectedSupplier={setSelectedSupplier}
        setShouldAddSupplies={setShouldAddSupplies}
        perPage={perPage}
        setSearchSupplier={setSearchSupplier}
        searchSupplier={searchSupplier}
        totalSupplies={supplierData?.getSuppliers?.totals.totalSupplierCount as number}
      />

      {showModal && (
        <AddNewSupplyModal
          setShowModal={changeShowModal}
          setEditSupplier={shouldEditSupplier}
          supplier={supplier}
          setSupplier={setSupplier}
          editSupplier={editSupplier}
          refetchSupplier={refetchSupplier}
          shouldAddSupplies={shouldAddSupplies}
          setShouldAddSupplies={setShouldAddSupplies}
        />
      )}

      {payBalanceModal && (
        <PaySupplyBalanceModal
          setShowModal={changePayBalanceModal}
          selectedSupplier={selectedSupplier}
          refetchSupplier={refetchSupplier}
        />
      )}
    </div>
  );
};

export default Suppliers;
