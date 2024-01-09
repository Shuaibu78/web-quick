import { Flex, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import {
  getInventoryQuantity,
  getProductCostPrice,
  getProductSellingPrice,
  productValue,
} from "../../../helper/inventory.helper";
import { IInventory } from "../../../interfaces/inventory.interface";
import FilterIcon from "../../../assets/FilterIconPryColor.svg";

interface ProdDettailsProps {
  product: IInventory;
  setAdjustModalPopup: Function;
  setCurrentInventory: Function;
  saveSelectedInventory: Function;
  closeProdDetails: Function;
}

const ProductQuantity: React.FC<ProdDettailsProps> = ({
  product,
  setAdjustModalPopup,
  saveSelectedInventory,
  setCurrentInventory,
  closeProdDetails,
}) => {
  return (
    <>
      <Flex direction="column">
        <Flex justifyContent="space-between">
          <Flex
            margin="0.625rem 0px"
            justifyContent="flex-start"
            alignItems="flex-start"
            direction="column"
          >
            <Text color={Colors.grey} fontSize="0.7rem">
              Available Quantity
            </Text>
            <Text color={Colors.blackLight} fontSize="1rem">
              {getInventoryQuantity(product)}
            </Text>
          </Flex>
          {product.isLowProductAlertEnabled && (
            <Flex
              margin="0.625rem 0px"
              justifyContent="flex-start"
              alignItems="flex-start"
              direction="column"
            >
              <Text color={Colors.grey} fontSize="0.7rem">
                Low Product Alert
              </Text>
              <Text color={Colors.blackLight} fontSize="1rem">
                {product.TrackableItem?.lowAlertQuantity}
              </Text>
            </Flex>
          )}
        </Flex>
        <Flex
          margin="0.625rem 0px"
          justifyContent="flex-start"
          alignItems="flex-start"
          direction="column"
        >
          <Text color={Colors.grey} fontSize="0.7rem">
            Purchase Price
          </Text>
          <Text color={Colors.blackLight} fontSize="1rem">
            {getProductCostPrice(product)}
          </Text>
        </Flex>
        <Flex
          margin="0.625rem 0px"
          justifyContent="flex-start"
          alignItems="flex-start"
          direction="column"
        >
          <Text color={Colors.grey} fontSize="0.7rem">
            Selling Price
          </Text>
          <Text color={Colors.blackLight} fontSize="1rem">
            {getProductSellingPrice(product)}
          </Text>
        </Flex>
        <Flex
          margin="0.625rem 0px"
          justifyContent="flex-start"
          alignItems="flex-start"
          direction="column"
        >
          <Text color={Colors.grey} fontSize="0.7rem">
            Product Value
          </Text>
          <Text color={Colors.blackLight} fontSize="1rem">
            {productValue(product)}
          </Text>
        </Flex>
      </Flex>
      <Flex
        alignItems="center"
        justifyContent="space-around"
        padding="0.375rem 0.8125rem"
        borderRadius="0.5rem"
        margin="1rem 0"
        cursor="pointer"
        onClick={() => {
          setAdjustModalPopup(true);
          setCurrentInventory(product);
          saveSelectedInventory(product);
          closeProdDetails(false);
        }}
        bg={Colors.lightSecondaryColor}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 6C12 6.53043 12.2107 7.03914 12.5858 7.41421C12.9609 7.78929 13.4696 8 14 8C14.5304 8 15.0391 7.78929 15.4142 7.41421C15.7893 7.03914 16 6.53043 16 6M12 6C12 5.46957 12.2107 4.96086 12.5858 4.58579C12.9609 4.21071 13.4696 4 14 4C14.5304 4 15.0391 4.21071 15.4142 4.58579C15.7893 4.96086 16 5.46957 16 6M12 6H4M16 6H20M6 12C6 12.5304 6.21071 13.0391 6.58579 13.4142C6.96086 13.7893 7.46957 14 8 14C8.53043 14 9.03914 13.7893 9.41421 13.4142C9.78929 13.0391 10 12.5304 10 12M6 12C6 11.4696 6.21071 10.9609 6.58579 10.5858C6.96086 10.2107 7.46957 10 8 10C8.53043 10 9.03914 10.2107 9.41421 10.5858C9.78929 10.9609 10 11.4696 10 12M6 12H4M10 12H20M15 18C15 18.5304 15.2107 19.0391 15.5858 19.4142C15.9609 19.7893 16.4696 20 17 20C17.5304 20 18.0391 19.7893 18.4142 19.4142C18.7893 19.0391 19 18.5304 19 18M15 18C15 17.4696 15.2107 16.9609 15.5858 16.5858C15.9609 16.2107 16.4696 16 17 16C17.5304 16 18.0391 16.2107 18.4142 16.5858C18.7893 16.9609 19 17.4696 19 18M15 18H4M19 18H20"
            stroke={Colors.secondaryColor}
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>

        <Text color={Colors.secondaryColor} fontSize=".9rem">
          Click to restock/return/adjust product quantity
        </Text>
      </Flex>
    </>
  );
};

export default ProductQuantity;
