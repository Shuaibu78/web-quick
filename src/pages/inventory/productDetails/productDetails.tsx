import { useState } from "react";
import { Flex } from "../../../GlobalStyles/CustomizableGlobal.style";
import { IInventory } from "../../../interfaces/sales.interface";
import { CancelButton } from "../../sales/style";
import { StyledNavLink } from "../../settings/settingsComps.style";
import Cancel from "../../../assets/cancel.svg";
import { Colors } from "../../../GlobalStyles/theme";
import ProductInforCard from "./prodInfo";
import { Button } from "../../../components/button/Button";
import { setSingleInventory } from "../../../app/slices/inventory";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import ConfirmAction from "../../../components/modal/confirmAction";
import ProductQuantity from "./prodQty";
import ProductHistory from "./prodHistory";
import { setIsEdit } from "../../../app/slices/isEdit";

interface ProdDettailsProps {
  product: IInventory;
  closeProdDetails: Function;
  handleDeleteInventory: Function;
  handleMakeProductOnline: Function;
  setAdjustModalPopup: Function;
  setCurrentInventory: Function;
  saveSelectedInventory: Function;
}

const ProductDetails: React.FC<ProdDettailsProps> = ({
  product,
  closeProdDetails,
  handleDeleteInventory,
  handleMakeProductOnline,
  setAdjustModalPopup,
  saveSelectedInventory,
  setCurrentInventory,
}) => {
  const [prodDetailTab, setProductDetailTab] = useState<
    "Product Information" | "Product Quantity" | "Product History"
  >("Product Information");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [popup, setPopup] = useState<boolean>(false);

  const overFlow = {
    WhiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "18.75rem",
    maxWidth: "18.75rem",
  };

  return (
    <>
      <Flex direction="column" margin="0.625rem 0px" height="96%" style={{ minWidth: "28rem" }}>
        <Flex justifyContent="space-between" color={Colors.blackLight}>
          <h3 style={overFlow}>{product.inventoryName}</h3>
          <CancelButton
            style={{ width: "1.875rem", height: "1.875rem", display: "grid", placeItems: "center" }}
            hover
            onClick={() => closeProdDetails(false)}
          >
            <img src={Cancel} alt="" />
          </CancelButton>
        </Flex>
        <Flex columnGap="2rem" margin="1.25rem 0px" gap="0.625rem 0px" justifyContent="flex-start">
          <StyledNavLink
            width="145px"
            onClick={() => setProductDetailTab("Product Information")}
            active={prodDetailTab === "Product Information"}
          >
            Product Information
          </StyledNavLink>
          <StyledNavLink
            width="145px"
            onClick={() => setProductDetailTab("Product Quantity")}
            active={prodDetailTab === "Product Quantity"}
          >
            Product Quantity
          </StyledNavLink>
          <StyledNavLink
            width="145px"
            onClick={() => setProductDetailTab("Product History")}
            active={prodDetailTab === "Product History"}
          >
            Product History
          </StyledNavLink>
        </Flex>
        <Flex
          style={{ overflowX: "hidden", overflowY: "scroll" }}
          height="140%"
          padding="0 0.625rem"
          direction="column"
          hideScrollbar
        >
          {prodDetailTab === "Product Information" && (
            <>
              <ProductInforCard
                product={product}
                handleMakeProductOnline={handleMakeProductOnline}
              />
            </>
          )}
          {prodDetailTab === "Product Quantity" && (
            <>
              <ProductQuantity
                saveSelectedInventory={saveSelectedInventory}
                setCurrentInventory={setCurrentInventory}
                product={product}
                setAdjustModalPopup={setAdjustModalPopup}
                closeProdDetails={closeProdDetails}
              />
            </>
          )}
          {prodDetailTab === "Product History" && (
            <>
              <ProductHistory product={product} />
            </>
          )}
        </Flex>

        <Flex justifyContent="space-around" margin="0.625rem 0px 0 0">
          <Button
            label="Edit Product"
            backgroundColor={Colors.primaryColor}
            color={Colors.white}
            borderRadius="0.5rem"
            fontSize="1rem"
            width="12rem"
            height="3rem"
            onClick={() => {
              dispatch(setSingleInventory(product));
              setCurrentInventory(product);
              saveSelectedInventory(product);
              navigate("/dashboard/product/add");
              dispatch(setIsEdit(true));
            }}
          />
          <Button
            height="3rem"
            width="12rem"
            fontSize="1rem"
            label="Delete Product"
            backgroundColor={Colors.offRed}
            color={Colors.white}
            borderRadius="0.5rem"
            onClick={() => setPopup(true)}
          />
        </Flex>
      </Flex>

      {popup && (
        <ConfirmAction
          setConfirmSignout={setPopup}
          doAction={() => {
            handleDeleteInventory([product.inventoryId]);
            setPopup(false);
            closeProdDetails(false);
          }}
          action="Delete Inventory"
          actionText={`Are you sure you want to delete ${product?.inventoryName}`}
        />
      )}
    </>
  );
};

export default ProductDetails;
