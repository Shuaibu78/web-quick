import { IInventory } from "../interfaces/inventory.interface";

export function outOfStock(inventories?: [IInventory]) {
  return (
    inventories?.filter(
      (item) => item.quantityInPacks === 0 && item.quantityInPieces === 0 && item.quantity === 0
    )?.length || 0
  );
}

export const quantityOnline = (inventories?: [IInventory]) => {
  return inventories?.filter((item) => item.isPublished)?.length || 0;
};

export const quantityOffline = (inventories?: [IInventory]) => {
  return inventories?.filter((item) => !item.isPublished)?.length || 0;
};
