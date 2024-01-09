import { Cart } from "../pages/sales/new-sales/new-sales";

interface TabStruct {
  [key: string]: {
    name: string;
    items: Cart[];
    id: number;
  };
}

export const clearSalesTabs = (obj: TabStruct) => {
  for (const key in obj) {
    if (key === "tab1") {
      obj[key].items = [];
    } else {
      delete obj[key];
    }
  }
};
