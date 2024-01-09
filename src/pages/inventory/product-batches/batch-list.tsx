import { FunctionComponent, useEffect, useState } from "react";
import arrowL from "../../../assets/ArrowL.svg";
import arrowR from "../../../assets/ArrowR.svg";
import Delete from "../../../assets/Delete.svg";
import Edit from "../../../assets/Edit.svg";
import BatchIcon from "../../../assets/add-product-batch.svg";
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
import { Flex } from "../../../components/receipt/style";
import Checkbox from "../../../components/checkbox/checkbox";
import { PageControl } from "../../inventory/style";
import { ModalBox, ModalContainer } from "../../settings/style";
import EmptyBatchModal from "./empty-batch-modal";
import { IBatch } from "../../../interfaces/batch.interface";
import moment from "moment";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setBatchProduct } from "../../../app/slices/batch";
import ConfirmAction from "../../../components/modal/confirmAction";
import AllCheckedHeader from "./allCheckedHeader";
import { IBatchListProps } from "../inventory.interface";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { setNoPermissionModal } from "../../../app/slices/accountLock";
import { hasPermission } from "../../../helper/comparisons";
import { getUserPermissions } from "../../../app/slices/roles";

export type DynamicObject = {
  [key: string]: boolean;
};

const BatchList: FunctionComponent<IBatchListProps> = ({
  total,
  batches,
  batchPage,
  setIsEdit,
  setBatches,
  setShowBatch,
  setBatchPage,
  navbarHeight,
  batchPerPage,
  setShowImport,
  setBatchPerPage,
  setSelectedBatch,
  handleDeleteBatch,
  setSelectedBatchId,
  setSelectedBatchNo,
  batchInventoryCount,
}) => {
  const [isDelete, setIsDelete] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedBatches, setSelectedBatches] = useState<IBatch[]>([]);
  const [selectedBatchIds, setSelectedBatchIds] = useState<(string | undefined)[]>([]);
  const [emptyBatchModal, setEmptyBatchModal] = useState<boolean>(false);
  const userPermissions = useAppSelector(getUserPermissions);

  const dispatch = useAppDispatch();

  const handleSelectAll = () => {
    const every = batches?.every((batch) => batch.checked);
    const updatedBatches = batches?.map((batch) => {
      return { ...batch, checked: !every };
    });
    setBatches(updatedBatches);
    setSelectAll(!every);
  };

  const handleSelectRow = (id?: string) => {
    const updatedBatches = batches?.map((batch) => {
      if (batch.batchId === id) {
        return { ...batch, checked: !batch.checked };
      }
      return batch;
    });

    const allChecked = updatedBatches.every((batch) => batch.checked);
    const checkedBatchIds = updatedBatches
      .filter((batch) => batch.checked)
      .map((batch) => batch.batchId);

    setBatches(updatedBatches);
    setSelectAll(allChecked);
    setSelectedBatchIds(checkedBatchIds);
  };

  const handleNextPage = () => {
    if (batchPage < (total || 1)) {
      setBatchPage(batchPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (batchPage > 1) {
      setBatchPage(batchPage - 1);
    }
  };

  useEffect(() => {
    if (batches?.length < 1) setEmptyBatchModal(true);

    const checkedBatches = batches.filter((batch) => batch.checked);
    setSelectedBatches(checkedBatches);
  }, [batches]);

  const handleActions = ({ action, batch }: { action: string | null; batch: IBatch }, e: any) => {
    if ((action && e?.target.closest("#actions")) || e?.target.closest("#checkbox")) {
      if (action) {
        if (action === "add") {
          dispatch(
            setBatchProduct({
              isBatchProduct: true,
              batchId: batch.batchId,
              batchNumber: batch.batchNumber,
              expiryDate: batch.expiryDate,
            })
          );
          setShowImport(true);
        } else if (action === "edit") {
          setSelectedBatchId(batch.batchId);
          setSelectedBatch(batches.find((b) => b.batchId === batch.batchId));
          setIsEdit(true);
        } else if (action === "delete") {
          setSelectedBatchId("");
          setSelectedBatchIds([batch.batchId]);
          setIsDelete(true);
        }
      }
      return;
    }
    if (action === "click") {
      setShowBatch(true);
      setSelectedBatchId(batch.batchId);
      setSelectedBatchNo(batch.batchNumber);
      setSelectedBatch(batches.find((b) => b.batchId === batch.batchId));
    }
  };

  return (
    <div>
      <Table maxWidth="100%" overflowX="unset">
        <THead fontSize="14px" minWidth="100%" justifyContent="flex-start">
          <Td width="4%">
            <CustomCont imgHeight="100%" height="20px">
              <Checkbox
                isChecked={selectAll}
                color="#130F26"
                size="18px"
                onChange={handleSelectAll}
              />
            </CustomCont>
          </Td>
          {selectedBatches.length > 0 ? (
            <AllCheckedHeader
              allSelected={batches.length === selectedBatchIds.length}
              handleSelectAll={handleSelectAll}
              title={`Batch${selectedBatchIds.length > 1 ? "es" : ""}`}
              handleItemDelete={() => setIsDelete(true)}
            />
          ) : (
            <>
              <Td width="10%">
                <span>Batch number</span>
              </Td>
              <Td width="18%">
                <span>Date added</span>
              </Td>
              <Td width="18%">
                <span>Expiry date</span>
              </Td>
              <Td width="15%">
                <span>Products</span>
              </Td>
              <Td width="25%">
                <span>Description</span>
              </Td>
              <Td width="10%">
                <span>Actions</span>
              </Td>
            </>
          )}
        </THead>
        <TBody
          maxHeight={`calc(100vh - ${navbarHeight! + 150}px)`}
          overflowY="
        scroll"
          width="100%"
        >
          {batches?.map((batch, i) => {
            return (
              <TRow
                minWidth="100%"
                background={(i + 1) % 2 === 0 ? "#F6F8FB" : ""}
                key={batch.batchId}
                onClick={(e) => {
                  handleActions({ action: "click", batch }, e);
                }}
              >
                <Td width="4%" id="checkbox">
                  <CustomCont imgHeight="100%">
                    <Checkbox
                      isChecked={!!batch.checked}
                      onChange={(e) => {
                        handleSelectRow(batch.batchId);
                        handleActions({ action: null, batch }, e);
                      }}
                      color="#130F26"
                      size="18px"
                    />
                  </CustomCont>
                </Td>

                <Td width="10%">
                  <span>{batch.batchNumber}</span>
                </Td>
                <Td width="18%">
                  <span>
                    {batch.dateAdded ? moment(batch.dateAdded).format("Do MMM YYYY") : "Not Added"}
                  </span>
                </Td>
                <Td width="18%">
                  <span>
                    {batch.expiryDate
                      ? moment(batch.expiryDate).format("Do MMM YYYY")
                      : "Not Added"}
                  </span>
                </Td>
                <Td width="15%">
                  <span>{batchInventoryCount[i]}</span>
                </Td>

                <Td width="25%">
                  <span>{batch.description}</span>
                </Td>
                <Td width="10%" id="actions">
                  <CustomCont imgHeight="20px">
                    <Flex alignItems="center" gap="20px" margin="0 10px 0 0">
                      <img
                        src={BatchIcon}
                        alt="add product to batch"
                        onClick={(e) => {
                          const canView = hasPermission("MANAGE_INVENTORY", userPermissions);
                          if (canView) {
                            handleActions({ action: "add", batch }, e);
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
                      />
                      <img
                        src={Edit}
                        alt="edit"
                        onClick={(e) => {
                          const canView = hasPermission("MANAGE_INVENTORY", userPermissions);
                          if (canView) {
                            handleActions({ action: "edit", batch }, e);
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
                      />
                      <img
                        src={Delete}
                        alt="delete"
                        onClick={(e) => {
                          const canView = hasPermission("MANAGE_INVENTORY", userPermissions);
                          if (canView) {
                            handleActions({ action: "delete", batch }, e);
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
                      />
                    </Flex>
                  </CustomCont>
                </Td>
              </TRow>
            );
          })}
        </TBody>
      </Table>

      {emptyBatchModal && (
        <ModalContainer>
          <ModalBox position width="26rem" textMargin="0 0">
            <EmptyBatchModal setEmptyBatchModal={setEmptyBatchModal} />
          </ModalBox>
        </ModalContainer>
      )}

      {isDelete && (
        <ConfirmAction
          setConfirmSignout={() => setIsDelete(false)}
          doAction={() => {
            handleDeleteBatch(selectedBatchIds);
            setIsDelete(false);
          }}
          action={`Delete batch${selectedBatchIds.length > 1 ? "s" : ""}?`}
          actionText={`Are you sure you want to remove ${
            selectedBatchIds.length > 1 ? "these" : "this"
          } batch${selectedBatchIds.length > 1 ? "s" : ""}?`}
        />
      )}

      {batches?.length > 0 && (
        <PageControl>
          <PerPage>
            <p>Per page</p>
            <input
              type="number"
              placeholder="perPage"
              value={batchPerPage}
              onChange={(e) => setBatchPerPage(parseInt(e.target.value))}
            />
          </PerPage>
          <CurrentPage>
            <button style={{ opacity: `${batchPage > 1 ? "1" : "0.4"}` }} onClick={handlePrevPage}>
              <img src={arrowL} alt="" />
            </button>
            <div>
              <p>
                <span>{batchPage}</span> of {total || 1}
              </p>
            </div>
            <button
              onClick={handleNextPage}
              style={{ opacity: `${batchPage === (total || 1) ? "0.4" : "1"}` }}
            >
              <img src={arrowR} alt="" />
            </button>
          </CurrentPage>
          <JumpTo>
            <p>Jump To</p>
            <div>
              <input
                type="number"
                min={total || 1}
                max={1}
                style={{
                  paddingInline: "6px 10px",
                  paddingBlock: "6px",
                  border: "1px solid black",
                }}
                onChange={(e) => setBatchPage(Math.min(total || 1, Number(e.target.value)))}
                placeholder="Page No."
              />
            </div>
          </JumpTo>
        </PageControl>
      )}
    </div>
  );
};

export default BatchList;
