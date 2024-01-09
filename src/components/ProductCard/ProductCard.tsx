import { Container, Image, Content } from "./style";
import { formatName } from "../../utils/formatValues";
import { IInventory } from "../../interfaces/inventory.interface";
import { getInventoryType } from "../../helper/inventory.helper";
import { getImageUrl } from "../../helper/image.helper";
import { formatAmountIntl } from "../../helper/format";

interface Prop {
  inventory: IInventory;
  isSelected?: boolean;
  shopId: string;
}

const ProductCard = ({ inventory, isSelected, shopId = "" }: Prop) => {
  const packPrice = inventory?.TrackableItem?.packPrice || 0;
  const unitPrice = inventory?.TrackableItem?.unitPrice || 0;
  const quantityInPacks = inventory?.quantityInPacks || 0;
  const quantityInPieces = inventory?.quantityInPieces || 0;

  const inventoryType = getInventoryType(inventory);
  const qtyInStock = () => {
    if (inventoryType === "VARIATION") return `${inventory?.quantity} Items`;
    if (!inventory.trackable) return "";

    if (inventory?.TrackableItem) {
      if (inventoryType === "PACK") {
        return `${quantityInPacks} Pack`;
      }
      if (inventoryType === "PIECES_AND_PACK") {
        return `${quantityInPieces} Items | ${quantityInPacks} Pack`;
      }
    }
    return `${quantityInPieces} Items`;
  };
  const inStock = qtyInStock();

  const getTotalPriceByVariation = (variationId: string): number => {
    const variationPrice = inventory?.Variations?.filter(
      (variation) => variation.variationId === variationId
    )[0].price;
    return variationPrice ?? 0;
  };

  const getVariationQuantity = (variationId: string) => {
    const inventoryQty = inventory?.InventoryQuantity?.filter(
      (qty) => qty?.variationId === variationId
    ).reduce((prevValue, inventoryQuantity) => prevValue + inventoryQuantity.quantity!, 0);
    return inventoryQty ?? 0;
  };

  const getVariationValue = () => {
    let variationValue = 0;
    const variations = inventory?.Variations;
    if (variations) {
      for (let i = 0; i < variations?.length!; i++) {
        const price = getTotalPriceByVariation(variations[i]?.variationId!);

        const quantity = getVariationQuantity(variations[i]?.variationId!);

        variationValue += price * quantity;
      }
    }

    return variationValue;
  };

  const productValue = !inventory?.isVariation
    ? packPrice * quantityInPacks + unitPrice * quantityInPieces
    : getVariationValue();

  const images = inventory?.Images ? inventory?.Images : [];
  console.log(images[0]?.localURL);

  return (
    <Container isSelected={isSelected}>
      <Image>
        <img src={getImageUrl(images)} alt="product image" />
      </Image>
      <Content status={inventory?.isPublished}>
        <div className="up">
          <div>
            <div className="name-container">
              <p className="product-name">{formatName(inventory.inventoryName)}</p>
              <p className="online-status">
                Status:{" "}
                <span className="status">{inventory.isPublished ? "Online" : "Offline"}</span>
              </p>
            </div>
          </div>
          {inventory?.trackable && (
            <p className="stock">
              In Stock: <span className="stock-amount">{inStock}</span>
            </p>
          )}
        </div>
        <div className="down">
          {inventory?.trackable ? (
            !inventory?.isVariation ? (
              <>
                <div className="price">
                  <p className="price-title">Unit Price </p>
                  <span className="price-value">
                    {formatAmountIntl(undefined, inventory?.TrackableItem?.unitPrice || 0)}
                  </span>
                </div>
                <div className="price">
                  <p className="price-title">Pack Price </p>
                  <span className="price-value">
                    {formatAmountIntl(undefined, inventory?.TrackableItem?.packPrice || 0)}
                  </span>
                </div>
                <div className="price">
                  <p className="price-title">Product value </p>{" "}
                  <span className="price-value">{formatAmountIntl(undefined, productValue)}</span>
                </div>
              </>
            ) : (
              <div className="lastValue">
                <p className="price-title">Product value </p>{" "}
                <span className="price-value">{formatAmountIntl(undefined, productValue)}</span>
              </div>
            )
          ) : (
            <div className="price">
              <p className="price-title">Selling Price </p>
              <span className="price-value">
                {formatAmountIntl(undefined, inventory?.NonTrackableItem?.sellingPrice || 0)}
              </span>
            </div>
          )}
        </div>
      </Content>
    </Container>
  );
};

export default ProductCard;
