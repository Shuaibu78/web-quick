/* eslint-disable no-debugger */
/* eslint-disable indent */
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import { useLazyQuery, useQuery } from "@apollo/client";
import logo from "../../assets/timart-logo.png";
import settingIcon from "../../assets/Setting.svg";
import LeaveShopIconRed from "../../assets/LockRed.svg";
import FigorrSmallLogo from "../../assets/figorr-small-logo.svg";
import LockIcon from "../../assets/Lock.svg";
import ChevRight from "../../assets/chevRight.svg";
import Diamond from "../../assets/Diamond.svg";
import {
  Container,
  LinkButton,
  LogoutBtn,
  Logo,
  SyncWrapper,
  SyncButton,
  AccountLockContainer,
  LinkContainer,
  ExclusivesButton,
} from "./style";
import Account from "../../assets/Account.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector, useCurrentShop } from "../../app/hooks";
import { getShops, setCurrentShop, setShops } from "../../app/slices/shops";
import { CAN_USER_SET_PIN, GET_USERS_WITH_PIN } from "../../schema/auth.schema";
import { getCurrentUser, setUserInfo } from "../../app/slices/userInfo";
import { syncStatusProps } from "../dashboard-wrapper/dashboard-wrapper";
import { VscSync, VscSyncIgnored } from "react-icons/vsc";
import { IconContext } from "react-icons";
import { convertToLocalDateTime } from "../../helper/date";
import { toggleSnackbarOpen } from "../../app/slices/snacbar";
import { getUserPermissions, setRole } from "../../app/slices/roles";
import { hasAnyPermission, syncTotalTableCount } from "../../helper/comparisons";
import { setSingleInventory } from "../../app/slices/inventory";
import { setIsEdit } from "../../app/slices/isEdit";
import {
  closePreLockModal,
  setNoPermissionModal,
  showLockModal,
  lock,
} from "../../app/slices/accountLock";
import { ModalContainer } from "../../pages/settings/style";
import UnlockAccount from "../unlockModal/unlockModal";
import { rpcClient } from "../../helper/rpcClient";
import { GET_ALL_SHOPS, GET_SHOP } from "../../schema/shops.schema";
import { CountryAttr } from "../../pages/settings/sub-page/business";
import { IShop, PushNotificationPayload } from "../../interfaces/shop.interface";
import {
  setFilterByDiscountSales,
  setFilterByRefundSales,
  setPaymentFilter,
  setProductFilterList,
  setProductIdFilterList,
  setReceiptNumber,
  setUserFilterList,
  setUserIdFilterList,
} from "../../app/slices/salesFilter";
import { socketClient } from "../../helper/socket";
import { SYNC_STATUS, isFigorr } from "../../utils/constants";
import { handleNewPushNotificationMessage } from "../../helper/inventory.helper";
import { askNotificationPermission } from "../../utils/firebase.utils";
import { Colors } from "../../GlobalStyles/theme";
import { Button, Flex, Span } from "../../GlobalStyles/CustomizableGlobal.style";
import Exclusives from "../Exclusives/Exclusives";
import {
  exclusiveItems,
  settingsRoles,
  sidebarDetails,
  SidebarDetailsType,
  ExclusiveItemsType,
} from "../Exclusives/sidebarItems";
import LogoutModal from "./logoutModal";
import ConfirmAction from "../modal/confirmAction";
import { setBusinessSettingsProp, setTopNavProp } from "../../app/slices/settings";
import { setSession } from "../../app/slices/session";
import LockAccount from "./lockAccount";
import { ISubscriptionInitial, PackageData } from "../../interfaces/subscription.interface";
import { GET_ALL_USER_SUBSCRIPTIONS, GET_FEATURE_COUNT, GET_SUBSCRIBTION_PACKAGES } from "../../schema/subscription.schema";
import { setCurrentSubscriptions, setFeatureCount, setSubscriptionPackages } from "../../app/slices/subscriptionslice";
import { toggle } from "../../app/slices/sidebar";
import { isDesktop } from "../../utils/helper.utils";

interface ISidebar {
  startSync: () => void;
  syncStatus?: syncStatusProps;
}

