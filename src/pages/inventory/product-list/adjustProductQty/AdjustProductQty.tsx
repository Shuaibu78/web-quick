/* eslint-disable indent */
/* eslint-disable comma-dangle */
import React, { useEffect, useState } from "react";
import { Flex, Span } from "../../../../GlobalStyles/CustomizableGlobal.style";
import { Colors, FontSizes } from "../../../../GlobalStyles/theme";
import { Header, Input } from "./style";
import Cancel from "../../../../assets/cancel.svg";
import { formatName } from "../../../../utils/formatValues";
import CustomDropdown from "../../../../components/custom-dropdown/custom-dropdown";
import dropIcon2 from "../../../../assets/dropIcon2.svg";
import toggleOff from "../../../../assets/toggleOff.svg";
import toggleOn from "../../../../assets/toggleOn.svg";
import { ToggleButton } from "../../../staffs/style";
import { Divider } from "../../../../components/divider/Divider";
import { Button } from "../../../../components/button/Button";
import { ButtonContainer } from "../../../../components/ProductDetails/style";
import { useAppSelector, useAppDispatch } from "../../../../app/hooks";
import { ADJUST_STOCK } from "../../../../schema/stockAdjustment.schema";
import { useMutation } from "@apollo/client";
import { isLoading } from "../../../../app/slices/status";
import { formatAmountIntl } from "../../../../helper/format";
import { toggleSnackbarOpen } from "../../../../app/slices/snacbar";
import { getCurrentShop } from "../../../../app/slices/shops";
import { getExpiryDate } from "../../../../utils/getProductExpiryDate";
import moment from "moment";

interface IProps {
  setAdjustModalPopup: React.Dispatch<React.SetStateAction<boolean>>;
  refetch?: Function;
  handleRefetch?: Function;
}

const { lightBg, white, blackLight, primaryColor, lightBlue } = Colors;
const { titleFont, detailsFontSize } = FontSizes;

interface IUpdate {
  newPrice: number;
  newExpiry: string;
  newPurchased: number;
  comment: string;
}

