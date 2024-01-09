/* eslint-disable indent */
import { IImage } from "../interfaces/image.interface";
import { IInventory } from "../interfaces/inventory.interface";
import { PushNotificationPayload } from "../interfaces/shop.interface";
import { formatAmountIntl } from "./format";
import { rpcClient } from "./rpcClient";

interface IUpload {
  files: any;
  key?: "userId" | "inventoryId" | "shopId";
  id?: string;
  shopId?: string;
}

export type InventoryCostPrice = number | { pieces: number; pack: number };

export type InventoryType = "PIECES" | "PACK" | "PIECES_AND_PACK" | "VARIATION" | "NON_TRACKABLE";

export const getInventoryType = (inventory: IInventory): InventoryType => {
  const { TrackableItem, isVariation } = inventory;

  if (isVariation) return "VARIATION";

  if (!inventory.trackable) return "NON_TRACKABLE";

  if (TrackableItem) {
    if (TrackableItem.perPack && !TrackableItem.unitPrice && !TrackableItem.unitPiecesCostPrice) {
      return "PACK";
    }

    if (TrackableItem.perPack) return "PIECES_AND_PACK";
  }

  return "PIECES";
};

export const getInventoryPrice = (
  inventory: IInventory,
  variationIndex?: number,
  isPackAndPieces: boolean | undefined = undefined
): any => {
  const inventoryType = inventory?.inventoryType;

  let price: number = 0;
  const { trackable, isVariation, Variations, TrackableItem, NonTrackableItem } = inventory;

  if (inventoryType === "PIECES_AND_PACK") {
    const pieces: number = TrackableItem?.unitPrice!;
    const pack: number = TrackableItem?.packPrice!;
    return { pieces, pack };
  }

  if (trackable) {
    if (isVariation) {
      price = Variations![variationIndex!]?.price ?? 0;
    } else {
      price =
        inventoryType !== "PIECES" ? TrackableItem?.packPrice || 0 : TrackableItem?.unitPrice || 0;
    }
  } else {
    price = NonTrackableItem?.sellingPrice ?? 0;
  }

  return price;
};

export const getInventoryCostPrice = (
  inventory: IInventory,
  variationId?: string,
  isPackAndPieces: boolean | undefined = undefined
): any => {
  const inventoryType = inventory?.inventoryType;

  if (inventoryType === "VARIATION" && variationId) {
    const cost = Number(
      inventory?.Variations?.filter((variation) => variation.variationId === variationId)?.[0]
        .cost || 0
    );
    return cost;
  }

  if (inventoryType === "PIECES" || inventoryType === "PACK") {
    const trackableItem = inventory.TrackableItem;
    return inventoryType === "PIECES"
      ? trackableItem?.unitPiecesCostPrice!
      : trackableItem?.unitPackCostPrice!;
  }

  if (inventoryType === "NON_TRACKABLE") {
    return inventory.NonTrackableItem?.costPrice!;
  }

  if (inventoryType === "PIECES_AND_PACK") {
    const trackableItem = inventory.TrackableItem;
    const pieces: number = trackableItem?.unitPiecesCostPrice!;
    const pack: number = trackableItem?.unitPackCostPrice!;
    return { pieces, pack };
  }

  return null;
};

export const getVariationQuantity = (inventory: IInventory, variationId: string) => {
  const inventoryQty = inventory?.InventoryQuantity?.filter(
    (qty) => qty?.variationId === variationId
  ).reduce((prevValue, inventoryQuantity) => prevValue + inventoryQuantity.quantity!, 0);
  return inventoryQty ?? 0;
};

export const getTotalVariationQuantity = (inventory: IInventory, inventoryId: string) => {
  const inventoryQty = inventory?.InventoryQuantity?.filter(
    (qty) => qty?.inventoryId === inventoryId && qty?.variationId !== null
  ).reduce((prevValue, inventoryQuantity) => prevValue + inventoryQuantity.quantity!, 0);
  return inventoryQty ?? 0;
};

export const getInventoryQuantity = (inventory: IInventory) => {
  // console.log(inventory.inventoryName, inventory);
  const result = inventory?.isVariation
    ? `${getTotalVariationQuantity(inventory, inventory?.inventoryId!)} items`
    : getInventoryType(inventory) === "PIECES_AND_PACK"
    ? `${inventory?.quantityInPieces} pieces | ${inventory?.quantityInPacks} pack`
    : inventory?.inventoryType !== "PIECES"
    ? `${inventory?.quantityInPacks} packs`
    : `${inventory?.quantityInPieces} items`;

  const pattern = /^0 (items|packs)|null items|0 pieces \| 0 pack$/;
  if (pattern.test(result)) return "Out of Stock";
  return result;
};
export const getQuantity = (inventory: IInventory): any => {
  const result = inventory?.isVariation
    ? getTotalVariationQuantity(inventory, inventory?.inventoryId!)
    : getInventoryType(inventory) === "PIECES_AND_PACK"
    ? { pieces: inventory?.quantityInPieces, pack: inventory?.quantityInPacks }
    : inventory?.inventoryType !== "PIECES"
    ? inventory?.quantityInPacks
    : inventory?.quantityInPieces;

  return result;
};

export const getVariantQuantity = (variationId: string, inventory: IInventory) => {
  const inventoryQty = inventory?.InventoryQuantity?.filter(
    (qty) => qty?.variationId === variationId
  ).reduce((prevValue, inventoryQuantity) => prevValue + inventoryQuantity.quantity!, 0);
  return inventoryQty ?? 0;
};

