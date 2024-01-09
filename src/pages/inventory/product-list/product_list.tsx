/* eslint-disable no-debugger */
import React, { FunctionComponent, useEffect, useState } from "react";
import arrowL from "../../../assets/ArrowL.svg";
import arrowR from "../../../assets/ArrowR.svg";
import MoreSquare from "../../../assets/MoreSquare.svg";
import MoreSquareWhite from "../../../assets/MoreSquareWhite.svg";
import Share from "../../../assets/shareGrey.svg";
import emptyImage from "../../../assets/empty.svg";
import {
  CustomCont,
  PerPage,
  CurrentPage,
  JumpTo,
  Table,
  THead,
  TBody,
  TRow,
  Td,
} from "../../sales/style";
import { Flex } from "../../../components/receipt/style";
import SearchInput from "../../../components/search-input/search-input";
import Checkbox from "../../../components/checkbox/checkbox";
import { useLazyQuery } from "@apollo/client";
import { IInventoryCategory } from "../../../interfaces/inventory.interface";
import { getCurrentShop } from "../../../app/slices/shops";
import { PageControl } from "../style";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { setSingleInventory } from "../../../app/slices/inventory";
import PopupCard from "../../../components/popUp/PopupCard";
import { hasPermission } from "../../../helper/comparisons";
import { Button } from "../../../components/button/Button";
import Import from "../../../components/form/import";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import dropIcon2 from "../../../assets/dropIcon2.svg";
import {
  getInventoryQuantity,
  getProductCostPrice,
  getProductSellingPrice,
  productValue,
} from "../../../helper/inventory.helper";
import { ActionModal, ManageCategoryModal } from "../productModals/productModal";
import { getImageUrl } from "../../../helper/image.helper";
import { GET_SHOP_INVENTORY_CATEGORIES } from "../../../schema/shops.schema";
import AdjustProductQty from "./adjustProductQty/AdjustProductQty";
import { TEmpty } from "../../home/style";
import { Link } from "react-router-dom";
import { setIsEdit } from "../../../app/slices/isEdit";
import CustomDropdown from "../../../components/custom-dropdown/custom-dropdown";
import { getUserPermissions } from "../../../app/slices/roles";
import ConfirmAction from "../../../components/modal/confirmAction";
import SolarImportBroken from "../../../assets/solar_import-broken.svg";
import { Colors } from "../../../GlobalStyles/theme";
import { useProdctPageContext } from "../inventory";
import { isFigorr } from "../../../utils/constants";
import Loader from "../../../components/loader";
import { Span } from "../../../GlobalStyles/CustomizableGlobal.style";

