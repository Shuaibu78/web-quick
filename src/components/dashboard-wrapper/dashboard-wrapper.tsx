/* eslint-disable no-debugger */
import React, { FunctionComponent, useCallback, useEffect, useState } from "react";
import { Container, LeftContainer } from "./style";
import Sidebar from "../sidebar/sidebar";
import { Outlet } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client";
import { GET_ALL_SHOPS, SAVE_SERVER_CATEGORIES } from "../../schema/shops.schema";
import { getShops, increaseSyncCount, setShops } from "../../app/slices/shops";
import { socketClient } from "../../helper/socket";
import { SYNC_REGISTER_SHOP, SYNC_START, SYNC_STATUS } from "../../utils/constants";
import { useAppDispatch, useAppSelector, useCurrentShop } from "../../app/hooks";
import { getSyncStatus } from "../../app/slices/syncStatus";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { syncTotalTableCount } from "../../helper/comparisons";
import { getCurrentUser } from "../../app/slices/userInfo";

interface IShop {
  shopId: string;
  shopName: string;
  shopAddress: string;
}

export interface SyncLogProps {
  type: string;
  date: string;
  log: string;
}

export interface syncStatusProps {
  running: boolean;
  lastSyncDate?: number;
  logs?: SyncLogProps[];
  progress?: number;
  totalRecordsToPush?: number;
  more?: any;
}

const DashboardWrapper: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const [syncStatus, setSyncStatus] = useState<syncStatusProps>({
    running: false,
  });
  const currentShop = useCurrentShop();
  const shopId = currentShop?.shopId;

  const shopList = useAppSelector(getShops);
  const currentUser = useAppSelector(getCurrentUser);
  const isUserAvailable = Number(currentUser?.userId?.length) > 0;

  const [getAllShops, { data }] = useLazyQuery<{ getUsersShops: [IShop] }>(GET_ALL_SHOPS, {
    fetchPolicy: "network-only",
    variables: {
      userId: currentUser?.userId,
    },
    onCompleted: (shopData) => {
      if (Number(shopData?.getUsersShops.length) > Number(shopList.length)) {
        dispatch(setShops(shopData?.getUsersShops));
      }
    },
    onError: (error) => {
      if (isUserAvailable === true) {
        dispatch(
          toggleSnackbarOpen({
            message: error?.message || error?.graphQLErrors[0]?.message,
            color: "DANGER",
          })
        );
      }
    },
  });

  useQuery<{ done: number }>(SAVE_SERVER_CATEGORIES);
  useEffect(() => {
    if (isUserAvailable === true) {
      getAllShops();
    }
  }, [isUserAvailable]);

  const startSync = async () => {
    if (syncStatus.running) {
      alert("Still synchronizing. Please wait...");
      return;
    }
    socketClient.emit(SYNC_START, { shopId });
  };

  useEffect(() => {
    socketClient.emit(SYNC_STATUS, { shopId });
    socketClient.emit(SYNC_REGISTER_SHOP, { shopId });
  }, [shopId]);

  const syncTableUpdateCount = useAppSelector((state) =>
    syncTotalTableCount(state.shops.syncTableUpdateCount, ["Shops"])
  );

  useEffect(() => {
    dispatch(setShops(data?.getUsersShops));
  }, [data]);

  useEffect(() => {
    getAllShops();
  }, [syncTableUpdateCount]);

  const handleConnect = useCallback(() => {
    socketClient.emit(SYNC_REGISTER_SHOP, { shopId });
    socketClient.emit(SYNC_STATUS, { shopId });
  }, []);

  const handleStatusChange = useCallback((response: syncStatusProps) => {
    setSyncStatus(response);
    dispatch(getSyncStatus(response.running));
    if (response.more?.type === "tables-updated") {
      dispatch(increaseSyncCount(response.more.tableNames));
    }
  }, []);

  useEffect(() => {
    // const handleMessageReceived = (response: { type: Color; message: string }) => {
    //   showSnackbar(response.message, response.type);
    // };

    socketClient.on("connect", handleConnect);
    socketClient.on("reconnect", handleConnect);
    socketClient.on(SYNC_STATUS, handleStatusChange);
    // socketClient.on(SYNC_MESSAGE, handleMessageReceived);

    return () => {
      socketClient.removeListener(SYNC_STATUS, handleStatusChange);
      socketClient.removeListener("connect", handleConnect);
      socketClient.removeListener("reconnect", handleConnect);
      // socketClient.removeListener(SYNC_MESSAGE, handleMessageReceived);
    };
  }, [shopId]);

  useEffect(() => {
    socketClient.emit(SYNC_START, { shopId });
  }, [shopId]);

  return (
    <Container>
      <Sidebar startSync={startSync} />
      <LeftContainer>
        <Outlet />
      </LeftContainer>
    </Container>
  );
};

export default DashboardWrapper;
