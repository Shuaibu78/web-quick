import React, { FunctionComponent, useEffect, useState } from "react";
import { Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import {
  CurrentPage,
  CustomCont,
  JumpTo,
  PerPage,
  TBody,
  THead,
  TRow,
  Table,
  Td,
} from "../sales/style";
import Checkbox from "../../components/checkbox/checkbox";
import { PageControl } from "../inventory/style";
import arrowL from "../../assets/ArrowL.svg";
import arrowR from "../../assets/ArrowR.svg";
import emptyImage from "../../assets/empty.svg";
import { TEmpty } from "../home/style";
import { Button } from "../../components/button/Button";
import { formatAmountIntl, formatNumber } from "../../helper/format";
import { SupplierAttr } from "../../interfaces/supplies.interface";
import { useNavigate } from "react-router-dom";
import { SearchIcon, SearchInput, SearchInputWrapper } from "./style";
import { Colors } from "../../GlobalStyles/theme";
import { useAppSelector } from "../../app/hooks";
import { IAdditionalFeatures } from "../../interfaces/subscription.interface";
import { checkPackageLimits } from "../subscriptions/util/packageUtil";
import { useDispatch } from "react-redux";

interface ItemsPageProps {
  setSupplier: React.Dispatch<React.SetStateAction<any>>;
  supplierList: SupplierAttr[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
  handleItemDelete: () => void;
  setSelectedSupplierIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedSupplierIds: string[];
  setShowModal: (value: boolean) => void;
  setEditSupplier: (value: boolean) => void;
  setPayBalanceModal: (value: boolean) => void;
  setSelectedSupplier: React.Dispatch<React.SetStateAction<SupplierAttr>>;
  perPage: number;
  setShouldAddSupplies: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchSupplier: React.Dispatch<React.SetStateAction<string>>;
  totalSupplies: number;
  searchSupplier: string;
}

const SupplierList: FunctionComponent<ItemsPageProps> = ({
  setSupplier,
  supplierList,
  page,
  setPage,
  setSelectedSupplierIds,
  selectedSupplierIds,
  handleItemDelete,
  setShowModal,
  setEditSupplier,
  setPayBalanceModal,
  setSelectedSupplier,
  setShouldAddSupplies,
  perPage,
  setSearchSupplier,
  totalSupplies,
  searchSupplier,
}) => {
  const [totalPages, setTotalPages] = useState(1);
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const { subscriptions } = useAppSelector((state) => state);
  const userSubscriptions = subscriptions?.subscriptions[0] || [];
  const subscriptionPackages = subscriptions?.subscriptionPackages || [];
  const featureCount = subscriptions?.featureCount || {};
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const checkPackageLimit = (check: IAdditionalFeatures["check"]) =>
    checkPackageLimits(
      userSubscriptions.packageNumber,
      subscriptionPackages,
      featureCount,
      dispatch,
      check
    );

  const selectItem = (e: React.ChangeEvent<HTMLInputElement>, selectedSupplierId: string) => {
    e.stopPropagation();
    if (e.target.checked) {
      setSelectedSupplierIds([...selectedSupplierIds, selectedSupplierId]);
    } else {
      setSelectedSupplierIds(selectedSupplierIds.filter((id) => id !== selectedSupplierId));
    }
  };

  const handleSelectAll = () => {
    if (selectedSupplierIds.length > 0 && selectedSupplierIds.length === supplierList.length) {
      setSelectedSupplierIds([]);
      setAllSelected(false);
    } else {
      setSelectedSupplierIds(supplierList.map((list) => list?.supplierId!));
      setAllSelected(true);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    setTotalPages(Math.ceil(totalSupplies / (isNaN(perPage) ? 10 : perPage)));
  }, [perPage]);

  return (
    <Flex
      direction="column"
      alignItems="center"
      justifyContent="center"
      height="100%"
      bg="#fff"
      padding="1.25rem 0.625rem 0.625rem"
      width="100%"
      borderRadius="1em"
    >
      <Flex justifyContent="flex-start" width="100%" alignItems="center" margin="0px 0px 1.25rem">
        <Flex>
          <SearchInputWrapper>
            <SearchIcon />
            <SearchInput
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchSupplier(e.target.value)}
            />
          </SearchInputWrapper>
        </Flex>
      </Flex>

      <Table height="100%" margin="0px" maxWidth="100%" style={{ width: "100%" }}>
        {supplierList.length < 1 && (
          <TEmpty>
            {searchSupplier === "" ? (
              <>
                <img src={emptyImage} alt="empty-img" />
                <h3>No Records to Show Yet</h3>
                <p>Add Suppliers to see them appear here.</p>

                <Button
                  label=" Add Your First Supplier"
                  onClick={() => {
                    const isProgress = checkPackageLimit("Supplies");
                    if (!isProgress) return;
                    setShowModal(true);
                    setEditSupplier(false);
                    setShouldAddSupplies(false);
                  }}
                  backgroundColor="#607087"
                  size="sm"
                  color="#fff"
                  borderColor="transparent"
                  borderRadius="0.75rem"
                  borderSize="0px"
                  fontSize="0.875rem"
                  margin="1rem 0 0 0"
                  width="fit-content"
                  height="2.5rem"
                />
              </>
            ) : (
              <>
                <Flex
                  direction="column"
                  justifyContent="center"
                  margin="6.25rem 0px 0 0"
                  alignItems="center"
                >
                  <Span
                    margin="4px 0px"
                    color={Colors.blackLight}
                    fontSize="1.2rem"
                    fontWeight="500"
                  >
                    There are no suppliers to display.
                  </Span>
                  <Span color={Colors.grey} fontSize=".8rem">
                    No supplier match your filter "<b>{searchSupplier}</b>"
                  </Span>
                </Flex>
              </>
            )}
          </TEmpty>
        )}

        {supplierList.length > 0 &&
          (selectedSupplierIds.length < 1 ? (
            <THead fontSize="0.875rem" maxWidth="100%">
              <Td width="3%">
                <CustomCont imgHeight="100%" height="1.25rem">
                  <Checkbox
                    isChecked={allSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectAll();
                    }}
                    color="#130F26"
                    size="1rem"
                  />
                </CustomCont>
              </Td>
              <Td width="20%">
                <span>Supplier Name</span>
              </Td>
              <Td width="12%">
                <span>Total Supplies</span>
              </Td>
              <Td width="12%">
                <span>Total amount</span>
              </Td>
              <Td width="12%">
                <span>Amount Paid</span>
              </Td>
              <Td width="12%">
                <span>Remaining Balance</span>
              </Td>
              <Td width="10%">
                <span>Date Added</span>
              </Td>
              <Td width="19%" style={{ paddingLeft: "0.3125rem" }}>
                Action
              </Td>
            </THead>
          ) : (
            <THead fontSize="0.875rem" justifyContent="flex-start">
              <Td width="3%">
                <CustomCont imgHeight="100%" height="1.25rem">
                  <Checkbox
                    isChecked={allSelected}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectAll();
                    }}
                    color="#130F26"
                    size="1.125rem"
                  />
                </CustomCont>
              </Td>
              <Td width="12%">
                <span style={{ cursor: "pointer" }} onClick={handleSelectAll}>
                  {selectedSupplierIds.length > 0 &&
                  selectedSupplierIds.length === supplierList.length
                    ? "Unselect All"
                    : "Select All"}
                </span>
              </Td>
              <Td width="12%">
                <span
                  style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                  onClick={handleItemDelete}
                >
                  <svg
                    fill="none"
                    stroke="red"
                    strokeWidth={1.5}
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                    style={{ height: "1rem", width: "1rem", marginRight: "0.3125rem" }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                  <p style={{ color: "red" }} onClick={handleItemDelete}>
                    Delete Suppliers
                  </p>
                </span>
              </Td>
            </THead>
          ))}

        <TBody
          maxHeight="calc(100vh - 350px)"
          overflowY="
        scroll"
          width="100%"
        >
          {supplierList.length > 0 &&
            supplierList.map((val: SupplierAttr, i: number) => {
              // eslint-disable-next-line @typescript-eslint/no-shadow
              const totalQuantity = val?.SupplyRecord?.reduce((total, record) => {
                const supplyItems = record?.SupplyItems;
                if (supplyItems) {
                  const quantitySum = supplyItems.reduce((sum, supply) => {
                    const quantity = Number(supply?.quantity);
                    return sum + quantity;
                  }, 0);
                  return total + quantitySum;
                }
                return total;
              }, 0);

              const totalAmount = val?.SupplyRecord?.reduce((total, record) => {
                const amountSum = record?.totalAmount as number;
                return total + amountSum;
              }, 0);

              const amountPaid = val?.SupplyRecord?.reduce((total, record) => {
                const amountSum = record?.amountPaid as number;
                return total + amountSum;
              }, 0);

              const amountLeft = (totalAmount as number) - (amountPaid as number);

              return (
                <TRow
                  background={(i + 1) % 2 ? "#F6F8FB" : ""}
                  key={i}
                  onClick={(e: any) => {
                    if (e.target.type === "checkbox") {
                      return;
                    }
                    e.stopPropagation();
                    navigate(`/dashboard/suppliers/single-supplier/${val.supplierId}`);
                  }}
                  height="45px"
                >
                  <Td width="3%">
                    <CustomCont imgHeight="100%">
                      <Checkbox
                        isChecked={selectedSupplierIds.includes(val?.supplierId as string)}
                        onChange={(e) => {
                          e.stopPropagation();
                          selectItem(e, val?.supplierId as string);
                        }}
                        color="#130F26"
                        size="0.875rem"
                        id="checked-btn"
                      />
                    </CustomCont>
                  </Td>
                  <Td width="20%">
                    <span>{`${val?.firstName} ${val?.lastName}`}</span>
                  </Td>
                  <Td width="12%">
                    <span>{formatNumber(totalQuantity as number, 0)}</span>
                  </Td>
                  <Td width="12%">
                    <span>{formatAmountIntl(undefined, totalAmount)}</span>
                  </Td>
                  <Td width="12%">
                    <span>{formatAmountIntl(undefined, amountPaid)}</span>
                  </Td>
                  <Td width="12%">
                    <span>{formatAmountIntl(undefined, amountLeft)}</span>
                  </Td>
                  <Td width="10%">
                    <span>{val.createdAt && new Date(val.createdAt).toDateString()}</span>
                  </Td>
                  <Td width="19%">
                    <Flex alignItems="center" gap="0.3125rem" width="100%">
                      <Button
                        label="Add Supplies"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditSupplier(true);
                          setSupplier(val);
                          setShowModal(true);
                          setShouldAddSupplies(true);
                        }}
                        backgroundColor="transparent"
                        size="sm"
                        border
                        color={Colors.primaryColor}
                        borderColor={Colors.primaryColor}
                        borderRadius="0.75rem"
                        borderSize="1px"
                        fontSize="0.625rem"
                        height="1.875rem"
                        width="45%"
                        margin="0 0"
                      />
                      {val.SupplyRecord?.length! > 0 && (
                        <Button
                          label={amountLeft !== 0 ? "Pay Balance" : "Fully Paid"}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (amountLeft !== 0) {
                              setSelectedSupplier(val);
                              setPayBalanceModal(true);
                            }
                          }}
                          backgroundColor={amountLeft !== 0 ? "transparent" : "#DBF9E8"}
                          size="sm"
                          border={amountLeft !== 0}
                          color="#219653"
                          borderColor="#219653"
                          borderRadius="0.75rem"
                          borderSize="1px"
                          fontSize="0.625rem"
                          height="1.875rem"
                          width="35%"
                          margin="0 0"
                        />
                      )}
                    </Flex>
                  </Td>
                </TRow>
              );
            })}
        </TBody>
      </Table>

      {supplierList.length > 0 && (
        <PageControl>
          <PerPage>
            <p>Per page</p>
            <Span>{perPage}</Span>
          </PerPage>
          <CurrentPage>
            <button style={{ opacity: `${page > 1 ? "1" : "0.4"}` }} onClick={handlePrevPage}>
              <img src={arrowL} alt="" />
            </button>
            <div>
              <p>
                <span>{page <= 0 ? 1 : page} </span>
                of {totalPages || 1}
              </p>
            </div>
            <button
              onClick={handleNextPage}
              style={{
                opacity: `${page === totalPages ? "0.4" : "1"}`,
              }}
            >
              <img src={arrowR} alt="" />
            </button>
          </CurrentPage>
          <JumpTo>
            <p>Jump To</p>
            <div>
              <input
                type="number"
                min={1}
                style={{
                  paddingInline: "6px 0.625rem",
                  paddingBlock: "6px",
                  border: "1px solid black",
                }}
                onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  const key = e.key;
                  const numericRegex = new RegExp(`^[1-${totalPages}]$`);
                  const isNumericKey = numericRegex.test(key);
                  if (!isNumericKey) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => setPage(Number(e.target.value))}
                placeholder="Page No."
              />
            </div>
          </JumpTo>
        </PageControl>
      )}
    </Flex>
  );
};

export default SupplierList;
