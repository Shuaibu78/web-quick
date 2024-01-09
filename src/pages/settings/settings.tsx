import { FunctionComponent, useState } from "react";
import TopNav from "../../components/top-nav/top-nav";
// import UnlockAccount from "./modal/unlock-account";
import { useAppSelector } from "../../app/hooks";
// import { hasPermission } from "../../helper/comparisons";
// import { getUserPermissions } from "../../app/slices/roles";
// import printerIcon from "../../assets/Printer.svg";
// import PrinterSettingsPage from "./sub-page/printSettings";
// import { rpcClient } from "../../helper/rpcClient";
// import { toggleSnackbarOpen } from "../../app/slices/snacbar";
// import Tax from "./sub-page/tax";
import { SettingsContainer } from "./settingsComps.style";
import BusinessSettings from "./views/businessSettings";
import ProfileSettings from "./views/profileSettings";
import SecuritySettings from "./views/securitySettings";
import NotificationSettings from "./views/notificationSettings";

const Settings: FunctionComponent = () => {
  // const [showUnlockModal, setShowUnlockModal] = useState(false);

  // const { user: userInfo } = useAppSelector((state) => state);
  // const reduxSelector = useAppSelector((state) => state);
  // const userPermissions = useAppSelector(getUserPermissions);
  // const isMerchant = userInfo?.userId === reduxSelector?.shops?.currentShop?.userId;
  // const shouldManageShop = hasPermission("MANAGE_SHOP", userPermissions);
  const { topNavProp } = useAppSelector((state) => state.settings);

  // const initialView = isMerchant || shouldManageShop ? "PROFILE" : "LOCK";

  // const [view, setView] = useState<
  //   "PROFILE" | "BUSINESS" | "PRINT" | "LOCK" | "OFFLINE_ORDER" | "Tax"
  // >(initialView);

  const topNavList = [
    "Business Settings",
    "Profile Settings",
    "Security Settings",
    "Notifications",
    // "Privacy and Policy",
  ];

  const [navBarHeight, setNavBarHeight] = useState<number>();

  return (
    <div>
      <TopNav
        header="Settings"
        topNavList={topNavList}
        navList={topNavProp}
        setNavBarHeight={setNavBarHeight}
      />

      <SettingsContainer navBarHeight={navBarHeight}>
        {topNavProp === "Business Settings" ? <BusinessSettings /> : null}
        {topNavProp === "Profile Settings" ? <ProfileSettings /> : null}
        {topNavProp === "Security Settings" ? <SecuritySettings /> : null}
        {topNavProp === "Notifications" ? <NotificationSettings /> : null}
        {topNavProp === "Privacy and Policy" ? (
          <div>
            <h1>Notifications</h1>
          </div>
        ) : null}
      </SettingsContainer>

      {/* {showUnlockModal && <UnlockAccount setShowModal={setShowUnlockModal} />} */}
    </div>
  );
};

export default Settings;
