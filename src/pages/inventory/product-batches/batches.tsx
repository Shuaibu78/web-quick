/* eslint-disable no-debugger */
import BatchList from "./batch-list";
import SingleBatch from "./single-batch";
import BatchDetailModal from "./batch-detail";
import CreateBatchModal from "./create-batch";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { Colors } from "../../../GlobalStyles/theme";
import { setBatchProduct } from "../../../app/slices/batch";
import { IBatch } from "../../../interfaces/batch.interface";
import { ModalBox, ModalContainer } from "../../settings/style";
import { ButtonWithIcon } from "../../../components/top-nav/style";
import { Flex } from "../../../GlobalStyles/CustomizableGlobal.style";
import SearchInput from "../../../components/search-input/search-input";
import { FunctionComponent, useEffect, useState } from "react";
import ConfirmAction from "../../../components/modal/confirmAction";
import ImportBatchProduct from "./importBatchProduct";
import { useProdctPageContext } from "../inventory";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { hasPermission } from "../../../helper/comparisons";
import { getUserPermissions } from "../../../app/slices/roles";
import { setNoPermissionModal } from "../../../app/slices/accountLock";

const Batches: FunctionComponent = () => {
  const {
    total,
    batches,
    products,
    bInvPage,
    batchPage,
    showBatch,
    setBatches,
    refetchAll,
    bInvPerPage,
    batchDetail,
    showDetails,
    setBInvPage,
    navbarHeight,
    setShowBatch,
    batchPerPage,
    setBatchPage,
    totalBatchInv,
    setShowDetails,
    setBatchSearch,
    setBInvPerPage,
    setBatchPerPage,
    selectedBatchId,
    selectedBatchNo,
    setBatchProducts,
    handleDeleteBatch,
    setBatchInvSearch,
    setSelectedBatchId,
    batchInventoryCount,
    setSelectedBatchNo,
    handleRemoveBInventory,
    setCurrentInventory,
    setShowProductModal,
    adjustModalPopup,
    setAdjustModalPopup,
  } = useProdctPageContext();
  const [createBatchModal, setCreateBatchModal] = useState<boolean>(false);
  const [selectedBatch, setSelectedBatch] = useState<IBatch>();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [showImport, setShowImport] = useState<boolean>(false);
  const userPermissions = useAppSelector(getUserPermissions);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (selectedBatchId && !isEdit) {
      setShowBatch(true);
    }
  }, [selectedBatchId]);

  const handleNewBatchButton = () => {
    if (showBatch && selectedBatchNo) {
      dispatch(
        setBatchProduct({
          isBatchProduct: true,
          batchId: selectedBatchId,
          batchNumber: selectedBatchNo,
          expiryDate: selectedBatch?.expiryDate,
        })
      );
      setShowImport(true);
    } else {
      setCreateBatchModal(true);
    }
  };

  return (
    <Flex direction="column" width="100%">
      <Flex
        alignItems="center"
        padding="0.625rem 0px"
        width="100%"
        height="2.5rem"
        justifyContent="space-between"
      >
        <Flex width="40%" alignItems="center" justifyContent="space-between">
          <SearchInput
            placeholder={`Search batch ${showBatch ? "product" : "number"}`}
            width="60%"
            handleSearch={showBatch ? setBatchInvSearch : setBatchSearch}
            borderRadius="0.75rem"
          />
        </Flex>

        <Flex alignItems="center" gap="1em">
          {/* {showBatch && (
            <ButtonWithIcon
              style={{ backgroundColor: Colors.lightPrimaryColor, color: Colors.primaryColor }}
              id="add-button"
              onClick={() => {}}
            >
              <div>
                <img src={DownloadIcon} alt="import" width="0.9375rem" />
              </div>
              <span>Import Products</span>
            </ButtonWithIcon>
          )} */}

          <ButtonWithIcon
            id="add-button"
            onClick={() => {
              const canView = hasPermission("MANAGE_INVENTORY", userPermissions);
              if (canView) {
                handleNewBatchButton();
              } else {
                dispatch(
                  toggleSnackbarOpen({
                    message: "Access denied, Contact your manager",
                    color: "INFO",
                  })
                );
                dispatch(setNoPermissionModal(true));
              }
            }}
          >
            <div
              style={{
                width: "1.25rem",
                height: "1.25rem",
                borderRadius: "50%",
                backgroundColor: Colors.lightPrimary,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <p style={{ fontSize: "1.25rem", color: Colors.primaryColor }}>+</p>
            </div>
            <span>{showBatch ? "Add New Product" : "Create New Batch"}</span>
          </ButtonWithIcon>
        </Flex>
      </Flex>

      {selectedBatchId && showBatch && (
        <SingleBatch
          bInvPage={bInvPage}
          products={products}
          refetchAll={refetchAll}
          bInvPerPage={bInvPerPage}
          setBInvPage={setBInvPage}
          navbarHeight={navbarHeight}
          adjustModalPopup={adjustModalPopup}
          setAdjustModalPopup={setAdjustModalPopup}
          totalBatchInv={totalBatchInv}
          setBInvPerPage={setBInvPerPage}
          setBatchProducts={setBatchProducts}
          batchNumber={selectedBatch?.batchNumber}
          setShowProductModal={setShowProductModal}
          setCurrentInventory={setCurrentInventory}
          handleRemoveInventory={handleRemoveBInventory}
        />
      )}

      {!showBatch && (
        <BatchList
          {...{
            total,
            batches,
            batchPage,
            setIsEdit,
            setBatches,
            refetchAll,
            setBatchPage,
            setShowBatch,
            batchPerPage,
            navbarHeight,
            setShowImport,
            setBatchPerPage,
            setSelectedBatch,
            handleDeleteBatch,
            setSelectedBatchId,
            setSelectedBatchNo,
            batchInventoryCount,
          }}
        />
      )}

      {(createBatchModal || isEdit) && (
        <ModalContainer>
          <ModalBox position width="26rem" textMargin="0 0">
            <CreateBatchModal
              isEdit={isEdit}
              setIsEdit={setIsEdit}
              refetch={refetchAll}
              setCreateBatchModal={setCreateBatchModal}
              selectedBatch={selectedBatch}
            />
          </ModalBox>
        </ModalContainer>
      )}

      {showDetails && (
        <ModalContainer>
          <ModalBox position width="26rem" textMargin="0 0">
            <BatchDetailModal
              setIsEdit={setIsEdit}
              setIsDelete={setIsDelete}
              selectedBatch={batchDetail}
              setBatchDetailModal={setShowDetails}
            />
          </ModalBox>
        </ModalContainer>
      )}

      {showImport && (
        <ModalContainer>
          <ModalBox position width="30rem" textMargin="0 0">
            <ImportBatchProduct setShowImport={setShowImport} refetchAll={refetchAll} />
          </ModalBox>
        </ModalContainer>
      )}

      {isDelete && (
        <ConfirmAction
          setConfirmSignout={() => setIsDelete(false)}
          doAction={() => {
            handleDeleteBatch(selectedBatch?.batchId);
            setIsDelete(false);
            setShowBatch(false);
            setShowDetails(false);
            setSelectedBatchId("");
          }}
          action="Delete Batch?"
          actionText="Are you sure you want to delete this batch?"
        />
      )}
    </Flex>
  );
};

export default Batches;
