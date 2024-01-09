import { Container } from "../register/style";
import Key from "../../assets/key.png";
import ShopCard from "../manageBusinesses/card/shopCard";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setCurrentShop, setShops } from "../../app/slices/shops";
import { getSessions } from "../../app/slices/session";
import { useNavigate } from "react-router-dom";
import { clearTabs, getShops } from "../../app/slices/sales";
import { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { IShop } from "../../interfaces/shop.interface";
import { GET_ALL_SHOPS, DELETE_SHOP } from "../../schema/shops.schema";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { hideShowSelectShop } from "../../app/slices/accountLock";
import { setItem } from "../../utils/localStorage.utils";
import { Right } from "../sales/style";
import { Flex } from "../../GlobalStyles/CustomizableGlobal.style";
import { ButtonWithIcon } from "../../components/top-nav/style";
import { Colors } from "../../GlobalStyles/theme";
import { getCurrentUser } from "../../app/slices/userInfo";

const SelectShop = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(getCurrentUser);
  const isUserAvailable = Number(currentUser?.userId?.length) > 0;

  const navigate = useNavigate();
  const [selectedStore, setSelectedStore] = useState<number>();
  const shops = useAppSelector(getShops);

  const [fetchShops, { data }] = useLazyQuery<{ getUsersShops: [IShop] }>(GET_ALL_SHOPS, {
    fetchPolicy: "network-only",
    variables: {
      userId: currentUser?.userId
    },
    onError: (error) => {
      if (isUserAvailable === true) {
        dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
      }
    },
    onCompleted: () => {
      if (Number(data?.getUsersShops.length) > Number(shops.length)) {
        dispatch(setShops(data?.getUsersShops));
      }
      if (data?.getUsersShops && data?.getUsersShops?.length < 1) {
        dispatch(setCurrentShop({}));
        navigate("/create-business");
      }
    },
  });

  const [DeleteShop] = useMutation(DELETE_SHOP, {
    onCompleted() {
      if (isUserAvailable === true) {
        fetchShops();
      }
    },
    onError() {
      dispatch(toggleSnackbarOpen("Something went wrong... try again"));
    },
  });

  const handleDeleteShop = (shopId: string) => {
    DeleteShop({ variables: { shopId: shopId } });
  };

  const handleStoreSelect = async (index: number) => {
    const shop = shops[index];

    if (!shop) return;

    setSelectedStore(index);
    dispatch(setCurrentShop(shop));
    dispatch(hideShowSelectShop());
    setItem("currentShop", shop);

    dispatch(clearTabs());
    navigate("/dashboard");

    localStorage.setItem("currencyCode", shop?.currencyCode as string);
  };

  return (
    <>
      <Container style={{ backgroundColor: "#F4F6F9", width: "100%" }} bg={Key} position="right">
        <Right
          overflow
          style={{
            backgroundColor: "white",
            borderRadius: "1.25rem",
            paddingBlock: "1.25rem",
            width: "45rem",
            display: "flex",
            overflowY: "auto",
            overflowX: "hidden",
            gap: ".5rem",
            marginBottom: "0",
            justifyContent: "center",
            justifySelf: "flex-start",
            height: "40rem",
          }}
        >
          <Flex direction="column" width="98%">
            <Flex margin="0 0 1.25rem 0px" padding="0px 0.9375rem" justifyContent="space-between">
              <div>
                <h2 style={{ color: Colors.black, fontSize: "1.2rem" }}>
                  Welcome Back, {currentUser.fullName}.
                </h2>
                <p style={{ color: Colors.grey }}>Please enter a shop/business to continue</p>
              </div>
              <ButtonWithIcon
                bgColor={Colors.blackishBlue}
                id="add-button"
                onClick={() => {
                  navigate("/create-business");
                }}
              >
                <div
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    borderRadius: "50%",
                    backgroundColor: Colors.white,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <p style={{ fontSize: "1.25rem", color: Colors.blackishBlue }}>+</p>
                </div>
                <span>Add a New Business</span>
              </ButtonWithIcon>
            </Flex>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.9375rem",
                padding: "0px 0.9375rem",
                height: "fit-content",
                width: "100%",
                justifyContent: "center",
              }}
            >
              {shops.map((shop, i) => (
                <ShopCard
                  key={i}
                  index={i}
                  handleStoreSelect={handleStoreSelect}
                  shop={shop}
                  currentShopIndex={selectedStore as number}
                  handleDeleteShop={handleDeleteShop}
                />
              ))}
            </div>
          </Flex>
        </Right>
      </Container>
    </>
  );
};

export default SelectShop;
