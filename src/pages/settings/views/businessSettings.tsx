import { BoxHeading, Divider, SettingsBox, SideBarLink } from "../settingsComps.style";
import BusinessDetails from "./settingsComponent/businessDetails";
import CheckoutOptions from "./settingsComponent/checkoutOptions";
import PrinterSettings from "./settingsComponent/printersettings";

import { useAppSelector } from "../../../app/hooks";
import { useDispatch } from "react-redux";
import { setBusinessSettingsProp } from "../../../app/slices/settings";
import Tax from "../sub-page/tax";
import { Left, Right } from "../../sales/style";
import { hasPermission } from "../../../helper/comparisons";
import { getUserPermissions } from "../../../app/slices/roles";
import ThemeSettings from "./settingsComponent/themeSettings";

const BusinessSettings = () => {
  const dispatch = useDispatch();
  const userPermissions = useAppSelector(getUserPermissions);
  const shouldEditBizSettings = hasPermission("MANAGE_SHOP", userPermissions);
  const { businessSettingsProp } = useAppSelector((state) => state.settings);

  const navItemList = [
    shouldEditBizSettings && "Business Details",
    // shouldEditBizSettings && "Checkout Options",
    // shouldEditBizSettings && "Product Categories",
    // shouldEditBizSettings && "Income Categories",
    // shouldEditBizSettings && "Expense Categories",
    // shouldEditBizSettings && "Shop Tables/Tags",
    // shouldEditBizSettings && "Table Scanner",
    shouldEditBizSettings && "Tax Settings",
    "Printer Settings",
    "Theme Settings",
  ].filter(Boolean);

  return (
    <div style={{ display: "flex" }}>
      <Left
        key="BussinessSettingsLeftPanel"
        style={{ display: "flex", rowGap: ".3rem", flexDirection: "column", width: "230px" }}
      >
        {navItemList.map((list) => (
          <SideBarLink
            active={list === businessSettingsProp}
            onClick={() => dispatch(setBusinessSettingsProp(list))}
            key={list as string}
          >
            {list}
          </SideBarLink>
        ))}
      </Left>
      <Divider />
      <Right key="BussinessSettingsRightPanel" style={{ width: "100%", maxWidth: "100%" }}>
        {businessSettingsProp === "Business Details" && (
          <SettingsBox overflow={true}>
            <BusinessDetails />
          </SettingsBox>
        )}
        {businessSettingsProp === "Checkout Options" && (
          <SettingsBox>
            <CheckoutOptions />
          </SettingsBox>
        )}
        {businessSettingsProp === "Product Categories" && (
          <SettingsBox>
            <BoxHeading>Product Categories</BoxHeading>
          </SettingsBox>
        )}
        {businessSettingsProp === "Income Categories" && (
          <SettingsBox>
            <BoxHeading>Income Categories</BoxHeading>
          </SettingsBox>
        )}
        {businessSettingsProp === "Expense Categories" && (
          <SettingsBox>
            <BoxHeading>Expense Categories</BoxHeading>
          </SettingsBox>
        )}
        {businessSettingsProp === "Shop Tables/Tags" && (
          <SettingsBox>
            <BoxHeading>Shop Tables/Tags</BoxHeading>
          </SettingsBox>
        )}
        {businessSettingsProp === "Table Scanner" && (
          <SettingsBox>
            <BoxHeading>Table Scanner</BoxHeading>
          </SettingsBox>
        )}
        {businessSettingsProp === "Tax Settings" && (
          <SettingsBox>
            <Tax />
          </SettingsBox>
        )}
        {businessSettingsProp === "Theme Settings" && (
          <SettingsBox>
            <ThemeSettings />
          </SettingsBox>
        )}
        {businessSettingsProp === "Printer Settings" && (
          <SettingsBox>
            <PrinterSettings />
          </SettingsBox>
        )}
      </Right>
    </div>
  );
};

export default BusinessSettings;
