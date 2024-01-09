import { Dispatch, FC, SetStateAction, useState } from "react";
import { Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import { CancelButton, CustomCont, TBody, THead, TRow, Table, Td } from "../../sales/style";
import Cancel from "../../../assets/cancel.svg";
import { Button } from "../../../components/button/Button";
import Checkbox from "../../../components/checkbox/checkbox";
import { numberToWord } from "../../supply/supply.utils";
import { InventoryTransferAttr, UPDATE_INV_TRANSFER } from "../../../schema/productTransfer.schema";
import { useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import { useMutation } from "@apollo/client";
import { isLoading } from "../../../app/slices/status";
import { useDispatch } from "react-redux";
import { socketClient } from "../../../helper/socket";
import { SYNC_START } from "../../../utils/constants";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";

interface ReviewProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  data: InventoryTransferAttr[];
  refetch: () => void;
}

const PendingTrfDetail: FC<ReviewProps> = ({ setShowModal, data, refetch }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [allSelected, setAllSelected] = useState<boolean>();
  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useDispatch();

  const handleSelectAll = () => {
    if (selectedIds.length > 0 && selectedIds.length === data.length) {
      setSelectedIds([]);
      setAllSelected(false);
    } else {
      setSelectedIds(data.map((list) => list.inventoryTransferId as string));
      setAllSelected(true);
    }
  };

  const [updateInvTransfer] = useMutation(UPDATE_INV_TRANSFER, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleInvTransferUpdate = (status: "DECLINED" | "ACCEPTED") => {
    dispatch(isLoading(true));
    updateInvTransfer({
      variables: {
        inventoryTransferIds: selectedIds,
        status: status,
      },
    })
      .then(() => {
        dispatch(isLoading(false));
        setShowModal(false);
        dispatch(
          toggleSnackbarOpen({
            message: "Inventory Transfer status updated successfully",
            color: "SUCCESS",
          })
        );
        refetch();
        socketClient.emit(SYNC_START, { shopId: currentShop.shopId });
      })
      .catch((err) => {
        refetch();
        dispatch(isLoading(false));
        dispatch(
          toggleSnackbarOpen({
            message: err.message || err.graphqlErrors[0]?.message,
            color: "DANGER",
          })
        );
        socketClient.emit(SYNC_START, { shopId: currentShop.shopId });
      });
  };

  const selectItem = (e: React.ChangeEvent<HTMLInputElement>, selectedProduct: string) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedIds([...selectedIds, selectedProduct]);
    } else {
      setSelectedIds(selectedIds.filter((id) => id !== selectedProduct));
    }
  };

  const handleRowClick = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <>
      <Flex
        direction="column"
        position="relative"
        margin="0.625rem 0px"
        height="96%"
        style={{ minWidth: "28rem", maxWidth: "28rem" }}
      >
        <Flex padding="0 0.9rem" direction="column">
          <Flex alignItems="center" justifyContent="space-between">
            <h3>
              {currentShop.shopId === data[0]?.FromShop.shopId
                ? data[0]?.ToShop.shopName
                : data[0]?.FromShop.shopName}
            </h3>
            <CancelButton
              style={{
                width: "1.875rem",
                height: "1.875rem",
                display: "grid",
                placeItems: "center",
              }}
              hover
              onClick={() => setShowModal(false)}
            >
              <img src={Cancel} alt="" />
            </CancelButton>
          </Flex>
        </Flex>

        <Flex style={{ width: "100%", overflow: "hidden" }}>
          <Table
            overflowX="hidden"
            margin="0"
            width="15rem"
            maxWidth="28rem"
            style={{ margin: "1.5rem 0" }}
          >
            <THead
              fontSize="0.875rem"
              style={{ padding: "0.4rem 0.2rem" }}
              overflowX="hidden"
              width="100%"
            >
              <Flex width="100%" justifyContent="space-between">
                <Td width="5%">
                  <CustomCont imgHeight="100%" height="1.25rem">
                    <Checkbox
                      isChecked={allSelected}
                      onChange={handleSelectAll}
                      color="#130F26"
                      size="1.125rem"
                    />
                  </CustomCont>
                </Td>
                <Td width="90%">
                  {selectedIds.length > 0 && (
                    <Span color={Colors.secondaryColor} style={{ textTransform: "capitalize" }}>
                      {numberToWord[selectedIds.length]} ({selectedIds.length}) Selected
                    </Span>
                  )}
                </Td>
              </Flex>
            </THead>
            <TBody style={{ overflowX: "hidden", paddingRight: "0" }} width="100%">
              {data.map((list) => {
                const isChecked = selectedIds.includes(list.inventoryTransferId);
                return (
                  <TRow
                    isSelected={selectedIds.includes(list.inventoryTransferId)}
                    onClick={() => handleRowClick(list.inventoryTransferId)}
                    style={{
                      padding: "0 0.2rem",
                      color: Colors.blackLight,
                      borderBottom: `1px solid ${Colors.borderGreyColor}`,
                    }}
                  >
                    <Flex width="100%">
                      <Td width="5%">
                        <CustomCont>
                          <Checkbox
                            isChecked={isChecked}
                            onChange={(e) => selectItem(e, list?.inventoryTransferId!)}
                            color={isChecked ? "#fff" : "#130F26"}
                            size="1.125rem"
                          />
                        </CustomCont>
                      </Td>
                      <Td color={isChecked ? "white" : "black"} width="90%">
                        <div>
                          <Flex fontSize="0.875rem">{list.FromInventory.inventoryName}</Flex>
                          <Flex fontSize="0.75rem">
                            {list.FromShop.shopId === currentShop.shopId
                              ? "Transferring"
                              : "Receiving"}{" "}
                            <p style={{ color: Colors.secondaryColor, margin: "0 0.2rem" }}>
                              {list.quantity}
                            </p>{" "}
                            quantity
                          </Flex>
                        </div>
                      </Td>
                    </Flex>
                  </TRow>
                );
              })}
            </TBody>
          </Table>
        </Flex>

        <Flex
          justifyContent="space-around"
          position="absolute"
          width="100%"
          style={{ bottom: "0.5rem" }}
        >
          <Button
            label="Cancel Transfer"
            disabled={selectedIds.length === 0}
            onClick={() => handleInvTransferUpdate("DECLINED")}
            backgroundColor={Colors.red}
            height="2rem"
            width="40%"
            color="white"
            borderRadius="0.5rem"
          />
          <Button
            label="Confirm Transfer"
            disabled={data[0]?.FromShop.shopId === currentShop.shopId || selectedIds.length === 0}
            onClick={() => handleInvTransferUpdate("ACCEPTED")}
            backgroundColor={Colors.primaryColor}
            height="2rem"
            width="40%"
            color="white"
            borderRadius="0.5rem"
          />
        </Flex>
      </Flex>
    </>
  );
};

export default PendingTrfDetail;
