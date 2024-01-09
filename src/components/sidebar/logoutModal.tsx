/* eslint-disable indent */
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Colors } from "../../GlobalStyles/theme";
import ShopAvatar from "../../assets/ShopAvatar.svg";
import { useNavigate } from "react-router-dom";
import { BoxHeading } from "../../pages/settings/settingsComps.style";
import { useAppSelector } from "../../app/hooks";
import { getUserPermissions } from "../../app/slices/roles";
import { getCurrentUser } from "../../app/slices/userInfo";
import { useDispatch } from "react-redux";
import { setTopNavProp } from "../../app/slices/settings";
import {
  DefualtManagerRoles,
  defaultCashierRoles,
  defaultSalesRoles,
} from "../../utils/defaultRoles.utils";
import _ from "lodash";

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
`;

const ListItem = styled.div<{ color?: string }>`
  width: 100%;
  height: 2.3rem;
  align-items: center;
  display: flex;
  padding-inline: 0.625rem;
  font-size: 0.9rem;
  color: ${({ color }) => color ?? Colors.blackLight};
  cursor: pointer;

  :hover {
    background-color: ${Colors.borderGreyColor};
  }
`;

interface StoreListProps {
  setShowLogoutModal: Function;
  setConfirmSignout?: Function;
}

const LogoutModal: React.FC<StoreListProps> = ({ setShowLogoutModal, setConfirmSignout }) => {
  const [currentUserRole, setCurrentUserRole] = useState<string>();
  // const [canSetPin, setCanSetPin] = useState<boolean>(false);
  // const [showWarn, setShowWarn] = useState<boolean>(false);

  const userRole = useAppSelector(getUserPermissions);
  const currentUser = useAppSelector(getCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const [getUserPinData] = useLazyQuery<{
  //   canSetUserPin: boolean;
  // }>(CAN_USER_SET_PIN, {
  //   fetchPolicy: "cache-and-network",
  //   onCompleted(data) {
  //     // setCanSetPin(data?.canSetUserPin);
  //   },
  //   onError(error) {
  //     dispatch(
  //       toggleSnackbarOpen({
  //         message: error?.message || error?.graphQLErrors[0]?.message,
  //         color: "DANGER",
  //       })
  //     );
  //   },
  // });

  useEffect(() => {
    const isManager = _.isEqual(userRole.permissions, DefualtManagerRoles.rolePermissions);
    const isCashier = _.isEqual(userRole.permissions, defaultCashierRoles.rolePermissions);
    const isSales = _.isEqual(userRole.permissions, defaultSalesRoles.rolePermissions);
    isManager
      ? setCurrentUserRole("Manager")
      : isSales
      ? setCurrentUserRole("Sales Person")
      : isCashier && setCurrentUserRole("Cashier");
  }, [userRole]);

  // useEffect(() => {
  //   getUserPinData();
  // }, []);

  // const handleLock = () => {
  //   if (canSetPin) {
  //     setShowWarn(true);
  //     return;
  //   }

  //   setShowLogoutModal(false);
  //   dispatch(showLockModal());
  //   dispatch(lock({ lock: true }));
  // };

  return (
    <Container>
      <Overlay onClick={() => setShowLogoutModal(false)} />
      <div
        style={{
          maxHeight: "15.625rem",
          position: "absolute",
          bottom: "52px",
          backgroundColor: "white",
          width: "15.625rem",
          left: "210px",
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
            left: "-1.25rem",
            bottom: "1.25rem",
            transform: "rotate(-90deg)",
          }}
        ></div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            columnGap: "1rem",
            marginBottom: "0.3125rem",
            padding: "0.9375rem 0.625rem 0 0.625rem",
          }}
        >
          <img src={ShopAvatar} alt="" />
          <BoxHeading>
            {currentUser.fullName}
            <p> {userRole.isShopOwner ? "Shop Owner" : currentUserRole}</p>
          </BoxHeading>
        </div>
        <ListItem
          onClick={() => {
            dispatch(setTopNavProp("Profile Settings"));
            navigate("/dashboard/settings");
            setShowLogoutModal(false);
          }}
        >
          My Profile
        </ListItem>
        {/* <ListItem
          onClick={() => {
            navigate("/dashboard/subscriptions");
            setShowLogoutModal(false);
          }}
        >
          My subscriptions
        </ListItem> */}
        {/* <ListItem>Help</ListItem> */}
        <ListItem
          color={Colors.red}
          onClick={() => {
            // handleLock();
            setConfirmSignout && setConfirmSignout(true);
          }}
        >
          Logout
        </ListItem>
      </div>

      {/* {showWarn && canSetPin && (
        <LockAccount closePreLockModal={closePreLockModal} setShowWarn={setShowWarn} />
      )} */}
    </Container>
  );
};

export default LogoutModal;
