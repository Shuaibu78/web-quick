import { FC, useEffect, useState } from "react";
import { Flex, Span, Text } from "../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../GlobalStyles/theme";
import MinusIcon from "../../assets/removeIcon.svg";
import { IInventory } from "../../interfaces/inventory.interface";
import CustomDropdown from "../../components/custom-dropdown/custom-dropdown";
import dropIcon2 from "../../assets/dropIcon2.svg";
import { InputField } from "../../components/input-field/input";
import { convertToNumber } from "../../utils/formatValues";
import { Input } from "../../components/input-field/style";
import { AdjustmentInputAttr, useAdjustStockContext } from "./stockAdjustment";
import ReactSelect, { SingleValue } from "react-select";
import {
  getInventoryCostPrice,
  getProductCostPrice as getCostPrice,
  getInventoryType,
  getQuantity,
  getVariationQuantity,
  getProductSellingPriceUnformatted,
  getProductCostPriceUnformatted,
  getSellingPricePP,
} from "../../helper/inventory.helper";
import { getExpiryDate } from "../../utils/getProductExpiryDate";
import { useAppSelector } from "../../app/hooks";
import { getCurrentShop } from "../../app/slices/shops";
import { SubCardSelector } from "../subscriptions/subscriptions.style";
import CustomDate from "../../components/date-picker/customDatePicker";
import { setHours } from "../../helper/date";
import { Container, Content, Header } from "./adjustStock.styles";

interface RowProps {
  product: IInventory & AdjustmentInputAttr;
}

const getProductCostPrice = (inventory: IInventory) => {
  const costPrice = getInventoryCostPrice(inventory, undefined, true);
  let pieces = 0;
  let pack = 0;

  if (typeof costPrice === "number") {
    // costPrice is a number
  } else if (costPrice !== null) {
    // costPrice is an object with "pieces" and "pack" properties
    pieces = costPrice?.pieces;
    pack = costPrice?.pack;
  }
  return getInventoryType(inventory) === "PIECES_AND_PACK" ? { pieces: pieces, pack: pack } : null;
};

