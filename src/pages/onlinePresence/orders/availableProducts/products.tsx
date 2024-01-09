import { useState } from "react";
import ProductsView from "./productsView";

const Products = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  return (
    <div>
      <ProductsView activeTabIndex={activeTabIndex} setActiveTabIndex={setActiveTabIndex} />
    </div>
  );
};

export default Products;
