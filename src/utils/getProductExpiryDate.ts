import { ISupplies } from "../interfaces/inventory.interface";

export function getExpiryDate(supplies?: ISupplies[] | null) {
  if (!supplies || supplies?.length <= 0) return null;

  const dateObjects = supplies?.map((supply: ISupplies) => ({
    ...supply,
    createdAt: new Date(supply?.createdAt),
  }));

  const sortedDates = dateObjects?.sort(
    (a, b) => new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
  )!;

  return sortedDates[0]?.inventoryExpiryDate || "";
}
