import React, { useState } from "react";
import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";
import ShopAvatar from "../../assets/Image.svg";
import SettingsIcon from "../../assets/SettingsIconNeutral.svg";
import { Link, useNavigate } from "react-router-dom";
import { formatImageUrl } from "../../utils/formatImageUrl.utils";
import { setIsSwitchingShops } from "../../app/slices/accountLock";
import { useDispatch } from "react-redux";
import { clearSalesTabs } from "../../utils/shopSwitching.utils";
import { useAppSelector } from "../../app/hooks";

const Container = styled.div`
  position: fixed;
  top: 0px;
  left: 0;
  z-index: 20000;
  width: 100vw;
  height: 100vh;

  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`;

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  // background: ${Colors.overlayColor};
`;

export const RadioContainer = styled.div<{ checked: boolean; noBorder?: boolean }>`
  display: flex;
  align-items: center;
  cursor: pointer;
  height: 3.125rem;
  width: 100%;
  border: ${({ checked, noBorder }) =>
    checked ? "none" : noBorder ? "none" : `1px solid ${Colors.grey4}`};
  background-color: ${({ checked }) => (checked ? "#ECEFF4" : "transparent")};
  margin: 0.625rem 0;
  border-radius: 0.75rem;
  padding: 0.625rem 0.625rem;

  :hover {
    background: #eceff4;
  }
`;

export const RadioInput = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

export const RadioIcon = styled.span<{ checked: boolean; bg?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.125rem;
  height: 1.125rem;
  border-radius: 0.3125rem;
  border: ${({ checked }) => (checked ? "none" : "2px solid #8196b3")};
  background-color: ${({ checked, bg }) => (checked ? bg ?? "black" : "transparent")};
  margin-right: 0.5rem;
  transition: background-color 0.3s ease;

  .check {
    background-color: transparent;
    color: white;
    font-size: 0.625rem;
  }
`;

export const RadioLabel = styled.span`
  margin-left: 1.25rem;
  width: 100%;
`;

interface StoreListProps {
  options: any[];
  setValue: (n: number) => void;
  setShowStoreListModal: (b: boolean) => void;
  selectedStore: number;
}

const StoreListModal = (props: StoreListProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(props.selectedStore);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const salesTabs = useAppSelector((state) => state.sales.tabs);

  const handleStoreSelect = () => {
    dispatch(setIsSwitchingShops(true));

    setTimeout(() => {
      dispatch(setIsSwitchingShops(false));
      props.setValue(currentIndex);
      props.setShowStoreListModal(false);
      navigate("/dashboard");
      clearSalesTabs(salesTabs);
    }, 2000);
  };

  return (
    <Container>
      <Overlay onClick={() => props.setShowStoreListModal(false)} />
      <div
        style={{
          maxHeight: "400px",
          position: "absolute",
          top: "3.75rem",
          backgroundColor: "white",
          padding: "0.9375rem",
          width: "20rem",
          right: "2.5rem",
          borderRadius: "0.75rem",
          boxShadow: "0px 4px 1.875rem rgba(96, 112, 135, 0.2)",
        }}
      >
        <div
          style={{
            clipPath: "polygon(0% 100%, 100% 100%, 53.5% 0%)",
            backgroundColor: "white",
            height: "1.25rem",
            width: "1.25rem",
            position: "absolute",
            right: "0.625rem",
            top: "-0.625rem",
          }}
        ></div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h3 style={{ color: "#607087" }}>My Businesses</h3>
          <Link style={{ textDecoration: "none" }} to="/dashboard/manage-businesses">
            <div style={{ display: "flex", columnGap: ".5rem", cursor: "pointer" }}>
              <img src={SettingsIcon} alt="" />
              <p style={{ color: "#607087" }}>Manage All</p>
            </div>
          </Link>
        </div>
        <div
          className="hide-scrollbar"
          style={{
            maxHeight: "15.625rem",
            margin: "1.25rem 0",
            overflowY: "scroll",
            overflowX: "hidden",
          }}
        >
          {props?.options?.map((option, index) => {
            const isChecked = index === currentIndex;

            const images = option && option?.images?.length > 0 ? option?.images[0] : null;

            return (
              <RadioContainer
                checked={isChecked as boolean}
                onClick={() => setCurrentIndex(index)}
                key={index}
              >
                <RadioInput type="radio" checked={isChecked} />
                <RadioIcon checked={isChecked as boolean}>
                  <span className="check">✔</span>
                </RadioIcon>
                <img
                  width="30px"
                  height="30px"
                  style={{ borderRadius: "50%", objectFit: "none" }}
                  src={images ? formatImageUrl(images?.smallImageOnlineURL) : ShopAvatar}
                  alt=""
                />
                <RadioLabel>
                  <p style={{ fontSize: "1rem", fontWeight: "400", color: "#130F26" }}>
                    {option.shopName}
                  </p>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: "400",
                      color: "#4F4F4F",
                      opacity: "0.5",
                    }}
                  >
                    {option.shopsCategory}
                  </p>
                </RadioLabel>
              </RadioContainer>
            );
          })}
        </div>
        <button
          onClick={handleStoreSelect}
          style={{
            opacity: "0.7",
            backgroundColor: Colors.primaryColor,
            height: "41px",
            width: "100%",
            border: "none",
            borderRadius: "0.75rem",
            color: Colors.white,
            cursor: "pointer",
          }}
        >
          Enter Shop
        </button>
      </div>
    </Container>
  );
};

export default StoreListModal;
