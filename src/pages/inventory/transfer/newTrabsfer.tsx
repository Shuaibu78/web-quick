import { Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import { Button } from "../../../components/button/Button";
import { CancelButton, Left, Right } from "../../sales/style";
import { InputWrapper, SearchContainer, TrfHeader } from "../style";
import RemoveIcon from "../../../assets/removeIcon.svg";
import ShopAvatar from "../../../assets/Image.svg";
import NumberInput from "../../../components/input-field/customNumberInput";
import { useEffect, useState } from "react";
import {
  RadioContainer,
  RadioInput,
  RadioLabel,
  RadioIcon,
} from "../../../components/top-nav/storeListModal";
import { formatImageUrl } from "../../../utils/formatImageUrl.utils";
import { useAppSelector } from "../../../app/hooks";
import { getShops } from "../../../app/slices/sales";
import { getCurrentShop } from "../../../app/slices/shops";
import TextWithTooltip from "../../../GlobalStyles/textWIthTooltip";
import { ClippedText } from "../../onlinePresence/style.onlinePresence";
import ModalSidebar from "../product-list/modal";
import ReviewTrf from "./reviewTrf";
import { ModalBox, ModalContainer } from "../../settings/style";
import Cancel from "../../../assets/cancel.svg";
import SearchInput from "../../../components/search-input/search-input";
import { useQuery } from "@apollo/client";
import { SEARCH_INVENTORY } from "../../../schema/inventory.schema";
import { useProdctPageContext } from "../inventory";
import { IInventory } from "../../../interfaces/inventory.interface";

export interface SelectedTrfProdAttr {
  inventoryName: string;
  inventoryId?: string;
  quantity: number;
  inventoryType: string;
  fromInventoryId: string;
  fromVariationId?: string | null;
  toInventoryId?: string | null;
  toVariationId?: string | null;
  toInventoryName?: string | null;
}

const NewTransfer = () => {
  const currentShop = useAppSelector(getCurrentShop);
  const [currentId, setCurrentId] = useState<string>();
  const [searchTerm, setSearchTerm] = useState<string>();
  const [reviewTrf, setReviewTrf] = useState<boolean>(false);
  const [addProducts, setAddProducts] = useState<boolean>(false);
  const [selectedProducts, setSelectedProducts] = useState<SelectedTrfProdAttr[]>([]);
  const shops = useAppSelector(getShops);
  const { navbarHeight } = useProdctPageContext();
  const [selectInventoryType, setShowSelectInventoryType] = useState<boolean>(false);
  const [selectVariation, setShowSelectVariation] = useState<boolean>(false);
  const [activeInv, setActiveInv] = useState<IInventory>();

  const ProductItem = ({ value }: { value: SelectedTrfProdAttr }) => {
    // const [dVal, setDVal] = useState(Number(value.quantity));
    const existingProductIndex = selectedProducts?.findIndex(
      (i) => i.fromInventoryId === value.fromInventoryId
    );
    const handleQuantityChange = (val: number) => {
      if (existingProductIndex !== -1) {
        const updatedProducts = [...selectedProducts];
        updatedProducts[existingProductIndex].quantity = Number(val);
        setSelectedProducts(updatedProducts);
      }
    };
    const handleQuantityIncrement = () => {
      if (existingProductIndex !== -1) {
        const updatedProducts = [...selectedProducts];
        updatedProducts[existingProductIndex].quantity += 1;
        setSelectedProducts(updatedProducts);
      }
    };
    const handleQuantityDecrement = () => {
      if (existingProductIndex !== -1) {
        const updatedProducts = [...selectedProducts];
        if (updatedProducts[existingProductIndex].quantity > 0) {
          updatedProducts[existingProductIndex].quantity -= 1;
        }
        setSelectedProducts(updatedProducts);
      }
    };
    const handleRemoveProd = () => {
      if (existingProductIndex !== -1) {
        setSelectedProducts((prevSelectedProducts) =>
          prevSelectedProducts.filter((prev) => prev.fromInventoryId !== value.fromInventoryId)
        );
      }
    };

    return (
      <>
        <Flex
          justifyContent="space-between"
          margin="0.4rem 0"
          padding="0.2rem 0"
          hover
          style={{ borderBottom: `1px solid ${Colors.borderGreyColor}` }}
        >
          <Flex gap="0 0.5rem" alignItems="center" color={Colors.blackLight}>
            <div onClick={handleRemoveProd} style={{ width: "1.5rem", cursor: "pointer" }}>
              <img src={RemoveIcon} width="inherit" alt="removeIcon" />
            </div>
            <TrfHeader>
              <TextWithTooltip text={value.inventoryName} tooltip={value.inventoryName} />
              <p className="small" style={{ fontWeight: "400" }}>
                {value.inventoryType}
              </p>
            </TrfHeader>
          </Flex>

          <NumberInput
            value={value.quantity}
            onChange={handleQuantityChange}
            increment={handleQuantityIncrement}
            decrement={handleQuantityDecrement}
          />
        </Flex>
      </>
    );
  };

  const { data: searchData } = useQuery<{
    searchUserInventory: [IInventory];
  }>(SEARCH_INVENTORY, {
    variables: {
      shopId: currentShop.shopId,
      searchString: searchTerm ?? "",
    },
    skip: !searchTerm,
  });

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  function handleAddProduct(arg1: IInventory, arg2?: string, arg3?: string): void {
    const inventoryName = arg1.inventoryName as string;
    const inventoryType: string = arg2 ?? (arg1.inventoryType as string);
    const fromInventoryId = arg1.inventoryId as string;
    const fromVariationId = arg3;
    const quantity = 1;

    const existingProductIndex = selectedProducts?.findIndex(
      (i) => i.fromInventoryId === fromInventoryId
    );

    if (inventoryType === "PIECES_AND_PACK") {
      setShowSelectInventoryType(true);
      setActiveInv(arg1);
    } else if (inventoryType === "VARIATION" && !fromVariationId) {
      setShowSelectVariation(true);
      setActiveInv(arg1);
    } else if (existingProductIndex !== -1) {
      const updatedProducts = [...selectedProducts];
      updatedProducts[existingProductIndex].quantity += 1;
      setSelectedProducts(updatedProducts);
    } else {
      const newProduct: SelectedTrfProdAttr = {
        inventoryName,
        inventoryType,
        fromInventoryId,
        toInventoryId: null,
        toVariationId: null,
        fromVariationId,
        quantity,
      };
      setSelectedProducts([...selectedProducts!, newProduct]);
      setSearchTerm("");
    }
  }

  function filterByInventoryId(arr1: IInventory[], arr2: SelectedTrfProdAttr[]) {
    const inventoryIdSet = new Set(arr2?.map((obj) => obj.fromInventoryId));

    const filteredArr1 = arr1?.filter((obj) => !inventoryIdSet.has(obj.inventoryId as string));

    return filteredArr1;
  }

  return (
    <Flex height="fit-content" overflow="hidden" justifyContent="space-evenly">
      <Right
        style={{
          height: `calc(100vh - ${navbarHeight! + 50}px)`,
          width: "45%",
        }}
      >
        <Flex justifyContent="space-between">
          <TrfHeader>
            <Flex gap="0 0.2rem">
              Step <p className="yellow">1</p> of <p className="yellow">2</p>{" "}
              <p className="black">Add Product to Transfer</p>
            </Flex>
            <p className="small">Add products to transfer to another shop.</p>
          </TrfHeader>

          <Button
            label="Add Products"
            backgroundColor={Colors.secondaryColor}
            width="8rem"
            height="2rem"
            color="white"
            borderRadius="0.5rem"
            onClick={() => setAddProducts(true)}
          />
        </Flex>

        <Flex
          direction="column"
          margin="1.5rem 0"
          border={`1px solid ${Colors.grey}`}
          borderRadius="0.5rem"
          padding=".4rem 1rem"
          height="90%"
          maxHeight="90%"
          overflowX="hidden"
          overflowY="auto"
          color={Colors.blackLight}
        >
          <Flex justifyContent="space-between" margin="1rem 0">
            <p style={{ color: Colors.secondaryColor }}>{selectedProducts.length} Products Added</p>
            {selectedProducts.length > 0 && (
              <Flex gap="0 0.2rem" cursor="pointer" onClick={() => setSelectedProducts([])}>
                <img src={RemoveIcon} alt="removeIcon" />
                <p style={{ color: Colors.red }}>Remove All</p>
              </Flex>
            )}
          </Flex>

          <div style={{ marginTop: "1rem", minHeight: "300px" }}>
            <Flex fontSize="0.8rem" justifyContent="space-between">
              <p>Products Added</p>
              <p>Quantity</p>
            </Flex>

            {selectedProducts?.map((item) => (
              <ProductItem key={item.fromInventoryId} value={item} />
            ))}
          </div>
        </Flex>
      </Right>

      <Left
        style={{
          height: `calc(100vh - ${navbarHeight! + 50}px)`,
          width: "45%",
          padding: "0 0 0.5rem 0",
        }}
      >
        <Flex justifyContent="space-between">
          <TrfHeader>
            <Flex gap="0 0.2rem">
              Step <p className="yellow">2</p> of <p className="yellow">2</p>{" "}
              <p className="black"> Select a Destination Shop to Transfer Product</p>
            </Flex>
            <p className="small">Click on a shop to continue this process.</p>
          </TrfHeader>
        </Flex>

        <Flex
          direction="column"
          margin="1.5rem 0"
          border={`1px solid ${Colors.grey}`}
          borderRadius="0.5rem"
          padding=".4rem 1rem"
          height="90%"
          maxHeight="90%"
          overflow="hidden"
          color={Colors.blackLight}
          alignItems="space-between"
          justifyContent="space-between"
        >
          <Flex overflowX="hidden" overflowY="scroll" direction="column">
            {shops?.filter((shop) => shop.shopId !== currentShop.shopId).length > 0 ? (
              <>
                {shops
                  ?.filter((shop) => shop.shopId !== currentShop.shopId)
                  .map((option, index) => {
                    const isChecked = option.shopId === currentId;
                    const images = option?.images;
                    return (
                      <RadioContainer
                        noBorder
                        style={{
                          height: "4.125rem",
                          padding: "0 1rem",
                          backgroundColor: isChecked ? "#E8F6EE" : "#F4F6F9",
                        }}
                        checked={isChecked as boolean}
                        onClick={() => setCurrentId(option.shopId)}
                        key={index}
                      >
                        <RadioInput type="radio" checked={isChecked} />
                        <img
                          width="30px"
                          height="30px"
                          src={images ? formatImageUrl(images?.smallImageOnlineURL) : ShopAvatar}
                          alt=""
                        />
                        <RadioLabel>
                          <Flex justifyContent="space-between" width="100%">
                            <Flex
                              height="3.5rem"
                              direction="column"
                              alignItems="space-around"
                              justifyContent="space-around"
                              width="70%"
                              color={isChecked ? "#00A551" : Colors.blackLight}
                            >
                              <Flex width="inherit">
                                <ClippedText
                                  maxWidth="100%"
                                  style={{ fontSize: "1rem", fontWeight: "400" }}
                                >
                                  {option.shopName}
                                </ClippedText>
                              </Flex>
                              <p
                                style={{
                                  fontSize: "0.75rem",
                                  fontWeight: "400",
                                  opacity: "0.5",
                                }}
                              >
                                {option.shopCategoryName}
                              </p>
                            </Flex>
                            <Flex
                              height="3.5rem"
                              width="30%"
                              justifyContent="center"
                              alignItems="flex-end"
                              padding="0.5rem 0"
                              fontSize="0.6875rem"
                              color={isChecked ? "#00A551" : Colors.blackLight}
                            >
                              {isChecked ? (
                                <Flex borderRadius="0.4rem" fontSize="0.6875rem">
                                  <RadioIcon
                                    style={{
                                      width: "0.9rem",
                                      height: "0.9rem",
                                      borderRadius: "50%",
                                    }}
                                    checked={isChecked as boolean}
                                    bg={Colors.green}
                                  >
                                    <span className="check">✔</span>
                                  </RadioIcon>
                                  <p>Selected Shop</p>
                                </Flex>
                              ) : (
                                <Flex
                                  style={{ backgroundColor: "#fff" }}
                                  padding="0.4rem"
                                  borderRadius="0.4rem"
                                  fontSize="0.6875rem"
                                >
                                  <RadioIcon
                                    style={{
                                      width: "0.9rem",
                                      height: "0.9rem",
                                      borderRadius: "50%",
                                    }}
                                    checked={isChecked as boolean}
                                    bg={Colors.green}
                                  >
                                    <span className="check">✔</span>
                                  </RadioIcon>
                                  <p>Select Shop</p>
                                </Flex>
                              )}
                            </Flex>
                          </Flex>
                        </RadioLabel>
                      </RadioContainer>
                    );
                  })}
              </>
            ) : (
              <>
                <h1>No shops to transfer to</h1>
              </>
            )}
          </Flex>
          <Flex justifyContent="flex-end">
            <Button
              label="Proceed to Transfer"
              backgroundColor={Colors.primaryColor}
              width="10rem"
              height="2rem"
              color="white"
              borderRadius="0.5rem"
              disabled={!currentId}
              onClick={() => {
                setReviewTrf(true);
              }}
            />
          </Flex>
        </Flex>
      </Left>

      {reviewTrf && (
        <ModalSidebar
          height={"100vh"}
          borderRadius=".75rem"
          padding="0"
          showProductModal={reviewTrf}
        >
          <ReviewTrf
            setShowModal={setReviewTrf}
            selectedProducts={selectedProducts}
            setSelectedProducts={setSelectedProducts}
            currentShopId={currentShop.shopId as string}
            currentId={currentId as string}
          />
        </ModalSidebar>
      )}

      {selectInventoryType && (
        <ModalContainer style={{ zIndex: "9898999999" }}>
          <ModalBox>
            <Flex alignItems="center" justifyContent="space-between">
              <h3>Select Inventory Type</h3>
              <CancelButton
                style={{
                  width: "1.875rem",
                  height: "1.875rem",
                  display: "grid",
                  placeItems: "center",
                }}
                hover
                onClick={() => setShowSelectInventoryType(false)}
              >
                <img src={Cancel} alt="" />
              </CancelButton>
            </Flex>
            <div>
              {["PIECES", "PACK"].map((type) => (
                <Flex
                  justifyContent="space-between"
                  margin="0.2rem 0"
                  padding="0.5rem 0"
                  cursor="pointer"
                  hover
                  style={{ borderBottom: `1px solid ${Colors.borderGreyColor}` }}
                  onClick={() => {
                    handleAddProduct(activeInv!, type);
                    setShowSelectInventoryType(false);
                  }}
                >
                  {type}
                </Flex>
              ))}
            </div>
          </ModalBox>
        </ModalContainer>
      )}

      {selectVariation && (
        <ModalContainer style={{ zIndex: "9898999999" }}>
          <ModalBox>
            <Flex alignItems="center" justifyContent="space-between">
              <h3>Select Variation</h3>
              <CancelButton
                style={{
                  width: "1.875rem",
                  height: "1.875rem",
                  display: "grid",
                  placeItems: "center",
                }}
                hover
                onClick={() => setShowSelectVariation(false)}
              >
                <img src={Cancel} alt="" />
              </CancelButton>
            </Flex>
            <div>
              {activeInv &&
                activeInv.Variations?.map((type) => (
                  <Flex
                    justifyContent="space-between"
                    margin="0.2rem 0"
                    padding="0.5rem 0"
                    cursor="pointer"
                    hover
                    style={{ borderBottom: `1px solid ${Colors.borderGreyColor}` }}
                    onClick={() => {
                      handleAddProduct(activeInv!, "VARIATION", type?.variationId!);
                      setShowSelectVariation(false);
                    }}
                  >
                    {type.variationName}
                  </Flex>
                ))}
            </div>
          </ModalBox>
        </ModalContainer>
      )}

      {addProducts && (
        <ModalContainer>
          <ModalBox>
            <Flex alignItems="center" justifyContent="space-between">
              <h3>Add Products to Transfer</h3>
              <CancelButton
                style={{
                  width: "1.875rem",
                  height: "1.875rem",
                  display: "grid",
                  placeItems: "center",
                }}
                hover
                onClick={() => setAddProducts(false)}
              >
                <img src={Cancel} alt="" />
              </CancelButton>
            </Flex>
            <div>
              <SearchContainer>
                <InputWrapper>
                  <SearchInput
                    placeholder="Search Product"
                    width="100%"
                    handleSearch={handleSearch}
                    borderRadius="0.625rem"
                  />
                </InputWrapper>
                {searchData?.searchUserInventory && (
                  <Flex
                    id="result-box"
                    style={{ position: "absolute", top: "3em", zIndex: 9000 }}
                    width="100%"
                    borderRadius="0 0 0.625rem 0.625rem"
                    direction="column"
                    gap="0.2em"
                    maxHeight="18.75rem"
                    bg="white"
                  >
                    {filterByInventoryId(
                      searchData?.searchUserInventory.filter(
                        (inv) => inv.trackable === true
                      ) as IInventory[],
                      selectedProducts
                    )?.map((val) => {
                      return (
                        <Span
                          className="product"
                          cursor="pointer"
                          color={Colors.blackLight}
                          fontSize="1em"
                          key={val.inventoryId}
                          onClick={() => handleAddProduct(val)}
                        >
                          {val.inventoryName}
                        </Span>
                      );
                    })}
                  </Flex>
                )}
              </SearchContainer>
              <Flex fontSize="0.8rem" justifyContent="space-between">
                <h3>Products Added</h3>
              </Flex>

              <Flex direction="column" minHeight="15rem">
                {selectedProducts?.map((item) => (
                  <ProductItem key={item.fromInventoryId} value={item} />
                ))}
              </Flex>
              <Flex justifyContent="flex-end" margin="10px 0">
                <Button
                  label="Continue"
                  backgroundColor={Colors.primaryColor}
                  height="2rem"
                  width="40%"
                  color="white"
                  borderRadius="0.5rem"
                  onClick={() => {
                    setAddProducts(false);
                  }}
                />
              </Flex>
            </div>
          </ModalBox>
        </ModalContainer>
      )}
    </Flex>
  );
};

export default NewTransfer;
