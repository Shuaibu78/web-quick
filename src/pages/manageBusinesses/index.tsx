import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { clearTabs, getShops } from "../../app/slices/sales";
import { getCurrentShop, setCurrentShop, setShops } from "../../app/slices/shops";
import TopNav from "../../components/top-nav/top-nav";
import { rpcClient } from "../../helper/rpcClient";
import { getItemAsObject, setItem } from "../../utils/localStorage.utils";
import { Right, Left } from "../sales/style";
import ShopCard from "./card/shopCard";
import AddNewShop from "./card/newShop";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { IShop } from "../../interfaces/shop.interface";
import { GET_ALL_SHOPS, DELETE_SHOP } from "../../schema/shops.schema";
import { setIsSwitchingShops } from "../../app/slices/accountLock";
import { useNavigate } from "react-router-dom";
import { getSessions } from "../../app/slices/session";
import { clearSalesTabs } from "../../utils/shopSwitching.utils";
import { getCurrentUser } from "../../app/slices/userInfo";

const ManageBusiness = () => {
  const currentShop = useAppSelector(getCurrentShop);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const shops = useAppSelector(getShops);
  const [selectedStore, setSelectedStore] = useState<number>();
  const [navbarHeight, setNavbarHeight] = useState<number>();
  const salesTabs = useAppSelector((state) => state.sales.tabs);
  const currentUser = useAppSelector(getCurrentUser);
  const isUserAvailable = Number(currentUser?.userId?.length) > 0;

  useEffect(() => {
    if (currentShop) {
      const currentShopIndex = shops.findIndex((val) => val.shopId === currentShop.shopId);
      setSelectedStore(currentShopIndex === -1 ? 0 : currentShopIndex);
    }
  }, []);

  const [fetchShops, { data, refetch }] = useLazyQuery<{ getUsersShops: [IShop] }>(GET_ALL_SHOPS, {
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
      dispatch(setShops(data?.getUsersShops));
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
    dispatch(setIsSwitchingShops(true));
    const shop = shops[index];

    if (!shop) return;

    setSelectedStore(index);
    dispatch(setCurrentShop(shop));
    setItem("currentShop", shop);

    dispatch(clearTabs());
    setTimeout(() => {
      dispatch(setIsSwitchingShops(false));
      navigate("/dashboard");
    }, 2000);

    clearSalesTabs(salesTabs);
    localStorage.setItem("currencyCode", shop?.currencyCode as string);
  };

  return (
    <>
      <TopNav header="My Businesses" setNavBarHeight={setNavbarHeight} />
      <div style={{ height: "0.3125rem" }}></div>
      <div style={{ display: "flex", height: "fit-content" }}>
        <Right
          overflow
          style={{
            backgroundColor: "white",
            borderRadius: "1.25rem",
            paddingBlock: "1.25rem",
            width: "55%",
            display: "flex",
            overflowY: "auto",
            overflowX: "hidden",
            gap: ".5rem",
            marginBottom: "0",
            justifyContent: "flex-start",
            height: navbarHeight && `calc(100vh - ${navbarHeight + 15}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.9375rem",
              height: "fit-content",
              width: "fit-content",
              paddingInline: ".5rem",
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
        </Right>
        <Left
          overflow
          style={{
            backgroundColor: "white",
            borderRadius: "1.25rem",
            padding: "0.9375rem 0.9375rem",
            marginInline: ".5rem",
            width: "40%",
            marginBottom: "0",
            overflowY: "auto",
            overflowX: "hidden",
            height: navbarHeight && `calc(100vh - ${navbarHeight + 15}px)`,
            scrollPaddingBlock: "3.125rem",
          }}
        >
          <AddNewShop updateShops={refetch} />
        </Left>
      </div>
    </>
  );
};

export default ManageBusiness;
