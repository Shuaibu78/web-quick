import moment from "moment";
import { useAppSelector } from "../../../app/hooks";
import { getCurrentShop } from "../../../app/slices/shops";
import { Button } from "../../../components/button/Button";
import { Flex, Text } from "../../../GlobalStyles/CustomizableGlobal.style";
import { Colors } from "../../../GlobalStyles/theme";
import { getImageUrl } from "../../../helper/image.helper";
import { IInventory } from "../../../interfaces/inventory.interface";
import { getExpiryDate } from "../../../utils/getProductExpiryDate";
import { isFigorr } from "../../../utils/constants";

interface ProdDettailsProps {
  product: IInventory;
  handleMakeProductOnline: Function;
}

const ProductInforCard: React.FC<ProdDettailsProps> = ({ product, handleMakeProductOnline }) => {
  const perPack = product.TrackableItem?.perPack;
  const currentShop = useAppSelector(getCurrentShop);
  const expiryDate = getExpiryDate(product?.Supplies);

  const overFlow = {
    maxWidth: "18.75rem",
    WhiteSpace: "nowrap",
    overFlow: "hidden",
    textOverflow: "ellipsis",
  };

  return (
    <>
      <Flex direction="column">
        <Flex direction="column" margin="0.3125rem 0px">
          <Text color={Colors.grey} fontSize="0.7rem">
            Product Name
          </Text>
          <Text color={Colors.blackLight} fontSize="1rem" style={overFlow}>
            {product.inventoryName}
          </Text>
        </Flex>
        <Flex justifyContent="space-between">
          <Flex
            gap="1.25rem 0"
            justifyContent="space-between"
            direction="column"
            margin="0.3125rem 0px"
          >
            <Flex justifyContent="flex-start" alignItems="flex-start" direction="column">
              <Text color={Colors.grey} fontSize="0.7rem">
                Category
              </Text>
              {product.InventoryCategory?.inventorycategoryName ? (
                <Text color={Colors.blackLight} fontSize="1rem">
                  {product.InventoryCategory?.inventorycategoryName}
                </Text>
              ) : (
                <Text color={Colors.blackLight} style={{ fontStyle: "italic" }}>
                  Not Added
                </Text>
              )}
            </Flex>
            <Flex justifyContent="flex-start" alignItems="flex-start" direction="column">
              <Text color={Colors.grey} fontSize="0.7rem">
                Brand
              </Text>

              {product.brand ? (
                <Text color={Colors.blackLight} fontSize="1rem">
                  {product.brand}
                </Text>
              ) : (
                <Text color={Colors.blackLight} style={{ fontStyle: "italic" }}>
                  Not Added
                </Text>
              )}
            </Flex>
          </Flex>

          <Flex
            gap="1.25rem 0"
            justifyContent="space-between"
            direction="column"
            margin="0.3125rem 0px"
          >
            <Flex justifyContent="flex-start" alignItems="flex-start" direction="column">
              <Text color={Colors.grey} fontSize="0.7rem">
                Added In
              </Text>
              <Text
                color={Colors.blackLight}
                fontSize="1rem"
                style={{ textTransform: "capitalize" }}
              >
                {product.inventoryType === "PIECES" ? "SINGLE" : product.inventoryType}
              </Text>
            </Flex>
            <Flex justifyContent="flex-start" alignItems="flex-start" direction="column">
              <Text color={Colors.grey} fontSize="0.7rem">
                Product Barcode
              </Text>
              {product.barcode ? (
                <Text color={Colors.blackLight} fontSize="1rem">
                  {product.barcode}
                </Text>
              ) : (
                <Text color={Colors.blackLight} style={{ fontStyle: "italic" }}>
                  Not Captured
                </Text>
              )}
            </Flex>
          </Flex>
        </Flex>
        {!!perPack && (
          <Flex
            justifyContent="flex-start"
            alignItems="flex-start"
            direction="column"
            margin="1em 0"
          >
            <Text color={Colors.grey} fontSize="0.7rem">
              Quantity Per Pack
            </Text>
            <Text color={Colors.blackLight} fontSize="1rem" style={{ textTransform: "capitalize" }}>
              {product.TrackableItem?.perPack}
            </Text>
          </Flex>
        )}
        <Flex
          justifyContent="flex-start"
          alignItems="flex-start"
          direction="column"
          width="25rem"
          margin="0.625rem 0px"
        >
          <Text color={Colors.grey} fontSize="0.7rem">
            Product Description
          </Text>

          {product.inventoryDescription ? (
            <Text color={Colors.blackLight} fontSize="1rem">
              {product.inventoryDescription}
            </Text>
          ) : (
            <Text color={Colors.blackLight} style={{ fontStyle: "italic" }}>
              No description added
            </Text>
          )}
        </Flex>
        <Flex
          justifyContent="flex-start"
          alignItems="flex-start"
          direction="column"
          width="25rem"
          margin="0.625rem 0px"
        >
          <Text color={Colors.grey} fontSize="0.7rem">
            Measurement Unit
          </Text>

          {product.NonTrackableItem ? (
            <Text color={Colors.blackLight} fontSize="1rem">
              '{product.NonTrackableItem?.measurementUnit}'
            </Text>
          ) : (
            <>
              {perPack ? (
                <Text color={Colors.blackLight} fontSize="1rem">
                  '{product.TrackableItem?.measurementUnitPack}'
                </Text>
              ) : (
                <Text color={Colors.blackLight} style={{ fontStyle: "italic" }}>
                  '{product.TrackableItem?.measurementUnitPieces}'
                </Text>
              )}
            </>
          )}
        </Flex>
      </Flex>

      {currentShop.isExpiryDateEnabled && (
        <Flex justifyContent="flex-start" alignItems="flex-start" direction="column">
          <Text color={Colors.grey} fontSize="0.7rem">
            Product Expiry Date
          </Text>

          <Text color={Colors.blackLight} fontSize="1rem" style={{ fontStyle: "italic" }}>
            {expiryDate ? moment(expiryDate).format("Do MMM YYYY") : "Not Added"}
          </Text>
        </Flex>
      )}

      {isFigorr ? null : (
        <Flex
          alignItems="center"
          borderRadius="0.75rem"
          padding="0px 0.625rem"
          height="3rem"
          margin="1.25rem 0px"
          style={{ minHeight: "3rem" }}
          justifyContent="space-between"
          bg={Colors.tabBg}
        >
          <Text color={Colors.blackLight} style={{ fontStyle: "italic" }}>
            {product.isPublished ? "This product is online" : "This product is not showing online"}
          </Text>
          {product.isPublished ? (
            <Button
              height="70%"
              width="40%"
              borderRadius="0.5rem"
              label="Remove Product Online"
              backgroundColor="white"
              border
              borderColor={Colors.red}
              color={Colors.red}
              onClick={() => handleMakeProductOnline(product.inventoryId, false)}
            />
          ) : (
            <Button
              height="70%"
              width="40%"
              borderRadius="0.5rem"
              label="Show Product Online"
              backgroundColor="white"
              border
              borderColor={Colors.green}
              color={Colors.green}
              onClick={() => handleMakeProductOnline(product.inventoryId, true)}
            />
          )}
        </Flex>
      )}

      <Flex direction="column" width="25rem" height="fit-content" margin="1.25rem 0px">
        <Text color={Colors.grey} fontSize="0.7rem">
          Product Image({product.Images?.length})
        </Text>
        <Flex gap="0.27rem 2rem" padding="0px 1.875rem" flexWrap="wrap" justifyContent="flex-start">
          {product.Images && product.Images?.length > 0 ? (
            <>
              {product.Images.map((image) => (
                <Flex
                  key={image.smallImageOnlineURL}
                  display="flex"
                  margin="1.25rem 0"
                  borderRadius="0.75rem"
                  direction="column"
                  justifyContent="flex-start"
                  alignItems="flex-start"
                  width="8.10531rem"
                  height="6.67275rem"
                >
                  <img width="100%" height="100%" src={getImageUrl(image)} alt="Product images" />
                </Flex>
              ))}
            </>
          ) : (
            <Flex
              display="flex"
              margin="1.25rem auto"
              borderRadius="0.75rem"
              padding="2rem"
              direction="column"
              justifyContent="center"
              alignItems="center"
              gap="1.25rem"
              bg={Colors.tabBg}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="95"
                height="95"
                viewBox="0 0 95 95"
                fill="none"
              >
                <path
                  d="M78.9179 56.2802V22.0247C78.9179 20.45 78.2924 18.9398 77.1789 17.8263C76.0654 16.7128 74.5551 16.0872 72.9804 16.0872H30.9113C30.3863 16.0872 29.8829 15.8787 29.5118 15.5076C29.1406 15.1364 28.9321 14.633 28.9321 14.1081C28.9321 13.5832 29.1406 13.0798 29.5118 12.7086C29.8829 12.3374 30.3863 12.1289 30.9113 12.1289H72.9804C75.605 12.1289 78.122 13.1715 79.9778 15.0273C81.8337 16.8832 82.8763 19.4002 82.8763 22.0247V64.0781C82.8768 64.603 82.6688 65.1066 82.298 65.4781C81.9272 65.8497 81.424 66.0587 80.8991 66.0592C80.3742 66.0597 79.8705 65.8517 79.499 65.4809C79.1275 65.1101 78.9184 64.6069 78.9179 64.082V61.8812L60.7769 43.7362C58.9719 41.9312 61.7704 39.1327 63.5754 40.9377L78.9179 56.2802ZM78.439 81.2335C76.8214 82.3076 74.9222 82.8792 72.9804 82.8762H22.0208C19.3963 82.8762 16.8793 81.8336 15.0234 79.9778C13.1676 78.122 12.125 75.6049 12.125 72.9804V22.0247C12.125 20.006 12.7306 18.1297 13.7638 16.5622L12.7227 15.5212C10.9177 13.7162 13.7163 10.9177 15.5213 12.7227L16.5623 13.7637L81.2375 78.435L82.2785 79.476C84.0796 81.281 81.281 84.0795 79.48 82.2745L78.439 81.2335ZM34.4856 37.2841L26.565 29.3635C26.0337 30.472 25.8595 31.7181 26.0665 32.9298C26.2735 34.1416 26.8515 35.2591 27.7207 36.1284C28.59 36.9976 29.7076 37.5756 30.9193 37.7826C32.131 37.9896 33.3771 37.8155 34.4856 37.2841ZM23.6675 26.466L16.6613 19.4597C16.2806 20.2612 16.0832 21.1374 16.0833 22.0247V64.4462L23.7071 56.8224C24.2585 56.2707 24.9132 55.833 25.6338 55.5344C26.3544 55.2358 27.1268 55.0821 27.9069 55.0821C28.6869 55.0821 29.4593 55.2358 30.1799 55.5344C30.9006 55.833 31.5553 56.2707 32.1067 56.8224L34.3035 59.0154C34.4864 59.1999 34.7041 59.3464 34.9439 59.4464C35.1837 59.5463 35.441 59.5978 35.7008 59.5978C35.9607 59.5978 36.2179 59.5463 36.4577 59.4464C36.6976 59.3464 36.9152 59.1999 37.0981 59.0154L46.6575 49.456L37.3831 40.1816C35.4801 41.4429 33.1994 42.0074 30.9277 41.7794C28.656 41.5514 26.533 40.5449 24.9186 38.9305C23.3042 37.3161 22.2977 35.1931 22.0697 32.9214C21.8417 30.6497 22.4062 28.369 23.6675 26.466ZM16.0833 70.0433V72.9764C16.0833 74.5511 16.7089 76.0614 17.8224 77.1749C18.9359 78.2884 20.4461 78.9139 22.0208 78.9139H72.9804C73.8988 78.9139 74.7656 78.7081 75.5415 78.34L49.456 52.2545L39.9006 61.8139C39.3492 62.3657 38.6945 62.8034 37.9739 63.102C37.2533 63.4006 36.4809 63.5543 35.7008 63.5543C34.9208 63.5543 34.1484 63.4006 33.4278 63.102C32.7072 62.8034 32.0524 62.3657 31.501 61.8139L29.3081 59.621C29.1243 59.4367 28.9059 59.2904 28.6654 59.1907C28.425 59.0909 28.1672 59.0395 27.9069 59.0395C27.6465 59.0395 27.3888 59.0909 27.1483 59.1907C26.9079 59.2904 26.6895 59.4367 26.5056 59.621L16.0833 70.0433Z"
                  fill="#9EA8B7"
                />
              </svg>

              <Text color={Colors.blackLight} style={{ fontStyle: "italic" }}>
                No Product Image Added
              </Text>
            </Flex>
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default ProductInforCard;
