export interface ColumnNamesI {
  dbColumnName: string;
  excelColumnName?: string;
  required: boolean;
  displayName: string;
}

export const DB_INVENTORIES_COLUMNS: ColumnNamesI[] = [
  {
    dbColumnName: "inventoryName",
    required: true,
    displayName: "Product name",
  },
  {
    dbColumnName: "inventoryDescription",
    required: false,
    displayName: "Product Description",
  },
  {
    dbColumnName: "unitPiecesCostPrice",
    required: true,
    displayName: "Buying price",
  },
  {
    dbColumnName: "unitPrice",
    required: true,
    displayName: "Selling price",
  },
  {
    dbColumnName: "quantityInPieces",
    required: true,
    displayName: "Quantity",
  },
  {
    dbColumnName: "inventoryExpiryDate",
    required: false,
    displayName: "Expiry date",
  },
];
