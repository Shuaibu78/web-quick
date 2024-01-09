import React, { useEffect, useState } from "react";
import { Flex, Span } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import cancel from "../../../assets/cancel.svg";
import Search from "../../../assets/search-icon-big.svg";
import CountIcon from "../../../assets/up-count.svg";
import { InputWrapper } from "../../login/style";
import SearchInput from "../../../components/search-input/search-input";
import { CountButton, SearchContainer, SelectedList } from "../style";
import { useMutation, useQuery } from "@apollo/client";
import { SEARCH_INVENTORY } from "../../../schema/inventory.schema";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import { CustomCont } from "../../sales/style";
import { getImageUrl } from "../../../helper/image.helper";
import { IInventory, InventoryType } from "../../../interfaces/inventory.interface";
import Remove from "../../../assets/dash-remove.svg";
import { TransparentBtn } from "../../sales/new-sales/styles";
import { ADJUST_BATCH_QUANTITY } from "../../../schema/batch.schema";
import { getBatchProduct } from "../../../app/slices/batch";
import { Button } from "../../../components/button/Button";
import Loader from "../../../components/loader";
import { Input } from "../product-list/adjustProductQty/style";

interface IImport {
  refetchAll: Function;
  setShowImport: Function;
}

interface IBatchQty extends IInventory {
  batchQuantity: number;
}

interface IBatchItem {
  perPack?: number;
  inventoryId?: string;
  inventoryName: string;
  variationName?: string;
  costPrice?: number;
  quantity: number;
  inventoryType?: InventoryType;
  variationId?: string;
  inventoryExpiryDate?: Date;
  Images?: any[];
}