const AdjustProductRow: FC<RowProps> = ({ product }) => {
  const { selectedProducts, setSelectedProducts } = useAdjustStockContext();
  const [currentProduct, setCurrentProduct] = useState(
    selectedProducts.find((inv) => (inv as IInventory).inventoryId === product.inventoryId)
  );
  const [isOpen, setIsOpen] = useState(false);
  const [updateExpiryDate, setUpdateExpiryDate] = useState(false);
  const [currentInventoryQuantity, setCurrentInventoryQty] = useState<number>();
  const [currentCostPrice, setCurrentCostPrice] = useState<string | number>();
  const [currentPurchasePrice, setCurrentPurchasePrice] = useState<string | number>();
  const currentShop = useAppSelector(getCurrentShop);
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | null>(
    null
  );
  const [selectedType, setSelectedType] = useState<number>(0);
  const [recordAsExp, setRecordAsExp] = useState(false);
  const variantList = product?.Variations!.map((variant) => variant.variationName);

  const handleExpiryChange = (date: Date) => {
    const newDate = new Date(date);
    const dateWithSeconds = setHours(newDate, newDate);
    return dateWithSeconds.from;
  };

  useEffect(() => {
    setSelectedProducts((prevProducts) => {
      const index = prevProducts.findIndex(
        (p) => (p as IInventory)?.inventoryId === (currentProduct as IInventory)?.inventoryId
      );
      if (index === -1) {
        return prevProducts;
      }

      const newProducts = [...prevProducts];
      newProducts[index] = currentProduct as IInventory & AdjustmentInputAttr;

      return newProducts;
    });
  }, [currentProduct]);

  useEffect(() => {
    if (currentShop.isExpiryDateEnabled) {
      const expiringDate = getExpiryDate((currentProduct as IInventory)?.Supplies);

      setUpdateExpiryDate(true);
      if (expiringDate !== null || expiringDate !== undefined) {
        setCurrentProduct((prev) => ({
          ...prev,
          expiryDate: expiringDate ? handleExpiryChange(expiringDate!) : new Date(),
        }));
      }
    }
  }, []);

  const getVariationCostAndPrice = (variantId: string) => {
    const variation = product.Variations?.find((qty) => qty?.variationId === variantId);
    return { cost: variation?.cost, price: variation?.price };
  };
  const filterOptions = [
    { value: "RESTOCK", label: "Restock" },
    { value: "LOST", label: "Lost" },
    { value: "DAMAGE", label: "Damage" },
  ];

  function getOptions() {
    if (product.inventoryType === "PIECES_AND_PACK") {
      return ["PIECES", "PACK"];
    } else if (product.inventoryType === "VARIATION") {
      return variantList as string[];
    } else if (product.inventoryType === "PIECES") {
      return ["PIECES"];
    } else {
      return ["PACK"];
    }
  }

  useEffect(() => {
    setCurrentInventoryQty(
      product.inventoryType !== "PIECES_AND_PACK" ? getQuantity(currentProduct as IInventory) : 0
    );
    setCurrentCostPrice(
      product.inventoryType === "PIECES_AND_PACK"
        ? selectedType === 0
          ? getProductCostPrice(currentProduct as IInventory)!?.pieces
          : getProductCostPrice(currentProduct as IInventory)!?.pack
        : getProductCostPriceUnformatted(currentProduct as IInventory)
    );
    setCurrentPurchasePrice(
      product.inventoryType === "PIECES_AND_PACK"
        ? selectedType === 0
          ? getSellingPricePP(currentProduct as IInventory)!?.pieces
          : getSellingPricePP(currentProduct as IInventory)!?.pack
        : getProductSellingPriceUnformatted(currentProduct as IInventory)
    );
    setCurrentProduct((prev) => ({
      ...prev,
      quantity: ((product as AdjustmentInputAttr)?.quantityAdj as number) ?? 0,
      expiryDate: currentProduct?.expiryDate
        ? handleExpiryChange(currentProduct?.expiryDate!)
        : new Date(),
      comment: "",
      reason: selectedOption ? selectedOption.value : "",
      inventoryTypeAdj:
        product.inventoryType === "PIECES_AND_PACK" || product.inventoryType === "VARIATION"
          ? getOptions()[selectedType]
          : getOptions()[0],
      variationId:
        product.inventoryType === "VARIATION"
          ? (product?.Variations![selectedType].variationId as string)
          : "",
      isExpenditure: recordAsExp,
      previousCostPrice: getCostPrice(currentProduct as IInventory),
      costPriceAdj: currentCostPrice as number,
      sellingPrice: currentPurchasePrice as number,
    }));
  }, [selectedOption]);

  useEffect(() => {
    if (product.inventoryType === "PIECES_AND_PACK") {
      setCurrentInventoryQty(
        selectedType === 0
          ? getQuantity(currentProduct as IInventory).pieces
          : getQuantity(currentProduct as IInventory).pack
      );
      setCurrentCostPrice(
        selectedType === 0
          ? getProductCostPrice(currentProduct as IInventory)!?.pieces
          : getProductCostPrice(currentProduct as IInventory)!?.pack
      );
      setCurrentPurchasePrice(
        selectedType === 0
          ? getSellingPricePP(currentProduct as IInventory)!?.pieces
          : getSellingPricePP(currentProduct as IInventory)!?.pack
      );
      setCurrentProduct((prev) => ({
        ...prev,
        quantity: ((product as AdjustmentInputAttr)?.quantityAdj as number) ?? 0,
        comment: "",
        reason: selectedOption ? selectedOption.value : "",
        inventoryTypeAdj:
          product.inventoryType === "PIECES_AND_PACK" || product.inventoryType === "VARIATION"
            ? getOptions()[selectedType]
            : getOptions()[0],
        variationId:
          product.inventoryType === "VARIATION"
            ? (product?.Variations![selectedType].variationId as string)
            : "",
        isExpenditure: recordAsExp,
        previousCostPrice: getCostPrice(currentProduct as IInventory),
        costPriceAdj:
          selectedType === 0
            ? getProductCostPrice(currentProduct as IInventory)!?.pieces
            : (getProductCostPrice(currentProduct as IInventory)!?.pack as number),
        sellingPrice:
          selectedType === 0
            ? getSellingPricePP(currentProduct as IInventory)!?.pieces
            : (getSellingPricePP(currentProduct as IInventory)!?.pack as number),
      }));
    } else if (product.inventoryType === "VARIATION") {
      setCurrentInventoryQty(
        getVariationQuantity(
          currentProduct as IInventory,
          product?.Variations![selectedType].variationId as string
        )
      );
      setCurrentCostPrice(
        getVariationCostAndPrice(product?.Variations![selectedType].variationId as string).cost
      );
      setCurrentPurchasePrice(
        getVariationCostAndPrice(product?.Variations![selectedType].variationId as string).price
      );
      setCurrentProduct((prev) => ({
        ...prev,
        quantity: ((product as AdjustmentInputAttr).quantityAdj as number) ?? 0,
        comment: "",
        reason: selectedOption ? selectedOption.value : "",
        inventoryTypeAdj:
          product.inventoryType === "PIECES_AND_PACK" || product.inventoryType === "VARIATION"
            ? getOptions()[selectedType]
            : getOptions()[0],
        variationId:
          product.inventoryType === "VARIATION"
            ? (product?.Variations![selectedType].variationId as string)
            : "",
        isExpenditure: recordAsExp,
        previousCostPrice: getCostPrice(currentProduct as IInventory),
        costPriceAdj: currentCostPrice as number,
        sellingPrice: currentPurchasePrice as number,
      }));
    }
  }, [selectedType, selectedOption]);

  useEffect(() => {
    setCurrentProduct((prevInputs) => ({
      ...prevInputs,
      isExpenditure: recordAsExp,
    }));
  }, [recordAsExp]);

  useEffect(() => {
    if (selectedOption === null) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }, [selectedOption]);

  const handleSelectChange = (newValue: SingleValue<{ value: string; label: string }>) => {
    setSelectedOption(newValue);
  };

  const handleRemoveProd = (id: string) => {
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.filter((prev) => (prev as IInventory).inventoryId !== id)
    );
  };

  return (
    <Container isOpen={isOpen}>
      <Header>
        <Flex justifyContent="space-between" padding="0.5rem 0.75rem" alignItems="center">
          <Flex columnGap="0.6rem" width="60%">
            <Flex
              onClick={() => handleRemoveProd(currentProduct?.inventoryId as string)}
              width="1.5rem"
              height="inherit"
            >
              <img width="100%" src={MinusIcon} alt="" />
            </Flex>
            <Flex margin="0 0.3rem" direction="column" width="65%">
              <Text fontSize="1.1rem">{product.inventoryName}</Text>
              <Text fontSize="0.75rem" color={Colors.grey}>
                {product.inventoryType}
              </Text>
            </Flex>
          </Flex>
          <ReactSelect
            menuPortalTarget={document.body}
            menuPosition="fixed"
            isClearable={true}
            isSearchable={false}
            value={selectedOption}
            onChange={(newValue) => handleSelectChange(newValue)}
            options={filterOptions}
            placeholder="Select Reason"
            styles={{
              control: (provided: {}, state) => ({
                ...provided,
                border: "none",
                borderColor: state.isFocused ? Colors.secondaryColor : "none",
                backgroundColor: Colors.lightSecondaryColor,
                borderRadius: "0.5rem",
                width: "12rem",
                boxShadow: "none",
              }),

              menu: (provided: {}) => ({
                ...provided,
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                backgroundColor: Colors.lightBg,
              }),

              option: (provided: {}, state) => ({
                ...provided,
                backgroundColor: Colors.white,
                color: state.isFocused ? Colors.grey : "black",
                "&:hover": {
                  backgroundColor: Colors.tabBg,
                },
              }),

              singleValue: (provided: {}) => ({
                ...provided,
                color: Colors.secondaryColor,
              }),

              indicatorSeparator: (provided: {}) => ({
                ...provided,
                backgroundColor: Colors.secondaryColor,
              }),

              dropdownIndicator: (provided: {}) => ({
                ...provided,
                color: Colors.secondaryColor,
              }),

              clearIndicator: (provided: {}) => ({
                ...provided,
                color: Colors.secondaryColor,
              }),

              placeholder: (provided: {}) => ({
                ...provided,
                color: Colors.secondaryColor,
              }),
            }}
          />
        </Flex>
        <div
          style={{
            paddingTop: "0.625rem",
            display: isOpen ? "block" : "none",
            width: "98%",
            marginInline: "auto",
            opacity: 0.2,
            borderBottom: "1px solid #9EA8B7",
          }}
        ></div>
      </Header>
      <Content isOpen={isOpen}>
        <div>
          <Flex
            justifyContent="space-between"
            padding="0.5rem 1rem"
            gap="0.5rem"
            alignItems="flex-start"
          >
            <Flex direction="column" gap="0.5rem 0">
              <Text fontSize="0.8125rem" fontWeight="400" color={Colors.blackLight}>
                {product?.inventoryType === "VARIATION" ? "Variant" : "Product Type"}
              </Text>
              {product?.inventoryType === "PIECES" || product?.inventoryType === "PACK" ? (
                <Span
                  style={{
                    height: "2rem",
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: "0.3125rem",
                  }}
                  width="9.375rem"
                  fontSize="0.875rem"
                >
                  {getOptions()[0]}
                </Span>
              ) : (
                <>
                  <CustomDropdown
                    width="10rem"
                    color={Colors.grey}
                    containerColor="#F4F6F9"
                    bgColor={Colors.lightBg}
                    borderRadius=".75rem"
                    height="2rem"
                    dropdownIcon={dropIcon2}
                    options={getOptions()}
                    setValue={setSelectedType}
                    fontSize=".7875rem"
                    selected={selectedType}
                    margin="0px 0 0px 0"
                    padding=".625rem .3125rem"
                  />
                </>
              )}
            </Flex>
            <Flex direction="column" gap="0.5rem 0">
              <Text fontSize="0.8125rem" fontWeight="400" color={Colors.blackLight}>
                Quantity
              </Text>
              <>
                <InputField
                  type="text"
                  backgroundColor="#F4F6F9"
                  borderRadius="0.75rem"
                  size="lg"
                  height="2rem"
                  fontSize="0.875rem"
                  color="#8196B3"
                  width="100%"
                  noFormat
                  value={currentProduct!.quantityAdj as number}
                  onChange={(e) => {
                    setCurrentProduct((prevInputs) => ({
                      ...prevInputs,
                      quantityAdj: convertToNumber(e.target.value) as number,
                    }));
                  }}
                />
              </>
              <Flex>
                <Text color={Colors.secondaryColor}>
                  <i>{currentInventoryQuantity ?? 0}</i> {"  "}
                  <i style={{ color: Colors.blackLight }}>Available</i>
                </Text>
              </Flex>
            </Flex>
            <Flex direction="column" gap="0.5rem 0">
              <Text fontSize="0.8125rem" fontWeight="400" color={Colors.blackLight}>
                Purchase Price
              </Text>
              <>
                <InputField
                  type="text"
                  backgroundColor="#F4F6F9"
                  borderRadius="0.75rem"
                  size="lg"
                  height="2rem"
                  fontSize="0.875rem"
                  color="#8196B3"
                  width="100%"
                  noFormat
                  value={currentProduct?.costPriceAdj as number}
                  onChange={(e) => {
                    setCurrentProduct((prevInputs) => ({
                      ...prevInputs,
                      costPriceAdj: convertToNumber(e.target.value) as number,
                    }));
                  }}
                />
              </>
              <Flex>
                <Text color={Colors.secondaryColor}>
                  <i style={{ color: Colors.blackLight }}>Current Price</i>
                  {"  "}
                  <i>{currentCostPrice}</i>
                </Text>
              </Flex>
            </Flex>
            <Flex direction="column" gap="0.5rem 0">
              <Text fontSize="0.8125rem" fontWeight="400" color={Colors.blackLight}>
                Selling Price
              </Text>
              <>
                <InputField
                  type="text"
                  backgroundColor="#F4F6F9"
                  borderRadius="0.75rem"
                  size="lg"
                  height="2rem"
                  width="100%"
                  fontSize="0.875rem"
                  color="#8196B3"
                  noFormat
                  value={(currentProduct as AdjustmentInputAttr)?.sellingPrice as number}
                  onChange={(e) => {
                    setCurrentProduct((prevInputs) => ({
                      ...prevInputs,
                      sellingPrice: convertToNumber(e.target.value) as number,
                    }));
                  }}
                />
              </>
              <Flex>
                <Text color={Colors.secondaryColor}>
                  <i style={{ color: Colors.blackLight }}>Current Price</i>
                  {"  "}
                  <i>{currentPurchasePrice}</i>
                </Text>
              </Flex>
            </Flex>
            {updateExpiryDate && (
              <Flex direction="column" gap="0.6rem 0">
                {currentProduct?.showExpiryDtae ? (
                  <>
                    <Text fontSize="0.8125rem" fontWeight="400" color={Colors.blackLight}>
                      Expiry Date
                    </Text>
                    <>
                      <CustomDate
                        height="1.5rem"
                        startDate={currentProduct?.expiryDate}
                        background="#f4f6f9"
                        border="none"
                        width="90%"
                        padding="0 0.5rem"
                        margin="0"
                        setStartDate={(date: Date) => {
                          const newDate = handleExpiryChange(date);
                          setCurrentProduct((prev) => ({
                            ...prev,
                            expiryDate: newDate,
                          }));
                        }}
                      />
                    </>
                  </>
                ) : (
                  <>
                    <Flex
                      height="2.2rem"
                      width="10rem"
                      borderRadius="0.75rem"
                      alignItems="center"
                      alignSelf="center"
                      justifyContent="space-around"
                      margin="1.5rem 0 0 0"
                      border={`1px dashed ${Colors.grey}`}
                      onClick={() =>
                        setCurrentProduct((prevInputs) => ({
                          ...prevInputs,
                          showExpiryDtae: !currentProduct?.showExpiryDtae,
                        }))
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M10 20C4.47719 20 0 15.5228 0 10C0 4.47688 4.47719 0 10 0C15.5231 0 20 4.47688 20 10C20 15.5228 15.5231 20 10 20ZM10 1.23031C5.17531 1.23031 1.25 5.17531 1.25 10C1.25 14.8247 5.17531 18.75 10 18.75C14.8247 18.75 18.75 14.8247 18.75 10C18.75 5.17537 14.8247 1.23031 10 1.23031ZM14.375 10.625H10.625V14.375C10.625 14.72 10.345 15 10 15C9.655 15 9.375 14.72 9.375 14.375V10.625H5.625C5.28 10.625 5 10.345 5 10C5 9.655 5.28 9.375 5.625 9.375H9.375V5.625C9.375 5.28 9.655 5 10 5C10.345 5 10.625 5.28 10.625 5.625V9.375H14.375C14.72 9.375 15 9.655 15 10C15 10.345 14.72 10.625 14.375 10.625Z"
                          fill="#607087"
                        />
                      </svg>
                      <Text color={Colors.grey}>Expiry Date</Text>
                    </Flex>
                  </>
                )}
              </Flex>
            )}
            <Flex direction="column" gap="0.5rem 0">
              <Text fontSize="0.8125rem" fontWeight="400" color={Colors.blackLight}>
                Comment
              </Text>
              <>
                <Input
                  type="text"
                  buttonColor="#F4F6F9"
                  borderRadius="0.75rem"
                  height="2rem"
                  fontSize="0.875rem"
                  color="#8196B3"
                  width="100%"
                  value={(currentProduct as AdjustmentInputAttr)?.comment as string}
                  onChange={(e) => {
                    setCurrentProduct((prevInputs) => ({
                      ...prevInputs,
                      comment: e.target.value as string,
                    }));
                  }}
                />
              </>
            </Flex>
          </Flex>
          {(selectedOption?.value === "LOST" || selectedOption?.value === "DAMAGE") && (
            <>
              <div
                style={{
                  paddingTop: "0.625rem",
                  display: isOpen ? "block" : "none",
                  width: "98%",
                  marginInline: "auto",
                  opacity: 0.2,
                  borderBottom: "1px solid #9EA8B7",
                }}
              ></div>
              <Flex padding="0 1rem">
                <SubCardSelector
                  checkedBg={"transparent"}
                  style={{
                    color: Colors.blackLight,
                    justifyContent: "space-around",
                    border: "none",
                    gap: "0.5rem",
                    padding: "0",
                  }}
                  height="fit-content"
                  width="fit-content"
                  onClick={() => setRecordAsExp(!recordAsExp)}
                  checked={recordAsExp}
                >
                  <div
                    style={{
                      width: "1.2rem",
                      height: "1.2rem",
                      padding: "0.1rem",
                      border: recordAsExp ? "" : "1px solid #9EA8B7",
                      background: recordAsExp ? Colors.black : "transparent",
                      borderRadius: "0.3rem",
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
                    <div style={{ color: "white" }}>✔</div>
                  </div>
                  <i>Record this adjustment as an expenditure</i>
                </SubCardSelector>
              </Flex>
            </>
          )}
        </div>
      </Content>
    </Container>
  );
};

export default AdjustProductRow;
