import { FunctionComponent, useEffect, useState } from "react";
import arrowL from "../../../assets/ArrowL.svg";
import arrowR from "../../../assets/ArrowR.svg";
import Delete from "../../../assets/Delete.svg";
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
import Checkbox from "../../../components/checkbox/checkbox";
import { BContainer, PageControl } from "../style";
import { ExpensesWrapper } from "../../expenses/style";
import { Flex } from "../../../GlobalStyles/CustomizableGlobal.style";
import { IInventory } from "../../../interfaces/inventory.interface";
import {
  getInventoryQuantity,
  getProductCostPrice,
  getProductSellingPrice,
  productValue,
} from "../../../helper/inventory.helper";
import ConfirmAction from "../../../components/modal/confirmAction";
import AllCheckedHeader from "./allCheckedHeader";
import { ISingleBatchProps } from "../inventory.interface";
import { setSingleInventory } from "../../../app/slices/inventory";
import { useAppDispatch } from "../../../app/hooks";
import PopupCard from "../../../components/popUp/PopupCard";
import AdjustProductQty from "../product-list/adjustProductQty/AdjustProductQty";

export type DynamicObject = {
  [key: string]: boolean;
};

const SingleBatch: FunctionComponent<ISingleBatchProps> = ({
  products,
  bInvPage,
  refetchAll,
  setBInvPage,
  batchNumber,
  bInvPerPage,
  navbarHeight,
  totalBatchInv,
  setBInvPerPage,
  adjustModalPopup,
  setBatchProducts,
  setAdjustModalPopup,
  setShowProductModal,
  setCurrentInventory,
  handleRemoveInventory,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<IInventory[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<(string | undefined)[]>([]);

  const dispatch = useAppDispatch();

  const handleSelectAll = () => {
    const every = products.every((batchProduct) => batchProduct.checked);
    const updatedBatchProducts = products.map((batchProduct) => {
      return { ...batchProduct, checked: !every };
    });
    setBatchProducts(updatedBatchProducts);
    setSelectAll(!every);
  };

  const handleSelectRow = (id?: string) => {
    const updatedBatchProducts = products.map((batchProduct) => {
      if (batchProduct.inventoryId === id) {
        return { ...batchProduct, checked: !batchProduct.checked };
      }
      return batchProduct;
    });

    const allChecked = updatedBatchProducts.every((batchProduct) => batchProduct.checked);
    setBatchProducts(updatedBatchProducts);
    setSelectAll(allChecked);
  };

  useEffect(() => {
    const checkedProducts = products.filter((product) => product.checked);

    const checkedBatchIds = checkedProducts
      .filter((product) => product.checked)
      .map((product) => product.inventoryId);

    setSelectedProducts(checkedProducts);
    setSelectedProductIds(checkedBatchIds);
  }, [products]);

  const totalPages = Math.ceil(totalBatchInv / (isNaN(bInvPerPage) ? 10 : bInvPerPage));

  const handleNextPage = () => {
    if (bInvPage < totalPages) {
      setBInvPage(bInvPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (bInvPage > 1) {
      setBInvPage(bInvPage - 1);
    }
  };

  const handleRowClick = (e: any, val: IInventory) => {
    if (e.target.closest(".action-btn") || e.target.closest(".checkbox")) {
      return;
    }
    setShowProductModal(true);
    setCurrentInventory(val);
    dispatch(setSingleInventory(val));
  };

  return (
    <ExpensesWrapper>
      <BContainer>
        <Table maxWidth="100%" overflowX="unset" margin="0px">
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
            {selectedProducts.length > 0 ? (
              <AllCheckedHeader
                allSelected={selectedProducts.length === products.length}
                handleSelectAll={handleSelectAll}
                title={`Product${selectedProductIds.length > 1 ? "s" : ""}`}
                handleItemDelete={() => setIsDelete(true)}
              />
            ) : (
              <>
                <Td width="25%">
                  <span>Product</span>
                </Td>
                <Td width="10%">
                  <span>Category</span>
                </Td>
                <Td width="10%">
                  <span>Quantity</span>
                </Td>
                <Td width="10%">
                  <span>Cost price</span>
                </Td>
                <Td width="10%">
                  <span>Selling price</span>
                </Td>
                <Td width="10%">
                  <span>Product value</span>
                </Td>
                <Td width="15%">
                  <span>Batch</span>
                </Td>
                <Td width="6%">
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
            {products.map((batchProduct, i) => {
              return (
                <TRow
                  minWidth="100%"
                  background={(i + 1) % 2 === 0 ? "#F6F8FB" : ""}
                  key={batchProduct.inventoryId}
                  onClick={(e) => handleRowClick(e, batchProduct)}
                >
                  <Td width="4%" className="checkbox">
                    <CustomCont imgHeight="100%">
                      <Checkbox
                        isChecked={batchProduct.checked!}
                        onChange={() => handleSelectRow(batchProduct.inventoryId)}
                        color="#130F26"
                        size="18px"
                      />
                    </CustomCont>
                  </Td>

                  <Td width="25%">
                    <span>{batchProduct.inventoryName}</span>
                  </Td>
                  <Td width="10%">
                    <span>{batchProduct.InventoryCategory?.inventorycategoryName}</span>
                  </Td>
                  <Td width="10%">
                    <span>
                      {batchProduct?.inventoryType === "NON_TRACKABLE"
                        ? "∞"
                        : getInventoryQuantity(batchProduct)}
                    </span>
                  </Td>
                  <Td width="10%">
                    <span>{getProductCostPrice(batchProduct)}</span>
                  </Td>
                  <Td width="10%">
                    <span>{getProductSellingPrice(batchProduct)}</span>
                  </Td>
                  <Td width="10%">
                    <span>
                      {batchProduct?.inventoryType !== "NON_TRACKABLE"
                        ? productValue(batchProduct)
                        : getProductSellingPrice(batchProduct)}
                    </span>
                  </Td>
                  <Td width="15%">
                    <span>Batch {batchNumber}</span>
                  </Td>
                  <Td width="6%" className="action-btn">
                    <CustomCont imgHeight="20px">
                      <Flex alignItems="center" gap="20px" margin="0 10px 0 0">
                        <img
                          src={Delete}
                          alt="more"
                          onClick={() => {
                            setIsDelete(true);
                            setSelectedProductIds([batchProduct.inventoryId!]);
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
      </BContainer>

      {isDelete && (
        <ConfirmAction
          setConfirmSignout={() => setIsDelete(false)}
          doAction={() => {
            handleRemoveInventory(selectedProductIds);
            setIsDelete(false);
          }}
          action={`Remove Product${selectedProductIds.length > 1 ? "s" : ""}?`}
          actionText={`Are you sure you want to remove ${
            selectedProductIds.length > 1 ? "these" : "this"
          } product${selectedProductIds.length > 1 ? "s" : ""} from batch?`}
        />
      )}

      {adjustModalPopup && (
        <PopupCard close={() => setAdjustModalPopup(false)}>
          <AdjustProductQty setAdjustModalPopup={setAdjustModalPopup} handleRefetch={refetchAll} />
        </PopupCard>
      )}

      {products.length > 0 && (
        <PageControl>
          <PerPage>
            <p>Per page</p>
            <input
              type="number"
              placeholder="perPage"
              value={bInvPerPage}
              onChange={(e) => setBInvPerPage(parseInt(e.target.value))}
            />
          </PerPage>
          <CurrentPage>
            <button style={{ opacity: `${bInvPage > 1 ? "1" : "0.4"}` }} onClick={handlePrevPage}>
              <img src={arrowL} alt="" />
            </button>
            <div>
              <p>
                <span>{bInvPage}</span> of {totalPages}
              </p>
            </div>
            <button
              onClick={handleNextPage}
              style={{ opacity: `${bInvPage === totalPages ? "0.4" : "1"}` }}
            >
              <img src={arrowR} alt="" />
            </button>
          </CurrentPage>
          <JumpTo>
            <p>Jump To</p>
            <div>
              <input
                type="number"
                min={totalPages}
                max={1}
                style={{
                  paddingInline: "6px 10px",
                  paddingBlock: "6px",
                  border: "1px solid black",
                }}
                onChange={(e) => setBInvPage(Math.min(totalPages, Number(e.target.value)))}
                placeholder="Page No."
              />
            </div>
          </JumpTo>
        </PageControl>
      )}
    </ExpensesWrapper>
  );
};

export default SingleBatch;
