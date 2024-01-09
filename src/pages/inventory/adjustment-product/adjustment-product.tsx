/* eslint-disable comma-dangle */
import React, { FunctionComponent, useState } from "react";
import { AdjustmentWrapper, LeftWrapper, RightWrapper, CustomFilterModal } from "./style";
import { Table, THead, TBody, TRow, Td, ListItem, TBtnCont } from "../../sales/style";
import cancel from "../../../assets/cancel.svg";
import Checkbox from "../../../components/checkbox/checkbox";
import { Flex } from "../../../components/receipt/style";
import filterIcon from "../../../assets/Filter.svg";
import StockAdjumentCard from "../../../components/quantity-adjustment-card/stockAdjustmentCard";
import { STOCK_ADJUSTMENT_HISTORY } from "../../../schema/inventory.schema";
import { IInventoryHistory } from "../../../interfaces/inventory.interface";
import { useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import lightFormat from "date-fns/lightFormat";
import { parseISO } from "date-fns";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";

interface BulkOption {
  quantity: number;
  price: string;
}

interface ItemsPageProps {
  showFilterModal: boolean;
  setShowFilterModal: React.Dispatch<React.SetStateAction<boolean>>;
}

type DynamicObject = {
  [key: string]: boolean;
};

const AdjustProduct: FunctionComponent<ItemsPageProps> = ({
  showFilterModal,
  setShowFilterModal,
}) => {
  // const [productButtonState, setProductButtonState] = useState<boolean>(true);
  // const [itemsButtonState, setItemsButtonState] = useState<boolean>(false);
  // const [selectedCategory, setSelectedCategory] = useState<number>(-1);
  // const [selectedUnit, setSelectedUnit] = useState<number>(-1);
  // const reasonOption = ["RESTOCK", "RETURN", "RESET"];
  // const unitOption = ["5Pack", "Testing"];
  const [bulkOptions, setBulkOptions] = useState<BulkOption[]>([{ quantity: 0, price: "" }]);
  const [historyData, setHistoryData] = useState<IInventoryHistory>({});

  const [checkboxSelected, setCheckboxSelected] = useState<DynamicObject>({});

  const [showReceipt, setShowReceipt] = useState<boolean>(false);
  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useAppDispatch();
  // const [jumpTo, setJumpTo] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // const updateBulkOption = (
  //   index: number,
  //   property: "quantity" | "price",
  //   value: string | number
  // ) => {
  //   setBulkOptions((prevBulkOption: BulkOption[]) => {
  //     const copyOfOldBulkOption = [...prevBulkOption];
  //     if (typeof value === "number" && property === "price") {
  //       copyOfOldBulkOption[index].quantity = value;
  //     } else if (property === "price" && typeof value === "string") {
  //       copyOfOldBulkOption[index].price = value;
  //     }
  //     return copyOfOldBulkOption;
  //   });
  // };

  const { data } = useQuery<{ getAllStockAdjustmentHistory: [IInventoryHistory] }>(
    STOCK_ADJUSTMENT_HISTORY,
    {
      variables: {
        shopId: currentShop?.shopId,
        limit: isNaN(perPage) ? 10 : perPage,
        page,
      },
      skip: !currentShop?.shopId,
      fetchPolicy: "cache-and-network",
      onError(error) {
        if (currentShop?.shopId) {
          dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
        }
      },
    }
  );

  return (
    <>
      <AdjustmentWrapper>
        <LeftWrapper>
          <Flex width="100%" justifyContent="space-between" alignItems="center">
            <h3>Adjustment History</h3>

            {/* <TBtnCont>
              <button
                style={{ background: "#ffbe62" }}
                onClick={() => setShowFilterModal(!showFilterModal)}
              >
                <img src={filterIcon} alt="" />
              </button>
            </TBtnCont> */}
          </Flex>
          {showFilterModal && (
            <CustomFilterModal>
              <Flex justifyContent="space-between" padding="0 0 1.25rem 0">
                <h3>Filter</h3>
                <button onClick={() => setShowFilterModal(false)}>
                  <img src={cancel} alt="" />
                </button>
              </Flex>

              <h4>By Staff</h4>
              <ListItem>
                <Checkbox
                  isChecked={!!checkboxSelected["0"]}
                  onChange={(e) => {
                    setCheckboxSelected((state: DynamicObject) => {
                      return { ...state, 0: e.target.checked };
                    });
                  }}
                  color="#130F26"
                  size=""
                />
                <p>All Staff</p>
              </ListItem>
              <ListItem>
                <Checkbox
                  isChecked={!!checkboxSelected["1"]}
                  onChange={(e) => {
                    setCheckboxSelected((state: DynamicObject) => {
                      return { ...state, 1: e.target.checked };
                    });
                  }}
                  color="#130F26"
                  size=""
                />
                <p>
                  Kunle Adebayo <span>Sales Person 1</span>
                </p>
              </ListItem>
              <ListItem>
                <Checkbox
                  isChecked={!!checkboxSelected["2"]}
                  onChange={(e) => {
                    setCheckboxSelected((state: DynamicObject) => {
                      return { ...state, 2: e.target.checked };
                    });
                  }}
                  color="#130F26"
                  size=""
                />
                <p>
                  Janet Jackson <span>Sales Person 2</span>
                </p>
              </ListItem>
              <ListItem>
                <Checkbox
                  isChecked={!!checkboxSelected["3"]}
                  onChange={(e) => {
                    setCheckboxSelected((state: DynamicObject) => {
                      return { ...state, 3: e.target.checked };
                    });
                  }}
                  color="#130F26"
                  size=""
                />
                <p>
                  Queen Latifah <span>Cashier</span>
                </p>
              </ListItem>
            </CustomFilterModal>
          )}
          <div className="tableContainer">
            <Table>
              <THead fontSize="0.875rem">
                <Td width="1.25rem"></Td>
                <Td width="120px">
                  <span>Last Adjusted</span>
                </Td>
                <Td width="15.625rem">
                  <span>Item</span>
                </Td>
                <Td width="120px">
                  <span>Qty Adjusted</span>
                </Td>
                <Td width="130px">
                  <span>Reason</span>
                </Td>
              </THead>
              <TBody>
                <div className="table">
                  {data?.getAllStockAdjustmentHistory.map((val, i) => (
                    <TRow
                      background="#F6F8FB"
                      onClick={() => {
                        setShowReceipt(true);
                        setHistoryData(val);
                      }}
                      key={i}
                    >
                      <Td width="1.25rem"></Td>
                      <Td width="6.25rem">
                        <span>{lightFormat(parseISO(val?.createdAt!), "dd/MM/yyyy h:mm aaa")}</span>
                      </Td>
                      <Td width="15.625rem">
                        <span>{val?.inventoryName}</span>
                      </Td>
                      <Td width="120px">
                        <span>{val?.adjustmentQuantity}</span>
                      </Td>
                      <Td width="130px">
                        <span>{val?.reason}</span>
                      </Td>
                    </TRow>
                  ))}
                </div>
              </TBody>
            </Table>
          </div>
        </LeftWrapper>
        <RightWrapper>
          <StockAdjumentCard showReceipt={showReceipt} historyData={historyData} />
        </RightWrapper>
        {/* TODO: card for product history design */}
        {/* <RightWrapper>
          <AdjumentCard showReceipt={showReceipt} historyData={historyData} />
        </RightWrapper> */}
      </AdjustmentWrapper>
    </>
  );
};

export default AdjustProduct;