const ProductList: FunctionComponent = () => {
  const {
    handleRefetch,
    refetchInv,
    setCurrentInventory,
    setShowProductModal,
    setAdjustModalPopup,
    adjustModalPopup,
    currentInventory,
    handleMakeProductOnline,
    saveSelectedInventory,
    handleDeleteInventory,
    selectedProductIds,
    setSelectedProductIds,
    fetchingProducts,
    setSelectedOption,
    setPage,
    page,
    handleNextPage,
    handlePrevPage,
    handleTruncateProduct,
    selectedOption,
    filterOptions,
    perPage,
    totalPages,
    setPerPage,
    refetch,
    setSearch,
    inventoryList,
    search,
  } = useProdctPageContext();
  const [allSelected, setAllSelected] = useState<boolean>(false);
  const currentShop = useAppSelector(getCurrentShop);
  const [showImportModal, setShowImportModal] = useState<boolean>(false);
  const [showCategoryModal, setShowCategoryModal] = useState<boolean>(false);
  const [showActionModal, setShowActionModal] = useState<any>({});
  const [popup, setPopup] = useState<boolean>(false);
  const [currentInvId, setCurrentInvId] = useState<string>("");
  const userPermissions = useAppSelector(getUserPermissions);
  const { user: userInfo } = useAppSelector((state) => state);
  const reduxSelector = useAppSelector((state) => state);
  const isMerchant = userInfo?.userId === reduxSelector?.shops?.currentShop?.userId;
  const shouldManageInventory = hasPermission("MANAGE_INVENTORY", userPermissions);
  const [selectedBusinessSettings, setSelectedBusinessSettings] = useState<number>(0);
  const businessSettingsOptions = ["Manage Categories", "Truncate Products Quantity"];

  const dispatch = useAppDispatch();

  function transformFilterOptions(options: string[]) {
    const transformedOptions = options.map((option) => {
      const words = option.split("_").map((word) => word.charAt(0) + word.slice(1).toLowerCase());
      return words.join(" ");
    });

    return transformedOptions;
  }

  const [getInventoryCategories, { data: categories }] = useLazyQuery<{
    getAllShopInventoryCategory: IInventoryCategory[];
  }>(GET_SHOP_INVENTORY_CATEGORIES, {
    variables: {
      shopId: currentShop?.shopId as string,
    },
    fetchPolicy: "cache-and-network",
    onError(err) {
      dispatch(toggleSnackbarOpen(err?.message || err?.graphQLErrors[0]?.message));
    },
  });

  const selectItem = (e: React.ChangeEvent<HTMLInputElement>, selectedProduct: string) => {
    e.stopPropagation();

    if (e.target.checked) {
      setSelectedProductIds([...selectedProductIds, selectedProduct]);
    } else {
      setSelectedProductIds(selectedProductIds.filter((id: string) => id !== selectedProduct));
    }
  };

  const handleSelectAll = () => {
    if (selectedProductIds.length > 0 && selectedProductIds.length === inventoryList.length) {
      setSelectedProductIds([]);
      setAllSelected(false);
    } else {
      setSelectedProductIds(inventoryList.map((list) => list.inventoryId as string));
      setAllSelected(true);
    }
  };

  const handleRowClick = (e: any, val: any) => {
    if (e.target.closest(".action-btn") || e.target.closest("#checkbox")) {
      return;
    }
    setShowProductModal(true);
    setCurrentInventory(val);
    dispatch(setSingleInventory(val));
  };

  const handleSelectBusinessSetting = (index: number) => {
    // setSelectedBusinessSettings(index);
    if (businessSettingsOptions[index] === "Manage Categories") {
      getInventoryCategories();
      setShowCategoryModal(!showCategoryModal);
    }
    if (businessSettingsOptions[index] === "Truncate Products Quantity") {
      handleTruncateProduct();
    }
  };

  useEffect(() => {
    refetchInv();
  }, []);

  return (
    <div
      style={{
        position: "relative",
        height: "100%",
        overflow: "hidden",
        width: "auto",
      }}
    >
      {fetchingProducts && search.length <= 0 && inventoryList.length === 0 ? (
        <>
          <Flex
            flexDirection="column"
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: ".625rem 0",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                paddingTop: ".775rem",
              }}
            >
              <Flex gap=".5rem">
                <Flex
                  alignItems="center"
                  padding=".625rem .625rem"
                  width="80%"
                  height="40px"
                  borderRadius="12px"
                >
                  <SearchInput
                    placeholder="Search product name"
                    width="60%"
                    handleSearch={setSearch}
                    borderRadius=".75rem"
                  />
                </Flex>
              </Flex>
              <Flex justifyContent="right" gap=".5rem">
                <CustomDropdown
                  width="150px"
                  color="#607087"
                  containerColor="#F4F6F9"
                  bgColor="#F4F6F9"
                  borderRadius="12px"
                  height="40px"
                  // icon={FilterIcon}
                  dropdownIcon={dropIcon2}
                  options={transformFilterOptions(filterOptions)}
                  setValue={setSelectedOption}
                  fontSize="0.6875rem"
                  selected={selectedOption}
                  margin="0 0 0px 0"
                  padding="10px 5px"
                />
                {(isMerchant || shouldManageInventory) && (
                  <CustomDropdown
                    width="10rem"
                    color="#607087"
                    containerColor="#F4F6F9"
                    bgColor="#F4F6F9"
                    borderRadius=".75rem"
                    height="2.9Brem"
                    dropdownIcon={dropIcon2}
                    options={businessSettingsOptions}
                    setValue={handleSelectBusinessSetting}
                    fontSize=".7875rem"
                    selected={selectedBusinessSettings}
                    margin="0px 0 0px 0"
                    padding=".625rem .3125rem"
                    label="Product Settings"
                  />
                )}
                {(isMerchant || shouldManageInventory) && (
                  <Button
                    borderRadius=".75rem"
                    fontSize=".875rem"
                    label="Import Products"
                    backgroundColor="#FFF6EA"
                    type="button"
                    color={Colors.secondaryColor}
                    height="40px"
                    width="160px"
                    margin="0px 4px 0px"
                    onClick={() => setShowImportModal(!showImportModal)}
                  >
                    <Flex gap=".5rem">
                      <img src={SolarImportBroken} alt="Solar import broken icon" />
                      Import Products
                    </Flex>
                  </Button>
                )}
              </Flex>
            </div>
          </div>
          {inventoryList.length === 0 && search.length > 0 ? (
            <div
              style={{
                position: "relative",
                height: "100%",
                overflow: "hidden",
                width: "auto",
              }}
            >
              <Flex
                justifyContent="center"
                margin="100px 0px 0 0"
                alignItems="center"
                style={{ flexDirection: "column" }}
              >
                <Span margin="4px 0px" color={Colors.blackLight} fontSize="1.2rem" fontWeight="500">
                  There are no products to display.
                </Span>
                {search && (
                  <Span color={Colors.grey} fontSize=".8rem">
                    No product match your filter "<b>{search}</b>"
                  </Span>
                )}
              </Flex>
            </div>
          ) : (
            <Table style={{ height: "85%" }} maxWidth="100%">
              {selectedProductIds.length > 0 ? (
                <THead fontSize=".875rem" justifyContent="flex-start" style={{ columnGap: "1rem" }}>
                  <Td width="4%">
                    <CustomCont imgHeight="100%" height="1.25rem">
                      <Checkbox
                        isChecked={allSelected}
                        onChange={handleSelectAll}
                        color="#130F26"
                        size="1.125rem"
                      />
                    </CustomCont>
                  </Td>
                  <Td width="10%">
                    <span style={{ cursor: "pointer" }} onClick={handleSelectAll}>
                      {allSelected ? "Unselect All" : "Select All"}
                    </span>
                  </Td>
                  <Td width="15%">
                    <span
                      style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
                      onClick={() => setPopup(true)}
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
                      <p style={{ color: "red" }}>Delete Product(s)</p>
                    </span>
                  </Td>
                  <Td width="15%">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        cursor: "pointer",
                        gap: "0.7em",
                      }}
                      // onClick={null}
                    >
                      <img src={Share} alt="" width="0.9375rem" />
                      <p>Export PDF</p>
                    </div>
                  </Td>
                </THead>
              ) : (
                <THead fontSize=".875rem" maxWidth="100%">
                  <Td width="3.75rem">
                    <CustomCont imgHeight="100%" height="1.25rem">
                      <Checkbox
                        isChecked={allSelected}
                        onChange={handleSelectAll}
                        color="#fff"
                        size="1.125rem"
                      />
                    </CustomCont>
                  </Td>
                  <Td width="3.75rem"></Td>
                  <Td width="180px">
                    <span>Product name</span>
                  </Td>
                  <Td width="6.25rem">
                    <span>Category</span>
                  </Td>
                  <Td width="115px">
                    <span>Quantity</span>
                  </Td>
                  <Td width="105px">
                    <span>Cost Price</span>
                  </Td>
                  <Td width="105px">
                    <span>Selling Price</span>
                  </Td>
                  <Td width="105px">
                    <span>Product Value</span>
                  </Td>
                  {isFigorr ? null : (
                    <Td style={{ paddingLeft: ".625rem" }} width="5.625rem">
                      <span>Visibility</span>
                    </Td>
                  )}
                  {(isMerchant || shouldManageInventory) && (
                    <Td style={{ paddingLeft: ".625rem" }} width="4.375rem">
                      <span>Action</span>
                    </Td>
                  )}
                </THead>
              )}
              <TBody maxHeight="calc(90% - 20px)" overflowY="scroll">
                {inventoryList?.map((val, i) => {
                  const isChecked = selectedProductIds.includes(val?.inventoryId!);
                  return (
                    <TRow
                      isSelected={selectedProductIds.includes(val?.inventoryId!)}
                      onClick={(e) => handleRowClick(e, val)}
                      background={(i + 1) % 2 ? "#F6F8FB" : ""}
                      key={i}
                      activeBg={val.inventoryId === currentInventory?.inventoryId}
                    >
                      <Td width="3.75rem" id="checkbox">
                        <CustomCont id="checkbox" imgHeight="100%">
                          <Checkbox
                            isChecked={isChecked}
                            onChange={(e) => selectItem(e, val?.inventoryId!)}
                            color={isChecked ? "#fff" : "#130F26"}
                            size="1.125rem"
                          />
                        </CustomCont>
                      </Td>
                      <Td width="3.75rem">
                        <CustomCont imgHeight="100%">
                          <img src={getImageUrl(val?.Images)} alt="" />
                        </CustomCont>
                      </Td>
                      <Td width="180px">
                        <span style={{ textOverflow: "ellipsis" }}>
                          {val.inventoryName}
                          {val.isVariation && " - variation"}
                        </span>
                      </Td>
                      <Td width="6.25rem">
                        <span>{val?.InventoryCategory?.inventorycategoryName}</span>
                      </Td>
                      <Td
                        width="115px"
                        color={
                          getInventoryQuantity(val) === "Out of Stock" &&
                          val?.inventoryType !== "NON_TRACKABLE"
                            ? "red"
                            : "currentColor"
                        }
                      >
                        <span
                          style={
                            val?.inventoryType === "NON_TRACKABLE" ? { paddingLeft: "20px" } : {}
                          }
                        >
                          {val?.inventoryType === "NON_TRACKABLE"
                            ? "∞"
                            : getInventoryQuantity(val) || 0}
                        </span>
                      </Td>
                      <Td width="105px">
                        <span>{getProductCostPrice(val)}</span>
                      </Td>
                      <Td width="105px">
                        <span>{getProductSellingPrice(val)}</span>
                      </Td>
                      <Td width="105px">
                        <span>
                          {val?.inventoryType !== "NON_TRACKABLE"
                            ? productValue(val)
                            : getProductSellingPrice(val)}
                        </span>
                      </Td>
                      {isFigorr ? null : (
                        <Td width="90px" color={""}>
                          <span
                            style={{
                              // border: `${val.isPublished ? "1px solid #E8F6EE" : "1px solid #FCE9E9"}`,
                              // backgroundColor: `${val.isPublished ? "#E8F6EE" : "#FCE9E9"}`,
                              color: `${val.isPublished ? "#219653" : "#FF0000"}`,
                              padding: "6px",
                              borderRadius: "6px",
                            }}
                          >
                            {val.isPublished ? "Online" : "Offline"}
                            <img src={dropIcon2} width="20px" alt="dropdown Icon" />
                          </span>
                        </Td>
                      )}
                      {(isMerchant || shouldManageInventory) && (
                        <Td
                          width="4.375rem"
                          style={{ position: "relative" }}
                          onClick={() => setCurrentInvId(val.inventoryId!)}
                          className="action-btn"
                        >
                          <CustomCont imgHeight="20px">
                            {currentInvId === val.inventoryId && (
                              <ActionModal
                                show={showActionModal[val?.inventoryId!] || false}
                                toggle={() =>
                                  setShowActionModal({
                                    ...showActionModal,
                                    [val?.inventoryId!]: false,
                                  })
                                }
                                inventory={val}
                                setCurrentInventory={setCurrentInventory}
                                setPopup={setPopup}
                                setShowProductModal={setShowProductModal}
                                setAdjustModalPopup={setAdjustModalPopup}
                                saveSelectedInventory={saveSelectedInventory}
                                isUp={i > inventoryList?.length / 2}
                                handleMakeProductOnline={handleMakeProductOnline}
                              />
                            )}
                            <img
                              src={isChecked ? MoreSquareWhite : MoreSquare}
                              width="25px"
                              onClick={() =>
                                setShowActionModal({
                                  ...showActionModal,
                                  [val.inventoryId!]: !showActionModal[val?.inventoryId!],
                                })
                              }
                              alt=""
                            />
                          </CustomCont>
                        </Td>
                      )}
                    </TRow>
                  );
                })}
              </TBody>
            </Table>
          )}
        </>
      )}

      {inventoryList?.length > 0 && (
        <PageControl background="#FFF" height="40px">
          <PerPage>
            <p>Per page</p>
            <input
              type="number"
              placeholder="perPage"
              value={perPage}
              onChange={(e) => setPerPage(parseInt(e.target.value))}
            />
          </PerPage>
          <CurrentPage>
            <button style={{ opacity: `${page > 1 ? "1" : "0.4"}` }} onClick={handlePrevPage}>
              <img src={arrowL} alt="" />
            </button>
            <div>
              <p>
                <span>{page}</span> of {totalPages}
              </p>
            </div>
            <button
              onClick={handleNextPage}
              style={{ opacity: `${page === totalPages ? "0.4" : "1"}` }}
            >
              <img src={arrowR} alt="" />
            </button>
          </CurrentPage>
          <JumpTo>
            <p>Jump To</p>
            <div>
              <input
                type="number"
                max={totalPages}
                min={1}
                style={{
                  paddingInline: "6px .625rem",
                  paddingBlock: "6px",
                  border: "none",
                }}
                onChange={(e) => setPage(Math.min(totalPages, Number(e.target.value)))}
                placeholder="Page No."
              />
              <button style={{ opacity: `${page === totalPages ? "0.4" : "1"}` }}>
                <img src={arrowR} alt="" />
              </button>
            </div>
          </JumpTo>
        </PageControl>
      )}

      {inventoryList?.length < 1 && (
        <TEmpty>
          <img src={emptyImage} alt="empty-img" />
          <h3>No Records to Show Yet</h3>
          <p>Start adding products to see them appear here.</p>
          <Link
            to="/dashboard/product/add"
            onClick={() => {
              dispatch(setSingleInventory({}));
              dispatch(setIsEdit(false));
            }}
          >
            Add Your First Product
          </Link>
        </TEmpty>
      )}

      {showCategoryModal && (
        <PopupCard close={() => setShowCategoryModal(false)}>
          <ManageCategoryModal
            refetch={getInventoryCategories}
            data={categories?.getAllShopInventoryCategory!}
            toggle={() => setShowCategoryModal(false)}
            shopId={currentShop?.shopId as string}
          />
        </PopupCard>
      )}

      {showImportModal && (
        <PopupCard close={() => setShowImportModal(false)}>
          <Import setShowImportModal={setShowImportModal} />
        </PopupCard>
      )}

      {adjustModalPopup && (
        <PopupCard close={() => setAdjustModalPopup(false)}>
          <AdjustProductQty
            setAdjustModalPopup={setAdjustModalPopup}
            refetch={refetch}
            handleRefetch={handleRefetch}
          />
        </PopupCard>
      )}

      {popup && (
        <ConfirmAction
          setConfirmSignout={setPopup}
          doAction={() => {
            handleDeleteInventory(selectedProductIds);
            setPopup(false);
          }}
          action="Delete Inventory(s)"
          actionText={`Are you sure you want to delete ${
            selectedProductIds?.length > 1 ? "Multiple Products" : currentInventory?.inventoryName
          }`}
        />
      )}
    </div>
  );
};

export default ProductList;