const AdjustProductQty: React.FC<IProps> = ({ setAdjustModalPopup, refetch, handleRefetch }) => {
  const dispatch = useAppDispatch();
  const currentShop = useAppSelector(getCurrentShop);
  const { singleInventory } = useAppSelector((state) => state);

  const [reason, setReason] = useState<number>(0);
  const [unitType, setUnitType] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [updateSellingPrice, setUpdateSellingPrice] = useState<boolean>(false);
  const [updateExpiryDate, setUpdateExpiryDate] = useState<boolean>(false);
  const [updatePurchasedPrice, setUpdatePurchasedPrice] = useState<boolean>(false);
  const [addComment, setAddComment] = useState<boolean>(false);
  const [previousQuantity, setPreviousQuantity] = useState<number>(0);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [previousPurchasePrice, setPreviousPurchasePrice] = useState<number>(0);
  const [previousSellingPrice, setPreviousSellingPrice] = useState<number>(0);
  const [variationOpitons, setVariationOptions] = useState<string[]>([]);
  const [singleVariantId, setSingleVariantId] = useState<string>("");

  const reasonOptions = ["RESTOCK", "RETURN", "LOST", "DAMAGE"];
  const options = singleInventory?.inventoryType === "PIECES" ? ["PIECES"] : ["PACK"];
  const typeOptions =
    singleInventory?.inventoryType !== "PIECES_AND_PACK" ? options : ["PIECES", "PACK"];
  const type = singleInventory?.inventoryType;

  function getOptions() {
    if (type === "PIECES_AND_PACK") {
      return ["PIECES", "PACK"];
    } else if (type === "VARIATION") {
      return variationOpitons;
    } else if (type === "PIECES") {
      return ["PIECES"];
    } else {
      return ["PACK"];
    }
  }

  useEffect(() => {
    const variations: any[] = [];
    singleInventory.Variations?.forEach((entry) => {
      variations.push(entry.variationName);
    });
    setVariationOptions(variations);
  }, [singleInventory, unitType]);

  const [createStockAdjustment] = useMutation<{ stockAdjustment: any }>(ADJUST_STOCK, {
    onQueryUpdated(observableQuery) {
      return observableQuery.refetch();
    },
  });

  const getPrevVariationQuantity = (variantId: string) => {
    const inventoryQty = singleInventory?.InventoryQuantity?.filter(
      (qty) => qty?.variationId === variantId
    ).reduce((prevValue, inventoryQuantity) => prevValue + inventoryQuantity.quantity!, 0);
    return inventoryQty ?? 0;
  };

  const getVariationCostAndPrice = (variantId: string) => {
    const variation = singleInventory.Variations?.find((qty) => qty?.variationId === variantId);
    return { cost: variation?.cost, price: variation?.price };
  };

  const [newUpdate, setNewUpdate] = useState<IUpdate>({
    newPrice: 0,
    newExpiry: "",
    newPurchased: 0,
    comment: "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    const array = ["newPrice", "newPurchased"];

    const getValue = () => {
      return array.includes(name) ? Number(value) : value;
    };

    setNewUpdate((prevNewUpdate) => ({
      ...prevNewUpdate,
      [name]: getValue(),
    }));
  }

  const handleSetReason = (val: number) => {
    setReason(val);
  };
  const handleSetUnitType = (val: number) => {
    setUnitType(val);
  };

  const handleSetQuantity = (val: string) => {
    setQuantity(parseInt(val) || 0);
  };

  const handleSubmit = () => {
    const costPrice =
      Number(newUpdate?.newPurchased) > 0 ? Number(newUpdate?.newPurchased) : previousPurchasePrice;
    const sellingPrice =
      Number(newUpdate?.newPrice) > 0 ? Number(newUpdate?.newPrice) : previousSellingPrice;

    createStockAdjustment({
      variables: {
        shopId: singleInventory?.shopId,
        inventoryId: singleInventory?.inventoryId,
        quantity: Number(quantity),
        costPrice: Number(costPrice),
        sellingPrice: Number(sellingPrice),
        note: addComment ? newUpdate?.comment : "",
        isPack:
          singleInventory?.inventoryType === "VARIATION" ? false : typeOptions[unitType] === "PACK",
        inventoryExpiryDate: updateExpiryDate ? new Date(newUpdate?.newExpiry) : null,
        reason: reasonOptions[reason],
        variationId: singleVariantId,
      },
    })
      .then((res) => {
        if (res.data) {
          dispatch(isLoading(false));
          dispatch(toggleSnackbarOpen("Successful"));
          setAdjustModalPopup(false);
          refetch?.();
          handleRefetch?.();
        }
      })
      .catch((error) => {
        dispatch(isLoading(false));
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      });
  };

  useEffect(() => {
    const variant = singleInventory?.Variations ? singleInventory.Variations[unitType] : undefined;
    setSingleVariantId(variant?.variationId!);

    const previousVarQty = getPrevVariationQuantity(variant?.variationId!);
    const newVarQty =
      reasonOptions[reason] === "RESTOCK" ? previousVarQty + quantity : previousVarQty - quantity;
    const variationCostPrice = getVariationCostAndPrice(variant?.variationId!).cost!;
    const variationSellingPrice = getVariationCostAndPrice(variant?.variationId!).price!;

    const previousQty =
      typeOptions[unitType] === "PACK"
        ? singleInventory?.quantityInPacks
        : singleInventory?.quantityInPieces || 0;
    const newQty =
      reasonOptions[reason] === "RESTOCK"
        ? previousQty! + Number(quantity)
        : previousQty! - quantity;

    const PreviousPurchasePrice =
      typeOptions[unitType] === "PACK"
        ? singleInventory?.TrackableItem?.unitPackCostPrice
        : singleInventory?.TrackableItem?.unitPiecesCostPrice || 0;
    const PreviousSellingPrice =
      typeOptions[unitType] === "PACK"
        ? singleInventory?.TrackableItem?.packPrice
        : singleInventory?.TrackableItem?.unitPrice || 0;

    setPreviousQuantity(type === "VARIATION" ? previousVarQty : (previousQty as number));
    setNewQuantity(type === "VARIATION" ? newVarQty : newQty);
    setPreviousPurchasePrice(
      type === "VARIATION" ? variationCostPrice : (PreviousPurchasePrice as number)
    );
    setPreviousSellingPrice(
      type === "VARIATION" ? variationSellingPrice : (PreviousSellingPrice as number)
    );
    setNewUpdate({
      ...newUpdate,
      newPrice: type === "VARIATION" ? variationSellingPrice : (PreviousSellingPrice as number),
      newPurchased: type === "VARIATION" ? variationCostPrice : (PreviousPurchasePrice as number),
    });
  }, [singleInventory, unitType]);

  useEffect(() => {
    const variant = singleInventory?.Variations ? singleInventory.Variations[unitType] : undefined;
    setSingleVariantId(variant?.variationId!);

    const previousVarQty = getPrevVariationQuantity(variant?.variationId!);
    const newVarQty =
      reasonOptions[reason] === "RESTOCK" ? previousVarQty + quantity : previousVarQty - quantity;

    const previousQty =
      typeOptions[unitType] === "PACK"
        ? singleInventory?.quantityInPacks
        : singleInventory?.quantityInPieces || 0;
    const newQty =
      reasonOptions[reason] === "RESTOCK"
        ? previousQty! + Number(quantity)
        : previousQty! - quantity;

    setPreviousQuantity(type === "VARIATION" ? previousVarQty : (previousQty as number));
    setNewQuantity(type === "VARIATION" ? newVarQty : newQty);
  }, [quantity, unitType]);

  useEffect(() => {
    if (currentShop.isExpiryDateEnabled) {
      const expiryDate = getExpiryDate(singleInventory.Supplies);

      if (expiryDate) {
        setUpdateExpiryDate(true);
        const formattedDate = moment(expiryDate).format("YYYY-MM-DD")!;
        setNewUpdate((prevUpdate) => ({
          ...prevUpdate,
          newExpiry: formattedDate,
        }));
      }
    }
  }, []);

  return (
    <Flex width="auto" overflow="hidden" alignItems="center" zIndex={99}>
      <Flex
        padding="1.25rem"
        borderRadius="0.75rem 0 0 0.75rem"
        bg={lightBg}
        direction="column"
        height="430px"
        width="28rem"
      >
        <Header>
          <img src={Cancel} alt="cancel" onClick={() => setAdjustModalPopup(false)} />{" "}
          <Span color={blackLight} fontSize={titleFont} fontWeight="600">
            Adjust Product
          </Span>
        </Header>
        <Span margin="1rem 0 1rem 0">
          Product: <Span margin="0 0 0 0.1rem">{formatName(singleInventory?.inventoryName)}</Span>
        </Span>
        <Flex justifyContent="space-between" alignItems="center" gap="0.625rem">
          <Flex direction="column" gap="0.625rem">
            <Span fontSize="0.875rem">Reason for Adjustment</Span>
            <CustomDropdown
              width="9.375rem"
              height="37px"
              fontSize="0.875rem"
              borderRadius="0.75rem"
              containerColor="#fff"
              color="#8196B3"
              selected={reason}
              setValue={handleSetReason}
              options={reasonOptions}
              dropdownIcon={dropIcon2}
              margin="0px"
            />
          </Flex>
          <Flex direction="column" gap="0.625rem" justifyContent="space-between" height="100%">
            <Span fontSize="0.875rem">{type === "VARIATION" ? "Variants" : "Unit Type"}</Span>
            {singleInventory?.inventoryType === "PIECES" ||
            singleInventory?.inventoryType === "PACK" ? (
              <Span
                style={{
                  height: "37px",
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
              <CustomDropdown
                width="9.375rem"
                height="37px"
                fontSize="0.875rem"
                borderRadius="0.75rem"
                containerColor="#fff"
                color="#8196B3"
                selected={unitType}
                setValue={handleSetUnitType}
                options={getOptions()}
                dropdownIcon={dropIcon2}
              />
            )}
          </Flex>
          <Flex direction="column" gap="0.625rem">
            <Span fontSize="0.875rem">Quantity</Span>

            <Input
              type="text"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => handleSetQuantity(e.target.value)}
              width="6.25rem"
            />
          </Flex>
        </Flex>
        <Divider />
        <Flex direction="column" margin="0px 0.75rem 0px">
          <Flex
            alignItems="center"
            justifyContent="space-between"
            opacity={singleInventory?.isVariation}
          >
            <ToggleButton
              cursor={singleInventory?.isVariation ? "not-allowed" : "pointer"}
              disabled={singleInventory?.isVariation}
              onClick={() => setUpdateSellingPrice(!updateSellingPrice)}
            >
              <img src={updateSellingPrice ? toggleOn : toggleOff} alt="" />
              &nbsp;
              <span>Update Selling Price</span>
            </ToggleButton>

            {updateSellingPrice && (
              <Input
                type="string"
                name="newPrice"
                value={newUpdate.newPrice}
                onChange={handleChange}
                width="9.375rem"
                readOnly={singleInventory?.inventoryType === "VARIATION"}
              />
            )}
          </Flex>
          <Flex
            alignItems="center"
            justifyContent="space-between"
            opacity={singleInventory?.isVariation}
          >
            <ToggleButton
              cursor={singleInventory?.isVariation ? "not-allowed" : "pointer"}
              disabled={singleInventory?.isVariation}
              onClick={() => setUpdatePurchasedPrice(!updatePurchasedPrice)}
            >
              <img src={updatePurchasedPrice ? toggleOn : toggleOff} alt="" />
              &nbsp;
              <span>Update Purchased Price</span>
            </ToggleButton>
            {updatePurchasedPrice && (
              <Input
                type="text"
                name="newPurchased"
                value={newUpdate.newPurchased}
                onChange={handleChange}
                width="9.375rem"
                readOnly={singleInventory?.inventoryType === "VARIATION"}
              />
            )}
          </Flex>
          {currentShop.isExpiryDateEnabled && (
            <Flex alignItems="center" justifyContent="space-between">
              <ToggleButton onClick={() => setUpdateExpiryDate(!updateExpiryDate)}>
                <img src={updateExpiryDate ? toggleOn : toggleOff} alt="" />
                &nbsp;
                <span>Update Expiry Date</span>
              </ToggleButton>
              {/* {updateExpiryDate && <CustomDate width="9.375rem" height="1.5625rem" />} */}
              {updateExpiryDate && (
                <input
                  style={{
                    width: "9.375rem",
                    height: "2.1875rem",
                    borderRadius: "0.75rem",
                    background: "white",
                    border: `1px solid ${Colors.blackLight}`,
                    padding: "0 0.625rem",
                  }}
                  type="date"
                  name="newExpiry"
                  value={newUpdate.newExpiry}
                  onChange={handleChange}
                />
              )}
            </Flex>
          )}
          <Flex alignItems="center" justifyContent="space-between">
            <ToggleButton onClick={() => setAddComment(!addComment)}>
              <img src={addComment ? toggleOn : toggleOff} alt="" />
              &nbsp;
              <span>Add Comment</span>
            </ToggleButton>
            {addComment && (
              <Input
                type="text"
                placeholder="Comment (Optional)"
                name="comment"
                width="12.5rem"
                value={newUpdate.comment}
                onChange={handleChange}
              />
            )}
          </Flex>
          <Flex />
        </Flex>
      </Flex>

      <Flex
        padding="1.25rem"
        bg={white}
        direction="column"
        borderRadius=" 0 0.75rem 0.75rem 0"
        height="430px"
        width="28rem"
        justifyContent="space-between"
      >
        <Flex direction="column" justifyContent="flex-start">
          <Header>
            <Span color={blackLight} fontSize={titleFont} fontWeight="600">
              Review and Save
            </Span>
          </Header>
          {/* <Flex gap="1.25rem" justifyContent="space-between" alignItems="center" direction="column">
            <img src={Pie} alt="pie_empty_card" />
            <Span fontSize="24px" fontWeight="700" color={blackLight} margin="1rem 0 0 0 ">
              Review Adjustments
            </Span>
            <Span textAlign="center" fontSize="1rem" fontWeight="700" color={lightBlue}>
              You have not made any adjustment. Adjustment made will appear here.
            </Span>
          </Flex> */}

          <Flex
            gap="1.25rem"
            justifyContent="space-between"
            margin="1.5rem 0 0 0"
            fontSize="0.75rem"
          >
            <Span color={lightBlue} fontSize={detailsFontSize}>
              Current Quantity:{"  "}
              <Span color={primaryColor} fontSize={detailsFontSize}>
                {previousQuantity}
              </Span>
            </Span>
            <Span color={lightBlue} fontSize={detailsFontSize}>
              {reasonOptions[reason] === "RESTOCK" ? "Added Quantity" : "Removed Quantity"}
              {":  "}
              <Span color={primaryColor} fontSize={detailsFontSize}>
                {quantity}
              </Span>
            </Span>
            <Span color={lightBlue} fontSize={detailsFontSize}>
              New Quantity:{"  "}
              <Span color={primaryColor} fontSize={detailsFontSize}>
                {newQuantity}
              </Span>
            </Span>
          </Flex>
          <Divider />
          {updatePurchasedPrice && (
            <>
              <Flex gap="1.25rem" justifyContent="space-between">
                <Span color={lightBlue} fontSize={detailsFontSize}>
                  Current Purchase Price{"  "}
                  <Span color={primaryColor} fontSize={detailsFontSize}>
                    {formatAmountIntl(undefined, previousPurchasePrice as number)}
                  </Span>
                </Span>
                <Span color={lightBlue} fontSize={detailsFontSize}>
                  New Purchased Price{"  "}
                  <Span color={primaryColor} fontSize={detailsFontSize}>
                    {formatAmountIntl(undefined, newUpdate?.newPurchased)}
                  </Span>
                </Span>
              </Flex>
              <Divider />
            </>
          )}
          {updateSellingPrice && (
            <>
              <Flex gap="1.25rem" justifyContent="space-between">
                <Span color={lightBlue} fontSize={detailsFontSize}>
                  Current Selling Price{"  "}
                  <Span color={primaryColor} fontSize={detailsFontSize}>
                    {formatAmountIntl(undefined, previousSellingPrice as number)}
                  </Span>
                </Span>
                <Span color={lightBlue} fontSize={detailsFontSize}>
                  New Selling Price{"  "}
                  <Span color={primaryColor} fontSize={detailsFontSize}>
                    {formatAmountIntl(undefined, newUpdate?.newPrice)}
                  </Span>
                </Span>
              </Flex>
              <Divider />
            </>
          )}
        </Flex>

        <ButtonContainer marginBottom="0px">
          <Button
            type="button"
            size="lg"
            label="Back to Products"
            color={white}
            backgroundColor={blackLight}
            borderSize="0px"
            fontSize="1rem"
            borderRadius="0.625rem"
            width="170px"
            onClick={() => setAdjustModalPopup(false)}
          />
          <Button
            type="button"
            size="lg"
            label="Adjust"
            onClick={handleSubmit}
            color={white}
            backgroundColor={primaryColor}
            borderSize="0px"
            fontSize="1rem"
            borderRadius="0.625rem"
            width="9.375rem"
          />
        </ButtonContainer>
      </Flex>
    </Flex>
  );
};

export default AdjustProductQty;
