import { CancelButton } from "../../sales/style";
import Cancel from "../../../assets/cancel.svg";
import Danger from "../../../assets/Danger.svg";
import { Flex } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { Colors } from "../../../GlobalStyles/theme";
import RemoveIcon from "../../../assets/removeIcon.svg";
import { Button } from "../../../components/button/Button";
import { ClippedText } from "../../onlinePresence/style.onlinePresence";
import {
  CREATE_PRODUCT_TRANSFER,
  PREVIEW_PRODUCR_TRF,
  ProductReviewAttr,
  ProductTransferAttr,
} from "../../../schema/productTransfer.schema";
import { SelectedTrfProdAttr } from "./newTrabsfer";
import { useMutation, useQuery } from "@apollo/client";
import { modifySelectedProducts } from "../../../utils/helper.utils";
import { useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import { isLoading } from "../../../app/slices/status";
import { useDispatch } from "react-redux";
import { toggleSnackbarOpen } from "../../../app/slices/snacbar";
import Loader from "../../../components/loader";
import NoInternet from "../../../assets/NoInternet.svg";

interface InvetoryAttr {
  inventoryId: string;
  inventoryName: string;
  variationId: string;
  variationName: string;
}

interface ReviewProps {
  setShowModal: Dispatch<SetStateAction<boolean>>;
  selectedProducts: SelectedTrfProdAttr[];
  setSelectedProducts: Dispatch<SetStateAction<SelectedTrfProdAttr[]>>;
  currentShopId: string;
  currentId: string;
}

const ReviewTrf: FC<ReviewProps> = ({
  setShowModal,
  currentId,
  currentShopId,
  selectedProducts,
  setSelectedProducts,
}) => {
  const currentShop = useAppSelector(getCurrentShop);

  const {
    data: reviewData,
    loading,
    error,
  } = useQuery<ProductReviewAttr>(PREVIEW_PRODUCR_TRF, {
    variables: {
      fromShopId: currentShop.shopId,
      toShopId: currentId,
      inventoryIdsAndQuantities: modifySelectedProducts(selectedProducts),
    },
  });

  const data = reviewData?.previewInventoryTransfers;
  const fromInventories: InvetoryAttr[] = data?.fromShop?.inventories as InvetoryAttr[];
  const toInventories: InvetoryAttr[] = data?.toShop?.inventories as InvetoryAttr[];
  const [mergedInventories, setMergedInventories] = useState<SelectedTrfProdAttr[]>([]);
  const dispatch = useDispatch();

  useEffect(() => {
    setMergedInventories([]);
    for (let i = 0; i < fromInventories?.length; i++) {
      const toItem = i < toInventories.length ? toInventories[i] : null;
      setMergedInventories((prevMergedInventories) => [
        ...prevMergedInventories,
        {
          inventoryName: fromInventories[i].inventoryName as string,
          inventoryId: fromInventories[i].inventoryId as string,
          quantity: 0,
          inventoryType: "",
          fromInventoryId: fromInventories[i].inventoryId as string,
          fromVariationId: fromInventories[i].variationId as string,
          toInventoryId: toItem ? toItem.inventoryId : null,
          toVariationId: toItem ? toItem.variationId : null,
          toInventoryName: toItem ? toItem.inventoryName : null,
        },
      ]);
    }
  }, [data]);

  const [createInventoryTransfer] = useMutation<ProductTransferAttr>(CREATE_PRODUCT_TRANSFER, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const handleCreateInventoryTransfer = () => {
    dispatch(isLoading(true));
    const mapFromArray2 = new Map(mergedInventories.map((item) => [item.fromInventoryId, item]));
    const mergedArray = selectedProducts.map((item1) => {
      const item2 = mapFromArray2.get(item1.fromInventoryId);
      if (item2) {
        return {
          ...item1,
          toInventoryId: item2.toInventoryId,
          toVariationId: item2.toVariationId,
          fromInventoryId: item2.inventoryId,
          fromVariationId: item2.fromVariationId ?? null,
        };
      }
      return item1;
    });

    createInventoryTransfer({
      variables: {
        fromShopId: currentShopId,
        toShopId: currentId,
        inventoryIdsAndQuantities: modifySelectedProducts(mergedArray),
      },
    })
      .then(() => {
        dispatch(isLoading(false));
        dispatch(
          toggleSnackbarOpen({ message: "Product Transfer Created Succesfully", color: "SUCCESS" })
        );
        setShowModal(false);
        setSelectedProducts([]);
      })
      .catch((e) => {
        dispatch(isLoading(false));
        dispatch(
          toggleSnackbarOpen({ message: e.message || e.graphQlErrors[0].message, color: "DANGER" })
        );
      });
  };

  const removeProductFromList = (id: string) => {
    const updatedInventories = mergedInventories?.filter(
      (product) => product.fromInventoryId !== id
    );
    setMergedInventories(updatedInventories);

    const newProd = selectedProducts.filter((product) => product.fromInventoryId !== id);
    setSelectedProducts(newProd);
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
            <h3>Review Transfer</h3>
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
        {loading ? (
          <Flex
            direction="column"
            width="100%"
            padding="0 1rem"
            height="100%"
            alignItems="center"
            justifyContent="center"
          >
            <Loader noBg />
          </Flex>
        ) : error ? (
          <Flex
            direction="column"
            width="90%"
            padding="0 1rem"
            height="90%"
            alignItems="center"
            justifyContent="center"
          >
            <Flex margin="0.625rem 0px" width="40%">
              <img src={NoInternet} alt="" />
            </Flex>
            <div style={{ width: "80%", textAlign: "center" }}>
              <h3>Something went wrong!</h3>
              <p>{error.message}</p>
            </div>
          </Flex>
        ) : (
          <>
            <Flex padding="0 0.9rem" direction="column">
              <Flex
                width="100%"
                border={`1px solid ${Colors.grey}`}
                margin="1.5rem auto"
                fontSize="0.625rem"
                padding="0.5rem"
                borderRadius="0.5rem"
                bg={Colors.lightBg}
                color={Colors.blackLight}
              >
                <img src={Danger} alt="warning, info icon" />
                <p>
                  <span style={{ color: Colors.red }}>Note:</span> You are about to transfer a the
                  following products quantity from one shop to another. You will need to accept or
                  reject this products on the other shop.
                </p>
              </Flex>
            </Flex>

            <Flex
              bg={Colors.primaryColor}
              height="2.875rem"
              alignItems="center"
              justifyContent="space-between"
              color="white"
              padding="0.2rem 1rem"
              fontSize="0.75rem"
            >
              <div style={{ width: "45%" }}>
                <p>From</p>
                <p style={{ fontWeight: "600" }}>{data?.fromShop?.shopName}</p>
              </div>
              <div style={{ width: "45%" }}>
                <p>to</p>
                <p style={{ fontWeight: "600" }}>{data?.toShop?.shopName}</p>
              </div>
            </Flex>

            <Flex
              position="relative"
              alignItems="center"
              justifyContent="space-between"
              color="white"
              padding="0.2rem 1rem 1rem 1rem"
              margin="1rem 0"
              fontSize="0.75rem"
            >
              <Flex direction="column" width="100%">
                {mergedInventories.length > 0 ? (
                  <>
                    {mergedInventories?.map((prod) => (
                      <Flex width="100%" key={prod.inventoryId}>
                        <Flex width="100%" direction="column">
                          <Flex width="100%" gap="1rem">
                            <Flex
                              justifyContent="space-between"
                              margin="0.4rem 0"
                              bg={Colors.lightBg}
                              width="45%"
                              padding="0.7rem 0.9rem"
                              borderRadius="0.5rem"
                            >
                              <Flex gap="0 0.5rem" alignItems="center" color={Colors.blackLight}>
                                <div
                                  title="Click to remove from list"
                                  onClick={() => removeProductFromList(prod?.inventoryId as string)}
                                  style={{ width: "1.5rem", cursor: "pointer" }}
                                >
                                  <img src={RemoveIcon} width="inherit" alt="removeIcon" />
                                </div>
                                <p style={{ fontWeight: "400" }}>
                                  <ClippedText maxWidth="5rem">{prod?.inventoryName}</ClippedText>
                                </p>
                              </Flex>
                            </Flex>
                            <Flex
                              justifyContent="space-between"
                              margin="0.4rem 0"
                              bg={Colors.lightBg}
                              width="45%"
                              padding="0.7rem 0.9rem"
                              borderRadius="0.5rem"
                            >
                              <Flex gap="0 0.5rem" alignItems="center" color={Colors.blackLight}>
                                <p style={{ fontWeight: "400" }}>
                                  <ClippedText maxWidth="5rem">
                                    {prod?.toInventoryName ? prod.toInventoryName : "No Match"}
                                  </ClippedText>
                                </p>
                              </Flex>
                            </Flex>
                          </Flex>
                          {prod?.toInventoryName ? null : (
                            <Flex
                              width="100%"
                              gap="0.2rem"
                              alignItems="center"
                              color={Colors.red}
                              fontSize="0.6rem"
                            >
                              <img src={Danger} alt="warning, info icon" />
                              <p>
                                Can't find a match for this product on the destination shop. A new
                                Product will be created in the shop.
                              </p>
                            </Flex>
                          )}
                        </Flex>
                      </Flex>
                    ))}
                  </>
                ) : (
                  <Flex>No products selected, Select products to review transfer</Flex>
                )}
              </Flex>
            </Flex>

            <Flex
              justifyContent="space-around"
              position="absolute"
              width="100%"
              style={{ bottom: "0.5rem" }}
            >
              <Button
                label="Cancel Transfer"
                backgroundColor={Colors.red}
                height="2rem"
                width="40%"
                color="white"
                borderRadius="0.5rem"
                onClick={() => {
                  setSelectedProducts([]);
                  setShowModal(false);
                }}
              />
              <Button
                label="Confirm Transfer"
                backgroundColor={Colors.primaryColor}
                height="2rem"
                width="40%"
                color="white"
                borderRadius="0.5rem"
                onClick={() => handleCreateInventoryTransfer()}
              />
            </Flex>
          </>
        )}
      </Flex>
    </>
  );
};

export default ReviewTrf;
