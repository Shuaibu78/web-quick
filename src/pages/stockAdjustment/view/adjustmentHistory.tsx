import { useQuery } from "@apollo/client";
import { Flex, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import Graph from "../../../assets/GraphB.svg";
import { formatDate } from "../../../helper/date";
import { CancelButton, TBody, THead, TRow, Table, Td } from "../../sales/style";
import { useAdjustStockContext } from "../stockAdjustment";
import { SEARCH_INVENTORY } from "../../../schema/inventory.schema";
import { useState } from "react";
import { IInventory } from "../../../interfaces/inventory.interface";
import { useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import { useDispatch } from "react-redux";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import CustomDropdown from "../../../components/custom-dropdown/custom-dropdown";
import { UsersAttr } from "../../../interfaces/user.interface";
import { GET_ALL_USER } from "../../../schema/auth.schema";
import dropIcon2 from "../../../assets/dropIcon2.svg";
import FilterIcon from "../../../assets/FilterIcon.svg";
import { SubCardSelector } from "../../subscriptions/subscriptions.style";
import AsyncSelect from "react-select/async";
import { AllProductHistoryAttr } from "../../../schema/stockAdjustment.schema";
import { ModalBox, ModalContainer } from "../../settings/style";
import Cancel from "../../../assets/cancel.svg";
import moment from "moment";
import { formatPrice } from "../../../utils/formatValues";
import ModalSidebar from "../../inventory/product-list/modal";
import { Button } from "../../../components/button/Button";

const EmptyState = () => (
  <Flex width="auto" height="80%" alignItems="center" justifyContent="center">
    <Flex direction="column" style={{ textAlign: "center" }} alignItems="center" width="30%">
      <Flex margin="0.5rem 0">
        <img src={Graph} alt="" />
      </Flex>
      <Text fontWeight="600" margin="0.5rem 0" fontSize="1.125rem" color={Colors.primaryColor}>
        No Adjustments History
      </Text>
      <Text fontWeight="400" margin="0.1rem 0" fontSize="0.875rem" color={Colors.grey}>
        No history for this filter. Try any of the filter options to view adjustment history.
      </Text>
    </Flex>
  </Flex>
);

const AdjustmentHistory = () => {
  const { adjustmentHistoryList } = useAdjustStockContext();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useDispatch();
  const [selectedCashier, setSelectedCashier] = useState<number>(0);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [advancedFilters, setAdvancedFilters] = useState<boolean>(false);
  const [filterPills, setFilterPills] = useState<{
    restock: boolean;
    lost: boolean;
    damage: boolean;
  }>({
    restock: false,
    lost: false,
    damage: false,
  });
  const [activeHistory, setActiveHistory] = useState<AllProductHistoryAttr>();
  const [filterProduct, setFilterProdcts] = useState<{ value: string; label: string }[]>([]);

  const { data: searchData } = useQuery<{
    searchUserInventory: [IInventory];
  }>(SEARCH_INVENTORY, {
    variables: {
      shopId: currentShop.shopId,
      searchString: searchTerm ?? "",
    },
  });

  const { data: allUserData } = useQuery<{
    getAllUsers: UsersAttr[];
  }>(GET_ALL_USER, {
    variables: {
      shopId: currentShop?.shopId,
    },
    skip: !currentShop?.shopId,
    onError(error) {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const cashiers = allUserData?.getAllUsers;
  const cashierOption: string[] =
    (allUserData?.getAllUsers?.map((users) => users.fullName) as string[]) || [];
  cashierOption.unshift("All Users");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleStateChange = (newValue: any) => {
    setFilterProdcts(newValue);
  };

  const handleAllFilters = () => {
    const pills: string[] = [
      (filterPills.restock && "RESTOCK") as string,
      (filterPills.lost && "LOST") as string,
      (filterPills.damage && "DAMAGE") as string,
    ].filter(Boolean);

    const currentCashier = cashiers?.find(
      (curr) => curr.fullName === cashierOption[selectedCashier]
    );

    let filteredStockAdjustments: AllProductHistoryAttr[] = [...adjustmentHistoryList];

    if (filterProduct.length > 0) {
      filteredStockAdjustments = filteredStockAdjustments.filter((history) =>
        filterProduct.some((selected) => history.inventoryId === selected.value)
      );
    }

    if (pills.length > 0) {
      filteredStockAdjustments = filteredStockAdjustments.filter((history) =>
        pills.includes(history.reason)
      );
    }

    if (currentCashier) {
      filteredStockAdjustments = filteredStockAdjustments.filter(
        (history) => history.userId === currentCashier.userId
      );
    }

    return filteredStockAdjustments;
  };

  const loadOptions = (inputValue: string, callback: Function) => {
    const filteredOptions = searchData?.searchUserInventory
      .filter(
        (prod) =>
          prod?.inventoryName &&
          prod?.inventoryName.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((prod) => ({
        value: prod.inventoryId,
        label: prod.inventoryName,
      }));
    callback(filteredOptions);
  };

  return (
    <>
      {adjustmentHistoryList?.length > 0 ? (
        <>
          <Flex direction="column">
            <Flex padding="0 2rem" justifyContent="space-between">
              <Flex width="32%" alignItems="center">
                <Flex
                  alignItems="center"
                  bg="#F4F6F9"
                  padding=".625rem .5rem"
                  width="50%"
                  color="#607087"
                  height="2.5rem"
                  borderRadius=".75rem"
                  style={{ cursor: "pointer" }}
                  justifyContent="space-between"
                  onClick={() => setAdvancedFilters(!advancedFilters)}
                >
                  <img src={FilterIcon} alt="filter icon" />
                  <p style={{ fontSize: ".875rem", color: "#607087" }}>Advanced Filters</p>
                  <img src={dropIcon2} alt="filter icon" />
                </Flex>
              </Flex>

              <Flex alignItems="center" width="30%" justifyContent="space-around">
                <SubCardSelector
                  checkedBg={Colors.primaryColor}
                  style={{
                    color: filterPills.restock ? Colors.white : Colors.blackLight,
                    justifyContent: "space-around",
                  }}
                  height="2rem"
                  width="34%"
                  onClick={() => setFilterPills((prev) => ({ ...prev, restock: !prev.restock }))}
                  checked={filterPills.restock}
                >
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      border: filterPills.restock ? "" : "1px solid #9EA8B7",
                      borderRadius: "0.3rem",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <div style={{ color: "white" }}>✔</div>
                  </div>
                  Restocked
                </SubCardSelector>
                <SubCardSelector
                  checkedBg={Colors.primaryColor}
                  style={{
                    color: filterPills.lost ? Colors.white : Colors.blackLight,
                    justifyContent: "space-around",
                  }}
                  height="2rem"
                  width="26%"
                  onClick={() => setFilterPills((prev) => ({ ...prev, lost: !prev.lost }))}
                  checked={filterPills.lost}
                >
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      border: filterPills.lost ? "" : "1px solid #9EA8B7",
                      borderRadius: "0.3rem",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <div style={{ color: "white" }}>✔</div>
                  </div>
                  Lost
                </SubCardSelector>
                <SubCardSelector
                  checkedBg={Colors.primaryColor}
                  style={{
                    color: filterPills.damage ? Colors.white : Colors.blackLight,
                    justifyContent: "space-around",
                  }}
                  height="2rem"
                  width="28%"
                  onClick={() => setFilterPills((prev) => ({ ...prev, damage: !prev.damage }))}
                  checked={filterPills.damage}
                >
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      border: filterPills.damage ? "" : "1px solid #9EA8B7",
                      borderRadius: "0.3rem",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <div style={{ color: "white" }}>✔</div>
                  </div>
                  Damage
                </SubCardSelector>
              </Flex>
            </Flex>

            <Table
              overflowX="hidden"
              margin="0"
              width="auto"
              maxWidth="100% !important"
              style={{ margin: "1.5rem 0" }}
            >
              <THead
                fontSize="0.875rem"
                style={{ padding: "0.4rem 0.2rem" }}
                overflowX="hidden"
                width="100%"
              >
                <Td width="28%">Product</Td>
                <Td width="11%">
                  <span>Reason</span>
                </Td>
                <Td width="11%">
                  <span>Date and Time</span>
                </Td>
                <Td width="15%">
                  <span>Staff</span>
                </Td>
                <Td width="25%">
                  <span>Comment</span>
                </Td>
                <Td width="10%">
                  <span>Action</span>
                </Td>
              </THead>
              <TBody
                style={{ overflowX: "hidden", paddingRight: "0" }}
                width="100%"
                overflowX="hidden"
              >
                {handleAllFilters().length > 0 ? (
                  <>
                    {handleAllFilters().map((trf, i) => {
                      return (
                        <TRow
                          key={i}
                          height="2rem"
                          maxWidth="100%"
                          overflowX="hidden"
                          width="100%"
                          onClick={() => {
                            setActiveHistory(trf);
                            setShowDetails(true);
                          }}
                          style={{
                            padding: "0 0.2rem",
                            color: Colors.blackLight,
                            borderBottom: `1px solid ${Colors.borderGreyColor}`,
                          }}
                        >
                          <Td width="28%">{trf?.inventoryName}</Td>
                          <Td width="11%" style={{ textTransform: "capitalize" }}>
                            <span>{trf?.reason}</span>
                          </Td>
                          <Td width="11%">
                            <span>{formatDate(trf?.createdAt)}</span>
                          </Td>
                          <Td width="15%">
                            <span>
                              {cashiers?.find((ussr) => ussr.userId === trf?.userId)?.fullName}
                            </span>
                          </Td>
                          <Td width="25%">
                            <span>{trf.notes ?? "No comment added"}</span>
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
                      );
                    })}
                  </>
                ) : (
                  <>
                    <EmptyState />
                  </>
                )}
              </TBody>
            </Table>
          </Flex>
        </>
      ) : (
        <>
          <EmptyState />
        </>
      )}

      {showDetails && (
        <>
          <ModalContainer>
            <ModalBox padding="0 2rem">
              <Flex alignItems="center" justifyContent="space-between">
                <h3>History Details</h3>
                <CancelButton
                  style={{
                    width: "1.875rem",
                    height: "1.875rem",
                    display: "grid",
                    placeItems: "center",
                  }}
                  hover
                  onClick={() => setShowDetails(false)}
                >
                  <img src={Cancel} alt="" />
                </CancelButton>
              </Flex>

              <Flex justifyContent="flex-start" alignItems="flex-start" direction="column">
                <Text color={Colors.grey} fontSize="0.7rem">
                  Time of Adjustment
                </Text>
                <Text color={Colors.secondaryColor} fontSize="1rem" style={{ fontStyle: "italic" }}>
                  {activeHistory?.createdAt
                    ? moment(activeHistory?.createdAt).format("Do MMM YYYY")
                    : "Not Added"}
                </Text>
              </Flex>
              <Flex
                bg={Colors.blackishBlue}
                padding="0 0.5rem"
                justifyContent="space-between"
                alignItems="center"
                borderRadius="0.5rem"
                margin="0.8rem 0rem"
                height="3rem"
              >
                <Text color={activeHistory?.reason === "RESTOCK" ? Colors.green : Colors.red}>
                  {activeHistory?.adjustmentQuantity + " Qty " + activeHistory?.reason}
                </Text>
                <Text color={Colors.grey} fontSize="0.7rem">
                  New Total:{" "}
                  <b style={{ color: Colors.white }}>
                    {activeHistory?.previousQuantity! + activeHistory?.adjustmentQuantity! + " Qty"}
                  </b>
                </Text>
              </Flex>

              {activeHistory?.price && (
                <Flex
                  justifyContent="flex-start"
                  margin="0.8rem 0"
                  alignItems="flex-start"
                  direction="column"
                >
                  <Text color={Colors.grey} fontSize="0.7rem">
                    Selling Price
                  </Text>
                  <Text color={Colors.blackLight} fontSize="1rem" style={{ fontStyle: "italic" }}>
                    {`${formatPrice(activeHistory?.price)}  (Old ${
                      activeHistory?.previousSellingPrice
                    })`}
                  </Text>
                </Flex>
              )}

              {(activeHistory?.unitCost || activeHistory?.unitCost! > 0) && (
                <Flex
                  justifyContent="flex-start"
                  margin="0.8rem 0"
                  alignItems="flex-start"
                  direction="column"
                >
                  <Text color={Colors.grey} fontSize="0.7rem">
                    Selling Price
                  </Text>
                  <Text color={Colors.blackLight} fontSize="1rem" style={{ fontStyle: "italic" }}>
                    {`${formatPrice(activeHistory?.unitCost!)}  (Old ${
                      activeHistory?.previousCostPrice
                    })`}
                  </Text>
                </Flex>
              )}

              {activeHistory?.userId && (
                <Flex
                  justifyContent="flex-start"
                  margin="0.8rem 0"
                  alignItems="flex-start"
                  direction="column"
                >
                  <Text color={Colors.grey} fontSize="0.7rem">
                    Staff
                  </Text>
                  <Text color={Colors.blackLight} fontSize="1rem" style={{ fontStyle: "italic" }}>
                    {cashiers?.find((ussr) => ussr.userId === activeHistory?.userId)?.fullName}
                  </Text>
                </Flex>
              )}

              <Flex
                justifyContent="flex-start"
                margin="0.8rem 0"
                alignItems="flex-start"
                direction="column"
              >
                <Text color={Colors.grey} fontSize="0.7rem">
                  Comment
                </Text>
                <Text color={Colors.blackLight} fontSize="1rem" style={{ fontStyle: "italic" }}>
                  {activeHistory?.notes ? activeHistory.notes : <i>No Comment Added</i>}
                </Text>
              </Flex>
            </ModalBox>
          </ModalContainer>
        </>
      )}
      {advancedFilters && (
        <ModalSidebar
          height={"100vh"}
          borderRadius=".75rem"
          padding="0"
          showProductModal={advancedFilters}
        >
          <Flex width="25rem" padding="0.5rem 1rem" direction="column">
            <Flex alignItems="center" margin="1rem 0" justifyContent="space-between">
              <h3>Advanced Filters</h3>
              <CancelButton
                style={{
                  width: "1.875rem",
                  height: "1.875rem",
                  display: "grid",
                  placeItems: "center",
                }}
                hover
                onClick={() => setAdvancedFilters(false)}
              >
                <img src={Cancel} alt="" />
              </CancelButton>
            </Flex>

            <Flex gap="1rem" direction="column" margin="1rem 0">
              <Text color={Colors.grey} fontSize="1rem">
                Filter by products
              </Text>
              <Flex alignItems="center">
                <AsyncSelect
                  styles={{
                    control: (baseStyles: any, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused ? Colors.secondaryColor : Colors.lightGrey,
                      width: "23rem",
                      outline: state.isFocused ? `1px solid ${Colors.secondaryColor}` : "",
                      "&:hover": {
                        outlineColor: Colors.secondaryColor,
                      },
                    }),
                  }}
                  value={filterProduct}
                  cacheOptions
                  inputValue={searchTerm}
                  onInputChange={(inputValue) => setSearchTerm(inputValue)}
                  onChange={(newValue) => handleStateChange(newValue)}
                  isClearable={true}
                  placeholder="Search Product(s) to filter..."
                  loadOptions={loadOptions}
                  isMulti={true}
                  noOptionsMessage={() => `No products match "${searchTerm}"`}
                />
              </Flex>
            </Flex>

            <Flex direction="column" margin="1rem 0" gap="1rem">
              <Text color={Colors.grey} fontSize="1rem">
                Filter by users
              </Text>
              <Flex alignItems="center">
                <CustomDropdown
                  width="100%"
                  color={Colors.blackLight}
                  containerColor="#F4F6F9"
                  bgColor={Colors.tabBg}
                  borderRadius=".75rem"
                  height="2rem"
                  dropdownIcon={dropIcon2}
                  options={cashierOption}
                  setValue={setSelectedCashier}
                  fontSize=".7875rem"
                  selected={selectedCashier}
                  margin="0px 0 0px 0"
                  padding=".625rem .3125rem"
                />
              </Flex>
            </Flex>

            <Flex direction="column" gap="0.75rem" margin="1rem 0">
              <Button
                backgroundColor={Colors.secondaryColor}
                label="Clear Filters"
                height="2.5rem"
                width="auto"
                color={Colors.white}
                borderRadius="0.75rem"
                onClick={() => {
                  setFilterProdcts([]);
                  setSelectedCashier(0);
                }}
              />
              <Button
                backgroundColor={Colors.primaryColor}
                label="Apply Filters"
                height="2.5rem"
                width="auto"
                color={Colors.white}
                borderRadius="0.75rem"
                onClick={() => setAdvancedFilters(false)}
              />
            </Flex>
          </Flex>
        </ModalSidebar>
      )}
    </>
  );
};

export default AdjustmentHistory;