const ImportBatchProduct: React.FC<IImport> = ({ setShowImport, refetchAll }) => {
  const [search, setSearch] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<IBatchItem[]>([]);

  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state) => state.user.userId);
  const currentShop = useAppSelector(getCurrentShop);
  const { batchNumber, batchId, expiryDate } = useAppSelector(getBatchProduct);

  useEffect(() => {
    if (batchNumber) {
      setBatchNo(batchNumber);
    }
  }, [batchNumber]);

  const { data } = useQuery<{
    searchUserInventory: [IInventory];
  }>(SEARCH_INVENTORY, {
    skip: !search,
    fetchPolicy: "network-only",
    variables: {
      shopId: currentShop.shopId,
      searchString: search ?? "",
      limit: 20,
    },
  });

  const [adjustBatch] = useMutation<{ adjustBatchQuantity: Boolean }>(ADJUST_BATCH_QUANTITY, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },

    onCompleted: ({ adjustBatchQuantity }) => {
      if (adjustBatchQuantity) {
        setIsLoading(false);
        setShowImport(false);
        refetchAll();
        dispatch(
          toggleSnackbarOpen({
            color: "SUCCESS",
            message: `Product${selectedProducts.length > 1 ? "s" : ""} Added to Batch`,
          })
        );
      }
    },
    onError: (error) => {
      setIsLoading(false);
      dispatch(toggleSnackbarOpen(error.message));
    },
  });

  const handleAddProductsToBatch = () => {
    if (!batchId && !currentUserId && !currentShop.shopId) {
      return;
    }
    setIsLoading(true);

    const products = selectedProducts.map((product) => {
      const { Images, costPrice, variationName, ...rest } = product;
      return rest;
    });

    adjustBatch({
      variables: {
        shopId: currentShop.shopId,
        userId: currentUserId,
        batchId: batchId,
        batchInventories: products,
      },
    });
  };

  const addVariationsToList = (product: IBatchQty) => {
    const variantList: IBatchItem[] = [];

    product.Variations?.forEach((variant) => {
      const inList = selectedProducts.find((val) => {
        return val.variationId === variant.variationId;
      });

      if (inList) return;

      variantList.push({
        quantity: 1,
        Images: product.Images,
        inventoryExpiryDate: expiryDate,
        inventoryId: product.inventoryId,
        variationId: variant.variationId,
        variationName: variant.variationName,
        inventoryType: product.inventoryType,
        inventoryName: product.inventoryName!,
      });
    });

    setSearch("");
    setSelectedProducts((prev) => [...prev, ...variantList]);
  };

  const handleAddProductToList = (inventory: IBatchQty) => {
    if (inventory.inventoryType === "NON_TRACKABLE") {
      dispatch(
        toggleSnackbarOpen({
          message: "You can only add Trackable products",
          color: "INFO",
        })
      );
      return;
    }

    if (inventory.inventoryType === "VARIATION") {
      addVariationsToList(inventory);
      return;
    }

    const inList = selectedProducts.find((val) => val.inventoryId === inventory.inventoryId);

    if (inList) {
      dispatch(
        toggleSnackbarOpen({
          message: "Product already added",
          color: "INFO",
        })
      );
      return;
    }

    const batchItem: IBatchItem = {
      perPack: inventory?.TrackableItem?.perPack || 0,
      inventoryId: inventory.inventoryId,
      quantity: 1,
      inventoryName: inventory.inventoryName!,
      inventoryType: inventory.inventoryType,
      inventoryExpiryDate: expiryDate,
      Images: inventory.Images,
    };

    setSearch("");
    setSelectedProducts((prev) => [...prev, batchItem]);
  };

  const handleRemoveProductFromList = (id?: string) => {
    const product = selectedProducts.find(
      (val) => val.inventoryId === id || val.variationId === id
    );
    if (!product) {
      dispatch(
        toggleSnackbarOpen({
          message: "Product doesn't exist",
          color: "INFO",
        })
      );
      return;
    }

    setSelectedProducts((prev) =>
      prev.filter((val) => {
        if (product.inventoryType === "VARIATION") {
          return val.variationId !== id;
        }

        return val.inventoryId !== id;
      })
    );
  };

  const handleSetQuantity = (val: string, id?: string) => {
    setSelectedProducts((prev) =>
      prev.map((item) => {
        return item.inventoryId === id || item.variationId === id
          ? { ...item, quantity: parseInt(val) || 0 }
          : item;
      })
    );
  };

  const handleIncQuantity = (id?: string) => {
    setSelectedProducts((prev) =>
      prev.map((item) => {
        return item.inventoryId === id || item.variationId === id
          ? { ...item, quantity: item.quantity + 1 }
          : item;
      })
    );
  };

  const handleDecQuantity = (id?: string) => {
    setSelectedProducts((prev) =>
      prev.map((item) => {
        if ((item.inventoryId === id || item.variationId === id) && item.quantity > 1) {
          return { ...item, quantity: item.quantity - 1 };
        } else {
          return item;
        }
      })
    );
  };

  if (isLoading) return <Loader />;

  return (
    <Flex width="100%" maxHeight="80vh" borderRadius="0.75rem" bg="white" direction="column">
      <Flex alignItems="center" justifyContent="space-between" margin="0 0 1em 0" width="100%">
        <Span color={Colors.primaryColor} fontSize="1.2em" fontWeight="700">
          Select Products to Add
        </Span>

        <div
          onClick={() => {
            setShowImport(false);
          }}
          style={{ cursor: "pointer" }}
        >
          <img src={cancel} alt="close" />
        </div>
      </Flex>

      <SearchContainer>
        <InputWrapper>
          <SearchInput
            placeholder="Search Product"
            width="100%"
            handleSearch={setSearch}
            borderRadius="0.625rem"
          />
        </InputWrapper>
        {data?.searchUserInventory && (
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
            {data?.searchUserInventory.map((val) => {
              return (
                <Span
                  className="product"
                  cursor="pointer"
                  color={Colors.blackLight}
                  fontSize="1em"
                  key={val.inventoryId}
                  onClick={() => handleAddProductToList(val as IBatchQty)}
                >
                  {val.inventoryName}
                </Span>
              );
            })}
          </Flex>
        )}
      </SearchContainer>

      {selectedProducts.length < 1 && (
        <Flex
          width="100%"
          direction="column"
          alignItems="center"
          justifyContent="center"
          gap="1em"
          margin="4em 0"
        >
          <img src={Search} alt="" width="6.25rem" />
          <Span color={Colors.primaryColor} fontSize="1.4em" fontWeight="700">
            Search for a Product to add
          </Span>
          <Span color={Colors.blackLight} fontSize="0.9em" width="15.625rem" textAlign="center">
            Enter the name of a product and select it to add products to a batch{" "}
          </Span>
        </Flex>
      )}

      {selectedProducts.length > 0 && (
        <>
          <Flex
            width="100%"
            justifyContent="space-between"
            alignItems="center"
            margin="0.5em 0"
            height="1.25rem"
          >
            <Span onClick={() => setSelectedProducts([])} color={Colors.offRed} cursor="pointer">
              Remove all
            </Span>
            <Span color={Colors.primaryColor}>{selectedProducts.length} Selected</Span>
          </Flex>
          <SelectedList>
            {selectedProducts.map((val, i) => {
              const id = val.inventoryType === "VARIATION" ? val.variationId : val.inventoryId;

              return (
                <Flex
                  width="100%"
                  alignItems="center"
                  justifyContent="flex-start"
                  key={i}
                  height="3.125rem"
                  borderRadius="0.75rem"
                  padding="0.5em 0.5em 0.5em 1em"
                  gap="0.5em"
                  bg={Colors.tabBg}
                  margin="0.6em 0 0 0"
                >
                  <TransparentBtn onClick={() => handleRemoveProductFromList(id)}>
                    <img src={Remove} alt="delete" />
                  </TransparentBtn>
                  <CustomCont imgHeight="80%" style={{ position: "unset" }}>
                    <img src={getImageUrl(val?.Images)} alt="" />
                  </CustomCont>
                  <Flex width="60%" direction="column" alignItems="flex-start">
                    <Span
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "100%",
                      }}
                      cursor="pointer"
                      color={Colors.primaryColor}
                      fontSize="1em"
                      fontWeight="600"
                    >
                      {val.inventoryType === "VARIATION"
                        ? `${val.inventoryName} - ${val.variationName}`
                        : val.inventoryName}
                    </Span>
                    <Span color={Colors.blackLight} fontSize="0.9em">
                      {val.inventoryType}
                    </Span>
                  </Flex>

                  <Flex
                    bg="white"
                    borderRadius="0.5rem"
                    width="20%"
                    height="98%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Input
                      type="text"
                      noBorder
                      padding="3px 0 3px 5px"
                      placeholder="Quantity"
                      value={String(val.quantity)}
                      onChange={(e) => handleSetQuantity(e.target.value, id)}
                      width="2.18rem"
                    />
                    <Flex
                      height="100%"
                      direction="column"
                      gap="2px"
                      padding="3px 0"
                      margin="0 3px 0 0"
                    >
                      <CountButton onClick={() => handleIncQuantity(id)}>
                        <img src={CountIcon} alt="" />
                      </CountButton>
                      <CountButton
                        down
                        disabled={selectedProducts.length < 1}
                        fade={val.quantity <= 1}
                        onClick={() => handleDecQuantity(id)}
                      >
                        <img src={CountIcon} alt="" />
                      </CountButton>
                    </Flex>
                  </Flex>
                </Flex>
              );
            })}
          </SelectedList>
        </>
      )}
      <Button
        label={`Continue (${selectedProducts.length} Selected)`}
        onClick={handleAddProductsToBatch}
        backgroundColor={Colors.primaryColor}
        size="lg"
        color="#fff"
        height="3.125rem"
        borderColor="transparent"
        borderRadius="0.5rem"
        borderSize="0px"
        fontSize="1rem"
        width="100%"
        margin="0.5em 0 0 0"
      />
    </Flex>
  );
};

export default ImportBatchProduct;