const Sidebar: FunctionComponent<ISidebar> = ({ startSync }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentShop = useCurrentShop();
  const shopId = currentShop?.shopId;
  const {
    sidebar,
    user: userInfo,
    accountLock,
    shops,
    subscriptions,
  } = useAppSelector((state) => state);
  const userPermissions = useAppSelector(getUserPermissions);

  const isMerchant = userInfo?.userId === shops?.currentShop?.userId;
  const currentUser = useAppSelector(getCurrentUser);
  const [isChevHovered, setIsChevHovered] = useState<boolean>(false);

  const [openExclusives, setOpenExclusives] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [confirmSignout, setConfirmSignout] = useState(false);
  const [activeItems, setActiveItems] = useState<ExclusiveItemsType[]>([]);
  const [inactiveItems, setInactiveItems] = useState<ExclusiveItemsType[]>([]);
  const [syncStatus, setSyncStatus] = useState<syncStatusProps>({
    running: false,
  });
  const [ableToSetPin, setAbleToSetPin] = useState<boolean>(false);
  const [showWarn, setShowWarn] = useState<boolean>(false);
  const currentUserSubscriptions = subscriptions.subscriptions[0] || [];

  const { primaryColor, tabBg, blackLight, secondaryColor } = Colors;
  const dotArray = ["#FFBE62", "#FF0000", "#1976D2", "#219653"];
  const shopList = useAppSelector(getShops);

  const syncTableUpdateCount = useAppSelector((state) =>
    syncTotalTableCount(state.shops.syncTableUpdateCount, [
      "UserSubscription",
      "UserSubscriptionAddon",
      "Inventory",
      "Supplies",
      "TrackableItems",
      "Customer",
      "CustomerTransaction",
      "InventoryQuantity",
    ])
  );

  const [refetchFeatureCount] = useLazyQuery<{
    getFeatureCount: { inventoriesCount: number; debtCount: number };
  }>(GET_FEATURE_COUNT, {
    variables: {
      shopId: currentShop?.shopId,
    },
    fetchPolicy: "cache-and-network",
    onCompleted(arrData) {
      dispatch(setFeatureCount(arrData?.getFeatureCount ?? {}));
    },
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const [fetchSubscriptionPackage] = useLazyQuery<{
    getSubscriptionPackages: PackageData[];
  }>(GET_SUBSCRIBTION_PACKAGES, {
    fetchPolicy: "cache-and-network",
    onCompleted(arrData) {
      dispatch(setSubscriptionPackages(arrData?.getSubscriptionPackages ?? []));
    },
    onError: (error) => {
      dispatch(toggleSnackbarOpen(error?.message || error?.graphQLErrors[0]?.message));
    },
  });

  const [refetchSubscriptions] = useLazyQuery<{
    getAllUserSubscriptions: [ISubscriptionInitial];
  }>(GET_ALL_USER_SUBSCRIPTIONS, {
    variables: {
      userId: currentShop.userId,
    },
    fetchPolicy: "network-only",
    onCompleted(result) {
      dispatch(setCurrentSubscriptions(result?.getAllUserSubscriptions));
    },
    onError: (error) => {
      dispatch(
        toggleSnackbarOpen({
          message: error?.message || error?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    },
  });

  useEffect(() => {
    refetchFeatureCount();
    fetchSubscriptionPackage();
    refetchSubscriptions();
  }, [syncTableUpdateCount]);

  useEffect(() => {
    if (currentShop) {
      localStorage.setItem("currencyCode", currentShop?.currencyCode as string);
    }
  }, [currentShop]);

  useQuery<{
    getShop: {
      countries: CountryAttr[];
      result: IShop;
    };
  }>(GET_SHOP, {
    variables: {
      shopId: currentShop?.shopId,
    },
    skip: !currentShop?.shopId,
    onCompleted(response) {
      if (response?.getShop?.result) {
        dispatch(setCurrentShop(response?.getShop?.result));
      }
    },
    onError(error) {
      console.log(error?.message || error?.graphQLErrors[0]?.message);
    },
  });

  const { data: usersWithPin, refetch } = useQuery<{
    getAuthenticatedUsersWithPin: { userId: string; fullName: string }[];
  }>(GET_USERS_WITH_PIN, {
    fetchPolicy: "cache-and-network",
    onError: (error) => {
      dispatch(
        toggleSnackbarOpen({
          message: error?.message || error?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    },
  });

  useEffect(() => {
    askNotificationPermission();
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("ActiveTExclusive");
    const deduceActiveData = (activeData: ExclusiveItemsType[]) => {
      const activeIds: number[] = activeData.map((item) => item.id);
      return exclusiveItems.filter((item: ExclusiveItemsType) => !activeIds.includes(item.id));
    };

    if (data) {
      setActiveItems(JSON.parse(data));
      setInactiveItems(deduceActiveData(JSON.parse(data)));
    } else {
      setActiveItems(exclusiveItems.slice(0, 4));
      setInactiveItems(deduceActiveData(exclusiveItems.slice(0, 4)));
    }
  }, []);

  function handleClose(e: any) {
    const modal = document.querySelector("#modal");
    if (e.target.isEqualNode(modal)) setOpenExclusives(false);
  }

  const [getUserPinData] = useLazyQuery<{
    canSetUserPin: boolean;
  }>(CAN_USER_SET_PIN, {
    fetchPolicy: "network-only",
    onCompleted(data) {
      setAbleToSetPin(data?.canSetUserPin);
    },
    onError(error) {
      dispatch(
        toggleSnackbarOpen({
          message: error?.message || error?.graphQLErrors[0]?.message,
          color: "DANGER",
        })
      );
    },
  });

  useEffect(() => {
    getUserPinData();
  }, []);

  const handleProfileCardClick = () => {
    setShowLogoutModal(true);
  };

  const handleShiftEnd = () => {
    getUserPinData();
    if (ableToSetPin) {
      dispatch(showLockModal());
      dispatch(lock({ lock: true }));
    } else {
      setShowWarn(true);
    }
  };

  const handleLogout = async () => {
    try {
      try {
        await rpcClient.request("logoutUser", { userId: userInfo?.userId });
        refetch();
      } catch (error) {
        console.log(error);
      }

      if (
        !ableToSetPin ||
        (usersWithPin && usersWithPin?.getAuthenticatedUsersWithPin?.length <= 1)
      ) {
        dispatch(setUserInfo({}));
        dispatch(setSession({}));
        navigate("/login");
        localStorage.clear();
      } else {
        dispatch(showLockModal());
        dispatch(setUserInfo({}));
      }

      dispatch(setShops([]));
      dispatch(setCurrentShop({}));
      dispatch(setRole({}));
    } catch (error) {
      console.error("Error logging out", error);
      localStorage.clear();
      navigate("/login");
    }
  };

  const handleStatusChange = useCallback((response: syncStatusProps) => {
    setSyncStatus(response);
  }, []);

  useEffect(() => {
    if (isDesktop()) {
      socketClient.on(SYNC_STATUS, handleStatusChange);

      socketClient.on("push-notification", (res: PushNotificationPayload) =>
        handleNewPushNotificationMessage(res, shopId as string, navigate)
      );
    }

    return () => socketClient.removeListener(SYNC_STATUS, handleStatusChange);
  }, [shopId]);

  useEffect(() => {
    socketClient.emit(SYNC_STATUS, { shopId });
  }, [shopId]);

  const handleClearFilter = () => {
    dispatch(setPaymentFilter([]));
    dispatch(setProductFilterList([]));
    dispatch(setProductIdFilterList([]));
    dispatch(setUserFilterList([]));
    dispatch(setUserIdFilterList([]));
    dispatch(setReceiptNumber(""));
    dispatch(setFilterByDiscountSales(false));
    dispatch(setFilterByRefundSales(false));
  };

  const handleClick = (path: string, shouldAccess: boolean) => {
    if (path === "#" || !shouldAccess) {
      !shouldAccess &&
        dispatch(
          toggleSnackbarOpen({
            message: "Access denied, Contact your manager",
            color: "INFO",
          })
        );
      dispatch(setNoPermissionModal(true));
      return;
    }
    if (path.includes("?route=printer")) {
      dispatch(setTopNavProp("Business Settings"));
      dispatch(setBusinessSettingsProp("Printer Settings"));
    }
    navigate(`/dashboard${path}`);
    handleClearFilter();
  };

  const accessSettings = hasAnyPermission(settingsRoles, userPermissions);

  const closeSidebar = () => dispatch(toggle());

  return (
    <Container
      show={sidebar}
      onClick={() => {
        dispatch(setSingleInventory({}));
        dispatch(setIsEdit(false));
      }}
    >
      <Logo>
        <img src={isFigorr ? FigorrSmallLogo : logo} alt="" />
      </Logo>
      {isDesktop() && (
        <SyncWrapper>
          <SyncButton onClick={() => startSync()}>
            <IconContext.Provider value={{ color: Colors.secondaryColor, size: "1.5em" }}>
              <>{!syncStatus.running ? <VscSync /> : <VscSyncIgnored />}</>
            </IconContext.Provider>
          </SyncButton>
          <div style={{ color: Colors.secondaryColor }}>
            {!syncStatus.running && syncStatus.totalRecordsToPush ? (
              <>
                <span style={{ fontWeight: 700 }}>
                  {syncStatus.totalRecordsToPush === 0 ? "" : syncStatus.totalRecordsToPush}
                </span>{" "}
                record(s) yet to be uploaded to server
              </>
            ) : (
              ""
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
            {syncStatus.running ? (
              <Flex>
                <div style={{ marginLeft: "0.5rem" }}>{`${Math.round(
                  syncStatus.progress ?? 0
                )}%`}</div>
                <div style={{ marginLeft: 2 }}>
                  {syncStatus.totalRecordsToPush
                    ? `${syncStatus.totalRecordsToPush} Uploading/Syncing Records...`
                    : " Getting Updates..."}
                </div>
              </Flex>
            ) : (
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                  marginLeft: "0.5rem",
                  color: Colors.primaryColor,
                }}
              >
                Last Updated:{" "}
                {syncStatus.lastSyncDate
                  ? convertToLocalDateTime(new Date(syncStatus.lastSyncDate), "D/M/YYYY h:mA")
                  : "--"}
              </div>
            )}
          </div>
        </SyncWrapper>
      )}

      {sidebarDetails.map(
        ({ path, allowedRoles, activeIcon, name, icon }: SidebarDetailsType, index: number) => {
          const shouldAccess = hasAnyPermission(allowedRoles, userPermissions) || isMerchant;

          return location.pathname === `/dashboard${path}` ||
            (location.pathname.includes(path) && path) ? (
            <LinkButton
              style={{
                display:
                  (currentUserSubscriptions?.packageNumber < 3 && name === "Offline Orders") ||
                    (isFigorr && name === "Offline Orders")
                    ? "none"
                    : "flex",
              }}
              access={shouldAccess}
              backgroundColor={Colors.tabBg}
              textColor={Colors.primaryColor}
              fontWeight={600}
              key={index}
                onClick={() => { handleClick(path, shouldAccess); closeSidebar(); }}
            >
              <img id="icon" src={activeIcon} alt="" />
              <p>{name}</p>
              <img id="lock" src={LockIcon} alt="" />
            </LinkButton>
          ) : (
            <LinkButton
              style={{
                display:
                  currentUserSubscriptions?.packageNumber < 3 && name === "Offline Orders"
                    ? "none"
                    : "flex",
              }}
              access={shouldAccess}
              key={index}
                onClick={() => { handleClick(path, shouldAccess); closeSidebar(); }}
            >
              <img id="icon" src={icon} alt="" />
              <p>{name}</p>
              <img id="lock" src={LockIcon} alt="" />
            </LinkButton>
          );
        }
      )}

      <Flex alignItems="center" justifyContent="space-between" margin="0 0 0.3125 0">
        <Span color="#9EA8B7" fontSize=".625rem">
          Timart Exclusives
        </Span>
        <Span
          color={isFigorr ? secondaryColor : primaryColor}
          fontSize=".625rem"
          style={{ cursor: "pointer" }}
          onClick={() => setOpenExclusives(true)}
        >
          See all
        </Span>
      </Flex>
      <LinkContainer>
        {activeItems.map(({ path, allowedRoles, name }, index) => {
          const shouldAccess = hasAnyPermission(allowedRoles, userPermissions) || isMerchant;

          return (
            <ExclusivesButton
              access={shouldAccess}
              indicator={dotArray[index]}
              textColor={blackLight}
              key={index}
              onClick={() => handleClick(path, shouldAccess)}
              style={{
                display:
                  (currentUserSubscriptions?.packageNumber >= 3 && name === "Offline Order") ||
                    (isFigorr && name === "Offline Order")
                    ? "none"
                    : "flex",
              }}
            >
              <Flex fontSize="0.8125rem" alignItems="center" gap=".">
                <div className="indicator"></div>
                <span>{name}</span>
              </Flex>
              <img id="lock" src={LockIcon} alt="" />
              <img id="chev" src={ChevRight} alt="" />
            </ExclusivesButton>
          );
        })}
        <Button
          borderRadius=".5rem"
          padding=".3125rem .625rem"
          backgroundColor="transparent"
          type="button"
          color={isFigorr ? secondaryColor : primaryColor}
          borderColor={isFigorr ? secondaryColor : primaryColor}
          margin="0.5rem 0"
          fontSize="0.8rem"
          height="1.875"
          width="100%"
          notFilled={true}
          onClick={() => setOpenExclusives(true)}
        >
          <span style={{ marginRight: "0.5rem" }}>+</span>
          Add Shortcuts
        </Button>

        <Button
          padding=".3125 1rem"
          backgroundColor="transparent"
          type="button"
          color={blackLight}
          margin="1rem 0"
          height="1.875rem"
          width="100%"
          justifyContent="flex-start"
          notFilled={true}
          bgHover={tabBg}
          fontSize="0.8rem"
          hoverColor={blackLight}
          onClick={() => (accessSettings ? navigate("/dashboard/settings") : null)}
        >
          <img style={{ width: ".9375rem", marginRight: "0.8rem" }} src={settingIcon} alt="" />
          Business Settings
          {!accessSettings && <img style={{ marginLeft: ".625rem" }} src={LockIcon} alt="" />}
        </Button>

        {/* <Button
          padding=".3125rem .625rem"
          backgroundColor="transparent"
          type="button"
          color={blackLight}
          margin="1rem 0 0 0"
          height=".1875"
          width="100%"
          justifyContent="flex-start"
          notFilled={true}
          bgHover={tabBg}
          hoverColor={blackLight}
        >
          <img style={{ width: ".9375", marginRight: "0.8rem" }} src={help} alt="" />
          Help
        </Button> */}

        <button id="upgrade" onClick={() => navigate("/dashboard/subscriptions")}>
          <img src={Diamond} alt="" />
          Upgrade Usage
        </button>
      </LinkContainer>
      <Flex
        bg="#f4f6f9"
        borderRadius=".75rem"
        padding=".625rem"
        height="3.4375rem"
        minHeight="3.4375rem"
        justifyContent="space-between"
        alignItems="center"
        margin="1rem 0 0 0"
        className="logout"
        cursor="pointer"
        onClick={handleProfileCardClick}
        onMouseEnter={() => setIsChevHovered(true)}
        onMouseLeave={() => setIsChevHovered(false)}
      >
        <Flex
          height="100%"
          alignItems="flex-start"
          justifyContent="space-between"
          direction="column"
          gap="0.5rem"
          bg="transparent"
        >
          <Flex
            height="100%"
            alignItems="center"
            justifyContent="flex-start"
            gap="0.5rem"
            bg="transparent"
          >
            <img src={Account} alt="" />
            <Flex height="fit-content" direction="column" cursor="pointer" bg="transparent" hover>
              <Span color={blackLight} fontSize="0.9rem">
                {currentUser.firstName}
              </Span>
              <Span color={Colors.grey} fontSize="0.7rem">
                View Profile
              </Span>
            </Flex>
          </Flex>
        </Flex>
        <img
          src={ChevRight}
          alt="chevron right icon"
          style={{ scale: isChevHovered ? "1.2" : "1", height: ".9rem" }}
        />
      </Flex>
      <Flex className="end-shift" style={{ paddingLeft: "1rem" }}>
        <LogoutBtn id="logoutBtn" onClick={handleShiftEnd}>
          <img src={LeaveShopIconRed} alt="Lock shop icon" />
          <p style={{ fontWeight: "500" }}>Lock/ End Shift</p>
        </LogoutBtn>
      </Flex>
      {showLogoutModal && (
        <LogoutModal
          setConfirmSignout={setConfirmSignout}
          setShowLogoutModal={setShowLogoutModal}
        />
      )}
      {showWarn && !ableToSetPin ? (
        <LockAccount closePreLockModal={closePreLockModal} setShowWarn={setShowWarn} />
      ) : null}
      {confirmSignout && (
        <ConfirmAction
          action="Logout"
          actionText="Are you sure you want to logout?"
          setConfirmSignout={setConfirmSignout}
          doAction={handleLogout}
        />
      )}

      {accountLock?.isLockModalActive && (
        <ModalContainer color="#F4F6F9">
          <AccountLockContainer>
            <UnlockAccount />
          </AccountLockContainer>
        </ModalContainer>
      )}

      {openExclusives && (
        <ModalContainer id="modal" onClick={handleClose}>
          <Exclusives
            setOpenExclusives={setOpenExclusives}
            setActiveItems={setActiveItems}
            activeItems={activeItems}
            setInactiveItems={setInactiveItems}
            inactiveItems={inactiveItems}
          />
        </ModalContainer>
      )}
    </Container>
  );
};

export default Sidebar;
