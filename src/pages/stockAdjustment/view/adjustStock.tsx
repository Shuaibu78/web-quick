import { useAdjustStockContext } from "../stockAdjustment";
import Graph from "../../../assets/GraphB.svg";
import { Flex, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import AdjustProductRow from "../adjustProductRow";
import { IInventory } from "../../../interfaces/sales.interface";

const AdjustStock = () => {
  const { selectedProducts } = useAdjustStockContext();
  return (
    <>
      {selectedProducts.length > 0 ? (
        <Flex
          width="100%"
          minHeight="100%"
          overflowX="none"
          overflowY="auto"
          padding="0 0 4rem 0"
          direction="column"
        >
          {selectedProducts?.map((product) => (
            <>
              <AdjustProductRow
                product={product}
                key={(product.inventoryId as IInventory).inventoryId}
              />
            </>
          ))}
        </Flex>
      ) : (
        <Flex width="auto" height="80%" alignItems="center" justifyContent="center">
          <Flex direction="column" style={{ textAlign: "center" }} alignItems="center" width="30%">
            <Flex margin="0.5rem 0" alignItems="center" justifyContent="center">
              <img src={Graph} alt="" />
            </Flex>
            <Text
              fontWeight="600"
              margin="0.5rem 0"
              fontSize="1.125rem"
              color={Colors.primaryColor}
            >
              No Products Added For Adjustment
            </Text>
            <Text fontWeight="400" margin="0.1rem 0" fontSize="0.875rem" color={Colors.grey}>
              Click on search product to adjust at the top left corner to start adjustments
            </Text>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default AdjustStock;