export const getProductCostPrice = (inventory: IInventory, type?: "pieces" | "pack") => {
  const costPrice = getInventoryCostPrice(inventory, undefined, true);
  let pieces = 0;
  let pack = 0;

  if (typeof costPrice === "number") {
    // costPrice is a number
  } else if (costPrice !== null) {
    // costPrice is an object with "pieces" and "pack" properties
    pieces = costPrice?.pieces ?? 0;
    pack = costPrice?.pack ?? 0;
  }
  return inventory?.isVariation
    ? "--"
    : getInventoryType(inventory) === "PIECES_AND_PACK"
    ? `${formatAmountIntl(undefined, Number(pieces))}(${formatAmountIntl(undefined, Number(pack))})`
    : formatAmountIntl(undefined, Number(getInventoryCostPrice(inventory, undefined)));
};

export const getProductCostPriceUnformatted = (inventory: IInventory, type?: "pieces" | "pack") => {
  const costPrice = getInventoryCostPrice(inventory, undefined, true);
  let pieces = 0;
  let pack = 0;

  if (typeof costPrice === "number") {
    // costPrice is a number
  } else if (costPrice !== null) {
    // costPrice is an object with "pieces" and "pack" properties
    pieces = costPrice?.pieces ?? 0;
    pack = costPrice?.pack ?? 0;
  }
  return inventory?.isVariation
    ? "--"
    : getInventoryType(inventory) === "PIECES_AND_PACK"
    ? `${Number(pieces)}(${Number(pack)})`
    : Number(getInventoryCostPrice(inventory, undefined));
};

export const getSellingPricePP = (inventory: IInventory) => {
  const costPrice = getInventoryPrice(inventory);
  let pieces = 0;
  let pack = 0;

  if (typeof costPrice === "number") {
    // costPrice is a number
  } else if (costPrice !== null) {
    // costPrice is an object with "pieces" and "pack" properties
    pieces = costPrice.pieces;
    pack = costPrice.pack;
  }
  return getInventoryType(inventory) === "PIECES_AND_PACK" ? { pieces: pieces, pack: pack } : null;
};

export const getProductSellingPrice = (inventory: IInventory, type?: "pieces" | "pack") => {
  const costPrice = getInventoryPrice(inventory);
  let pieces = 0;
  let pack = 0;

  if (typeof costPrice === "number") {
    // costPrice is a number
  } else if (costPrice !== null) {
    // costPrice is an object with "pieces" and "pack" properties
    pieces = costPrice.pieces ?? 0;
    pack = costPrice.pack ?? 0;
  }
  return inventory?.isVariation
    ? "--"
    : getInventoryType(inventory) === "PIECES_AND_PACK"
    ? `${formatAmountIntl(undefined, Number(pieces))}(${formatAmountIntl(undefined, Number(pack))})`
    : formatAmountIntl(undefined, Number(getInventoryPrice(inventory)));
};

export const getProductSellingPriceUnformatted = (
  inventory: IInventory,
  type?: "pieces" | "pack"
) => {
  const costPrice = getInventoryPrice(inventory);
  let pieces = 0;
  let pack = 0;

  if (typeof costPrice === "number") {
    // costPrice is a number
  } else if (costPrice !== null) {
    // costPrice is an object with "pieces" and "pack" properties
    pieces = costPrice.pieces ?? 0;
    pack = costPrice.pack ?? 0;
  }
  return inventory?.isVariation
    ? "--"
    : getInventoryType(inventory) === "PIECES_AND_PACK"
    ? `${Number(pieces)}(${Number(pack)})`
    : Number(getInventoryPrice(inventory));
};

const getTotalPriceByVariation = (variationId: string, inventory: IInventory): number => {
  const variationPrice = inventory?.Variations?.filter(
    (variation) => variation.variationId === variationId
  )[0].price;
  return variationPrice ?? 0;
};

const getVariationValue = (inventory: IInventory) => {
  let variationValue = 0;
  const variations = inventory?.Variations;
  if (variations) {
    for (let i = 0; i < variations?.length!; i++) {
      const price = getTotalPriceByVariation(variations[i]?.variationId!, inventory);

      const quantity = getVariantQuantity(variations[i]?.variationId!, inventory);

      variationValue += price * quantity;
    }
  }

  return variationValue;
};

export const productValue = (inventory: IInventory) => {
  const packPrice = inventory?.TrackableItem?.packPrice || 0;
  const unitPrice = inventory?.TrackableItem?.unitPrice || 0;
  const quantityInPacks = inventory?.quantityInPacks || 0;
  const quantityInPieces = inventory?.quantityInPieces || 0;

  if (inventory?.inventoryType === "NON_TRACKABLE") {
    return formatAmountIntl(undefined, Number(inventory?.NonTrackableItem?.sellingPrice));
  }
  return !inventory?.isVariation
    ? formatAmountIntl(
        undefined,

        Number(packPrice * quantityInPacks + unitPrice * quantityInPieces)
      )
    : formatAmountIntl(undefined, Number(getVariationValue(inventory)));
};

export const handleNewPushNotificationMessage = async (
  { title, message, data = {} }: PushNotificationPayload,
  currentShopId: string,
  navigate: any,
  maximumRetry = 10
) => {
  if (data.shopId && data.shopId !== currentShopId) return;

  if (data.orderId) {
    const [order] = await rpcClient.request("getOrderById", { orderId: data.orderId || "" });

    if (!order) {
      if (maximumRetry < 1) return;
      return setTimeout(() => {
        handleNewPushNotificationMessage(
          { title, message, data },
          currentShopId,
          navigate,
          maximumRetry - 1
        );
      }, 5000);
    }
  }

  title = title || "New notification";
  const notification = new Notification(title, {
    body: message,
    silent: false,
  });

  if (data.orderId) {
    notification.onclick = (e) => {
      e.preventDefault();
      navigate("/dashboard/online-presence", {
        state: {
          orderId: data.orderId,
        },
      });
    };
  }
};
