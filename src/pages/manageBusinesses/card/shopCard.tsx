import React, { useState } from "react";
import styled from "styled-components";
import { Colors } from "../../../GlobalStyles/theme";
import ShopCardIcon from "../../../assets/ShopCardIcon.svg";
import EnterShopIcon from "../../../assets/EnterShopIcon.svg";
import DeleteShopIcon from "../../../assets/DeleteShopIcon.svg";
import DeleteModal from "../../../components/modal/deleteShopModal";
import PopupCard from "../../../components/popUp/PopupCard";
import { formatImageUrl } from "../../../utils/formatImageUrl.utils";
import { getImageUrl } from "../../../helper/image.helper";

const Container = styled.div<{ checked: boolean }>`
  display: flex;
  align-items: center;
  height: 10rem;
  width: 18.75rem;
  border: ${({ checked }) => (checked ? "none" : `1px solid ${Colors.grey4}`)};
  background-color: ${({ checked }) => (checked ? "#ECEFF4" : "transparent")};
  margin: 0px 0;
  border-radius: 0.75rem;
  flex-direction: column;
  justify-content: space-around;
`;

const IconButton = styled.div<{ color?: string }>`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 5.625rem;
  font-size: 0.75rem;
  cursor: pointer;
  color: ${({ color }) => color ?? `${Colors.red}`};

  img {
    width: 0.875rem;
  }

  :hover {
    opacity: 0.6;
  }
`;

interface ShopCardProps {
  shop: any;
  currentShopIndex: number;
  index: number;
  handleStoreSelect: (n: number) => void;
  handleDeleteShop: (T: string) => void;
}

const ShopCard = (props: ShopCardProps) => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);

  return (
    <Container checked={props.index === props.currentShopIndex}>
      <div style={{ display: "flex", columnGap: ".5rem", width: "90%" }}>
        <img
          style={{ width: "6rem", height: "6rem", borderRadius: "0.75rem" }}
          src={props?.shop?.Images ? getImageUrl(props?.shop?.Images[0]) : ShopCardIcon}
          alt=""
        />
        <div
          style={{
            height: "90%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: "1.0625rem", color: "#607087" }}>{props.shop.shopName}</p>
          <p style={{ fontSize: "0.8125rem", color: "#9EA8B7" }}>{props.shop.shopPhone}</p>
          <p style={{ fontSize: "0.6875rem", color: "#9EA8B7" }}>{props.shop.shopAddress}</p>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "90%",
        }}
      >
        <IconButton onClick={() => setShowDeleteModal(true)}>
          <img src={DeleteShopIcon} alt="" />
          <p>Delete Shop</p>
        </IconButton>
        {/* <IconButton color={Colors.primaryColor}>
          <img src={LeaveShopIcon} alt="" />
          <p>Leave Shop</p>
        </IconButton> */}
        <IconButton color={Colors.black} onClick={() => props.handleStoreSelect(props.index)}>
          <img src={EnterShopIcon} alt="" />
          <p>Enter Shop</p>
        </IconButton>
      </div>

      {showDeleteModal ? (
        <PopupCard close={() => setShowDeleteModal(false)}>
          <DeleteModal
            action="Confirm Delete"
            shopName={props.shop.shopName}
            actionhandler={() => props.handleDeleteShop(props.shop.shopId)}
            closeModal={() => setShowDeleteModal(false)}
          />
        </PopupCard>
      ) : null}
    </Container>
  );
};

export default ShopCard;
