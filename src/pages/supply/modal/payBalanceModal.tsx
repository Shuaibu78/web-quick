/* eslint-disable indent */
import React, { FunctionComponent, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { getCurrentShop } from "../../../app/slices/shops";

import cancelIcon from "../../../assets/cancel.svg";

import { ModalBox, ModalContainer, CancelModalButton } from "../../settings/style";
import { Flex } from "../../../components/receipt/style";
import { InputField } from "../../../components/input-field/input";
import { Span, Button, Flex as FlexDiv } from "../../../GlobalStyles/CustomizableGlobal.style";
import { useCreateSupplierRecord, numberToWord } from "../supply.utils";
import {
  SupplierAttr,
  SupplyRecordAttr,
  SupplyRecordInput,
} from "../../../interfaces/supplies.interface";
import {
  CREATE_SUPPLY_TRANSACTION,
  GET_SUPPLY_RECORD_BY_SUPPLIER_ID,
} from "../../../schema/supplier.schema";
import { TEmpty } from "../../home/style";
import emptyImage from "../../../assets/empty.svg";
import { validateInputNum } from "../../../utils/formatValues";
import { Colors } from "../../../GlobalStyles/theme";
import { formatAmountIntl } from "../../../helper/format";

interface IModal {
  setShowModal: (value: boolean) => void;
  refetchSupplier: () => void;
  selectedSupplier: SupplierAttr;
}

interface IInventoryList {
  inventoryId?: string;
  inventoryName?: string;
  variationId?: string;
  shopId?: string;
  inventoryType?: "PIECES" | "PACK" | "VARIATION" | "PIECES_AND_PACK" | "NON_TRACKABLE";
}

const PaySupplyBalanceModal: FunctionComponent<IModal> = ({
  setShowModal,
  refetchSupplier,
  selectedSupplier,
}) => {
  const [supplierComment, setSupplierComment] = useState<string>("");
  const [recordsAmount, setRecordsAmount] = useState<number>(0);
  const [recordSelectedIds, setRecordSelectedIds] = useState<string[]>([]);
  const [recordsSelected, setRecordsSelected] = useState<SupplyRecordAttr[]>([]);

  const [createTransaction, { loading }] = useMutation(CREATE_SUPPLY_TRANSACTION);

  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useAppDispatch();

  const { data: supplyRecordData } = useQuery<{
    getSupplyRecordsBySupplierId: SupplyRecordAttr[];
  }>(GET_SUPPLY_RECORD_BY_SUPPLIER_ID, {
    variables: {
      shopId: currentShop?.shopId as string,
      supplierId: selectedSupplier?.supplierId as string,
    },
    fetchPolicy: "cache-and-network",
    onError(err) {
      dispatch(toggleSnackbarOpen(err?.message || err?.graphQLErrors[0]?.message));
    },
  });

  const handleRemoveSupplyRecord = (selectedSupplyRecord: SupplyRecordAttr) => {
    const result = recordsSelected.filter(
      (supplyRecord) => supplyRecord.supplyRecordId !== selectedSupplyRecord?.supplyRecordId
    );

    const resultForId = recordSelectedIds.filter(
      (supplyRecordId) => supplyRecordId !== selectedSupplyRecord?.supplyRecordId
    );
    setRecordsSelected(result);
    setRecordSelectedIds(resultForId);
  };

  const handleAddSupplyRecord = (selectedSupplyRecord: SupplyRecordAttr) => {
    const shoulddAdd = recordsSelected.filter(
      (supplyRecord) => supplyRecord.supplyRecordId === selectedSupplyRecord?.supplyRecordId
    );

    if (shoulddAdd.length === 0) {
      setRecordsSelected([...recordsSelected, selectedSupplyRecord]);
      setRecordSelectedIds([...recordSelectedIds, selectedSupplyRecord?.supplyRecordId!]);
    } else {
      handleRemoveSupplyRecord(selectedSupplyRecord);
    }
  };

  // Function to handle creating the supply transaction
  const handleCreateTransaction = async () => {
    try {
      const supplyRecordInputs: SupplyRecordInput[] = recordsSelected.map((record) => ({
        supplyRecordId: record.supplyRecordId,
        supplierId: record.supplierId,
        comment: record.comment,
        shopId: record.shopId,
        paymentStatus: record.paymentStatus,
        totalAmount: record.totalAmount,
        amountPaid: record.amountPaid,
      }));

      const response = await createTransaction({
        variables: {
          selectedRecords: supplyRecordInputs,
          totalAmountPaid: recordsAmount,
          transactionComment: supplierComment,
        },
      });

      const { successful } = response.data.createSupplyTransaction;
      if (successful) {
        dispatch(toggleSnackbarOpen("Transaction successful"));
        setShowModal(false);
        refetchSupplier();
      }
    } catch (err: any) {
      // Handle any errors
      console.log(err);
    }
  };

  return (
    <ModalContainer>
      <ModalBox style={{ height: "auto" }} padding="0px">
        <Flex
          height="100%"
          width="100%"
          justifyContent="space-between"
          alignItems="flex-start"
          borderRadius="1.2em"
          backgroundColor="linear-gradient(90deg, #F4F6F9 50%, white 50%);"
        >
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="flex-start"
            padding="1.25rem 1.875rem 0px 1.25rem"
          >
            <Flex justifyContent="flex-start" alignItems="center" margin="0 0 1.25rem">
              <Span fontSize="1.375rem" fontWeight="600">
                Pay Balance
              </Span>
            </Flex>
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="flex-start"
              margin="1em 0 0 0"
            >
              <InputField
                label="Amount to Pay"
                placeholder="₦ 0.00"
                type="text"
                size="lg"
                backgroundColor="white"
                color="#353e49"
                borderRadius="0.75rem"
                borderSize="1px"
                borderColor="#607087"
                border
                fontSize="1rem"
                width="100%"
                value={recordsAmount}
                onChange={(e) => validateInputNum(setRecordsAmount, e.target.value)}
                required
              />
            </Flex>

            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="flex-start"
              margin="1.5em 0 0 0"
            >
              <InputField
                label="Comment (Optional)"
                placeholder="Enter your comment"
                type="text"
                size="lg"
                backgroundColor="white"
                color="#353e49"
                borderRadius="12px"
                borderSize="1px"
                borderColor="#607087"
                border
                fontSize="16px"
                width="100%"
                value={supplierComment}
                onChange={(e) => setSupplierComment(e.target.value)}
              />
            </Flex>

            <Flex
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              margin="1.25rem 0px 0px"
              height="auto"
            >
              <Span color="#607087" fontSize="13px" fontWeight="400">
                Select Transactions to Pay
              </Span>

              <Flex>
                <Flex
                  flexDirection="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  gap="0px 0px"
                  height="12.5rem"
                >
                  {supplyRecordData?.getSupplyRecordsBySupplierId
                    ?.filter((record) => record?.paymentStatus !== "PAID")
                    ?.map((record) => (
                      <label
                        key={record.supplyRecordId}
                        htmlFor=""
                        style={{
                          width: "335px",
                          height: "55px",
                          cursor: "pointer",
                          padding: "0.3125rem",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: "#fff",
                          borderRadius: "0.625rem",
                          margin: "0.3125rem 0px",
                        }}
                        onClick={() => handleAddSupplyRecord(record)}
                      >
                        <Flex justifyContent="center" alignItems="center" gap="0px 0.625rem">
                          <input
                            type="checkbox"
                            checked={recordSelectedIds.includes(record?.supplyRecordId as string)}
                            onChange={() => handleAddSupplyRecord(record)}
                          />
                          <Flex
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="flex-start"
                            gap="0.625rem 0.625rem"
                            onClick={() => handleAddSupplyRecord(record)}
                          >
                            <Span
                              fontSize="13px"
                              fontWeight="400"
                              color="#607087"
                              style={{ textTransform: "capitalize" }}
                            >
                              {numberToWord[record?.SupplyItems?.length!]} (
                              {record?.SupplyItems?.length!}) items
                            </Span>
                            <Span fontSize="0.625rem" fontWeight="400" color="#9EA8B7">
                              {new Date(record?.createdAt!)
                                .toUTCString()
                                .split(" ")
                                .slice(0, 5)
                                .join(" ")}
                            </Span>
                          </Flex>
                        </Flex>

                        <Flex
                          flexDirection="column"
                          justifyContent="flex-start"
                          alignItems="flex-end"
                        >
                          <Span fontSize="13px" fontWeight="400" color="#607087">
                            {formatAmountIntl(undefined, Number(record?.totalAmount))}
                          </Span>
                        </Flex>
                      </label>
                    ))}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
          <Flex
            flexDirection="column"
            justifyContent="flex-start"
            alignItems="flex-start"
            padding="1.25rem 1.875rem 0px 2.5rem"
          >
            <Flex justifyContent="flex-end" alignItems="center" margin="0 0 1.25rem">
              <CancelModalButton onClick={() => setShowModal(false)}>
                <img src={cancelIcon} alt="" />
              </CancelModalButton>
            </Flex>

            <Flex
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="flex-start"
              height="15.625rem"
            >
              {recordsSelected?.length > 0 ? (
                recordsSelected?.map((record) => (
                  <div
                    style={{
                      width: "335px",
                      height: "55px",
                      cursor: "pointer",
                      padding: "0.3125rem",
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      backgroundColor: "#F4F6F9",
                      borderRadius: "0.625rem",
                      marginBlock: "0.3125rem",
                    }}
                  >
                    <Flex justifyContent="center" alignItems="center" gap="0px 0.625rem">
                      <Button
                        borderSize="0px"
                        borderColor="transparent"
                        backgroundColor="transparent"
                        margin="0px"
                        padding="0"
                        height="auto"
                        style={{ textTransform: "capitalize" }}
                        onClick={() => handleRemoveSupplyRecord(record)}
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.8825 6.3125C12.8825 6.3125 12.5205 10.8025 12.3105 12.6938C12.2105 13.5972 11.6525 14.1265 10.7385 14.1432C8.99921 14.1745 7.25788 14.1765 5.51921 14.1398C4.63987 14.1218 4.09121 13.5858 3.99321 12.6985C3.78188 10.7905 3.42188 6.3125 3.42188 6.3125"
                            stroke="#FF5050"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M13.8053 4.15951H2.5"
                            stroke="#FF5050"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M11.6274 4.15998C11.104 4.15998 10.6534 3.78998 10.5507 3.27732L10.3887 2.46665C10.2887 2.09265 9.95004 1.83398 9.56404 1.83398H6.74204C6.35604 1.83398 6.01738 2.09265 5.91738 2.46665L5.75538 3.27732C5.65271 3.78998 5.20204 4.15998 4.67871 4.15998"
                            stroke="#FF5050"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </Button>
                      <Flex
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="flex-start"
                        gap="0.625rem 0.625rem"
                      >
                        <Span fontSize="13px" fontWeight="400" color="#607087">
                          {numberToWord[record?.SupplyItems?.length!]} (
                          {record?.SupplyItems?.length!}) items
                        </Span>
                        <Span fontSize="0.625rem" fontWeight="400" color="#9EA8B7">
                          {new Date(record?.createdAt!).toLocaleString()}
                        </Span>
                      </Flex>
                    </Flex>

                    <Flex flexDirection="column" justifyContent="flex-start" alignItems="flex-end">
                      <Flex
                        flexDirection="column"
                        justifyContent="center"
                        alignItems="flex-end"
                        gap="0.625rem 0.625rem"
                      >
                        <Span fontSize="13px" fontWeight="400" color="#607087">
                          ₦ {record?.totalAmount}
                        </Span>
                        <Span fontSize="0.625rem" fontWeight="400" color="#9EA8B7">
                          ₦ {record?.totalAmount! - record?.amountPaid!} Remaining
                        </Span>
                      </Flex>
                    </Flex>
                  </div>
                ))
              ) : (
                <TEmpty style={{ textAlign: "center", width: "18.75rem" }} height="235px">
                  <img src={emptyImage} alt="empty-img" />
                  <Span fontSize="1rem" fontWeight="600" color="#607087">
                    No Supply Record Selected{" "}
                  </Span>
                  <Span fontSize="0.75rem" fontWeight="400" color="#9EA8B7" margin="0.625rem 0 0">
                    Please Input your amount on the right and select transactions to pay.
                  </Span>
                </TEmpty>
              )}
            </Flex>
            {recordsSelected?.length > 0 && (
              <FlexDiv
                height="100%"
                justifyContent="center"
                alignItems="flex-end"
                margin="6px 0"
                width="100%"
                onClick={handleCreateTransaction}
              >
                <button
                  style={{
                    backgroundColor:
                      loading || recordsAmount < 1 ? Colors.lightOrange : Colors.primaryColor,
                    outline: "none",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    borderRadius: "0.75rem",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    width: "100%",
                    padding: "0.75rem 0",
                  }}
                  disabled={loading || recordsAmount < 1}
                >
                  Pay Balance
                </button>
              </FlexDiv>
            )}
          </Flex>
        </Flex>
      </ModalBox>
    </ModalContainer>
  );
};

export default PaySupplyBalanceModal;
